// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CallBack } from "./com/CallBack";
import { PlayStauteEnum } from "./enum/EnumManager";
import EventCenter from "./event/EventCenter";
import EventType from "./event/EventType";
import GameInfo from "./Game/info/GameInfo";
import UserInfo from "./Game/info/UserInfo";
import { Msg_SC_AccErrRlst, Msg_SC_TokenInfo } from "./proto/AccountMsg";
import { Msg_CS_ReqGetRoomRuleTemplate, Msg_SC_BaseCountData, Msg_SC_FeeCountData, Msg_SC_InviteTable, Msg_SC_LobbyInfo, Msg_SC_LobErrRlst, Msg_SC_MahjRecord, Msg_SC_MahjRecordScore, Msg_SC_MaxScoreMajs, Msg_SC_MonthRecord, Msg_SC_NewMail, Msg_SC_NewNike, Msg_SC_PlayerInfo, Msg_SC_PlayerOK, Msg_SC_PlayerRecord, Msg_SC_PubBaseCountData, Msg_SC_RspDeletRoomRuleTemplate, Msg_SC_RspGetRoomRuleTemplate, Msg_SC_RspSaveRoomRuleTemplate, Msg_SC_SyncMails } from "./proto/LobbyMsg";
import { LobbyErrCode, TableRuleTempl } from "./proto/LobbyMsgDef";
import { Msg_CS_LeaveRoom, Msg_CS_VoteCloseGame, Msg_SC_BeginDiceMsg, Msg_SC_BuGanging, Msg_SC_CancelBuyHorse, Msg_SC_Change3Maj, Msg_SC_DiceRslt, Msg_SC_DingQue, Msg_SC_DownMajMsg, Msg_SC_GameOverMsg, Msg_SC_GameResultMsg, Msg_SC_GangSelfMsg, Msg_SC_GetMajMsg, Msg_SC_HasHuGangMsg, Msg_SC_HorseRoomInfo, Msg_SC_HorseRoomState, Msg_SC_HuMajMsg, Msg_SC_NewHorseScoreRslt, Msg_SC_OneLeave, Msg_SC_OneSit, Msg_SC_PengMajMsg, Msg_SC_PoolsList, Msg_SC_PrDiceRslt, Msg_SC_QueRslt, Msg_SC_Ready, Msg_SC_RealScore, Msg_SC_RoomInfo, Msg_SC_RqCloseGame, Msg_SC_ScoreListMsg, Msg_SC_SelHorseRslt, Msg_SC_SitOK, Msg_SC_SomeTurnMsg, Msg_SC_StartChange3, Msg_SC_StartDiceEast, Msg_SC_StartDiceGame, Msg_SC_StartDicePos, Msg_SC_StartDingQue, Msg_SC_StartGame, Msg_SC_StartSelHorse, Msg_SC_SyncEyesList, Msg_SC_SyncGameState, Msg_SC_TabErrRlst, Msg_SC_UpdateHorser, Msg_SC_UpdatePlayerInfo, Msg_SC_VoteCloseRslt, Msg_SC_VoteRslt, Msg_SC_WaitDownMsg, Msg_SC_WaitYou, Msg_SC_You3Maj, Msg_SC_YouMajMsg } from "./proto/TableMsg"
import { SitQueInfo, TableErrCode } from "./proto/TableMsgDef";
import { Global } from "./Shared/GloBal";
import CardHelpManager from "./UI/card/CardHelpManager";
import CreateRoomHelper from "./UI/createRoom/CreateRoomHelper";
import PersonDataHelp from "./utils/PersonDataHelp";

const {ccclass, property} = cc._decorator;

@ccclass
export class MainManager{
    private static _ins: MainManager;
    public static get ins() {
        return this._ins || (this._ins = new MainManager());
    }

