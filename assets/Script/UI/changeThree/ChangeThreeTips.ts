/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-11-03 14:34:51
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-12-07 11:09:48
 * @FilePath: \MajiongJiuYu\assets\Script\UI\changeThree\ChangeThreeTips.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventType from "../../event/EventType";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChangeThreeTips extends UIBase {

    @property(cc.Button)
    changeBtn: cc.Button = null;

    protected onLoad(): void {
        
    }

    setBtnEnabled(boo){
        this.changeBtn.enabled = boo;
        Global.Utils.setGray(cc.find("/Background" , this.changeBtn.node).getComponent(cc.Sprite) , !boo);
    }
    onChangeClick(){
        Global.EventCenter.dispatchEvent(EventType.OnChangThreeClick);
    }


    disTory(){
        super.disTory();
    }
}
