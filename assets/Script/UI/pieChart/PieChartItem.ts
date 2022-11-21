// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UIBase from "../../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PieChartItem extends UIBase {

    start () {

    }
    private cb;
    private thisObj;
    private key;
    protected onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_START , this.onClick , this);
    }
    onClick(){
        this.cb.bind(this.thisObj)(this.key);
    }
    public setClick(key , cb : Function , thisObj){
        this.cb = cb;
        this.key = key;
        this.thisObj = thisObj;
    }


}