    /**账号错误信息返回*/
    public onRspAccError(data:string){
        let msg: Msg_SC_AccErrRlst = JSON.parse(data);
		Global.Utils.diaLogOutBy00("收到账号错误信息:");
    }
    /**大厅错误信息返回*/
	public onRspLobbyError(data:string){
		let msg: Msg_SC_LobErrRlst = JSON.parse(data);
		Global.Utils.diaLogOutBy00("收到大厅错误信息,"+MainManager.ins.getLobbyErroCodeStr(msg.errCode));
		Global.Utils.debugOutput("收到大厅错误信息,"+MainManager.ins.getLobbyErroCodeStr(msg.errCode));
	}
	public getLobbyErroCodeStr(code:number):string{
		let str="";
		switch (code) {
			case LobbyErrCode.eOtherErr:
				str = "详细见文字错误"
				break;
			case LobbyErrCode.eTokenErr:
				str = "Token错误"
				break;
			case LobbyErrCode.eSrvNotFind:
				str = "找不到服务器"
				break;
			case LobbyErrCode.eTidError:
				str = "不存在的牌桌编号"
				break;
			case LobbyErrCode.eInOtherTab:
				str = "你还在其他牌桌上，或创建的牌桌没有结束"
				break;
			case LobbyErrCode.eNotLogin:
				str = "还未登录"
				break;
			case LobbyErrCode.eOtherOnline:
				str = "账号在其他地方登录，被顶下线"
				break;
			case LobbyErrCode.eFavHandNumErr:
				str = "收藏的牌局不存在"
				break;
			case LobbyErrCode.eFavHasFav:
				str = "已经在收藏列表中"
				break;
			case LobbyErrCode.eTidHandNumErr:
				str = "不存在的牌局或手数"
				break;
			case LobbyErrCode.eGameRcdNonExist:
				str = "不存在的牌谱"
				break;
			case LobbyErrCode.eNotExistPTempl:
				str = "不存在的个人模板"
				break;
			case LobbyErrCode.ePTemplOverCnt:
				str = "个人模板数量超过上限"
				break;
			case LobbyErrCode.eLowGold:
				str = "金币不足"
				break;
			case LobbyErrCode.eNotTable:
				str = "没有该牌桌操作的相关信息"
				break;
			case LobbyErrCode.eLimitReadCount:
				str = "没有获取付费数据的权限"
				break;
			case LobbyErrCode.eTabSrvNotFind:
				str = "没有可以提供服务器的牌桌服"
				break;
		}
		return str;
	}
	/**牌桌错误信息返回*/
	public onRspTabError(data:string){
		let msg: Msg_SC_TabErrRlst = JSON.parse(data);
		Global.Utils.diaLogOutBy00("收到牌桌错误信息  "+MainManager.ins.TabelerrorCodeArr[msg.errCode]);
		Global.Utils.debugOutput("收到牌桌错误信息  "+MainManager.ins.TabelerrorCodeArr[msg.errCode]);
	}
	private TabelerrorCodeArr:string[]=[
		"0",
		"1 详细见文字错误",
		"2 座位已被占据",
		"3 非法入座，座位号错误（0-3）",
		"4 需要先进入房间",
		"5 找不到你要的牌桌",
		"6 操作无效(碰杠胡无效)",
		"7 操作无效(当前阶段不需要掷骰子)",
		"8 不该你打牌",
		"9 手上没有这张牌啊",
		"10 已经在座位上",
		"11 牌局开始无法退出房间",
		"12 金币数量不足以让你入座",
		"13 换三张的扣牌不合法",
		"14  2分起胡(胡牌的时候)",
		"15 最后四张必胡（出牌的时候，不能碰杠）",
		"16 不存在的牌局或手数",
		"17 已经在收藏列表中",
		"18 当前状态不允许操作（比如定却中有人胡牌）",
		"19 优先打缺，不缺不能打",
		"20 请求无效（通用消息表示操作非法）",
		"21 买马数量已达上限",
		"22 超过一定手数，不让买马（目前是最后一手）",
		"23 买马人数已满",
		"24 所选择马牌已被其他玩家选择",
		"25 牌局开始无法取消买马",
		"26 不在买马位，非法取消买马",
		"27 所选择马牌不合法(100-107)",
		"28 无效准备，不在位置上",
		"29 创建的牌桌已经存在（重复创建牌桌）",
	]
	/**玩家登录成功*/
	public onTokenInfo(data : string){
		let msg: Msg_SC_TokenInfo = JSON.parse(data);
		Global.Utils.debugOutput("我收到了登录成功",data);
		Global.EventCenter.dispatchEvent(EventType.LOGIN_OK);
	}

    /**登录时候返回玩家信息*/
	public onRspPlayerInfo(data:string){
		let msg: Msg_SC_PlayerInfo = JSON.parse(data);
		UserInfo.ins.myInfo = msg.info;
		if(!msg.curSec){
			GameInfo.ins.setCSOffset(Math.floor(new Date().getTime()/1000));
		}else{
			GameInfo.ins.setCSOffset(msg.curSec);
		}
		Global.Utils.debugOutput("我收到了玩家信息",data);
		EventCenter.ins.dispatchEvent(EventType.RefreshPlayerInfo)
	}
	public onSetPlayeInfoOK(data:string){
		let msg:Msg_SC_PlayerOK=JSON.parse(data);
		UserInfo.ins.myInfo=msg.info;
		EventCenter.ins.dispatchEvent(EventType.RefreshPlayerInfo,"0")
		Global.Utils.debugOutput("我收到了设置完成后玩家信息",data);

	}
	public onSetNewNike(data:string){
		let msg:Msg_SC_NewNike=JSON.parse(data);
		UserInfo.ins.setMyInfoNike(msg.nike);
		EventCenter.ins.dispatchEvent(EventType.RefreshPlayerInfo);
		Global.Utils.dialogOutTips("昵称修改成功!");
		Global.Utils.debugOutput("我收到了修改昵称完成后玩家信息",data);

	}
	/**登录时候返回的大厅信息*/
	public onRspLobbyInfo(data:string){
		let msg : Msg_SC_LobbyInfo = JSON.parse(data);
		GameInfo.ins.lobbyInfo = msg.info;
		Global.Utils.debugOutput("我收到了大厅信息",data);
	}

