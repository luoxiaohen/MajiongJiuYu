// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIViewZorderEnum } from "../../enum/EnumManager";
import EventCenter from "../../event/EventCenter";
import EventType from "../../event/EventType";
import UserInfo from "../../Game/info/UserInfo";
import { Msg_CS_ChangeNike, Msg_CS_InitPlayerInfo, Msg_CS_SetPlayerInfo } from "../../proto/LobbyMsg";
import DialogManager from "../../Shared/DialogManager";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PersonEditPanel extends UIBase {
    public z_order: UIViewZorderEnum=UIViewZorderEnum.HallPanels;
    @property(cc.Label)
    title_label:cc.Label=null;
    @property(cc.Label)
    sign_sum_Label:cc.Label=null;
    @property(cc.Label)
    nike_label:cc.Label=null;

    @property(cc.EditBox)
    nike_editbox:cc.EditBox=null;
    @property(cc.EditBox)
    sign_editbox:cc.EditBox=null;

    @property(cc.Toggle)
    sex_toggle:cc.Toggle=null;
    @property(cc.Node)
    sex_flag:cc.Node=null;
    @property(cc.Node)
    close_btn:cc.Node=null;
    @property(cc.Node)
    next_btn:cc.Node=null;
    @property(cc.Node)
    save_btn:cc.Node=null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private viewType=0;
    start () {
        if(this.dialogParameters.type==1){
            this.title_label.string="信息编辑";
        }else{
            this.title_label.string="完善信息";
        }
        this.nike_editbox.node.active=this.dialogParameters.type==0;
        this.nike_label.node.active=this.dialogParameters.type==1;
        this.next_btn.active=this.dialogParameters.type==0;
        this.close_btn.active=this.dialogParameters.type==1;
        this.save_btn.active=this.dialogParameters.type==1;
        this.viewType=this.dialogParameters.type;
       this.refreshView(null,true);
       EventCenter.ins.addEventListener(EventType.RefreshPlayerInfo,this.refreshView,this);
      
    }
    private refreshView(type,isinite:boolean=false):void{
        if(UserInfo.ins.myInfo){
            if(UserInfo.ins.myInfo.noviceState==0){
                this.nike_label.string="";
                this.nike_editbox.string="";
            }else{
                this.nike_label.string=UserInfo.ins.myInfo.nike;
                this.nike_editbox.string=UserInfo.ins.myInfo.nike;
            }
            this.sign_editbox.string=UserInfo.ins.myInfo.sign;
         
            this.sex_toggle.isChecked=UserInfo.ins.myInfo.sex==0;
            if(isinite){
                this.setSexToggleStateShow();
            }else{
                this.onSexToggleClick();
            }
        }
        this.onSignTextChange();
    }
    onSeletNikeTextChange(data_1,data2,data3,data4):void{
        let contentStr=this.nike_editbox.string;
        let newStr=Global.Utils.formatStrToByteLenth(contentStr,10);
        this.nike_editbox.string=newStr;
       
    }
    onSeletNikeTextEndFuc(data_1,data2,data3,data4):void{
        let contentStr=this.nike_editbox.string;
        let newStr=Global.Utils.formatStrToByteLenth(contentStr,10);
        this.nike_editbox.string=newStr;
    }
    onSexToggleClick():void{
        if(this.sex_toggle.isChecked){
            cc.tween(this.sex_flag).to(0.2,{x:36.5}).start();
        }else{
            cc.tween(this.sex_flag).to(0.2,{x:-36.5}).start();
        }
    }
    private setSexToggleStateShow():void{
        if(this.sex_toggle.isChecked){
            this.sex_flag.x=36.5;
        }else{
            this.sex_flag.x=-36.5;

        }
    }
    onSignTextChange():void{
        this.sign_sum_Label.string=this.sign_editbox.string.length+"";
    }
    onPlayerHeadClick():void{
        Global.Utils.dialogOutTips("点击头像");
    }
    onNikeNameClick():void{
        if(this.dialogParameters.type==0){
            return;
        }
        DialogManager.ins.createDialog("personData/prefab/PersonNikeNameChange",null,(any,createDialog)=>{
            createDialog.y = -1920/2;
            createDialog.x=540;
        });
    }
    onSaveBtnClick():void{
        let signStr=this.sign_editbox.string;
        let msg=new Msg_CS_SetPlayerInfo();
        msg.face="";
        msg.sex=this.sex_toggle.isChecked?0:1;
        msg.sign=signStr;
        Global.mgr.socketMgr.send(-1,msg);
        this.onCancelBtnClick();
    }
    onNextBtnClick():void{
        if(this.nike_editbox.string==""){
            Global.Utils.dialogOutTips("玩家昵称不能为空!");
            return;
        }
        let param={
            callback:this.JoinInClubPanelCallBack,
            caller:this,
        };
        Global.DialogManager.createDialog("personData/prefab/JoinInClubPanel",param,function(any,createDialog){
            createDialog.y = -1920/2;
            createDialog.x=540;
        });
    }
    private JoinInClubPanelCallBack():void{
        let nikeStr=this.nike_editbox.string;
        let signStr=this.sign_editbox.string;
        let msg=new Msg_CS_InitPlayerInfo();
        msg.face="";
        msg.nike=nikeStr;
        msg.sign=signStr;
        msg.sex=this.sex_toggle.isChecked?0:1;;
        Global.mgr.socketMgr.send(-1,msg);
    }
    onCancelBtnClick(){
        EventCenter.ins.removeEventListener(EventType.RefreshPlayerInfo,this.refreshView,this);
        this.disTory();
    }

    // update (dt) {}
}
