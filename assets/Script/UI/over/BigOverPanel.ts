// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BigOverTypeEnum, GameRuleTypeEnum } from "../../enum/EnumManager";
import EventType from "../../event/EventType";
import GameInfo from "../../Game/info/GameInfo";
import UserInfo from "../../Game/info/UserInfo";
import { MainManager } from "../../MainManager";
import { Msg_CS_CreateTable, Msg_CS_TableInvite, Msg_SC_InviteTable } from "../../proto/LobbyMsg";
import { PlayerInfo, TableRuleInfo } from "../../proto/LobbyMsgDef";
import { Msg_SC_GameOverMsg } from "../../proto/TableMsg";
import { FinalPlayerCalcInfo, RoomTableInfo } from "../../proto/TableMsgDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import PersonDataHelp from "../../utils/PersonDataHelp";
import BigOverHorseInfoItem from "./BigOverHorseInfoItem";
import BigOverPlayerInfoItem from "./BigOverPlayerInfoItem";

const { ccclass, property } = cc._decorator;


export type BigOverPlayerInfoItemData={
	type:number,
    playr_rank_num:number,
    player_head_url:string,
    player_rank_url:string,
    player_name:string,
    player_ID:string,
    zimo_num:number,
    jiepao_num:number,
    gangpai_num:number,
    dianpao_num:number,
    player_score:number,
    duiju_num:number
    zhuangma_num:number,
    score_horse_num:number,

    game_horse_url:string,
    card_num:number
}

@ccclass
export default class BigOverPanel extends UIBase {

    @property(cc.Node)
    contentNode: cc.Node = null;
    private playerInfoItemPrefab: cc.Prefab;
    private horsePlayerInfoItemPrfab:cc.Prefab;
    private playerInfoItemArr:cc.Node[];
    private horsePlayerInfoItem:BigOverHorseInfoItem;
    private roomTypeLabel:cc.Label;
    private roomNameLabel:cc.Label;
    private createNmeLabel:cc.Label;
    private downScoreNumLabel:cc.Label;
    private sumBattleNumLabel:cc.Label;
    private gameEndTimeLabel:cc.Label;
    private downRulesLabel:cc.Label;

    private ruleMapInfo:{[key:number]:string[]};
    /**
     * 0:没买马 1:买一个普通马 2:买一个庄马 3:买两个普通马 4:一个庄马一个普通马
     */
    private viewType:number=0;
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.playerInfoItemPrefab = Global.Utils.getPreFabBySource("smallOver/prefab/BigOverPlayerInfoItem");
        this.horsePlayerInfoItemPrfab=Global.Utils.getPreFabBySource("smallOver/prefab/BigOverHorseInfoItem");
        this.playerInfoItemArr=[];
       
        this.roomTypeLabel=this.node.getChildByName("room_type_label").getComponent(cc.Label);
        this.roomNameLabel=this.node.getChildByName("room_name_label").getComponent(cc.Label);
        this.createNmeLabel=this.node.getChildByName("create_name_label").getComponent(cc.Label);
        this.downScoreNumLabel=this.node.getChildByName("down_score_num_label").getComponent(cc.Label);
        this.sumBattleNumLabel=this.node.getChildByName("sum_battle_num_label").getComponent(cc.Label);
        this.gameEndTimeLabel=this.node.getChildByName("game_end_time_label").getComponent(cc.Label);