	/**创建或者进入房间时候返回的房间信息*/
	public onRspRoomInfo(data:string){
		let msg : Msg_SC_RoomInfo = JSON.parse(data);
		GameInfo.ins.roomTableInfo = msg.info;
		GameInfo.ins.gamePlayers = msg.players;
		UserInfo.ins.selfIsLookPlayer = true;
		GameInfo.ins.gameHorseArray=[];
		GameInfo.ins.isDissolutingRoom=false;
		GameInfo.ins.nowGameCount=0;
		Global.Utils.debugOutput("我收到了房间信息data:",data , "---msg：",msg);
		Global.EventCenter.dispatchEvent(EventType.GET_NEW_ROOM_INFO , msg);
		Global.Utils.webCopyString(msg.info.code.toString());
		console.log(PersonDataHelp.ins.getRoomTableInfoStr(msg.info.rule));
		// GameInfo.ins.setRealTimePreformanceData_TableInfo(msg.info);
	}
	/**成功坐下*/
	public onSitOK(data:string){
		let msg : Msg_SC_SitOK = JSON.parse(data);
		UserInfo.ins.mySitIndex = msg.sit;
		console.log("我坐下了data:",data , "---msg：",msg);
		UserInfo.ins.selfIsLookPlayer = false;
		GameInfo.ins.nowGameStatus = PlayStauteEnum.Stand;
		Global.EventCenter.dispatchEvent(EventType.GET_NEW_SIT_OK , msg);
	}
	/**有人入座*/
	public onOneSit(data:string){
		let msg : Msg_SC_OneSit = JSON.parse(data);
		if(GameInfo.ins.gamePlayers.length == 0){
			GameInfo.ins.fristSitPlayer = msg;
		}
		GameInfo.ins.addNewSit(msg.newSit);
		console.log("收到了有玩家进入房间:",data , "---msg：",msg);
		Global.EventCenter.dispatchEvent(EventType.NEW_ONE_SIT , msg);
	}
	public onOneLeave(data:string):void{
		let msg : Msg_SC_OneLeave = JSON.parse(data);
		GameInfo.ins.removeSit(msg.sit);
		console.log("收到了有玩家离开房间:",data , "---msg：",msg);
		Global.EventCenter.dispatchEvent(EventType.NEW_ONE_LEAVE , msg);
	}
	/**有人准备好了*/
	public onReady(data:string){
		let msg : Msg_SC_Ready = JSON.parse(data);
		console.log("收到了有人准备好了:",data , "---msg：",msg);
		if(msg.okSit == UserInfo.ins.mySitIndex){
			GameInfo.ins.nowGameStatus = PlayStauteEnum.Ready;
		}else{
			GameInfo.ins.setNewReady(msg.okSit);
		}
		Global.EventCenter.dispatchEvent(EventType.playerReady , msg);
	}
	/**全部准备完成后开始定庄*/
	public onStartDiceEast(data:string){
		let msg : Msg_SC_StartDiceEast = JSON.parse(data);
		console.log("收到了开始定庄",data , "---msg：",msg);
		GameInfo.ins.nowGameStatus = PlayStauteEnum.ThrowBookMaker;
		Global.EventCenter.dispatchEvent(EventType.ThrowBookMaker , msg);
	}
	/**投掷骰子结果返回*/
	public onDiceRslt(data:string){
		let msg : Msg_SC_DiceRslt = JSON.parse(data);
		console.log("收到了投掷骰子结果:",data , "---msg：",msg);
		Global.EventCenter.dispatchEvent(EventType.DiceRslt , msg);
	}
	/**开始定位*/
	public onStartDicePos(data:string){
		GameInfo.ins.nowGameStatus = PlayStauteEnum.ChangeChar;
		let msg : Msg_SC_StartDicePos = JSON.parse(data);
		console.log("收到了开始定位");
		Global.EventCenter.dispatchEvent(EventType.StartDicePos , msg);
		Global.EventCenter.dispatchEvent(EventType.RefreshSettingBts);
	}
	/**个人定位骰子返回*/
	public onPrDiceRslt(data:string){
		let msg:Msg_SC_PrDiceRslt = JSON.parse(data);
		console.log("收到了投掷个人骰子结果:",data , "---msg：",msg);
		Global.EventCenter.dispatchEvent(EventType.PrDiceRslt , msg);

	}
	/**刷新位置*/
	public onStartDiceGame(data:string){
		let msg:Msg_SC_StartDiceGame  = JSON.parse(data);
		console.log("收到了矫座结果:",data , "---msg：",msg);
		// GameInfo.ins.setNewPlayers(msg.players);
		Global.EventCenter.dispatchEvent(EventType.StartDiceGame , msg);
	}
	/**开始牌局  等待投掷摸牌先后顺序骰子*/
	public onBeginDiceMsg(data:string){
		let msg:Msg_SC_BeginDiceMsg  = JSON.parse(data);
		console.log("收到了开始牌局 投掷骰子:",data , "---msg：",msg);
		GameInfo.ins.nowGameStatus = PlayStauteEnum.ThrowFrist;
		Global.EventCenter.dispatchEvent(EventType.BeginDiceMsg , msg);
	}
	/**开始发牌*/
	public onStartGame(data:string){
		let msg:Msg_SC_StartGame = JSON.parse(data);
		console.log("收到了开始发牌",data,"---msg:",msg)

		UserInfo.ins.myDiceType = -1;//重置自己的定缺状态

		GameInfo.ins.realTimeScore=[];
		GameInfo.ins.nowGameCount = msg.startHands+1;
		GameInfo.ins.nowGameStatus = PlayStauteEnum.DrawHandCard;
		Global.EventCenter.dispatchEvent(EventType.DrawHandCard , msg);
		GameInfo.ins.setRealTimePreformanceData_piao(msg.piaoSit);
	}
	/**手牌到位*/
	public onYouMajMsg(data:string){
		let msg:Msg_SC_YouMajMsg = JSON.parse(data);
		console.log("收到了自己的手牌",data,"---msg:",msg)
		UserInfo.ins.myHandCardArr = msg.lstMajID;
		GameInfo.ins.remPoolsNum = GameInfo.ins.AllCardMax - 4*13 - 1 ;
		//TODO  买马结束后需要刷新一次买马数据还需要减一
		Global.EventCenter.dispatchEvent(EventType.YouMajMsg , msg);
	}
	/**服务器通知定缺*/
	public onStartDingQue(data:string){
		let msg:Msg_SC_StartDingQue = JSON.parse(data);
		console.log("收到了开始定缺",data,"---msg:",msg)
		GameInfo.ins.nowGameStatus = PlayStauteEnum.CheckDice;
		Global.EventCenter.dispatchEvent(EventType.StartDingQue , msg);
	}
	/**定缺状态改变*/
	public onDingQue(data:string){
		let msg:Msg_SC_DingQue = JSON.parse(data);
		console.log("收到了定缺状态改变",data,"---msg:",msg)
		Global.EventCenter.dispatchEvent(EventType.onDingQue , msg);
	}
	/**定缺结果*/
	public onQueRslt(data:string){
		let msg:Msg_SC_QueRslt = JSON.parse(data);
		console.log("收到了定缺结果",data,"---msg:",msg)
		for(let i = 0 ; i < msg.infos.length ; i++){
			let info : SitQueInfo = msg.infos[i];
			if(info.sitNum == UserInfo.ins.mySitIndex){
				UserInfo.ins.myDiceType = info.wtt;
			}
			GameInfo.ins.dingQueList[info.sitNum] = info.wtt;
		}
		Global.EventCenter.dispatchEvent(EventType.QueRslt , msg);
	}
	/**轮到某个人出牌*/
	public onWaitDownMsg(data:string){
		let msg:Msg_SC_WaitDownMsg = JSON.parse(data);
		console.log("收到了某人轮次",data,"---msg:",msg);
		GameInfo.ins.nowActionSit = msg.siteNum;
		if(msg.siteNum == UserInfo.ins.mySitIndex){
			GameInfo.ins.nowGameStatus = PlayStauteEnum.PlayCard;
			GameInfo.ins.canOutCard = true;
		}else{
			GameInfo.ins.nowGameStatus = PlayStauteEnum.WaitOperate;
		}
		Global.EventCenter.dispatchEvent(EventType.WaitDownMsg , msg);
	}
	/**服务器广播某人出牌*/
	public onDownMajMsg(data:string){
		let msg:Msg_SC_DownMajMsg = JSON.parse(data);
		GameInfo.ins.LastIsGang = false;
		console.log("服务器广播某人出牌",data,"---msg:",msg);
		UserInfo.ins.otherLastOutCard = msg.majID;
		Global.EventCenter.dispatchEvent(EventType.DownMajMsg , msg);
		Global.Utils.playSound("sound/2");
		let source:string = "sound/0_" + GameInfo.ins.lauType + "_"+GameInfo.ins.sexType+"_"+Math.floor(msg.majID/10)+"_" + msg.majID%10 + "_1";
		console.log("出牌音效="+source)
		Global.Utils.playSound(source);
	}
	/**广播某人摸牌*/
	public onSomeTurnMsg(data:string){
		let msg:Msg_SC_SomeTurnMsg = JSON.parse(data);
		console.log("收到了某人摸牌",data,"---msg:",msg);
		GameInfo.ins.remPoolsNum = msg.remPoolsNum;
		Global.EventCenter.dispatchEvent(EventType.OtherDrawCard , msg);
	}
	/**我自己的摸牌*/
	public onGetMajMsg(data:string){
		let msg:Msg_SC_GetMajMsg = JSON.parse(data);
		console.log("收到了自己的摸牌",data,"---msg:",msg)
		UserInfo.ins.myLastFeelCard = msg.majID;
		Global.EventCenter.dispatchEvent(EventType.GetMajMsg , msg);
	}
	/**别人出牌触发胡碰杠*/
	public onWaitYou(data:string){
		let msg:Msg_SC_WaitYou = JSON.parse(data);
		console.log("收到了别人出牌我可以胡碰杠,需要等待我做出处理",data,"---msg:",msg)
		Global.EventCenter.dispatchEvent(EventType.WaitYou , msg);
	}
	/**服务器广播某人碰杠*/
	public onPengMajMsg(data:string){
		let msg:Msg_SC_PengMajMsg = JSON.parse(data);
		console.log("服务器广播某人碰杠",data,"---msg:",msg)
		if(msg.isGang){
			GameInfo.ins.LastIsGang = true;
		}
		Global.EventCenter.dispatchEvent(EventType.PengMajMsg , msg);
		let source:string = "sound/0_" + GameInfo.ins.lauType + "_"+GameInfo.ins.sexType+"_"+(msg.isGang ? 5 : 4 ) + "_1";
		console.log("碰杠音效="+source)
		Global.Utils.playSound(source);
	}
	/**服务器广播自己杠*/
	public onGangSelfMsg(data:string){
		let msg:Msg_SC_GangSelfMsg = JSON.parse(data);
		console.log("服务器广播自己杠",data,"---msg:",msg)
		GameInfo.ins.LastIsGang = true;
		Global.EventCenter.dispatchEvent(EventType.GangSelfMsg , msg);
		let source:string = "sound/0_" + GameInfo.ins.lauType + "_"+GameInfo.ins.sexType+"_5" + "_1";
		console.log("杠音效="+source)
		Global.Utils.playSound(source);
	}
	/**服务器告知抢杠*/
	public onHasHuGangMsg(data:string){
		let msg:Msg_SC_HasHuGangMsg = JSON.parse(data);
		console.log("服务器通知有人抢杠",data,"---msg:",msg)
		Global.EventCenter.dispatchEvent(EventType.HasHuGangMsg , msg);
	}
	/**有人要补杠*/
	public onBuGanging(data:string){
		let msg:Msg_SC_BuGanging = JSON.parse(data);
		console.log("收到了补杠:",data , "---msg：",msg);
		Global.EventCenter.dispatchEvent(EventType.BuGanging , msg);
	}

