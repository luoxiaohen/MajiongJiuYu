// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { BigOverTypeEnum } from "../../enum/EnumManager";
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
    private player_name_label:cc.Label;
    private player_ID_label:cc.Label;
    private zimo_num_label:cc.Label;
    private jiepao_num_label:cc.Label;
    private gangpai_num_label:cc.Label;
    private dianpao_num_label:cc.Label;
    private player_score_label:cc.Label;

    private tip_duiju:cc.Node;
    private tip_zhuangma:cc.Node;
    private duiju_num_label:cc.Label;
    private zhuangma_num_label:cc.Label;

    @property(cc.BitmapFont)
    redFont:cc.BitmapFont=null;
    @property(cc.BitmapFont)
    greenFont:cc.BitmapFont=null;

    onLoad () {
        this.initeUI();
    }

    start () {

    }

    private initeUI():void{
        this.game_kuang_2=this.node.getChildByName("game_kuang_2");

        this.player_head_sprite=this.node.getChildByName("player_head_sprite").getComponent(cc.Sprite);
        this.player_rank_sprite=this.node.getChildByName("player_rank_sprite").getComponent(cc.Sprite);
        this.player_name_label=this.node.getChildByName("player_name_label").getComponent(cc.Label);
        this.player_ID_label=this.node.getChildByName("player_ID_label").getComponent(cc.Label);

        let tipsNode=this.node.getChildByName("opera_tips_node");
        let labelNode=this.node.getChildByName("opera_num_label_node");
        this.tip_duiju=tipsNode.getChildByName("tip_duiju");
        this.tip_zhuangma=tipsNode.getChildByName("tip_zhuangma");
        this.zimo_num_label=labelNode.getChildByName("zimo_num_label").getComponent(cc.Label);
        this.jiepao_num_label=labelNode.getChildByName("jiepao_num_label").getComponent(cc.Label);
        this.gangpai_num_label=labelNode.getChildByName("gangpai_num_label").getComponent(cc.Label);
        this.dianpao_num_label=labelNode.getChildByName("dianpao_num_label").getComponent(cc.Label);
        this.player_score_label=labelNode.getChildByName("player_score_label").getComponent(cc.Label);
        this.zhuangma_num_label=labelNode.getChildByName("zhuangma_num_label").getComponent(cc.Label);
        this.duiju_num_label=labelNode.getChildByName("duiju_num_label").getComponent(cc.Label);
    }
    initValue(data:BigOverPlayerInfoItemData):void{
        Global.CCHelper.updateSpriteFrame(data.player_head_url,this.player_head_sprite);
        this.player_rank_sprite.enabled=data.player_rank_url!="";
        this.game_kuang_2.active=data.player_ID!=UserInfo.ins.myInfo.aid.toString();
        if(data.player_rank_url!=""){
            Global.CCHelper.updateSpriteFrame(data.player_rank_url,this.player_rank_sprite);
        }
        this.player_name_label.string=data.player_name;
        this.player_ID_label.string=data.player_ID;
        this.zimo_num_label.string=data.zimo_num.toString();
        this.jiepao_num_label.string=data.jiepao_num.toString();
        this.gangpai_num_label.string=data.gangpai_num.toString();
        this.dianpao_num_label.string=data.dianpao_num.toString();
        
        this.setOverTypeShowState(data.type);
        this.setLabelColor(this.duiju_num_label,data.duiju_num);
        this.setLabelColor(this.zhuangma_num_label,data.zhuangma_num);
        this.setPlayerScoreLabel(this.player_score_label,data.player_score);
    }
  
    private setPlayerScoreLabel(_label:cc.Label,_value:number):void{
        if(_value>=0){
            _label.font=this.redFont;
        }else{
            _label.font=this.greenFont;
        }
        _label.string=this.getNumFormStr(_value);
    }

    private setOverTypeShowState(_type:BigOverTypeEnum):void{
        this.tip_duiju.active=_type>0;
        this.tip_zhuangma.active=_type>0;
        this.duiju_num_label.node.active=_type>0;
        this.zhuangma_num_label.node.active=_type>0;
        if(_type>0){
            this.player_score_label.node.y=23.5;
        }else{
            this.player_score_label.node.y=0;
        }
    }
    private color_red=cc.color(181,13,13);//red
    private color_green=cc.color(16,136,50);
    private setLabelColor(_label:cc.Label,_value:number):void{
        if(_value>0){
            _label.node.color=this.color_red;
        }else{
            _label.node.color=this.color_green;
        }
        _label.string=this.getNumFormStr(_value);
    }

    private getNumFormStr(_value:number):string{
        let str="";
        if(_value>0){
            str="+"+_value;
        }else{
            str=_value+"";
        }
        return str;
    }

    // update (dt) {}
}
