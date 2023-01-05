// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DataSectorItem extends UIBase {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    private insideColor: Array<cc.Color> = [
        cc.color(112, 154, 156, 255),
        cc.color(87 , 101, 147, 255),
        cc.color(52 , 132, 146, 255),
        cc.color(68 , 139,  39, 255),
        cc.color(160, 136,  41, 255),
        cc.color(159,  73,  43, 255),
    ];

    private baseColor: Array<cc.Color> = [
        cc.color(160, 221, 224, 255),
        cc.color(125, 145, 211, 255),
        cc.color(75, 189, 209, 255),
        cc.color(97, 199, 56, 255),
        cc.color(229, 195, 59, 255),
        cc.color(228, 105, 62, 255),
    ];
    private baseClickColor: Array<cc.Color> = [
        cc.color(128, 177, 179, 255),
        cc.color(100, 116, 169, 255),
        cc.color(60, 151, 167, 255),
        cc.color(78, 159, 45, 255),
        cc.color(183, 136, 41, 255),
        cc.color(159, 156, 47, 255),
    ];
    private outColor: Array<cc.Color> = [
        cc.color(226, 247, 82, 255),
        cc.color(251, 159, 40, 255),
        cc.color(236, 108, 119, 255),
        cc.color(197, 0, 71, 255),
    ];
    private selfIndex:number=0;
    initValue(dataArr: number[], selfIndex: number, startAngle: number = 0, sidePos: number =0,): void {
        let frontValue = startAngle;
        for (let index = 0; index < selfIndex; index++) {
            frontValue += dataArr[index];
        }
        this.sprite.fillStart = 0.25 - frontValue;
        this.sprite.fillRange = -dataArr[selfIndex];
        if (sidePos==0) {
            this.node.color=this.insideColor[selfIndex];
        } else if(sidePos==1) {
            this.node.color = this.baseColor[selfIndex]
        }else if(sidePos==2){
            this.node.color = this.outColor[selfIndex];
        }else{
            this.node.color = this.outColor[selfIndex];
            // this.node.color = this.baseClickColor[selfIndex];
        }
        this.selfIndex = selfIndex;
        if (sidePos==2) {
            this.node.opacity = 0;
            cc.tween(this.node).to(0.5, { opacity: 255 }).start();
        }
    }
    // update (dt) {}
}
