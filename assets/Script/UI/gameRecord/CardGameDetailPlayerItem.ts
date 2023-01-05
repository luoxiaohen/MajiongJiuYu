// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UserInfo from "../../Game/info/UserInfo";
import { MahjPlayerInfo } from "../../proto/MagRecordDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CardGameDetailPlayerItem extends UIBase {

    @property(cc.Sprite)
    player_hand_sprite: cc.Sprite = null;
    @property(cc.Sprite)
    zhanji_ziji: cc.Sprite = null;
    @property(cc.Label)
    player_name_label: cc.Label = null;
    @property(cc.Label)
    player_id_label: cc.Label = null;
    @property(cc.Label)
    zimo_label: cc.Label = null;
    @property(cc.Label)
    jiepao_label: cc.Label = null;
    @property(cc.Label)
    dianpao_label: cc.Label = null;
    @property(cc.Label)
    gangpai_label: cc.Label = null;
    @property(cc.Label)
    score_label: cc.Label = null;
   
    @property(cc.Sprite)
    ma_aprite: cc.Sprite = null;
    onLoad () {
       
    }
    start () {
       
    }
    private playerData:MahjPlayerInfo;
    initeValue(playerInfo:MahjPlayerInfo,ishouse:boolean=false):void{
        this.playerData=playerInfo;
        this.zhanji_ziji.node.active=playerInfo.info.aid==UserInfo.ins.myInfo.aid;
        if(playerInfo.player){
            this.player_name_label.string=playerInfo.player.nike;
        }else{
            this.player_name_label.string="服务器无数据";
        }
        Global.CCHelper.updateSpriteFrame("",this.player_hand_sprite);
        this.player_id_label.string="id:"+playerInfo.info.aid+"";
        this.zimo_label.string=ishouse?"-":playerInfo.info.zmCnt+"";
        this.jiepao_label.string=ishouse?"-":playerInfo.info.jpCnt+"";
        this.dianpao_label.string=ishouse?"-":playerInfo.info.dpCnt+"";
        this.gangpai_label.string=ishouse?"-":playerInfo.info.gpCnt+"";
        if(ishouse){
            Global.CCHelper.setLabelColorByValue(this.score_label,playerInfo.info.bankerHScore+playerInfo.info.scoreHorse);
        }else{
            Global.CCHelper.setLabelColorByValue(this.score_label,playerInfo.info.score);
        }
        this.ma_aprite.node.active=ishouse;
    }

    public onPlayerHeadClick():void{
        if(this.playerData.player){
            Global.Utils.debugOutput("玩家id:  "+this.playerData.player.aid);
            let playeInfo=this.playerData.player;
            Global.DialogManager.createDialog("personData/prefab/PersonDataPanel",{playerInfo:playeInfo},function(type,dialog){
                dialog.y=0;
                dialog.x=540;
            })
        }else{
            Global.Utils.debugOutput("无玩家信息！！！");
        }
    }

    // update (dt) {}
}
