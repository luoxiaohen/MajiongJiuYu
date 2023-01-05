// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIViewZorderEnum } from "../../enum/EnumManager";
import EventType from "../../event/EventType";
import { Msg_CS_GetMahjRecord, Msg_SC_MahjRecord } from "../../proto/LobbyMsg";
import { PlayerInfo } from "../../proto/LobbyMsgDef";
import { MahjPlayerInfo, MahjTopInfo } from "../../proto/MagRecordDef";
import { RcdSummInfo } from "../../proto/MahjStepMsgDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import CardGameDetailPlayerItem from "./CardGameDetailPlayerItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CardGameDetailPanel extends UIBase {
    public z_order=UIViewZorderEnum.HallPanels;
    @property(cc.Label)
    endTimeLabel: cc.Label = null;
    @property(cc.Label)
    roomNameLabel: cc.Label = null;
    @property(cc.Label)
    creatorLabel: cc.Label = null;
    @property(cc.Label)
    clubNameLabel: cc.Label = null;
    @property(cc.Label)
    playTypeLabel: cc.Label = null;
    @property(cc.Label)
    baseScoreLabel: cc.Label = null;
    @property(cc.Label)
    handsLabel: cc.Label = null;

    @property(cc.Sprite)
    top_sprite_0: cc.Sprite = null;
    @property(cc.Sprite)
    top_sprite_1: cc.Sprite = null;
    @property(cc.Sprite)
    top_sprite_2: cc.Sprite = null;
    @property(cc.Sprite)
    top_sprite_3: cc.Sprite = null;

    @property(cc.Sprite)
    player_head_sprite_0: cc.Sprite = null;
    @property(cc.Sprite)
    player_head_sprite_1: cc.Sprite = null;
    @property(cc.Sprite)
    player_head_sprite_2: cc.Sprite = null;
    @property(cc.Sprite)
    player_head_sprite_3: cc.Sprite = null;

    @property(cc.Label)
    player_name_label_0: cc.Label = null;
    @property(cc.Label)
    player_name_label_1: cc.Label = null;
    @property(cc.Label)
    player_name_label_2: cc.Label = null;
    @property(cc.Label)
    player_name_label_3: cc.Label = null;

    @property(cc.Button)
    play_back_btn:cc.Button=null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    @property(cc.Node)
    scrollNode:cc.Node=null;
    @property(cc.Node)
    playerContentNode:cc.Node=null;

    private cardGameDatailPlayerItem:cc.Prefab;

    onLoad () {
        this.cardGameDatailPlayerItem=Global.Utils.getPreFabBySource("gameRecord/prefab/CardGameDatailPlayerItem");
        this.addListner();
        let msg=new Msg_CS_GetMahjRecord();
        msg.tid=this.dialogParameters.tid;
        Global.mgr.socketMgr.send(-1,msg);
        this.play_back_btn.node.active=this.dialogParameters.playerType!=0;
    }
    addListner():void{
        Global.EventCenter.addEventListener(EventType.GameRecordDetail,this.OnGameRecordDetail,this);
    }

    private OnGameRecordDetail(event,data:Msg_SC_MahjRecord):void{
        if(data){
            this.setRoomInfo(data.summ);
            this.setTopInfo(data.tops);
            this.setPlayerInfo(data.players);
        }else{

        }
    }
    private setRoomInfo(data:RcdSummInfo):void{
        this.roomNameLabel.string=data.roomName;
        this.creatorLabel.string=data.crtName;
        let ruleStr=Global.Utils.getGameNameByGameType(data.ruleType);
        let gameTypeStr=Global.Utils.getGameTypeNameByGameType(data.roomType);
        this.playTypeLabel.string=ruleStr+"-"+gameTypeStr;
        this.baseScoreLabel.string=data.baseScore+"";
        this.handsLabel.string=data.completeCnt+"";
        this.endTimeLabel.string="牌局结束时间："+Global.Utils.timestampToTime(data.time*1000,2,"-");
        if(data.icon&&data.icon!=""&&!data.icon.includes("#")){
            this.clubNameLabel.string=data.icon;
        }else{
            this.clubNameLabel.string="无";
        }
    }
    private basePath="gameRecord/resource/";
    private topData:MahjTopInfo;
    private setTopInfo(data:MahjTopInfo):void{
        this.topData=data;
        let button_0=this.player_head_sprite_0.node.getComponent(cc.Button);
        let button_1=this.player_head_sprite_1.node.getComponent(cc.Button);
        let button_2=this.player_head_sprite_2.node.getComponent(cc.Button);
        let button_3=this.player_head_sprite_3.node.getComponent(cc.Button);

        if(data.qs){
            Global.CCHelper.updateSpriteFrame(this.basePath+"zhanji_queshen1",this.top_sprite_0);
            this.setTopItemInfo(data.qs,this.player_name_label_0,this.player_head_sprite_0);
            button_0.enabled=true;
        }else{
            button_0.enabled=false;
            this.player_name_label_0.string="暂无数据";
            Global.CCHelper.updateSpriteFrame(this.basePath+"zhanji_queshen2",this.top_sprite_0);
            Global.CCHelper.updateSpriteFrame(this.basePath+"game_moren1",this.player_head_sprite_0);
        }
        if(data.jz){
            button_1.enabled=true;
            Global.CCHelper.updateSpriteFrame(this.basePath+"zhanji_jinzhu1",this.top_sprite_1);
            this.setTopItemInfo(data.jz,this.player_name_label_1,this.player_head_sprite_1);
        }else{
            button_1.enabled=false;
            this.player_name_label_1.string="暂无数据";
            Global.CCHelper.updateSpriteFrame(this.basePath+"zhanji_jinzhu2",this.top_sprite_1);
            Global.CCHelper.updateSpriteFrame(this.basePath+"game_moren1",this.player_head_sprite_1);
        }
        if(data.pw){
            button_2.enabled=true;
            Global.CCHelper.updateSpriteFrame(this.basePath+"zhanji_paowang1",this.top_sprite_2);
            this.setTopItemInfo(data.pw,this.player_name_label_2,this.player_head_sprite_2);
        }else{
            button_2.enabled=false;
            this.player_name_label_2.string="暂无数据";
            Global.CCHelper.updateSpriteFrame(this.basePath+"zhanji_paowang2",this.top_sprite_2);
            Global.CCHelper.updateSpriteFrame(this.basePath+"game_moren1",this.player_head_sprite_2);
        }
        if(data.mf){
            button_3.enabled=true;
            Global.CCHelper.updateSpriteFrame(this.basePath+"zhanji_mafei1",this.top_sprite_3);
            this.setTopItemInfo(data.mf,this.player_name_label_3,this.player_head_sprite_3);
        }else{
            button_3.enabled=false;
            this.player_name_label_3.string="暂无数据";
            Global.CCHelper.updateSpriteFrame(this.basePath+"zhanji_mafei2",this.top_sprite_3);
            Global.CCHelper.updateSpriteFrame(this.basePath+"game_moren1",this.player_head_sprite_3);
        }

    }
    onBigHeadItemClick(event,arg:string):void{
        switch(arg){
            case "qs":
                if(this.topData&&this.topData.qs){
                    this.onPlayerHeadClick(this.topData.qs)
                }
                break;
            case "jz":
                if(this.topData&&this.topData.jz){
                    this.onPlayerHeadClick(this.topData.jz)
                }
                break;
            case "pw":
                if(this.topData&&this.topData.pw){
                    this.onPlayerHeadClick(this.topData.pw)
                }
                break;
            case "mf":
                if(this.topData&&this.topData.mf){
                    this.onPlayerHeadClick(this.topData.mf)
                }
                break;
        }
    }
     public onPlayerHeadClick(playeInfo:PlayerInfo):void{
        Global.DialogManager.createDialog("personData/prefab/PersonDataPanel",{playerInfo:playeInfo},function(type,dialog){
            dialog.y=0;
            dialog.x=540;
        })
    }
    private setTopItemInfo(playerInfo:PlayerInfo,nameLabel:cc.Label,headSprite:cc.Sprite):void{
        nameLabel.string=playerInfo.nike;
        Global.CCHelper.updateSpriteFrame("",headSprite);
    }
    private setPlayerInfo(players:MahjPlayerInfo[]):void{
        let playerInfoArr:MahjPlayerInfo[]=[];
      
        for(let index=0;index<4;index++){
            playerInfoArr.push(players[index]);
        }
        playerInfoArr.sort((a,b)=>{
            return b.info.score-a.info.score;
        });
        for(let item of playerInfoArr){
            this.createOnePlayerInfoItem(item);
        }
        let horseInfoArr:MahjPlayerInfo[]=[];
        for(let index=4;index<players.length;index++){
            horseInfoArr.push(players[index]);
        }
      
        let isInclude=function(arr:MahjPlayerInfo[],dataItem:MahjPlayerInfo){
            let isContain=false;
            for(let item of arr){
                if(item.info.aid==dataItem.info.aid){
                    isContain=true;
                    break;
                }
            }
            return isContain;
        }
        for(let index=0;index<4;index++){
            let data=players[index];
            if(data.info.bankerHScore!=0||data.info.scoreHorse!=0){
                if(!isInclude(horseInfoArr,data)){
                    horseInfoArr.push(data);
                }
            }
        }
        horseInfoArr.sort((a,b)=>{
            return (b.info.bankerHScore+b.info.scoreHorse)-(a.info.bankerHScore+a.info.scoreHorse);
        });
        for(let index=0;index<horseInfoArr.length;index++){
            this.createOnePlayerInfoItem(horseInfoArr[index],true);
        }
        this.scrollNode.height=1000+132*(4+horseInfoArr.length)+(8*(horseInfoArr.length-1))+30;

    }
    private createOnePlayerInfoItem(data:MahjPlayerInfo,ishouse:boolean=false):void{
        let obj=cc.instantiate(this.cardGameDatailPlayerItem);
        this.playerContentNode.addChild(obj);
        let playerItem=obj.getComponent(CardGameDetailPlayerItem);
        playerItem.initeValue(data,ishouse);
    }
 
    onPlayBackBtn():void{
        Global.Utils.dialogOutTips("点击牌谱回复！！！");
    }
    onCloseBtn():void{
        this.disTory();
    }


    // update (dt) {}
}
