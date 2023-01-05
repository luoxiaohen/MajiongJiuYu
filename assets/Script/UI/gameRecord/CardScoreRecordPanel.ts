// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventType from "../../event/EventType";
import GameInfo from "../../Game/info/GameInfo";
import { PlayerInfo } from "../../proto/LobbyMsgDef";
import { GameResultInfo, GameScoreInfo, ScoreEventInfo, SitInfo } from "../../proto/TableMsgDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import { OverBuyHorseInfoData, PlayerWinRecodItemData } from "../../utils/InterfaceHelp";
import PersonDataHelp from "../../utils/PersonDataHelp";
import BuyHorsePlayerInfo from "./BuyHorsePlayerInfo";
import PlayerWinRecordItem from "./PlayerWinRecordItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CardScoreRecordPanel extends UIBase {

    @property(cc.Node)
    player_info_content: cc.Node = null;

    @property(cc.Node)
    buyhorse_info_content: cc.Node = null;

    private playerWinRecordPrefab:cc.Prefab;
    private buyHosePlayerPrefab:cc.Prefab;

    @property(cc.Node)
    private horseTitle:cc.Node=null;
    @property(cc.Node)
    private nodata_tip:cc.Node=null;
    @property(cc.Label)
    private time_label_1:cc.Label=null;
    @property(cc.Label)
    private time_label_2:cc.Label=null;
    @property(cc.Sprite)
    private game_info_sprite:cc.Sprite=null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.playerWinRecordPrefab=Global.Utils.getPreFabBySource("gameRecord/prefab/PlayerWinRecordItem");
        this.buyHosePlayerPrefab=Global.Utils.getPreFabBySource("gameRecord/prefab/BuyHorsePlayerInfo");
    }

    start () {

    }
    private playerInfoArr:PlayerWinRecordItem[]=[];
    private buyhorseInfoArr:BuyHorsePlayerInfo[]=[];

    private baseSpritePath="gameRecord/resource/";
    private baoZiSpritePath="paipu_baozi";
    private shuangBaoSpritePath="paipu_shuangbao";

    initeValue(nowPage:number=0):void{
        for(let item of this.playerInfoArr){
            item.disTory();
        }
        for(let item of this.buyhorseInfoArr){
            item.disTory();
        }
        this.playerInfoArr=[];
        this.buyhorseInfoArr=[];
        let realTimePreData=GameInfo.ins.realTimePreformanceData;
        let handInfo=realTimePreData[nowPage];
        this.nodata_tip.active=!handInfo;
        if(!handInfo){
            this.time_label_1.string="";
            this.time_label_2.string="";
            this.game_info_sprite.node.active=false;
            this.buyhorse_info_content.active=false;
            this.horseTitle.active=false;
            return;
        }
        this.game_info_sprite.node.active=true;

        if(handInfo.baoziNum==1){
            Global.CCHelper.updateSpriteFrame(this.baseSpritePath+this.baoZiSpritePath,this.game_info_sprite);
        }else if(handInfo.baoziNum==2) {
            Global.CCHelper.updateSpriteFrame(this.baseSpritePath+this.shuangBaoSpritePath,this.game_info_sprite);
        }else{
            this.game_info_sprite.node.active=false;
        }
    
        let gameResult=handInfo.gameResultArr;
        let playerDataArr=gameResult;
        playerDataArr.sort((a,b)=>{
            return a.sitNum-b.sitNum;
        })
        for(let index=0;index<playerDataArr.length;index++){
            let sitNum=playerDataArr[index].sitNum;
            if(sitNum>=4){
                continue;
            }
            let obj=cc.instantiate(this.playerWinRecordPrefab);
            this.player_info_content.addChild(obj);
            let itemComp=obj.getComponent(PlayerWinRecordItem);

            let itemDataInfo=new PlayerWinRecodItemData();
           
            itemDataInfo.playerInfo=Global.Utils.getPlayerInfo(handInfo.sitInfoArr,sitNum);
            itemDataInfo.isZhuang=sitNum==handInfo.nowBookMakerSit;
            itemDataInfo.isPaio=sitNum==handInfo.piaoSitNum;
            let resultInfo=this.getGameResultInfo(gameResult,sitNum);
            itemDataInfo.huType=resultInfo.state==2?resultInfo.huNum:-1;
            itemDataInfo.scoreCount=resultInfo.score;
            itemDataInfo.resultInfo=resultInfo;
            itemDataInfo.huCard=0;
            if(handInfo.hupaiArr){
                itemDataInfo.huCard=handInfo.hupaiArr[sitNum];
            }
            itemDataInfo.winType=undefined;
            if(handInfo.zimoTypeArr){
                itemDataInfo.winType=handInfo.zimoTypeArr[sitNum];
            }
            let scoreInfoArr: Array<ScoreEventInfo> = [];
            for (let i = 0; i < handInfo.gameSoreArr.length; i++) {
                if (handInfo.gameSoreArr[i].sitNum == sitNum) {
                    scoreInfoArr =handInfo.gameSoreArr[i].rcd;
                }
            }
            itemDataInfo.horseNum=-1;
            let horseData=PersonDataHelp.ins.getHorseData(gameResult[4],gameResult[5],handInfo.curHand);
            for(let item of horseData){
                if(item.sitNum==sitNum){
                    itemDataInfo.horseNum=item.horesNum
                }
            }
            itemDataInfo.scoreEventInfo=scoreInfoArr;
            this.playerInfoArr.push(itemComp);
            itemComp.initeValue(itemDataInfo);
        }
        let horseData=PersonDataHelp.ins.getHorseData(gameResult[4],gameResult[5],handInfo.curHand);
        this.horseTitle.active=horseData.length>0;
        this.buyhorse_info_content.active=horseData.length>0;
        for(let index=0;index<horseData.length;index++){
            let obj=cc.instantiate(this.buyHosePlayerPrefab);
            this.buyhorse_info_content.addChild(obj);
            let itemComp=obj.getComponent(BuyHorsePlayerInfo);
            itemComp.initeValue(horseData[index],horseData[index].playerInfo);
            this.buyhorseInfoArr.push(itemComp);
        }
        this.time_label_1.string=Global.Utils.timestampToTime(handInfo.finishTime,0);
        this.time_label_2.string=Global.Utils.timestampToTime(handInfo.finishTime,1);
    }


    private getGameResultInfo(results:GameResultInfo[],sit:number):GameResultInfo{
		for(let i = 0 ; i <results.length ; i++){
			if(results[i].sitNum == sit){
				return results[i];
			}
		}
	}
    private getGameScoreEventInfo(scores:GameScoreInfo[],sitNum:number):ScoreEventInfo[]{
        let arr=[];
        for(let item of scores){
            if(item.sitNum==sitNum){
                return item.rcd;
            }
        }
        return arr;
    }


    // update (dt) {}
}
