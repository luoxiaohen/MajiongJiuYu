// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIViewZorderEnum } from "../../enum/EnumManager";
import EventType from "../../event/EventType";
import UserInfo from "../../Game/info/UserInfo";
import { Msg_CS_GetBaseCount, Msg_SC_BaseCountData } from "../../proto/LobbyMsg";
import { GamePlayTypeEnum, GameRoomTypeEnum, PlayerInfo } from "../../proto/LobbyMsgDef";
import { CountTimeType, CountType } from "../../proto/MsgCountDef";
import DialogManager from "../../Shared/DialogManager";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import PersonDataDetailPanel from "./PersonDataDetailPanel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PersonDataPanel extends UIBase {
    public z_order=UIViewZorderEnum.HallPanels;;
    @property(cc.Node)
    room_type_xuezhan:cc.Node=null;
    @property(cc.Node)
    room_type_huan:cc.Node=null;
    @property(cc.Node)
    view_root:cc.Node=null;
    // LIFE-CYCLE CALLBACKS:
    @property(cc.Sprite)
    player_head_sprite:cc.Sprite=null;
    @property(cc.Label)
    player_name_label:cc.Label=null;
    @property(cc.Label)
    player_id_lable:cc.Label=null;

    @property(cc.ScrollView)
    view_scroll:cc.ScrollView=null;

    @property(cc.Toggle)
    xuezhan_room_arr:cc.Toggle[]=[];
    @property(cc.Toggle)
    huansan_room_arr:cc.Toggle[]=[];
    // onLoad () {}
    // gameType:  游戏玩法类型 GamePlayTypeEnum
	// roomType:  游戏房间类型 GameRoomTypeEnum
	// timeType:  统计数据事件类型 CountTimeType
    start () {
        this.addListner();
        this.onGameToggleClick(null,"1");
    }
    addListner():void{
        Global.EventCenter.addEventListener(EventType.GetBaseRecordMsg,this.OnGetBaseInfoData,this);
    }
    private gameType:GamePlayTypeEnum=GamePlayTypeEnum.None;
    onGameToggleClick(event,arg):void{
        let gameType=Number(arg);
        if(this.gameType==gameType){
            return;
        }
        this.gameType=gameType;
        this.room_type_xuezhan.active=this.gameType==1;
        this.room_type_huan.active=this.gameType==2;
        if(this.gameType==1){
            for(let index=0;index<this.xuezhan_room_arr.length;index++){
                this.xuezhan_room_arr[index].isChecked=index==0;
            }
            this.onRoomToggleClick(null,"1");
        }else if(this.gameType==2){
            for(let index=0;index<this.huansan_room_arr.length;index++){
                this.huansan_room_arr[index].isChecked=index==0;
            }
            this.onRoomToggleClick(null,"11");
        }
    }
    private roomType:number=0;
    onRoomToggleClick(event,arg):void{
        let roomType=Number(arg);
        if(this.roomType==roomType){
            return;
        }
        this.roomType=roomType;
        this.onSetChooseTypeData();
    }

    private choosePlayerInfo:PlayerInfo=null;
    private countType:CountType=null;
    onSetChooseTypeData():void{
       if(this.gameType==0||this.roomType==0){
            return;
       }
       Global.Utils.debugOutput("gameType:  "+this.gameType+"   roomType:  "+this.roomType);
       let playerInfo:PlayerInfo=this.dialogParameters.playerInfo;
       this.choosePlayerInfo=playerInfo;
       this.setPlayerInfo();
       let msg:Msg_CS_GetBaseCount=new Msg_CS_GetBaseCount();
       msg.aid=playerInfo.aid;
       let countType=new CountType();
       countType.gameType=this.gameType;
       countType.roomType=this.roomType%10;
       countType.timeType=CountTimeType.eLives;
       this.countType=countType;
       msg.type=countType;
       Global.mgr.socketMgr.send(-1,msg);
    }
    private setPlayerInfo():void{
        this.player_name_label.string=this.choosePlayerInfo.nike;
        this.player_id_lable.string="ID:"+this.choosePlayerInfo.aid;
    }
    private personDataDetailPanel:PersonDataDetailPanel=null;
    private detailData:Msg_SC_BaseCountData=null;
    private OnGetBaseInfoData(type:string,msg:Msg_SC_BaseCountData):void{
        this.detailData=msg;
        if(!this.personDataDetailPanel){
            this.createDataDetailPanel();
        }else{
            this.personDataDetailPanel.IniteValue(this.detailData,this.countType,this.choosePlayerInfo);
        }
        this.view_scroll.scrollToTop(1);
    }
    private createDataDetailPanel():void{
        Global.Utils.createObjToNode("personData/prefab/PersonDataDetailPanel",this.view_root,null,cc.v2(0,0),this.detailPanelCreateEnd.bind(this));
    }
    private detailPanelCreateEnd(data,dialog:cc.Node):void{
        this.view_root.height=dialog.height;
        this.personDataDetailPanel=dialog.getComponent(PersonDataDetailPanel);
        this.personDataDetailPanel.IniteValue(this.detailData,this.countType,this.choosePlayerInfo);
    }

    onDataCompareBtn():void{
        let params={
            aid:this.choosePlayerInfo.aid,
            gameType:this.gameType,
            roomType:this.roomType%10,
        }
        DialogManager.ins.createDialog("personData/prefab/DataComparePanel",params,function(type,dialog){
            dialog.y=0;
            dialog.x=540;
        });
    }
    onCloseBtn():void{
        this.disTory();
    }

    // update (dt) {}
}