	/**服务器通知胡牌*/
	public onHuMajMsg(data:string){
		let msg:Msg_SC_HuMajMsg = JSON.parse(data);
		console.log("服务器通知有人胡牌",data,"---msg:",msg)
		GameInfo.ins.hupaiArr[msg.huSit] = msg.majID;
		if(msg.huSit == UserInfo.ins.mySitIndex){
			GameInfo.ins.nowGameStatus = PlayStauteEnum.HuCard;
		}
		GameInfo.ins.setRealTimePreformanceData_Hu(msg.huSit,msg.majID,msg.zmType);
		Global.EventCenter.dispatchEvent(EventType.HuMajMsg , msg);
		Global.Utils.playSound("sound/3");
	}
	/**一轮游戏结束*/
	public onGameResultMsg(data:string){
		let msg:Msg_SC_GameResultMsg = JSON.parse(data);
		console.log("收到了一轮游戏结束:",data , "---msg：",msg);
		GameInfo.ins.gameResultMsg = msg;
		GameInfo.ins.nowGameStatus = PlayStauteEnum.SmallGameSettlement;
		Global.EventCenter.dispatchEvent(EventType.GameResultMsg , msg);
		GameInfo.ins.setRealTimePreformanceData_Result(msg.results);
		GameInfo.ins.setRealTimePreformanceData_BuyHorseArr(GameInfo.ins.gameHorseArray);
	}
	/**一轮游戏结束积分*/
	public onScoreListMsg(data:string){
		let msg:Msg_SC_ScoreListMsg = JSON.parse(data);
		console.log("收到了一轮游戏结束积分:",data , "---msg：",msg);
		GameInfo.ins.scoreListMsg = msg;
		Global.EventCenter.dispatchEvent(EventType.ScoreListMsg , msg);
		GameInfo.ins.setRealTimePreformanceData_ScoreList(msg.scores);
	}
	/**实时积分消息*/
	public onRealScore(data:string){
		let msg:Msg_SC_RealScore = JSON.parse(data);
		console.log("收到了实时积分消息:",data , "---msg：",msg);
		GameInfo.ins.addRealTimeScore(msg.event);
		Global.EventCenter.dispatchEvent(EventType.RealScore , msg);
	}

