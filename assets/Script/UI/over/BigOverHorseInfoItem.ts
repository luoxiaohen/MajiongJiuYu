// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ArtFontEnum, BigOverTypeEnum } from "../../enum/EnumManager";
import { Global } from "../../Shared/GloBal";
import { BigOverPlayerInfoItemData } from "./BigOverPanel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BigOverHorseInfoItem extends cc.Component {
    @property(cc.Node)
    private zhuangma_node:cc.Node=null;
    @property(cc.Node)
    private ma_node_1:cc.Node=null;
    @property(cc.Node)
    private ma_node_2:cc.Node=null;

    // private game_ma_sprite_1:cc.Sprite;
    // private game_ma_sprite_2:cc.Sprite;
    // private game_card_num_label:cc.Label;
    // private player_head_sprite:cc.Sprite;
    // private player_name_label:cc.Label;
    // private player_ID_label:cc.Label;
    // private player_horse_num_label:cc.Label;
    // LIFE-CYCLE CALLBACKS:
    start () {

    }

    initValue(data:BigOverPlayerInfoItemData[]):void{
        this.zhuangma_node.active=false;
        this.ma_node_1.active=false;
        this.ma_node_2.active=false;
        if(data.length==0){
            this.zhuangma_node.active=true;
        }else if(data.length==1){
            if(data[0]==null||(data[0]&&data[0].type==1)){
                this.zhuangma_node.active=true;
            }else{
                this.ma_node_1.active=true;
                this.setOneMaValue(this.ma_node_1,data[0])
            }
        }else{
            if(data[0]==null||data[0].type==1){
                this.zhuangma_node.active=true;
            }else{
                this.ma_node_1.active=true;
                this.setOneMaValue(this.ma_node_1,data[0])
            }
            this.ma_node_2.active=true;
            this.setOneMaValue(this.ma_node_2,data[1])
        }  
       

    }
    private setOneMaValue(node:cc.Node,value:BigOverPlayerInfoItemData){
        let game_card_num_label=node.getChildByName("game_card_num_label").getComponent(cc.Label);
        let player_head_sprite=node.getChildByName("player_head_sprite").getComponent(cc.Sprite);
        let player_name_label=node.getChildByName("player_name_label").getComponent(cc.Label);
        let player_ID_label=node.getChildByName("player_ID_label").getComponent(cc.Label);
        let player_horse_num_label=node.getChildByName("player_horse_num_label").getComponent(cc.Label);


        Global.CCHelper.updateSpriteFrame(value.player_head_url,player_head_sprite);
        game_card_num_label.string=value.card_num.toString();
        player_name_label.string=value.player_name;
        player_ID_label.string="ID: "+value.player_ID;
        this.setPlayerScoreLabel(player_horse_num_label,value.score_horse_num);
    }
    private setPlayerScoreLabel(_label:cc.Label,_value:number):void{
        if(_value>=0){
           Global.Utils.setLabelFont(ArtFontEnum.jiesuanJiafen,_label);
        }else{
           Global.Utils.setLabelFont(ArtFontEnum.jiesuanJianfen,_label);
        }
        _label.string=Global.CCHelper.getNumFormStr(_value);
    }
    // update (dt) {}
}
