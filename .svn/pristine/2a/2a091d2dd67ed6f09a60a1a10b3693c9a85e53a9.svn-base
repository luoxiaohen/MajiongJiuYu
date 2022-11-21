// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class EventType{
    /**连接上服务器了*/
		public static LOGIN_ACC_NOW  :string = "LOGIN_ACC_NOW";

		/**返回大厅*/
		public static BackToLobby:string = "BackToLobby";
	
		/**登录账号不存在*/
		public static LOGIN_ACC_NOT_FIND  :string = "LOGIN_ACC_NOT_FIND";
		/**登录成功 服务器返回玩家信息*/
		public static LOGIN_OK : string = "LOGIN_OK";
		/**[public | static] 
		 * 舞台发生改变
		 */
		public static STAGE_RESIZE: string = "stageResize";
		/**获取到一个新的房间信息*/
		public static GET_NEW_ROOM_INFO : string = "GET_NEW_ROOM_INFO";
		/**有人成功坐下*/
		public static GET_NEW_SIT_OK : string = "GET_NEW_SIT_OK";
		/**有新的玩家进入房间了*/
		public static NEW_ONE_SIT : string = "NEW_ONE_SIT";
		/**有玩家离开了房间*/
		public static NEW_ONE_LEAVE : string = "NEW_ONE_LEAVE";
		/**开始掷庄*/
		public static ThrowBookMaker : string = "ThrowBookMaker";
		/**开始定位*/
		public static StartDicePos : string = "StartDicePos";
		/**开始矫座*/
		public static StartDiceGame : string = "StartDiceGame";
		/***收到开始牌局 骰子掷先*/
		public static BeginDiceMsg : string = "BeginDiceMsg";
		/**开始发牌*/
		public static DrawHandCard : string = "DrawHandCard";
		/**手牌到位*/
		public static YouMajMsg : string = "YouMajMsg";
		/**换三张*/
		public static ChangeThree : string = "ChangeThree";
		/**换三张状态改变*/
		public static Change3Maj : string = "Change3Maj";
		/**收到换三张结果*/
		public static You3Maj : string = "You3Maj";
		/**开始定缺*/
		public static StartDingQue : string ="StartDingQue";
		/**某人的定缺返回*/
		public static DingQue : string = "DingQue";
		/**定缺结果返回*/
		public static QueRslt : string = "QueRslt";
		/**自己摸牌*/
		public static SelfDrawCard : string = "SelfDrawCard";
		/**别人摸牌*/
		public static OtherDrawCard : string = "OtherDrawCard";
		/**服务器给的自己的摸牌到达*/
		public static GetMajMsg : string = "GetMajMsg";
		/***某人伦茨*/
		public static WaitDownMsg : string = "WaitDownMsg";
		/**别人出牌触发我的胡碰杠*/
		public static WaitYou : string = "WaitYou";
		/**服务器广播某人出牌*/
		public static DownMajMsg : string = "DownMajMsg";
		/**服务器广播某人碰杠*/
		public static PengMajMsg : string = "PengMajMsg";
		/**服务器广播自己杠*/
		public static GangSelfMsg : string = "GangSelfMsg";
		/**服务器通知有人抢杠*/
		public static HasHuGangMsg : string = "HasHuGangMsg";
		/**服务器通知有人胡牌*/
		public static HuMajMsg : string = "HuMajMsg";
		/**服务器刷新手牌信息*/
		public static UpdateHands : string = "UpdateHands";
		/**投掷个人筛子结果*/
		public static PrDiceRslt : string = "PrDiceRslt";
		/**骰子结果*/
		public static DiceRslt : string = "DiceRslt";
		/**有人准备好了*/
		public static playerReady : string = "playerReady";
		/**一轮游戏结束*/
		public static GameResultMsg : string = "GameResultMsg";
		/**一轮游戏结束数据*/
		public static ScoreListMsg : string = "ScoreListMsg";
		/**有人补杠*/
		public static BuGanging : string = "BuGanging";
		/**牌墙剩余数据*/
		public static PoolsList : string = "PoolsList";
		/**大结算数据 */
		public static GameOverMsg : string = "GameOverMsg";
		/**游戏邀请 */
		public static GameInviteMsg:string="GameInviteMsg";

		/**有i人请求关闭房间*/
		public static RqCloseGame : string = "RqCloseGame";
		/**有人同意解散*/
		public static VoteRslt : string = "VoteRslt";
		/**解散房间结果返回*/
		public static VoteCloseRslt : string = "VoteCloseRslt";
		/**有人不同意解散房间*/
		public static NotVoteCloseRslt : string = "NotVoteCloseRslt";

		/**收到了实时积分消息*/
		public static RealScore : string = "RealScore";


















		public static QueRsltToPlayer : string = "QueRsltToPlayer";



		/***规则界面需要移动*/
		public static GameRuleItemMove : string = "GameRuleItemMove";
		/**游戏规则界面改变了游戏玩法*/
		public static GameRuleChangePlayType : string = "GameRuleChangePlayType";
		/**阻止规则界面底注选择和滚动冲突*/
		public static RuleMoveAndScrollerMove : string = "RuleMoveAndScrollerMove";
		/**阻止规则界面底注选择和滚动冲突*/
		public static RuleMoveAndScrollerMoveOver : string = "RuleMoveAndScrollerMoveOver";
		/**开房消耗发生改变*/
		public static OpenRoomUseChange : string = "OpenRoomUseChange";
		/**查看规则TIPS*/
		public static CreateRoomRuleTipsClick : string = "CreateRoomRuleTipsClick";





		/***获取模板信息返回*/
		public static RspGetRoomRuleTemplate : string = "RspGetRoomRuleTemplate";
		/**保存模板返回*/
		public static SaveRoomRuleTemplate : string  = "SaveRoomRuleTemplate";
		/**删除模板返回*/
		public static RspDeletRoomRuleTemplate : string = "RspDeletRoomRuleTemplate";




		/**换三张换牌点击*/
		public static OnChangThreeClick : string = "OnChangThreeClick";






		/**规则界面选择框点击的事件派发*/
		public static CreateRoom_Check_Click : string = "CreateRoom_Check_Click";

		/**角色头像坐下点击*/
		public static PlayerHeadSitClick : string = "PlayerHeadSitClick";


		/**开始新的一手牌*/
		public static OpenNewGame : string = "OpenNewGame";
		/**展示豹子以及双豹*/
		public static ShowBaoziFight : string = "ShowBaoziFight";
}