	public onIniveTableMsg(data:string){
		let msg:Msg_SC_InviteTable=JSON.parse(data);
		console.log("收到了玩家邀请信息：  ",data,"---msg:  ",msg);
		GameInfo.ins.gameInviteData=msg;
		Global.EventCenter.dispatchEvent(EventType.GameInviteMsg, msg);
	}

	public onSevenRecordMsg(data:string):void{
		let msg:Msg_SC_PlayerRecord=JSON.parse(data);
		console.log("收到了七日战绩信息：  ",data,"---msg:  ",msg);
		Global.EventCenter.dispatchEvent(EventType.SevenPlayerRecord, msg);
	}
	public onMahjRecordMsg(data:string):void{
		let msg:Msg_SC_MahjRecord=JSON.parse(data);
		console.log("收到了战绩详情信息：  ",data,"---msg:  ",msg);
		Global.EventCenter.dispatchEvent(EventType.GameRecordDetail, msg);
	}
	public onMonthRecordMsg(data:string):void{
		let msg:Msg_SC_MonthRecord=JSON.parse(data);
		console.log("收到了往日战绩信息：  ",data,"---msg:  ",msg);
		Global.EventCenter.dispatchEvent(EventType.PastRecord,msg);
	}
	public onMahjRecordScoreMsg(data:string):void{
		let msg:Msg_SC_MahjRecordScore=JSON.parse(data);
		console.log("七日战绩统计数据信息返回：  ",data,"---msg:  ",msg);
		Global.EventCenter.dispatchEvent(EventType.MahjRecordScore,msg);
	}
	public onGetBaseRecordMsg(data:string):void{
		let msg:Msg_SC_BaseCountData=JSON.parse(data);
		console.log("基础统计数据信息返回：  ",data,"---msg:  ",msg);
		Global.EventCenter.dispatchEvent(EventType.GetBaseRecordMsg,msg);
	}
	public onGetFeeCountData(data:string):void{
		let msg:Msg_SC_FeeCountData=JSON.parse(data);
		console.log("返回收费统计数据：  ",data,"-----msg:  ",msg);
		Global.EventCenter.dispatchEvent(EventType.GetFeeDataBackMsg,msg);
	}
	public onGetServerFeeCountData(data:string):void{
		let msg:Msg_SC_PubBaseCountData=JSON.parse(data);
		console.log("返回服务器收费统计数据：  ",data,"-----msg:  ",msg);
		Global.EventCenter.dispatchEvent(EventType.GetFeeServerDataBackMsg,msg);
	}
	//Msg_SC_MaxScoreMajs
	public onGetMaxScoreMajsData(data:string):void{
		let msg:Msg_SC_MaxScoreMajs=JSON.parse(data);
		console.log("返回最大收益牌型数据:  ",data,"-----msg:   ",msg);
		Global.EventCenter.dispatchEvent(EventType.GetMaxScoreMajsBackMsg,msg);
	}








