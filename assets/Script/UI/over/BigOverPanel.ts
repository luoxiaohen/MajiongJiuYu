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
import { Msg_CS_CreateTable, Msg_CS_TableInvite, Msg_SC_InviteTable } from "../../proto/LobbyMsg";
import { TableRuleInfo } from "../../proto/LobbyMsgDef";
import { Msg_SC_GameOverMsg } from "../../proto/TableMsg";
import { FinalPlayerCalcInfo, RoomTableInfo } from "../../proto/TableMsgDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
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
        // let data={"calcInfos":[{"bankerHScore":0,"dpCnt":9,"gpCnt":0,"jpCnt":0,"score":-182,"scoreHorse":0,"sit":0,"winChips":18,"zmCnt":1},{"bankerHScore":0,"dpCnt":1,"gpCnt":0,"jpCnt":7,"score":6,"scoreHorse":0,"sit":1,"winChips":206,"zmCnt":0},{"bankerHScore":0,"dpCnt":3,"gpCnt":0,"jpCnt":2,"score":124,"scoreHorse":0,"sit":2,"winChips":324,"zmCnt":6},{"bankerHScore":0,"dpCnt":0,"gpCnt":0,"jpCnt":4,"score":52,"scoreHorse":0,"sit":3,"winChips":252,"zmCnt":4}],"handCnt":8,"mid":5,"sid":51};
        // let data_1={"calcInfos":[{"bankerHScore":0,"dpCnt":9,"gpCnt":0,"jpCnt":0,"score":-182,"scoreHorse":0,"sit":0,"winChips":18,"zmCnt":1},{"bankerHScore":0,"dpCnt":1,"gpCnt":0,"jpCnt":7,"score":6,"scoreHorse":0,"sit":1,"winChips":206,"zmCnt":0},{"bankerHScore":0,"dpCnt":3,"gpCnt":0,"jpCnt":2,"score":124,"scoreHorse":0,"sit":2,"winChips":324,"zmCnt":6},{"bankerHScore":0,"dpCnt":0,"gpCnt":0,"jpCnt":4,"score":52,"scoreHorse":0,"sit":3,"winChips":252,"zmCnt":4},{"bankerHScore":0,"dpCnt":0,"gpCnt":0,"jpCnt":4,"score":52,"scoreHorse":0,"sit":3,"winChips":252,"zmCnt":4}],"handCnt":8,"mid":5,"sid":51};
        // let data_2={"calcInfos":[{"bankerHScore":0,"dpCnt":9,"gpCnt":0,"jpCnt":0,"score":-182,"scoreHorse":0,"sit":0,"winChips":18,"zmCnt":1},{"bankerHScore":0,"dpCnt":1,"gpCnt":0,"jpCnt":7,"score":6,"scoreHorse":0,"sit":1,"winChips":206,"zmCnt":0},{"bankerHScore":0,"dpCnt":3,"gpCnt":0,"jpCnt":2,"score":124,"scoreHorse":0,"sit":2,"winChips":324,"zmCnt":6},{"bankerHScore":0,"dpCnt":0,"gpCnt":0,"jpCnt":4,"score":52,"scoreHorse":0,"sit":3,"winChips":252,"zmCnt":4},{"bankerHScore":0,"dpCnt":0,"gpCnt":0,"jpCnt":4,"score":52,"scoreHorse":0,"sit":3,"winChips":252,"zmCnt":4},{"bankerHScore":0,"dpCnt":0,"gpCnt":0,"jpCnt":4,"score":52,"scoreHorse":0,"sit":3,"winChips":252,"zmCnt":4}],"handCnt":8,"mid":5,"sid":51};
        // let msg:Msg_SC_GameOverMsg=JSON.parse(JSON.stringify(data_2));
		// console.log("收到大结算数据: ",data,"---msg",msg);
		// gameOverData=msg;
        if(!gameOverData){
            Global.Utils.debugOutput("BigOverPanel:  "+"无大结算数据！！！");
            Global.EventCenter.addEventListener(EventType.GameOverMsg , this.start, this);
            return;
        }
        this.viewType=gameOverData.calcInfos.length-4;
        this.createChildNode();
        let paramPlayerData:BigOverPlayerInfoItemData[]=[];
        let paramHorseData:BigOverPlayerInfoItemData[]=[];
        let playerDataArr:FinalPlayerCalcInfo[]=[];

        let calcInfos=gameOverData.calcInfos;
        for(let index=0;index<4;index++){
            playerDataArr.push(calcInfos[index]);
        }
       
        let dataSortArr=playerDataArr.sort(function(a,b){
            return b.score-a.score;
        })
        for(let index=0;index<4;index++){
            let dataItem=dataSortArr[index];
            let infoItem=this.getInfoItemByData(dataItem,index);
            paramPlayerData.push(infoItem);
        }
        for(let index=4;index<calcInfos.length;index++){
            let dataItem=calcInfos[index];
            let infoItem=this.getInfoItemByData(dataItem,index);
            paramHorseData.push(infoItem) ;
        }
    
        if(this.viewType>0){
            this.contentNode.y=418.8;
            this.downRulesLabel.node.y=-387;
        }else{
            this.contentNode.y=408.8;
            this.downRulesLabel.node.y=-340;
        }
        this.initItemData(paramPlayerData,paramHorseData);
        let roomInfo=GameInfo.ins.roomTableInfo;
        this.initTopLabels(roomInfo,gameOverData);
        let ruleStr=Global.Utils.getRoomTableInfoStr(roomInfo.rule);
        this.downRulesLabel.string=ruleStr;
    }

    private getInfoItemByData(infoItem:FinalPlayerCalcInfo,index:number):BigOverPlayerInfoItemData{
        let playerInfo=GameInfo.ins.getPlayerBySit(infoItem.sit);
        let dataItem:BigOverPlayerInfoItemData={
            type:this.viewType,
            player_head_url:"smallOver/resource/game_jstouxiang2",
            playr_rank_num:index+1,
            player_rank_url:index>2?"":"smallOver/resource/game_di"+(index+1),
            player_name:playerInfo?playerInfo.player.nike:"",
            player_ID:playerInfo?playerInfo.player.aid.toString():"",
            zimo_num:infoItem.zmCnt,
            jiepao_num:infoItem.jpCnt,
            gangpai_num:infoItem.gpCnt,
            dianpao_num:infoItem.dpCnt,
            player_score:infoItem.score+infoItem.bankerHScore,
            duiju_num:infoItem.score,
            zhuangma_num:infoItem.bankerHScore,

            score_horse_num:infoItem.scoreHorse,
            game_horse_url:index>=4?"smallOver/resource/game_ma"+(index-3):"",
            card_num:index>=4?108:0,

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
    private initItemData(data:BigOverPlayerInfoItemData[],horseData:BigOverPlayerInfoItemData[]):void{
        if(data.length!=this.playerInfoItemArr.length){
            Global.Utils.debugOutput("BigOverPannel  初始化大结算数据长度不一致！！！");
            return;
        }
        for(let index=0;index<data.length;index++){
            let dataItem=data[index];
            let nodeItem=this.playerInfoItemArr[index];
            let intemCompnent=nodeItem.getComponent(BigOverPlayerInfoItem);
            intemCompnent.initValue(dataItem);
        }
        if(this.horsePlayerInfoItem){
            this.horsePlayerInfoItem.node.active=this.viewType>0;
            this.horsePlayerInfoItem.initValue(horseData);
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
        let timeStr=new Date().toString().split("GMT");
        this.gameEndTimeLabel.string=timeStr[0];

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
		msg.name = UserInfo.ins.myInfo.nike;
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
