// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameInfo from "../Game/info/GameInfo";
import UserInfo from "../Game/info/UserInfo";
import { HuTypeEnum } from "../proto/TableMsgDef";
import { Global } from "../Shared/GloBal";
import Utils from "../Shared/Utils";
import { CanHuCard, DeckData, HuData, ListenCard, PengGangData } from "../utils/InterfaceHelp";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CheckCardManager{
    private static _ins: CheckCardManager;
    public static get ins() {
        return this._ins || (this._ins = new CheckCardManager());
    }
    /**计算手牌牌组
	 * 原手牌不需要计算打出可听的牌及蕃 只需要计算是否有听牌
	*/
	public deckCalculationMyHand():DeckData{
		let data : DeckData = new DeckData();
		data.pengValue = this.getPeng();
		data.gangValue = this.getGang();
		data.anGangValue = this.getAnGang();
		data.buGangValue = this.getBuGang();
		data.allTingValue = [];
		data.huValue = this.getAllHu(UserInfo.ins.myHandCardArr);
		data.huData = this.getHuHand(UserInfo.ins.myHandCardArr , null);
		return data;
	}
	/**计算进牌之后的牌组 自己摸牌 自己碰牌 自己杠牌 
	*/
	public deckCalculationAddCard(addCard : number):DeckData{
		let data : DeckData = new DeckData();
		data.pengValue = this.getPeng();
		data.gangValue = this.getGang();
		data.anGangValue = this.getAnGang();
		data.buGangValue = this.getBuGang();
		let arr:Array<number> = UserInfo.ins.myHandCardArr;
		data.huValue = this.getAllHu(this.getNewHand(addCard,arr));
		data.allTingValue = this.getAllTing(UserInfo.ins.myHandCardArr);
		data.huData = this.getHuHand(arr , addCard);
		return data;
	}
	/**获取所有打出可听*/
	private getAllTing(handArr:Array<number>):Array<ListenCard>{
		let listenArr : Array<ListenCard> = [];
		let newHand : Array<number> = handArr;
		let tempArr : Array<number> = [];
		let forNum:number = newHand.length;
		let tempListen : ListenCard;
		for(let i = 0 ; i < forNum ; i++){
			for(let l = 0 ; l < newHand.length ; l++){
				tempArr[l] = newHand[l];
			}
			tempListen = new ListenCard();
			tempListen.outCardValue = newHand[i];
			tempArr.splice(i,1);
			tempListen.huData = this.getAllHu(tempArr);
			if(tempListen.huData.length > 0){
				listenArr.push(tempListen);
			}
		}
		return listenArr;
	}
	/**当前手牌是否可以胡*/
	private getHuHand(handArr:Array<number> , addCard : number) : HuData{
		let canHu : HuData = new HuData();
		canHu = this.getHuData(handArr , addCard);
		if(canHu.HuType.length > 0){
			this.removeAgin(canHu.HuType);
			canHu.fanNum = this.getAllFan(canHu.HuType);
			canHu.beiNum = this.getAllBei(canHu.HuType);
		}
		if(canHu.HuType && canHu.HuType.length > 0){
			return canHu;
		}else{
			return null;
		}
	}
	/***获取所有可胡的牌*/
	private getAllHu(handArr:Array<number>):Array<CanHuCard>{
		let arr:Array<CanHuCard>=[];
		/**先判断手中是否还有定缺牌,如果有定缺牌必不可能有胡*/
		for(let i = 0 ; i < handArr.length ; i++){
			if(Global.Utils.getIsDice(handArr[i] , UserInfo.ins.myDiceType)){
				return [];
			}
		}
		let canHu : CanHuCard = new CanHuCard();
		if(handArr.length == 1){
			canHu = this.getHuData(handArr , handArr[0]);
			this.removeAgin(canHu.HuType);
			canHu.fanNum = this.getAllFan(canHu.HuType);
			canHu.beiNum = this.getAllBei(canHu.HuType);
			arr.push(canHu);
			return arr;
		}
		let fristCard : number = Math.floor(handArr[0]/10);
		let lastCard : number = Math.floor(handArr[handArr.length-1]/10);
		for(let i = fristCard*10 + 1 ; i <= fristCard*10 + 9 ; i++){
			canHu = this.getHuData(handArr , i);
			if(canHu.HuType.length > 0){
				this.removeAgin(canHu.HuType);
				canHu.fanNum = this.getAllFan(canHu.HuType);
				canHu.beiNum = this.getAllBei(canHu.HuType);
				arr.push(canHu);
			}
		}
		if(fristCard!=lastCard){
			for(let i = lastCard*10 + 1 ; i <= lastCard*10 + 9 ; i++){
				canHu = this.getHuData(handArr , i);
				if(canHu.HuType.length > 0){
					this.removeAgin(canHu.HuType);
					canHu.fanNum = this.getAllFan(canHu.HuType);
					canHu.beiNum = this.getAllBei(canHu.HuType);
					arr.push(canHu);
				}
			}
		}
		return this.checkCanHu(arr);
	}
	/**获取一个新的牌组*/
	private getNewHand(card : number , handeArr:Array<number>):Array<number>{
		let newHand:Array<number> = [];
		for(let i = 0 ; i < handeArr.length ; i++){
			newHand.push(handeArr[i]);
		}
		if(card > 0){
			newHand.push(card);
		}
		newHand.sort(Global.Utils.compare);

		return newHand;
	}
	/**计算当前牌可以胡什么*/
	private getHuData(handArr:Array<number> , card : number = null):CanHuCard {
		let newHand : Array<number> = [];
		if(card > 0){
			newHand  = this.getNewHand(card , handArr)
		}else{
			for(let i = 0 ; i < handArr.length ; i++){
				newHand.push(handArr[i]);
			}
		}
		let canHu:CanHuCard = new CanHuCard();
		/**手牌只有2张并相等必然是金钩钓*/
		if(newHand.length == 2 && newHand[0] == newHand[1]){
			canHu.HuType.push(HuTypeEnum.JinGouDiao);
			if(this.haveJiangDui(newHand)){
				canHu.HuType.push(HuTypeEnum.JiangDui);
			}
		}
		if(this.haveDui(newHand) == 7){
			canHu.HuType.push(HuTypeEnum.QiDui);
			if(this.haveGang(newHand) >= 1){
				canHu.HuType.push(HuTypeEnum.LongQiDui);
			}
		}
		if(this.haveDuiDuiHu(newHand)){
			canHu.HuType.push(HuTypeEnum.DuiDuiHu);
			if(this.haveJiangDui(newHand)){
				canHu.HuType.push(HuTypeEnum.JiangDui);
			}
		}
		if(this.havePinghu(newHand)){
			canHu.HuType.push(HuTypeEnum.PingHu);
			if(this.haveYaoJiu(newHand)){
				canHu.HuType.push(HuTypeEnum.YaoJiu);
			}
		}
		if(canHu.HuType.length){
			if(this.isQingYiSe(newHand , true)){
				canHu.HuType.push(HuTypeEnum.QingYiSe);
			}
		}
		if(canHu.HuType.length > 0){
			if(card && card >= 0){
				canHu.cardValue = card;
			}else if(UserInfo.ins.myLastFeelCard >= 0){
				canHu.cardValue = UserInfo.ins.myLastFeelCard
			}else{
				canHu.cardValue = handArr[handArr.length - 1];
			}
			this.removeAgin(canHu.HuType);
		}
		return canHu;
	}
	/***去掉不可重复胡的*/
	private removeAgin(arr:Array<HuTypeEnum>){
		if(arr.length > 1 && arr.indexOf(HuTypeEnum.PingHu) >= 0){
			arr.splice(arr.indexOf(HuTypeEnum.PingHu) , 1);
		}
		if(arr.indexOf(HuTypeEnum.JinGouDiao) >= 0){
			if(arr.indexOf(HuTypeEnum.DuiDuiHu) >= 0){
				arr.splice(arr.indexOf(HuTypeEnum.DuiDuiHu) , 1);
			}
		}
		if(arr.indexOf(HuTypeEnum.LongQiDui) >= 0){
			if(arr.indexOf(HuTypeEnum.QiDui) >= 0){
				arr.splice(arr.indexOf(HuTypeEnum.QiDui) , 1);
			}
		}
		if(arr.indexOf(HuTypeEnum.JiangDui) >= 0){
			if(arr.indexOf(HuTypeEnum.DuiDuiHu) >= 0){
				arr.splice(arr.indexOf(HuTypeEnum.DuiDuiHu) , 1);
			}
		}
	}
	/**是否可以胡幺九*/
	private haveYaoJiu(newHand : Array<number>):boolean{
		let arr:Array<number> = [1,9];
		let penggang : Array<PengGangData> = UserInfo.ins.myPengGang;
		for(let m = 0 ; m < penggang.length ; m++){
			if(arr.indexOf(penggang[m].cardValue) < 0){
				return false;
			}
		}
		let nowCard:number;
		let duiArr:Array<number> = [];
		for(let i = 0 ; i < newHand.length ; i++){
			nowCard = newHand[i];
			if(nowCard == newHand[i+1]){
				duiArr.push(newHand[i]);
				i = i+1;
			}
		}
		if(duiArr.length < 1){
			return false;
		}
		let tempArr:Array<number> = [];
		for(let i = 0 ; i < duiArr.length ; i++){
			for(let l = 0 ; l < newHand.length ; l++){
				tempArr[l] = newHand[l];
			}
			if(arr.indexOf(duiArr[i]%10) < 0){
				continue;
			}
			tempArr.splice(tempArr.indexOf(duiArr[i]) , 2);
			for(let k = 0 ; k < tempArr.length ; k++){
				let card : number = tempArr[k];
				if(this.haveThree(tempArr , card)){
					if(arr.indexOf(card%10) < 0){
						continue;
					}
					for(let m = 0 ; m < 3 ; m++){
						tempArr.splice(tempArr.indexOf(card) , 1);
					}
					k = -1;
				}else if(this.haveShunzi(tempArr , card)){
					if(arr.indexOf(card%10) < 0 && arr.indexOf((card+1)%10) < 0  && arr.indexOf((card+2)%10) < 0 ) {
						continue;
					}
					tempArr.splice(tempArr.indexOf(card) , 1);
					tempArr.splice(tempArr.indexOf(card + 1) , 1);
					tempArr.splice(tempArr.indexOf(card + 2) , 1);
					k = -1;
				}
			}
			if(tempArr.length == 0){
				return true;
			}
		}
		return false;
	}
	/**是否可以平胡*/
	private havePinghu(newHand:Array<number>):boolean{
		let nowCard:number;
		let duiArr:Array<number> = [];
		for(let i = 0 ; i < newHand.length ; i++){
			nowCard = newHand[i];
			if(nowCard == newHand[i+1]){
				duiArr.push(newHand[i]);
				i = i+1;
			}
		}
		if(duiArr.length < 1){
			return false;
		}
		let tempArr:Array<number> = [];
		for(let i = 0 ; i < duiArr.length ; i++){
			for(let l = 0 ; l < newHand.length ; l++){
				tempArr[l] = newHand[l];
			}
			tempArr.splice(tempArr.indexOf(duiArr[i]) , 2);
			for(let k = 0 ; k < tempArr.length ; k++){
				let card : number = tempArr[k];
				if(this.haveThree(tempArr , card)){
					for(let m = 0 ; m < 3 ; m++){
						tempArr.splice(tempArr.indexOf(card) , 1);
					}
					k = -1;
				}else if(this.haveShunzi(tempArr , card)){
					tempArr.splice(tempArr.indexOf(card) , 1);
					tempArr.splice(tempArr.indexOf(card + 1) , 1);
					tempArr.splice(tempArr.indexOf(card + 2) , 1);
					k = -1;
				}
			}
			if(tempArr.length == 0){
				return true;
			}
		}
		return false;
	}
	private haveShunzi(cardArr:Array<number> , card:number):boolean{
		if(cardArr.indexOf(card) >= 0 && cardArr.indexOf(card + 1) >= 0 && cardArr.indexOf(card + 2) >= 0){
			return true;
		}
		return false;
	}
	private haveThree(cardArr:Array<number> , card:number):boolean{
		let index:number = 0;
		for(let i = 0 ; i < cardArr.length ; i++){
			if(cardArr[i] == card){
				index++;
			}
		}
		return index >= 3
	}
	/**是否可能是将对*/
	private haveJiangDui(newHand:Array<number>):boolean{
		let arr : Array<number> = [2,5,8];
		for(let i = 0 ; i < newHand.length ; i++){
			if(arr.indexOf ( newHand[i]%10) < 0 ){
				return false;
			}
		}
		let penggang:Array<PengGangData> = UserInfo.ins.myPengGang;
		for(let i = 0 ; i < penggang.length ; i++){
			if(arr.indexOf(penggang[i].cardValue%10) < 0){
				return false;
			}
		}
		return true;
	}
	/**是否可能是对对胡*/
	private haveDuiDuiHu(newHand:Array<number>):boolean{
		let nowCard:number;
		let haveDui:boolean = false;
		let keNum:number = 0;
		for(let i = 0 ; i < newHand.length ; i++){
			nowCard = newHand[i];
			if(nowCard == newHand[i+1] && nowCard != newHand[i+2]){
				if(haveDui){
					return false;
				}else{
					haveDui = true;
					i = i+1;
				}
			}else if(nowCard == newHand[i+1] && nowCard == newHand[i+2]){
				keNum++;
				i = i+2;
			}else{
				return false;
			}
		}
		if(haveDui && keNum >= 1){
			return true;
		}
	}
	private haveGang(tempArr:Array<number>):number{
		let num : number = 0;
		let arr:Array<number> = [];
		for(let i = 0 ; i < tempArr.length ; i++){
			if(tempArr[i+3]){
				if(tempArr[i] == tempArr[i+3]){
					arr.push(tempArr[i]);
					i = i + 3;	
				}
			}else{
				i = tempArr.length;
			}
		}
		return arr.length;
	}
	private haveDui(tempArr:Array<number>):number{
		let num : number = 0;
		let arr:Array<number> = [];
		for(let i = 0 ; i < tempArr.length ; i++){
			if(tempArr[i+1]){
				if(tempArr[i] == tempArr[i+1]){
					arr.push(tempArr[i]);
					i = i + 1;	
				}
			}else{
				i = tempArr.length;
			}
		}
		return arr.length;
	}
	/**检测查询后的胡牌数据
	 * 主要是相同牌的胡牌只需要保留最大蕃
	*/
	private checkCanHu(tempCan:Array<CanHuCard>) : Array<CanHuCard>{
		let huArr:Array<CanHuCard> = [];
		let hu:CanHuCard;
		for(let i = 0 ; i < tempCan.length ; i++){
			hu = tempCan[i];
			let otherHu : CanHuCard;
			let tempHu : CanHuCard;
			for(let l = i+1 ; l < tempCan.length ; l++){
				otherHu = tempCan[l];
				if(hu.cardValue == otherHu.cardValue){
					let bigHu:CanHuCard = hu.fanNum > otherHu.fanNum ? hu : otherHu;
					if(tempHu){
						tempHu = tempHu.fanNum > bigHu.fanNum ? tempHu : bigHu;
					}else{
						tempHu = bigHu;
					}
				}
			}
			if(tempHu){
				if(!this.isHaveHu(huArr , tempHu)){
					huArr.push(tempHu);
				}
			}else{
				if(!this.isHaveHu(huArr , hu)){
					huArr.push(hu);
				}
			}
		}
		return huArr;
	}
	/**查询是否有相同胡*/
	private isHaveHu(arr:Array<CanHuCard> , hu:CanHuCard):boolean{
		for(let i = 0 ; i < arr.length ; i++){
			if(arr[i].cardValue == hu.cardValue){
				return true;
			}
		}
		return false;
	}
	/**获取补杠数据*/
	private getBuGang(addCard : number=null) : Array<number>{
		let arr:Array<number>=[];
		let handArr:Array<number> = UserInfo.ins.myHandCardArr;
		let tempArr:Array<number> = [];
		for(let i = 0 ; i < handArr.length ; i++){
			tempArr.push(handArr[i]);
		}
		if(addCard){
			tempArr.push(addCard);
			tempArr.sort(Global.Utils.compare);
		}
		let peng : Array<PengGangData> = UserInfo.ins.myPengGang;
		for(let l = 0 ; l < tempArr.length ; l++){
			let cardStr:number = tempArr[l];
			for(let i = 0 ; i <peng.length ; i++){
				if(peng[i].cardValue == cardStr){
					arr.push(cardStr);
				}
			}
		}
		return arr;
	}
	/**获取杠数据*/
	private getAnGang(addCard : number=null) : Array<number>{
		let arr:Array<number>=[];
		let handArr:Array<number> = UserInfo.ins.myHandCardArr;
		let tempArr:Array<number> = [];
		for(let i = 0 ; i < handArr.length ; i++){
			tempArr.push(handArr[i]);
		}
		if(addCard){
			tempArr.push(addCard);
			tempArr.sort(Global.Utils.compare);
		}
		for(let i = 0 ; i < tempArr.length ; i++){
			if(tempArr[i+3]){
				if(tempArr[i] == tempArr[i+3]){
					if(arr.indexOf(tempArr[i]) < 0){
						arr.push(tempArr[i]);
					}
					i = i + 3;	
				}
			}else{
				i = tempArr.length;
			}
		}
		return arr;
	}
	/**获取杠数据*/
	private getGang(addCard : number=null) : Array<number>{
		let arr:Array<number>=[];
		let handArr:Array<number> = UserInfo.ins.myHandCardArr;
		let tempArr:Array<number> = [];
		for(let i = 0 ; i < handArr.length ; i++){
			tempArr.push(handArr[i]);
		}
		if(addCard){
			tempArr.push(addCard);
			tempArr.sort(Global.Utils.compare);
		}
		for(let i = 0 ; i < tempArr.length ; i++){
			if(tempArr[i+2]){
				if(tempArr[i] == tempArr[i+2]){
					if(arr.indexOf(tempArr[i]) < 0){
						arr.push(tempArr[i]);
					}
					i = i + 2;	
				}
			}else{
				i = tempArr.length;
			}
		}
		return arr;
	}
	/***
	 * 获取所有可碰的牌
	*/
	private getPeng(addCard : number=null):Array<number>{
		let arr:Array<number> = [];
		let handArr:Array<number> = UserInfo.ins.myHandCardArr;
		let tempArr:Array<number> = [];
		for(let i = 0 ; i < handArr.length ; i++){
			tempArr.push(handArr[i]);
		}
		if(addCard){
			tempArr.push(addCard);
			tempArr.sort(Global.Utils.compare);
		}
		for(let i = 0 ; i < tempArr.length ; i++){
			if(tempArr[i+1]){
				if(tempArr[i] == tempArr[i+1]){
					arr.push(tempArr[i]);
					i = i + 1;	
				}
			}else{
				i = tempArr.length;
			}
		}
		return arr;
	}
	/**判断当前牌是否是清一色 无定缺牌情况下*/
	private isQingYiSe(handArr:Array<number> , isChengPengGang : boolean = false):boolean{
		if(!isChengPengGang){
			return Math.floor(handArr[handArr.length-1]/10) == Math.floor(handArr[0]/10);
		}else{
			/**手牌必须清一色 才去计算碰杠区*/
			if(Math.floor(handArr[handArr.length-1]/10) == Math.floor(handArr[0]/10)){
				let key : number = Math.floor(handArr[0]/10);
				let pengGang : Array<PengGangData> = UserInfo.ins.myPengGang;
				for(let i = 0 ; i < pengGang.length ; i++){
					if(Math.floor(pengGang[i].cardValue/10) != key){
						return false;
					}
				}
				return true;
			}else{
				return false;
			}
		}
	}
	/**
	 * 、在这里计算所有蕃
	*/
	private getAllFan(huArr:Array<HuTypeEnum>):number{
		let fan:number = 0;

		return fan;
	}
	/**在这里计算所有倍数*/
	private getAllBei(huArr : Array<HuTypeEnum>):number{
		let bei : number = 0;

		return bei;
	}

	//------------------------------------------------------------------------------------------------------------------------------------------


	public havePengByOther():boolean{
		if(Global.Utils.getIsDice(UserInfo.ins.otherLastOutCard , UserInfo.ins.myDiceType)){
			return false;
		}
		let haveNum : number = 0;
		for(let i = 0 ; i < UserInfo.ins.myHandCardArr.length ; i++){
			if(UserInfo.ins.myHandCardArr[i] == UserInfo.ins.otherLastOutCard){
				haveNum++;
			}
		}
		return haveNum>=2;
	}
	public haveGangByOther():boolean{
		if(Global.Utils.getIsDice(UserInfo.ins.otherLastOutCard , UserInfo.ins.myDiceType)){
			return false;
		}
		let haveNum : number = 0;
		for(let i = 0 ; i < UserInfo.ins.myHandCardArr.length ; i++){
			if(UserInfo.ins.myHandCardArr[i] == UserInfo.ins.otherLastOutCard){
				haveNum++;
			}
		}
		return haveNum>=3;
	}

	public haveHuByOther():HuData{
		if(Global.Utils.getIsDice(UserInfo.ins.otherLastOutCard , UserInfo.ins.myDiceType)){
			return null;
		}
		if(Global.Utils.getIsDice(UserInfo.ins.myLastFeelCard , UserInfo.ins.myDiceType)){
			return null;
		}
		if(UserInfo.ins.haveDiceCard()){
			return null;
		}
		return this.getHuHand(UserInfo.ins.myHandCardArr , UserInfo.ins.otherLastOutCard);
	}
	public haveGangBySelf():Array<number>{
		return this.getAnGang(UserInfo.ins.myLastFeelCard)
	}
	public haveGangByPeng():Array<number>{
		return this.getBuGang(UserInfo.ins.myLastFeelCard)
	}

	public haveHuBySelf():HuData{
		if(Global.Utils.getIsDice(UserInfo.ins.myLastFeelCard , UserInfo.ins.myDiceType)){
			return null;
		}
		if(UserInfo.ins.haveDiceCard()){
			return null;
		}
		return this.getHuHand(UserInfo.ins.myHandCardArr , UserInfo.ins.myLastFeelCard);
	}
	public haveQianggangHuBySelf(cardValue : number):HuData{
		if(Global.Utils.getIsDice(cardValue , UserInfo.ins.myDiceType)){
			return null;
		}
		if(UserInfo.ins.haveDiceCard()){
			return null;
		}
		return this.getHuHand(UserInfo.ins.myHandCardArr , cardValue);
	}
	public haveOutListion():Array<ListenCard>{
		return this.getAllTing(UserInfo.ins.myHandCardArr);
	}
}