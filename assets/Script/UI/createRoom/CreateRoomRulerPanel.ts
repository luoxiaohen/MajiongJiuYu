// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventType from "../../event/EventType";
import GameInfo from "../../Game/info/GameInfo";
import UserInfo from "../../Game/info/UserInfo";
import TimeAndMoveManager from "../../mgr/TimeAndMoveManager";
import { Msg_CS_ReqSaveRoomRuleTemplate, Msg_CS_CreateTable } from "../../proto/LobbyMsg";
import { TableRuleTempl, TableRuleInfo, GamePiaoTypeEnum, GamePlayTypeEnum, GameRoomTypeEnum } from "../../proto/LobbyMsgDef";
import { Global } from "../../Shared/GloBal";
import Utils from "../../Shared/Utils";
import UIBase from "../../UIBase";
import BaseRuleItem from "./BaseRuleItem";
import CreateRoomHelper, { GameOenRoomUseEnum } from "./CreateRoomHelper";
import CreateRoomRuleItem from "./CreateRoomRuleItem";
import FanRuleItem from "./FanRuleItem";
import FeaturesRuleItem from "./FeaturesRuleItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CreateRoomRulerPanel extends UIBase {
    @property (cc.Button)
    toSaveBtn : cc.Button = null;
    @property (cc.ScrollView)
    ruleScroller : cc.ScrollView = null;
    @property (cc.Button)
    saveBtn : cc.Button = null;
    @property (cc.Button)
    baginBtn : cc.Button = null;
    @property (cc.Button)
    changeBtn : cc.Button = null;
    @property (cc.Label)
    moreLabel : cc.Label = null;
    @property (cc.Sprite)
    backImage : cc.Sprite = null;
    @property (cc.Node)
    ruleItemGrtoup : cc.Node = null;
    private callBack:Function;
    private thisObj : any;

	private itemArray:Array<CreateRoomRuleItem> = [];
	private ruleInfo : TableRuleInfo;
	private ruleTemp : TableRuleTempl;
	protected onLoad(): void {
		
	}

	setData(callBack : Function , thisObj:any , ruleTemp : TableRuleTempl){
		this.callBack = callBack;
		this.thisObj = thisObj;
		this.ruleTemp = ruleTemp;
		this.ruleInfo = ruleTemp ? ruleTemp.rule : null;
		this.createElements();
	}

	private createElements(){
		this.createRuleItem();
		this.addEvent();
		if(this.ruleInfo){
			this.changeBtn.node.active = true;
		}else{
			this.changeBtn.node.active = false;
		}
	}
	private addEvent(){
		Global.EventCenter.addEventListener(EventType.OpenRoomUseChange , this.onRoomOpenUseChange , this);
		Global.EventCenter.addEventListener(EventType.GameRuleItemMove , this.onMoveItem , this);
		Global.EventCenter.addEventListener(EventType.RuleMoveAndScrollerMove , this.onProMove , this);
		Global.EventCenter.addEventListener(EventType.RuleMoveAndScrollerMoveOver , this.onProMoveOver , this);
	}
	private onProMove(){
		this.ruleScroller.vertical = false;
	}
	private onProMoveOver(){
		this.ruleScroller.vertical = true;
	}
	private onMoveItem(e , data){
		let item : CreateRoomRuleItem = data;
		
		let itemWeights : number ; 
		let nowY:number;

		for(let i = 0 ; i < this.itemArray.length ; i++){
			itemWeights = this.itemArray[i].itemWeights;
			nowY = this.itemArray[i].node.y;
			if(itemWeights < item.itemWeights){
				if(item.isMoveUp){
					cc.tween(this.itemArray[i].node).to(item.changeHeight*TimeAndMoveManager.ins.gameRuleItemMoveTime , {y : nowY + item.changeHeight}).start();
				}else{
					cc.tween(this.itemArray[i].node).to(item.changeHeight*TimeAndMoveManager.ins.gameRuleItemMoveTime , {y : nowY - item.changeHeight}).start();
				}
			}
		}
	}
	private onRoomOpenUseChange(){
		let use : number = this.getCreateUse();
		this.moreLabel.string = " " + use + "   现在开局";
		if(UserInfo.ins.myInfo.gold >= use){
			this.baginBtn.enabled = true;
			this.moreLabel.node.color = CreateRoomHelper.ins.colorData[2];
		}else{
			this.baginBtn.enabled = false;
			this.moreLabel.node.color = CreateRoomHelper.ins.colorData[4];
		}
	}

	private getCreateUse():number{
		let ruleInfo : TableRuleInfo = this.getCreateInfo();
		return Global.Utils.getNeedByRule(ruleInfo);
	}
	private getCreateInfo():TableRuleInfo{
		let ruleInfo : TableRuleInfo = new TableRuleInfo();
		let tempInfo : TableRuleInfo;
		for(let i = 0 ; i < this.itemArray.length ; i++){
			tempInfo = this.itemArray[i].getSelectData();
			for(let key in tempInfo){
				if(tempInfo[key]){
					ruleInfo[key] = tempInfo[key];
				}
			}
		}
		return ruleInfo;
	}
	private createRuleItem(){
		this.clearElements();
		let ruleInfo:TableRuleInfo = new TableRuleInfo();
		ruleInfo.gamePlayType = GamePlayTypeEnum.HuanSanZhang;
		ruleInfo.roomType = GameRoomTypeEnum.SanRenLiangFang;
		ruleInfo.baseScore = 100;
		ruleInfo.handsCnt = 16;
		ruleInfo.ceiling = 32;
		ruleInfo.tiFan = 4;
		ruleInfo.baozi = GamePiaoTypeEnum.ShuaiPiao;
		ruleInfo.baoziDouble = 1;
		ruleInfo.haveHorse = 1;
		ruleInfo.buyHorseNum = 2;
		ruleInfo.buyHorseType = 1;
		ruleInfo.isSelectBankerBuyHorse = 1;
		ruleInfo.isSelectEatHorse = 0;

		ruleInfo.zmType = 1;
		ruleInfo.menqing = 1;
		ruleInfo.zhongzhang = 1;
		ruleInfo.yao9 = 1;
		ruleInfo.jiangdui = 1;
		ruleInfo.jiaxin5 = 1;
		ruleInfo.tdHu = 1;
		ruleInfo.findMaxHu = 1;
		ruleInfo.dianGangHua = 1;
		ruleInfo.caGua = 1;
		ruleInfo.jiShiYu = 1;
		ruleInfo.allGangShift = 1;
		ruleInfo.sunshine = 1;
		ruleInfo.passHu = 1;
		ruleInfo.lunZhuang = 1;
		ruleInfo.hu2Score = 1;
		ruleInfo.last4Hu = 1;
		ruleInfo.zmOpen = 1;
		ruleInfo.realTimeCalc = 1;
		ruleInfo.limitIP = 1;
		ruleInfo.limitGPS = 1;
		if(this.ruleInfo){
			ruleInfo = this.ruleInfo;
		}
		else if(CreateRoomHelper.ins.lastRuleInfo){
			ruleInfo = CreateRoomHelper.ins.lastRuleInfo;
		}else{
			ruleInfo = CreateRoomHelper.ins.myLastRuleInfo ? CreateRoomHelper.ins.myLastRuleInfo : null
		}
		let temp : TableRuleTempl = new TableRuleTempl();
		if(this.ruleTemp){
			temp = this.ruleTemp;
		}else{
			temp.rule = ruleInfo;
		}
		let item : CreateRoomRuleItem = cc.instantiate(Global.Utils.getPreFabBySource("createRoom/prefab/BaseRuleItem")).getComponent(BaseRuleItem);
		item.setData(temp)
		this.itemArray.push(item);
		item = cc.instantiate(Global.Utils.getPreFabBySource("createRoom/prefab/FeaturesRuleItem")).getComponent(FeaturesRuleItem);
		item.setData(temp)
		this.itemArray.push(item);
		item = cc.instantiate(Global.Utils.getPreFabBySource("createRoom/prefab/FanRuleItem")).getComponent(FanRuleItem);
		item.setData(temp)
		this.itemArray.push(item);
		let _y:number=0;
		for(let i = 0 ; i < this.itemArray.length ; i++){
			this.ruleItemGrtoup.addChild(this.itemArray[i].node);
			this.itemArray[i].node.y = _y*-1;
			_y += this.itemArray[i].getHeight();
		}
	}
	private clearElements(){
		for(let i = 0 ; i < this.itemArray.length ; i++){
			this.itemArray[i].disTory();
		}
		this.ruleItemGrtoup.removeAllChildren();
		this.itemArray = [];
	}

    /**返回*/
	 onBackClick(){
		let info : TableRuleInfo = this.getCreateInfo();
		CreateRoomHelper.ins.lastRuleInfo = info;
		CreateRoomHelper.ins.lastRuleName = (this.itemArray[0] as BaseRuleItem).getRuleName();
		this.callBack.bind(this.thisObj)(1);
	}
	/**去保存*/
	 onToSaveClick(){
		this.callBack.bind(this.thisObj)(2);
	}
	/**修改保存*/
	 onChangeClick(){
		let temp:TableRuleTempl = new TableRuleTempl();
		temp.rule = this.getCreateInfo();
		temp.name = (this.itemArray[0] as BaseRuleItem).getRuleName();
		temp.templId = this.ruleTemp.templId;
		let msg : Msg_CS_ReqSaveRoomRuleTemplate = new Msg_CS_ReqSaveRoomRuleTemplate();
		msg.ruleInfo =  temp;
		CreateRoomHelper.ins.lastSaveTemplate = msg.ruleInfo;
		 Global.mgr.socketMgr.send(-1 , msg);
	}
	/**保存*/
	 onSaveClick(){
		let temp:TableRuleTempl = new TableRuleTempl();
		temp.rule = this.getCreateInfo();
		temp.name = (this.itemArray[0] as BaseRuleItem).getRuleName();
		let msg : Msg_CS_ReqSaveRoomRuleTemplate = new Msg_CS_ReqSaveRoomRuleTemplate();
		msg.ruleInfo =  temp;
		CreateRoomHelper.ins.lastSaveTemplate = msg.ruleInfo;
		 Global.mgr.socketMgr.send(-1 , msg);
	}
	/**开局*/
	 onBeginClick(){
		let ruleInfo : TableRuleInfo = this.getCreateInfo();
		let msg : Msg_CS_CreateTable = new Msg_CS_CreateTable();
		msg.info = ruleInfo;
		msg.name = (this.itemArray[0] as BaseRuleItem).getRuleName();
		 Global.mgr.socketMgr.send(-1 , msg);
	}

	disTory(){
		this.clearElements();
		super.disTory();
	}
}
