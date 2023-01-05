// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventType from "../../event/EventType";
import GameInfo from "../../Game/info/GameInfo";
import UserInfo from "../../Game/info/UserInfo";
import { Msg_CS_VoteCloseGame, Msg_SC_RqCloseGame, Msg_SC_VoteCloseRslt, Msg_SC_VoteRslt } from "../../proto/TableMsg";
import { SitInfo } from "../../proto/TableMsgDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import DismissPlayerItem from "./DismissPlayerItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DismissRoomPanel extends UIBase {
    @property(cc.Sprite)
    bar_front_sprite:cc.Sprite=null;
 
    private time_label:cc.Label;
    private player_content:cc.Node;
    // LIFE-CYCLE CALLBACKS:
    private playerItemPrefab:cc.Prefab;

    private confirm_btn:cc.Node;
    private cancel_btn:cc.Node;

    private pro_bar:cc.Node;
    private title_label:cc.Label;
    private playerItemArr:DismissPlayerItem[];
    onLoad () {
        this.title_label=this.node.getChildByName("title_label").getComponent(cc.Label);
        this.time_label=this.node.getChildByName("time_label").getComponent(cc.Label);
        this.player_content=this.node.getChildByName("player_content");
        this.playerItemPrefab=Global.Utils.getPreFabBySource("createRoom/prefab/DismissPlayerItem");
        this.confirm_btn=this.node.getChildByName("confirm_btn");
        this.cancel_btn=this.node.getChildByName("cancel_btn");
        this.pro_bar=this.node.getChildByName("bar");

        Global.EventCenter.addEventListener(EventType.VoteRslt , this.onAgreeVoteMsg , this);
        Global.EventCenter.addEventListener(EventType.NotVoteCloseRslt , this.disTory , this);

    }
    private cutTime=120;
    private nowTime=120;
    private nowColorNum=1;
    /**是否是本人发起的 */
    private isMyTrigger:boolean=false;
    start () {
        // this.time_label.string=this.cutTime
        this.nowColorNum=1;
        let msg:Msg_SC_RqCloseGame=this.dialogParameters.msg;
        this.cutTime=msg.overSec-2;
        this.nowTime=this.cutTime;
       
        this.time_label.string="倒计时："+this.nowTime+"s";
        cc.tween(this.bar_front_sprite).to(this.cutTime,{fillRange:0},{onUpdate:this.onTweenUpdate.bind(this)}).start();
        this.playerItemArr=[];
       
        let sitInfoArr:SitInfo[]=[];
        
        for(let index=0;index<4;index++){
            let sitInfo=GameInfo.ins.getPlayerBySit(index);
            if(!sitInfo){
                continue;
            }
            sitInfoArr.push(sitInfo);
        }
        sitInfoArr.sort((a,b)=>{
            return a.sitNum-b.sitNum;
        });
        for(let item of sitInfoArr){
            let obj=cc.instantiate(this.playerItemPrefab);
            this.player_content.addChild(obj);
            let playerItem=obj.getComponent(DismissPlayerItem);
            playerItem.initeValue(item);
            this.playerItemArr.push(playerItem);
        }
        let origSitInfo=GameInfo.ins.getPlayerBySit(msg.rqSit);
        if(origSitInfo){
            this.title_label.string=origSitInfo.player.nike+"申请解散房间";
            for(let item of this.playerItemArr){
                let state=origSitInfo.sitNum==item.sitInfo.sitNum?1:0;
                item.updateState(state);
                if(origSitInfo.sitNum==UserInfo.ins.mySitIndex){
                    this.isMyTrigger=true;
                    this.enabelActiveBtns();
                }
            }
        }
        if(UserInfo.ins.selfIsLookPlayer){
            this.enabelActiveBtns();
        }
        this.checkVoteState();
    }
    private onAgreeVoteMsg(e,msg:Msg_SC_VoteRslt):void{
        this.upDatePlayerState(msg.sitAgree,1);
        this.checkVoteState();
    }
    private checkVoteState():void{
        let voteResult=true;
        for(let item of this.playerItemArr){
            if(!item.voteState){
                voteResult=false;
                break;
            }
        }
        if(voteResult){
            Global.Utils.debugOutput("投票结果  全部同意！");
            // Global.EventCenter.dispatchEvent(EventType.BackToLobby);
        }else{
            Global.Utils.debugOutput("投票结果  没有全部同意！");
        }
    }
    private upDatePlayerState(sitNum:number,state:number):void{
        for(let item of this.playerItemArr){
            if(item.sitInfo.sitNum==sitNum){
                item.updateState(state);
            }
        }
    }
    private onTweenUpdate():void{
        let spriteRange=this.bar_front_sprite.fillRange;
        let tempTime=Math.ceil( this.cutTime*spriteRange);
        if(tempTime<this.nowTime){
            this.nowTime=tempTime;
            this.time_label.string="倒计时："+this.nowTime+"s";
        }
        if(this.nowTime==0){
            this.onTimeOut();
            return;
        }
        if(this.nowColorNum==1&&spriteRange<0.8){
            this.nowColorNum=2;
            Global.CCHelper.updateSpriteFrame("createRoom/resource/createRoom_jindutiao2",this.bar_front_sprite);
        }else if(this.nowColorNum==2&&spriteRange<0.2){
            this.nowColorNum=3;
            Global.CCHelper.updateSpriteFrame("createRoom/resource/createRoom_jindutiao3",this.bar_front_sprite);
        }
    }
    enabelActiveBtns():void{
        this.confirm_btn.active=false;
        this.cancel_btn.active=false;
    }
    onConfirmBtn():void{
        // let name=UserInfo
        this.enabelActiveBtns();
        Global.Utils.debugOutput("同意");
        this.senVoteState(1);
    }
    onTimeOut():void{
        if(this.isMyTrigger){
            return;
        }
        this.onConfirmBtn();

    }
    onCancelBtn():void{
        this.enabelActiveBtns();
        Global.Utils.debugOutput("拒绝");
        this.senVoteState(0);
    }
    private senVoteState(state:number):void{
        let msg=new Msg_CS_VoteCloseGame();
        msg.agree=state;
        Global.mgr.socketMgr.send(-1,msg);
    }
    protected onDestroy(): void {
        Global.EventCenter.removeEventListener(EventType.VoteRslt , this.onAgreeVoteMsg , this);
        Global.EventCenter.removeEventListener(EventType.NotVoteCloseRslt , this.disTory , this);
        cc.Tween.stopAllByTarget(this.bar_front_sprite);
    }

    // update (dt) {}
}
