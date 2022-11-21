// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../../Shared/GloBal";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WatchPlayerHeadItem extends cc.Component {

    @property(cc.Sprite)
    playerHeadSprite: cc.Sprite = null;

    @property(cc.Label)
    playerNameLable: cc.Label=null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    initeValue(_playerSpriteUrl:string,_playerNameStr:string):void{
        Global.CCHelper.updateSpriteFrame(_playerSpriteUrl,this.playerHeadSprite);
        this.playerNameLable.string=_playerNameStr;
    }

    // update (dt) {}
}
