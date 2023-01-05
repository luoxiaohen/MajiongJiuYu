/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-11-19 11:55:30
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-12-14 15:08:26
 * @FilePath: \MajiongJiuYu\assets\Script\UI\buyHorse\BuyHorsePanel.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameInfo from "../../Game/info/GameInfo";
import UserInfo from "../../Game/info/UserInfo";
import { Msg_CS_ReqBuyHorse, Msg_CS_SelHorse } from "../../proto/TableMsg";
import { HorserInfo } from "../../proto/TableMsgDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import BuyHorseICardtem, { BuyHorseEnum, BuyHorseICard } from "./BuyHorseICardtem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BuyHorsePanel extends UIBase {

    @property(cc.Button)
    buyCoinsBtn: cc.Button = null;
    @property(cc.Label)
    haveHorseLabel : cc.Label = null;
    @property (cc.Label)
    needCoinLabel : cc.Label = null;
    @property (cc.Label)
    fuwuLabel : cc.Label = null;
    @property (cc.Label)
    caifuLabel : cc.Label = null;
    @property (cc.Label)
    okBtn : cc.Label = null;
    @property (cc.Node)
    itemGroup : cc.Node = null;
    @property (cc.Label)
    nameLabe : cc.Label = null;
    @property (cc.Node)
    gerenGroup : cc.Node = null;
    @property (cc.Node)
    timeOverGroup : cc.Node = null;
    @property (cc.Sprite)
    timeImage : cc.Sprite = null;
    @property (cc.Label)
    timeLabel : cc.Label = null;
    @property (cc.Sprite)
    bgImage : cc.Sprite = null;


    private isBook :boolean = false;
    private itemArr:Array<BuyHorseICardtem> = [];
    private nowSelect : BuyHorseICardtem;
    protected onLoad(): void {
        this.createElement();
    }
    private createElement(){
        this.haveHorseLabel.string = "剩余可买马数量：" + (UserInfo.ins.myBuyHorseMax - UserInfo.ins.myBuyHorseArr.length);
        this.needCoinLabel.string = Global.Utils.getDairuByRule(GameInfo.ins.roomTableInfo.rule).toString();
        this.fuwuLabel.string = Global.Utils.getNeedByRule(GameInfo.ins.roomTableInfo.rule).toString();
        this.caifuLabel.string = UserInfo.ins.myInfo.gold.toString();
        this.showItem();
    }
    isBooks(isBook : boolean){
        this.isBook = isBook;
        this.gerenGroup.active = !isBook;
        this.buyCoinsBtn.node.active = !isBook;
        this.haveHorseLabel.node.active = !isBook;
        this.nameLabe.string = isBook ? "请选择本局马牌" : "请选择本局马牌";
        this.nameLabe.node.y = isBook ? 284 : 337;
        this.timeOverGroup.active = isBook;
        if(isBook){
            this.showTimeOut();
        }
    }
    private timeIndex:number = 0;
    private showTimeOut(){
        this.timeIndex = 0;
        this.schedule(()=>{
            this.timeIndex ++;
            this.timeLabel.string = "倒计时:" + (15 - this.timeIndex).toString() + "s";
            this.timeImage.node.width = this.timeIndex*(834/15);
            if(this.timeIndex == 15){
                this.disTory();
            }
        } , 1 , 15 , 0);
    }
    private showItem(){
        this.itemArr = [];
        let horseItem : BuyHorseICardtem;
        let data:BuyHorseICard;
        for(let i = 101 ; i < 109 ; i++ ){
            horseItem = cc.instantiate(Global.Utils.getPreFabBySource("buyHorse/prefab/BuyHorseICardtem")).getComponent(BuyHorseICardtem);
            data = new BuyHorseICard();
            data.index = i;
            data.cardType = this.getType(i);
            horseItem.setData(data);
            this.itemGroup.addChild(horseItem.node);
            horseItem.node.x = (i-1)%4 *220;
            horseItem.node.y = i <= 104 ? 180 : 0;
            horseItem.node.on(cc.Node.EventType.TOUCH_START , this.onHorseItemClick , this)
            if(i == 108){
                horseItem.isSelect = true;
                this.nowSelect = horseItem;
            }
            this.itemArr.push(horseItem);
        }
    }
    private onHorseItemClick(e:cc.Event){
        let item :BuyHorseICardtem = e.currentTarget.getComponent(BuyHorseICardtem);
        if(item.cardData.cardType == BuyHorseEnum.BookSelect || item.cardData.cardType == BuyHorseEnum.OtherSelect){
            return;
        }
        this.nowSelect = item;
        for(let i = 0 ; i < this.itemArr.length ; i++){
            this.itemArr[i].isSelect = false;
        }
        item.isSelect = true;
    }
    private getType(index:number):BuyHorseEnum{
        let arr:Array<HorserInfo> = GameInfo.ins.gameHorseArray;
        for(let i = 0 ; i < arr.length ; i++){
            let info : HorserInfo = arr[i];
            if(info.majNum == index-1){
                if(info.isBanker){
                    return BuyHorseEnum.BookSelect;
                }else{
                    return BuyHorseEnum.OtherSelect;
                }
            }
        }
        return BuyHorseEnum.DontSelect;
    }
    onBgClick(){
        this.disTory();
    }
    onOkClick(){
        if(this.nowSelect){
            if(this.isBook){
                let msg:Msg_CS_SelHorse = new Msg_CS_SelHorse();
                msg.majNum = this.nowSelect.cardData.index-1;
                Global.mgr.socketMgr.send(-1 , msg);
            }else{
                let msg:Msg_CS_ReqBuyHorse = new Msg_CS_ReqBuyHorse();
                msg.majNum = this.nowSelect.cardData.index-1;
                Global.mgr.socketMgr.send(-1 , msg);
            }
           this.disTory();
        }
    }
}
