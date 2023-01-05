// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventType from "../../event/EventType";
import GameInfo from "../../Game/info/GameInfo";
import { PlayerInfo } from "../../proto/LobbyMsgDef";
import { Msg_CS_GetEyesList, Msg_SC_SyncEyesList } from "../../proto/TableMsg";
import { GameResultInfo, SitInfo } from "../../proto/TableMsgDef";
import { Global } from "../../Shared/GloBal";
import { OverBuyHorseInfoData, RealTimePreformanceData } from "../../utils/InterfaceHelp";
import PersonDataHelp from "../../utils/PersonDataHelp";
import RealTimePlayerInfoItem from "./RealTimePlayerInfoItem";
import WatchPlayerHeadItem from "./WatchPlayerHeadItem";

type recordInfo={
    
}
const {ccclass, property} = cc._decorator;

@ccclass
export default class GameRealTimePannel extends cc.Component {

    @property(cc.Node)
    player_info_content: cc.Node = null;

    @property(cc.ScrollView)
    scollView: cc.ScrollView = null;

    @property(cc.Node)
    buy_horse_info_content: cc.Node = null;

    @property(cc.Node)
    watch_player_tip: cc.Node = null;
    @property(cc.Node)
    watch_player_content: cc.Node = null;
    @property(cc.Node)
    private buyHorseTip:cc.Node=null;

