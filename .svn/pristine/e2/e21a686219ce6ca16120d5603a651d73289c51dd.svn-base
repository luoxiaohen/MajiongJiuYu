// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { PrDiceRsltData } from "../Game/info/UserInfo";
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

    start () {

    }
    protected onLoad(): void {
        let icon = (this.dialogParameters.sitInfo as SitInfo).player.face;
        let id : number = (this.dialogParameters.sitInfo as SitInfo).player.gpid;
        let bigNum : number = (this.dialogParameters.rslt as PrDiceRsltData).msg.bigNum;
        let smallNum : number = (this.dialogParameters.rslt as PrDiceRsltData).msg.smlNum;
        this.nameLabel.string = id.toString();
        Global.Utils.setNewImageToSprite(this.playerDiceOneImage , "comResource/dice/game_shaizi" + bigNum);
        Global.Utils.setNewImageToSprite(this.playerDiceTwoImage , "comResource/dice/game_shaizi" + smallNum);
    }

    public hideThrow(){
        this.playerDiceOneImage.node.active = false;
        this.playerDiceTwoImage.node.active = false;
    }

    public onDestroy(): void {
        super.disTory()
    }
}
