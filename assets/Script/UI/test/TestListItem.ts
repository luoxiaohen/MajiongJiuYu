// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UIBase from "../../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TestListItem extends UIBase {
    @property (cc.Label)
    testNameLabel : cc.Label = null;

    protected start(): void {
        
    }
    protected onLoad(): void {
    }

    public setData(id:number){
        this.testNameLabel.string = "我是第"+id+"个";
    }
}