	/**房间模板信息返回*/
	public onGetRoomRuleTemplate(data:string){
		let msg : Msg_SC_RspGetRoomRuleTemplate = JSON.parse(data);
		if(!msg.ruleInfoArr){
			msg.ruleInfoArr = [];
		}
		CreateRoomHelper.ins.setCreateRoomRuleArr(msg.ruleInfoArr);
		Global.EventCenter.dispatchEvent(EventType.RspGetRoomRuleTemplate , msg);
	}
	/**保存房间模板返回*/
	public onSaveRoomRuleTemplate(data:string){
		let msg : Msg_SC_RspSaveRoomRuleTemplate = JSON.parse(data);
		if(msg.errCode){
			Global.Utils.dialogOutTips("保存失败" , null , (dialog)=>{
				dialog.x = 540;
				dialog.y = -960;
			} , this);
		}else{
			let temp : TableRuleTempl = CreateRoomHelper.ins.lastSaveTemplate;
			temp.templId = msg.tempId;
			Global.Utils.dialogOutTips("保存成功" , null , (dialog)=>{
				dialog.x = 540;
				dialog.y = -960;
			} , this);
			if(CreateRoomHelper.ins.getCreateRoomRuleArr() !== null){//如果模板列表没有初始化则先去获取模板列表
				CreateRoomHelper.ins.addTemplToRuleArr(temp);
				Global.EventCenter.dispatchEvent(EventType.SaveRoomRuleTemplate , msg);
			}else{
				Global.Utils.showWait();
				let msg : Msg_CS_ReqGetRoomRuleTemplate = new Msg_CS_ReqGetRoomRuleTemplate();
				Global.mgr.socketMgr.send(-1,msg);
			}
		}
	}
	/**删除房间模板*/
	public onRspDeletRoomRuleTemplate(data:string){
		let msg : Msg_SC_RspDeletRoomRuleTemplate = JSON.parse(data);
		CreateRoomHelper.ins.removeTempByRuleArr(msg.tempId);
		Global.Utils.dialogOutTips("删除成功" , null , (dialog)=>{
			dialog.x = 540;
			dialog.y = -960;
		} , this);
		Global.EventCenter.dispatchEvent(EventType.RspDeletRoomRuleTemplate , msg);
	}

