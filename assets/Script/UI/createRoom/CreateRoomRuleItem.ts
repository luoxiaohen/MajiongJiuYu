// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventType from "../../event/EventType";
import { TableRuleInfo, TableRuleTempl } from "../../proto/LobbyMsgDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CreateRoomRuleItem extends UIBase{
	public _height:number = 0;
	public itemWeights : number = 0;
	public changeHeight : number = 0;
	public isMoveUp : boolean = false;

	public tableInfo:TableRuleInfo = new TableRuleInfo();

	
	public ruleInfo : TableRuleInfo
	public ruleTemplate : TableRuleTempl;
    public getHeight():number{
		return this._height;
	}
	public setData(temp : TableRuleTempl){
		this.ruleTemplate = temp;
		this.ruleInfo = this.ruleTemplate ? this.ruleTemplate.rule : null;
	}
	public reviseChangeHeight(isAdd : boolean){
		if(isAdd){
			this._height += this.changeHeight;
		}else{
			this._height -= this.changeHeight;
		}
	}
	public getSelectData():TableRuleInfo{

		return this.tableInfo;
	}

	public disPatchMove(item:CreateRoomRuleItem){
		Global.EventCenter.dispatchEvent(EventType.GameRuleItemMove , item);
	}

	disTory(){
		super.disTory()
	}
}
