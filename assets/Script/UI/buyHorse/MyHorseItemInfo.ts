/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-11-23 17:11:08
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-11-24 10:49:07
 * @FilePath: \MajiongJiuYu\assets\Script\UI\buyHorse\MyHorseItemInfo.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Msg_SC_NewHorseScoreRslt } from "../../proto/TableMsg";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MyHorseItemInfo extends UIBase {
    @property (cc.Label)
    shouciLabel : cc.Label = null;
    @property (cc.Label)
    playerNameLabel : cc.Label = null;
    @property (cc.Label)
    winLabel : cc.Label = null;
    @property (cc.Sprite)
    fontImage : cc.Sprite = null;
    @property (cc.Sprite)
    iconImage : cc.Sprite = null;
    
    private itemData:Msg_SC_NewHorseScoreRslt;

    protected onLoad(): void {
        
    }

    setData(msg : Msg_SC_NewHorseScoreRslt){
        this.itemData = msg;
        this.shouciLabel.string = msg.handNum.toString();
        this.playerNameLabel.string = msg.tar.gpid.toString();
        this.winLabel.string = msg.win >= 0 ? "+" + msg.win : "-" + msg.win;
        // let source : string = "majiongCard/resource/" + Global.Utils.getCardStrByValue(msg.majID);
        // Global.Utils.setNewImageToSprite(this.fontImage , source);
        Global.Utils.setMJImageToSprite(this.fontImage, Global.Utils.getCardStrByValue(msg.majID));
    }
}
