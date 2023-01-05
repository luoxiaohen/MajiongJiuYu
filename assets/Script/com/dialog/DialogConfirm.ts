// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import { CallBack } from "../CallBack";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DialogConfirm extends UIBase {

    @property(cc.Label)
    content: cc.Label = null;
    // LIFE-CYCLE CALLBACKS:
    @property(cc.Button)
    confirmBtn: cc.Button = null;
    @property(cc.Button)
    cancelBtn: cc.Button = null;
    private confirmCallBack:CallBack=null;
    private cancelCallBack:CallBack=null;
    /**触发关闭事件 */
    private eventTypes:string[]=[];
    onLoad () {
       
    }
    start () {
        let dialogType=this.dialogParameters.dialogType;
        this.cancelBtn.node.active=dialogType==2;
        if(dialogType==1){
            this.confirmBtn.node.x=0;
        }
        this.content.string=this.dialogParameters.content;
        this.confirmCallBack=this.dialogParameters.confirm;
        this.cancelCallBack=this.dialogParameters.cancel;
        this.eventTypes=this.dialogParameters.eventTypes;
        this.addEvent();
    }
    addEvent():void{
        for(let item of this.eventTypes){
            Global.EventCenter.addEventListener(item,this.onCloseDialog,this);
        }
    }
    removeEvent():void{
        for(let item of this.eventTypes){
            Global.EventCenter.removeEventListener(item,this.onCloseDialog,this);
        }
    }
    onConfirmClick():void{
        this.confirmCallBack&&this.confirmCallBack.excute();
        this.disTory();
    }
    onCancelClick():void{
        this.cancelCallBack&&this.cancelCallBack.excute();
        this.disTory();
    }
    private onCloseDialog():void{
        this.removeEvent();
        this.disTory();
    }

    // update (dt) {}
}
