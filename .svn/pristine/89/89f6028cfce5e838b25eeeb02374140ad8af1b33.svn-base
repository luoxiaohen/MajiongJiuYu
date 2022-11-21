// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { HuTypeEnum } from "../../proto/TableMsgDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import OverHandCardItem from "../over/OverHandCardItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerWinRecordItem extends UIBase {

    @property(OverHandCardItem)
    private overHandCardItem:OverHandCardItem=null;
    private player_head_sprite:cc.Sprite;
    private buy_horse_sprite_1:cc.Sprite;
    private buy_horse_sprite_2:cc.Sprite;
    private zhuang_spirte:cc.Sprite;
    private game_piao:cc.Node;
    private player_name_label:cc.Label;
    private win_type_label:cc.Label;
    private paixing_label:cc.Label;
    private player_score_label:cc.Label;

    private paipu_hu_sprite:cc.Sprite;
    onLoad () {
        this.player_head_sprite=this.node.getChildByName("player_head_sprite").getComponent(cc.Sprite);
        this.buy_horse_sprite_1=this.node.getChildByName("buy_horse_sprite_1").getComponent(cc.Sprite);
        this.buy_horse_sprite_2=this.node.getChildByName("buy_horse_sprite_2").getComponent(cc.Sprite);
        this.paipu_hu_sprite=this.node.getChildByName("paipu_hu_sprite").getComponent(cc.Sprite);
        this.zhuang_spirte=this.node.getChildByName("zhuang_sprite").getComponent(cc.Sprite);
        this.game_piao=this.node.getChildByName("game_piao");
        this.player_name_label=this.node.getChildByName("player_name_label").getComponent(cc.Label);
        this.win_type_label=this.node.getChildByName("win_type_label").getComponent(cc.Label);
        this.paixing_label=this.node.getChildByName("paixing_label").getComponent(cc.Label);
        this.player_score_label=this.node.getChildByName("player_score_label").getComponent(cc.Label);
    }

    start () {

    }

    private huType:number=0;
    initeValue(data:any=null,index:number=0):void{
        this.overHandCardItem.setNewData([],[11,12,15,22],26,0.4);
        this.player_name_label.string="name_ "+index;
        if(!data){
            return;
        }
        Global.CCHelper.updateSpriteFrame(data.player_head_url,this.player_head_sprite);
        this.buy_horse_sprite_1.node.active=data.horseNum==1;
        this.buy_horse_sprite_2.node.active=data.horseNum==2;
        this.zhuang_spirte.node.active=data.isSelfZhuang;
        this.game_piao.active=data.isPiao;
        this.player_name_label.string=data.playerName;
        this.win_type_label.string=data.winType;
        this.paixing_label.string=this.getAllHuStr(data.huType);
        this.player_score_label.string=data.score;
        this.huType=data.huType;
        this.showHuImage();
    }

    private getAllHuStr(code : HuTypeEnum):string{
		let str : string = "";
		switch(code){
			case HuTypeEnum.PingHu : 
				str = "平胡";
			break;
			case HuTypeEnum.DuiDuiHu : 
				str = "对对胡";
			break;
			case HuTypeEnum.QingYiSe : 
				str = "清一色";
			break;
			case HuTypeEnum.QiDui : 
				str = "七对";
			break;
			case HuTypeEnum.LongQiDui : 
				str = "龙七对";
			break;
			case HuTypeEnum.JinGouDiao : 
				str = "金钩钓";
			break;
			case HuTypeEnum.YaoJiu : 
				str = "幺九";
			break;
			case HuTypeEnum.JiangDui : 
				str = "将对";
			break;
		}
		return str + ",";
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
        Global.CCHelper.updateSpriteFrame(this.paipu_hu_sprite, source);
    }
    // update (dt) {}
}
