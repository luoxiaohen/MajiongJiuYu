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
export default class BuyHorsePlayerInfo extends UIBase {

    private player_head_sprite:cc.Sprite;
    private player_name_label:cc.Label;
    private card_sprite:cc.Sprite;
    private score_label:cc.Label;
    private horse_num_label:cc.Label;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.player_head_sprite=this.node.getChildByName("player_head_sprite").getComponent(cc.Sprite);
        this.player_name_label=this.node.getChildByName("player_name_label").getComponent(cc.Label);
        this.card_sprite=this.node.getChildByName("card_sprite").getComponent(cc.Sprite);
        this.score_label=this.node.getChildByName("score_label").getComponent(cc.Label);
        this.horse_num_label=this.node.getChildByName("horse_num_label").getComponent(cc.Label);
    }
    initeValue(data:any=null):void{
        if(!data){
            return;
        }
        Global.CCHelper.updateSpriteFrame(data.player_head_url,this.player_head_sprite);
        this.player_name_label.string=data.player_name;
        Global.CCHelper.updateSpriteFrame(data.card_sprite_url,this.card_sprite);
        this.score_label.string=data.score_num+"";
        this.horse_num_label.string=data.horse_num+"";
    }

    start () {

    }

    // update (dt) {}
}
