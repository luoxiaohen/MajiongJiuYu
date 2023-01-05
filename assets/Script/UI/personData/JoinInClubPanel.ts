// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIViewZorderEnum } from "../../enum/EnumManager";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class JoinInClubPanel extends UIBase {
    // LIFE-CYCLE CALLBACKS:
    public z_order: UIViewZorderEnum=UIViewZorderEnum.HallPanels;
    // onLoad () {}

    start () {

    }
    onCloseBtnClick():void{
        this.disTory();
    }
    onCompletBtnClick():void{
         let callBackFuc:Function=this.dialogParameters.callback;
         let caller=this.dialogParameters.caller;
         if(callBackFuc&&caller){
            callBackFuc.call(caller)
         }
         Global.DialogManager.createDialog('mainLobby/prefab/MainLobbyPanel', null, ()=>{
            Global.DialogManager.destroyDialog('personData/prefab/PersonEditPanel');
            this.disTory();
        })
    }

    // update (dt) {}
}