        this.downRulesLabel=this.node.getChildByName("down_rules_label").getComponent(cc.Label);
    }
    start() {
        let gameOverData=GameInfo.ins.gameOverData;
        let data_common_1={"calcInfos":[{"aid":25589,"bankerHScore":0,"dpCnt":5,"gpCnt":3,"jpCnt":4,"score":128,"scoreHorse":0,"sit":0,"winChips":428,"zmCnt":4},{"aid":28812,"bankerHScore":0,"dpCnt":4,"gpCnt":0,"jpCnt":0,"score":-214,"scoreHorse":0,"sit":1,"winChips":86,"zmCnt":0},{"aid":22256,"bankerHScore":0,"dpCnt":4,"gpCnt":4,"jpCnt":5,"score":82,"scoreHorse":-76,"sit":2,"winChips":382,"zmCnt":3},{"aid":20034,"bankerHScore":0,"dpCnt":2,"gpCnt":1,"jpCnt":6,"score":80,"scoreHorse":0,"sit":3,"winChips":380,"zmCnt":2},{"aid":22256,"bankerHScore":0,"dpCnt":4,"gpCnt":4,"jpCnt":5,"score":82,"scoreHorse":-76,"sit":4,"winChips":224,"zmCnt":3}],"handCnt":8,"mid":5,"sid":51};

        // gameOverData=JSON.parse(JSON.stringify(data_common_1));
        if(!gameOverData){
            Global.Utils.debugOutput("BigOverPanel:  "+"无大结算数据！！！");
            Global.EventCenter.addEventListener(EventType.GameOverMsg , this.start, this);
            return;
        }
        let calcInfos=gameOverData.calcInfos;
        let roomInfo=GameInfo.ins.roomTableInfo;
        
        this.setBuyHoresType();
      
        this.createChildNode();
        this.setPlayerRecordData(calcInfos);
        let horseCalcInfos:FinalPlayerCalcInfo[]=[];
        for(let item of calcInfos){
            if(item.sit>=4){
                horseCalcInfos.push(item);
            }
        }
        this.setHorseRecordData(horseCalcInfos);
        this.initTopLabels(roomInfo,gameOverData);
        let ruleStr=PersonDataHelp.ins.getRoomTableInfoStr(roomInfo.rule);
        this.downRulesLabel.string=ruleStr;
    }
    private setBuyHoresType():void{
        this.viewType=0;
        let roomInfo=GameInfo.ins.roomTableInfo;
        let rule=roomInfo.rule;
        if(rule.buyHorseNum==1){
            if(rule.isSelectBankerBuyHorse){
                this.viewType=2;
            }else{
                this.viewType=1;
            }
        }else if(rule.buyHorseNum==2){
            if(rule.isSelectBankerBuyHorse){
                this.viewType=4
            }else{
                this.viewType=3;
            }
        }
    }
    private setPlayerRecordData(calcInfos:FinalPlayerCalcInfo[]):void{
        let paramPlayerData:BigOverPlayerInfoItemData[]=[];
        let playerDataArr:FinalPlayerCalcInfo[]=[];
        for(let index=0;index<4;index++){
            playerDataArr.push(calcInfos[index]);
        }
        let dataSortArr=playerDataArr.sort(function(a,b){
            return (b.score+b.bankerHScore)-(a.score+a.bankerHScore);
        })
        for(let index=0;index<4;index++){
            let dataItem=dataSortArr[index];
            let infoItem=this.getInfoItemByData(dataItem,index);
            paramPlayerData.push(infoItem);
        }
        if(paramPlayerData.length!=this.playerInfoItemArr.length){
            Global.Utils.debugOutput("BigOverPannel  初始化大结算数据长度不一致！！！");
            return;
        }
        for(let index=0;index<paramPlayerData.length;index++){
            let dataItem=paramPlayerData[index];
            let nodeItem=this.playerInfoItemArr[index];
            let intemCompnent=nodeItem.getComponent(BigOverPlayerInfoItem);
            intemCompnent.initValue(dataItem);
        }
    }
    private setHorseRecordData(calcInfos:FinalPlayerCalcInfo[]):void{
        let paramHorseData:BigOverPlayerInfoItemData[]=[];
        let horseArr=GameInfo.ins.gameHorseArray;
        switch(this.viewType){
            case 1:
                for(let index=0;index<horseArr.length;index++){
                    let dataItem=calcInfos[index];
                    let infoItem=this.getInfoItemByData(dataItem,4+index);
                    paramHorseData.push(infoItem) ;
                }
                break;
            case 2:
                paramHorseData.push(null);
                break;
            case 3:
                for (let index = 0; index < horseArr.length; index++) {
                    let dataItem = calcInfos[index];
                    let infoItem = this.getInfoItemByData(dataItem, 4 + index);
                    paramHorseData.push(infoItem);
                }
                break;
            case 4:
                for (let index = 0; index < horseArr.length; index++) {
                    if (horseArr[index].isBanker) {
                        paramHorseData.push(null);
                    } else {
                        let dataItem = calcInfos[0];
                        let infoItem = this.getInfoItemByData(dataItem, 4 + index);
                        paramHorseData.push(infoItem);
                    }
                }
                paramHorseData=paramHorseData.sort(function(a,b){
                    if(a==null){
                        return 1;
                    }
                });
                break;
        }

        if(this.horsePlayerInfoItem){
            this.horsePlayerInfoItem.node.active=paramHorseData.length>0;
            this.horsePlayerInfoItem.initValue(paramHorseData);
        }
        
        if(paramHorseData.length>0){
            this.contentNode.y=418.8;
            this.downRulesLabel.node.y=-387;
        }else{
            this.contentNode.y=408.8;
            this.downRulesLabel.node.y=-340;
        }
    }

    private getInfoItemByData(infoItem:FinalPlayerCalcInfo,index:number):BigOverPlayerInfoItemData{
        let playerInfo:PlayerInfo=null;
        let sitInfo=GameInfo.ins.getPlayerByAid(infoItem.aid);
        if(sitInfo){
            playerInfo=sitInfo.player;
        }
        let itemShowType=-1;
        let card_num=0;
        let gameHorseArray=GameInfo.ins.gameHorseArray;
        if(index>=4){
            for(let item of gameHorseArray){
                if(item.horseSit==index-4){
                    playerInfo=item.player;
                    card_num=item.majNum+1;
                    itemShowType=item.isBanker;
                }
            }
        }else{
            if(infoItem.bankerHScore!=0){
                itemShowType=1;
            }
        }
        let dataItem:BigOverPlayerInfoItemData={
            type:itemShowType,
            player_head_url:"smallOver/resource/game_jstouxiang2",
            playr_rank_num:index+1,
            player_rank_url:index>2?"":"smallOver/resource/game_di"+(index+1),
            player_name:playerInfo?playerInfo.nike:"",
            player_ID:playerInfo?playerInfo.aid.toString():"",
            zimo_num:infoItem.zmCnt,
            jiepao_num:infoItem.jpCnt,
            gangpai_num:infoItem.gpCnt,
            dianpao_num:infoItem.dpCnt,
            player_score:infoItem.score+infoItem.bankerHScore,
            duiju_num:infoItem.score,
            zhuangma_num:infoItem.bankerHScore,

            score_horse_num:infoItem.scoreHorse,
            game_horse_url:index>=4?"smallOver/resource/game_ma"+(index-3):"",
            card_num:card_num,

        };
        if(index>=4){
            dataItem.player_rank_url="";
        }
        return dataItem;
    }
    private createChildNode():void{
        for (let index = 0; index < 4; index++) {
            let prefabItem = cc.instantiate(this.playerInfoItemPrefab);
            if(this.viewType>0){
                prefabItem.height = 145;
            }else{
                prefabItem.height=166;
            }
            this.contentNode.addChild(prefabItem);
            this.playerInfoItemArr.push(prefabItem);
        }
        if(this.viewType>0){
            let prefabItem=cc.instantiate(this.horsePlayerInfoItemPrfab);
            this.horsePlayerInfoItem=prefabItem.getComponent(BigOverHorseInfoItem);
            this.contentNode.addChild(prefabItem);
        }
    }
    private initTopLabels(roomData:RoomTableInfo,gameOverData:Msg_SC_GameOverMsg):void{
        let gameName:string = Global.Utils.getGameNameByGameType(roomData.rule.gamePlayType);
        let gameType:string = Global.Utils.getGameTypeNameByGameType(roomData.rule.roomType);
        let roomName = gameName + "-"+ gameType;
        this.roomTypeLabel.string=roomName;
        this.roomNameLabel.string=roomData.roomName;
        this.createNmeLabel.string=roomData.creater;
        this.downScoreNumLabel.string=roomData.rule.baseScore+"";
        this.sumBattleNumLabel.string=gameOverData.handCnt+"/"+roomData.rule.handsCnt;
        let timeStr=Global.Utils.timestampToTime(GameInfo.ins.serverTime*1000,2);
        this.gameEndTimeLabel.string=timeStr;

        let playerAgain=this.node.getChildByName("playagain_btn");
        let back_btn=this.node.getChildByName("back_btn");
        let isCreater=roomData.crtAid==UserInfo.ins.myInfo.aid;
        playerAgain.active=isCreater;
        if(!isCreater){
            back_btn.x=0;
        }
    }
    public onExitBtnClick():void{
        Global.Utils.debugOutput("BigOverPanel  点击退出按钮");
        this.disTory();
        MainManager.ins.onLeaveRoomInitData();
        Global.EventCenter.dispatchEvent(EventType.BackToLobby);
    }
    public onPlayAgainBtnClick():void{
        Global.Utils.debugOutput("BigOverPanel  再来一次");
        let msg=new Msg_CS_TableInvite();
        let gameRule=GameInfo.ins.roomTableInfo.rule;
        msg.tid="";//房间编号应该使用新创建的下一场的tid
        let myInfo=UserInfo.ins.myInfo;
        let palyers=GameInfo.ins.gamePlayers;
        let objs=[];
        for(let item of palyers){
            if(item.player.aid!=myInfo.aid){
                objs.push(item.player.gpid);
            }
        }
        msg.objs=objs;
        GameInfo.ins.creatGameInviteTempData_CS=msg;
        this.creatRoom(gameRule);
        this.disTory();
    }
    private creatRoom(_rule:TableRuleInfo):void{
        let ruleInfo : TableRuleInfo = _rule;
		let msg : Msg_CS_CreateTable = new Msg_CS_CreateTable();
		msg.info = ruleInfo;
		msg.name = GameInfo.ins.roomTableInfo.roomName;
		Global.mgr.socketMgr.send(-1 , msg);
    }
    disTory(): void {
        this.removeListener();
        this.contentNode.removeAllChildren();
        super.disTory();
    }
    private removeListener():void{
        Global.EventCenter.removeEventListener(EventType.GameOverMsg , this.start, this);
    }

    // update (dt) {}
}
