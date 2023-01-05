// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { PlayerInfo } from "../../proto/LobbyMsgDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import { OverBuyHorseInfoData } from "../../utils/InterfaceHelp";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BuyHorsePlayerInfo extends UIBase {

    private player_head_sprite:cc.Sprite;
    private player_name_label:cc.Label;
    private card_sprite:cc.Sprite;
    private score_label:cc.Label;
    private horse_num_label:cc.Label;
    private horse_sprite:cc.Sprite;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.player_head_sprite=this.node.getChildByName("player_head_sprite").getComponent(cc.Sprite);
        this.player_name_label=this.node.getChildByName("player_name_label").getComponent(cc.Label);
        this.card_sprite=this.node.getChildByName("card_sprite").getComponent(cc.Sprite);
        this.score_label=this.node.getChildByName("score_label").getComponent(cc.Label);
        this.horse_num_label=this.node.getChildByName("horse_num_label").getComponent(cc.Label);
        this.horse_sprite=this.node.getChildByName("horse_sprite").getComponent(cc.Sprite);
    }
    initeValue(data:OverBuyHorseInfoData,playerInfo:PlayerInfo):void{
        if(data.horesNum==0||data.horesNum==1){
            Global.CCHelper.updateSpriteFrame("gameRecord/resource/"+"paipu_ma"+(data.horesNum+1),this.horse_sprite);
        }
        // Global.CCHelper.updateSpriteFrame(playerInfo.face,this.player_head_sprite);
        if(playerInfo){
            this.player_name_label.string=playerInfo.nike;
        }else{
            this.player_name_label.string="";
        }
        // let cardPath= "majiongCard/resource/" + Global.Utils.getCardStrByValue(data.cardValue)+"_0"
        // Global.CCHelper.updateSpriteFrame(cardPath,this.card_sprite);
        Global.Utils.setMJImageToSprite(this.card_sprite, Global.Utils.getCardStrByValue(data.cardValue)+"_0");
        Global.CCHelper.setLabelColorByValue(this.score_label,data.fen);
        this.horse_num_label.string=(data.buyCoun+1)+"张";
    }

    start () {

    }

    // update (dt) {}
}
