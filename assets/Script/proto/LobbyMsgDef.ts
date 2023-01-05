

/**
* Created by admin on 2022/5/30.
*/
export class LobbyMsgDef {
	// 大厅消息错误信息
}

export enum LobbyErrCode{
	eOK,
	eOtherErr,          // 1 详细见文字错误
	eTokenErr,          // 2 Token错误
	eSrvNotFind,        // 3 找不到服务器
	eTidError,          // 4 不存在的牌桌编号
	eInOtherTab,        // 5 你还在其他牌桌上，或创建的牌桌没有结束
	eNotLogin,          // 6 还未登录
	eOtherOnline,       // 7 账号在其他地方登录，被顶下线
	
	eFavHandNumErr,     // 8 收藏的牌局不存在
	eFavHasFav,         // 9 已经在收藏列表中
	eTidHandNumErr,     // 10 不存在的牌局或手数
	eGameRcdNonExist,   // 11 不存在的牌谱
	
	eNotExistPTempl,    // 12 不存在的个人模板
	ePTemplOverCnt,     // 13 个人模板数量超过上限
	
	eLowGold,           // 14 金币不足()
	
	eNotTable,          // 15 没有该牌桌操作的相关信息,
	eLimitReadCount,    // 16 没有获取付费数据的权限
	eTabSrvNotFind,     // 17 没有可以提供服务器的牌桌服
	
	eHasInitPlayer,     // 18 已经完善了个人信息，不能在使用完善信息消息修改玩家资料
	eBadWordNike,       // 19 昵称不能有敏感字
	eBadWordSign,       // 20 签名不能有敏感字
	eMax
}

// 离开房间关闭房间原因
export enum LeaveRoomReason{
	eNormal,            // 0 未开始自己退出房间
	eOverTime,          // 1 房间超时未开始自动解散
	eEndClose,          // 2 正常结束解散
	eDiss,              // 3 房主解散
	eVoteDiss,          // 4 投票解散
	eCloseSrvDiss,      // 5 停服解散
	eOtherReason,       // 6 其他原因，可能是短线退出后重新进入房间已经不存在
	eMax
}


/**游戏房间类型*/
export enum GameRoomTypeEnum{
	None,
	SiRenSanFang ,      // /**四人三房*/
	SiRenLiangFang,     // /**四人两房*/
	SanRenLiangFang ,   // /**三人两房*/
	LiangRenMaJiang,    // /**两人麻将*/
	eMax
}

/**飘的类型*/
export enum GamePiaoTypeEnum{
	None ,              // /**未勾选*/
	Baozi,              // /**豹子*/
	ShuaiPiao,          // /**甩飘*/
	ZhuangJiaBiPiao,    // /**庄家必飘*/
	eMax
}

/**游戏玩法类型*/
export enum GamePlayTypeEnum{
	None,
	XueZhanDaoDi,       // /**血战到底*/
	HuanSanZhang,       // /**换三张*/
	eMax
}


export enum NoviceType{
	NotNike,            // 还需要完善个人信息
	Recruit,            // 已经完善个人资料进入新手阶段（后续阶段在添加）
}


// 玩家基本信息 - 他人可见信息
export class PlayerInfo{
	public      aid: number;        // 玩家账号唯一ID
	public      gpid: number;       // 玩家临时ID
	public   nike: string;       // 昵称
	public   face: string;       // 头像
	
	//        public int      fee;        // 服务费
	//        public int      gold;       // 带入金币，牌局
	//        public int      hgold;      // 买马金币，退出马位是，从马位上转账到这里，后面通过这里统一收帐
	// ...
	
	// java Ignore PlayerInfo(){}
}

// 玩家详细信息
export class PlayerData{
	public      aid: number;        // 玩家账号唯一ID
	public   nike: string;       // 昵称
	public   face: string;       // 头像
	public      gpid: number;       // 本次链接的临时ID
	
