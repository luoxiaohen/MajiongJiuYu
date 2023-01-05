// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventType from "../../event/EventType";
import GameInfo from "../../Game/info/GameInfo";
import { Msg_CS_GetMahjRecordScore, Msg_SC_MahjRecordScore } from "../../proto/LobbyMsg";
import { PlayerInfo } from "../../proto/LobbyMsgDef";
import { MahjRecordScore, MahjScoreInfo, RecordUnit } from "../../proto/MagRecordDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import { StatisPlayerInfoData } from "../../utils/InterfaceHelp";
import List from "../uiList/List";
import SevenDayRecordStatisticsItem from "./SevenDayRecordStatisticsItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SevenDayRecordStatistics extends UIBase {
    @property(cc.Label)
    time_label: cc.Label = null;
    @property(cc.Label)
    sumchose_label: cc.Label = null;
    @property(List)
    scrollList:List=null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }
    
    start () {
        this.addListener();
        let msg=new Msg_CS_GetMahjRecordScore();
        msg.tids=this.dialogParameters.tids;
        Global.mgr.socketMgr.send(-1,msg)
        this.sumchose_label.string="共勾选"+this.dialogParameters.tids.length+"局";
        let times=this.dialogParameters.times;
        this.time_label.string=Global.Utils.timestampToTime(times[0]*1000,2,"-")+"至"+Global.Utils.timestampToTime(times[times.length-1]*1000,2,"-");
    }
    private addListener():void{
        Global.EventCenter.addEventListener(EventType.MahjRecordScore,this.OnMahjRecordScore,this);
    }
    private data:StatisPlayerInfoData[]=[];
    private OnMahjRecordScore(type: string, data: Msg_SC_MahjRecordScore): void {
        this.data = [];
        for (let item of data.infos) {
            for (let scoreInfo of item.scores) {
                if(!scoreInfo.player){
                    continue;
                }
                let dataItem = this.getPlayerInData(scoreInfo.player.aid)
                if (dataItem) {
                    if(scoreInfo.sit<=3){
                        dataItem.score += scoreInfo.score;
                        dataItem.bankerHScore += scoreInfo.bankerHScore;
                        dataItem.game_play_game += 1;
                        dataItem.game_tabel+=1;
                        if(item.isBankerHorse){
                            dataItem.game_buyhorse += 1
                        }
                        
                    }else{
                        dataItem.scoreHorse += scoreInfo.scoreHorse;
                        if(dataItem.t_id!=item.tid){
                            dataItem.game_buyhorse += 1;
                            dataItem.t_id=item.tid;
                            if(!this.chargeIsInTabel(dataItem.player.aid,item.scores)){
                                dataItem.game_play_game+=1;
                             }
                        }
                    }
                } else {
                    let data = new StatisPlayerInfoData();
                    data.player = scoreInfo.player;
                    data.game_buyhorse = 0;
                    data.game_play_game = 0;
                    data.bankerHScore=0;
                    data.game_tabel=0;
                    data.score=0;
                    data.scoreHorse=0;
                    data.t_id=item.tid;
                    if (scoreInfo.sit <= 3) {
                        data.score =  scoreInfo.score;
                        data.bankerHScore = scoreInfo.bankerHScore;
                        data.game_tabel+=1;
                        data.game_play_game += 1;
                        if(item.isBankerHorse){
                            data.game_buyhorse = 1
                        }
                        
                    } else {
                        data.scoreHorse = scoreInfo.scoreHorse;
                        data.game_buyhorse = 1;
                        if(!this.chargeIsInTabel(data.player.aid,item.scores)){
                           data.game_play_game+=1;
                        }
                    }
                    this.data.push(data);
                }
            }
        }
        this.data.sort((a,b)=>{
            return b.score-a.score;
        });
        this.scrollList.numItems=this.data.length;

    }
    private chargeIsInTabel(id:number,scores:MahjRecordScore[]):boolean{
        let value=false;
        for(let item of scores){
            if(item.sit<4&&item.player.aid==id){
                value=true;
                break;
            }
        }
        return value;
    }
    private getPlayerInData(aid:number):StatisPlayerInfoData{
        let  return_item=null;
        for(let item of this.data){
            if(item.player.aid==aid){
                return_item=item;
                break;
            }
        }
        return return_item;
    }
    itemRenderFuc(item:cc.Node,idx:number):void{
        let itemComp=item.getComponent(SevenDayRecordStatisticsItem);
        itemComp.initeValue(this.data[idx],idx);
    }
    onCloseBtn():void{
        this.disTory();
    }

    // update (dt) {}
}
