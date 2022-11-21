// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { AntesMultipleEnum } from "../../enum/EnumManager";
import EventType from "../../event/EventType";
import GameInfo from "../../Game/info/GameInfo";
import UserInfo from "../../Game/info/UserInfo";
import TimeAndMoveManager from "../../mgr/TimeAndMoveManager";
import { GamePlayTypeEnum, GameRoomTypeEnum, TableRuleInfo, TableRuleTempl } from "../../proto/LobbyMsgDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import CreateCheckItem from "./CreateCheckItem";
import CreateRoomHelper from "./CreateRoomHelper";
import CreateRoomRuleItem from "./CreateRoomRuleItem";
import GetAddOrRemoveItem from "./GetAddOrRemoveItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseRuleItem extends CreateRoomRuleItem {
    @property (cc.Node)
    xuezhanBtn : cc.Node = null;
    @property (cc.Node)
    huansanBtn : cc.Node = null;
    @property (cc.Node)
    roomBtn_0 : cc.Node = null;
    @property (cc.Node)
    roomBtn_1 : cc.Node = null;
    @property (cc.Node)
    roomBtn_2 : cc.Node = null;
    @property (cc.Node)
    roomBtn_3 : cc.Node = null;
    @property (cc.EditBox)
    roomNameInputLabel : cc.EditBox = null;
    @property (cc.Button)
    shousuQustionBtn : cc.Button = null;
    @property (cc.Button)
    dairuQustionBtn : cc.Button = null;
    @property (cc.Label)
    dizhuLabel : cc.Label = null;
    @property(cc.Label)
    dairuLabel : cc.Label = null;
    @property (cc.Label)
    myHaveCoinsLabel : cc.Label = null;
    @property (cc.Sprite)
    proImage : cc.Sprite = null;
    @property (cc.Sprite)
    proSlitImage : cc.Sprite = null;
    @property (GetAddOrRemoveItem)
    handsCntItem : GetAddOrRemoveItem = null;
    @property (GetAddOrRemoveItem)
    ceilingItem : GetAddOrRemoveItem = null;
    @property (CreateCheckItem)
    tiFanBox : CreateCheckItem = null;
    @property (CreateCheckItem)
    tifanBox2 : CreateCheckItem = null;
    @property (CreateCheckItem)
    tifanBox4 : CreateCheckItem = null;
    @property (CreateCheckItem)
    tifanBox8 : CreateCheckItem = null;
    @property (cc.Node)
    tiFanGroup : cc.Node = null;

    private nowGamePlayType : GamePlayTypeEnum = GamePlayTypeEnum.XueZhanDaoDi;
	private nowSelectGroup : cc.Node;

	private nowRoomType : GameRoomTypeEnum = GameRoomTypeEnum.SiRenSanFang;
	private nowSelectRoomBtn : cc.Node;


	private nowAntesIndex : number = 0;

	private nowSelectHand:number = 0;

	private nowSelectMut : number = 1;

	private nowSelectTiFan : number = 0;

	private _distance:cc.Vec2 = cc.v2(0,0);
	private _touchStatus : boolean = false;


    protected onLoad(): void {
    }
	public setData(temp: TableRuleTempl): void {
		super.setData(temp);
        this.initElements();
	}
	public getHeight():number{
		return this.nowSelectTiFan ? 1331 : 1106;
	}
    private initElements(){
        GameInfo.ins.addItemToMultipleArray(AntesMultipleEnum.initial) ;
        this.itemWeights = 999;
		this.changeHeight = 225;
		this._height = 1106;
        if(this.ruleInfo){
			this.showLast();
		}else{
            let fontImage : cc.Sprite;
			this.nowSelectGroup = this.xuezhanBtn;
            fontImage = cc.find("/oneImage" , this.nowSelectGroup).getComponent(cc.Sprite);
            fontImage.node.opacity  = 255;
			this.nowSelectRoomBtn = this.roomBtn_0;
            fontImage = cc.find("/btnImage" , this.nowSelectRoomBtn).getComponent(cc.Sprite);
            fontImage.node.opacity = 255;
		}
		this._height = this.getHeight();
		this.initItem()
		this.addEvent();
    }
	private addEvent(){
		this.xuezhanBtn.on(cc.Node.EventType.TOUCH_START , this.onXueZhanClick , this);
		this.huansanBtn.on(cc.Node.EventType.TOUCH_START , this.onXueZhanClick , this);

		this.roomBtn_0.on(cc.Node.EventType.TOUCH_START , this.onRoomBtnClick , this);
		this.roomBtn_1.on(cc.Node.EventType.TOUCH_START , this.onRoomBtnClick , this);
		this.roomBtn_2.on(cc.Node.EventType.TOUCH_START , this.onRoomBtnClick , this);
		this.roomBtn_3.on(cc.Node.EventType.TOUCH_START , this.onRoomBtnClick , this);

		Global.EventCenter.addEventListener(EventType.CreateRoom_Check_Click , this.onCheckClick , this);
		
		this.proSlitImage.node.on(cc.Node.EventType.TOUCH_START , this.onProBegin , this);
		this.proSlitImage.node.on(cc.Node.EventType.TOUCH_CANCEL , this.onProCancelEnd , this);
		this.proSlitImage.node.on(cc.Node.EventType.TOUCH_END , this.onProEnd , this);


		this.dairuQustionBtn.node.on(cc.Node.EventType.TOUCH_START , this.onDaiRuClick , this);
		this.shousuQustionBtn.node.on(cc.Node.EventType.TOUCH_START , this.onShousuQustionBtnClick , this);

		
		Global.EventCenter.addEventListener(EventType.OpenRoomUseChange , this.onRoomOpenUseChange , this);
	}
	private onRoomOpenUseChange(){
		this.setAntesLabel(CreateRoomHelper.ins.antesArr[this.nowAntesIndex]);
	}
	private onDaiRuClick(){
		Global.EventCenter.dispatchEvent(EventType.CreateRoomRuleTipsClick , 1);
	}
	private onShousuQustionBtnClick(){
		Global.EventCenter.dispatchEvent(EventType.CreateRoomRuleTipsClick , 2);
	}
	private moveNum:number = 0;
	private onProBegin(e){
		this.moveNum = 0;
		Global.EventCenter.dispatchEvent(EventType.RuleMoveAndScrollerMove);
		this._distance.x = e.getLocation().x - this.proSlitImage.node.x;
        this._touchStatus = true;
		this.node.on(cc.Node.EventType.TOUCH_MOVE , this.onProMove , this);
	}
	private onProCancelEnd(e){
		this.moveNum++;
		if(this.moveNum == 2){
			this.callEnd();
		}
	}
	private callEnd(){
		if( this._touchStatus){
			Global.EventCenter.dispatchEvent(EventType.RuleMoveAndScrollerMoveOver);
			this._touchStatus = false;
			this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onProMove, this);
			this.showPro(this.proSlitImage.node.x)
			this.moveNum = 0;
		}
	}
	private onProMove(e:cc.Event.EventTouch){
		if (this._touchStatus) {
			if(e.getLocation().x - this._distance.x <= 0){
            	this.proSlitImage.node.x = 0;
			}else if(e.getLocation().x - this._distance.x >=  this.proImage.node.width - this.proSlitImage.node.width){
				this.proSlitImage.node.x = this.proImage.node.width - this.proSlitImage.node.width - 35;
			}
			else{
            	this.proSlitImage.node.x = e.getLocation().x - this._distance.x - 35;
			}
			if(this.proSlitImage.node.x < 0){
				this.proSlitImage.node.x = 0;
			}
			this.showPro(this.proSlitImage.node.x)
        }
	}
	private onProEnd(e){
		this.callEnd();
	}
	private showPro(nowX : number){
		let allLv : number = CreateRoomHelper.ins.antesArr.length;
		let allWidth : number = this.proImage.node.width - this.proSlitImage.node.width;
		let one : number = allWidth / allLv;
		let now : number = this.proSlitImage.node.x / one;
		now = Number( now.toFixed(0) );
		this.proImage.node.x = -917 + this.proSlitImage.node.x + this.proSlitImage.node.width;
		this.nowAntesIndex = now - 1 >= 0 ? now - 1 : 0;
		this.setAntesLabel(CreateRoomHelper.ins.antesArr[this.nowAntesIndex]);
	}
	private onCheckClick(e,data){
		let item : CreateCheckItem = data;
		switch(item.boxValue){
			case 1:
				//梯番点击
				this.onTifanBoxClick();
			break;
			case 2:
			case 3:
			case 4:
				//梯番子项点击
				this.tifanBox2.showSelect(false);
				this.tifanBox4.showSelect(false);
				this.tifanBox8.showSelect(false);
				if(item.isCheck()==false){
					this.nowSelectTiFan = item.boxValue - 1;
					if(this.nowSelectTiFan > 0){
						(this["tifanBox" + CreateRoomHelper.ins.allGameTiFanArr[this.nowSelectTiFan]] as CreateCheckItem).showSelect(true);
					}
				}else{
					item.showSelect(true);
				}
			break;
		}
	}
	private onTifanBoxClick(){
		if(CreateRoomHelper.ins.gameRuleItemIsMove){
			return;
		}
		let box : CreateCheckItem = this.tiFanBox;
		if(box.isCheck()){
			this.nowSelectTiFan = 1;
			this.isMoveUp = false;
			CreateRoomHelper.ins.gameRuleItemIsMove = true;
			this.tiFanGroup.active = true;
			cc.tween(this.tiFanGroup).to(this.changeHeight*TimeAndMoveManager.ins.gameRuleItemMoveTime , {scaleY : 1 , opacity : 255}).call(()=>{
				CreateRoomHelper.ins.gameRuleItemIsMove = false;
			}).start();
			this.disPatchMove(this);
		}else{
			this.nowSelectTiFan = 0;
			this.isMoveUp = true;
			CreateRoomHelper.ins.gameRuleItemIsMove = true;
			cc.tween(this.tiFanGroup).to(this.changeHeight*TimeAndMoveManager.ins.gameRuleItemMoveTime/2 , {opacity : 0}).start();
			cc.tween(this.tiFanGroup).to(this.changeHeight*TimeAndMoveManager.ins.gameRuleItemMoveTime , {scaleY : 0}).call(()=>{
				CreateRoomHelper.ins.gameRuleItemIsMove = false;
				this.tiFanGroup.active = false;
			}).start();
			this.disPatchMove(this);
		}
		this.initTiFanGroup()
	}
	private onRoomBtnClick(e){
		let clickGrou:cc.Node = e.currentTarget as cc.Node;
		this.showSelectRoomBtn(clickGrou)
		
	}
	private onXueZhanClick(e){
		let clickGrou:cc.Node = e.currentTarget as cc.Node;
		let type : GamePlayTypeEnum = clickGrou.name == "gamePlay1" ? GamePlayTypeEnum.XueZhanDaoDi : GamePlayTypeEnum.HuanSanZhang;
		Global.EventCenter.dispatchEvent(EventType.GameRuleChangePlayType , type)
		this.showSelectGroup(clickGrou)
		if(type == GamePlayTypeEnum.XueZhanDaoDi){
			GameInfo.ins.removeItemByMultipleArray(AntesMultipleEnum.changeThree);
		}else{
			GameInfo.ins.addItemToMultipleArray(AntesMultipleEnum.changeThree);
		}
		Global.EventCenter.dispatchEvent(EventType.OpenRoomUseChange);
	}
    private initItem(){
		this.myHaveCoinsLabel.string = UserInfo.ins.myInfo.gold.toString();
		this.showSelectHands();
		this.showSelectMut();
		this.initAntes();
		this.showTiFan();
	}
    private showTiFan(){
		if(this.nowSelectTiFan == 0){
			this.tiFanBox.setData(1 , false , 1 , true);
		}else{
			this.tiFanBox.setData(1 , true , 1 , true);
		}
		this.initTiFanGroup();
	}
	private initTiFanGroup(){
		this.tifanBox2.setData(2 , false , 2 , true);
		this.tifanBox4.setData(3 , false , 2 , true);
		this.tifanBox8.setData(4 , false , 2 , true);
		if(this.nowSelectTiFan > 0){
			(this["tifanBox" + CreateRoomHelper.ins.allGameTiFanArr[this.nowSelectTiFan]] as CreateCheckItem).showSelect(true);
		}
	}
    private initAntes(){
		let arr : Array<number> = CreateRoomHelper.ins.antesArr;
		this.setAntesLabel(arr[this.nowAntesIndex]);

		this.initPro( arr);
	}
    private initPro(allArr : Array<number>){
		let oneWidth : number = 917 / allArr.length;
		let move : number = this.nowAntesIndex * oneWidth - 56/2;
		this.proSlitImage.node.x = move < 0 ? 0 : move;
	}
    private showSelectMut(){
        this.ceilingItem.setData(CreateRoomHelper.ins.allGameMultipleStringArr , this.nowSelectMut , "封顶" , this.onMutChange , this)
	}
	private onMutChange(){
		this.nowSelectMut = this.ceilingItem.currLv;
	}
    private showSelectHands(){
        this.handsCntItem.setData(CreateRoomHelper.ins.allGameHnadsArr , this.nowSelectHand , "手数" , this.onHandChange , this)
		if(this.nowSelectHand == CreateRoomHelper.ins.allGameHnadsArr.length-1){
			GameInfo.ins.addItemToMultipleArray(AntesMultipleEnum.moreHand);
		}
		this.setAntesLabel(CreateRoomHelper.ins.antesArr[this.nowAntesIndex]);
		Global.EventCenter.dispatchEvent(EventType.OpenRoomUseChange);
	}
	private onHandChange(){
		this.nowSelectHand = this.handsCntItem.currLv;
		if(this.nowSelectHand == CreateRoomHelper.ins.allGameHnadsArr.length-1){
			GameInfo.ins.addItemToMultipleArray(AntesMultipleEnum.moreHand);
		}else{
			GameInfo.ins.removeItemByMultipleArray(AntesMultipleEnum.moreHand);
		}
		Global.EventCenter.dispatchEvent(EventType.OpenRoomUseChange);
	}
    private setAntesLabel(nowAntes : number){
		this.dizhuLabel.string = nowAntes.toString();
		let allMut : number = 0;
		let isOpenBookmakerMustBuyHorse : boolean = false;
		for(let i = 0 ; i < GameInfo.ins.getnowMultipleArray().length ; i++){
			switch(GameInfo.ins.getnowMultipleArray()[i]){
				case AntesMultipleEnum.initial:
					allMut += CreateRoomHelper.ins.initialMultiple;
				break;
				case AntesMultipleEnum.openBuyHorse:
					allMut += CreateRoomHelper.ins.openBuyHorseMultiple;
				break;
				case AntesMultipleEnum.openDouble:
					allMut += CreateRoomHelper.ins.openDoubleMultiple;
				break;
				case AntesMultipleEnum.moreHand:
					allMut += CreateRoomHelper.ins.moreHandMultiple;
				break;
				case AntesMultipleEnum.changeThree:
					allMut += CreateRoomHelper.ins.changeThreeMultiple;
				break;
				case AntesMultipleEnum.openBookmakerMustBuyHorse:
					isOpenBookmakerMustBuyHorse = true;
				break;
			}
		}
		let allFen : number = nowAntes*allMut;
		if(isOpenBookmakerMustBuyHorse){
			allFen *= CreateRoomHelper.ins.openBookmakerMustBuyHorseMultiple;
		}
		this.dairuLabel.string = allFen.toString();
		let have : number = UserInfo.ins.myInfo.gold
		this.myHaveCoinsLabel.node.color = have >= allFen ? new cc.Color(172,182,187,255) : new cc.Color(206,61,61,255);
	}
	private showLast(){
		let info : TableRuleInfo = this.ruleInfo;
		this.nowGamePlayType = info.gamePlayType;
		if(info.gamePlayType == GamePlayTypeEnum.XueZhanDaoDi){
			this.nowSelectGroup = this.xuezhanBtn;
		}else{
			this.nowSelectGroup = this.huansanBtn;
		}
		this.showSelectGroup(this.nowSelectGroup);


		this.nowRoomType = info.roomType;
		let arr:Array<cc.Node> = [this.roomBtn_0 , this.roomBtn_1 , this.roomBtn_2 , this.roomBtn_3];
		for(let i = 0 ; i < arr.length ; i++){
			if(Number(arr[i].name.split("_")[1]) == this.nowRoomType){
				this.nowSelectRoomBtn = arr[i];
			}
		}
		this.showSelectRoomBtn(this.nowSelectRoomBtn);
		this.roomNameInputLabel.string = this.ruleTemplate ? this.ruleTemplate.name : ""; 
		this.nowAntesIndex = CreateRoomHelper.ins.antesArr.indexOf(info.baseScore)
		this.nowSelectHand = CreateRoomHelper.ins.allGameHnadsArr.indexOf(info.handsCnt);
		this.nowSelectMut = CreateRoomHelper.ins.allGameMultipleArr.indexOf(info.ceiling);
		this.nowSelectTiFan = CreateRoomHelper.ins.allGameTiFanArr.indexOf (info.tiFan);
		if(this.nowSelectTiFan){
            this._height = 1331;
			this.tiFanGroup.scaleY = 1;
			this.tiFanGroup.active = true;
		}else{
            this._height = 1106;
			this.tiFanGroup.scaleY = 0;
			this.tiFanGroup.active = false;
		}
	}
    private showSelectRoomBtn(clickGrou:cc.Node){
        let fontImage : cc.Sprite;
		if(this.nowSelectRoomBtn){
            fontImage = cc.find("/btnImage" , this.nowSelectRoomBtn).getComponent(cc.Sprite);
            fontImage.node.opacity = 0;
		}
		this.nowSelectRoomBtn = clickGrou;
        fontImage = cc.find("/btnImage" , this.nowSelectRoomBtn).getComponent(cc.Sprite);
        fontImage.node.opacity = 255;
		let names : string = clickGrou.name;
		this.nowRoomType = Number(names.split("_")[1]) + 1;
	}

    private showSelectGroup(clickGrou:cc.Node){
        let fontImage : cc.Sprite;
		if(this.nowSelectGroup){
            fontImage = cc.find("/oneImage" , this.nowSelectGroup).getComponent(cc.Sprite);
            fontImage.node.opacity = 0;
		}
		this.nowSelectGroup = clickGrou;
		fontImage = cc.find("/oneImage" , this.nowSelectGroup).getComponent(cc.Sprite);
            fontImage.node.opacity = 255;
		this.nowGamePlayType = clickGrou.name == "xuezhanBtn" ? GamePlayTypeEnum.XueZhanDaoDi : GamePlayTypeEnum.HuanSanZhang;
	}


	public getRuleName():string{
		return this.roomNameInputLabel.string;
	}


	public getSelectData():TableRuleInfo{
		for(let key in this.tableInfo){
			this.tableInfo[key] = null;
		}
		this.tableInfo.gamePlayType = this.nowGamePlayType;
		this.tableInfo.roomType = this.nowRoomType;
		this.tableInfo.baseScore = CreateRoomHelper.ins.antesArr[this.nowAntesIndex];
		this.tableInfo.handsCnt = CreateRoomHelper.ins.allGameHnadsArr[this.nowSelectHand]
		this.tableInfo.ceiling = CreateRoomHelper.ins.allGameMultipleArr[this.nowSelectMut];
		this.tableInfo.tiFan = CreateRoomHelper.ins.allGameTiFanArr[this.nowSelectTiFan];
		return this.tableInfo;
	}


	public disTory(){
		super.disTory()
	}


}
