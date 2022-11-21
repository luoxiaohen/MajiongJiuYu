// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Msg_CS_FindEnterRoom } from "../../proto/TableMsg";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CreateRommAndFriendPanel extends UIBase {
    @property (cc.Button)
    joiRoomnBtn : cc.Button = null;
    @property (cc.Button)
    createRoomBtn : cc.Button = null;
    @property (cc.Button)
    roomStyleBtn : cc.Button = null;
    @property (cc.EditBox)
    idInputText : cc.EditBox = null;
    @property (cc.Label)
    IdLabel_0 : cc.Label = null;
    @property (cc.Label)
    IdLabel_1 : cc.Label = null;
    @property (cc.Label)
    IdLabel_2 : cc.Label = null;
    @property (cc.Label)
    IdLabel_3 : cc.Label = null;
    @property (cc.Label)
    IdLabel_4 : cc.Label = null;
    @property (cc.Label)
    IdLabel_5 : cc.Label = null;


    private callBack:Function;
    private thisObj : any;
    private nowRoomId:string = "";
    protected onLoad(): void {
        this.changeLabel(this.nowRoomId);
        this.idInputText.node.on("text-changed" , this.onBoxChange , this);
        
    }
    public setCallBack(callBack : Function , thisObj:any){
        this.callBack = callBack;
        this.thisObj = thisObj;
    }
    private onBoxChange(editbox, customEventData){
        let str:string = this.idInputText.string;
        this.changeLabel(str);
		this.nowRoomId = str;
    }
    private changeLabel(str:string){
        for(let i = 0 ; i < 6 ; i++){
            if(i < str.length){
                (this["IdLabel_" + i] as cc.Label).string = str.charAt(i);
            }else{
                (this["IdLabel_" + i] as cc.Label).string = "";
            }
        }
    }
    onStyleBtnClick(){
		this.callBack.bind(this.thisObj)(1);
	}
	onCreateRoomClick(){
		this.callBack.bind(this.thisObj)(2);
	}

	onJoinRoomClick(){
		if(this.nowRoomId.length == 6){
			let msg:Msg_CS_FindEnterRoom = new Msg_CS_FindEnterRoom();
			msg.code = Number(this.nowRoomId);
			Global.mgr.socketMgr.send(-1,msg);
		}
	}

    disTory(){
        if(this.node.parent){
            this.idInputText.node.off("text-changed" , this.onBoxChange , this);
            this.node.parent.removeChild(this.node);
            this.destroy();
        }
    }

}
