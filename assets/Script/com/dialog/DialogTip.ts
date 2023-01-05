/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-11-30 09:52:09
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-11-30 18:01:55
 * @FilePath: \MajiongJiuYu\assets\Script\com\dialog\DialogTip.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameInfo from "../../Game/info/GameInfo";
import UIBase from "../../UIBase";
import { CallBack } from "../CallBack";


const {ccclass, property} = cc._decorator;

@ccclass
export default class DialogTip extends UIBase {

    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Sprite)
    bg: cc.Sprite = null;
    // LIFE-CYCLE CALLBACKS:

    private callBack:CallBack=null;
    onLoad () {
       
    }
    startAction () {
        this.label.string=this.dialogParameters.str;
        this.callBack=this.dialogParameters.callBack;
        let scenename=GameInfo.ins.nowSceneName;
        cc.director.getScene().name;
        if(scenename=="majiong"){
            this.node.y=-1920/2;
            this.node.x=1080/2;
        }else{
            this.node.y=0;
            this.node.x=0;
        }

        let posy=this.node.y
        cc.tween(this.node).to(1,{y:posy+200,opacity:100},).call(this.animEndFuc,this).start();
    }
    private animEndFuc():void{
        if(this.callBack){
            this.callBack.excute();
        }
        this.disTory();
    }

    // update (dt) {}
}
