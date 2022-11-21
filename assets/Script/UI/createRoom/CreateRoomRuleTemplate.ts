// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventType from "../../event/EventType";
import GameInfo from "../../Game/info/GameInfo";
import { Msg_CS_CreateTable, Msg_CS_ReqDeletRoomRuleTemplate } from "../../proto/LobbyMsg";
import { TableRuleTempl } from "../../proto/LobbyMsgDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import CreateRoomHelper from "./CreateRoomHelper";
import CreateRoomRuleTemplateItem from "./CreateRoomRuleTemplateItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CreateRoomRuleTemplate extends UIBase {
    @property (cc.Sprite)
    backGroup : cc.Sprite = null;
    @property (cc.Label)
    mobanName : cc.Label = null;
    @property (cc.Label)
    createLabel : cc.Label  =null;
    @property (cc.Button)
    createRoomBtn : cc.Button = null;
    @property (cc.Node)
    haveGroup : cc.Node = null;
    @property (cc.Node)
    nullGroup : cc.Node = null;
    @property (cc.Button)
    createTemplateBtn : cc.Button = null;


    private ruleInfoArr : Array<TableRuleTempl>;
	private itemArr:Array<CreateRoomRuleTemplateItem> = [];
	private selectItem : CreateRoomRuleTemplateItem;
	private callBack : Function;
	private thisObj : any;
    protected onLoad(): void {
        
    }

    setData (ruleInfoArr : Array<TableRuleTempl> , callBack : Function, thisObj : any){
        this.callBack = callBack;
		this.thisObj = thisObj;
		this.ruleInfoArr = ruleInfoArr;
		this.createElements();
    }
    private createElements(){
        this.mobanName.string = "牌桌模板(" + this.ruleInfoArr.length + "/" + CreateRoomHelper.ins.gameMaxTemplateNum + ")";
		let canCreate : boolean = this.ruleInfoArr.length > 0;
		this.createRoomBtn.node.active = canCreate ? true : false;
        this.addEvent();
		this.addChilds();
    }
    private addEvent(){
		Global.EventCenter.addEventListener(EventType.RspDeletRoomRuleTemplate , this.onDeletBack , this);
    }
    private addChilds(){
        if(this.ruleInfoArr.length > 0){
			this.nullGroup.active = false;
			this.haveGroup.active = true;
			this.createItem();
		}else{
			this.nullGroup.active = true;
			this.haveGroup.active = false;
		}
    }
    private createItem(){
		this.haveGroup.removeAllChildren();
		let item:CreateRoomRuleTemplateItem;
		for(let i = 0 ; i < this.ruleInfoArr.length ; i++){
            item = cc.instantiate(Global.Utils.getPreFabBySource("createRoom/prefab/CreateRoomRuleTemplateItem")).getComponent(CreateRoomRuleTemplateItem);
			if(i == 0 ){
				this.selectItem = item;
				this.selectItem.setSelect(true);
			}
            item.setData(this.ruleInfoArr[i] , this.onItemClickBack , this)
            this.haveGroup.addChild(item.node);
		}
	}
    /**
	 * @param 1: select 2  change  3 delet 4 other
	*/
	private onItemClickBack(item : CreateRoomRuleTemplateItem ,type:number){
		switch(type){
			case 1:
			this.onSelectItem(item);
			break;
			case 2:
			this.onChangeItem(item);
			break;
			case 3:
			this.onDeletItem(item);
			break;
		}

	}
	private onSelectItem(item : CreateRoomRuleTemplateItem){
		if(item.getSelect()){
			return;
		}
		this.selectItem.setSelect(false);
		this.selectItem = item;
		this.selectItem.setSelect(true);
	}
	private onChangeItem(item : CreateRoomRuleTemplateItem){
		this.callBack.bind(this.thisObj)(4 , item.getRuleInfo());
	}
	private onDeletItem(item : CreateRoomRuleTemplateItem){
		let msg : Msg_CS_ReqDeletRoomRuleTemplate = new Msg_CS_ReqDeletRoomRuleTemplate();
		msg.tempId = item.getRuleInfo().templId;
		Global.mgr.socketMgr.send(-1,msg);
	}

	private onDeletBack(){
		this.ruleInfoArr = CreateRoomHelper.ins.getCreateRoomRuleArr();
		this.createElements();
	}
	onCreateOneClick(){
		this.callBack.bind(this.thisObj)(2);
	}
	onCrerateRoomClick(){
		let msg : Msg_CS_CreateTable = new Msg_CS_CreateTable();
		msg.info = this.selectItem.getRuleInfo().rule;
		msg.name = this.selectItem.getRuleName();; 
		Global.mgr.socketMgr.send(-1,msg);
		this.callBack.bind(this.thisObj)(3);

	}
	onBackClick(){
		this.callBack.bind(this.thisObj)(1);
	}
	onCreateTemplateClick(){
		if(this.ruleInfoArr.length >= CreateRoomHelper.ins.gameMaxTemplateNum){
			Global.Utils.dialogOutput("模板保存已达上限,请先删除再创建");
		}else{
			this.callBack.bind(this.thisObj)(2);
		}
	}

    disTory(){
        super.disTory()
    }
}
