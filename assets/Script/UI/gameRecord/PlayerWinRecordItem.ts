// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameInfo from "../../Game/info/GameInfo";
import { PlayerInfo } from "../../proto/LobbyMsgDef";
import { FanTypeEnum, GameResultInfo, GameScoreInfo, GangTypeEnum, HuTypeEnum, ScoreEventInfo, ScoreTypeEnum } from "../../proto/TableMsgDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import { PlayerWinRecodItemData } from "../../utils/InterfaceHelp";
import OverHandCardItem from "../over/OverHandCardItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerWinRecordItem extends UIBase {

    @property(OverHandCardItem)
    private overHandCardItem:OverHandCardItem=null;
    private player_head_sprite:cc.Sprite;
    private buy_horse_sprite:cc.Sprite;
    private zhuang_spirte:cc.Sprite;
    private game_piao:cc.Node;
    private player_name_label:cc.Label;
    private win_type_spite:cc.Sprite;
    private paixing_label:cc.Label;
    private player_score_label:cc.Label;

    private paipu_hu_sprite:cc.Sprite;
    onLoad () {
        this.player_head_sprite=this.node.getChildByName("player_head_sprite").getComponent(cc.Sprite);
        this.buy_horse_sprite=this.node.getChildByName("buy_horse_sprite").getComponent(cc.Sprite);
        this.paipu_hu_sprite=this.node.getChildByName("paipu_hu_sprite").getComponent(cc.Sprite);
        this.zhuang_spirte=this.node.getChildByName("zhuang_sprite").getComponent(cc.Sprite);
        this.game_piao=this.node.getChildByName("game_piao");
        this.player_name_label=this.node.getChildByName("player_name_label").getComponent(cc.Label);
        this.win_type_spite=this.node.getChildByName("win_type_spite").getComponent(cc.Sprite);
        this.paixing_label=this.node.getChildByName("paixing_label").getComponent(cc.Label);
        this.player_score_label=this.node.getChildByName("player_score_label").getComponent(cc.Label);
    }

    start () {

    }
    private baseSpritePath="gameRecord/resource/";

    private ziMoHuSpritePath="paipu_zomohu";
    private jiePaoHuSpritePath="paipu_jiepaohu";
    private gangShangHuaSpritePath="paipu_gshua";
    private gangShangPaoSpritePath="paipu_gspao";
    private qiangGangHuSpritePath="paipu_qghu";

    private huType:number=0;
    initeValue(data:PlayerWinRecodItemData=null):void{
        if(!data){
            return;
        }
        //smallOver/resource/game_jstouxiang2
        // Global.CCHelper.updateSpriteFrame(data.playerInfo.face,this.player_head_sprite);
        Global.CCHelper.updateSpriteFrame("smallOver/resource/game_jstouxiang2",this.player_head_sprite);
        let isHorse=data.horseNum>=0;
        this.buy_horse_sprite.node.active=isHorse;
		if(isHorse&&data.horseNum<=1){
			Global.CCHelper.updateSpriteFrame("gameRecord/resource/"+"paipu_ma"+(data.horseNum+1),this.buy_horse_sprite);
		}
        this.zhuang_spirte.node.active=data.isZhuang;
        this.game_piao.active=data.isPaio;
        this.player_name_label.string=data.playerInfo.nike;
		this.win_type_spite.node.active=true;
		// 0=平湖，1=自摸；2=杠上花；3=杠上炮；4=抢杠胡
		let str="";
        if(data.winType==undefined){
            this.win_type_spite.node.active=false;
        }else if(data.winType==0){
			str=this.baseSpritePath+this.jiePaoHuSpritePath;
		}else if(data.winType==1){
			str=this.baseSpritePath+this.ziMoHuSpritePath;
		}else if(data.winType==2){
			str=this.baseSpritePath+this.gangShangHuaSpritePath;
        }else if(data.winType==3){
			str=this.baseSpritePath+this.gangShangPaoSpritePath;
		}else if(data.winType===4){
			str=this.baseSpritePath+this.qiangGangHuSpritePath;
		}
		if(str!=""){
			Global.CCHelper.updateSpriteFrame(str,this.win_type_spite);
		}
      
        let paxingStr="";
        this.paixing_label.string=paxingStr;
        for(let item of data.scoreEventInfo){
            let str=this.getGangStr(item);
            if(str!=""&&!paxingStr.includes(str)){
                paxingStr+=str;
            }
            let str_1=this.getFanStr(item);
            if(str_1!=""&&!paxingStr.includes(str_1)){
                paxingStr+=str_1;
            }
        }
        this.paixing_label.string=paxingStr;
        Global.CCHelper.setLabelColorByValue(this.player_score_label,data.scoreCount);
        this.huType=data.huType;
        this.showHuImage();
        this.showMyHand(data.resultInfo,data.huCard);
        this.overHandCardItem.setNewData(data.resultInfo.lstPuts,data.resultInfo.lstMajs,data.huCard,0.3);
    }
 

    private getGangStr(scoreEventInfo:ScoreEventInfo):string{
		let str : string = "";
		if(scoreEventInfo.huGangTypes){
			if(scoreEventInfo.scoreType == ScoreTypeEnum.eGang || scoreEventInfo.scoreType == ScoreTypeEnum.eBeiGang){
				for(let i = 0 ; i < scoreEventInfo.huGangTypes.length ; i++){
					str += Global.Utils.getAllHuStr(scoreEventInfo.huGangTypes[i]);
				}
			}else{
				for(let i = 0 ; i < scoreEventInfo.huGangTypes.length ; i++){
					str += Global.Utils.getAllGangStr(scoreEventInfo.huGangTypes[i]);
				}
			}

		}
		return str;
	}
    private getFanStr(info:ScoreEventInfo):string{
		let str : string = "";
		if(info.fanTypes){
			for(let i = 0 ; i < info.fanTypes.length ; i++){
				str += Global.Utils.getAllFanStr(info.fanTypes[i],info);
			}
		}
		return str;
	}


    private showHuImage(){
        if(this.huType == -1){
            this.paipu_hu_sprite.node.active = false;
            return;
        }
        this.paipu_hu_sprite.node.active = true;
        let source : string = "smallOver/resource/game_hu";
        if(this.huType == 0){
            source = "smallOver/resource/game_hu";
        }
        if(this.huType == 1){
            source = "smallOver/resource/game_hu2";
        }
        if(this.huType == 2){
            source = "smallOver/resource/game_hu3";
        }
        Global.CCHelper.updateSpriteFrame(source,this.paipu_hu_sprite);
    }
    // update (dt) {}
    private showMyHand(resultInfo : GameResultInfo,huCard:number){
        this.overHandCardItem.setNewData(resultInfo.lstPuts , resultInfo.lstMajs , huCard);
    }
}
