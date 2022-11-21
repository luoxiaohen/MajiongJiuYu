// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameInfo from "../../Game/info/GameInfo";
import { PlayerInfo } from "../../proto/LobbyMsgDef";
import { Global } from "../../Shared/GloBal";
import { RealTimePreformanceData } from "../../utils/InterfaceHelp";
import RealTimePlayerInfoItem from "./RealTimePlayerInfoItem";

type recordInfo={
    
}
const {ccclass, property} = cc._decorator;

@ccclass
export default class GameRealTimePannel extends cc.Component {

    @property(cc.Node)
    player_info_content: cc.Node = null;

    @property(cc.Node)
    buy_horse_info_content: cc.Node = null;

    @property(cc.Node)
    watch_player_tip: cc.Node = null;
    @property(cc.Node)
    watch_player_content: cc.Node = null;

    private buyHorseTip:cc.Node;

    private playerInfoPrefab:cc.Prefab;
    private watchPlayerItemPrefab:cc.Prefab;

    private watch_player_num_label:cc.Label;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.playerInfoPrefab=Global.Utils.getPreFabBySource("gameRecord/prefab/RealTimePlayerInfoItem");
        this.watchPlayerItemPrefab=Global.Utils.getPreFabBySource("gameRecord/prefab/WatchPlayerHeadItem");
        this.buyHorseTip=this.node.getChildByName("buyHorseTip");
        let watchTipNode=this.node.getChildByName("watchTip");
        this.watch_player_num_label=watchTipNode.getChildByName("watch_player_num_label").getComponent(cc.Label);;
    }

    start () {
        Global.Utils.debugOutput("startTimeHeight:  "+this.node.height);

    }
    protected onEnable(): void {
        Global.Utils.debugOutput("EnableTimeHeight:  "+this.node.height);
    }

    
    private formData(info: { [key: number]: RealTimePreformanceData }):{score:number,player:PlayerInfo}[]{
        let playerMap:{[roleId:number]:{score:number,player:PlayerInfo}}={};
        for(let handsNum in info){
            let item=info[handsNum];
          
            let sitInfo=item.sitInfo;
            for(let index=0;index<sitInfo.length;index++){
                let playerId=sitInfo[index].player.aid;
                if(!playerMap[playerId]){
                    playerMap[playerId]={score:0,player:sitInfo[index].player};
                    playerMap[playerId].score=0;
                }
                for(let reslutItem of item.gameResult.results){
                    if(reslutItem.sitNum==sitInfo[index].sitNum){
                        playerMap[playerId].score+=reslutItem.score;
                    }
                }
            }
        }
        let arr:{score:number,player:PlayerInfo}[]=[];
        for(let key in playerMap){
            let data=playerMap[key];
            arr.push(data);
        }
        arr=arr.sort((a,b)=>{
            return b.score-a.score;
        });
        return arr;
    }

    initeValue():void{
        let realTimeData=GameInfo.ins.realTimePreformanceData;
        let playerData_1=this.formData(realTimeData);
        let nowHand=GameInfo.ins.nowGameCount;
        for(let index=0;index<playerData_1.length;index++){
            let obj=cc.instantiate(this.playerInfoPrefab);
            this.player_info_content.addChild(obj);
            let playerInfoComp=obj.getComponent(RealTimePlayerInfoItem);
            let playerDataItem=playerData_1[index];
            let data:any={};
            data.headSpritUrl=playerDataItem.player.face+"";
            data.playerName=playerDataItem.player.nike;
            data.playerHandStr=nowHand>0?nowHand+"/"+GameInfo.ins.roomTableInfo.rule.handsCnt:"暂未开局";
            data.playerScoreNum=playerDataItem.score+"";
            data.playerId=playerDataItem.player.aid;
            playerInfoComp.initeValue(data);
        }
        let horseNum=0;
        let horseContentHight=0;
        for(let index=0;index<horseNum;index++){
            let obj=cc.instantiate(this.playerInfoPrefab);
            horseContentHight+=obj.height;
            this.buy_horse_info_content.addChild(obj);
            let playerInfoComp=obj.getComponent(RealTimePlayerInfoItem);
            let data:any={};
            data.headSpritUrl="";
            data.playerName="PlayerName"+index;
            data.playerHandStr="2/10";
            data.playerScoreNum=10;
            data.sitIndex=-1;
            playerInfoComp.initeValue(data);
        }
        this.buy_horse_info_content.height=horseContentHight;
        this.buyHorseTip.active=horseNum>0;
        if(horseNum==0){
            this.watch_player_tip.y=-horseContentHight+this.buy_horse_info_content.y-(this.watch_player_tip.height/2)+ this.watch_player_tip.height;

        }else{
            this.watch_player_tip.y=-horseContentHight+this.buy_horse_info_content.y-(this.watch_player_tip.height/2);
        }
        this.watch_player_content.y= this.watch_player_tip.y-50;
        let watchPlayerNum=0;
        for(let index=0;index<watchPlayerNum;index++){
            let obj=cc.instantiate(this.watchPlayerItemPrefab);
            this.watch_player_content.addChild(obj);
        }
        let line=Math.ceil(watchPlayerNum/3);
        let wathchHeight=line*150+(line-1)*30;
        this.node.height=-this.watch_player_content.y+wathchHeight+60;
        Global.Utils.debugOutput("tureTimeHeight:  "+this.node.height);
        this.node.active=false;
        this.node.active=true;
        this.watch_player_num_label.string="观战玩家 ("+watchPlayerNum+"/"+"7)";
    }

    // update (dt) {}
}
