// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BaseMsg } from "../proto/BaseMsg";
import { Msg_CS_GMMsg } from "../proto/LobbyMsg";
import { Msg_CS_TGMMsg, Msg_CS_GGMMsg } from "../proto/TableExMsg";
import { Global } from "../Shared/GloBal";
import UIBase from "../UIBase";
import GetCardPanel from "./GetCardPanel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GMTips extends UIBase {

    @property(cc.EditBox)
    valueLabel: cc.EditBox = null;
    @property(cc.EditBox)
    keyLabel: cc.EditBox = null;
    @property(cc.EditBox)
    belongLabel: cc.EditBox = null;
    @property(cc.Button)
    goBtn: cc.Button = null;

    private belong:number = 4;
	private key:string = "ag";
	private values : string = "1000";
    protected onLoad(): void {
		this.belongLabel.string = this.belong.toString()
		this.keyLabel.string = this.key;
		this.valueLabel.string = this.values;
    }
	onGoClick(){
		this.belong = Number(this.belongLabel.string);
		this.key = this.keyLabel.string;
		this.values = this.valueLabel.string;

		if(this.belong == 1){
			let msg1:Msg_CS_GMMsg = new Msg_CS_GMMsg();
			msg1.cmd = this.key;
			msg1.gmMsg = this.values;
            Global.mgr.socketMgr.send(-1 , msg1);
		}
		if(this.belong == 2){
			let msg1:Msg_CS_TGMMsg = new Msg_CS_TGMMsg();
			msg1.cmd = this.key;
			msg1.gmMsg = this.values;
            Global.mgr.socketMgr.send(-1 , msg1);
		}
		if(this.belong == 3){
			let msg1:Msg_CS_GGMMsg = new Msg_CS_GGMMsg();
			msg1.cmd = this.key;
			msg1.gmMsg = this.values;
            Global.mgr.socketMgr.send(-1 , msg1);
		}
        if(this.belong == 4){
            let cardPanel : GetCardPanel = cc.instantiate(Global.Utils.getPreFabBySource("tips/GetCardPanel/prefab/GetCardPanel")).getComponent(GetCardPanel);
			this.node.parent.addChild(cardPanel.node);
			cardPanel.node.x = -960;
			cardPanel.node.y = -540;
		}
		if(this.belong==5){
			let arr=[];
			switch(this.values){
				case "0":
					arr=[1,1,1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9,9];
					break;
				case "1":
					arr=[11,11,11, 12, 13, 14, 15, 16, 17, 18, 19, 19, 19,19];
					break;
				case "2":
					arr=[21,21,21, 22, 23, 24, 25, 26, 27, 28, 29, 29, 29,29];
					break;
				case "3":
					arr=[2, 3, 4, 5, 6, 7, 12,13,14,12,13,14,15,15];
					break;
			}
			let msg : Msg_CS_TGMMsg = new Msg_CS_TGMMsg();
			msg.cmd = "wanth";
			msg.gmMsg = arr.toString();
			Global.mgr.socketMgr.send(-1 , msg);
			
		}
		this.disTory();
	}
	private fun:Function;
	onRemove(fun){
		this.fun = fun;
	}
	public disTory(){
		if(this.node.parent){
			this.node.parent.removeChild(this.node);
			Global.Utils.invokeCallback(this.fun, null);
			this.destroy();
		}
	}
}
