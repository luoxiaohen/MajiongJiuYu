// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventType from "../../event/EventType";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import BuyHorsePlayerInfo from "./BuyHorsePlayerInfo";
import PlayerWinRecordItem from "./PlayerWinRecordItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CardScoreRecordPanel extends UIBase {

    @property(cc.Node)
    player_info_content: cc.Node = null;

    @property(cc.Node)
    buyhorse_info_content: cc.Node = null;

    private playerWinRecordPrefab:cc.Prefab;
    private buyHosePlayerPrefab:cc.Prefab;

    private horsTitle:cc.Node;
    private time_label_1:cc.Label;
    private time_label_2:cc.Label;

    private game_info_label:cc.Label;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.playerWinRecordPrefab=Global.Utils.getPreFabBySource("gameRecord/prefab/PlayerWinRecordItem");
        this.buyHosePlayerPrefab=Global.Utils.getPreFabBySource("gameRecord/prefab/BuyHorsePlayerInfo");
        this.horsTitle=this.node.getChildByName("horseTitle");
        this.time_label_1=this.node.getChildByName("time_label_1").getComponent(cc.Label);
        this.time_label_2=this.node.getChildByName("time_label_2").getComponent(cc.Label);

        this.game_info_label=this.node.getChildByName("game_info_label").getComponent(cc.Label);

    }

    start () {

    }
    private playerInfoArr:PlayerWinRecordItem[]=[];
    private buyhorseInfoArr:BuyHorsePlayerInfo[]=[];

    initeValue(data:any=null,nowPage:number=0):void{
        for(let item of this.playerInfoArr){
            item.disTory();
        }
        for(let item of this.buyhorseInfoArr){
            item.disTory();
        }
        this.playerInfoArr=[];
        this.buyhorseInfoArr=[];
        let playerNum=4;
        let playerInfoHigh=0;
        for(let index=0;index<playerNum;index++){
            let obj=cc.instantiate(this.playerWinRecordPrefab);
            this.player_info_content.addChild(obj);
            let itemComp=obj.getComponent(PlayerWinRecordItem);
            itemComp.initeValue(null,nowPage*index);
            playerInfoHigh+=obj.height;
            this.playerInfoArr.push(itemComp);
        }
        this.horsTitle.y=this.player_info_content.y-playerInfoHigh-40;
        this.buyhorse_info_content.y=this.horsTitle.y-40;
        let buyhorseNum=4;
        let horseInfoHigh=0;
        for(let index=0;index<buyhorseNum;index++){
            let obj=cc.instantiate(this.buyHosePlayerPrefab);
            this.buyhorse_info_content.addChild(obj);
            let itemComp=obj.getComponent(BuyHorsePlayerInfo);
            itemComp.initeValue();
            horseInfoHigh+=obj.height;
            this.buyhorseInfoArr.push(itemComp);
        }
        this.node.height=-this.buyhorse_info_content.y+horseInfoHigh+40;
        if(!data){
            return;
        }
        this.time_label_1.string=data.dayStr;
        this.time_label_2.string=data.timeStr;

        //tableInfo.baozi
        this.game_info_label.string="本局"+data.game_info;
    }



    // update (dt) {}
}
