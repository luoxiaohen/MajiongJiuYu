// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UserInfo from "../../Game/info/UserInfo";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HallSettingPanel extends UIBase {

    @property(cc.Toggle)
    soundToggle:cc.Toggle=null;
    @property(cc.Toggle)
    chatToggle:cc.Toggle=null;
    @property(cc.Toggle)
    sharkToggle:cc.Toggle=null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private soundKey="setting_sound";
    private chatKey="setting_chat";
    private sharkKey="setting_shark";
    start () {
        this.setInitValue();
    }
    private setInitValue():void{
        this.soundKey=UserInfo.ins.myInfo.aid+"_"+this.soundKey;
        this.chatKey=UserInfo.ins.myInfo.aid+"_"+this.chatKey;
        this.sharkKey=UserInfo.ins.myInfo.aid+"_"+this.sharkKey;

        this.setDefaultData(this.chatKey,this.chatToggle);
        this.setDefaultData(this.sharkKey,this.sharkToggle);
        this.setDefaultData(this.soundKey,this.soundToggle);
        this.setChange(this.soundToggle);
        this.setChange(this.chatToggle);
        this.setChange(this.sharkToggle);
    }
    private setDefaultData(key:string,toggle:cc.Toggle):void{
        let localData=Global.Utils.getlocalStorageItem(key);
        if(localData){
            toggle.isChecked=localData=="1";
        }else{
            toggle.isChecked=true;
            Global.Utils.setlocalStorageItem(key,"1");
        }
    }
    onToggleClick(event,arg):void{
        let toggle: cc.Toggle = null;
        let key="";
        switch (arg) {
            case "0":
                key=this.soundKey;
                toggle = this.soundToggle;
                break;
            case "1":
                key=this.chatKey;
                toggle = this.chatToggle;
                break;
            case "2":
                key=this.sharkKey;
                toggle = this.sharkToggle;
                break;
        }
        this.tweenChange(toggle);
        Global.Utils.setlocalStorageItem(key,toggle.isChecked?"1":"0");

       
    }
    private tweenChange(toggle:cc.Toggle):void{
        let flag = toggle.node.getChildByName("flag");
        if(toggle.isChecked){
            cc.tween(flag).to(0.2,{x:41}).start();
        }else{
            cc.tween(flag).to(0.2,{x:-41}).start();
        }
    }
    private setChange(toggle:cc.Toggle):void{
        let flag = toggle.node.getChildByName("flag");
        if(toggle.isChecked){
            flag.x=40;
        }else{
            flag.x=-40;
        }
    }
    onAccountClick():void{
        Global.Utils.dialogOutTips("打开账号管理");
    }
    onChangePasswordClick():void{
        Global.Utils.dialogOutTips("打开修改密码");
    }
    onAboutUsClick():void{
        Global.Utils.dialogOutTips("打开关于我们");
    }
    onClearStorgeClick():void{
        Global.Utils.dialogOutTips("打开清理缓存");
    }
    onCloseClick():void{
        this.disTory();
    }

    // update (dt) {}
}
