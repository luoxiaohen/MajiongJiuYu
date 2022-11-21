// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CardGroupPointBySelfEnum } from "../../enum/EnumManager";
import { Msg_SC_GangSelfMsg, Msg_SC_HuMajMsg, Msg_SC_PengMajMsg } from "../../proto/TableMsg";
import CardHelpManager from "./CardHelpManager";
import HandCardPanel from "./HandCardPanel";
import MajiongHandCard from "./MajiongHandCard";
import MajiongOutCard from "./MajiongOutCard";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DownHandCardPanel extends HandCardPanel {
    protected onLoad(): void {
        super.onLoad();
    }

    protected start(): void {
        this.initHandData();
    }

    initHandData(): void {
        super.initHandData();
        this.bySelfPoint = CardGroupPointBySelfEnum.Down;
        let item : MajiongHandCard;
        item = cc.instantiate(this.dialogParameters[0]).getComponent(MajiongHandCard) as MajiongHandCard;
        item.bySelfPoint = this.bySelfPoint;
        item.node.x = 0;
        item.node.y = 532;
        item.isFeel = true;
        this.handItemArr[13] = item;
        this.node.addChild(item.node);
        let index:number=1;
        for(let i = 12 ; i >= 0 ; i--){
            item = cc.instantiate(this.dialogParameters[0]).getComponent(MajiongHandCard) as MajiongHandCard;
            item.bySelfPoint = this.bySelfPoint;
            item.node.x = index*2;
            item.node.y = i*38 + this.feelCardChange[this.bySelfPoint];
            this.handItemArr[i] = item;
            this.node.addChild(item.node);
            index++;
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
                item.node.x += 15;
                item.isShow = true;
                item.showGetAction(i + showIndex);
            }
        }
    }
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
        let changeX:number = baseNum * 1 - row*80;
        let changeY:number = baseNum*-46 + row*46;
        let initX:number = CardHelpManager.ins.downOutCardInitPoint.x - CardHelpManager.ins.downHandCardInitPoint.x;
        let initY:number = CardHelpManager.ins.downOutCardInitPoint.y - CardHelpManager.ins.downHandCardInitPoint.y;
        item.node.x = initX - changeX;
        item.node.y = initY - changeY;
        item.node.zIndex = 40 - this.myOutArray.length;
        this.onMyOutChangeData(item);
        this.node.addChild(item.node);
        this.lastOutCard = item;
    }
    showOutCard(value: number): void {
        super.showOutCard(value);
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
