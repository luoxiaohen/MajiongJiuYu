// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { PlayStauteEnum } from "../../enum/EnumManager";
import GameInfo from "../../Game/info/GameInfo";
import UserInfo from "../../Game/info/UserInfo";
import { PlayerInfo } from "../../proto/LobbyMsgDef";
import { Global } from "../../Shared/GloBal";
import { OverBuyHorseInfoData } from "../../utils/InterfaceHelp";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RealTimePlayerInfoItem extends cc.Component {
    @property(cc.Sprite)
    player_head_sprite:cc.Sprite=null;
    @property(cc.Label)
    player_name_label:cc.Label=null;
    @property(cc.Label)
    player_hand_num_label:cc.Label=null;
    @property(cc.Label)
    player_score_num_label:cc.Label=null;
    @property(cc.Node)
    item_bg:cc.Node=null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.item_bg=this.node.getChildByName("item_bg");
        this.player_head_sprite=this.node.getChildByName("player_head_sprite").getComponent(cc.Sprite);
        this.player_name_label=this.node.getChildByName("player_name_label").getComponent(cc.Label);
        this.player_hand_num_label=this.node.getChildByName("player_hand_num_label").getComponent(cc.Label);
        this.player_score_num_label=this.node.getChildByName("player_score_num_label").getComponent(cc.Label);
    }

    start () {

    }

    private color_red=cc.color(181,13,13);//red
    private color_green=cc.color(16,136,50);
    /**
     * 
     * @param data 
     *   let data:any={};
            data.headSpritUrl="";
            data.playerName=playerDataItem.player.nike;
            data.playerHandStr=nowHand+"";
            data.playerScoreNum=playerDataItem.score+"";
            data.sitIndex=index;
     */
    public initeValue(data:any,isblank:boolean=false):void{
        this.item_bg.active=data.playerId==UserInfo.ins.myInfo.aid;
        Global.CCHelper.updateSpriteFrame(data.headSpritUrl,this.player_head_sprite);
        this.player_name_label.string=data.playerName;
        this.player_hand_num_label.string=data.playerHandStr.toString();
        if(!isblank){
            let str=data.playerScoreNum.toString();
            if(data.playerScoreNum>=0){
                str="+"+str;
            }
            this.player_score_num_label.string=str;
            if(data.playerScoreNum>=0){
                this.player_score_num_label.node.color=this.color_red;
            }else{
                this.player_score_num_label.node.color=this.color_green;
            }
        }else{
            this.player_score_num_label.string="";
        }
    }

    public initeValue_horse(data:OverBuyHorseInfoData,playerInfo:PlayerInfo,curHandStr:string,isblank:boolean=false):void{
        if(playerInfo){
            this.item_bg.active=playerInfo.aid==UserInfo.ins.myInfo.aid;
            this.player_name_label.string=playerInfo.nike;
        }else{
            this.player_name_label.string="无数据玩家";
        }
        // Global.CCHelper.updateSpriteFrame(data.headSpritUrl,this.player_head_sprite);
        Global.CCHelper.updateSpriteFrame("smallOver/resource/game_jstouxiang2",this.player_head_sprite);
        this.player_hand_num_label.string=curHandStr;
        if(!isblank){
            let str=data.fen.toString();
            if(data.fen>0){
                str="+"+str;
            }
            this.player_score_num_label.string=str;
            if(data.fen>=0){
                this.player_score_num_label.node.color=this.color_red;
            }else{
                this.player_score_num_label.node.color=this.color_green;
            }
        }else{
            this.player_score_num_label.string="";
        }
    }

    // update (dt) {}
}
