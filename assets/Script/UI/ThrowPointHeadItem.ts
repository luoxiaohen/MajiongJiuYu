/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-10-08 09:24:45
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-12-30 10:47:37
 * @FilePath: \MajiongJiuYu\assets\Script\UI\ThrowPointHeadItem.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { DicePointTypeEnum } from "../enum/EnumManager";
import UserInfo, { PrDiceRsltData } from "../Game/info/UserInfo";
import { SitInfo } from "../proto/TableMsgDef";
import { Global } from "../Shared/GloBal";
import UIBase from "../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ThrowPointHeadItem extends UIBase {

    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Sprite)
    playerDiceOneImage: cc.Sprite = null;
    @property(cc.Sprite)
    playerDiceTwoImage: cc.Sprite = null;
    @property(cc.Sprite)
    playerHeadImage: cc.Sprite = null;
    @property (cc.Sprite)
    selfImage : cc.Sprite = null;
    @property (cc.Label)
    numLabel : cc.Label = null;
    @property (cc.Sprite)
    pointImage : cc.Sprite = null;

    private _sitinfo: SitInfo;
    public get sitinfo(): SitInfo {
        return this._sitinfo;
    }
    public set sitinfo(value: SitInfo) {
        this._sitinfo = value;
    }

    start () {

    }
    protected onLoad(): void {
        this.hideThrow();
        this.sitinfo = this.dialogParameters.sitInfo ;
        let icon = (this.dialogParameters.sitInfo as SitInfo).player.face;
        let id : number = (this.dialogParameters.sitInfo as SitInfo).player.gpid;
        let bigNum : number = (this.dialogParameters.rslt as PrDiceRsltData).msg.bigNum;
        let smallNum : number = (this.dialogParameters.rslt as PrDiceRsltData).msg.smlNum;
        // this.nameLabel.string = id.toString();
        this.nameLabel.string = (this.dialogParameters.sitInfo as SitInfo).player.nike;
        Global.Utils.setNewImageToSprite(this.playerDiceOneImage , "comResource/dice/game_shaizi" + bigNum);
        Global.Utils.setNewImageToSprite(this.playerDiceTwoImage , "comResource/dice/game_shaizi" + smallNum);
        this.numLabel.string = (bigNum + smallNum) + "点：";
        this.selfImage.node.active = (this.dialogParameters.sitInfo as SitInfo).player.gpid == UserInfo.ins.myInfo.gpid;
    }
    public setData(type:DicePointTypeEnum){
        let source:string = "comResource/font/game_dianzhuang"
        switch(type){
            case DicePointTypeEnum.Zhuang:
                source = "comResource/font/game_dianzhuang";
            break;
            case DicePointTypeEnum.Shun:
                source = "comResource/font/game_dianshun";
            break;
            case DicePointTypeEnum.Dui:
                source = "comResource/font/game_diandui";
            break;
            case DicePointTypeEnum.Hou:
                source = "comResource/font/game_dianhou";
            break;
        }
        Global.Utils.setNewImageToSprite(this.pointImage , source);
    }

    public hideThrow(){
        this.playerDiceOneImage.node.active = false;
        this.playerDiceTwoImage.node.active = false;
    }

}
