// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CallBack } from "../com/CallBack";
import { CardTypeEnum } from "../enum/EnumManager";
import EventCenter from "../event/EventCenter";
import EventType from "../event/EventType";
import UserInfo from "../Game/info/UserInfo";
import { MainManager } from "../MainManager";
import { Msg_CS_DingQue } from "../proto/TableMsg";
import { Global } from "../Shared/GloBal";
import Utils from "../Shared/Utils";
import UIBase from "../UIBase";
import { MajCardLight } from "../utils/InterfaceHelp";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DingQuePanel extends UIBase {
    @property (cc.Button)
    wanBtn : cc.Button = null;
    @property (cc.Button)
    tiaoBtn : cc.Button = null;
    @property (cc.Button)
    tongBtn : cc.Button = null;
    
    @property (cc.Sprite)
    wanBg : cc.Sprite = null;
    @property (cc.Sprite)
    tiaoBg : cc.Sprite = null;
    @property (cc.Sprite)
    tongBg : cc.Sprite = null;
    

    private moreCardArr:Array<number> = [];
    protected onLoad(): void {
        this.initBtnBg();
        let smallTypeArr:Array<number> = this.getTheBestQue();
        this.showSmallRecom(smallTypeArr);
        
    }
    private initBtnBg(){
        this.wanBg.node.active = false;
        this.tiaoBg.node.active = false;
        this.tongBg.node.active = false;
    }

    onWanBtnClick(){
        let isMore:boolean = this.moreCardArr.indexOf(CardTypeEnum.Wan) >= 0;
        if(isMore){
            let callBack=CallBack.bind(function(){
                this.sendDingQue(CardTypeEnum.Wan);
            },this,true);
            Global.Utils.dialogOutConfirm("当你选择的花色手牌>=5张，是否确认选择？", 2 , callBack, null , (dialog)=>{
				dialog.x = 0;
				dialog.y = 0;
			} , this);
        }else{
            this.sendDingQue(CardTypeEnum.Wan);
        }
    }
    onTiaoBtnClick(){
        let isMore:boolean = this.moreCardArr.indexOf(CardTypeEnum.Tiao) >= 0;
        if(isMore){
            let callBack=CallBack.bind(function(){
                this.sendDingQue(CardTypeEnum.Tiao);
            },this,true);
            Global.Utils.dialogOutConfirm("当你选择的花色手牌>=5张，是否确认选择？", 2 , callBack, null , (dialog)=>{
				dialog.x = 0;
				dialog.y = 0;
			} , this);
        }else{
            this.sendDingQue(CardTypeEnum.Tiao);
        }
    }
    onTongBtnClick(){
        let isMore:boolean = this.moreCardArr.indexOf(CardTypeEnum.Tong) >= 0;
        if(isMore){
            let callBack=CallBack.bind(function(){
                this.sendDingQue(CardTypeEnum.Tong);
            },this,true);
            Global.Utils.dialogOutConfirm("当你选择的花色手牌>=5张，是否确认选择？", 2 , callBack, null , (dialog)=>{
				dialog.x = 0;
				dialog.y = 0;
			} , this);
        }else{
            this.sendDingQue(CardTypeEnum.Tong);
        }
    }
    private sendDingQue(queType:CardTypeEnum){
        let msg : Msg_CS_DingQue = new Msg_CS_DingQue();
		msg.wtt = queType;
		Global.mgr.socketMgr.send(-1,msg);
        UserInfo.ins.myDiceType = queType;
        Global.EventCenter.dispatchEvent(EventType.OnSelfClickQue)
        this.disTory();
    }
    private showSmallRecom(arr:Array<number>){
        switch(arr[0]){
            case CardTypeEnum.Wan:
                this.wanBg.node.active = true;
            break;
            case CardTypeEnum.Tiao:
                this.tiaoBg.node.active = true;
            break;
            case CardTypeEnum.Tong:
                this.tongBg.node.active = true;
            break;
        }
    }

    private getTheBestQue():Array<number>{
        let myCardArr:Array<number> = Global.Utils.cloneArr(UserInfo.ins.myHandCardArr);
        let wanArr:Array<number> = [];
        let tiaoArr:Array<number> = [];
        let tongArr:Array<number> = [];
        let cardNum:number = 0;
        for(let i = 0 ; i < myCardArr.length ; i++){
            cardNum = Math.floor(myCardArr[i]/10); 
            if(cardNum == 0){
                wanArr.push(myCardArr[i])
            }else if(cardNum == 1){
                tiaoArr.push(myCardArr[i])
            }else if(cardNum == 2){
                tongArr.push(myCardArr[i])
            }
        }
        if(wanArr.length >= 5){
            this.moreCardArr.push(CardTypeEnum.Wan);
        }
        if(tiaoArr.length >= 5){
            this.moreCardArr.push(CardTypeEnum.Tiao);
        }
        if(tongArr.length >= 5){
            this.moreCardArr.push(CardTypeEnum.Tong);
        }
        let haveMoreNum:number = -1;
        let moreArr:Array<Array<number>> = [];
        let moreArrType:Array<number> = [];
        if(wanArr.length == tiaoArr.length && wanArr.length < tongArr.length){
            haveMoreNum = wanArr.length;
            moreArr = [wanArr,tiaoArr];
            moreArrType = [0,1];
        }
        if(wanArr.length == tongArr.length && wanArr.length < tiaoArr.length){
            haveMoreNum = wanArr.length;
            moreArr = [wanArr,tongArr];
            moreArrType = [0,2];
        }
        if(tongArr.length == tiaoArr.length && tongArr.length < wanArr.length){
            haveMoreNum = wanArr.length;
            moreArr = [tongArr,tiaoArr];
            moreArrType = [2,1];
        }
        let smallType:Array<number> = [];
        if(haveMoreNum >= 0){
            let weight0 : number = this.getAllCardLight(moreArr[0]);
            let weight1 : number = this.getAllCardLight(moreArr[1]);
            if(weight0 == weight1){
                smallType = moreArrType
            }else{
                smallType[0] = weight0 < weight1 ? moreArrType[0] : moreArrType[1]
            }
        }else{
            let smallArr:Array<number> = wanArr;
            smallType[0] = CardTypeEnum.Wan;
            if(tiaoArr.length < smallArr.length){
                smallType[0] = CardTypeEnum.Tiao;
                smallArr = tiaoArr;
            }
            if(tongArr.length < smallArr.length){
                smallType[0] = CardTypeEnum.Tong;
                smallArr = tongArr;
            }
        }
        return smallType;
    }
    /**获取所有牌的权重列表**/
	getAllCardLight(handItemArr:Array<number>):number{
		let allArr:Array<number> = handItemArr;
		let nowArr:Array<number> = [];
		let dic : Array<MajCardLight> = [];
		let now : number;
		let msjLight:MajCardLight;
		let light:number;
        allArr.sort(Global.Utils.compare);
        nowArr = this.getNowArr(allArr);
        let moreArr:Array<number> = [0 , 0 , 80 , 300 , 500]
		for(let i = 0 ; i < nowArr.length ; i++){
            msjLight = new MajCardLight();
			light = 0;
            now = nowArr[i];
			msjLight.cardValue = now;
            if(nowArr.indexOf(now-1)>=0){
                light+=20;
            }
            if(nowArr.indexOf(now+1)>=0){
                light+=20;
            }
            if(nowArr.indexOf(now-2)>=0 && this.isOne(now , now-2)){
                light+=10;
            }
            if(nowArr.indexOf(now+2)>=0 && this.isOne(now , now+2)){
                light+=10;
            }
            light+=moreArr[this.getAllNum(allArr , now)];
			msjLight.cardLight = light;
			dic[i] = msjLight;
		}
        let allN:number = 0;
        for(let i = 0 ; i < handItemArr.length ; i++){
            for(let l = 0 ; l < dic.length ; l++){
                if(handItemArr[i] == dic[l].cardValue){
                    allN += dic[l].cardLight;
                }
            }
        }

		return allN;
	}
    
    private getAllNum(nowArr:Array<number> , now):number{
        let index:number = 0;
        for(let i = 0 ; i < nowArr.length ; i++){
            if(nowArr[i] == now){
                index++;
            }
        }
        return index;
    }
    private getNowArr(nowArr:Array<number>):Array<number>{
        let newArr:Array<number> = [];
        for(let i = 0 ; i < nowArr.length ; i++){
            if(newArr.indexOf(nowArr[i]) < 0){
                newArr.push(nowArr[i]);
            }
        }
        return newArr;
    }
    /**获取换三张默认推荐**/
	private getCardAllWeight(nowArr:Array<number>):number{
		let dic : Array<MajCardLight> = [];
		let aOne:number;
		let aTwo : number;
		let now : number;
		let lOne:number;
		let lTwo : number;
		let lThree: number;
		let msjLight:MajCardLight = new MajCardLight();
		let light:number;
		for(let i = 0 ; i < nowArr.length ; i++){
			light = 0;
			aOne = nowArr[i-1];
			aTwo = nowArr[i-2];
			now = nowArr[i];
			lOne = nowArr[i+1];
			lTwo = nowArr[i+2];
			lThree = nowArr[i+3];
			if(dic[now]){
				continue;
			}
			msjLight.cardValue = now;
			/**相邻*/
			if(aOne && now == aOne+1 && this.isOne(now , aOne)){
				light += 20;
			}
			if(lOne && now == lOne-1 && this.isOne(now , lOne)){
				light += 20;
			}
			/**相隔*/
			if(aTwo && now == aTwo+2 && this.isOne(now , aTwo)){
				light += 10;
			}
			if(lTwo && now == lTwo-2 && this.isOne(now , lTwo)){
				light += 10;
			}
			/***两同*/
			if(lOne && now==lOne && this.isOne(now , lTwo)){
				light+=80;
				/***三同*/
				if(lTwo && now==lTwo && this.isOne(now , lTwo)){
					light+=300;
					/***四同*/
					if(lThree && now==lThree && this.isOne(now , lThree)){
						light+=500;
					}
				}
			}
			msjLight.cardLight = light;
			dic[now]=msjLight;

		}
        let allWeight:number = 0;
        for(let i = 0 ; i < nowArr.length ; i++){
            allWeight += dic[nowArr[i]].cardLight;
        }
        return allWeight;
	}
    private isOne(a:number , b:number){
		if(Math.floor(a/10) == Math.floor(b/10)){
			return true;
		}
		return false;
	}
    disTory(){
        super.disTory()
    }
}