	public      sex: number;        // 性别
	public   sign: string;       // 个性签名
	public      gold: number;       // 金币数量
	public      diam: number;       // 钻石数量
	public      noviceState: number;// 新手阶段（用于新手阶段的一些状态判断，枚举:NoviceType）
	
	// ...
}

// 大厅信息，暂时没有内容
export class LobbyBaseInfo{
	// ...
}

// 牌桌规则（对于勾选项，都是1表示勾选，0表示不选择）
export class TableRuleInfo{
	public      baseScore: number;      // 基础底分
	public      handsCnt: number;       // 手数
	public      limitIP: number;        // IP限制
	public      limitGPS: number;       // GPS限制
	public      gamePlayType : number;  // /**游戏玩法类型*/1=血战，2=换三  依照GamePlayTypeEnum
	public      roomType: number;       // 游戏房间类型   依照 GameRoomTypeEnum
	public      ceiling: number;        // 封顶倍数，几就是几倍（程序只记录倍不记录番），0表示不封顶
	public      zmType: number;         // 0=不加，1=自摸加番，2=自摸加底
	public      tiFan: number;          // 梯番。数字即为倍数，0表示不加
	public      dianGangHua: number;    // 点杠花，1=自摸，2=点炮
	public      sunshine: number;       // 晒太阳，0=不晒，1=晒太阳；2=晒太阳反雨
	public      baozi: number;          // 0=无，1=豹子，2=甩飘,3=庄家必飘 依照GamePiaoTypeEnum
	public      baoziDouble: number;    // 双豹
	public      caGua: number;          // 暴雨（擦挂）
	public      jiShiYu: number;        // 及时雨
	public      allGangShift: number;   // 连杠通传
	public      menqing: number;        // 门清
	public      zhongzhang: number;     // 中张
	public      yao9: number;           // 幺九
	public      jiangdui: number;       // 将对
	public      tdHu: number;           // 天地胡
	public      jiaxin5: number;        // 夹心5
	public      lunZhuang: number;      // 轮庄
	public      passHu: number;         // 过手胡
	public      hu2Score: number;       // 2分起胡
	public      last4Hu: number;        // 最后四张必胡
	public      findMaxHu: number;      // 查大叫
	public      zmOpen: number;         // 自摸亮牌
	public      realTimeCalc: number;   // 实时结算(服务器始终按照实时结算，客户端根据情况来决定是否显示)
	// 买马相关
	public      haveHorse: number;       ///**是否买马 0 : 未选择买马  1:有选择买马*/ 此参数暂时没用
	public      buyHorseNum: number;     ///**选择的买马数量 1,2*/ 0=没有开放买马
	public      buyHorseType: number;    ///**选择的买马类型 1:活马 2:死马*/ 0=活马
	public      isSelectBankerBuyHorse: number;///**是否选择庄家买马*/ 1=true
	public      isSelectEatHorse: number;///**是否选择马不吃马*/    1=true表示马不吃马
	
	public      passPeng: number;        // 过手碰
	// java Ignore TableRuleInfo()
}

// 房间模板单元信息
export class TableRuleTempl{
	public              templId: number;        // 模板ID
	public           name: string;           // 模板名字
	public    rule: TableRuleInfo;           // 创建参数
}

// 大厅内可见的牌桌简要信息
export class TableSummInfo{
	public   tid: string;        // 牌桌唯一编码
	public      type: number;       // 0=个人创建，1=俱乐部创建
	public      code: number;       // 查询码
	public   name: string;       // 房间名字
	public rule: TableRuleInfo;  // 牌桌规则
	//        public int      state;      // 关联状态(在座，创建，旁观)（报名？）
	// ...
	// java Ignore public void TableSummInfo()
}

// 单个邮件基础信息
export class MailUnit{
	public      mailid: number;     // 邮件ID
	public   title: string;      // 邮件标题
	public      time: number;       // 时间
	public   contents: string;   // 邮件正文
	public      src: number;        // 来源（0=系统公告，1=系统通知）
	public      read: number;       // 阅读标记 (1=已读)
	// java Ignore MailUnit()
}

