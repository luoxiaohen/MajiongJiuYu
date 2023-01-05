// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventType from "../../event/EventType";
import UserInfo from "../../Game/info/UserInfo";
import { Msg_CS_GetFeeCount, Msg_CS_GetPubBaseCount, Msg_SC_BaseCountData, Msg_SC_FeeCountData, Msg_SC_PubBaseCountData } from "../../proto/LobbyMsg";
import { PlayerInfo } from "../../proto/LobbyMsgDef";
import { CountType, PlayerBaseCount } from "../../proto/MsgCountDef";
import { Global } from "../../Shared/GloBal";
import PersonDataHelp from "../../utils/PersonDataHelp";
import DataSectorItem from "./DataSectorItem";
import DataTypeItem from "./DataTypeItem";
import OneHandMaxGetItem from "./OneHandMaxGetItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PersonDataDetailPanel extends cc.Component {
    //#region 
    @property(cc.Sprite)
    data_show_state_sprte:cc.Sprite=null;
    @property(cc.Node)
    out_node:cc.Node=null;
    @property(cc.Node)
    inside_node:cc.Node=null;

    @property(cc.Prefab)
    out_prefab:cc.Prefab=null;
    @property(cc.Prefab)
    inside_prefab:cc.Prefab=null;
    @property(cc.Prefab)
    ininside_prefab:cc.Prefab=null

    @property(cc.Node)
    out_mask:cc.Node=null;
    @property(cc.Node)
    item_bg_mask:cc.Node=null;
    @property(cc.Node)
    cicileInfoOut:cc.Node=null;

    @property(cc.Node)
    grid_root:cc.Node=null;
    @property(cc.Node)
    onehand_max_root:cc.Node=null;
    @property(cc.Node)
    novip_node:cc.Node=null;

    @property(cc.Prefab)
    dataItemPrefab:cc.Prefab=null;
    // LIFE-CYCLE CALLBACKS:
    @property(cc.Label)
    sum_game_label:cc.Label=null;
    @property(cc.Label)
    sum_hands_label:cc.Label=null;
    @property(cc.Label)
    detail_tip:cc.Label=null;

    @property(cc.Label)
    percent_label_inside:cc.Label[]=[];
    @property(cc.Label)
    percent_label_out:cc.Label[]=[];
    @property(cc.Label)
    name_label_out:cc.Label[]=[];
    @property(cc.Node)
    color_sprite_out:cc.Node[]=[];

    private itemDataTypeArr:DataTypeItem[]=[];

    //#endregion
    // onLoad () {}

    private dataArr_inside=[0,0.1,0.2,0.3,0.4];
    private dataArr_out=[
        [0.04,0.06],
        [0.1,0.05,0.05],
        [0.1,0.15,0.05],
        [0.1,0.2,0.1],
    ];
    start () {
        this.addListener();
        this.out_mask.active=false;
        this.cicileInfoOut.active=false;
    }
    addListener():void{
        Global.EventCenter.addEventListener(EventType.OpenDataTypeItemBgClick,this.OnOpenTypeItemBg,this);
        Global.EventCenter.addEventListener(EventType.GetFeeDataBackMsg,this.onGetFeeDataBackFuc,this);
        Global.EventCenter.addEventListener(EventType.GetFeeServerDataBackMsg,this.onGetFeeServerDataBackFuc,this);
        Global.EventCenter.addEventListener(EventType.GetMaxScoreMajsBackMsg,this.refreshOneHandMaxGot,this);
        Global.EventCenter.addEventListener(EventType.DataComparePanelState,this.refreshComparePanelOpenState,this);

    }
    private isCompareOpen=false;
    refreshComparePanelOpenState(type,state):void{
        this.isCompareOpen=state;
    }
    private conutType:CountType=null;
    private playerInfo:PlayerInfo=null;
    private isvip:boolean=false;

    IniteValue(data:Msg_SC_BaseCountData,countType:CountType,playerInfo:PlayerInfo):void{
        this.initeViewShow();
        this.conutType=countType;
        this.playerInfo=playerInfo;
        let info=data.info;
        this.setDataArr(info);
        this.setInOutArr();
        this.setTypeLabelStr();
        this.refreshOneHandMaxGot();
        //
        this.creatBlankData();
        this.novip_node.active=!this.isvip;
        if(this.islookData()||this.isvip){
            this.sendGetPersonData(this.conutType,this.playerInfo);
        }
    }
    private initeViewShow():void{
        this.out_mask.active=false;
        this.cicileInfoOut.active=false;
        this.setDataState(0);
        this.isvip=UserInfo.ins.vip>0;
      
        this.inside_node.destroyAllChildren();
        this.out_node.destroyAllChildren();
        this.dataArr_inside=[];
        this.dataArr_out=[];
    }
    private creatBlankData():void{
        if(this.itemDataTypeArr.length==0){
            for(let index=0;index<10;index++){
                let item= this.addOneDataTypeItem(index);
                this.itemDataTypeArr.push(item);
             }
        }else{
            for(let index=0;index<10;index++){
                this.itemDataTypeArr[index].initeData(index);
            }
        }
    }
    private ishasLookDataArr:CountType[]=[];
    public onLookData():void{
        if(this.islookData()){
            Global.Utils.dialogOutTips("本次已购买");
            return;
        }
        this.novip_node.active=false;
        this.ishasLookDataArr.push(this.conutType);
        this.sendGetPersonData(this.conutType,this.playerInfo);
    }
    private islookData():boolean{
        let isLook=false;
        for(let item of this.ishasLookDataArr){
            if(item.gameType==this.conutType.gameType&&item.roomType==this.conutType.roomType){
                isLook=true;
                break;
            }
        }
        return isLook;
    }
    public onBuyVipCard():void{
        
    }

    private dataState=0;
    /**
     * 
     * @param state 0:无玩法数据 1：数据  2:详情
     */
    private setDataState(state:number):void{
        this.dataState=state;
        if(state==0){
            Global.CCHelper.updateSpriteFrame("personData/resource/tongji_tongjitudi",this.data_show_state_sprte);
        }else if(state==1){
            Global.CCHelper.updateSpriteFrame("personData/resource/tongji_yuanxin",this.data_show_state_sprte);
        }else{
            Global.CCHelper.updateSpriteFrame("personData/resource/tongji_yuanxin2",this.data_show_state_sprte);
        }
    }
    private sendGetPersonData(countType:CountType,playerInfo:PlayerInfo):void{
        let msg:Msg_CS_GetFeeCount=new Msg_CS_GetFeeCount();
        msg.type=countType;
        msg.aid=playerInfo.aid;
        if(this.isvip){
            msg.feeRead=0;
        }else{
            msg.feeRead=1;
        }
        msg.needMaxMajs=1;
        Global.mgr.socketMgr.send(-1,msg);
    }
    private sendGetServerData(){
        let msg:Msg_CS_GetPubBaseCount=new Msg_CS_GetPubBaseCount();
        msg.type=this.conutType;
        Global.mgr.socketMgr.send(-1,msg);
    }
   
    private sumHandsNum=1;
    private setDataArr(info:PlayerBaseCount):void{
        let pinghuValue=info.fan0+info.fan1+info.fan2+info.fan3;
        let pinghuOut=[info.fan0,info.fan1,info.fan2,info.fan3];
        let duizhihuValue=info.ddh+info.jgd;
        let duzihuOut=[info.ddh,info.jgd];
        let qiduiValue=info.dui7+info.l7d+info.sl7d;
        let qiduiOut=[info.dui7,info.l7d+info.sl7d];
        let qingyise=info.qys+info.qd+info.q7d+info.ql7d+info.qjgd;
        let qingyiseOut=[info.qys,info.qd,info.q7d+info.ql7d+info.qjgd]
        let yaojiuVlaue=info.y9;
        let yaojiuOut=[info.y9];
        let jdVlaue=info.jd;
        let jdOut=[info.jd];
        this.dataArr_inside.push(pinghuValue,duizhihuValue,qiduiValue,qingyise,yaojiuVlaue,jdVlaue);
        this.dataArr_out=[];
        this.dataArr_out.push(pinghuOut,duzihuOut,qiduiOut,qingyiseOut,yaojiuOut,jdOut);
        this.sum_game_label.string=info.gameCnt+"";
        this.sum_hands_label.string=info.handCnt+"";
        this.sumHandsNum=info.handCnt;
        this.checkDataState()
    }
    private checkDataState():void{
        let state=0;
        for(let item of this.dataArr_inside){
            if(item>0){
                state=1;
                break;
            }
        }
        this.setDataState(state);
    }
    private setInOutArr():void{
        let sumValue=0;
        for(let item of this.dataArr_inside){
            sumValue+=item;
        }
        for(let index=0;index<this.dataArr_inside.length;index++){
            if(sumValue==0){
                this.dataArr_inside[index]=0;
            }else{
                this.dataArr_inside[index]=parseFloat((this.dataArr_inside[index]/sumValue).toFixed(3));
            }
        }
        PersonDataHelp.ins.FormatArrToPresent100(this.dataArr_inside);
        for(let item of this.dataArr_out){
            for(let index=0;index<item.length;index++){
                item[index]=item[index]/sumValue;
            }
        }
        for(let index=0;index<this.dataArr_inside.length;index++){
            if(this.dataArr_inside[index]>0){
                this.addOneInsideNode(index,this.inside_node);
            }
         }
        
    }
    
    private onGetFeeDataBackFuc(type,data:Msg_SC_FeeCountData):void{
        if(this.isCompareOpen){
            return;
        }
        let formatData=PersonDataHelp.ins.FormatFeeData(data,this.sumHandsNum);
        let dataStrArr=formatData[0];
        let dataNumArr=formatData[1];
        for(let index=0;index<this.itemDataTypeArr.length;index++){
            this.itemDataTypeArr[index].setItemValue(index,dataStrArr[index],dataNumArr[index]);
        }
        this.sendGetServerData();
      
    }
    private onGetFeeServerDataBackFuc(type:string,data:Msg_SC_PubBaseCountData):void{
        if(this.isCompareOpen){
            return;
        }
       let formData=PersonDataHelp.ins.FormatFeeServerData(data);
       let dataStrArr=formData[0];
       let dataNumArr=formData[1];

        for(let index=0;index<this.itemDataTypeArr.length;index++){
            this.itemDataTypeArr[index].setSeverData(dataStrArr[index],dataNumArr[index]);
        }
    }
   
    private setTypeLabelStr():void{
        for(let index=0;index<6;index++){
            this.percent_label_inside[index].string=PersonDataHelp.ins.formatPercentNum(this.dataArr_inside[index]);
        }
    }
    private OnOpenTypeItemBg():void{
        this.item_bg_mask.active=true;
    }

    public onInsideClick(event):void{
        if(this.dataState==0){
            return;
        }
        let touch:cc.Touch = event.currentTouch;
        let touchPoint=touch.getStartLocation();
        let localPos=this.inside_node.convertToNodeSpaceAR (touchPoint);
        let dis=this.getDis(localPos);
        if(dis<150||dis>495){
            console.log("不在点击区域");
            return;
        }
        let chooseAngle=this.formatAngle(localPos);
        console.log("angle:  "+chooseAngle);
        let clickIndex=this.getClickIndex(chooseAngle);
      
        let outShowArr=this.dataArr_out[clickIndex];
        let startAngle=0;
        for(let index=0;index<clickIndex;index++){
            startAngle+=this.dataArr_inside[index];
        }
        this.out_node.destroyAllChildren();
        this.out_mask.active=true;
        for(let index=0;index<outShowArr.length;index++){
            if(outShowArr[index]>0){
                this.addOneOutNode(outShowArr,index,startAngle);
            }
        }
        this.cicileInfoOut.active=true;
        this.addOneInsideNode(clickIndex,this.out_node);
        this.addOneInsideNode(clickIndex,this.out_node,0);
        this.setOutDataLabelShow(clickIndex,outShowArr);
        this.setDataState(2);
    }
    private setOutDataLabelShow(chooseIndex:number,outShowArr:number[]):void{
        let outSum=0;
        for(let item of outShowArr){
            outSum+=item;
        }
        let formArr=[];
        for(let item of outShowArr){
            formArr.push(parseFloat((item/outSum).toFixed(3)));
        }
        PersonDataHelp.ins.FormatArrToPresent100(formArr);
        for(let index=0;index<4;index++){
            let percent_label= this.percent_label_out[index];
            let isItemShow=index<outShowArr.length;
            percent_label.node.active=isItemShow;
            let name_label=this.name_label_out[index];
            name_label.node.active=isItemShow;
            this.color_sprite_out[index].active=isItemShow;
            percent_label.string="0.0%";
            if(formArr[index]!=undefined){
                percent_label.string=PersonDataHelp.ins.formatPercentNum(formArr[index]);
                name_label.string=this.getOutInfoName(chooseIndex,index);
            }
        }
        this.detail_tip.string=this.InsideInofArrStr[chooseIndex]+"详细数据";
    }
    private InsideInofArrStr=[
        "平胡",
        "对子胡",
        "七对",
        "清一色",
        "幺九",
        "将对"
    ];
    private OutInfoArrStr=[
        ["0番平胡","1番平胡","2番平胡","3番以上"],
        ["对子胡","金钩钩"],
        ["七对","龙七对以上"],
        ["清一色","清对","清七对以上"],
        ["幺九"],
        ["将对"]
    ]
    private getOutInfoName(chooseIndex:number,index:number):string{
        let str="";
        if(this.OutInfoArrStr[chooseIndex]){
            return this.OutInfoArrStr[chooseIndex][index]
        }
        return str;
    }
    private getClickIndex(chooseAngle:number):number{
        let clickIndex=0;
        let persent=chooseAngle/360;
        let sum=0;
        let arrTemp=[0];
        for(let item of this.dataArr_inside){
            arrTemp.push(item);
        }
        for(let index=0;index<arrTemp.length;index++){
            sum+=arrTemp[index];
            if(persent>sum){
                clickIndex=index;
            }
        }
        return clickIndex;
    }
    private addOneOutNode(outShowArr:number[],index:number,startAngle:number):void{
        let obj=cc.instantiate(this.out_prefab);
        this.out_node.addChild(obj);
        obj.x=0;
        obj.y=0;
        let compnet=obj.getComponent(DataSectorItem);
        compnet.initValue(outShowArr,index,startAngle,2);
    }
    private addOneInsideNode(index:number,root:cc.Node,sidepos:number=1):void{
        let obj:cc.Node=null;
        if(sidepos==0){
            obj=cc.instantiate(this.ininside_prefab);
        }else{
            obj=cc.instantiate(this.inside_prefab);
        }
        root.addChild(obj);
        obj.x=0;
        obj.y=0;
        let compnet=obj.getComponent(DataSectorItem);
        compnet.initValue(this.dataArr_inside,index,0,sidepos);
    }
   
    private addOneDataTypeItem(index:number):DataTypeItem{
        let obj=cc.instantiate(this.dataItemPrefab);
        this.grid_root.addChild(obj);
        let item=obj.getComponent(DataTypeItem);
        item.initeData(index);
        return item;
    }
    onOutMaskClick():void{
        this.out_node.destroyAllChildren();
        this.out_mask.active=false;
        this.cicileInfoOut.active=false;
        this.setDataState(1);
    }
    onDataItemMaskClick():void{
        this.item_bg_mask.active=false;
        Global.EventCenter.dispatchEvent(EventType.DataTypeItemBgClick);
    }

    private getDis(pos:cc.Vec2):number{
        return Math.sqrt(Math.pow(pos.x,2)+Math.pow(pos.y,2));
    }
    private getAngle(x:number[],y:number[]):number{
        let mX = Math.sqrt(x.reduce((acc, n) => acc + Math.pow(n, 2), 0));
        let mY = Math.sqrt(y.reduce((acc, n) => acc + Math.pow(n, 2), 0));
        return Math.acos(x.reduce((acc, n, i) => acc + n * y[i], 0) / (mX * mY));
    }
    private formatAngle(localPos:cc.Vec2):number{
        let chooseAngle=this.getAngle([0,1],[localPos.x,localPos.y])*(180/Math.PI);
        if(localPos.x<0){
            chooseAngle=360-chooseAngle;
        }
        return chooseAngle;
    }
    private oneHandMax:OneHandMaxGetItem=null;
    private oneHandData:any=null;
  
    private refreshOneHandMaxGot(type=null,data=null):void{
        this.oneHandData=data;
     
        if(!this.oneHandMax){
            Global.Utils.createObjToNode("personData/prefab/OneHandMaxGetItem",this.onehand_max_root,null,new cc.Vec2(0,0),this.onLoadOneHandMaxFinish.bind(this));
        }else{
            this.oneHandMax.IniteValue(this.oneHandData);
        }
    }
    private onLoadOneHandMaxFinish(data,obj):void{
        this.oneHandMax=obj.getComponent(OneHandMaxGetItem);
        this.oneHandMax.IniteValue(this.oneHandData);
    }
    // update (dt) {}
}
