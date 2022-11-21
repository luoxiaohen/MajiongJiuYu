// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BigOverTypeEnum } from "../../enum/EnumManager";
import { Global } from "../../Shared/GloBal";
import { BigOverPlayerInfoItemData } from "./BigOverPanel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BigOverHorseInfoItem extends cc.Component {
    private zhuangma_node:cc.Node;
    private ma_node:cc.Node;
    private game_ma_sprite_1:cc.Sprite;
    private game_ma_sprite_2:cc.Sprite;
    private game_card_num_label:cc.Label;
    private player_head_sprite:cc.Sprite;
    private player_name_label:cc.Label;
    private player_ID_label:cc.Label;
    private player_horse_num_label:cc.Label;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.ma_node=this.node.getChildByName("ma_node");
        this.zhuangma_node=this.node.getChildByName("zhuangma_node");
        this.game_ma_sprite_1=this.zhuangma_node.getChildByName("game_ma_sprite_1").getComponent(cc.Sprite);

        this.game_ma_sprite_2=this.ma_node.getChildByName("game_ma_sprite_2").getComponent(cc.Sprite);
        this.game_card_num_label=this.ma_node.getChildByName("game_card_num_label").getComponent(cc.Label);
        this.player_head_sprite=this.ma_node.getChildByName("player_head_sprite").getComponent(cc.Sprite);
        this.player_name_label=this.ma_node.getChildByName("player_name_label").getComponent(cc.Label);
        this.player_ID_label=this.ma_node.getChildByName("player_ID_label").getComponent(cc.Label);
        this.player_horse_num_label=this.ma_node.getChildByName("player_horse_num_label").getComponent(cc.Label);
    }

    start () {

    }

    initValue(data:BigOverPlayerInfoItemData[]):void{
        let type=data.length==2?BigOverTypeEnum.ZhuangMa:BigOverTypeEnum.BuyMa;
        this.zhuangma_node.active=type==BigOverTypeEnum.ZhuangMa;
        if(type==BigOverTypeEnum.BuyMa){
            this.ma_node.x=-872;
        }else{
            this.ma_node.x=0;
        }
        let value:BigOverPlayerInfoItemData=data.length==2?data[1]:data[0];

        if(data.length==2){
            Global.CCHelper.updateSpriteFrame(data[0].game_horse_url,this.game_ma_sprite_1);
        }
        Global.CCHelper.updateSpriteFrame(value.game_horse_url,this.game_ma_sprite_2);
        Global.CCHelper.updateSpriteFrame(value.player_head_url,this.player_head_sprite);
        this.game_card_num_label.string=value.card_num.toString();
        this.player_name_label.string=value.player_name;
        this.player_ID_label.string=value.player_ID;
        this.player_horse_num_label.string=value.score_horse_num.toString();
        

    }
    // update (dt) {}
}
