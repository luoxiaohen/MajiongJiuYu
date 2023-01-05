// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIViewZorderEnum } from "../../enum/EnumManager";
import EventType from "../../event/EventType";
import UserInfo from "../../Game/info/UserInfo";
import { Msg_CS_GetPlayerRecord, Msg_SC_PlayerRecord } from "../../proto/LobbyMsg";
import DialogManager from "../../Shared/DialogManager";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import PastGameRecordPanel from "./PastGameRecordPanel";
import SevenRecordPanel from "./SevenRecordPanel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HallGameRecordPanel extends UIBase {  
    private viewType:number=0;
    // LIFE-CYCLE CALLBACKS:
    @property(cc.Node)
    view_content:cc.Node=null;

    private sevenRecordPanel:SevenRecordPanel;
    private pastRecordPanel:PastGameRecordPanel;
    onLoad () {
    }

    start () {
        Global.Utils.createObjToNode("gameRecord/prefab/SevenRecordPanel",this.view_content,null, cc.v2(0,0),this.loadSevenPanelEndFuc.bind(this));

    }
    private loadSevenPanelEndFuc(data,dialog):void{
        this.sevenRecordPanel=dialog.getComponent(SevenRecordPanel);
    }

    private loadPastPanelEndFuc(data,dialog):void{
        this.pastRecordPanel=dialog.getComponent(PastGameRecordPanel);
    }
    public onViewTypeChange(event,arg):void{
        this.viewType=Number(arg);
        if(this.sevenRecordPanel){
            this.sevenRecordPanel.node.active=this.viewType==0;
        }
        if(this.pastRecordPanel){
            this.pastRecordPanel.node.active=this.viewType==1;
        }else{
            if(this.viewType==1){
                // DialogManager.ins.createDialog("gameRecord/prefab/PastGameRecordPanel",null,this.loadPastPanelEndFuc.bind(this),this.view_content);
                Global.Utils.createObjToNode("gameRecord/prefab/PastGameRecordPanel",this.view_content,null, cc.v2(0,0),this.loadPastPanelEndFuc.bind(this),);
            }
        }
    }
    disTory(): void {
        this.sevenRecordPanel&&this.sevenRecordPanel.disTory();
        this.sevenRecordPanel=null;
        this.pastRecordPanel&&this.pastRecordPanel.disTory();
        this.pastRecordPanel=null;
        super.disTory();
    }
    onStatisBtnClick():void{
        let playeInfo=UserInfo.ins.myInfo;
        Global.DialogManager.createDialog("personData/prefab/PersonDataPanel",{playerInfo:playeInfo},function(type,dialog){
            dialog.y=0;
            dialog.x=540;
        })
    }
    // update (dt) {}
}
