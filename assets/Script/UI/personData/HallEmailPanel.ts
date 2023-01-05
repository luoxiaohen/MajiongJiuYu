// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIViewZorderEnum } from "../../enum/EnumManager";
import EventCenter from "../../event/EventCenter";
import EventType from "../../event/EventType";
import GameInfo from "../../Game/info/GameInfo";
import { Msg_CS_ReadMail } from "../../proto/LobbyMsg";
import { MailUnit } from "../../proto/LobbyMsgDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import List from "../uiList/List";
import HallEmailItem from "./HallEmailItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HallEmailPanel extends UIBase {
    public z_order=UIViewZorderEnum.HallPanels;
    @property(List)
    email_list:List=null;
    // LIFE-CYCLE CALLBACKS:
    @property(cc.Node)
    private none_node:cc.Node=null;

    // onLoad () {}
    private panelReadIDS:number[]=[];
    private mailsData:MailUnit[]=[];
    start () {
        this.panelReadIDS=[];
        this.refreshView();
        EventCenter.ins.addEventListener(EventType.RefreshEmailReadState,this.refreshView,this);
    }
    refreshView():void{
        this.mailsData=GameInfo.ins.hallMails;
        this.none_node.active=this.mailsData.length==0;
        this.email_list.numItems=this.mailsData.length;;
    }
    onListRender(item:cc.Node,idx:number):void{
        let component=item.getComponent(HallEmailItem);
        let mailsData=this.mailsData[idx];
        if(!this.panelReadIDS.includes(mailsData.mailid)){
            this.panelReadIDS.push(mailsData.mailid);
        }
        component.initeValue(mailsData.title,mailsData.time+"",mailsData.contents,mailsData.read==0);
    }
    onCloseBtnClick():void{
        this.setReadEmailIDs();
        EventCenter.ins.removeEventListener(EventType.RefreshEmailReadState,this.refreshView,this);
        this.disTory();
    }
    public setReadEmailIDs():void{
        let sendReadIds=[];
        for(let id of this.panelReadIDS){
            for(let item of this.mailsData){
                if(item.mailid==id&&!item.read){
                    item.read=1;
                    sendReadIds.push(item.mailid);
                }
            }
        }
        if(sendReadIds.length>0){
            let msg:Msg_CS_ReadMail=new Msg_CS_ReadMail();
            msg.mailids=sendReadIds;
            Global.mgr.socketMgr.send(-1,msg);
        }
    }

    // update (dt) {}
}
