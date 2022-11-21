// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventType from "../../event/EventType";
import GameInfo from "../../Game/info/GameInfo";
import UserInfo from "../../Game/info/UserInfo";
import { Msg_CS_NextTrun, Msg_SC_GameResultMsg, Msg_SC_ScoreListMsg } from "../../proto/TableMsg";
import { GameResultInfo, ScoreEventInfo, SitInfo } from "../../proto/TableMsgDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import { OverBuyHorseInfoData, OverPlayerItemInfoData } from "../../utils/InterfaceHelp";
import CardHelpManager from "../card/CardHelpManager";
import OverBuyHorseItem from "./OverBuyHorseItem";
import OverGameinfoItem from "./OverGameinfoItem";
import OverHandCardItem from "./OverHandCardItem";
import OverHorseInfoItem from "./OverHorseInfoItem";
import OverPlayerInfoItem from "./OverPlayerInfoItem";
import SmallOverPlayerHead from "./SmallOverPlayerHead";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SmallOverPanel extends UIBase {
    @property (cc.Node)
    allGroup : cc.Node = null;
    @property (cc.Node)
    allValueGroup : cc.Node = null;
    @property (cc.Node)
    infoGroup : cc.Node = null;
    @property (cc.Node)
    playerHeadGroup : cc.Node = null;
    @property (cc.Label)
    nowBaoziLabel : cc.Label = null;
    @property (cc.Label)
    nowCountLabel : cc.Label = null;
    @property(cc.Button)
    readyBtn : cc.Button = null;
    @property(cc.Sprite)
    lookTable : cc.Sprite = null;
	@property (cc.Label)
	readyLabel : cc.Label = null;

    private gameResultMsg : Msg_SC_GameResultMsg;
	private scoreListMsg : Msg_SC_ScoreListMsg;
	private playerArr : Array<SmallOverPlayerHead> = [];
	private selectPlayer : SmallOverPlayerHead;
    private playerHeadPrefab : cc.Prefab;
    private playerInfoPrefab : cc.Prefab;
    private playerHorsePrefab : cc.Prefab;
    private playerGamePrefab : cc.Prefab;
    private playerHandPrefab : cc.Prefab;

    private playerInfoItem : OverPlayerInfoItem = null;
    private playerHorseItem : OverHorseInfoItem = null;
    private playerHandItem : OverHandCardItem = null;
    private playerGameItem : OverGameinfoItem = null;
    protected onLoad(): void {
        this.playerHeadPrefab = Global.Utils.getPreFabBySource("smallOver/prefab/SmallOverPlayerHead");
        this.playerInfoPrefab = Global.Utils.getPreFabBySource("smallOver/prefab/OverPlayerInfoItem");
        this.playerHorsePrefab = Global.Utils.getPreFabBySource("smallOver/prefab/OverHorseInfoItem");
        this.playerHandPrefab = Global.Utils.getPreFabBySource("smallOver/prefab/OverHandCardItem");
        this.playerGamePrefab = Global.Utils.getPreFabBySource("smallOver/prefab/OverGameinfoItem");
        this.createElements();
    }
    private createElements(){
        this.setTestData();
        this.gameResultMsg = GameInfo.ins.gameResultMsg;
        this.scoreListMsg = GameInfo.ins.scoreListMsg;
        this.createPlayerHead();
		this.addEvent();

		if(GameInfo.ins.nowGameCount < GameInfo.ins.roomTableInfo.rule.handsCnt){
			this.readyLabel.string = "准备";
		}else{
			this.readyLabel.string = "战绩统计";
		}
		if(GameInfo.ins.isBaozi){
			this.nowBaoziLabel.string = "本局豹子(底分X2)"
		}
		if(GameInfo.ins.isShuangbao){
			this.nowBaoziLabel.string = "本局双豹(底分X4)"
		}
    } 
	private addEvent(){
		this.lookTable.node.on(cc.Node.EventType.TOUCH_START , this.onTouchStar , this);
		this.lookTable.node.on(cc.Node.EventType.TOUCH_END , this.onTouchend , this);
	}
	private onTouchStar(){
		this.allValueGroup.active = false;
	}
	private onTouchend(){
		this.allValueGroup.active = true;
	}
    private createValueElement(){
        let player : SmallOverPlayerHead = this.selectPlayer;
		let sitInfo : SitInfo = player.playerInfo;
		let resultInfo : GameResultInfo = this.getGameResultInfo(sitInfo.sitNum);
		this.showSelectPlayerData(sitInfo,resultInfo);
		this.showSelectMa(sitInfo,resultInfo);
        this.showMyHand(resultInfo);
		this.showValue();
    }
	private showValue(){
		if(this.playerGameItem == null){
            this.playerGameItem = cc.instantiate(this.playerGamePrefab).getComponent(OverGameinfoItem);
        }
		let scoreInfoArr : Array<ScoreEventInfo> = [];
		for(let i = 0 ; i < GameInfo.ins.scoreListMsg.scores.length ; i++){
			if(GameInfo.ins.scoreListMsg.scores[i].sitNum == this.selectPlayer.playerInfo.sitNum){
				scoreInfoArr = GameInfo.ins.scoreListMsg.scores[i].rcd;
			}
		}
		this.playerGameItem.setData(scoreInfoArr);
		if(!this.playerGameItem.node.parent){
			this.infoGroup.addChild(this.playerGameItem.node);
		}
	}
    private showMyHand(resultInfo : GameResultInfo){
        if(this.playerHandItem == null){
            this.playerHandItem = cc.instantiate(this.playerHandPrefab).getComponent(OverHandCardItem);
        }
        let huCatd : number= GameInfo.ins.hupaiArr[resultInfo.sitNum] ? GameInfo.ins.hupaiArr[resultInfo.sitNum] : -1;
        this.playerHandItem.setNewData(resultInfo.lstPuts , resultInfo.lstMajs , huCatd);
		if(!this.playerHandItem.node.parent){
			this.infoGroup.addChild(this.playerHandItem.node);
		}
    }
    private showSelectMa(sitInfo : SitInfo , resultInfo : GameResultInfo){
        if(this.playerHorseItem == null){
            this.playerHorseItem = cc.instantiate(this.playerHorsePrefab).getComponent(OverHorseInfoItem);
        }
        let arr: Array<OverBuyHorseInfoData> = [];
        let data1 : OverBuyHorseInfoData = new OverBuyHorseInfoData();
        data1.buyCoun = 105;
        data1.cardValue = 9;
        data1.fen = 25;
        data1.horesNum = 1;
        data1.playerHead = 1;
        let data2 : OverBuyHorseInfoData = new OverBuyHorseInfoData();
        data2.buyCoun = 107;
        data2.cardValue = 26;
        data2.fen = -18;
        data2.horesNum = 2;
        data2.playerHead = 1;
        arr = [data1 , data2];
        this.playerHorseItem.horseArr = arr;
		if(!this.playerHorseItem.node.parent){
			this.infoGroup.addChild(this.playerHorseItem.node);
		}
    }
    private showSelectPlayerData(sitInfo : SitInfo , resultInfo : GameResultInfo){
        if(this.playerInfoItem == null){
            this.playerInfoItem = cc.instantiate(this.playerInfoPrefab).getComponent(OverPlayerInfoItem);
        }
        let data : OverPlayerItemInfoData = new OverPlayerItemInfoData();
        data.playerName = "未获取";
        data.playerId = "未获取";
        data.isZhuang = sitInfo.sitNum == GameInfo.ins.nowBookMakerSit;
        data.isPaio = false;
        data.huType = resultInfo.state == 2 ? resultInfo.huNum : -1;
        data.fenCount = resultInfo.score;

        this.playerInfoItem.itemInfoDat = data;
		if(!this.playerInfoItem.node.parent){
			this.infoGroup.addChild(this.playerInfoItem.node);
		}
	}
    private getGameResultInfo(sit:number):GameResultInfo{
		for(let i = 0 ; i < this.gameResultMsg.results.length ; i++){
			if(this.gameResultMsg.results[i].sitNum == sit){
				return this.gameResultMsg.results[i];
			}
		}
	}
    private createPlayerHead(){
        let newInfo : Array<GameResultInfo> = []
		if(this.gameResultMsg.isBreak){
			newInfo = this.sortZhuang();
		}else{
			newInfo = this.sortWin();
		}

		let player : SmallOverPlayerHead;
		for(let i = 0 ; i < newInfo.length ; i++){

			player = cc.instantiate(this.playerHeadPrefab).getComponent(SmallOverPlayerHead);
            player.setPlayerData(newInfo[i] , this.gameResultMsg.isBreak == 1);
            if(newInfo[i].sitNum == UserInfo.ins.mySitIndex){
                player.isSelect = true;
                this.selectPlayer = player;
                this.createValueElement()
            }else{
                player.isSelect = false;
            }
            this.playerHeadGroup.addChild(player.node);
            this.playerArr[i] = player;
            player.node.on(cc.Node.EventType.TOUCH_START , this.onPlayerClick , this);
		}
    }
    private onPlayerClick(e ){
		let player : SmallOverPlayerHead = e.currentTarget.getComponent(SmallOverPlayerHead);
		if(player.isSelect){
			return;
		}
		this.selectPlayer.isSelect = false;
		player.isSelect = true;
		this.selectPlayer = player;
		this.createValueElement();
	}
    private sortWin():Array<GameResultInfo>{
		let arr:Array<GameResultInfo> = [];
		let info:GameResultInfo;
		let tempArr:Array<GameResultInfo> = [];
		let sortArr:Array<GameResultInfo> = [];
		for(let i = 0 ; i < this.gameResultMsg.results.length ; i++){
			info = this.gameResultMsg.results[i];
			if(info.huNum == 0){
				arr[0] = info;
			}
			if(info.huNum == 1){
				arr[1] = info;
			}
			if(info.huNum == 2){
				arr[2] = info;
			}
			if(info.huNum == -1){
				tempArr.push(info);
			}
		}
		if(tempArr.length == 1){
			arr[3] = tempArr[0];
		}else{
			for(let i = 0 ; i < tempArr.length ; i++){
				info = tempArr[i];
				if(info.sitNum == GameInfo.ins.nowBookMakerSit){
					sortArr[0] = info;
				}
				if(info.sitNum == (GameInfo.ins.nowBookMakerSit+1)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType)){
					sortArr[1] = info;
				}
				if(info.sitNum == (GameInfo.ins.nowBookMakerSit+2)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType)){
					sortArr[2] = info;
				}
				if(info.sitNum == (GameInfo.ins.nowBookMakerSit+3)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType)){
					sortArr[3] = info;
				}
			}
			for(let i = 0 ; i < sortArr.length ; i++){
				if(sortArr[i]){
					arr.push(sortArr[i]);
				}
			}
		}
		return arr;
	}
	private sortZhuang():Array<GameResultInfo>{
		let arr:Array<GameResultInfo> = [];
		let info:GameResultInfo;
		for(let i = 0 ; i < this.gameResultMsg.results.length ; i++){
			info = this.gameResultMsg.results[i];
			if(info.sitNum == GameInfo.ins.nowBookMakerSit){
				arr[0] = info;
			}
			if(info.sitNum == (GameInfo.ins.nowBookMakerSit+1)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType)){
				arr[1] = info;
			}
			if(info.sitNum == (GameInfo.ins.nowBookMakerSit+2)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType)){
				arr[2] = info;
			}
			if(info.sitNum == (GameInfo.ins.nowBookMakerSit+3)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType)){
				arr[3] = info;
			}
		}
		return arr;
	}

	onReadyClick(){
		this.disTory();
		GameInfo.ins.initOver();
		UserInfo.ins.initOver();
		CardHelpManager.ins.initOver();

		if(GameInfo.ins.nowGameCount< GameInfo.ins.roomTableInfo.rule.handsCnt){
			Global.mgr.socketMgr.send(-1 , new Msg_CS_NextTrun());
			Global.EventCenter.dispatchEvent(EventType.OpenNewGame);
		}else{
			//TODO open the big ovew panel;
			Global.DialogManager.createDialog("smallOver/prefab/BigOverPanel",null, (any,createDialog)=>{
				createDialog.y = 0;
			})
		}
	}
    private setTestData(){
        // GameInfo.ins.gameResultMsg  = {"isBreak":0,"mid":5,"results":[{"curChips":312,"curHorseChips":0,"horseScore":0,"huNum":0,"lstMajs":[5,5,8,8,8,13,13,13,16,16,16],"lstPuts":[{"getType":2,"majID":9,"targetNum":2,"type":3}],"rain":-1,"score":12,"sitNum":0,"state":2},{"curChips":282,"curHorseChips":0,"horseScore":0,"huNum":-1,"lstMajs":[14,15,17,19,21,22,24,27,28,29],"lstPuts":[{"getType":2,"majID":12,"targetNum":2,"type":3}],"rain":0,"score":-18,"sitNum":1,"state":0},{"curChips":282,"curHorseChips":0,"horseScore":0,"huNum":2,"lstMajs":[1,1,3,3,3,17,17,17,19,19,19],"lstPuts":[{"getType":2,"majID":6,"targetNum":0,"type":3}],"rain":-1,"score":-18,"sitNum":2,"state":2},{"curChips":324,"curHorseChips":0,"horseScore":0,"huNum":1,"lstMajs":[22,22,22,23,23,23,27,27],"lstPuts":[{"getType":2,"majID":28,"targetNum":2,"type":3},{"getType":2,"majID":26,"targetNum":0,"type":3}],"rain":-1,"score":24,"sitNum":3,"state":2}],"sid":47}
        // GameInfo.ins.scoreListMsg = {"mid":5,"scores":[{"rcd":[{"tarSitsEx" : [] ,"curSit":0,"debug":{"baseMo":1,"dob":2,"dobB":2,"dobT":2,"dobTotal":3,"fanMo":0,"huNum":0,"param":1,"param2":0,"tiFan":0,"zmType":1},"fanTypes":[],"huGangTypes":[2],"majid":8,"param":0,"scoreType":1,"tarSits":[1,2,3],"win":12}],"sitNum":0},{"rcd":[{"debug":null,"tarSitsEx" : [] ,"curSit":1,"fanTypes":[],"huGangTypes":[2],"majid":8,"param":0,"scoreType":3,"tarSits":[0],"win":-3},{"debug":null,"tarSitsEx" : [] ,"curSit":1,"fanTypes":[],"huGangTypes":[2,3],"majid":23,"param":0,"scoreType":3,"tarSits":[3],"win":-9},{"debug":null,"tarSitsEx" : [] ,"curSit":1,"fanTypes":[],"huGangTypes":[2],"majid":3,"param":0,"scoreType":3,"tarSits":[2],"win":-6}],"sitNum":1},{"rcd":[{"debug":null,"tarSitsEx" : [] ,"curSit":2,"fanTypes":[],"huGangTypes":[2],"majid":8,"param":0,"scoreType":3,"tarSits":[0],"win":-6},{"debug":null,"tarSitsEx" : [] ,"curSit":2,"fanTypes":[],"huGangTypes":[2,3],"majid":23,"param":0,"scoreType":3,"tarSits":[3],"win":-18},{"tarSitsEx" : [] ,"curSit":2,"debug":{"baseMo":1,"dob":2,"dobB":2,"dobT":2,"dobTotal":3,"fanMo":0,"huNum":2,"param":2,"param2":0,"tiFan":0,"zmType":1},"fanTypes":[],"huGangTypes":[2],"majid":3,"param":0,"scoreType":1,"tarSits":[1],"win":6}],"sitNum":2},{"rcd":[{"debug":null,"tarSitsEx" : [] ,"curSit":3,"fanTypes":[],"huGangTypes":[2],"majid":8,"param":0,"scoreType":3,"tarSits":[0],"win":-3},{"tarSitsEx" : [] ,"curSit":3,"debug":{"baseMo":1,"dob":8,"dobB":8,"dobT":8,"dobTotal":9,"fanMo":0,"huNum":1,"param":1,"param2":0,"tiFan":0,"zmType":1},"fanTypes":[],"huGangTypes":[2,3],"majid":23,"param":0,"scoreType":1,"tarSits":[1,2],"win":27}],"sitNum":3}],"sid":49}
    }
}