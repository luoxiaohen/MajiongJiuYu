// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ArtFontEnum, BigOverTypeEnum } from "../../enum/EnumManager";
import UserInfo from "../../Game/info/UserInfo";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import { BigOverPlayerInfoItemData } from "./BigOverPanel";

const {ccclass, property} = cc._decorator;


@ccclass
export default class BigOverPlayerInfoItem extends UIBase {
    // LIFE-CYCLE CALLBACKS:

    private game_kuang_2:cc.Node;

    private player_head_sprite:cc.Sprite;
    private player_rank_sprite:cc.Sprite;
    @property(cc.Label)
    private player_name_label:cc.Label=null;
    @property(cc.Label)
    private player_ID_label:cc.Label=null;
    @property(cc.Label)
    private zimo_num_label:cc.Label=null;
    @property(cc.Label)
    private jiepao_num_label:cc.Label=null;
    @property(cc.Label)
    private gangpai_num_label:cc.Label=null;
    @property(cc.Label)
    private dianpao_num_label:cc.Label=null;
    @property(cc.Label)
    private player_score_label:cc.Label=null;

    @property(cc.Node)
    private node_duiju:cc.Node=null;
    @property(cc.Node)
    private node_zhuangma:cc.Node=null;
    @property(cc.Label)
    private duiju_num_label:cc.Label=null;
    @property(cc.Label)
    private zhuangma_num_label:cc.Label=null;
    onLoad () {
        this.initeUI();
    }

    start () {

    }

    private initeUI():void{
        this.game_kuang_2=this.node.getChildByName("game_kuang_2");

        this.player_head_sprite=this.node.getChildByName("player_head_sprite").getComponent(cc.Sprite);
        this.player_rank_sprite=this.node.getChildByName("player_rank_sprite").getComponent(cc.Sprite);

    }
    initValue(data:BigOverPlayerInfoItemData):void{
        Global.CCHelper.updateSpriteFrame(data.player_head_url,this.player_head_sprite);
        this.player_rank_sprite.enabled=data.player_rank_url!="";
        this.game_kuang_2.active=data.player_ID!=UserInfo.ins.myInfo.aid.toString();
        if(data.player_rank_url!=""){
            Global.CCHelper.updateSpriteFrame(data.player_rank_url,this.player_rank_sprite);
        }
        this.player_name_label.string=data.player_name;
        this.player_ID_label.string="ID:"+data.player_ID;
        this.zimo_num_label.string=data.zimo_num.toString();
        this.jiepao_num_label.string=data.jiepao_num.toString();
        this.gangpai_num_label.string=data.gangpai_num.toString();
        this.dianpao_num_label.string=data.dianpao_num.toString();
        
        this.setOverTypeShowState(data.type);
        Global.CCHelper.setLabelColorByValue(this.duiju_num_label,data.duiju_num);
        Global.CCHelper.setLabelColorByValue(this.zhuangma_num_label,data.zhuangma_num);
        this.setPlayerScoreLabel(this.player_score_label,data.player_score);
    }
  
    private setPlayerScoreLabel(_label:cc.Label,_value:number):void{
        if(_value>=0){
           Global.Utils.setLabelFont(ArtFontEnum.jiesuanJiafen,_label);
        }else{
           Global.Utils.setLabelFont(ArtFontEnum.jiesuanJianfen,_label);
        }
        _label.string=Global.CCHelper.getNumFormStr(_value);
    }

    private setOverTypeShowState(_type:BigOverTypeEnum):void{
        this.node_duiju.active=_type>0;
        this.node_zhuangma.active=_type>0;
        if(_type>0){
            this.player_score_label.node.y=23.5;
        }else{
            this.player_score_label.node.y=0;
        }
    }
   

    // update (dt) {}
}
