/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-11-23 14:04:57
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-12-13 13:48:36
 * @FilePath: \MajiongJiuYu\assets\Script\UI\buyHorse\MyHorseItem.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CallBack } from "../../com/CallBack";
import UserInfo from "../../Game/info/UserInfo";
import { GamePlayTypeEnum } from "../../proto/LobbyMsgDef";
import { Msg_CS_CancelBuyHorse, Msg_SC_HorseRoomInfo, Msg_SC_NewHorseScoreRslt } from "../../proto/TableMsg";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import MyHorseItemInfo from "./MyHorseItemInfo";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MyHorseItem extends UIBase {

    @property(cc.Label)
    roomTypeLabel: cc.Label = null;
    @property(cc.Label)
    difenLabel: cc.Label = null;
    @property(cc.Label)
    shengfuLabel: cc.Label = null;
    @property(cc.Label)
    buyHorseLabel: cc.Label = null;
    @property(cc.Label)
    proLabel: cc.Label = null;
    @property(cc.Label)
    zhanjiLabel: cc.Label = null;
    @property(cc.Label)
    btnLabel: cc.Label = null;
    @property (cc.Label)
    closeLabel : cc.Label = null;
    @property (cc.Sprite)
    iconImage : cc.Sprite = null;
    @property (cc.Node)
    zhanjiGroup : cc.Node = null;
    @property (cc.Node)
    infoBtn : cc.Node = null;
    @property (cc.Button)
    selHorseBtn : cc.Button = null;
    @property (cc.Node)
    infoGroup : cc.Node = null;
    @property (cc.Node)
    itemGroup : cc.Node = null;
    @property (cc.Sprite)
    roomTypeImage : cc.Sprite = null;
    @property (cc.Label)
    roomNameLabel : cc.Label = null;
    @property (cc.Sprite)
    btnImage : cc.Sprite = null;

    private myData:Msg_SC_HorseRoomInfo;
    private myInfoArr : Array<Msg_SC_NewHorseScoreRslt> = [];
    protected onLoad(): void {
        
    }

    setNewData(myData:Msg_SC_HorseRoomInfo){
        this.myData = myData;
        this.getMyInfoData();
        this.createElement();
    }
    private createElement(){
        this.roomTypeLabel.string = Global.Utils.getGameTypeNameByGameType(this.myData.info.roomType);
        let source : string = this.myData.info.gamePlayType == GamePlayTypeEnum.HuanSanZhang ? "createRoom/resource/createRoom_huansan" : "createRoom/resource/createRoom_xuezhan";
        Global.Utils.setNewImageToSprite(this.roomTypeImage , source);
        this.roomNameLabel.string = this.myData.info.roomName;
        this.difenLabel.string = "底分:" + this.myData.info.baseScore;
        let sheng:number = this.getShengNum();
        let fuNum:number = this.getFuNum();
        this.shengfuLabel.string = "+" + sheng + "/-" + fuNum;
        let allNum:number = this.getZhanji();
        this.zhanjiLabel.string =  allNum >= 0 ? "+" + allNum : "-" + allNum;
        this.buyHorseLabel.string = "买入马牌:第" + (this.myData.majNum + 1) +"张";
        this.proLabel.string = "房间进度:"+this.myInfoArr.length+"/"+this.myData.info.handsCnt+"手";
        if(this.myData.isStart == 1){
            this.closeLabel.node.active = false;
            this.selHorseBtn.node.active = false;
            this.zhanjiGroup.active = true;
            this.infoBtn.active = true;
        }else{
            this.closeLabel.node.active = true;
            this.selHorseBtn.node.active = true;
            this.zhanjiGroup.active = false;
            this.infoBtn.active = false;
        }
    }

    OnInfoClick(){
        if(this.myInfoArr.length <= 0){
            return;
        }
        if(this.infoGroup.active){
            this.infoGroup.active = false;
            this.infoGroup.scaleY = 0;
            this.itemGroup.removeAllChildren();
            this.btnLabel.string = "详细";
            this.btnImage.node.scaleY = -1;
        }else{
            this.infoGroup.active = true;
            this.infoGroup.scaleY = 1;
            this.btnLabel.string = "收起";
            this.btnImage.node.scaleY = 1;

            let item : MyHorseItemInfo;
            for(let i = 0 ; i < this.myInfoArr.length ; i++){
                item = cc.instantiate(Global.Utils.getPreFabBySource("buyHorse/prefab/MyHorseItemInfo")).getComponent(MyHorseItemInfo);
                item.setData(this.myInfoArr[i]);
                this.itemGroup.addChild(item.node);
                item.node.x = 0;
            }
        }
    }
    onSelClick(){
        let callBack=CallBack.bind(function(){
            let msg : Msg_CS_CancelBuyHorse = new Msg_CS_CancelBuyHorse();
            msg.horseSit = this.myData.info.hsit;
            Global.mgr.socketMgr.send(-1 , msg);
        },this,true);
        Global.Utils.dialogOutConfirm("是否取消买马？", 2 , callBack, null , (dialog)=>{
            dialog.x = 0;
            dialog.y = 0;
        } , this);
    }
    private getMyInfoData(){
        let item : Msg_SC_NewHorseScoreRslt;
        for(let i = 0 ; i < UserInfo.ins.myNewHorseScoreRsltArr.length ; i++){
            item = UserInfo.ins.myNewHorseScoreRsltArr[i];
            if(item.tid == this.myData.info.tid && item.hsit == this.myData.info.hsit){
                this.myInfoArr.push(item)
            }
        }
        this.myInfoArr.sort((a,b)=>{
            if(a.handNum<b.handNum){
                return -1;
            }else if(a.handNum > b.handNum){
                return 1;
            }else{
                return 0;
            }
        })
    }
    private getZhanji():number{
        let num:number = 0;
        for(let i = 0 ; i < this.myInfoArr.length ; i++){
            num += this.myInfoArr[i].win;
        }
        return num;
    }
    private getShengNum():number{
        let num:number = 0;
        for(let i = 0 ; i < this.myInfoArr.length ; i++){
            if(this.myInfoArr[i].win >= 0){
                num++;
            }
        }
        return num;
    }
    private getFuNum():number{
        let num:number = 0;
        for(let i = 0 ; i < this.myInfoArr.length ; i++){
            if(this.myInfoArr[i].win < 0){
                num++;
            }
        }
        return num;
    }
}

