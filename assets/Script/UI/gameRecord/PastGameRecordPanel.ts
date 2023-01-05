// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventType from "../../event/EventType";
import { Msg_CS_GetMonthRecord, Msg_SC_MonthRecord } from "../../proto/LobbyMsg";
import { CntScore } from "../../proto/MagRecordDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import PastGameRecordItem from "./PastGameRecordItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PastGameRecordPanel extends UIBase {

    @property(cc.Node)
    contentNode: cc.Node = null;

    private itemPrefab:cc.Prefab;

    // LIFE-CYCLE CALLBACKS:
    
    onLoad () {
        this.itemPrefab=Global.Utils.getPreFabBySource("gameRecord/prefab/PastGameRecordItem");
        this.addListener();
        let msg=new Msg_CS_GetMonthRecord();
        Global.mgr.socketMgr.send(-1,msg);
    }
    addListener():void{
        Global.EventCenter.addEventListener(EventType.PastRecord,this.OnPastRecordMsg,this);
    }
    private mouthStrArr:string[]=[];
    private OnPastRecordMsg(type,data:Msg_SC_MonthRecord):void{
        let arr=data.rcds;
        if(!arr){
            return;
        }
        this.mouthStrArr=[];
        for(let item of arr){
            if(item.rcd_1_1.cnt>0){
                this.addOneComp(item.rcd_1_1,1,1,item.ym);
            }
            if(item.rcd_1_2.cnt>0){
                this.addOneComp(item.rcd_1_2,1,2,item.ym);
            }
            if(item.rcd_1_3.cnt>0){
                this.addOneComp(item.rcd_1_3,1,3,item.ym);
            }
            if(item.rcd_1_4.cnt>0){
                this.addOneComp(item.rcd_1_4,1,4,item.ym);
            }
            if(item.rcd_2_1.cnt>0){
                this.addOneComp(item.rcd_2_1,2,1,item.ym);
            }
            if(item.rcd_2_2.cnt>0){
                this.addOneComp(item.rcd_2_2,2,2,item.ym);
            }
           
        }
    }
    private addOneComp(data:CntScore,type1:number,type2:number,ym):void{
        let obj=cc.instantiate(this.itemPrefab);
        this.contentNode.addChild(obj);
        let comp=obj.getComponent(PastGameRecordItem);
        comp.initeValue(data,type1,type2,ym,this.mouthStrArr);
    }

    // update (dt) {}
}