	/**剩余牌墙信息*/
	public onPoolsList(data:string){
		let msg:Msg_SC_PoolsList = JSON.parse(data);
		Global.EventCenter.dispatchEvent(EventType.PoolsList , msg);
	}

	/**游戏结束大结算数据 */
	public onGameOver(data:string){
		let msg:Msg_SC_GameOverMsg=JSON.parse(data);
		console.log("收到大结算数据: ",data,"---msg",msg);
		GameInfo.ins.gameOverData=msg;
		Global.EventCenter.dispatchEvent(EventType.GameOverMsg , msg);

	}




	/**服务器通知换三张*/
	public onStartChange3(data:string){
		let msg:Msg_SC_StartChange3 = JSON.parse(data);
		console.log("收到了开始换三张",data,"---msg:",msg)
		GameInfo.ins.nowGameStatus = PlayStauteEnum.ChangeThree;
		Global.EventCenter.dispatchEvent(EventType.ChangeThree , msg);
	}
	/**换三张状态改变*/
	public onChange3Maj(data:string){
		let msg:Msg_SC_Change3Maj = JSON.parse(data);
		console.log("收到了换三张状态改变",data,"---msg:",msg)
		Global.EventCenter.dispatchEvent(EventType.Change3Maj , msg);
	}
	/**换三张结果出现*/
	public onYou3Maj(data:string){
		let msg:Msg_SC_You3Maj = JSON.parse(data);
		if(msg.baozi == 2){
			GameInfo.ins.isShuangbao = true;
		}else if(msg.baozi == 1){
			GameInfo.ins.isBaozi = true;
		}
		Global.EventCenter.dispatchEvent(EventType.ShowBaoziFight);
		console.log("收到换三张结果",data,"---msg:",msg)
		GameInfo.ins.myYou3MajData = msg;
		Global.EventCenter.dispatchEvent(EventType.You3Maj , msg);
		GameInfo.ins.setRealTimePreformanceData_BaoziNum(msg.baozi);
	}



	/******************************************买马*************************************************/


