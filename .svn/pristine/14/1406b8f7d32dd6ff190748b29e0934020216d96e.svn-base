// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CallBack } from "../com/CallBack";
import { CardTypeEnum, PlayEatTypeEnum, PlayStauteEnum } from "../enum/EnumManager";
import EventType from "../event/EventType";
import GameInfo from "../Game/info/GameInfo";
import UserInfo, { PrDiceRsltData } from "../Game/info/UserInfo";
import TimeAndMoveManager from "../mgr/TimeAndMoveManager";
import { GamePiaoTypeEnum, GameRoomTypeEnum } from "../proto/LobbyMsgDef";
import { Msg_CS_DoDice, Msg_CS_PressDice, Msg_CS_Ready, Msg_SC_BeginDiceMsg, Msg_SC_BuGanging, Msg_SC_Change3Maj, Msg_SC_DiceRslt, Msg_SC_DownMajMsg, Msg_SC_GangSelfMsg, Msg_SC_GetMajMsg, Msg_SC_HuMajMsg, Msg_SC_OneSit, Msg_SC_PengMajMsg, Msg_SC_PrDiceRslt, Msg_SC_QueRslt, Msg_SC_Ready, Msg_SC_RealScore, Msg_SC_SomeTurnMsg, Msg_SC_StartChange3, Msg_SC_StartDiceGame, Msg_SC_StartDicePos, Msg_SC_StartDingQue, Msg_SC_StartGame, Msg_SC_WaitDownMsg, Msg_SC_WaitYou, Msg_SC_You3Maj, Msg_SC_YouMajMsg } from "../proto/TableMsg";
import { SitInfo, SitQueInfo } from "../proto/TableMsgDef";
import { Global } from "../Shared/GloBal";
import Utils from "../Shared/Utils";
import SitDownTips from "../tips/SitDownTips";
import UIBase from "../UIBase";
import { EatCardClass, HuData, MyActionByOther } from "../utils/InterfaceHelp";
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
    @property (cc.Label)
    tableNameLabel : cc.Label = null;
    @property (cc.Label)
    tableTypeLabel : cc.Label = null;
    @property (cc.Label)
    tableFenLabel : cc.Label = null;
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


    /**玩家头像位置*/
    private playerPointArr:Array<cc.Vec2> = [cc.v2(26,-679),cc.v2(1738,-328),cc.v2(1431,-11),cc.v2(26,-328)];
    /**玩家头像集合*/
    private playerHeadArr:Array<PlayerHeadItem> = [];
    /**我的初始位置*/
    private myInitSitIndex:number=-1;
    /**顽疾定位暂存*/
    private prDiceRsltArr:Array<PrDiceRsltData> = [];
    /**自己坐下时候的初始位置暂存*/
    private myInitSit : number=0;
    /**是否已经完成了矫座*/
    private returnPointOver:boolean = false;
    /**是否是掷庄结束*/
    private throwBookMakerOver : boolean = false;
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
    }
    private initUI(){
        this.showReadyBtn(false);
        this.showTableInfo();
        this.showDiceBtn(false);
        this.showGmaePosition();
        this.showBuyHrose();
    }
    private showBuyHrose(){
        this.buyHorseItem1 = cc.instantiate(Global.Utils.getPreFabBySource('mainGame/prefab/BuyHorseItem')).getComponent(BuyHorseItem);
        this.buyHorseItem2 = cc.instantiate(Global.Utils.getPreFabBySource('mainGame/prefab/BuyHorseItem')).getComponent(BuyHorseItem);
        this.buyHorseItem1.index = 1;
        this.buyHorseItem2.index = 2;
        this.buyHorseGroup.addChild(this.buyHorseItem1.node);
        this.buyHorseGroup.addChild(this.buyHorseItem2.node);
    }
    private showGmaePosition(){
        if(this.gamePositionItem){
            this.gamePositionItem.disTory();
        }
        let prefab=Global.Utils.getPreFabBySource("turnTable/prefab/GameTurntablePanel");
        this.gamePositionItem = cc.instantiate(prefab).getComponent(GameTurntablePanel);
        this.gamePositionItem.node.x = 960;
        this.gamePositionItem.node.y = -475;
        this.btnGroup.addChild(this.gamePositionItem.node);
    }
    showTableInfo(){
        this.gameinfoLabel.string = GameInfo.ins.roomTableInfo.roomName;

        this.tableIdLabel.string = "房间号:" + GameInfo.ins.roomTableInfo.code;
        this.tableNameLabel.string = "房间名字:" + GameInfo.ins.roomTableInfo.roomName;
        this.tableFenLabel.string = "底分:" + GameInfo.ins.roomTableInfo.rule.baseScore;
        let gameName:string = Global.Utils.getGameNameByGameType(GameInfo.ins.roomTableInfo.rule.gamePlayType);
        let gameType:string = Global.Utils.getGameTypeNameByGameType(GameInfo.ins.roomTableInfo.rule.roomType);
        this.tableTypeLabel.string = gameName + "["+ gameType +"]";
        this.showChangThreeBtn(false);
        GameInfo.ins.AllCardMax = Global.Utils.getMaxMajiongByGameType(GameInfo.ins.roomTableInfo.rule.roomType)
    }
    private addPlayerHead(){
        let maxPlayer : GameRoomTypeEnum = Global.Utils.getMaxPlayerByGameType( GameInfo.ins.roomTableInfo.rule.roomType);
        for(let i = 0 ; i < maxPlayer ; i++){
            Global.Utils.createObjToNode('playerHead/prefab/PlayerHeadItem',this.headGroup,i,this.playerPointArr[i],(any,createObj)=>{
                let item : PlayerHeadItem = createObj.getComponent(PlayerHeadItem);
                this.playerHeadArr.push(item);
                let sitInfo:SitInfo = GameInfo.ins.getPlayerBySit(item.directionSitNum);
                if(sitInfo){
                    item.sitInfo = sitInfo;
                }
            })
        }
    }
    private addEvent(){
        Global.EventCenter.addEventListener(EventType.ThrowBookMaker , ()=>{
            for(let i = 0 ; i < this.playerHeadArr.length ; i++){
                this.playerHeadArr[i].showIsReady(false);
            }
			this.showBeginImage(true);
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
	}
    /**换三状态改变*/
    private onChange3Maj(e,msg:Msg_SC_Change3Maj){
        this.getHandPanelBySit(msg.okSit).showOnChangeThree(msg);
        this.changeThreePanel.showOneReady(msg.okSit);
	}
    /***得到换三张结果*/
    private onYou3Maj(e, msg:Msg_SC_You3Maj){
        this.changeThreePanel.setData(msg , this.onChanegEnd , this);
	}
    /**换三表现结束*/
    private onChanegEnd(msg:Msg_SC_You3Maj){
        this.changeThreePanel.disTory();
        this.changeThreePanel = null;

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
		if(msg.tarSit){
			this.getHandPanelBySit(msg.tarSit).clearLastPlay();
		}
		if(msg.huCnt > 1){
			this.getHandPanelBySit(msg.tarSit).showDianPao(msg.huCnt);
		}
	}
    /**自己杠*/
	private onGangSelfMsg(e,msg:Msg_SC_GangSelfMsg){
		let addIndex:number = msg.isPapo == 0 ? 4 : 1;
		GameInfo.ins.addCardToAllOut(addIndex);
		this.getHandPanelBySit(msg.pengSiteNum).showSelfGang(msg);
	}
    /**某人碰杠*/
	private onPengMajMsg(e , msg:Msg_SC_PengMajMsg){
		let addIndex:number = msg.isGang == 1 ? 3 : 2;
		GameInfo.ins.addCardToAllOut(msg.majID , addIndex);
        this.getHandPanelBySit(msg.pengSiteNum).showPengGang(msg);
		this.getHandPanelBySit(msg.fromSiteNum).clearLastPlay();
	}
    /**我摸牌*/
	private onGetFeel(e , msg : Msg_SC_GetMajMsg){this.gamePositionItem.SetCurrentTurnState(
        GameInfo.ins.AllCardMax - GameInfo.ins.allPlayerGetCard , UserInfo.ins.mySitIndex , GameInfo.ins.getPosHu())
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
		if(UserInfo.ins.mySitIndex != msg.downSiteNum){
			let handPanel : HandCardPanel = this.getHandPanelBySit(msg.downSiteNum);
			handPanel.showOutCard(msg.majID);
			GameInfo.ins.otherLastCard = msg.majID;
		}else{
            UserInfo.ins.spliceCardByMyHand(msg.majID);
        }
        if(UserInfo.ins.selfIsLookPlayer && UserInfo.ins.mySitIndex == msg.downSiteNum){
            this.getHandPanelBySit(UserInfo.ins.mySitIndex).showOutCard(msg.majID);
        }
        (this.getHandPanelBySit(UserInfo.ins.mySitIndex) as MyHandCardPanel).closeHupaiTips();
        (this.getHandPanelBySit(UserInfo.ins.mySitIndex) as MyHandCardPanel).closeOutTing();
	}
    /***某个人的回合开始*/
    private onWaitDownMsg(e , msg:Msg_SC_WaitDownMsg){
        for(let i = 0 ; i < this.playerHeadArr.length ; i++){
			if(this.playerHeadArr[i].sitInfo.sitNum == msg.siteNum){
				this.playerHeadArr[i].isMyAction = true;
			}else{
                this.playerHeadArr[i].isMyAction = false;
            }
		}
        this.gamePositionItem.SetCurrentTurnState(GameInfo.ins.AllCardMax - GameInfo.ins.allPlayerGetCard , msg.siteNum , GameInfo.ins.getPosHu())
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
		if(this.returnPointOver){
			this.showThrowFrist();
		}
	}
    /***投掷拿牌骰子*/
	private showThrowFrist(){
		this.showDiceBtn(true);
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
            this.showChangeChar();
        }).start();
	}
    /**展示矫座相关动作*/
    private showChangeChar(){
        this.showChangeTempChar();
    }
    /**展示临时的矫座头像*/
    private showChangeTempChar(){
        let pointArr:Array<cc.Vec2> = [cc.v2(700,-700) , cc.v2(1000,-700) , cc.v2(1000 , -400) , cc.v2(700 , -400)];
        let players : Array<SitInfo> = GameInfo.ins.gamePlayers;
		let newPlayers : Array<SitInfo> = [];
		let noMe : Array<SitInfo> = [];
		let haveMe : Array<SitInfo> = [];
		for(let i = 0 ; i < players.length ; i++){
			if(UserInfo.ins.isSelf(players[i].player.gpid)){
				haveMe.push(players[i]);
				if(players[i].sitNum == GameInfo.ins.nowBookMakerSit){
					GameInfo.ins.isSelfZhuang = true;
				}
                this.gamePositionItem.InitPlayerDicType(UserInfo.ins.mySitIndex , GameInfo.ins.AllCardMax-GameInfo.ins.allPlayerGetCard);
			}else{
				if(haveMe.length > 0){
					haveMe.push(players[i]);
				}else{
					noMe.push(players[i]);
				}
			}
		}
        if(UserInfo.ins.selfIsLookPlayer){
            this.gamePositionItem.InitPlayerDicType(UserInfo.ins.mySitIndex , GameInfo.ins.AllCardMax-GameInfo.ins.allPlayerGetCard);
        }
		newPlayers = haveMe.concat(noMe);

		let throwHeadArr:Array<ThrowPointHeadItem> = [];
        for(let i = 0 ; i < newPlayers.length ; i++){
            Global.Utils.createObjToNode("playerHead/prefab/ThrowPointHeadItem" , this.headGroup ,
            {sitInfo : newPlayers[i] , rslt : this.getRsltDataById(newPlayers[i].player.gpid)} , 
            pointArr[i] , (any,createObj)=>{
                let item : ThrowPointHeadItem = createObj.getComponent(ThrowPointHeadItem);
                throwHeadArr.push(item);
            });
		}	
        cc.tween(this.node).delay(TimeAndMoveManager.ins.changeCharTime).call(()=>{
            for(let i = 0 ; i < throwHeadArr.length ; i++){
                throwHeadArr[i].hideThrow();
                cc.tween(throwHeadArr[i].node).to(TimeAndMoveManager.ins.changeCharAcyionTime , 
                {x : this.playerPointArr[i].x , y : this.playerPointArr[i].y - 203}).call(()=>{
                    throwHeadArr[i].onDestroy();
                }).start();
            }
            cc.tween(this.node).delay(TimeAndMoveManager.ins.changeCharAcyionTime + 0.1).call(()=>{
                this.returnPlayerHeadPoint();
            }).start();
        }).start();
    }
    /**玩家头像位置复原*/
    private returnPlayerHeadPoint(){
        let players : Array<SitInfo> = GameInfo.ins.gamePlayers;
		let newPlayers : Array<SitInfo> = [];
		let noMe : Array<SitInfo> = [];
		let haveMe : Array<SitInfo> = [];
		for(let i = 0 ; i < players.length ; i++){
			if(UserInfo.ins.isSelf(players[i].player.gpid)){
				haveMe.push(players[i]);
				if(players[i].sitNum == GameInfo.ins.nowBookMakerSit){
					GameInfo.ins.isSelfZhuang = true;
				}
			}else{
				if(haveMe.length > 0){
					haveMe.push(players[i]);
				}else{
					noMe.push(players[i]);
				}
			}
		}
		newPlayers = haveMe.concat(noMe);
		let head : PlayerHeadItem;
		for(let i = 0 ; i < newPlayers.length ; i++){
			head = this.getMyHeadBySit((i + this.myInitSit)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType));
			head.sitInfo = newPlayers[i];
			head.showZhuang(false);
			if(head.sitInfo.sitNum == GameInfo.ins.nowBookMakerSit){
				head.showZhuang(true);
			}
		}
        this.showWallMajiong();
		this.returnPointOver = true;
		if(GameInfo.ins.nowGameStatus == PlayStauteEnum.ThrowFrist){
			this.showThrowFrist();
		}
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
        if(this.throwBookMakerOver){
            this.showDiceBtn(true);
        }
    }
    /**投掷骰子结果返回*/
    private onDiceRslt(e,msg:Msg_SC_DiceRslt){
        if(GameInfo.ins.nowGameStatus == PlayStauteEnum.ThrowBookMaker){
			for(let i = 0 ; i < this.playerHeadArr.length ; i++){
				if(this.playerHeadArr[i].directionSitNum == 0){
					this.playerHeadArr[i].showDiceBookMaker(msg);
                    cc.tween(this.node).delay(0.7 + TimeAndMoveManager.ins.zhuangRollTime + TimeAndMoveManager.ins.diceRotation).call(()=>{
                        this.showZhuangAction()
                        this.throwBookMakerOver = true;
                        if(GameInfo.ins.nowGameStatus == PlayStauteEnum.ChangeChar){
                            this.showDiceBtn(true);
                        }
                    }).start();
				}
			}
		}else if(GameInfo.ins.nowGameStatus == PlayStauteEnum.ThrowFrist){
            if(msg.bigNum == msg.smlNum && (GameInfo.ins.roomTableInfo.rule.baozi == GamePiaoTypeEnum.Baozi || GameInfo.ins.roomTableInfo.rule.baozi == GamePiaoTypeEnum.ShuaiPiao)){
                GameInfo.ins.isBaozi = true;
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
        Global.Utils.debugOutput("我在这里开始拿牌了、。、、、");
        this.getCardPoint = msg.bigNum;
		this.getCardBegin = msg.smlNum;
        if(GameInfo.ins.nowGameStatus == PlayStauteEnum.DrawHandCard){
            cc.tween(this.node).delay(TimeAndMoveManager.ins.getWallTime).call(()=>{
                this.setWallDrawOeder();
                this.showGetHand();
            }).start()
        }
    }
    /**设置牌墙初始拿牌顺序*/
    private setWallDrawOeder(){
        let now:number = (this.getCardPoint + this.getCardBegin - 1)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType);
        let begin:number = 0;
        let roomType : GameRoomTypeEnum = GameInfo.ins.roomTableInfo.rule.roomType;
        let wallSuite : Array<number> = Global.Utils.getMajiongWallByGameType(roomType);
        for(let i = 0 ; i < now ; i++){
            begin += wallSuite[i];
        }
        begin += (this.getCardBegin + 1)*2;
        let beginIndex:number = 0;
        for(let i = begin ; i < GameInfo.ins.allWallCardArray.length ; i++){
            GameInfo.ins.allWallCardArray[i].majiongDrawOeder = beginIndex;
            beginIndex++;
        }
        for(let i = 0 ; i < begin ; i++){
            GameInfo.ins.allWallCardArray[i].majiongDrawOeder = beginIndex;
            beginIndex++;
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
        let roomType : GameRoomTypeEnum = GameInfo.ins.roomTableInfo.rule.roomType;
        let wallSuite : Array<number> = Global.Utils.getMajiongWallByGameType(roomType);
        let wallIndex:number = 0;
        let initPoint:cc.Vec2;
        let finalPoint:cc.Vec2 = new cc.Vec2(0,0);
        let tempIndex:number = 0;
        let cardId:number=0;
        for(let i = 0 ; i < Global.Utils.getMaxPlayerByGameType(roomType) ; i++){// 
            let sitNum:number = this.getZhuangSit(i);
            for(let l = 0 ; l < wallSuite[i] ; l++){
                initPoint = CardHelpManager.ins.wallCardInitPoint[sitNum];
                finalPoint = this.getWallPoint(sitNum , initPoint , l);
                let item  = cc.instantiate(this.majiongWallPrefab);
                this.cardTableGroup.addChild(item);
                item.x = finalPoint.x;
                item.y = finalPoint.y;
                if(sitNum == 0 || sitNum == 3){
                    tempIndex = wallSuite[i] - l - 1;
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
                wallIndex += wallSuite[i];
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
                wallPoint.x = index%2 == 0 ? (initPoint.x) + Math.floor(index/2)*1 : (initPoint.x + 15) + Math.floor(index/2)*1;
                wallPoint.y = index%2 == 0 ? initPoint.y - Math.floor(index/2)*(CardHelpManager.ins.wallCardHeight[sitNum] - 16) : initPoint.y - Math.floor(index/2)*(CardHelpManager.ins.wallCardHeight[sitNum] - 16) + 16;
            break;

            case 2 : 
                wallPoint.x = initPoint.x + Math.floor(index/2)*CardHelpManager.ins.wallCardWidth[sitNum];
                wallPoint.y = index%2 == 0 ? initPoint.y - 20 : initPoint.y;
            break;

            case 3 : 
                wallPoint.x = index%2 == 0 ? (initPoint.x) - Math.floor(index/2)*1 : (initPoint.x - 15) - Math.floor(index/2)*1;
                wallPoint.y = index%2 == 0 ? initPoint.y - Math.floor(index/2)*(CardHelpManager.ins.wallCardHeight[sitNum] - 16) : initPoint.y - Math.floor(index/2)*(CardHelpManager.ins.wallCardHeight[sitNum] - 16) + 16;
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

                        if(Global.Utils.getlocalStorageItem('init_ready_x') == "1"){
                            this.onReadyClick(null , null);
                            this.showReadyBtn(false);
                        }
                    })
                    .start()
                    index++;
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
        }
    }
    private removeEevnt(){
        Global.EventCenter.removeEventListener(EventType.NEW_ONE_SIT , this.onNewSit , this);
    }

    private changeThreeItem:ChangeThreeItem;
    /***换三记录点击*/
    onChangeThreeBtnClick(){
        if(this.changeThreeItem){
            this.changeThreeItem.disTory();
            this.changeThreeItem = null;
        }else{
            this.changeThreeItem = cc.instantiate(Global.Utils.getPreFabBySource("changeThree/prefab/ChangeThreeItem")).getComponent(ChangeThreeItem);
            this.node.addChild(this.changeThreeItem.node);
            this.changeThreeItem.node.x = -560;
            this.changeThreeItem.node.y = -325;
        }
    }
    onGameinfoQuestionClic(){

    }
    onGameListBtnClick(){

    }
    onGameMenuBtnClick(){
        Global.DialogManager.createDialog("gameRecord/prefab/GameRecordPannel",null,(any,dialog)=>{
            dialog.y=0;
        });
        
    }
    onGameHorseBtnClick(){

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
            this.gamePositionItem.InitPlayerDicType(0 , GameInfo.ins.AllCardMax);
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

    onRecordBtnClick(){
        Global.DialogManager.createDialog("gameRecord/prefab/GameRecordPannel",null,(any,dialog)=>{
            dialog.y=0;
        })
    }


    public desTory(){
        this.removeEevnt();
    }

    
}
