// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { TableRuleInfo, TableRuleTempl } from "../../proto/LobbyMsgDef";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CreateRoomHelper{
    private static _ins: CreateRoomHelper;
    public static get ins() {
        return this._ins || (this._ins = new CreateRoomHelper());
    }
    /**投注初始倍数*/
	public initialMultiple:number = 200;
	/**开启买马增加倍数*/
	public openBuyHorseMultiple:number = 100;
	/**开启飘增加倍数*/
	public openDoubleMultiple:number = 100;
	/**16手增加倍数*/
	public moreHandMultiple:number = 100;
	/**开启换三张增加倍数*/
	public changeThreeMultiple:number = 100;
	/**开启庄家必买马增加倍数*/
	public openBookmakerMustBuyHorseMultiple:number = 2;
	/**创建房间底注*/
	public antesArr:Array<number> = [1,2,3,5,10,20,30,50,100,200,300,500,1000];
	/**游戏手数选择*/
	public allGameHnadsArr:Array<number> = [8, 16];
	/**游戏倍数选择选择*/
	public allGameMultipleArr:Array<number> = [8 , 16 , 32];
	public allGameMultipleStringArr:Array<string> = ["3番(8倍)","4番(16倍)","5番(32倍)"];
	/**游戏梯番选择 0表示未勾选*/
	public allGameTiFanArr:Array<number> = [0,2,4,8];
	/**牌桌模板上线*/
	public gameMaxTemplateNum : number = 3;
	/***开房金币消耗*/
	public openRoomUseGlod:Array<OpenRoomGoldUseItem> = [
															{moudleType : 1 , createPlayerUse : 98 , joinPlayerUse : 98 , buyHorsePlayerUse : 98},
															{moudleType : 2 , createPlayerUse : 36 , joinPlayerUse : 0 , buyHorsePlayerUse : 0},
															{moudleType : 3 , createPlayerUse : 36 , joinPlayerUse : 0 , buyHorsePlayerUse : 0},
															{moudleType : 4 , createPlayerUse : 0 , joinPlayerUse : 24 , buyHorsePlayerUse : 24},
														];
	/**游戏规则界面移动状态*/
	public gameRuleItemIsMove:boolean = false;
	/***我上一次规则界面的布局数据*/
	public myLastRuleInfo : TableRuleInfo;
	/**我上一次请求保存得房间模板*/
	public lastSaveTemplate : TableRuleTempl;
	/***我上一次创建时候得模板*/
	public lastRuleInfo : TableRuleInfo;
	/***我上一次创建时候得模板名字*/
	public lastRuleName : string = "";
	/***我上一次加入的房间号*/
	public myLastAddRoomId : number = 0;
													
	/**创建房间的模板*/
	private createRoomRuleArr : Array<TableRuleTempl> = null;
	public setCreateRoomRuleArr(arr : Array<TableRuleTempl>){
		this.createRoomRuleArr = arr;
	}
	public getCreateRoomRuleArr(): Array<TableRuleTempl>{
		return this.createRoomRuleArr;
	}
	public removeTempByRuleArr(tempId : number){
		let haveNum:number=0;
		for(let i = 0 ; i < this.createRoomRuleArr.length ; i++){
			if(this.createRoomRuleArr[i].templId == tempId){
				this.createRoomRuleArr[i] = null;
				haveNum = i;
			}
		}
		this.createRoomRuleArr.splice(haveNum , 1);
	}
	public addTemplToRuleArr(temp : TableRuleTempl){
		let isHave : boolean = false;
		for(let i = 0 ; i < this.createRoomRuleArr.length ; i++){
			if(this.createRoomRuleArr[i].templId == temp.templId){
				this.createRoomRuleArr[i] = temp;
				isHave = true;
			}
		}
		if(!isHave){
			this.createRoomRuleArr.push(temp);
		}
	}
	
	

	colorData = {
        1 : new cc.Color(172,182,187),//0xacb6bb
        2 : new cc.Color(255,255,255),//0xffffff
        3 : new cc.Color(68,77,84),//0x444d54
        4 : new cc.Color(255,0,0),//0xff0000
    }

    createRoomCkeckName = {
        1:"梯番",
        2:"2倍",
        3:"4倍",
        4:"8倍",

		5:"庄家必飘",
		6:"甩飘",
		7:"豹子",
		8:"双豹",
		9:"买1马",
		10:"买2马",
		11:"活马",
		12:"死马",
		13:"庄家买马",
		14:"马不吃马",

		15:"自摸加分",
		16:"门清",
		17:"中张",
		18:"幺九",
		19:"将对",
		20:"夹心五",
		21:"天地胡",
		22:"无叫查大",

		23:"暴雨擦挂",
		24:"及时雨",
		25:"晒太阳",
		26:"连杠通转雨",
		27:"晒太阳",
		28:"晒太阳 - 反雨",

		29:"过庄过胡",
		30:"过庄过碰",
		31:"两分起胡",
		32:"最后四张必胡",
		33:"自摸亮牌",
		34:"实时流水",
		35:"轮庄",
		36:"IP限制",
		37:"GPS限制",
    };
}

/**开房金币支出*/
export class OpenRoomGoldUseItem{
	public moudleType : GameOenRoomUseEnum;
	public createPlayerUse : number;
	public joinPlayerUse : number;
	public buyHorsePlayerUse : number;
}
/**开房金币支出枚举*/
export enum GameOenRoomUseEnum{
	None , 
	Base ,
	BuyHorse ,
	Piao , 
	BankerBuyHorse,
}
