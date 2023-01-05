// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CardTypeEnum } from "../../enum/EnumManager";
import CheckCardManager from "../../mgr/CheckCardManager";
import { PlayerData } from "../../proto/LobbyMsgDef";
import { Msg_SC_CancelBuyHorse, Msg_SC_HorseRoomInfo, Msg_SC_HorseRoomState, Msg_SC_NewHorseScoreRslt, Msg_SC_PrDiceRslt } from "../../proto/TableMsg";
import { Global } from "../../Shared/GloBal";
import Utils from "../../Shared/Utils";
import { HuData, ListenCard, PengGangData } from "../../utils/InterfaceHelp";
import GameInfo from "./GameInfo";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UserInfo{
    private static _ins: UserInfo;
    public static get ins() {
        return this._ins || (this._ins = new UserInfo());
    }

    /**我的个人信息*/
    private _myInfo: PlayerData;
    public get myInfo(): PlayerData {
        return this._myInfo;
    }
    public set myInfo(value: PlayerData) {
        this._myInfo = value;
    }
    public setMyInfoNike(nike:string):void{
        this._myInfo.nike=nike;
    }

    /***我是否是观战者*/
    private _selfIsLookPlayer: boolean = false;
    public get selfIsLookPlayer(): boolean {
        return this._selfIsLookPlayer;
    }
    public set selfIsLookPlayer(value: boolean) {
        this._selfIsLookPlayer = value;
    }

    /***是否是自己*/
    public isSelf(gpid:number):boolean{
        return this.myInfo.gpid == gpid;
    }

    /**我自己的座位*/
    private _mySitIndex: number = -1;
    public get mySitIndex(): number {
        return this._mySitIndex;
    }
    public set mySitIndex(value: number) {
        this._mySitIndex = value;
    }

    /**我自己的手牌数据*/
    private _myHandCardArr: Array<number> = [];
    public get myHandCardArr(): Array<number> {
        return this._myHandCardArr;
    }
    public set myHandCardArr(value: Array<number>) {
        this._myHandCardArr = value;
    }
    public addNewCardToMyHand (card : number){
        this.myHandCardArr.push(card);
        this.myHandCardArr.sort(Global.Utils.compare);
        this.sortHandByDingQueed();
    }
    public spliceCardByMyHand(cardValue : number){
        this.myHandCardArr.splice(this.myHandCardArr.indexOf(cardValue) , 1);
    }
    /**从某个位置删除一个手牌 number*/
	public spliceNumByMyCard(index:number){
		this.myHandCardArr.splice(index,1);
	}
	/**从某个位置删除X个手牌 number*/
	public spliceNumsByMyCard(index:number , num : number){
		this.myHandCardArr.splice(index,num);
	}
    /***我选择的定缺类型*/
    private _myDiceType: CardTypeEnum = CardTypeEnum.EndValue;
    public get myDiceType(): CardTypeEnum {
        return this._myDiceType;
    }
    public set myDiceType(value: CardTypeEnum) {
        this._myDiceType = value;
    }

    /***我的分数*/
    private _gameFen: number = 0;
    public get gameFen(): number {
        return this._gameFen;
    }
    public set gameFen(value: number) {
        this._gameFen = value;
    }

    private _vip: number = 0;
    public get vip(): number {
        return this._vip;
    }
    public set vip(value: number) {
        this._vip = value;
    }

    /**定缺完成后整理手牌*/
    sortHandByDingQueed(){
        let add : Array<number> = this.myHandCardArr;
		let que : Array<number> = [];
		let hand:Array<number> = [];
		for(let i = 0 ; i < add.length ; i++){
			if(Global.Utils.getIsDice(add[i] , this.myDiceType)){
				que.push(add[i])
			}else{
				hand.push(add[i]);
			}
		}
        hand.sort(Global.Utils.compare)
        que.sort(Global.Utils.compare)
		let all : Array<number> = hand.concat(que);
		this.myHandCardArr = all;
    }
    /**我的最后一张摸牌*/
    private _myLastFeelCard: number = -1;
    public get myLastFeelCard(): number {
        return this._myLastFeelCard;
    }
    public set myLastFeelCard(value: number) {
        this._myLastFeelCard = value;
    }
    /**别人的最后一张出牌*/
    private _otherLastOutCard: number;
    public get otherLastOutCard(): number {
        return this._otherLastOutCard;
    }
    public set otherLastOutCard(value: number) {
        this._otherLastOutCard = value;
    }
	/**我的碰杠牌组数据*/
	private _myPengGang: Array<PengGangData> = [];
    public get myPengGang(): Array<PengGangData> {
        return this._myPengGang;
    }
    public set myPengGang(value: Array<PengGangData>) {
        this._myPengGang = value;
    }
    public changePenggang(eatData : PengGangData){
        for(let i = 0 ; i < this.myPengGang.length ; i++){
            if(this.myPengGang[i].cardValue == eatData.cardValue){
                this.myPengGang[i] = eatData;
            }
        }
    }
    /***当前得出牌可听*/
    private _outTing: Array<ListenCard> = [];
    public get outTing(): Array<ListenCard> {
        return this._outTing;
    }
    public set outTing(value: Array<ListenCard>) {
        this._outTing = value;
    }
    /***获取我的可操作选项*/
    public getMyActionList(){

    }
    /**别人出牌是否需要展示过*/
    public getCanGuo():boolean{
        if(GameInfo.ins.remPoolsNum < 4 && GameInfo.ins.roomTableInfo.rule.last4Hu){
            return false;
        }
        return true;
    } 
    /**别人出牌是否需要展示碰*/
    public getCanPeng():boolean{
        GameInfo.ins.checkTheirHandsPeng();
        //达成过手碰条件 并且满足碰条件则可以碰
        if(GameInfo.ins.isTheirHandsPeng && CheckCardManager.ins.havePengByOther()){
            return true
        }
        return false;
    } 
    /**别人出牌是否需要展示杠*/
    public getCanGang():boolean{
        if(CheckCardManager.ins.haveGangByOther()){
            return true;
        }
        return false;
    } 
    /**别人出牌是否需要展示胡*/
    public getCanHu():HuData{
        return CheckCardManager.ins.haveHuByOther();
    }
    /**自己摸牌师傅需要展示杠*/
    public getSelfGang():Array<number>{
        let arr:Array<number> = [];
        arr = CheckCardManager.ins.haveGangBySelf();
        
        return arr;
    }
    public getBuGang():Array<number>{
        let pengArr:Array<number> = CheckCardManager.ins.haveGangByPeng();
        return pengArr;
    }
    /**自己摸牌时候是否需要展示胡*/
    public getSelfHu():HuData{
        return CheckCardManager.ins.haveHuBySelf();
    }
    /**补杠抢时候是否需要展示胡*/
    public getQiangHu(cardValue : number):HuData{
        return CheckCardManager.ins.haveQianggangHuBySelf(cardValue);
    }
    /***自己牌时候需要展示出牌可听*/
    public getOutTing(){
        let arr:Array<ListenCard> = CheckCardManager.ins.haveOutListion();
        this.outTing = arr.length > 0 ? arr : null;
    }
    /***通过牌查找当前可听*/
    public getTingByCardValue(cardValue:number):ListenCard{
        if(this.outTing){
            for(let i = 0 ; i < this.outTing.length ; i++){
                if(this.outTing[i].outCardValue == cardValue){
                    return this.outTing[i]
                }
            }
        }
        return null;
    }
    /**获取可出牌得类型 */
    public getOutType(data:ListenCard , arr : Array<ListenCard>):number{
		let nowHave : number = 4;
		let nowAllFan : number = this.getMaxFan(data);
		if(GameInfo.ins.allOutCardArr[data.outCardValue]){
			nowHave -= GameInfo.ins.allOutCardArr[data.outCardValue];
		}
		if(nowHave <= 0){
			return 2;
		}
		let tingData : ListenCard;
		let isMore : boolean = true;
		for(let i = 0 ; i < arr.length ; i++){
			let tempHave : number=4;
			tingData = arr[i];
			if(GameInfo.ins.allOutCardArr[tingData.outCardValue]){
				tempHave -= GameInfo.ins.allOutCardArr[tingData.outCardValue];
			}
			if(nowHave < tempHave){
				isMore = false;
			}
		}
		if(isMore){
			return 0;
		}

		let isBig : boolean = true;
		let tempFan : number = 0;
		for(let i = 0 ; i < arr.length ; i++){
			tingData = arr[i];
			tempFan = this.getMaxFan(tingData);
			if( nowAllFan < tempFan){
				isBig = false;
			}
		}
		if(isBig){
			return 1;
		}
		return 3;
	}
    private getMaxFan(data:ListenCard):number{
		let nowFan : number = 0;
		for(let i = 0 ; i < data.huData.length ; i++){
			if(data.huData[i].fanNum > nowFan){
				nowFan = data.huData[i].fanNum;
			}
		}
		return nowFan;
	}

    /**是否还有未打出的定缺牌*/
    public haveDiceCard():boolean{
        for(let i = 0 ; i < this.myHandCardArr.length ; i++){
			if(Global.Utils.getIsDice(this.myHandCardArr[i] , this.myDiceType)){
				return true;		
			}
		}
        return false;
    }



    /***我自己的买马数据*/
    private _myBuyHorseArr: Array<Msg_SC_HorseRoomInfo> = [];
    public get myBuyHorseArr(): Array<Msg_SC_HorseRoomInfo> {
        return this._myBuyHorseArr;
    }
    public set myBuyHorseArr(value: Array<Msg_SC_HorseRoomInfo>) {
        this._myBuyHorseArr = value;
    }
    public addNewHorseToArray(msg : Msg_SC_HorseRoomInfo){
        let isHave:boolean = false;
        let data:Msg_SC_HorseRoomInfo;
        for(let i = 0 ; i < this.myBuyHorseArr.length ; i++){
            data = this.myBuyHorseArr[i];
            if(data.majNum == msg.majNum && data.info.tid == msg.info.tid){
                isHave = true;
                this.myBuyHorseArr[i] = msg;
            }
        }
        if(!isHave){
            this.myBuyHorseArr.push(msg);
        }
    }
    public removeHorseByArray(msg : Msg_SC_CancelBuyHorse){
        let data:Msg_SC_HorseRoomInfo;
        let index:number = -1;
        for(let i = 0 ; i < this.myBuyHorseArr.length ; i++){
            data = this.myBuyHorseArr[i];
            if(data.info.hsit == msg.hsit && data.info.tid == msg.tid){
                index = i;
            }
        }
        if(index >= 0){
            this.myBuyHorseArr.splice(index , 1);
        }
    }
    public getHorseRoomByTid(tid:string):Msg_SC_HorseRoomInfo{
        for(let i = 0 ; i < this.myBuyHorseArr.length ; i++){
            if(this.myBuyHorseArr[i].info.tid == tid){
                return this.myBuyHorseArr[i];
            }
        }
    }
    
    /**买马每一手得结算数据**/
    private _myNewHorseScoreRsltArr: Array<Msg_SC_NewHorseScoreRslt> = [];
    public get myNewHorseScoreRsltArr(): Array<Msg_SC_NewHorseScoreRslt> {
        return this._myNewHorseScoreRsltArr;
    }
    public set myNewHorseScoreRsltArr(value: Array<Msg_SC_NewHorseScoreRslt>) {
        this._myNewHorseScoreRsltArr = value;
    }

    /***我自己的买马上限*/
    private _myBuyHorseMax: number = 5;
    public get myBuyHorseMax(): number {
        return this._myBuyHorseMax;
    }
    public set myBuyHorseMax(value: number) {
        this._myBuyHorseMax = value;
    }

    changeMyHorseState(msg : Msg_SC_HorseRoomState){
        for(let i = 0 ; i < this.myBuyHorseArr.length ; i++){
            if(this.myBuyHorseArr[i].info.tid == msg.tid){
                this.myBuyHorseArr[i].isStart = msg.state;
            }
        }
    }

    initOver(){
        this.myHandCardArr = [];
        this.myDiceType = -1;
        this.myLastFeelCard = -1;
        this.otherLastOutCard = -1;
        this.myPengGang = [];
    }
}   

/**定位骰子保存*/
export class PrDiceRsltData{
	playerId : number;
	msg : Msg_SC_PrDiceRslt;
}
