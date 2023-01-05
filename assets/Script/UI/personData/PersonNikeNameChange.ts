// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UserInfo from "../../Game/info/UserInfo";
import { Msg_CS_ChangeNike } from "../../proto/LobbyMsg";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PersonNikeNameChange extends UIBase {

    @property(cc.Label)
    cost_label: cc.Label = null;

    @property(cc.Label)
    sum_diamond_label: cc.Label = null;
    @property(cc.EditBox)
    nike_editbox:cc.EditBox=null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private costNum=1;
    start () {
        this.nike_editbox.string=UserInfo.ins.myInfo.nike;
        this.cost_label.string=this.costNum+"";
        this.sum_diamond_label.string=UserInfo.ins.myInfo.diam+"";
    }
    onConfirmBtnClick():void{
        if(this.nike_editbox.string==""){
            Global.Utils.dialogOutTips("昵称不能为空!");
            return;
        }
        if(this.costNum>UserInfo.ins.myInfo.diam){
            Global.Utils.dialogOutTips("钻石不足!");
            return;
        }
        let msg:Msg_CS_ChangeNike=new Msg_CS_ChangeNike();
        msg.nike=this.nike_editbox.string;
        Global.mgr.socketMgr.send(-1,msg);
        this.disTory();
    }
    onConcelBntnClick():void{
        this.disTory();
    }

    // update (dt) {}
}
