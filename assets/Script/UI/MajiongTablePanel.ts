// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CallBack } from "../com/CallBack";
import { CardTypeEnum, PlayEatTypeEnum, PlayHintImageType, PlayStauteEnum } from "../enum/EnumManager";
import EventType from "../event/EventType";
import GameInfo from "../Game/info/GameInfo";
import UserInfo, { PrDiceRsltData } from "../Game/info/UserInfo";
import { MainManager } from "../MainManager";
import TimeAndMoveManager from "../mgr/TimeAndMoveManager";
import { GamePiaoTypeEnum, GameRoomTypeEnum } from "../proto/LobbyMsgDef";
import { Msg_CS_DoDice, Msg_CS_PressDice, Msg_CS_Ready, Msg_SC_BeginDiceMsg, Msg_SC_BuGanging, Msg_SC_CancelBuyHorse, Msg_SC_Change3Maj, Msg_SC_DiceRslt, Msg_SC_DingQue, Msg_SC_DownMajMsg, Msg_SC_GangSelfMsg, Msg_SC_GetMajMsg, Msg_SC_HorseRoomInfo, Msg_SC_HuMajMsg, Msg_SC_NewHorseScoreRslt, Msg_SC_OneSit, Msg_SC_PengMajMsg, Msg_SC_PrDiceRslt, Msg_SC_QueRslt, Msg_SC_Ready, Msg_SC_RealScore, Msg_SC_RqCloseGame, Msg_SC_SelHorseRslt, Msg_SC_SomeTurnMsg, Msg_SC_StartChange3, Msg_SC_StartDiceGame, Msg_SC_StartDicePos, Msg_SC_StartDingQue, Msg_SC_StartGame, Msg_SC_StartSelHorse, Msg_SC_WaitDownMsg, Msg_SC_WaitYou, Msg_SC_You3Maj, Msg_SC_YouMajMsg } from "../proto/TableMsg";
import { HorserInfo, SitDiceInfo, SitInfo, SitQueInfo } from "../proto/TableMsgDef";
import { Global } from "../Shared/GloBal";
import Utils from "../Shared/Utils";
import SitDownTips from "../tips/SitDownTips";
import UIBase from "../UIBase";
import { EatCardClass, HuData, MyActionByOther, SelectHandCardData, SitSortData } from "../utils/InterfaceHelp";
import BuyHorsePanel from "./buyHorse/BuyHorsePanel";
import MyHorsePanel from "./buyHorse/MyHorsePanel";
import BuyHorseItem from "./BuyHorseItem";
import CardHelpManager from "./card/CardHelpManager";
import DownHandCardPanel from "./card/DownHandCardPanel";
import HandCardPanel from "./card/HandCardPanel";
import MajiongWallCard from "./card/MajiongWallCard";
import MyHandCardPanel from "./card/MyHandCardPanel";
import OppHandCardPanel from "./card/OppHandCardPanel";
import UpHandCardPanel from "./card/UpHandCardPanel";
import ChangeThreeItem from "./changeThree/ChangeThreeItem";
import ChangeThreePanel from "./changeThree/ChangeThreePanel";
import ChangeThreeTips from "./changeThree/ChangeThreeTips";
import DingQuePanel from "./DingQuePanel";
import GameTurntablePanel from "./GameTurntablePanel";
import PlayerHeadItem from "./PlayerHeadItem";
import ThrowPointHeadItem from "./ThrowPointHeadItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MajiongTablePanel extends UIBase {
    @property (cc.Node)
    headGroup : cc.Node = null;
    @property (cc.Node)
    tipsGroup : cc.Node = null;
    @property (cc.Node)
    btnGroup : cc.Node = null;
    @property (cc.Node)
    tableElementsGroup : cc.Node = null;
    @property (cc.Button)
    readyBtn : cc.Button = null;
    
    @property (cc.Label)
    tableIdLabel : cc.Label = null;
    @property (cc.Sprite)
    gameBeginImage : cc.Sprite = null;
    @property(cc.Button)
    gameDiceBtn : cc.Button = null;
    @property (cc.Label)
    rollDiceLabel : cc.Label = null;
    @property (cc.Node)
    cardTableGroup : cc.Node = null;
    @property (cc.Button)
    changeThreeBtn : cc.Button = null;
    @property (cc.Sprite)
    fightImage : cc.Sprite = null;
    @property (cc.Sprite)
    baoziImage : cc.Sprite = null;
    
    @property (cc.Sprite)
    infoQuetionBtn : cc.Sprite = null;
    @property (cc.Sprite)
    listBtn : cc.Sprite = null;
    @property (cc.Sprite)
    menuBtn : cc.Sprite = null;
    @property (cc.Sprite)
    hordeBtn : cc.Sprite = null;
    @property (cc.Label)
    gameinfoLabel : cc.Label = null;
    @property (cc.Node)
    buyHorseGroup : cc.Node = null;
    @property (cc.Sprite)
    lookBg : cc.Sprite = null;
    @property (cc.Node)
    horseGroup : cc.Node = null;
    @property (cc.Sprite)
    lineImage : cc.Sprite = null;
    @property (cc.Label)
    fenLabel : cc.Label = null;
    @property (cc.Sprite)
    hitImage : cc.Sprite = null;
    @property (cc.Sprite)
    cutDownTip : cc.Sprite = null;
    @property (cc.Sprite)
    daojishi : cc.Sprite = null;
    @property (cc.Label)
    cutDownLabel : cc.Label = null;
    @property (cc.Sprite)
    playTipsLable : cc.Sprite = null;
    @property (cc.Sprite)
    gameNameImage : cc.Sprite = null;
    @property (cc.Sprite)
    gameTypeImage : cc.Sprite = null;
    @property (cc.Label)
    dizhuLabel : cc.Label = null;
    @property (cc.Label)
    nameLabel : cc.Label = null;
    @property (cc.Button)
    sitBtn : cc.Button = null;
    @property(cc.Prefab)
    playerHeadItem: cc.Prefab = null;

    /**玩家头像位置*/
    private playerPointArr:Array<cc.Vec2> = [cc.v2(26,-679),cc.v2(1738,-328),cc.v2(1431,-11),cc.v2(26,-328)];
    /**玩家头像集合*/
    private playerHeadArr:Array<PlayerHeadItem> = [];
    /**我的初始位置*/
    private myInitSitIndex:number=-1;
    /**玩家定位暂存*/
    private prDiceRsltArr:Array<PrDiceRsltData> = [];
    /**自己坐下时候的初始位置暂存*/
    private myInitSit : number=0;
    /**是否已经完成了矫座*/
    private returnPointOver:boolean = false;
    /**是否是掷庄结束*/
    private throwBookMakerOver : boolean = true;
    /**牌墙*/
    private majiongWallPrefab : cc.Prefab;
    /**手牌*/
    private majiongHandPrefab : cc.Prefab;
    /**出牌*/
    private majiongOutCardPrefab:cc.Prefab = null;
    /**是否已经可以摸牌*/
    private canGetHands : boolean = false;
    private getCardPoint:number = 0;
    private getCardBegin:number = 0;
    /**最大玩家人数*/
    private maxPlayerNum:number = 0;
    /**当前摸牌人数*/
    private nowGetHandPlayerNum:number = 0;
    /**当前手牌牌组添加数量*/
    private addHandPanelNum:number = 0;
    /***手牌牌组集合*/
    private handPanelArr : Array<HandCardPanel>=[];
    /**换三对象*/
    private changeThreePanel : ChangeThreePanel;
    private sitDownTips:SitDownTips;
    /**方向转盘*/
    private gamePositionItem:GameTurntablePanel;
    /**买马按钮*/
    private buyHorseItem1:BuyHorseItem;
    private buyHorseItem2:BuyHorseItem;
    /***买马界面*/
    private buyHorseItem : BuyHorsePanel;
    

    showPlayTips(boo:boolean , type:PlayHintImageType){
        this.playTipsLable.node.y = -240;
		this.playTipsLable.node.active = boo;
        let source:string = "comResource/font/";
		if(boo){
			switch(type){
				case PlayHintImageType.ThrowFrist:
                    this.playTipsLable.node.y = 252;
					source += "game_napaiweizhi";
				break;
				case PlayHintImageType.CheckDice:
                    this.playTipsLable.node.y = -240;
					source += "game_dingquexuanze";
				break;
				case PlayHintImageType.MustHu:
                    this.playTipsLable.node.y = -240;
					source += "game_bihu";
				break;
				case PlayHintImageType.LiangfenHu:
                    this.playTipsLable.node.y = -240;
					source += "game_liangfenhu";
				break;
				case PlayHintImageType.ChangeThree:
                    this.playTipsLable.node.y = 252;
					source += "game_xuanzehuase";
				break;
				case PlayHintImageType.DingWei:
                    this.playTipsLable.node.y = 71;
					source += "game_quedingzuowei";
				break;
				case PlayHintImageType.DingZhuang:
                    this.playTipsLable.node.y = 252;
					source += "game_zhuangjiafamgwei";
				break;
			}
            Global.Utils.setNewImageToSprite(this.playTipsLable , source);
		}
    }
    protected onLoad(): void {
        this.fightImage.node.active = false;
        this.baoziImage.node.active = false;
        this.majiongHandPrefab = Global.Utils.getPreFabBySource('majiongCard/prefab/MajiongHandCard');
        this.majiongWallPrefab = Global.Utils.getPreFabBySource('majiongCard/prefab/MajiongWallCard');
        this.majiongOutCardPrefab = Global.Utils.getPreFabBySource('majiongCard/prefab/MajiongOutCard');
        this.addEvent();
        this.initUI();
        this.addPlayerHead();
        if(GameInfo.ins.gamePlayers.length == 1 && UserInfo.ins.isSelf(GameInfo.ins.gamePlayers[0].player.gpid)){
            this.onNewSit(null , GameInfo.ins.fristSitPlayer);
        }
        this.lookBg.node.active = false;
        if(GameInfo.ins.creatGameInviteTempData_CS){
            let gameInfo=GameInfo.ins.roomTableInfo;
            GameInfo.ins.creatGameInviteTempData_CS.tid=gameInfo.tid;
            Global.mgr.socketMgr.send(-1,GameInfo.ins.creatGameInviteTempData_CS);
            GameInfo.ins.creatGameInviteTempData_CS=null;
        }
    }
    private initUI(){
        this.showReadyBtn(false);
        this.showSitBtn(true);
        this.showTableInfo();
        this.showDiceBtn(false);
        this.showGmaePosition();
        this.showBuyHrose();
        this.initHorseGroup();
        this.initCutDown();
        this.showWallMajiong();
        this.showHorseGroup();
    }
    private showHorseGroup(){
        if(GameInfo.ins.roomTableInfo.rule.haveHorse){
            this.horseGroup.active = true;
        }else{
            this.horseGroup.active = false;
        }
    }
    private nowCutDownNum=0;
    private initCutDown():void{
        let cutDownTime=GameInfo.ins.roomTableInfo.overSec;
        this.nowCutDownNum=cutDownTime;
        this.cutDownLabel.string=`${Global.Utils.getRemainTime(this.nowCutDownNum)}`;
        this.schedule(this.onCutDownUpdate,1,cutDownTime)
    }
    private onCutDownUpdate():void{
        this.nowCutDownNum--;
        if(this.nowCutDownNum<=0){
            this.unschedule(this.onCutDownUpdate);
            let callBack=CallBack.bind(function(){
                MainManager.ins.onLeaveRoomInitData();
                Global.EventCenter.dispatchEvent(EventType.BackToLobby);
            },this,true);
            Global.Utils.dialogOutConfirm("由于长时间未开启游戏，房间已经自动解散",1,callBack);
            return;
        }
        this.cutDownLabel.string=`${Global.Utils.getRemainTime(this.nowCutDownNum)}`;
    }
    private initHorseGroup(){
        this.lineImage.node.active = false;
        this.fenLabel.string = "";
        this.hitImage.node.active = false;
    }
    private showBuyHrose(){
        this.buyHorseItem1 = cc.instantiate(Global.Utils.getPreFabBySource('mainGame/prefab/BuyHorseItem')).getComponent(BuyHorseItem);
        this.buyHorseItem2 = cc.instantiate(Global.Utils.getPreFabBySource('mainGame/prefab/BuyHorseItem')).getComponent(BuyHorseItem);
        this.buyHorseItem1.setData(this.onbuyHorseClick , this);
        this.buyHorseItem2.setData(this.onbuyHorseClick , this);
        this.buyHorseItem1.index = 1;
        this.buyHorseItem2.index = 2;
        this.buyHorseGroup.addChild(this.buyHorseItem1.node);
        this.buyHorseGroup.addChild(this.buyHorseItem2.node);
        if(GameInfo.ins.roomTableInfo.rule.buyHorseNum == 0){
            this.buyHorseItem1.node.active = false;
            this.buyHorseItem2.node.active = false;
        }else if(GameInfo.ins.roomTableInfo.rule.buyHorseNum == 1){
            this.buyHorseItem2.node.active = false;
        }else if(GameInfo.ins.roomTableInfo.rule.buyHorseNum == 2){
            this.buyHorseItem1.node.active = true;
            this.buyHorseItem2.node.active = true;
        }
        if(GameInfo.ins.roomTableInfo.rule.isSelectBankerBuyHorse){
            this.buyHorseItem1.showZhuangMa();
        }
    }
    private onbuyHorseClick(item :BuyHorseItem){
        if(item.isBook){
            return;
        }
        if(this.buyHorseItem){
            this.buyHorseItem.disTory();
            this.buyHorseItem = null;
        }
        this.buyHorseItem = cc.instantiate(Global.Utils.getPreFabBySource("buyHorse/prefab/BuyHorsePanel")).getComponent(BuyHorsePanel);
        this.buyHorseItem.isBooks(false);
        this.tipsGroup.addChild(this.buyHorseItem.node);
    }
    private showGmaePosition(){
        if(this.gamePositionItem){
            this.gamePositionItem.disTory();
        }
        let prefab=Global.Utils.getPreFabBySource("turnTable/prefab/GameTurntablePanel");
        this.gamePositionItem = cc.instantiate(prefab).getComponent(GameTurntablePanel);
        this.gamePositionItem.node.x = 957;
        this.gamePositionItem.node.y = -458;
        this.btnGroup.addChild(this.gamePositionItem.node);
    }
    showTableInfo(){
        // this.gameinfoLabel.string = GameInfo.ins.roomTableInfo.roomName;
        this.gameinfoLabel.string = `房间号:${GameInfo.ins.roomTableInfo.code}`;
        this.tableIdLabel.string = "" + GameInfo.ins.roomTableInfo.code;
        this.dizhuLabel.string = "" + GameInfo.ins.roomTableInfo.rule.baseScore;
        // this.nameLabel.string = GameInfo.ins.roomTableInfo.creater;
        this.nameLabel.string = GameInfo.ins.roomTableInfo.roomName;
        let source:string = "";
        if(GameInfo.ins.roomTableInfo.rule.gamePlayType == 1){
            source = "comResource/font/game_wenzi4";
        }else{
            source = "comResource/font/game_wanzi5";
        }
        Global.Utils.setNewImageToSprite(this.gameNameImage , source);
        switch(GameInfo.ins.roomTableInfo.rule.roomType){
            case GameRoomTypeEnum.SiRenSanFang:
                source = "comResource/font/game_sirensanfang"
            break;
            case GameRoomTypeEnum.SiRenLiangFang:
                source = "comResource/font/game_sirenliangfang"
            break;
            case GameRoomTypeEnum.SanRenLiangFang:
                source = "comResource/font/game_sanrenliangfang"
            break;
            case GameRoomTypeEnum.LiangRenMaJiang:
                source = "comResource/font/game_liangrenmajiang"
            break;
        }
        Global.Utils.setNewImageToSprite(this.gameTypeImage , source);

        this.showChangThreeBtn(false);
        GameInfo.ins.AllCardMax = Global.Utils.getMaxMajiongByGameType(GameInfo.ins.roomTableInfo.rule.roomType)
    }
    private addPlayerHead(){
        let maxPlayer : GameRoomTypeEnum = Global.Utils.getMaxPlayerByGameType( GameInfo.ins.roomTableInfo.rule.roomType);
        for(let i = 0 ; i < maxPlayer ; i++){
            let createObj = cc.instantiate(this.playerHeadItem);
            createObj.getComponent(PlayerHeadItem).dialogParameters = i;
            createObj.getComponent(PlayerHeadItem).isDestroy = false;
            createObj.parent = this.headGroup;
            createObj.x = this.playerPointArr[i].x;
            createObj.y = this.playerPointArr[i].y;

            let item : PlayerHeadItem = createObj.getComponent(PlayerHeadItem);
            this.playerHeadArr.push(item);
            let sitInfo:SitInfo = GameInfo.ins.getPlayerBySit(item.directionSitNum);
            if(sitInfo){
                item.sitInfo = sitInfo;
            }
            if(item.directionSitNum == 0){
                this.throwBookMakerOver = true;
                item.showZhuang(true);
            }
            // Global.Utils.createObjToNode('playerHead/prefab/PlayerHeadItem',this.headGroup,i,this.playerPointArr[i],(any,createObj)=>{
            //     let item : PlayerHeadItem = createObj.getComponent(PlayerHeadItem);
            //     this.playerHeadArr.push(item);
            //     let sitInfo:SitInfo = GameInfo.ins.getPlayerBySit(item.directionSitNum);
            //     if(sitInfo){
            //         item.sitInfo = sitInfo;
            //     }
            //     if(item.directionSitNum == 0){
            //         this.throwBookMakerOver = true;
            //         item.showZhuang(true);
            //     }
            // })
        }
    }
    private addEvent(){
        Global.EventCenter.addEventListener(EventType.ThrowBookMaker , ()=>{
            // for(let i = 0 ; i < this.playerHeadArr.length ; i++){
            //     this.playerHeadArr[i].showIsReady(false);
            // }
            // this.unschedule(this.onCutDownUpdate)
            // this.cutDownLabel.node.active=false;
            // this.cutDownTip.node.active=false;
            // this.daojishi.node.active = false;
			// this.showBeginImage(true);
		} , this);
		Global.EventCenter.addEventListener(EventType.NEW_ONE_SIT , this.onNewSit, this);
		Global.EventCenter.addEventListener(EventType.playerReady , this.onPlayerReady , this);
		Global.EventCenter.addEventListener(EventType.DiceRslt , this.onDiceRslt , this);
		Global.EventCenter.addEventListener(EventType.StartDicePos , this.onStartDicePos , this);
		Global.EventCenter.addEventListener(EventType.PrDiceRslt , this.onPrDiceRslt , this);
		Global.EventCenter.addEventListener(EventType.StartDiceGame , this.onStartDiceGame , this);
		Global.EventCenter.addEventListener(EventType.BeginDiceMsg , this.onBeginDiceMsg , this);
		Global.EventCenter.addEventListener(EventType.DrawHandCard , this.onDrawHandCard , this);
		Global.EventCenter.addEventListener(EventType.YouMajMsg , this.onYouMajMsg , this);
		Global.EventCenter.addEventListener(EventType.StartDingQue , this.onStartDingQue , this);
		Global.EventCenter.addEventListener(EventType.QueRslt , this.onQueRslt , this);
		Global.EventCenter.addEventListener(EventType.onDingQue , this.onDingQue , this);
		Global.EventCenter.addEventListener(EventType.WaitDownMsg , this.onWaitDownMsg , this);
		Global.EventCenter.addEventListener(EventType.DownMajMsg , this.onDownMajMsg , this);
		Global.EventCenter.addEventListener(EventType.OtherDrawCard , this.onOtherDrawCard , this);
		Global.EventCenter.addEventListener(EventType.PengMajMsg , this.onPengMajMsg , this);
		Global.EventCenter.addEventListener(EventType.GangSelfMsg , this.onGangSelfMsg , this);
		Global.EventCenter.addEventListener(EventType.BuGanging , this.onBuGanging , this);
		Global.EventCenter.addEventListener(EventType.HuMajMsg , this.onHuMajMsg , this);
		Global.EventCenter.addEventListener(EventType.ScoreListMsg , this.onScoreListMsg , this);
		Global.EventCenter.addEventListener(EventType.GetMajMsg , this.onGetFeel , this);

		Global.EventCenter.addEventListener(EventType.ChangeThree , this.onChangeThree , this);
		Global.EventCenter.addEventListener(EventType.Change3Maj , this.onChange3Maj , this);
		Global.EventCenter.addEventListener(EventType.You3Maj , this.onYou3Maj , this);

		Global.EventCenter.addEventListener(EventType.PlayerHeadSitClick , this.onHeadSitClick , this);
        
		Global.EventCenter.addEventListener(EventType.OpenNewGame , this.onNewGame , this);
		Global.EventCenter.addEventListener(EventType.RealScore , this.onRealScore , this);
		Global.EventCenter.addEventListener(EventType.ShowBaoziFight , this.showbaoziFight , this);

        
		Global.EventCenter.addEventListener(EventType.SelHorse , this.onSelHorse , this);
		Global.EventCenter.addEventListener(EventType.SelHorseRslt , this.onSelHorseRslt , this);
		Global.EventCenter.addEventListener(EventType.CancelBuyHorse , this.onCancelBuyHorse , this);

        
		Global.EventCenter.addEventListener(EventType.UpdateHorser , this.onUpdateHorser , this);
		Global.EventCenter.addEventListener(EventType.NewHorseScoreRslt , this.onNewHorseScoreRslt , this);
		Global.EventCenter.addEventListener(EventType.RqCloseGame , this.onRqCloseGame , this);

        Global.EventCenter.addEventListener(EventType.OnMyHandCardSelect , this.OnMyHandCardSelect , this)

    }

    private OnMyHandCardSelect(e , msg : SelectHandCardData){
        for(let i = 0 ; i < 4 ; i++){
            this.getHandPanelBySit(i).showHandCardSelect(msg);
        }
    }
    /***一场买马结束后得推送*/
    private onNewHorseScoreRslt(e , msg : Msg_SC_NewHorseScoreRslt){
        this.hitImage.node.active = true;
        this.lineImage.node.active = true;
        let horseRoom:Msg_SC_HorseRoomInfo  = UserInfo.ins.getHorseRoomByTid(msg.tid);
        let baseNum:number = horseRoom.info.baseScore*8;
        let source:string = "buyHorse/resource/maima_guangxiao";
        if(msg.win >= baseNum){
            this.fenLabel.node.scaleX = 1.5;
            this.fenLabel.node.scaleY = 1.5;
            source = "buyHorse/resource/maima_guangxiao2";
        }else{
            this.fenLabel.node.scaleX = 1;
            this.fenLabel.node.scaleY = 1;
        }
        Global.Utils.setNewImageToSprite(this.lineImage , source);
        this.fenLabel.string = msg.win >= 0 ? "+" + msg.win : msg.win.toString();
        cc.tween(this.fenLabel.node).to(0.3 ,{y : 125} ).call(()=>{
            this.fenLabel.string = "";
            this.fenLabel.node.y = -55;
            this.lineImage.node.active = false;
        }).start();
    }
    private onCancelBuyHorse(e , msg : Msg_SC_CancelBuyHorse){
        this.onUpdateHorser(null , null);
    }
    /**收到买马信息更新*/
    private onUpdateHorser(e , msg : Msg_SC_SelHorseRslt){
        let isBook:boolean = false;
        for(let i = 0 ; i < GameInfo.ins.gameHorseArray.length ; i++){
            if(GameInfo.ins.gameHorseArray[i].isBanker){
                isBook = true;
                this.buyHorseItem1.showPlayerHave(GameInfo.ins.gameHorseArray[i]);
            }
        }
        for(let i = 0 ; i < GameInfo.ins.gameHorseArray.length ; i++){
            if(!GameInfo.ins.gameHorseArray[i].isBanker){
                if(isBook){
                    this.buyHorseItem2.showPlayerHave(GameInfo.ins.gameHorseArray[i]);
                }else{
                    if(this.buyHorseItem1.itemData == null){
                        this.buyHorseItem1.showPlayerHave(GameInfo.ins.gameHorseArray[i]);
                    }else{
                        this.buyHorseItem2.showPlayerHave(GameInfo.ins.gameHorseArray[i]);
                    }
                }
            }
        }
        if(GameInfo.ins.gameHorseArray.length == 0){
            this.buyHorseItem1.showNone();
            this.buyHorseItem2.showNone();
        }
        this.showHorseWall();
    }
    /**庄家买马结果*/
    private onSelHorseRslt(e , msg:Msg_SC_SelHorseRslt){

    }
    /***服务器通知开始买马*/
    private onSelHorse(e, msg :Msg_SC_StartSelHorse){
        if(this.buyHorseItem){
            this.buyHorseItem.disTory();
            this.buyHorseItem = null;
        }
        this.buyHorseItem = cc.instantiate(Global.Utils.getPreFabBySource("buyHorse/prefab/BuyHorsePanel")).getComponent(BuyHorsePanel);
        this.buyHorseItem.isBooks(true);
        this.tipsGroup.addChild(this.buyHorseItem.node);
    }


    private showbaoziFight(){
        let source:string = null;
        let baoziSource:string = null;
        if(GameInfo.ins.isBaozi){
            source = "mainGame/resource/game_baozi";
            baoziSource = "comResource/font/game_baozi"
        }
        if(GameInfo.ins.isShuangbao){
            source = "mainGame/resource/game_shuangbao";
            baoziSource = "comResource/font/game_shuangbao"
        }
        if(source == null){
            this.fightImage.node.active = false;
            cc.Tween.stopAllByTarget(this.fightImage.node);
            return;
        }
        this.fightImage.node.active = true;
        this.baoziImage.node.active = true;
        Global.Utils.setNewImageToSprite(this.fightImage , source);
        Global.Utils.setNewImageToSprite(this.baoziImage , baoziSource);
        this.showFightAction();
    }
    private showFightAction(){
        cc.tween(this.fightImage.node).to(2 , {opacity : 255}).call(()=>{
            this.hideFightAction()
        }).start()
    }
    private hideFightAction(){
        cc.tween(this.fightImage.node).to(2 , {opacity : 0}).call(()=>{
            this.showFightAction()
        }).start()
    }
    /**收到实时积分消息*/
    private onRealScore(e, msg :Msg_SC_RealScore){
        if(msg.event.tarScore){
            let headItem:PlayerHeadItem;
            for(let l = 0 ; l < msg.event.tarSits.length ; l++){
                for(let i = 0 ; i < this.playerHeadArr.length ; i++){
                    if(this.playerHeadArr[i].sitInfo.sitNum ==  msg.event.tarSits[l]){
                        headItem = this.playerHeadArr[i];
                        headItem.showShishiJifenChange(msg.event.tarScore[l]);
                        if(msg.event.tarSits[l] == UserInfo.ins.mySitIndex){
                            UserInfo.ins.gameFen += msg.event.tarScore[l];
                        }
                    }
                }
            }
            for(let i = 0 ; i < this.playerHeadArr.length ; i++){
                if(this.playerHeadArr[i].sitInfo.sitNum ==  msg.event.curSit){
                    headItem = this.playerHeadArr[i];
                    headItem.showShishiJifenChange(msg.event.win);
                    if(msg.event.curSit == UserInfo.ins.mySitIndex){
                        UserInfo.ins.gameFen += msg.event.win;
                    }
                }
            }
        }
    }
    /**头像上点击坐下*/
    private onHeadSitClick(e , sitNum:number){
        if(this.sitDownTips){
            this.sitDownTips.disTory();
            this.sitDownTips = null;
        }
        this.sitDownTips = cc.instantiate(Global.Utils.getPreFabBySource("tips/SitDown/prefab/SitDownTips")).getComponent(SitDownTips);
        this.sitDownTips.setData(sitNum)
        this.tipsGroup.addChild(this.sitDownTips.node);
        this.sitDownTips.node.x = 0;
        this.sitDownTips.node.y = 0;
    }
	/**服务器通知换三张*/
	private onChangeThree(e, msg:Msg_SC_StartChange3){
        if(this.changeThreePanel){
            this.changeThreePanel.disTory();
        }
        this.changeThreePanel = cc.instantiate(Global.Utils.getPreFabBySource("changeThree/prefab/ChangeThreePanel")).getComponent(ChangeThreePanel);
        this.node.addChild(this.changeThreePanel.node);
        this.changeThreePanel.node.x = -322;
        this.changeThreePanel.node.y = -161;
        for(let i = 0 ; i < this.playerHeadArr.length ; i++){
            this.playerHeadArr[i].showIsHuansan(true);
        }
	}
    /**换三状态改变*/
    private onChange3Maj(e,msg:Msg_SC_Change3Maj){
        this.getHandPanelBySit(msg.okSit).showOnChangeThree(msg);
        this.changeThreePanel.showOneReady(msg.okSit);
        for(let i = 0 ; i < this.playerHeadArr.length ; i++){
            if(this.playerHeadArr[i].sitInfo.sitNum == msg.okSit){
                this.playerHeadArr[i].showIsHuansan(false)
            }
        }
	}
    /***得到换三张结果*/
    private onYou3Maj(e, msg:Msg_SC_You3Maj){
        this.createChangeThreeBtn(msg)
        if(UserInfo.ins.mySitIndex == GameInfo.ins.nowBookMakerSit){
            this.showChangeThreeBtn(msg);
        }else{
            this.showPlayTips(true , PlayHintImageType.DingWei);
        }
        this.scheduleOnce(()=>{
            this.showPlayTips(false , PlayHintImageType.DingWei);
            for(let i = 0 ; i < this.playerHeadArr.length ; i++){
                if(this.playerHeadArr[i].sitInfo.sitNum == GameInfo.ins.nowBookMakerSit){
                    let msg1:Msg_SC_DiceRslt = new Msg_SC_DiceRslt();
                    msg1.bigNum = msg.bigNum;
                    msg1.smlNum = msg.smlNum;
                    this.playerHeadArr[i].showDiceBookMaker(msg1);
                }
            }
        },3)
        this.scheduleOnce(()=>{
            this.changeThreePanel.setData(msg , this.onChanegEnd , this);
        },TimeAndMoveManager.ins.zhuangRollTime + TimeAndMoveManager.ins.diceRotation+3)
	}
    private showChangeThreeBtn( msg:Msg_SC_You3Maj){
        this.gameDiceBtn.node.active = true;
        let index:number = 0;
        this.schedule(()=>{
            let now:number = 3-index;
            this.rollDiceLabel.string = "长按摇骰 ("+now+"S)";
            if(index == 3){
                this.onGameDiceClick(null , null);
                this.gameDiceBtn.node.active = false;
                cc.tween(this.node).delay(TimeAndMoveManager.ins.zhuangRollTime + TimeAndMoveManager.ins.diceRotation).call(()=>{
                    this.changeThreePanel.setData(msg , this.onChanegEnd , this);
                }).start();
            }
            index++;
        } , 1 , 3 , 0);
    }
    /**换三表现结束*/
    private onChanegEnd(msg:Msg_SC_You3Maj){
        this.changeThreePanel.disTory();
        this.changeThreePanel = null;
        this.changeThreeBtn.node.active = true;
        for(let i = 0 ; i < 4 ; i++){
            this.getHandPanelBySit(i).showEndChangeThree();
        }
        (this.getHandPanelBySit(UserInfo.ins.mySitIndex) as MyHandCardPanel).showGetChangeThree(msg);
    }
	/**一轮结束*/
	private onScoreListMsg(e){
		this.showBeginImage(false);
		this.showSmallOver();
	}
    /**展示单据结算面板*/
	private showSmallOver(){
        Global.DialogManager.createDialog('smallOver/prefab/SmallOverPanel', null , (any,createDialog)=>{
            createDialog.x = -960;
            createDialog.y = -540;
        })
	}
    /**有人补杠*/
	private onBuGanging(e,msg:Msg_SC_BuGanging){
		if(UserInfo.ins.mySitIndex != msg.sit){
			let deck : HuData = UserInfo.ins.getQiangHu(msg.majID);
			if(deck && deck.HuType.length > 0){
				let eatClass : EatCardClass = new EatCardClass();
				eatClass.type = PlayEatTypeEnum.Hu;
				eatClass.value = deck.cardValue;
				if(!Global.Utils.getIsDice(msg.majID , UserInfo.ins.myDiceType)){
                    let canHu : HuData = UserInfo.ins.getCanHu();
                    let actionData:MyActionByOther = new MyActionByOther();
                    actionData.canHu = canHu!= null;
                    actionData.huData = canHu;
                    actionData.canGang = false;
                    actionData.canPeng = false;
                    actionData.canGuo = UserInfo.ins.getCanGuo();
					(this.getHandPanelBySit(UserInfo.ins.mySitIndex) as MyHandCardPanel).showActionItem(actionData);
				}
			}
		}
	}
    /**有人胡牌*/
	private onHuMajMsg(e,msg : Msg_SC_HuMajMsg){
		GameInfo.ins.huCounts = msg.huNum+1;
		if(msg.majID){
			GameInfo.ins.otherLastCard = msg.majID;
		}
        this.getHandPanelBySit(msg.huSit).showHupai(msg);
        if(GameInfo.ins.huCardRemoveNum == 0){
            GameInfo.ins.huCardRemoveNum = msg.huCnt;
        }
		if(msg.tarSit && msg.zmType != 1 &&  GameInfo.ins.huCardRemoveNum==msg.huCnt){
			this.getHandPanelBySit(msg.tarSit).clearLastPlay();
            GameInfo.ins.huCardRemoveNum--;
		}
		if(msg.huCnt > 1){
			this.getHandPanelBySit(msg.tarSit).showDianPao(msg.huCnt);
		}
        if(msg.zmType == 4){
            this.getHandPanelBySit(UserInfo.ins.mySitIndex).showQiangGang(msg);
        }
        (this.getHandPanelBySit(UserInfo.ins.mySitIndex) as MyHandCardPanel).hideGameAction();
        if(msg.huSit == UserInfo.ins.mySitIndex){
		    this.showPlayTips(false,null);
        }
	}
    /**自己杠*/
	private onGangSelfMsg(e,msg:Msg_SC_GangSelfMsg){
		let addIndex:number = msg.isPapo == 0 ? 4 : 1;
		GameInfo.ins.addCardToAllOut(addIndex);
		this.getHandPanelBySit(msg.pengSiteNum).showSelfGang(msg);
        (this.getHandPanelBySit(UserInfo.ins.mySitIndex) as MyHandCardPanel).hideGameAction();
	}
    /**某人碰杠*/
	private onPengMajMsg(e , msg:Msg_SC_PengMajMsg){
		let addIndex:number = msg.isGang == 1 ? 3 : 2;
		GameInfo.ins.addCardToAllOut(msg.majID , addIndex);
        this.getHandPanelBySit(msg.pengSiteNum).showPengGang(msg);
        if(msg.fromSiteNum >= 0){
            this.getHandPanelBySit(msg.fromSiteNum).clearLastPlay();
        }
        (this.getHandPanelBySit(UserInfo.ins.mySitIndex) as MyHandCardPanel).hideGameAction();
	}
    /**我摸牌*/
	private onGetFeel(e , msg : Msg_SC_GetMajMsg){
        if(UserInfo.ins.haveDiceCard){
            this.showPlayTips(true,PlayHintImageType.CheckDice);
        }
        this.gamePositionItem.SetCurrentTurnState(GameInfo.ins.AllCardMax - GameInfo.ins.allPlayerGetCard , UserInfo.ins.mySitIndex , GameInfo.ins.getPosHu())
	}
    /**收到某人摸牌*/
	private onOtherDrawCard(e , msg:Msg_SC_SomeTurnMsg){
		this.removeOneWall();
		let panel : HandCardPanel = this.getHandPanelBySit(msg.siteNum);
		panel.showFeelWall(null);
        
        this.gamePositionItem.SetCurrentTurnState(GameInfo.ins.AllCardMax - GameInfo.ins.allPlayerGetCard , msg.siteNum , GameInfo.ins.getPosHu())
	}
    /***移除一张牌墙*/
    private removeOneWall(){
        GameInfo.ins.allWallCardArray[GameInfo.ins.allPlayerGetCard].node.active = false;
        GameInfo.ins.allPlayerGetCard++;
    }
    /***收到别人出牌*/
	private onDownMajMsg(e , msg:Msg_SC_DownMajMsg){
        for(let i = 0 ; i < 4 ; i++){
            this.getHandPanelBySit(i).hideOutLight();
        }
		if(UserInfo.ins.mySitIndex != msg.downSiteNum){
			let handPanel : HandCardPanel = this.getHandPanelBySit(msg.downSiteNum);
			handPanel.showOutCard(msg.majID);
			GameInfo.ins.otherLastCard = msg.majID;
		}else{
            UserInfo.ins.spliceCardByMyHand(msg.majID);
            this.showPlayTips(false,null);
        }
        if(UserInfo.ins.selfIsLookPlayer && UserInfo.ins.mySitIndex == msg.downSiteNum){
            this.getHandPanelBySit(UserInfo.ins.mySitIndex).showOutCard(msg.majID);
        }
        (this.getHandPanelBySit(UserInfo.ins.mySitIndex) as MyHandCardPanel).closeHupaiTips();
        (this.getHandPanelBySit(UserInfo.ins.mySitIndex) as MyHandCardPanel).closeOutTing();
        (this.getHandPanelBySit(UserInfo.ins.mySitIndex) as MyHandCardPanel).changeDiceCard();
	}
    /***某个人的回合开始*/
    private onWaitDownMsg(e , msg:Msg_SC_WaitDownMsg){
        if(msg.siteNum == UserInfo.ins.mySitIndex && UserInfo.ins.haveDiceCard()){
            this.showPlayTips(true , PlayHintImageType.CheckDice)
        }
        for(let i = 0 ; i < this.playerHeadArr.length ; i++){
			if(this.playerHeadArr[i].sitInfo.sitNum == msg.siteNum){
				this.playerHeadArr[i].isMyAction = true;
			}else{
                this.playerHeadArr[i].isMyAction = false;
            }
		}
        this.gamePositionItem.SetCurrentTurnState(GameInfo.ins.AllCardMax - GameInfo.ins.allPlayerGetCard , msg.siteNum , GameInfo.ins.getPosHu())
    }
    /**收到定缺改变*/
    private onDingQue(e,msg:Msg_SC_DingQue){
        for(let i = 0 ; i < this.playerHeadArr.length ; i++){
            if(this.playerHeadArr[i].sitInfo.sitNum == msg.okSit){
                this.playerHeadArr[i].showIsDingQueIng(false)
            }
        }
    }   
    /**收到定缺*/
	private onQueRslt(e , msg:Msg_SC_QueRslt){
        let delay:number = 0.1;
        if(GameInfo.ins.roomTableInfo.rule.gamePlayType == 2){
            this.showChangThreeBtn(true);
            delay = 1;
        }
        cc.tween(this.node).delay(delay).call(()=>{
            for(let i = 0 ; i < msg.infos.length ; i++){
                let info : SitQueInfo = msg.infos[i];
                let head : PlayerHeadItem ;
                for(let i = 0 ; i < this.playerHeadArr.length ; i++){
                    this.playerHeadArr[i].showIsDingQueIng(false)
                    if(this.playerHeadArr[i].sitInfo.sitNum == info.sitNum){
                        head = this.playerHeadArr[i];
                        head.showQue(info.wtt);
                    }
                }
            }
            this.getHandPanelBySit(UserInfo.ins.mySitIndex).showDingQueed();
        }).start()

        if(UserInfo.ins.selfIsLookPlayer){
            if(this.dingQuePanel){
                this.dingQuePanel.disTory();
                this.dingQuePanel = null;
            }
        }
	}
    /**通过位置获取手牌组*/
    private getHandPanelBySit(sit:number):HandCardPanel{
        for(let i = 0 ; i < this.handPanelArr.length ; i++){
            if(this.handPanelArr[i].sitIndex == sit){
                return this.handPanelArr[i];
            }
        }
        return null;
    }
    private dingQuePanel:DingQuePanel;
    /**定缺*/
	private onStartDingQue(e,msg:Msg_SC_StartDingQue){
		Global.DialogManager.createDialog("dingQue/prefab/DingQuePanel" , null , (any,createDialog)=>{
            createDialog.x = 0;
            createDialog.y = 200;
            this.dingQuePanel = createDialog.getComponent(DingQuePanel);
        } , this.tableElementsGroup)

        for(let i = 0 ; i < this.playerHeadArr.length ; i++){
            this.playerHeadArr[i].showIsDingQueIng(true);
        }
	}
    /**收到我的手牌数据*/
    private onYouMajMsg(e,msg:Msg_SC_YouMajMsg){
        if(this.canGetHands){
            cc.tween(this.node).delay(TimeAndMoveManager.ins.getWallTime).call(()=>{
                this.setWallDrawOeder();
                this.showGetHand();
            }).start()
        }
    }
    /**开始游戏 准备发牌*/
	private onDrawHandCard(e,msg:Msg_SC_StartGame){
		let data : Msg_SC_StartGame = e.data;
	}
    /**投掷拿牌的骰子*/
	private onBeginDiceMsg(e,msg:Msg_SC_BeginDiceMsg){
		GameInfo.ins.nowBookMakerSit = msg.bankerSite;
        for(let i = 0 ; i < this.playerHeadArr.length ; i++){
            this.playerHeadArr[i].isZhuang = false;
        }
        for(let i = 0 ; i < this.playerHeadArr.length ; i++){
            if(this.playerHeadArr[i].sitInfo.sitNum == msg.bankerSite){
                this.playerHeadArr[i].isZhuang = true;
            }
        }
        if(msg.bankerSite == UserInfo.ins.mySitIndex){
            GameInfo.ins.isSelfZhuang = true;
        }
		if(this.returnPointOver){
			this.showThrowFrist();
		}
        GameInfo.ins.setRealTimePreformanceData_zhuang(msg.bankerSite);
	}
    /**展示牌墙马牌*/
    private showHorseWall(){
        let wall:MajiongWallCard;
        let info : HorserInfo;
        let removeIndexArr:Array<number> = [];
        for(let l = 0 ; l < GameInfo.ins.gameHorseArray.length ; l++){
            info = GameInfo.ins.gameHorseArray[l];
            for(let i = 0 ; i < GameInfo.ins.allWallCardArray.length ; i++){
                wall = GameInfo.ins.allWallCardArray[i];
                if(wall.cardId == info.majNum){
                    if(GameInfo.ins.roomTableInfo.rule.buyHorseType == 2){
                        wall.disTory();
                        removeIndexArr.push(i);
                    }else{
                        wall.showHorse(info.horseSit);
                    }
                }else{
                    wall.showNone();
                }
            }
        }
        if(GameInfo.ins.gameHorseArray.length == 0){
            for(let i = 0 ; i < GameInfo.ins.allWallCardArray.length ; i++){
                wall = GameInfo.ins.allWallCardArray[i];
                wall.showNone();
            }
        }
        if(removeIndexArr.length > 0){
            for(let i = 0 ; i < removeIndexArr.length ; i++){
                GameInfo.ins.allWallCardArray.splice(removeIndexArr[i] , 1);
            }
        }
    }
    /***投掷拿牌骰子*/
	private showThrowFrist(){
        if(UserInfo.ins.mySitIndex == GameInfo.ins.nowBookMakerSit){
            this.showDiceBtn(true);
        }else{
            this.showPlayTips(true , PlayHintImageType.ThrowFrist);
        }
	}
    /**收到了矫座结果*/
	private onStartDiceGame(e,msg:Msg_SC_StartDiceGame){
        cc.tween(this.node).delay(TimeAndMoveManager.ins.zhuangRollTime + TimeAndMoveManager.ins.diceRotation).call(()=>{
            for(let i = 0 ;i < this.playerHeadArr.length ; i++){
                this.playerHeadArr[i].showPlayerDice(false);
			}
            if(UserInfo.ins.selfIsLookPlayer){
                for(let i = 0 ;i < this.playerHeadArr.length ; i++){
                    if(this.playerHeadArr[i].directionSitNum == 0){
                        UserInfo.ins.mySitIndex = this.playerHeadArr[i].sitInfo.sitNum;
                    }
                }
            }
            this.showChangeChar(msg);
        }).start();
	}
    /**展示矫座相关动作*/
    private showChangeChar(msg:Msg_SC_StartDiceGame){
        this.showChangeTempChar(msg);
    }
    private getDiceBySit(arr:Array<SitDiceInfo>,sit):number{
        for(let i = 0 ; i < arr.length ; i++){
            if(arr[i].sitNum == sit){
                return arr[i].dice;
            }
        }
    }
    private getMyHeadByInitSit(arr:Array<SitSortData> , gpid):number{
        for(let i = 0 ; i < arr.length ; i++){
            if(arr[i].gpid == gpid){
                return arr[i].point;
            }
        }
    }
    private getInitPoint(index:number):number{
        return (4-index)%4
    }
    private getNowMoveThrow(throwHeadArr : Array<ThrowPointHeadItem> ,index:number):ThrowPointHeadItem{
        for(let i = 0 ; i < throwHeadArr.length ; i++){
            let needSit:number = UserInfo.ins.mySitIndex - throwHeadArr[i].sitinfo.sitNum;
            if(needSit < 0){
                needSit = needSit + 4;
            }
            if(index == needSit){
                return throwHeadArr[i];
            }
        }
    }
    private getNowMoveHead(index:number):PlayerHeadItem{
        for(let i = 0 ; i < this.playerHeadArr.length ; i++){
            let needSit:number = UserInfo.ins.mySitIndex - this.playerHeadArr[i].sitInfo.sitNum;
            if(needSit < 0){
                needSit = needSit + 4;
            }
            if(index == needSit){
                return this.playerHeadArr[i];
            }
        }
    }
    /**展示临时的矫座头像*/
    private showChangeTempChar(msg:Msg_SC_StartDiceGame){
        this.showPlayTips(false , PlayHintImageType.DingWei);
        let pointArr:Array<cc.Vec2> = [cc.v2(863,-774) ,cc.v2(1111,-574)  , cc.v2(863 , -371) , cc.v2(615 , -574)];
        let players : Array<SitInfo> = GameInfo.ins.gamePlayers;
        
        let initArr:Array<SitSortData> = [];
        let sit:SitSortData;
        for(let i = 0 ; i < players.length ; i++){
            sit = new SitSortData();
            sit.sitData = null;
            sit.gpid = players[i].player.gpid;
            sit.point = players[i].sitNum;
            initArr[sit.point] = sit;
        }
        let pointSitArr:Array<SitSortData> = [];
        for(let i = 0 ; i < msg.players.length ; i++){
            sit = new SitSortData();
            sit.gpid = msg.players[i].player.gpid;
            sit.sitData = msg.players[i];
            sit.point = msg.players[i].sitNum;
            sit.dice = this.getDiceBySit(msg.diceInfos,msg.players[i].sitNum)
            pointSitArr[sit.point] = sit;
        }
        let moveIndex:number = 0;
        for(let i = UserInfo.ins.mySitIndex ; i < this.playerHeadArr.length + UserInfo.ins.mySitIndex ; i++){
            let point:cc.Vec2 = pointArr[moveIndex];
            moveIndex++;
            cc.tween(this.playerHeadArr[i%4].node).to(TimeAndMoveManager.ins.changeCharAcyionTime , {x:point.x + 24, y : point.y + 185} ).call(()=>{
                this.playerHeadArr[i%4].node.opacity = 0;
            }).start();
        }
        this.scheduleOnce(()=>{
            let throwHeadArr:Array<ThrowPointHeadItem> = [];
            for(let i = 0 ; i < pointSitArr.length ; i++){
                let indexPoint:number = (i + 16 - this.getMyHeadByInitSit(initArr,UserInfo.ins.myInfo.gpid))%4
                let index:number = indexPoint;
                let mySit:number = this.getMyHeadByInitSit(initArr,UserInfo.ins.myInfo.gpid);
                Global.Utils.createObjToNode("playerHead/prefab/ThrowPointHeadItem" , this.headGroup ,
                {sitInfo : pointSitArr[index].sitData , rslt : this.getRsltDataById(pointSitArr[index].gpid)} , 
                pointArr[(index + this.getInitPoint(mySit))%4] , (any,createObj)=>{
                    let item : ThrowPointHeadItem = createObj.getComponent(ThrowPointHeadItem);
                    item.setData(index+1);
                    throwHeadArr.push(item);
                });
            }	
            this.scheduleOnce(()=>{
                for(let i = 0 ; i < 4 ; i++){
                    let indexPoint:number = (i + 16 - this.getMyHeadByInitSit(initArr,UserInfo.ins.myInfo.gpid))%4;
                    let index:number = indexPoint;
                    let mySit:number = this.getMyHeadByInitSit(initArr,UserInfo.ins.myInfo.gpid);
                    let returnIndex:number = (index + this.getInitPoint(mySit)%4)%4;
                    this.playerHeadArr[returnIndex].sitInfo = throwHeadArr[index].sitinfo;
                }
            } , 0.2);
            let mySitPointIndex:number = 0;
            this.scheduleOnce(()=>{
                for(let i = 0 ; i < msg.players.length ; i++){
                    if(msg.players[i].player.gpid == UserInfo.ins.myInfo.gpid){
                        UserInfo.ins.mySitIndex = msg.players[i].sitNum;
                    }
                }
                GameInfo.ins.setNewPlayers(msg.players);
                let mySitPoint:cc.Vec2;
                for(let i = 0 ; i < throwHeadArr.length ; i++){
                    if(throwHeadArr[i].sitinfo.player.gpid == UserInfo.ins.myInfo.gpid){
                        mySitPoint = new cc.Vec2(throwHeadArr[i].node.x , throwHeadArr[i].node.y);
                    }
                }
                for(let i = 0 ; i < pointArr.length ; i++){
                    if(pointArr[i].x == mySitPoint.x && pointArr[i].y == mySitPoint.y){
                        mySitPointIndex = i;
                    }
                }
                let moveIndex:number = mySitPointIndex;
                
                this.showZhuang();
                if(msg.diceInfos[0].sitNum == UserInfo.ins.mySitIndex){
                    GameInfo.ins.isSelfZhuang = true;
                    this.returnPointOver = true;
                }
                this.showWallMajiong();
                if(mySitPointIndex == 0){
                }else if(mySitPointIndex == 1){
                    this.scheduleOnce(()=>{
                        moveIndex--
                        let nowMove:number = moveIndex;
                        let point:cc.Vec2;
                        for(let i = 0 ; i < 4 ; i++){
                            let mowItem: ThrowPointHeadItem = this.getNowMoveThrow(throwHeadArr,i);
                            let toIndex:number = nowMove-i;
                            if(toIndex < 0){
                                toIndex = toIndex + 4;
                            }
                            point = pointArr[toIndex];
                            cc.tween(mowItem.node).to(0.48 , {x : point.x , y : point.y}).start();
                        }
                    } , 0.5 );
                }else{
                    this.schedule(()=>{
                        moveIndex--
                        let nowMove:number = moveIndex;
                        let point:cc.Vec2;
                        for(let i = 0 ; i < 4 ; i++){
                            let mowItem: ThrowPointHeadItem = this.getNowMoveThrow(throwHeadArr,i);
                            let toIndex:number = nowMove-i;
                            if(toIndex < 0){
                                toIndex = toIndex + 4;
                            }
                            point = pointArr[toIndex];
                            cc.tween(mowItem.node).to(0.48 , {x : point.x , y : point.y}).start();

                            let headItem:PlayerHeadItem = this.getNowMoveHead(i)
                            point = pointArr[toIndex];
                            headItem.node.active = false;
                            cc.tween(headItem.node).to(0.48 , {x : point.x + 24 , y : point.y + 185}).start();
                        }
                    } , 0.5 , mySitPointIndex-1 , 0.5);
                }

            } , 0.3 )
            this.scheduleOnce(()=>{
                let point:cc.Vec2;
                for(let i = 0 ; i < 4 ; i++){
                    let headItem:PlayerHeadItem = this.getNowMoveHead(i)
                    let toIndex:number = (headItem.sitInfo.sitNum - UserInfo.ins.mySitIndex + 4)%4;
                    point = this.playerPointArr[toIndex];
                    headItem.node.active = true;
                    this.getNowMoveThrow(throwHeadArr,i).node.active = false;
                    cc.tween(headItem.node).to(TimeAndMoveManager.ins.changeCharAcyionTime,
                    {x : point.x , y : point.y, opacity:255}).call(()=>{
                    }).start();
                }
                if(GameInfo.ins.nowGameStatus == PlayStauteEnum.ThrowFrist){
                    this.showThrowFrist();
                }
                this.gamePositionItem.InitPlayerDicType(UserInfo.ins.mySitIndex , GameInfo.ins.AllCardMax);
                console.log("C端执行完了换座")
            } , 3);
        } , TimeAndMoveManager.ins.changeCharAcyionTime);
    }
    private showZhuang(){

    }
    /**通过位置获取我自己的头像*/
    private getMyHeadBySit(headSit : number):PlayerHeadItem{
		for(let i = 0 ; i < this.playerHeadArr.length ; i++){
			if(this.playerHeadArr[i].directionSitNum == headSit){
				return this.playerHeadArr[i];
			}
		}
	}
    /**获取暂存的位置*/
    private getRsltDataById(gpId : number):PrDiceRsltData{
		for(let i = 0 ; i < this.prDiceRsltArr.length ; i++){
			if(this.prDiceRsltArr[i].playerId == gpId){
				return this.prDiceRsltArr[i];
			}
		}
	}
    /**定位骰子结果返回*/
	private onPrDiceRslt(e,msg:Msg_SC_PrDiceRslt){	
        if(GameInfo.ins.nowGameStatus == PlayStauteEnum.ChangeChar){
            let pr:PrDiceRsltData = new PrDiceRsltData();
			pr.msg = msg;
			for(let i = 0 ;i < this.playerHeadArr.length ; i++){
				if(this.playerHeadArr[i].sitInfo.sitNum == msg.sit){
                    this.playerHeadArr[i].showRollDiceAction(msg.bigNum , msg.smlNum);
                    pr.playerId = this.playerHeadArr[i].playerInfo.gpid;
				}
			}
			this.prDiceRsltArr.push(pr)
        }
	}
    /**开始定位*/
    private onStartDicePos(e,msg:Msg_SC_StartDicePos){

        for(let i = 0 ; i < this.playerHeadArr.length ; i++){
            this.playerHeadArr[i].showIsReady(false);
        }
        this.unschedule(this.onCutDownUpdate)
        this.cutDownLabel.node.active=false;
        this.cutDownTip.node.active=false;
        this.daojishi.node.active = false;
        this.showBeginImage(true);

        if(this.throwBookMakerOver){
            this.showDiceBtn(true);
            for(let i = 0 ; i < this.playerHeadArr.length ; i++){
                this.playerHeadArr[i].showIsReady(false);
            }
        }

    }
    /**投掷骰子结果返回*/
    private onDiceRslt(e,msg:Msg_SC_DiceRslt){
        if(GameInfo.ins.nowGameStatus == PlayStauteEnum.ThrowBookMaker){
		    this.showPlayTips(true , PlayHintImageType.DingZhuang);
			for(let i = 0 ; i < this.playerHeadArr.length ; i++){
				if(this.playerHeadArr[i].directionSitNum == 0){
					this.playerHeadArr[i].showDiceBookMaker(msg);
                    cc.tween(this.node).delay(0.7 + TimeAndMoveManager.ins.zhuangRollTime + TimeAndMoveManager.ins.diceRotation).call(()=>{
                        this.showPlayTips(false , null);
                        this.showZhuangAction()
                        this.throwBookMakerOver = true;
                        if(GameInfo.ins.nowGameStatus == PlayStauteEnum.ChangeChar){
                            this.showDiceBtn(true);
                        }
                    }).start();
				}
			}
		}else if(GameInfo.ins.nowGameStatus == PlayStauteEnum.ThrowFrist){
            this.showDiceBtn(false);
            let bigIndex:number = 0;
            let addIndex:number = 0;
            switch((msg.bigNum+msg.smlNum)%4){
                case 0:
                    addIndex = 3;
                break;
                case 1:
                    addIndex = 0;
                break;
                case 2:
                    addIndex = 1;
                break;
                case 3:
                    addIndex = 2;
                break;
            }
            for(let i = 0 ; i < addIndex ; i++){
                bigIndex += Global.Utils.getMajiongWallByGameType(GameInfo.ins.roomTableInfo.rule.roomType)[i];
            }
            let initIndex:number =  bigIndex + msg.smlNum*2;
            GameInfo.ins.sortWall();
            let index:number = 0;
            for(let i =  initIndex ; i < GameInfo.ins.allWallCardArray.length ; i++){
                GameInfo.ins.allWallCardArray[i].cardId = index;
                index++;
            }
            for(let i = 0 ; i < initIndex ; i++){
                GameInfo.ins.allWallCardArray[i].cardId = index;
                index++;
            }
            GameInfo.ins.sortWall();
            if(GameInfo.ins.roomTableInfo.rule.isSelectBankerBuyHorse){
                for(let i = 0 ; i < GameInfo.ins.gameHorseArray.length ; i++){
                    if(GameInfo.ins.gameHorseArray[i].isBanker){
                        this.buyHorseItem1.showPlayerHave(GameInfo.ins.gameHorseArray[i]);
                    }
                }
                this.showHorseWall();
            }
            if(msg.bigNum == msg.smlNum && (GameInfo.ins.roomTableInfo.rule.baozi == GamePiaoTypeEnum.Baozi || GameInfo.ins.roomTableInfo.rule.baozi == GamePiaoTypeEnum.ShuaiPiao)){
                GameInfo.ins.isBaozi = true;
                GameInfo.ins.setRealTimePreformanceData_BaoziNum(1);
                this.showbaoziFight()
            }
            if(msg.bigNum != msg.smlNum && GameInfo.ins.roomTableInfo.rule.baozi == GamePiaoTypeEnum.ShuaiPiao){
                let piaoIndex:number = ((msg.bigNum + msg.smlNum - 1)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) + GameInfo.ins.nowBookMakerSit)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType);
                for(let i = 0 ; i < this.playerHeadArr.length ; i++){
                    if(this.playerHeadArr[i].sitInfo.sitNum == piaoIndex){
                        this.playerHeadArr[i].isPiao = true;
                    }
                }
            }
            for(let i = 0 ; i < this.playerHeadArr.length ; i++){
				if(this.playerHeadArr[i].sitInfo.sitNum == GameInfo.ins.nowBookMakerSit){
					this.playerHeadArr[i].showDiceBookMaker(msg);
                    cc.tween(this.node).delay(0.7 + TimeAndMoveManager.ins.zhuangRollTime + TimeAndMoveManager.ins.diceRotation).call(()=>{
                        this.canGetHands = true;
                        this.beginGetCard(msg);
                    }).start();
				}
			}
        }
    }
    /**开始拿牌*/
    beginGetCard(msg:Msg_SC_DiceRslt){
        this.getCardPoint = msg.bigNum;
		this.getCardBegin = msg.smlNum;
        if(GameInfo.ins.nowGameStatus == PlayStauteEnum.DrawHandCard){
            cc.tween(this.node).delay(TimeAndMoveManager.ins.getWallTime).call(()=>{
                this.setWallDrawOeder();
                this.showGetHand();
                this.showHorseWall();
            }).start()
        }
    }
    /**设置牌墙初始拿牌顺序*/
    private setWallDrawOeder(){
        for(let i =0 ; i < GameInfo.ins.allWallCardArray.length ; i++){
            GameInfo.ins.allWallCardArray[i].majiongDrawOeder = GameInfo.ins.allWallCardArray[i].cardId;
        }
        GameInfo.ins.sortWallByGetHand();
    }
    /**展示拿牌*/
    private showGetHand(){
        let roomType : GameRoomTypeEnum = GameInfo.ins.roomTableInfo.rule.roomType;
        this.maxPlayerNum = Global.Utils.getMaxPlayerByGameType(roomType);
        this.createAllHandPanel();
    }
    /**展示摸牌动作*/
    private showGetAction(){
        this.addHandPanelNum++;
        if(this.addHandPanelNum == this.maxPlayerNum){
            /**分4次发牌*/
            this.schedule(()=>{
                this.onGetHandTimer();
            },TimeAndMoveManager.ins.getWallTime,3,0);
            Global.Utils.playSound("sound/1");
        }
        this.showPlayTips(false , null);
    }
    private onGetHandTimer(){
        this.nowGetHandPlayerNum++;
        for(let i = 0 ; i < this.handPanelArr.length ; i++){
            let getNums : number = this.getNums(this.nowGetHandPlayerNum , this.handPanelArr[i].sitIndex);
            this.showGetWall(getNums);
            this.handPanelArr[i].showGetHnads(getNums);
        }
    }
    /**获取当前需要发几张牌*/
    private getNums(index:number , sitIndex:number):number{
        let getHands:number = 0;
        if(index < 4){
            getHands = 4;
        }else{
            if(sitIndex == GameInfo.ins.nowBookMakerSit){
                getHands = 2;
            }else{
                getHands = 1;
            }
        }
        return getHands;
    }
    /**展示牌墙有牌被拿走*/
    private showGetWall(getNum:number = 1){
        for(let i = GameInfo.ins.allPlayerGetCard ; i < GameInfo.ins.allPlayerGetCard + getNum ; i++){
            GameInfo.ins.allWallCardArray[i].node.active = false;
        }
        GameInfo.ins.allPlayerGetCard += getNum;
    }
    /***添加所有手牌牌组*/
    private createAllHandPanel(){
        let arr:Array<cc.Prefab> = [this.majiongHandPrefab,this.majiongOutCardPrefab];
        Global.DialogManager.createDialog("majiongCard/prefab/MyHandCardPanel" , arr , (any,createDialog)=>{
            createDialog.x = CardHelpManager.ins.myHandCardInitPoint.x;
            createDialog.y = CardHelpManager.ins.myHandCardInitPoint.y;
            (createDialog.getComponent(MyHandCardPanel) as MyHandCardPanel).sitIndex = UserInfo.ins.mySitIndex;
            this.handPanelArr[UserInfo.ins.mySitIndex] = createDialog.getComponent(MyHandCardPanel);
            this.showGetAction();
        } , this.cardTableGroup)
        Global.DialogManager.createDialog("majiongCard/prefab/OppHandCardPanel" , arr , (any,createDialog)=>{
            createDialog.x = CardHelpManager.ins.oppHandCardInitPoint.x;
            createDialog.y = CardHelpManager.ins.oppHandCardInitPoint.y;
            (createDialog.getComponent(OppHandCardPanel) as OppHandCardPanel).sitIndex = (UserInfo.ins.mySitIndex + 2)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType);
            this.handPanelArr[(UserInfo.ins.mySitIndex + 2)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType)] = createDialog.getComponent(OppHandCardPanel);
            this.showGetAction();
        } , this.cardTableGroup)
        Global.DialogManager.createDialog("majiongCard/prefab/DownHandCardPanel" , arr , (any,createDialog)=>{
            createDialog.x = CardHelpManager.ins.downHandCardInitPoint.x;
            createDialog.y = CardHelpManager.ins.downHandCardInitPoint.y;
            (createDialog.getComponent(DownHandCardPanel) as DownHandCardPanel).sitIndex = (UserInfo.ins.mySitIndex + 1)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType);
            this.handPanelArr[(UserInfo.ins.mySitIndex + 1)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType)] = createDialog.getComponent(DownHandCardPanel);
            this.showGetAction();
        } , this.cardTableGroup)
        Global.DialogManager.createDialog("majiongCard/prefab/UpHandCardPanel" , arr , (any,createDialog)=>{
            createDialog.x = CardHelpManager.ins.upHandCardInitPoint.x;
            createDialog.y = CardHelpManager.ins.upHandCardInitPoint.y;
            (createDialog.getComponent(UpHandCardPanel) as UpHandCardPanel).sitIndex = (UserInfo.ins.mySitIndex + 3)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType);
            this.handPanelArr[(UserInfo.ins.mySitIndex + 3)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType)] = createDialog.getComponent(UpHandCardPanel);
            this.showGetAction();
        } , this.cardTableGroup)
    }
    /**创建牌墙*/
    private showWallMajiong(){
        console.log("重新创建牌墙");
        for(let i = 0 ; i <GameInfo.ins.allWallCardArray.length ; i++){
            GameInfo.ins.allWallCardArray[i].disTory();
        }
        GameInfo.ins.allWallCardArray = [];
        let roomType : GameRoomTypeEnum = GameInfo.ins.roomTableInfo.rule.roomType;
        let wallSuite : Array<number> = Global.Utils.getMajiongWallByGameType(roomType);
        let wallIndex:number = 0;
        let initPoint:cc.Vec2;
        let finalPoint:cc.Vec2 = new cc.Vec2(0,0);
        let tempIndex:number = 0;
        let cardId:number=0;
        let arr:Array<number> = [0,1,2,3]
        for(let i = 0 ; i < arr.length ; i++){
            let sitNum:number = this.getZhuangSit(arr[i]);
            if(GameInfo.ins.nowBookMakerSit < 0){
                sitNum = arr[i];
            }
            for(let l = 0 ; l < wallSuite[arr[i]] ; l++){
                initPoint = CardHelpManager.ins.wallCardInitPoint[sitNum];
                finalPoint = this.getWallPoint(sitNum , initPoint , l);
                let item  = cc.instantiate(this.majiongWallPrefab);
                this.cardTableGroup.addChild(item);
                item.x = finalPoint.x;
                item.y = finalPoint.y;
                if(sitNum == 0 || sitNum == 3){
                    tempIndex = wallSuite[arr[i]] - l - 1;
                    cardId = wallIndex + tempIndex;
                }else{
                    tempIndex = 0;
                    cardId = wallIndex%2 == 0 ? wallIndex+1 : wallIndex-1;
                    wallIndex++;
                }
                (item.getComponent(MajiongWallCard) as MajiongWallCard).cardId = cardId;
                (item.getComponent(MajiongWallCard) as MajiongWallCard).cardPoint = sitNum;
                GameInfo.ins.allWallCardArray.push(item.getComponent(MajiongWallCard));
            }
            if(sitNum == 0 || sitNum == 3){
                wallIndex += wallSuite[arr[i]];
            }
        }
        GameInfo.ins.sortWall();
    }
    /**获取当前牌墙位置*/
    private getWallPoint(sitNum : number , initPoint : cc.Vec2 , index:number):cc.Vec2{
        let wallPoint : cc.Vec2 = new cc.Vec2(0,0);
        switch(sitNum){
            case 0 : 
                wallPoint.x = initPoint.x + Math.floor(index/2)*CardHelpManager.ins.wallCardWidth[sitNum];
                wallPoint.y = index%2 == 0 ? initPoint.y - 20 : initPoint.y;
            break;

            case 1 : 
                wallPoint.x = index%2 == 0 ? (initPoint.x) + Math.floor(index/2)*3 : (initPoint.x + 14) + Math.floor(index/2)*3;
                wallPoint.y = index%2 == 0 ? initPoint.y - Math.floor(index/2)*(CardHelpManager.ins.wallCardHeight[sitNum] - 18.5) : initPoint.y - Math.floor(index/2)*(CardHelpManager.ins.wallCardHeight[sitNum] - 18.5) + 18;
            break;

            case 2 : 
                wallPoint.x = initPoint.x + Math.floor(index/2)*CardHelpManager.ins.wallCardWidth[sitNum];
                wallPoint.y = index%2 == 0 ? initPoint.y - 18 : initPoint.y;
            break;

            case 3 : 
                wallPoint.x = index%2 == 0 ? (initPoint.x) - Math.floor(index/2)*3 : (initPoint.x - 14) - Math.floor(index/2)*3;
                wallPoint.y = index%2 == 0 ? initPoint.y - Math.floor(index/2)*(CardHelpManager.ins.wallCardHeight[sitNum] - 18.5) : initPoint.y - Math.floor(index/2)*(CardHelpManager.ins.wallCardHeight[sitNum] - 18.5) + 18;
            break;
        }
        return wallPoint;
    }
    /**获取当前该发谁的牌墙*/
    private getZhuangSit(index:number):number{
        return (GameInfo.ins.nowBookMakerSit - UserInfo.ins.mySitIndex - index + 16)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType);
    }
    /**展示入庄动画*/
    private showZhuangAction(){
        for(let i = 0 ; i < this.playerHeadArr.length ; i++){
            if(this.playerHeadArr[i].sitInfo.sitNum == GameInfo.ins.nowBookMakerSit){
                this.playerHeadArr[i].showZhuang(true);
            }
        }
    }
    /**展示准备状态*/
	private onPlayerReady(e,data:Msg_SC_Ready){
		for(let i = 0 ; i < this.playerHeadArr.length ; i++){
			if(this.playerHeadArr[i].sitInfo && this.playerHeadArr[i].sitInfo.sitNum == data.okSit){
				this.playerHeadArr[i].showIsReady(true);
			}
		}
        if(data.okSit == UserInfo.ins.mySitIndex){
            this.showReadyBtn(false);
        }
	}
    /**有人坐下*/
    private onNewSit(e,data:Msg_SC_OneSit){
        cc.tween(this.node).delay(0.5).call(()=>{
            this.playerHeadArr[data.newSit.sitNum].sitInfo = data.newSit;
            if(UserInfo.ins.isSelf(data.newSit.player.gpid)){
                this.showSitBtn(false)
                this.myInitSit = data.newSit.sitNum;
                this.myInitSitIndex = data.newSit.sitNum;
                let now:number=0;
                let index:number=0;
                for(let i = data.newSit.sitNum ; i < data.newSit.sitNum+4 ; i++){
                    now = (i + 40)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType);
                    let v2 : cc.Vec2 = this.playerPointArr[index];
                    cc.tween(this.playerHeadArr[now].node).to(TimeAndMoveManager.ins.newPlayerSitMcTime , {x:v2.x + 10,y:v2.y + 10}).call(()=>{
                        /**展示准备按钮*/
                        if(this.playerHeadArr[data.newSit.sitNum].sitInfo.onReady){
                            this.showReadyBtn(false);
                        }else{
                            this.showReadyBtn(true);
                        }
                        this.playerHeadArr[data.newSit.sitNum].showUiPoint();

                        for(let h = 0 ; h < this.playerHeadArr.length ; h++){
                            this.playerHeadArr[h].showUiPoint();
                        }
                        if(Global.Utils.getlocalStorageItem('init_ready_x') == "1"){
                            
                        }else{
                            this.showReadyBtn(false);
                        }
                    })
                    .start()
                    index++;
                }
                if(Global.Utils.getlocalStorageItem('init_ready_x') == "1"){
                            
                }else{
                    this.onReadyClick(null , null);
                    this.showReadyBtn(false);
                }
                for(let i = 0 ; i < this.playerHeadArr.length ; i++){
                    if(this.playerHeadArr[i].playerInfo == null){
                        this.playerHeadArr[i].showNone();
                    }
                }
            }
        },this).start();
		
    }

    /**展示和隐藏准备按钮*/
    showReadyBtn(boo:boolean){
        this.readyBtn.node.active = boo;
    }
    /**展示和隐藏坐下按钮*/
    showSitBtn(boo:boolean){
        this.sitBtn.node.active = boo;
    }
    /**点击骰子*/
    showDiceBtn(boo:boolean){
        this.gameDiceBtn.node.active = boo;
        if(boo){
            let index:number = 0;
            this.schedule(()=>{
                let now:number = 3-index;
                this.rollDiceLabel.string = "长按摇骰 ("+now+"S)";
                if(index == 3){
                    let msg:Msg_CS_DoDice = new Msg_CS_DoDice();
                    Global.mgr.socketMgr.send(-1,msg);
                    this.onGameDiceClick(null , null);
                }
                index++;
            } , 1 , 3 , 0);
        }
    }

    /**展示对局开始和对局结束*/
    showBeginImage(isBegin:boolean){
        if(isBegin){
            Global.Utils.setNewImageToSprite(this.gameBeginImage , "comResource/font/game_duijukaishi" , ()=>{
                this.showBeginImageAction();
            });
        }else{
            Global.Utils.setNewImageToSprite(this.gameBeginImage , "comResource/font/game_duijujieshu" , ()=>{
                this.showBeginImageAction();
            });
        }
    }
    /**展示开始或结束动画*/
    showBeginImageAction(){
        cc.tween(this.gameBeginImage.node).to(0.2 , {opacity : 255 , scaleX : 1 , scaleY : 1}).call(()=>{
            this.schedule(()=>{
                this.gameBeginImage.node.opacity = 0;
                this.gameBeginImage.node.scaleX = 0;
                this.gameBeginImage.node.scaleY = 0;
                this.showPlayTips(true , PlayHintImageType.DingWei);
            } , 2 , 1 , 0);
        }).start();
    }
    //---------------------------------------------------UI  event-----------------------------------------------
    /***准备按钮点击*/
    onReadyClick(event, param){
        Global.Utils.debugOutput("MajiongTablePanel ==> 准备按钮点击")
        let msg : Msg_CS_Ready = new Msg_CS_Ready();
		Global.mgr.socketMgr.send(-1,msg);
    }
    /**坐下按钮点击*/
    onSitBtNClick(){
        Global.Utils.debugOutput("MajiongTablePanel ==> 坐下按钮点击")
        this.onHeadSitClick(null , 4);
    }
    /**投掷骰子点击*/
    onGameDiceClick(event, param){
        if(GameInfo.ins.nowGameStatus == PlayStauteEnum.CheckBookMaker){
            let msg:Msg_CS_DoDice = new Msg_CS_DoDice();
            Global.mgr.socketMgr.send(-1,msg);
            this.showDiceBtn(false);
        }else if(GameInfo.ins.nowGameStatus == PlayStauteEnum.ChangeChar){
            let msg : Msg_CS_PressDice = new Msg_CS_PressDice();
            Global.mgr.socketMgr.send(-1,msg);
            this.showDiceBtn(false);
        }else if(GameInfo.ins.nowGameStatus == PlayStauteEnum.ThrowFrist){
            let msg:Msg_CS_DoDice = new Msg_CS_DoDice();
            Global.mgr.socketMgr.send(-1,msg);
            this.showDiceBtn(false);
        }else if(GameInfo.ins.nowGameStatus == PlayStauteEnum.ChangeThree){
            this.showDiceBtn(false);
        }
    }
    private removeEevnt(){
        Global.EventCenter.removeEventListener(EventType.NEW_ONE_SIT , this.onNewSit , this);
    }

    private createChangeThreeBtn(msg:Msg_SC_You3Maj){
        let url:string = "";
        let otherUrl:string = "";
        switch(msg.type){
            case 0:
                url = "comResource/font/game_tubiaoduijia2"
                otherUrl = "comResource/font/game_tubiaoduijia"
            break;
            case 1:
                url = "comResource/font/game_tubiaoshunshi2"
                otherUrl = "comResource/font/game_tubiaoshunshi"
            break;
            case -1:
                url = "comResource/font/game_tubiaonishi2"
                otherUrl = "comResource/font/game_tubiaonishi"
            break;
        }
        cc.loader.loadRes(url , cc.SpriteFrame , null , (err , res)=>{
            if(err){
                console.error("image err" + err)
            }
            this.changeThreeBtn.normalSprite = res;
            this.changeThreeBtn.hoverSprite = res;
        })
        cc.loader.loadRes(otherUrl , cc.SpriteFrame , null , (err , res)=>{
            if(err){
                console.error("image err" + err)
            }
            this.changeThreeBtn.pressedSprite = res;
            this.changeThreeBtn.disabledSprite = res;
        })
    }
    private changeThreeItem:ChangeThreeItem;
    /***换三记录点击*/
    onChangeThreeBtnClick(){
        if(this.changeThreeItem){
            this.changeThreeItem.disTory();
            this.changeThreeItem = null;
        }
        this.changeThreeItem = cc.instantiate(Global.Utils.getPreFabBySource("changeThree/prefab/ChangeThreeItem")).getComponent(ChangeThreeItem);
        this.node.addChild(this.changeThreeItem.node);
        this.changeThreeItem.node.x = 0;
        this.changeThreeItem.node.y = 0;
    }
    onGameinfoQuestionClic(){

    }
    onGameListBtnClick(){
        Global.DialogManager.createDialog("setting/prefab/SettingPanel",null,(any,dialog)=>{
            dialog.y=0;
        },null,1);
    }
    onGameMenuBtnClick(){
        Global.DialogManager.createDialog("gameRecord/prefab/GameRecordPannel",null,(any,dialog)=>{
            dialog.y=0;
        });
        
    }

    private horseInfoPanel : MyHorsePanel;
    onGameHorseBtnClick(){
        this.hitImage.node.active = false;
        if(this.horseInfoPanel){
            this.horseInfoPanel.disTory();
            this.horseInfoPanel = null;
        }
        this.horseInfoPanel = cc.instantiate(Global.Utils.getPreFabBySource("buyHorse/prefab/MyHorsePanel")).getComponent(MyHorsePanel);
        this.tipsGroup.addChild(this.horseInfoPanel.node);
    }




    private showChangThreeBtn(boo:boolean){
        this.changeThreeBtn.node.active = boo;
    }

    public onNewGame(){
        this.canGetHands = false;
        this.getCardPoint = 0;
        this.getCardBegin = 0;
        this.nowGetHandPlayerNum = 0;
        this.addHandPanelNum = 0;
        for(let i = 0 ; i < this.handPanelArr.length ; i++){
            this.handPanelArr[i].disTory();
        }

        for(let i = 0 ; i < this.playerHeadArr.length ; i++){
            this.playerHeadArr[i].showFen();
        }

        if(this.gamePositionItem){
            this.gamePositionItem.InitPlayerDicType(UserInfo.ins.mySitIndex , GameInfo.ins.AllCardMax);
        }

        for(let i = 0 ; i < this.playerHeadArr.length ; i++){
            this.playerHeadArr[i].showDingQue(CardTypeEnum.EndValue);
            this.playerHeadArr[i].isMyAction = false;
            this.playerHeadArr[i].isPiao = false;
        }
        this.showWallMajiong();
        this.baoziImage.node.active = false;
        this.fightImage.node.active = false;
        cc.Tween.stopAllByTarget(this.fightImage.node);
    }

    public desTory(){
        this.unschedule(this.onCutDownUpdate)
        this.removeEevnt();
    }

    private onRqCloseGame(e, msg: Msg_SC_RqCloseGame): void {
        Global.DialogManager.createDialog("createRoom/prefab/DismissRoomPanel", { msg: msg }, (any, dialog) => {
            dialog.y = 0;
        });
    }

    
}