	/***服务器通知开始买马*/
	public onStartSelHorse(data:string){
		let msg:Msg_SC_StartSelHorse = JSON.parse(data);
		console.log("收到了开始庄家买马选马",data,"---msg:",msg)
		GameInfo.ins.nowGameStatus = PlayStauteEnum.SelHorse;
		Global.EventCenter.dispatchEvent(EventType.SelHorse , msg);
	}
	/**服务器刷新买马信息*/
	public onUpdateHorser(data:string){
		let msg:Msg_SC_UpdateHorser = JSON.parse(data);
		console.log("收到了最新的买马信息",data,"---msg:",msg)
		GameInfo.ins.gameHorseArray = msg.horsers;
		Global.EventCenter.dispatchEvent(EventType.UpdateHorser , msg);
	}
	/**服务器公告庄家买马结果*/
	public onSelHorseRslt(data:string){
		let msg:Msg_SC_SelHorseRslt = JSON.parse(data);
		console.log("收到了庄家买马结果",data,"---msg:",msg)
		Global.EventCenter.dispatchEvent(EventType.SelHorseRslt , msg);
	}
	/**我有新的买马数据*/
	public onHorseRoomInfo(data:string){
		let msg:Msg_SC_HorseRoomInfo = JSON.parse(data);
		console.log("收到了新的买马数据",data,"---msg:",msg);
		UserInfo.ins.addNewHorseToArray(msg);
		Global.EventCenter.dispatchEvent(EventType.HorseRoomInfo , msg);
	}
	/**买马一手结束后得推送*/
	public onNewHorseScoreRslt(data:string){
		let msg:Msg_SC_NewHorseScoreRslt = JSON.parse(data);
		console.log("收到了买马一手结束",data,"---msg:",msg);
		UserInfo.ins.myNewHorseScoreRsltArr.push(msg);
		Global.EventCenter.dispatchEvent(EventType.NewHorseScoreRslt , msg);
	}
	/***买马推送的房间状态和结算信息*/
	public onHorseRoomState(data:string){
		let msg:Msg_SC_HorseRoomState = JSON.parse(data);
		console.log("收到了买马推送的房间状态和结算信息",data,"---msg:",msg);
		UserInfo.ins.changeMyHorseState(msg)
		Global.EventCenter.dispatchEvent(EventType.HorseRoomState , msg);
	}
	/***取消买马的推送*/
	public onCancelBuyHorse(data:string){
		let msg:Msg_SC_CancelBuyHorse = JSON.parse(data);
		console.log("收到了个人取消买马的推送",data,"---msg:",msg);
		UserInfo.ins.removeHorseByArray(msg);
		Global.EventCenter.dispatchEvent(EventType.CancelBuyHorse , msg);
	}
/**请求关闭房间 */
	public onRqCloseGame(data:string){
		let msg:Msg_SC_RqCloseGame=JSON.parse(data);
		let sitInArr=GameInfo.ins.gamePlayers;
		let dissolutRoomState:number[]=[];
		for(let item of sitInArr){
			if(item){
				dissolutRoomState.push(0);
			}
		}
		GameInfo.ins.isDissolutingRoom=true;
		GameInfo.ins.dissolutRoomData=dissolutRoomState;
		GameInfo.ins.setDissolutRoomDataBySitNum(msg.rqSit,1);
		console.log("收到关闭房间的广播推送",data,"----msg: ",msg);
	
		let maxperson=Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType);
		let iscreator=GameInfo.ins.roomTableInfo.crtAid==UserInfo.ins.myInfo.aid;
		let isAllAgree=GameInfo.ins.checkIsDissolutRoom();
		if(isAllAgree&&GameInfo.ins.gamePlayers.length<maxperson){
			MainManager.ins.backToLobbyTip(true);
			return;
		}
		if(GameInfo.ins.gamePlayers.length<maxperson){
			if(!iscreator){
				let msg=new Msg_CS_VoteCloseGame();
				msg.agree=1;
				Global.mgr.socketMgr.send(-1,msg);
			}
		}else{
			Global.EventCenter.dispatchEvent(EventType.RqCloseGame , msg);
		}
	}
	public onVoteRslt(data:string){
		let msg:Msg_SC_VoteRslt=JSON.parse(data);
		console.log("收到同意 关闭房间投票结果信息",data,"---msg:",msg);
		GameInfo.ins.setDissolutRoomDataBySitNum(msg.sitAgree,1);
		let isAllAgree=GameInfo.ins.checkIsDissolutRoom();
		let maxperson=Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType);
		if(isAllAgree&&GameInfo.ins.gamePlayers.length<maxperson){
			MainManager.ins.backToLobbyTip(true);
			return;
		}
		Global.EventCenter.dispatchEvent(EventType.VoteRslt , msg);
	}
	public backToLobbyTip(isSendMsg:boolean=false):void{
		let callBack=CallBack.bind(function(){
			Global.EventCenter.dispatchEvent(EventType.BackToLobby);
		},this,true);
		MainManager.ins.onLeaveRoomInitData(isSendMsg);
		Global.Utils.dialogOutTips("房主已经解散牌局",callBack);
	}
	public onLeaveRoomInitData(isSendMsg:boolean=false):void{
		if(isSendMsg){
			let msg=new Msg_CS_LeaveRoom();
			Global.mgr.socketMgr.send(-1,msg);
		}
		
		GameInfo.ins.initOver();
		UserInfo.ins.initOver();
		CardHelpManager.ins.initOver();
		UserInfo.ins.mySitIndex=-1;
	}

	public onVoteCloseRslt(data:string){
		let msg:Msg_SC_VoteCloseRslt=JSON.parse(data);
		console.log("收到拒绝 关闭房间投票结果信息",data,"---msg:",msg);
		GameInfo.ins.setDissolutRoomDataBySitNum(msg.refuseSit,0);
		let sitInfo=GameInfo.ins.getPlayerBySit(msg.refuseSit);
		if(sitInfo){
			Global.Utils.dialogOutTips(sitInfo.player.nike+"拒绝解散房间");
			GameInfo.ins.dissolutInCoolTime=true;
			Global.EventCenter.dispatchEvent(EventType.NotVoteCloseRslt , msg);
		}
	}
	public onSyncEyesList(data:string){
		let msg:Msg_SC_SyncEyesList=JSON.parse(data);
		console.log("收到旁观者列表信息 ",data,"----msg: ",msg);
		Global.EventCenter.dispatchEvent(EventType.EyesPlayerMsg,msg);
	}

	public onGetMails(data:string){
		let msg:Msg_SC_SyncMails=JSON.parse(data);
		console.log("收到服务器推送邮件",data,"----msg:  ",msg);
		GameInfo.ins.hallMails=msg.mails;
	}
	public onNewMail(data:string){
		let msg:Msg_SC_NewMail=JSON.parse(data);
		console.log("收到一个新邮件",data,"-----msg:  ",msg);
		GameInfo.ins.hallMails.push(msg.mail);
		EventCenter.ins.dispatchEvent(EventType.RefreshEmailReadState)
	}
}