    private playerInfoPrefab:cc.Prefab;
    private watchPlayerItemPrefab:cc.Prefab;
    @property(cc.Label)
    private watch_player_num_label:cc.Label=null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.playerInfoPrefab=Global.Utils.getPreFabBySource("gameRecord/prefab/RealTimePlayerInfoItem");
        this.watchPlayerItemPrefab=Global.Utils.getPreFabBySource("gameRecord/prefab/WatchPlayerHeadItem");
        this.addEvent();
    }

    start () {

    }
    
    addEvent():void{
        Global.EventCenter.addEventListener(EventType.EyesPlayerMsg,this.onGetEyesPlayers,this);
    }
    removeEvent():void{
        Global.EventCenter.removeEventListener(EventType.EyesPlayerMsg,this.onGetEyesPlayers,this);
    }

    
    private formData(info: { [key: number]: RealTimePreformanceData }):{score:number,player:PlayerInfo,sitNum:number}[]{
        let playerMap:{[roleId:number]:{score:number,player:PlayerInfo,sitNum:number}}={};
        for(let handsNum in info){
            let item=info[handsNum];
            let sitInfo=item.sitInfoArr;
            if(!sitInfo){
                continue;
            }
            for(let index=0;index<sitInfo.length;index++){
                let playerId=sitInfo[index].player.aid;
                if(!playerMap[playerId]){
                    playerMap[playerId]={score:0,player:sitInfo[index].player,sitNum:sitInfo[index].sitNum};
                    playerMap[playerId].score=0;
                }
                for(let reslutItem of item.gameResultArr){
                    if(reslutItem.sitNum==sitInfo[index].sitNum){
                        playerMap[playerId].score+=reslutItem.score;
                    }
                }
            }
        }
        let arr:{score:number,player:PlayerInfo,sitNum:number}[]=[];
        for(let key in playerMap){
            let data=playerMap[key];
            arr.push(data);
        }
        arr=arr.sort((a,b)=>{
            return b.score-a.score;
        });
        return arr;
    }
    private maxWatchNum:number=7;
    initeValue():void{
        let realTimeData=GameInfo.ins.realTimePreformanceData;
        let nowHand=GameInfo.ins.nowGameCount;
        let handInfo=realTimeData[nowHand];
        if(!handInfo&&(nowHand==0||nowHand==1)){
            let players=GameInfo.ins.gamePlayers;
            for(let item of players){
                this.createBlankPlayerItem(item.player,item.sitNum);
            }
            this.buyHorseTip.active=GameInfo.ins.gameHorseArray.length>0;
            this.buy_horse_info_content.active=GameInfo.ins.gameHorseArray.length>0;
            for(let item of GameInfo.ins.gameHorseArray){
                let obj=cc.instantiate(this.playerInfoPrefab);
                this.buy_horse_info_content.addChild(obj);
                let playerInfoComp=obj.getComponent(RealTimePlayerInfoItem);
                let playerInfo=item.player;
                let handStr=nowHand+"/"+GameInfo.ins.roomTableInfo.rule.handsCnt;
                let horseData_1=PersonDataHelp.ins.getHorseData_2(item)
                playerInfoComp.initeValue_horse(horseData_1,playerInfo,handStr,true);
            }

            this.getEyesList();
            return;
        }
        let playerData_1=this.formData(realTimeData);
        for(let index=0;index<playerData_1.length;index++){
           this.createPlayerItem(playerData_1[index],nowHand,playerData_1[index].sitNum);
        }
        let horseData=this.formatHorseData();
        for(let index=0;index<horseData.length;index++){
            let obj=cc.instantiate(this.playerInfoPrefab);
            this.buy_horse_info_content.addChild(obj);
            let playerInfoComp=obj.getComponent(RealTimePlayerInfoItem);
            let handStr=horseData[index].sumbuyCount+"/"+GameInfo.ins.roomTableInfo.rule.handsCnt;
            playerInfoComp.initeValue_horse(horseData[index],horseData[index].playerInfo,handStr);
        }
       
        this.buyHorseTip.active=horseData.length>0;
        this.buy_horse_info_content.active=horseData.length>0;
        this.getEyesList();
    }
    private formatHorseData():OverBuyHorseInfoData[]{
        let arr=[];
        let allInfo=GameInfo.ins.realTimePreformanceData;
        let playerMap_horse:{[key:number]:OverBuyHorseInfoData}={};
        for(let key in allInfo){
            let gameResult=allInfo[key].gameResultArr;
            if(!gameResult){
                continue;
            }
            let horseData=PersonDataHelp.ins.getHorseData(gameResult[4],gameResult[5],Number(key));
            let horseArr=allInfo[key].buyHorseInfo;
            let addHoresPlayer:number[]=[];
            for(let item of horseArr){
                if(item.isBanker){
                    addHoresPlayer.push(item.player.aid);
                }
            }
            for(let index=0;index<horseData.length;index++){
                let playerAid=horseData[index].playerInfo.aid;
                if(!playerMap_horse[playerAid]){
                    if(!addHoresPlayer.includes(playerAid)){
                        horseData[index].sumbuyCount++;
                        addHoresPlayer.push(playerAid);
                    }
                    playerMap_horse[playerAid]=horseData[index];
                }else{
                    if(!addHoresPlayer.includes(playerAid)){
                        playerMap_horse[playerAid].sumbuyCount++;
                        addHoresPlayer.push(playerAid);
                    }
                    playerMap_horse[playerAid].fen+=horseData[index].fen;
                }
            }
        }
        for(let key in playerMap_horse){
            let data=playerMap_horse[key];
            arr.push(data);
        }
        return arr
    }
    private createBlankPlayerItem(player:PlayerInfo,sitNum:number):void{
        let obj=cc.instantiate(this.playerInfoPrefab);
        this.player_info_content.addChild(obj);
        let playerInfoComp=obj.getComponent(RealTimePlayerInfoItem);
        let data:any={};
        data.headSpritUrl="";//playerDataItem.player.face+"";
        data.playerName=player.nike;

        let nowHand=GameInfo.ins.nowGameCount;
        let handStr=nowHand+"/"+GameInfo.ins.roomTableInfo.rule.handsCnt
        data.playerHandStr=handStr;
        data.playerScoreNum=this.getRealTimeScoreBySit(sitNum);
        
        data.playerId=player.aid;
        playerInfoComp.initeValue(data,true);
    }
    private createPlayerItem(playerDataItem:any,nowHand:number=0,sitNum:number=0):void{
        let obj=cc.instantiate(this.playerInfoPrefab);
        this.player_info_content.addChild(obj);
        let playerInfoComp=obj.getComponent(RealTimePlayerInfoItem);
        let data:any={};
        data.headSpritUrl="";//playerDataItem.player.face+"";
        data.playerName=playerDataItem.player.nike;
        data.playerHandStr=nowHand>0?nowHand+"/"+GameInfo.ins.roomTableInfo.rule.handsCnt:"暂未开局";
        data.playerScoreNum=playerDataItem.score+this.getRealTimeScoreBySit(sitNum);
        data.playerId=playerDataItem.player.aid;
        playerInfoComp.initeValue(data);
    }
    private getRealTimeScoreBySit(sitNum:number):number{
        let gameFen=0;
        return 0;
        let realTime=GameInfo.ins.realTimeScore;
        for(let event of realTime){
            if(event.tarScore){
                for(let l = 0 ; l < event.tarSits.length ; l++){
                    if(sitNum ==  event.tarSits[l]){
                        if(event.tarSits[l] ==sitNum){
                            gameFen += event.tarScore[l];
                        }
                    }
                }
                if(event.curSit == sitNum){
                    gameFen += event.win;
                }
            }
        }
        return gameFen;
    }

    private getEyesList():void{
        let msg=new Msg_CS_GetEyesList();
        Global.mgr.socketMgr.send(-1,msg);
    }
    private onGetEyesPlayers(type,data:Msg_SC_SyncEyesList):void{
        let players=data.eyes;
        let wathingPlayers=data.onlineAids;
        let watchPlayerNum=players.length;
        for(let index=0;index<watchPlayerNum;index++){
            let obj=cc.instantiate(this.watchPlayerItemPrefab);
            this.watch_player_content.addChild(obj);
            let watchPlayerHeadItem=obj.getComponent(WatchPlayerHeadItem);
            let playerHeadStr="";
            let playerNameStr=players[index].nike;
            watchPlayerHeadItem.initeValue(playerHeadStr,playerNameStr,wathingPlayers.includes(players[index].aid));
        }
        this.watch_player_num_label.string="观战玩家 ("+wathingPlayers.length+"/"+players.length+")";
    }
    protected onDestroy(): void {
        this.removeEvent();
    }


  

    // update (dt) {}
}
