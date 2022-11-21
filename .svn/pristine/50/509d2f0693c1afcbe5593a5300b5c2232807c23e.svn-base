// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ScoreEventInfo } from "../../proto/TableMsgDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import MajiongEatItem from "../card/MajiongEatItem";
import OverInfoLabelItem from "./OverInfoLabelItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class OverGameinfoItem extends UIBase {
    @property (cc.Node)
    itemGroup : cc.Node = null;
    @property (cc.ScrollView)
    gameScroller : cc.ScrollView = null;
    @property (cc.Node)
    view : cc.Node = null;

    private scoreInfoArr : Array<ScoreEventInfo> = []


    setData(arr :  Array<ScoreEventInfo>){
        this.itemGroup.removeAllChildren();
        this.scoreInfoArr = arr;
		let value : OverInfoLabelItem;
        let itemArr : Array<OverInfoLabelItem> = []
        for(let i = 0 ; i < this.scoreInfoArr.length ; i++){
			value = cc.instantiate(Global.Utils.getPreFabBySource("smallOver/prefab/OverInfoLabelItem")).getComponent(OverInfoLabelItem);
            value.info = this.scoreInfoArr[i];
            this.itemGroup.addChild(value.node);
            itemArr.push(value);
		}
    }
}
