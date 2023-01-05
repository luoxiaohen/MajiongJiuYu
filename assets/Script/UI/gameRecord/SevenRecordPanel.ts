// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventType from "../../event/EventType";
import GameInfo from "../../Game/info/GameInfo";
import { Msg_CS_GetPlayerRecord, Msg_SC_PlayerRecord } from "../../proto/LobbyMsg";
import { RecordUnit } from "../../proto/MagRecordDef";
import DialogManager from "../../Shared/DialogManager";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import List from "../uiList/List";
import ListItem from "../uiList/ListItem";
import SevenRecordPlayerItem from "./SevenRecordPlayerItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SevenRecordPanel extends UIBase {

    @property(cc.Label)
    chosedLabel: cc.Label = null;
    @property(cc.Label)
    allCardLabel: cc.Label = null;
    @property(cc.Label)
    onlyDuiJuLabel: cc.Label = null;
    @property(cc.Label)
    onlyHorseLabel: cc.Label = null;
    @property(cc.Node)
    chooseTypeContent:cc.Node=null;

    @property(cc.Node)
    private scrollContent:cc.Node=null;
    @property(cc.Node)
    private chooseContent:cc.Node=null;
    @property(cc.ScrollView)
    scrollView:cc.ScrollView=null;
    @property(List)
    scrollList:List=null;
    @property(cc.Layout)
    scrollLayout:cc.Layout=null;
    @property(cc.Node)
    maskView:cc.Node=null;
    @property(cc.Node)
    nodataNode:cc.Node=null;
    
    @property(cc.Button)
    private recordBtn:cc.Button=null;
    @property(cc.Button)
    private cancelRecordBtn:cc.Button=null;
    @property(cc.Button)
    private statisBtn:cc.Button=null;
    @property(cc.Toggle)
    private allToggle:cc.Toggle=null;


    private nowChooseType:number=0;
    private recordData:RecordUnit[]=[];

    private playerItemPrefab:cc.Prefab;


    // onLoad () {}

    start () {
        this.nowChooseType=0;
        this.chooseTypeContent.active=false;
        this.chooseTypeContent.scaleY=0;
        this.scrollList.node.y=328;
        this.setChooseState(null,"0");
        this.showChooseState();
        this.playerItemPrefab=Global.Utils.getPreFabBySource("gameRecord/prefab/SevenRecordPlayerItem");
        this.addlistener();
        let msg=new Msg_CS_GetPlayerRecord();
        Global.mgr.socketMgr.send(-1,msg);
    }
    addlistener():void{
        Global.EventCenter.addEventListener(EventType.SevenPlayerRecord,this.onSevenPlayerRecord,this);
        Global.EventCenter.addEventListener(EventType.onSevenPlayerRecordChosed,this.onPlayerChoseItemClick,this);
    }
    private onSevenPlayerRecord(de,msg:Msg_SC_PlayerRecord):void{
        this.recordData=[];
        if(msg.rcds){
            this.recordData=msg.rcds;
        }
        this.refreshView();
    }
    //478 328
    private choseType:number=0;
    private color_choose=cc.color(97,195,243);
    private color_unchose=cc.color(255,255,255);
    public setChooseState(event,_type:string):void{
        if(_type==this.choseType.toString()){
            return;
        }
        this.choseType=Number(_type);
        this.chooseTypeContent.active=false;
        this.chooseTypeContent.scaleY=0;
        switch(this.choseType){
            case 0:
                this.chosedLabel.string="全部牌局";
                break;
            case 1:
                this.chosedLabel.string="只看对局";
                break;
            case 2:
                this.chosedLabel.string="只看买马";
                break;
        }
        this.refreshView();
    }
    private weekShowIndexArr:boolean[]=[];
    private nowFilterData:RecordUnit[]=[];
    private nowChosedStatisIndexArr:boolean[]=[];
    private  refreshView():void{
        this.nowFilterData=this.recordData.filter(this.filterFuc.bind(this));
        if(this.nowFilterData.length==0){
            this.setStatisticsState(null,"0");
            this.nodataNode.active=true;
            this.recordBtn.node.active=true;
            this.cancelRecordBtn.node.active=false;
            return;  
        }
        this.nowFilterData.sort(function(a,b){
            return b.endTime-a.endTime;
        });
        this.nodataNode.active=false;
    
        this.setFirstShowIndexData();
        this.setStatisticsState(null,"0");
     
        this.scrollList.numItems=this.nowFilterData.length;
        this.scrollContent.height=288*this.nowFilterData.length+this.weekShowIndexArr.length*50+100;
        this.nowChosedStatisIndexArr=new Array(this.nowFilterData.length);
        this.scrollView.scrollToTop(1);
    }
    private setFirstShowIndexData():void{
        this.weekShowIndexArr=[];
        let tempDayStr=[];
        for(let index=0;index<this.nowFilterData.length; index++){
            let recodData=this.nowFilterData[index]
            let dayArr=Global.Utils.getTimesNumArrByTamp(recodData.endTime*1000);
            let nowDayWeekShowStr=dayArr[0]+"-"+dayArr[1]+"-"+dayArr[2];
            if(!tempDayStr.includes(nowDayWeekShowStr)){
                tempDayStr.push(nowDayWeekShowStr);
                this.weekShowIndexArr[index]=true;
            }
        }
    }
    onScrollListRender(item:cc.Node,idx:number){
        if(!!this.weekShowIndexArr[idx]&&idx!=0){
            item.height=338;
        }else{
            item.height=288;
        }
        let playerItem=item.getComponent(SevenRecordPlayerItem);
        playerItem.initeValue(this.nowFilterData[idx],!!this.weekShowIndexArr[idx],idx);
        playerItem.setChooseToggleValue(Boolean(this.nowChosedStatisIndexArr[idx]));
        playerItem.setChoseState(this.nowStatiticeState);
        // this.scrollLayout.updateLayout();
    }
    onListSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if (!item)
            return;
        let list: List = item.getComponent(ListItem).list;
        let str: string = '当前操作List为：' + list.node.name + '，当前选择的是：' + selectedId + '，上一次选择的是：' + lastSelectedId;
        if (list.selectedMode == 2) { //如果是多选模式
            str += '，当前值为：' + val;
        }
        cc.log(str);
        let data=this.nowFilterData[selectedId];
        if(this.nowStatiticeState){
            return;
        }
        if(data){
            DialogManager.ins.createDialog("gameRecord/prefab/CardGameDetailPanel",{tid:data.tid,playerType:data.playerType},function(cb,dialog){
                dialog.y=-960;
                dialog.x=540;
            });
        }else{
            Global.Utils.debugOutput("选择错误！！！");
        }
    }
    
    private filterFuc(value:RecordUnit):boolean{
        //（按位取值，0=旁观，0x01=牌局；0x02=买马）00 / 01 11 / 10 11
        let first=value.playerType&1;
        let second=value.playerType&2;
        if(this.choseType==1){
            return first==1;
        }else if(this.choseType==2){
            return second==2;
        }
        return true;
    }
    public onChooseType():void{
        this.chooseTypeContent.active=!this.chooseTypeContent.active;
        if(this.chooseTypeContent.active){
            cc.tween(this.chooseTypeContent).to(0.1,{scaleY:1}).start();
        }else{
            this.chooseTypeContent.scaleY=0;
        }
        this.showChooseState();
    }
    private showChooseState():void{
        let type=this.choseType;
        this.allCardLabel.node.color=type==0?this.color_choose:this.color_unchose;
        this.onlyDuiJuLabel.node.color=type==1?this.color_choose:this.color_unchose;
        this.onlyHorseLabel.node.color=type==2?this.color_choose:this.color_unchose;
    }
    public onPlayerChoseItemClick(type:string,data:any):void{
        this.nowChosedStatisIndexArr[data.index]=data.state;
        let isAllChoose=true;
        for(let index=0;index<this.nowChosedStatisIndexArr.length;index++){
           if(!this.nowChosedStatisIndexArr[index]&&this.nowFilterData[index].playerType!=0){
                isAllChoose=false;
                break;
           }
        }
        this.allToggle.isChecked=isAllChoose;
        this.checkStatisBtnState();
        this.scrollList.numItems=this.nowFilterData.length;
    }
    @property(cc.Node)
    stateBtn_1:cc.Node=null;
    @property(cc.Node)
    stateBtn_2:cc.Node=null;
    private checkStatisBtnState():void{
        let isChosedItem=this.nowChosedStatisIndexArr.includes(true);
        this.stateBtn_2.active=!isChosedItem;
        this.stateBtn_1.active=isChosedItem;
    }
    public onStatisBtnClick(event,arg:string):void{
        if(arg=="0"){
            Global.Utils.dialogOutTips("未选择战绩");
            return;
        }
        if(this.nowChosedStatisIndexArr.includes(true)){
            let tids=[];
            let times=[];
            for(let index=0;index<this.nowChosedStatisIndexArr.length;index++){
                let item=this.nowChosedStatisIndexArr[index];
                if(item){
                    let data=this.nowFilterData[index];
                    data.tid&&tids.push(data.tid);
                    times.push(data.endTime);
                }
            }
            times.sort(function(a,b){
                return a-b;
            });
            DialogManager.ins.createDialog("gameRecord/prefab/SevenDayRecordStatistics",{tids:tids,times:times},function(cb,dialog){
                dialog.y=-960;
                dialog.x=540;
            });
            GameInfo.ins.addRecordStatisticsIDs(tids);
            this.scrollList.numItems=this.nowFilterData.length;
        }else{
            Global.Utils.dialogOutTips("未选择战绩");
        }
    }
    /**选择统计的状态 */
    private nowStatiticeState:boolean=false;
    public setStatisticsState(even,arg:string):void{
        this.nowStatiticeState=arg=="1";
        // this.chooseContent.active=arg=="1";
        if(arg=="1"){
            this.allToggle.isChecked=false;
        }
        let contentAcitve=arg=="1";
        this.recordBtn.node.active=arg=="0";
        this.cancelRecordBtn.node.active=arg=="1";
        this.scrollList.numItems=this.nowFilterData.length;
        this.nowChosedStatisIndexArr=new Array(this.nowFilterData.length);
        this.checkStatisBtnState();
        if(contentAcitve){
            cc.tween(this.scrollList.node).to(0.1,{y:355}).call(function(){
                this.chooseContent.active=true;
            },this).start();
            this.scrollList.node.height=1140;
            this.maskView.height=1140;
        }else{
            cc.tween(this.scrollList.node).to(0.1,{y:477}).start();
            this.scrollList.node.height=1265;
            this.maskView.height=1265;
            this.chooseContent.active=false;
        }

    }
    onAllChooseToggleClick():void{
        for(let index=0;index<this.nowChosedStatisIndexArr.length;index++){
            if(this.nowFilterData[index].playerType!=0){
                this.nowChosedStatisIndexArr[index]=this.allToggle.isChecked;
            }else{
                this.nowChosedStatisIndexArr[index]=false;
            }
        }
        this.checkStatisBtnState();
        this.scrollList.numItems=this.nowFilterData.length;
    }

    // update (dt) {}
}
