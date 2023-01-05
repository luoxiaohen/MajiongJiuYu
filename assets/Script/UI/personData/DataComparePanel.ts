// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { DataCompareType, UIViewZorderEnum } from "../../enum/EnumManager";
import EventType from "../../event/EventType";
import UserInfo from "../../Game/info/UserInfo";
import { Msg_CS_GetBaseCount, Msg_CS_GetFeeCount, Msg_CS_GetPubBaseCount, Msg_SC_BaseCountData, Msg_SC_FeeCountData, Msg_SC_PubBaseCountData } from "../../proto/LobbyMsg";
import { CountTimeType, CountType, PlayerBaseCount, PlayerFeeCount } from "../../proto/MsgCountDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import PersonDataHelp from "../../utils/PersonDataHelp";
import CompareCircleItem from "./CompareCircleItem";
import CompareDataItem from "./CompareDataItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DataComparePanel extends UIBase {
    public z_order=UIViewZorderEnum.HallPanels;
    @property(cc.Node)
    dataRoot: cc.Node = null;
    @property(cc.Node)
    resentRoot:cc.Node=null;
    @property(cc.Node)
    liveRoot:cc.Node=null;
    @property(cc.Node)
    vipNode:cc.Node=null;

    @property(cc.Prefab)
    data_item_prefab: cc.Prefab = null;
    @property(cc.Prefab)
    data_item_prefab_3: cc.Prefab = null;
    @property(cc.Prefab)
    data_item_prefab_4: cc.Prefab = null;

    @property(cc.Prefab)
    cicle_prefab:cc.Prefab=null;

    @property(cc.Node)
    chooseNode_1:cc.Node=null;
    @property(cc.Node)
    chooseNode_2:cc.Node=null;

    @property(cc.Toggle)
    toggleArr_1:cc.Toggle[]=[];
    @property(cc.Toggle)
    toggleArr_2:cc.Toggle[]=[];
    // LIFE-CYCLE CALLBACKS:

    @property(cc.Node)
    chooseStateSprite_1:cc.Node=null;
    @property(cc.Node)
    chooseStateSprite_2:cc.Node=null;
    // onLoad () {}

    @property(cc.Label)
    chose_label_show_1:cc.Label=null;
    @property(cc.Label)
    chose_label_show_2:cc.Label=null;

    private firstChooseType:number=0;
    private secondChooseType:number=0;


    private compareDataMap:{[key:number]:{dataStrArr:Array<Array<string>>,dataNumArr:Array<Array<number>>}}={};
    private baseDataMap:{[key:number]:PlayerBaseCount}={};

    private CompareCircleItemArr:CompareCircleItem[]=[];
    private isvip:boolean=false;

    start() {
        Global.EventCenter.dispatchEvent(EventType.DataComparePanelState,true);
        this.addListener()
        this.disabelNodes();
        this.iniveValue();
    }
    private addListener():void{
        Global.EventCenter.addEventListener(EventType.GetBaseRecordMsg,this.OnGetBaseInfoData,this);
        Global.EventCenter.addEventListener(EventType.GetFeeDataBackMsg,this.onGetFeeDataBackFuc,this);
        Global.EventCenter.addEventListener(EventType.GetFeeServerDataBackMsg,this.onGetSeverDataBackFuc,this);

    }
    private disabelNodes():void{
        this.chooseNode_1.scaleY=0;
        this.chooseNode_2.scaleY=0;
        this.chooseNode_1.active=false;
        this.chooseNode_2.active=false;
        this.chooseStateSprite_1.active=false;
        this.chooseStateSprite_2.active=false;
        this.changeChoseShowLabel(0,CountTimeType.eDay1);
        this.changeChoseShowLabel(1,CountTimeType.eLives);
    }
    private playerID:number=0;
    private gameType:number=0;
    private roomType:number=0;
    private dataItemsArr:CompareDataItem[]=[];
    /*let params={
        aid:this.choosePlayerInfo.aid,
        gameType:this.gameType,
        roomType:this.roomType%10,
    }*/
    iniveValue(): void {
        this.isvip=UserInfo.ins.vip>0;
        this.vipNode.active=!this.isvip;
        let param=this.dialogParameters;
        this.playerID=param.aid;
        this.gameType=param.gameType;
        this.roomType=param.roomType;
        for (let compareType = DataCompareType.SumGame; compareType <= DataCompareType.HuNums; compareType++) {
            let obj:cc.Node =null;
            if(compareType==DataCompareType.HuNums){
                obj=cc.instantiate(this.data_item_prefab_4);
            }else if(compareType==DataCompareType.MengQingZhongKa){
                obj=cc.instantiate(this.data_item_prefab_3);
            } else{
                obj=cc.instantiate(this.data_item_prefab);
            }
            this.dataRoot.addChild(obj);
            let itemComponent = obj.getComponent(CompareDataItem);
            itemComponent.initValue(compareType);
            this.dataItemsArr.push(itemComponent);
        }
        for(let index=0;index<2;index++){
            let obj=cc.instantiate(this.cicle_prefab);
            let itemComp=obj.getComponent(CompareCircleItem);
            if(index==0){
                this.resentRoot.addChild(obj);
                itemComp.setTitle("近一天");
            }else{
                this.liveRoot.addChild(obj);
                itemComp.setTitle("生涯");
            }
            this.CompareCircleItemArr.push(itemComp);
        }
        this.firstChooseType=1;
        this.secondChooseType=0;
        if(this.isvip){
            this.sendGetBaseData(this.firstChooseType);
            this.sendGetBaseData(this.secondChooseType);
        }

    }
    private islook:boolean=false;
    onLookBtn():void{
        if(this.islook){
            Global.Utils.dialogOutTips("已查看");
            return;
        }
        this.islook=true;
        this.vipNode.active=false;
        this.sendGetBaseData(this.firstChooseType);
        this.sendGetBaseData(this.secondChooseType);
    }
   
    private sendGetBaseData(timeType:number):void{
        if(!this.isvip&&!this.islook){
            return;
        }
        if(this.baseDataMap[timeType]){
            this.refreshCicleDataShow(timeType);
            this.refreshCompareData();
            return;
        }
        let msg:Msg_CS_GetBaseCount=new Msg_CS_GetBaseCount();
        msg.aid=this.playerID;
        let countType=new CountType();
        countType.gameType=this.gameType;
        countType.roomType=this.roomType;
        countType.timeType=timeType;
        msg.type=countType;
        Global.mgr.socketMgr.send(-1,msg);
    }
    private getBaseDataTime=0;
    private OnGetBaseInfoData(type:string,msg:Msg_SC_BaseCountData):void{
        if(this.gameType!=msg.type.gameType||this.roomType!=msg.type.roomType){
            console.error("房间类型不匹配错误！");
            return;
        }
        this.baseDataMap[msg.type.timeType]=msg.info;
        this.sendGetCompareData(msg.type.timeType);
        this.refreshCicleDataShow(msg.type.timeType);
      
    }
    private sendGetServerData(){
        let msg:Msg_CS_GetPubBaseCount=new Msg_CS_GetPubBaseCount();
        let countType=new CountType();
        countType.gameType=this.gameType;
        countType.roomType=this.roomType;
        countType.timeType=CountTimeType.eLives;
        msg.type=countType;
        Global.mgr.socketMgr.send(-1,msg);
    }
    private onGetSeverDataBackFuc(type:string,data:Msg_SC_PubBaseCountData):void{
        let formData=PersonDataHelp.ins.FormatFeeServerData_Compare(data);
        let dataStrArr=formData[0];
        let dataNumArr=formData[1];
 
        for (let index = 0; index <= 13; index++){
            this.dataItemsArr[index].setValue_Server(index,{dataStrArr:dataStrArr,dataNumArr:dataNumArr})
        }
    }
  
   
    private sendGetCompareData(timeType:number):void{
        console.log("数据获取类型：  "+this.getLabelStr(timeType));
        let mapData=this.compareDataMap[timeType];
        if(mapData){
            this.refreshCompareData();
            return;
        }
        let countType=new CountType();
        countType.gameType=this.gameType;
        countType.roomType=this.roomType;
        countType.timeType=timeType;
        let msg=new Msg_CS_GetFeeCount();
        msg.aid=this.playerID;
        msg.needMaxMajs=0;
        msg.feeRead=this.isvip?0:1;
        msg.type=countType;
        Global.mgr.socketMgr.send(-1,msg);
    }
    private onGetFeeDataBackFuc(type,data:Msg_SC_FeeCountData):void{
        if(this.gameType!=data.type.gameType||this.roomType!=data.type.roomType){
            console.error("房间类型不匹配错误！");
            return;
        }
        let timeType=data.type.timeType;
        let baseData=this.baseDataMap[timeType];
        if(!baseData){
            console.error("暂无基础数据");
            return;
        }
        let formatData=PersonDataHelp.ins.FormatFeeData_Compare(data,baseData.gameCnt,baseData.handCnt);
        let info={
            dataStrArr:formatData[0],
            dataNumArr:formatData[1],
        }
        this.compareDataMap[timeType]=info;
        this.refreshCompareData();
        this.getBaseDataTime++;
        if(this.getBaseDataTime==2){
            this.sendGetServerData();
        }
    }
    private refreshCompareData():void{
        let firstChooseData=this.compareDataMap[this.firstChooseType];
        let secondChooseData=this.compareDataMap[this.secondChooseType];
        if(!firstChooseData||!secondChooseData){
            return;
        }
        for (let index = 0; index <= 13; index++){
            this.dataItemsArr[index].setValue_Compare(index,firstChooseData,secondChooseData)
        }
    }
    private refreshCicleDataShow(timeType):void{
        let mapData=this.baseDataMap[timeType];
        if(this.firstChooseType==timeType){
            this.CompareCircleItemArr[0].setDataInfoShow(mapData);
        }
        if(this.secondChooseType==timeType){
            this.CompareCircleItemArr[1].setDataInfoShow(mapData);
        }
    }
    onBackBtnClose(): void {
        Global.EventCenter.dispatchEvent(EventType.DataComparePanelState,false);
        this.disTory();
    }
    onFirstChooseClick():void{
        this.chooseNode_1.active=!this.chooseNode_1.active;
        if(this.chooseNode_1.active){
            cc.tween(this.chooseNode_1).to(0.1,{scaleY:1}).start();
        }else{
            this.chooseNode_1.scaleY=0;
        }
        this.chooseStateSprite_1.active=this.chooseNode_1.active;
        if(this.chooseNode_2.active&&this.chooseNode_1.active){
            this.chooseNode_2.active=false;
            this.chooseNode_2.scaleY=0;
            this.chooseStateSprite_2.active=false;
        }
    }
    onSecondChooseClick():void{
        this.chooseNode_2.active=!this.chooseNode_2.active;
        if(this.chooseNode_2.active){
            cc.tween(this.chooseNode_2).to(0.1,{scaleY:1}).start();
        }else{
            this.chooseNode_2.scaleY=0;
        }
        this.chooseStateSprite_2.active=this.chooseNode_2.active;
        if(this.chooseNode_2.active&&this.chooseNode_1.active){
            this.chooseNode_1.active=false;
            this.chooseNode_1.scaleY=0;
            this.chooseStateSprite_1.active=false;
        }
    }
    onFirstChooseItemClick(event,arg):void{
        this.firstChooseType=Number(arg);
        this.onFirstChooseClick();
        this.changeChoseShowLabel(0,this.firstChooseType);
        this.CompareCircleItemArr[0].setTitle(this.getLabelStr(this.firstChooseType));
        this.sendGetBaseData(this.firstChooseType);
    }
    onSecondChooseItemClick(event,arg):void{
        this.secondChooseType=Number(arg);
        this.onSecondChooseClick();
        this.changeChoseShowLabel(1,this.secondChooseType);
        this.CompareCircleItemArr[1].setTitle(this.getLabelStr(this.secondChooseType));
        this.sendGetBaseData(this.secondChooseType);
    }
    
    private changeChoseShowLabel(index:number,arg:number):void{
        let label=index==0?this.chose_label_show_1:this.chose_label_show_2;
        label.string=this.getLabelStr(arg);
    }
    private getLabelStr(timeType:number):string{
        let str="";
        switch(timeType){
            case CountTimeType.eLives:
                str = "生涯";
                break;
            case CountTimeType.eDay1:
                str = "近1天";
                break;
            case CountTimeType.eDay3:
                str = "近3天";
                break;
            case CountTimeType.eDay7:
                str = "近7天";
                break;
            case CountTimeType.eWeek4:
                str = "近4周";
                break;
        }
        return str;
    }

    // update (dt) {}
}
