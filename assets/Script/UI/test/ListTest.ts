// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import TestListItem from "./TestListItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ListTest extends UIBase {
    @property (cc.Node)
    itemGroup : cc.Node = null;

    protected start(): void {
    }

    private testItem : cc.Prefab;
    protected onLoad(): void {
        this.testItem = Global.Utils.getPreFabBySource("createRoom/prefab/TestListItem");
        this.addItem();
    }

    private addItem(){
        let item;
        for(let i = 0 ; i < 100 ; i++){
            item = cc.instantiate(this.testItem);
            (item.getComponent(TestListItem) as TestListItem).setData(i);
            this.itemGroup.addChild(item);
        }
    }
}
