// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import { OverBuyHorseInfoData } from "../../utils/InterfaceHelp";
import OverBuyHorseItem from "./OverBuyHorseItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class OverHorseInfoItem extends UIBase{
    @property(cc.Node)
    horseGroup : cc.Node = null;

    private _horseArr: Array<OverBuyHorseInfoData> = [];
    public get horseArr(): Array<OverBuyHorseInfoData> {
        return this._horseArr;
    }
    public set horseArr(value: Array<OverBuyHorseInfoData>) {
        this._horseArr = value;
        this.createElements();
    }

    private createElements(){
        this.horseGroup.removeAllChildren();
        let assest = Global.Utils.getPreFabBySource('smallOver/prefab/OverBuyHorseItem');
        if(this.horseArr[0]){
            let horseItem1 : OverBuyHorseItem = cc.instantiate(assest).getComponent(OverBuyHorseItem);
            horseItem1.buyHorseInfoData = this.horseArr[0];
            horseItem1.node.x = 254;
            this.horseGroup.addChild(horseItem1.node);
        }
        if(this.horseArr[1]){
            let horseItem1 : OverBuyHorseItem = cc.instantiate(assest).getComponent(OverBuyHorseItem);
            horseItem1.buyHorseInfoData = this.horseArr[1];
            horseItem1.node.x = 725;
            this.horseGroup.addChild(horseItem1.node);
        }
    }
}   
