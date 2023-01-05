// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CallBack } from "../../com/CallBack";
import { PlayStauteEnum } from "../../enum/EnumManager";
import EventType from "../../event/EventType";
import GameInfo from "../../Game/info/GameInfo";
import UserInfo from "../../Game/info/UserInfo";
import { MainManager } from "../../MainManager";
import { Msg_CS_LeaveRoom, Msg_CS_RqCloseGame } from "../../proto/TableMsg";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import CardHelpManager from "../card/CardHelpManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SettingPanel extends UIBase {
    // LIFE-CYCLE CALLBACKS:

    private dissroomBtn:cc.Node;
    private exitBtn:cc.Node;
    private btn_bg:cc.Sprite;
    onLoad () { 
        let contentNode=this.node.getChildByName("content");
        this.dissroomBtn=contentNode.getChildByName("dissroom_btn");
        this.exitBtn=contentNode.getChildByName("exit_btn");
        this.btn_bg=this.node.getChildByName("btn_bg").getComponent(cc.Sprite);
        this.addEvent();
    }
    addEvent():void{
        Global.EventCenter.addEventListener(EventType.NotVoteCloseRslt , this.disTory , this);
        Global.EventCenter.addEventListener(EventType.RefreshSettingBts , this.refreshBtnsShow , this);

    }
    removeEvent():void{
        Global.EventCenter.removeEventListener(EventType.NotVoteCloseRslt , this.disTory , this);
        Global.EventCenter.removeEventListener(EventType.RefreshSettingBts , this.refreshBtnsShow , this);

    }
    start () {
        this.refreshBtnsShow();
    }
    private refreshBtnsShow():void{
        this.exitBtn.active = true;
        this.dissroomBtn.active = true;
        if (GameInfo.ins.nowGameStatus<PlayStauteEnum.ChangeChar&&GameInfo.ins.nowGameCount==0) {
            //未开局
            if (GameInfo.ins.roomTableInfo.crtAid == UserInfo.ins.myInfo.aid) {
                this.exitBtn.active = false;
            } else {
                this.dissroomBtn.active = false;
            }
        } else {
            if (UserInfo.ins.selfIsLookPlayer) {
                this.dissroomBtn.active = false;
            } else {
                this.exitBtn.active = false;
            }
        }
        if(!this.exitBtn.active||!this.dissroomBtn.active){
            this.btn_bg.node.height=569;
        }else{
            this.btn_bg.node.height=668;
        }
    }
    private isAllReady():boolean{
        let ready=true;
        let players=GameInfo.ins.gamePlayers;
        for(let item of players){
            if(!item.onReady){
                ready=false;
                break;
            }
        }
        return ready;
    }
    public onPlayerListClick():void{
        Global.Utils.dialogOutTips("点击了成员列表按钮");
    }
    public onRuleInofClick():void{
        Global.Utils.dialogOutTips("点击了规则说明按钮");
    }
    public onSetingClick():void{
        Global.Utils.dialogOutTips("点击了设置按钮");
    }
    public onShoptClick():void{
        Global.Utils.dialogOutTips("点击了商城按钮");
        // Global.DialogManager.createDialog("smallOver/prefab/BigOverPanel",null, (any,createDialog)=>{
        //     createDialog.y = 0;
        // })
    }
    public onDissRoomClick():void{
        if(GameInfo.ins.dissolutInCoolTime){
            let codTime=60;
            Global.Utils.dialogOutTips(`解散房间CD冷却${codTime}秒，请稍后在进行尝试`);
            return;
        }
        let handNum = GameInfo.ins.nowGameCount;
        if (handNum == 0) {
           this.onNotOpenGameClickDiss();
        } else {
            let callBack = CallBack.bind(function () {
                let msg = new Msg_CS_RqCloseGame();
                Global.mgr.socketMgr.send(-1, msg);

                this.onCloseClick();
            }, this, true);
            let str = "确定解散当前牌局？";
            Global.Utils.dialogOutConfirm(str, 2, callBack);
        }
      
    }
    private onNotOpenGameClickDiss():void{
        if (GameInfo.ins.roomTableInfo.crtAid == UserInfo.ins.myInfo.aid) {
            let callBack = CallBack.bind(function () {
                let msg = new Msg_CS_RqCloseGame();
                Global.mgr.socketMgr.send(-1, msg);

                this.onCloseClick();
            }, this, true);
            let str = "确定解散当前牌局？";
            Global.Utils.dialogOutConfirm(str, 2, callBack);
        } else if (UserInfo.ins.selfIsLookPlayer) {
            Global.EventCenter.dispatchEvent(EventType.BackToLobby);
        }
    }
    public onExitRoomClick():void{
        if(UserInfo.ins.selfIsLookPlayer){
            MainManager.ins.onLeaveRoomInitData(true);
            Global.EventCenter.dispatchEvent(EventType.BackToLobby);
            return;
        }
        let callBack = CallBack.bind(function () {
            MainManager.ins.onLeaveRoomInitData(true);
            Global.EventCenter.dispatchEvent(EventType.BackToLobby);
        }, this, true);
        let str = "是否退出房间？";
        Global.Utils.dialogOutConfirm(str, 2, callBack,null,null,null,[EventType.RefreshSettingBts]);
    }
    public onCloseClick():void{
        this.removeEvent();
        this.disTory();
    }

    // update (dt) {}
}
