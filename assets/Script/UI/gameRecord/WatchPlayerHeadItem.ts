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
    private grayColor=cc.color(111,111,111);
    initeValue(_playerSpriteUrl:string,_playerNameStr:string,iswatching:boolean=true):void{
        Global.CCHelper.updateSpriteFrame(_playerSpriteUrl,this.playerHeadSprite);
        this.playerNameLable.string=_playerNameStr;
        if(!iswatching){
            this.playerHeadSprite.node.color=this.grayColor;
            this.playerNameLable.node.color=this.grayColor;
        }
    }

    // update (dt) {}
}
