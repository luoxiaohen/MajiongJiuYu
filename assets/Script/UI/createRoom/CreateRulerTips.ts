/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-11-30 15:05:44
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-11-30 15:27:50
 * @FilePath: \MajiongJiuYu\assets\Script\UI\createRoom\CreateRulerTips.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
export default class CreateRulerTips extends UIBase {

    @property (cc.Node)
    itemGroup : cc.Node = null;
    @property (cc.Sprite)
    infoImg : cc.Sprite = null;
    onBgClick(){
        this.disTory();
    }
    protected onLoad(): void {
        
    }
    setData(num:number){
        Global.Utils.setNewImageToSprite(this.infoImg ,"comResource/morefontImage/createRoom_guize" + num ,()=>{
            switch(num){
                case 3:
                    this.infoImg.node.y = -148;
                break;
                case 5:
                    this.infoImg.node.y = -312;
                break;
                case 6:
                    this.infoImg.node.y = -195;
                break;
                case 7:
                    this.infoImg.node.y = -420;
                break;
            }
        });

    }

}
