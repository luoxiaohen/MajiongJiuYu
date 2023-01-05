// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventCenter from "../../event/EventCenter";
import EventType from "../../event/EventType";
import GameInfo from "../../Game/info/GameInfo";
import UserInfo from "../../Game/info/UserInfo";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PersonInfoPanel extends UIBase {

    @property(cc.Label)
    player_name_label: cc.Label = null;
    @property(cc.Label)
    player_id_label: cc.Label = null;
    @property(cc.Label)
    card_type_label:cc.Label=null;
    @property(cc.Label)
    gold_num_label:cc.Label=null;
    @property(cc.Label)
    diamod_num_label:cc.Label=null;
    @property(cc.Sprite)
    player_head_sprite:cc.Sprite=null;
    @property(cc.Sprite)
    player_sex_sprite:cc.Sprite=null;
    @property(cc.Sprite)
    card_type_sprite:cc.Sprite=null;
    @property(cc.Node)
    emailRed:cc.Node=null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.refreshView();
        this.refreshRedShow();
        EventCenter.ins.addEventListener(EventType.RefreshPlayerInfo,this.refreshView,this);
        EventCenter.ins.addEventListener(EventType.RefreshEmailReadState,this.refreshRedShow,this);

    }
    refreshView():void{
        let myInfo=UserInfo.ins.myInfo;
        if(myInfo){
            if(myInfo.sex==0){
               Global.CCHelper.updateSpriteFrame("personData/resource/xinxi_nv",this.player_sex_sprite);
            }else{
               Global.CCHelper.updateSpriteFrame("personData/resource/xinxi_nan",this.player_sex_sprite);
            }
            this.gold_num_label.string=myInfo.gold.toString();
            this.diamod_num_label.string=myInfo.diam.toString();
            this.player_id_label.string="ID:"+myInfo.aid;
            this.player_name_label.string=myInfo.nike;
        }
    }
    private refreshRedShow():void{
        this.emailRed.active=false;
        let emails=GameInfo.ins.hallMails;
        for(let item of emails){
            if(!item.read){
                this.emailRed.active=true;
                break;
            }
        }
    }
    onEmailClick():void{
        Global.DialogManager.createDialog("personData/prefab/HallEmailPanel",null,function(type,dialog){
            dialog.y=-1920/2;
            dialog.x=540;
        })
    }
    onDataStatisClick():void{
        let playeInfo=UserInfo.ins.myInfo;
        Global.DialogManager.createDialog("personData/prefab/PersonDataPanel",{playerInfo:playeInfo},function(type,dialog){
            dialog.y=0;
            dialog.x=540;
        })
    }
    onCardClick():void{
        Global.Utils.dialogOutTips("打开个人卡商城");
    }
    onGoldBtnClick():void{
        Global.DialogManager.createDialog("shop/prefab/HallShopPanel",{type:0},function(type,dialog){
            dialog.y=-1980/2;
            dialog.x=540;
        });
    }
    onDiamondClick():void{
        Global.DialogManager.createDialog("shop/prefab/HallShopPanel",{type:1},function(type,dialog){
            dialog.y=-1980/2;
            dialog.x=540;
        });
    }
    onMyCardRecordClick():void{
        Global.Utils.dialogOutTips("打开牌谱");
    }
    onRenarksClick():void{
        Global.Utils.dialogOutTips("打开备注");
    }
    onSettingClick():void{
        Global.DialogManager.createDialog("personData/prefab/HallSettingPanel",null,function(type,dialog){
            dialog.y=-1920/2;
            dialog.x=540;
        });
        Global.Utils.debugOutput("打开大厅设置");
    }
    onPersonInfoClick():void{
        Global.DialogManager.createDialog('personData/prefab/PersonEditPanel',{type:1},(any,createDialog)=>{
            createDialog.y = -1920/2;
            createDialog.x=540;
        });
    }
    disTory(): void {
        EventCenter.ins.removeEventListener(EventType.RefreshPlayerInfo,this.refreshView,this);
        EventCenter.ins.removeEventListener(EventType.RefreshEmailReadState,this.refreshRedShow,this);

        super.disTory();
    }

    // update (dt) {}
}
