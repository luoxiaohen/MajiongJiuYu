/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-10-08 09:24:45
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-12-02 18:37:34
 * @FilePath: \MajiongJiuYu\assets\Script\com\GameProtocol.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { MainManager } from "../MainManager";
import { ACCMSG_SID } from "../proto/AccountMsg";
import { MSG_MID } from "../proto/BaseMsg";
import { LobMSG_SID } from "../proto/LobbyMsg";
import { TabMSG_SID } from "../proto/TableMsg";
import { Global } from "../Shared/GloBal";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameProtocol {
    private static _ins: GameProtocol;
    public static get ins() {
        return this._ins || (this._ins = new GameProtocol());
    }
    public initProtocol(){
        let mgr : MainManager = MainManager.ins;
        Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_Account , ACCMSG_SID.SC_AccErrRlst , mgr.onRspAccError , mgr)

		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_LobbyMsg , LobMSG_SID.SC_LobErrRlst , mgr.onRspLobbyError , this);

		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_TabErrRlst , mgr.onRspTabError , this);

        
        Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_Account , ACCMSG_SID.SC_TokenInfo , mgr.onTokenInfo , mgr)

		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_LobbyMsg , LobMSG_SID.SC_PlayerInfo , mgr.onRspPlayerInfo , this);
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_LobbyMsg , LobMSG_SID.SC_PlayerOK , mgr.onSetPlayeInfoOK , this);
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_LobbyMsg , LobMSG_SID.SC_NewNike , mgr.onSetNewNike , this);


		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_LobbyMsg , LobMSG_SID.SC_LobbyInfo , mgr.onRspLobbyInfo , this);
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_LobbyMsg , LobMSG_SID.SC_RspGetRoomRuleTemplate , mgr.onGetRoomRuleTemplate , this);
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_LobbyMsg , LobMSG_SID.SC_RspSaveRoomRuleTemplate , mgr.onSaveRoomRuleTemplate , this);
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_LobbyMsg , LobMSG_SID.SC_RspDeletRoomRuleTemplate , mgr.onRspDeletRoomRuleTemplate , this);
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_LobbyMsg , LobMSG_SID.SC_InviteTable , mgr.onIniveTableMsg , this)

		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_LobbyMsg , LobMSG_SID.SC_PlayerRecord , mgr.onSevenRecordMsg , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_LobbyMsg , LobMSG_SID.SC_MahjRecord , mgr.onMahjRecordMsg , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_LobbyMsg , LobMSG_SID.SC_MonthRecord , mgr.onMonthRecordMsg , this)
		//MahjRecordScore
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_LobbyMsg , LobMSG_SID.SC_MahjRecordScore , mgr.onMahjRecordScoreMsg , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_LobbyMsg , LobMSG_SID.SC_BaseCountData , mgr.onGetBaseRecordMsg , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_LobbyMsg , LobMSG_SID.SC_FeeCountData , mgr.onGetFeeCountData , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_LobbyMsg , LobMSG_SID.SC_PubBaseCountData , mgr.onGetServerFeeCountData , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_LobbyMsg , LobMSG_SID.SC_MaxScoreMajs , mgr.onGetMaxScoreMajsData , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_LobbyMsg , LobMSG_SID.SC_SyncMails , mgr.onGetMails , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_LobbyMsg , LobMSG_SID.SC_NewMail , mgr.onNewMail , this)


        Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_RoomInfo , mgr.onRspRoomInfo , this);
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_SitOK , mgr.onSitOK , this);
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_OneSit , mgr.onOneSit , this)

		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_OneLeave , mgr.onOneLeave , this)

		
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_Ready , mgr.onReady , this);
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_StartDiceEast , mgr.onStartDiceEast , this)
        Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_DiceRslt , mgr.onDiceRslt , this)
        Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_StartDicePos , mgr.onStartDicePos , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_PrDiceRslt , mgr.onPrDiceRslt , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_StartDiceGame , mgr.onStartDiceGame , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_BeginDiceMsg , mgr.onBeginDiceMsg , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_StartGame , mgr.onStartGame , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_YouMajMsg , mgr.onYouMajMsg , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_StartDingQue , mgr.onStartDingQue , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_DingQue , mgr.onDingQue , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_QueRslt , mgr.onQueRslt , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_WaitDownMsg , mgr.onWaitDownMsg , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_DownMajMsg , mgr.onDownMajMsg , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_SomeTurnMsg , mgr.onSomeTurnMsg , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_GetMajMsg , mgr.onGetMajMsg , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_WaitYou , mgr.onWaitYou , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_PengMajMsg , mgr.onPengMajMsg , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_GangSelfMsg , mgr.onGangSelfMsg , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_HasHuGangMsg , mgr.onHasHuGangMsg , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_HuMajMsg , mgr.onHuMajMsg , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_BuGanging , mgr.onBuGanging , this)

		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_GameResultMsg , mgr.onGameResultMsg , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_ScoreListMsg , mgr.onScoreListMsg , this)



		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_StartChange3 , mgr.onStartChange3 , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_Change3Maj , mgr.onChange3Maj , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_You3Maj , mgr.onYou3Maj , this)

		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_PoolsList , mgr.onPoolsList , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_GameOverMsg , mgr.onGameOver , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_RealScore , mgr.onRealScore , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_StartSelHorse , mgr.onStartSelHorse , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_UpdateHorser , mgr.onUpdateHorser , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_SelHorseRslt , mgr.onSelHorseRslt , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_HorseRoomInfo , mgr.onHorseRoomInfo , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_NewHorseScoreRslt , mgr.onNewHorseScoreRslt , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_HorseRoomState , mgr.onHorseRoomState , this)
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_CancelBuyHorse , mgr.onCancelBuyHorse , this);
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_RqCloseGame , mgr.onRqCloseGame , this);
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_VoteRslt , mgr.onVoteRslt , this);
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_VoteCloseRslt , mgr.onVoteCloseRslt , this);
		Global.mgr.socketMgr.addReceiveNotify(MSG_MID.MID_TableMsg , TabMSG_SID.SC_SyncEyesList , mgr.onSyncEyesList , this);




    }
}
