// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CardTypeEnum } from "../enum/EnumManager";
import UserInfo from "../Game/info/UserInfo";
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
            Global.Utils.dialogOutput("当你选择的花色手牌>=5张，是否确认选择？");
        }
        this.sendDingQue(CardTypeEnum.Wan);
    }
    onTiaoBtnClick(){
        let isMore:boolean = this.moreCardArr.indexOf(CardTypeEnum.Tiao) >= 0;
        if(isMore){
            Global.Utils.dialogOutput("当你选择的花色手牌>=5张，是否确认选择？");
        }
        this.sendDingQue(CardTypeEnum.Tiao);
    }
    onTongBtnClick(){
        let isMore:boolean = this.moreCardArr.indexOf(CardTypeEnum.Tong) >= 0;
        if(isMore){
            Global.Utils.dialogOutput("当你选择的花色手牌>=5张，是否确认选择？");
        }
        this.sendDingQue(CardTypeEnum.Tong);
    }
    private sendDingQue(queType:CardTypeEnum){
        let msg : Msg_CS_DingQue = new Msg_CS_DingQue();
		msg.wtt = queType;
		Global.mgr.socketMgr.send(-1,msg);
        UserInfo.ins.myDiceType = queType;
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
            let weight0 : number = this.getCardAllWeight(moreArr[0]);
            let weight1 : number = this.getCardAllWeight(moreArr[1]);
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
