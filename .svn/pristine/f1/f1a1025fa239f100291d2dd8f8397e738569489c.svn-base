// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CardGroupPointBySelfEnum } from "../../enum/EnumManager";
import TimeAndMoveManager from "../../mgr/TimeAndMoveManager";
import { Msg_SC_GangSelfMsg, Msg_SC_HuMajMsg, Msg_SC_PengMajMsg } from "../../proto/TableMsg";
import CardHelpManager from "./CardHelpManager";
import HandCardPanel from "./HandCardPanel";
import MajiongHandCard from "./MajiongHandCard";
import MajiongOutCard from "./MajiongOutCard";

const {ccclass, property} = cc._decorator;

@ccclass
export default class OppHandCardPanel extends HandCardPanel {
    protected onLoad(): void {
        super.onLoad();
    }

    protected start(): void {
        this.initHandData();
    }

    initHandData(): void {
        super.initHandData();
        this.bySelfPoint = CardGroupPointBySelfEnum.Opp;
        let item : MajiongHandCard;
        item = cc.instantiate(this.dialogParameters[0]).getComponent(MajiongHandCard) as MajiongHandCard;
        item.bySelfPoint = this.bySelfPoint;
        item.node.x = 0;
        item.node.y = 0;
        item.isFeel = true;
        this.handItemArr[13] = item;
        this.node.addChild(item.node);
        for(let i = 1 ; i < 14 ; i++){
            item = cc.instantiate(this.dialogParameters[0]).getComponent(MajiongHandCard) as MajiongHandCard;
            item.bySelfPoint = this.bySelfPoint;
            item.node.x = i*item.cardSize._w + this.feelCardChange[this.bySelfPoint];
            item.node.y = 0;
            this.handItemArr[13-i] = item;
            this.node.addChild(item.node);
        }
    }

    /**展示胡牌*/
    showHupai(msg: Msg_SC_HuMajMsg): void {
        super.showHupai(msg);
    }
    showGetHnads(getNum: number): void {
        super.showGetHnads(getNum);
        let item : MajiongHandCard;
        let showIndex:number=0;
        for(let i = 0 ; i < this.handItemArr.length ; i++){
            item = this.handItemArr[i];
            if(!item.isShow && showIndex < getNum){
                showIndex++;
                item.node.y = 15;
                item.isShow = true;
                item.showGetAction(i + showIndex);
            }
        }
    }
    /***创建一张出牌*/
    createOutCard(value:number = 1): void {
        super.createOutCard(value);
        let item : MajiongOutCard = cc.instantiate(this.dialogParameters[1]).getComponent(MajiongOutCard);
        item.bySelfPoint = this.bySelfPoint;
        item.cardValue = value;
        let row:number = this.getOutRow();
        let baseNum:number = 0;
        if(row > 0){
            baseNum = this.myOutArray.length - this.getBaseNum();
        }else{
            baseNum = this.myOutArray.length;
        }
        let changeX:number = baseNum*CardHelpManager.ins.outCardWidth[2] - row*CardHelpManager.ins.outCardWidth[2];
        let changeY:number = row*57;
        let initX:number = CardHelpManager.ins.oppOutCardInitPoint.x - CardHelpManager.ins.oppHandCardInitPoint.x;
        let initY:number = CardHelpManager.ins.oppHandCardInitPoint.y + CardHelpManager.ins.oppOutCardInitPoint.y;
        item.node.x = initX - changeX;
        item.node.y = initY + changeY;
        item.node.zIndex = 40 - this.myOutArray.length;
        this.onMyOutChangeData(item);
        this.node.addChild(item.node);
        this.lastOutCard = item;
    }
    showOutCard(value: number): void {
        super.showOutCard(value);
    }
    changeMoveMyHand(outItem: MajiongHandCard): void {
        super.changeMoveMyHand(outItem);
    }

    showFeelWall(cardValue?: number): void {
        super.showFeelWall(cardValue);
    }
    
    clearLastPlay(): void {
        super.clearLastPlay();
    }

    showPengGang(msg: Msg_SC_PengMajMsg): void {
        super.showPengGang(msg);
    }
    showSelfGang(msg: Msg_SC_GangSelfMsg): void {
        super.showSelfGang(msg);
    }
    disTory(): void {
        super.disTory();
    }
}
