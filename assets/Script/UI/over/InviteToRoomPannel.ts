// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventType from "../../event/EventType";
import GameInfo from "../../Game/info/GameInfo";
import UserInfo from "../../Game/info/UserInfo";
import { Msg_CS_FindEnterRoom } from "../../proto/TableMsg";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import CardHelpManager from "../card/CardHelpManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class InviteToRoomPannel extends UIBase {
    // LIFE-CYCLE CALLBACKS:

    protected invite_player_label:cc.Label;
    protected game_type_label:cc.Label;
    protected room_name_label:cc.Label;
    protected room_id_label:cc.Label;
    protected down_score_label:cc.Label;
    protected game_hand_label:cc.Label;
    protected game_rule_label:cc.Label;
    protected time_label:cc.Label;
    private cutDownTime=30;

    onLoad () {
        let labelNode=this.node.getChildByName("label_node");
        this.invite_player_label=labelNode.getChildByName("invite_player_label").getComponent(cc.Label);
        this.game_type_label=labelNode.getChildByName("game_type_label").getComponent(cc.Label);
        this.room_name_label=labelNode.getChildByName("room_name_label").getComponent(cc.Label);
        this.room_id_label=labelNode.getChildByName("room_id_label").getComponent(cc.Label);
        this.down_score_label=labelNode.getChildByName("down_score_label").getComponent(cc.Label);
        this.game_hand_label=labelNode.getChildByName("game_hand_label").getComponent(cc.Label);
        this.game_rule_label=labelNode.getChildByName("game_rule_label").getComponent(cc.Label);
        let refuse_btn=this.node.getChildByName("refuse_btn");
        this.time_label=refuse_btn.getChildByName("time_label").getComponent(cc.Label);;
    }
    start () {
        let inviteInfo=GameInfo.ins.gameInviteData;
        if(!inviteInfo){
            return;
        }
        let  ruleInfo=inviteInfo.info;
        let gameName:string = Global.Utils.getGameNameByGameType(ruleInfo.gamePlayType);
        let gameType:string = Global.Utils.getGameTypeNameByGameType(ruleInfo.roomType);
        let roomName = gameName + "-"+ gameType;
        this.game_type_label.string=roomName;
        this.game_rule_label.string=Global.Utils.getRoomTableInfoStr(ruleInfo);
        this.invite_player_label.string=inviteInfo.inviter;
        this.room_id_label.string=inviteInfo.roomCode.toString();
        this.down_score_label.string=ruleInfo.baseScore.toString();
        this.game_hand_label.string=ruleInfo.handsCnt.toString();
        let refuse_btn=this.node.getChildByName("refuse_btn");
        this.time_label=refuse_btn.getChildByName("time_label").getComponent(cc.Label);
        this.showCutDownTime();
        this.schedule(this.showCutDownTime,1,this.cutDownTime);
    }
    private showCutDownTime():void{
        this.time_label.string=this.cutDownTime.toString();
        this.cutDownTime--;
        // Global.Utils.debugOutput("倒计时：   "+this.cutDownTime);
        if(this.cutDownTime<=0){
            this.disTory();
        }
    }

    onAgreeBtn():void{
        GameInfo.ins.initOver();
		UserInfo.ins.initOver();
		CardHelpManager.ins.initOver();
        UserInfo.ins.mySitIndex=-1;
        let msg=new Msg_CS_FindEnterRoom();
        msg.code=GameInfo.ins.gameInviteData.roomCode;
        Global.mgr.socketMgr.send(-1,msg);
    }
    onRefuseBtn():void{
        Global.EventCenter.dispatchEvent(EventType.BackToLobby);
    }
    protected onDestroy(): void {
        this.unscheduleAllCallbacks();
    }


    // update (dt) {}
}
