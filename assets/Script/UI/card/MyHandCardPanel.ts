// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CardGroupPointBySelfEnum, EatCardEnum, PlayEatTypeEnum, PlayStauteEnum } from "../../enum/EnumManager";
import EventType from "../../event/EventType";
import GameInfo from "../../Game/info/GameInfo";
import UserInfo from "../../Game/info/UserInfo";
import TimeAndMoveManager from "../../mgr/TimeAndMoveManager";
import { Msg_CS_Change3Maj, Msg_CS_DownMajMsg, Msg_SC_Change3Maj, Msg_SC_GangSelfMsg, Msg_SC_GetMajMsg, Msg_SC_HuMajMsg, Msg_SC_PengMajMsg, Msg_SC_StartChange3, Msg_SC_WaitYou, Msg_SC_You3Maj } from "../../proto/TableMsg";
import { Global } from "../../Shared/GloBal";
import Utils from "../../Shared/Utils";
import HuPaiTiShiTips from "../../tips/HuPaiTiShiTips";
import UIBase from "../../UIBase";
import { HuData, ListenCard, MajCardLight, MyActionByOther, PengGangData } from "../../utils/InterfaceHelp";
import ChangeThreeTips from "../changeThree/ChangeThreeTips";
import CardHelpManager from "./CardHelpManager";
import HandCardPanel from "./HandCardPanel";
import MajiongEatItem from "./MajiongEatItem";
import MajiongHandCard from "./MajiongHandCard";
import MajiongOutCard from "./MajiongOutCard";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MyHandCardPanel extends HandCardPanel {
    protected onLoad(): void {
        super.onLoad();
        this.addEvent();
    }

    /***最后一张插入*/
    private isAddToLast : boolean = false;
    /**胡牌提示*/
    private hupaiTips:HuPaiTiShiTips;

    protected start(): void {
        this.initHandData();
    }
    private addEvent(){
		Global.EventCenter.addEventListener(EventType.GetMajMsg , this.onGetFeel , this);
		Global.EventCenter.addEventListener(EventType.WaitYou , this.onWaitYou , this);
		Global.EventCenter.addEventListener(EventType.ChangeThree , this.onChangeThree , this);
		Global.EventCenter.addEventListener(EventType.OnChangThreeClick , this.onSelect3Majiong , this);
    }
    /**收到我的等待*/
	private onWaitYou(e , msg:Msg_SC_WaitYou){
        let canHu : HuData = UserInfo.ins.getCanHu();
        let actionData:MyActionByOther = new MyActionByOther();
        actionData.canHu = canHu != null;
        actionData.huData = canHu;
        actionData.canGang = UserInfo.ins.getCanGang();
        if(actionData.canGang){
            actionData.gangValue = [UserInfo.ins.otherLastOutCard];
        }
        if(msg.type == 3){
            actionData.canPeng = true;
            actionData.canHu = true;
        }else{
            actionData.canPeng = msg.type==2;
            actionData.canHu = msg.type==1;
        }
        actionData.canGuo = UserInfo.ins.getCanGuo();
        this.showActionItem(actionData);
   }
   /**展示碰杠胡操作组件*/
   public showActionItem(actionData:MyActionByOther){
        if(UserInfo.ins.selfIsLookPlayer){
            return;
        }
        if(actionData.canPeng || actionData.canGang || actionData.canHu){
            Global.DialogManager.createDialog("GameIActiontem/prefab/GameIActiontem" , actionData , (any,createDialog)=>{
                createDialog.x = 393;
                createDialog.y = 200;
            } , this.node)
        }
   }
    /**我摸牌*/
	private onGetFeel(e , msg : Msg_SC_GetMajMsg){
        this.initMyHandsFeel(false);
        UserInfo.ins.myLastFeelCard = msg.majID;
        this.showCreateFeel(msg);
	}
    private showCreateFeel(msg : Msg_SC_GetMajMsg){
        this.isShowAction();
        UserInfo.ins.addNewCardToMyHand(msg.majID );
        UserInfo.ins.getOutTing();
        this.addNewCard(msg.majID , Global.Utils.getIsDice(msg.majID , UserInfo.ins.myDiceType));
        this.showCanOut();
    }
    private isShowAction(){
        let canHu : HuData = UserInfo.ins.getSelfHu();
        let canGang : Array<number> = UserInfo.ins.getSelfGang();
        let canBuGang : Array<number> = UserInfo.ins.getBuGang();
        let actionData:MyActionByOther = new MyActionByOther();
        actionData.canHu = canHu!= null;
        actionData.huData = canHu;
        actionData.canGang = canGang.length > 0;
        if(!actionData.canGang){
            actionData.canGang = canBuGang.length > 0;
        }
        if(actionData.canGang && canGang.length > 0){
            actionData.gangValue = canGang;
        }
        actionData.canPeng = false;
        actionData.canGuo = UserInfo.ins.getCanGuo();
        this.showActionItem(actionData);
    }
    /***我自己摸牌,添加一张新牌*/
    private addNewCard(cardValue : number, isDice : boolean ){
        let newHand : MajiongHandCard = this.getMyNewHand();
        let lastHand : MajiongHandCard = this.getMyLastHand();
        newHand.node.x = lastHand.node.x + lastHand.cardSize._w + this.feelCardChange[this.bySelfPoint];
        newHand.node.y = 50;
        newHand.cardValue = cardValue;
        newHand.isDice = isDice;
        newHand.isShow = true;
        newHand.isFeel = true;
        newHand.isSelect = false;
        cc.tween(newHand.node).to(TimeAndMoveManager.ins.getWallActionTime*3 , {y : 0}).call(()=>{
        }).start();
        
    }
    /**展示当前牌是否可出*/
    private showCanOut(){
        if(GameInfo.ins.nowGameStatus <= PlayStauteEnum.CheckDice){
            return;
        }
        let cardItem : MajiongHandCard;
        for(let i = 0 ; i < this.handItemArr.length ; i++){
            cardItem = this.handItemArr[i];
            if(cardItem.isShow){
                cardItem.showListion();
            }
        }
    }
    getMyNewHand(): MajiongHandCard {
        for(let i = 0 ; i < this.handItemArr.length ; i++){
            if(this.handItemArr[i].isShow == false){
                return this.handItemArr[i];
            }
        }
    }
    getMyLastHand():MajiongHandCard{
        let lastHand : MajiongHandCard = null;
        let tempHand : MajiongHandCard ;
        for(let i = 0 ; i < this.handItemArr.length ; i++){
            tempHand = this.handItemArr[i];
            if(tempHand.isShow && (tempHand.isFeel==false)){
                if(lastHand == null){
                    lastHand = tempHand;
                }else if(tempHand.node.x > lastHand.node.x){
                    lastHand = tempHand;
                }
            }
        }
        return lastHand;
    }
    initHandData(): void {
        this.bySelfPoint = CardGroupPointBySelfEnum.Self;
        let item : MajiongHandCard;
        for(let i = 0 ; i < 13 ; i++){
            item = cc.instantiate(this.dialogParameters[0]).getComponent(MajiongHandCard) as MajiongHandCard;
            item.bySelfPoint = this.bySelfPoint;
            item.node.x = i*item.cardSize._w;
            item.node.y = 0;
            this.handItemArr.push(item);
            this.node.addChild(item.node);
        }
        item = cc.instantiate(this.dialogParameters[0]).getComponent(MajiongHandCard) as MajiongHandCard;
        item.bySelfPoint = this.bySelfPoint;
        item.node.x = 13*item.cardSize._w + this.feelCardChange[this.bySelfPoint];
        item.node.y = 0;
        item.isFeel = true;
        this.handItemArr.push(item);
        this.node.addChild(item.node);

        let value :number = 0;
        /**初始手牌到位后执行一次乱序*/
        let cardArr:Array<number> = Global.Utils.cloneArr(UserInfo.ins.myHandCardArr)
        cardArr = cardArr.sort(function(a,b){
            return Math.random() - 0.5;
        });
        for(let i = 0 ; i < this.handItemArr.length ; i++){
            value = cardArr[i]
            if(value){
                this.handItemArr[i].cardValue = value;
            }
        }
    }
    showGetHnads(getNum: number): void {
        super.showGetHnads(getNum);
        let item : MajiongHandCard;
        let showIndex:number=0;
        for(let i = 0 ; i < this.handItemArr.length ; i++){
            item = this.handItemArr[i];
            if(!item.isShow && showIndex < getNum){
                showIndex++;
                item.node.y = 50;
                item.isShow = true;
                item.showGetAction(i + showIndex);
            }
        }
        if(getNum < 4){
            cc.tween(this.node).delay(TimeAndMoveManager.ins.getWallTime).call(()=>{
                this.showGetHandOver();
            }).start()
        }else{
        }
    }
    /**发牌结束,需要帮助玩家整理一次手牌*/
    private showGetHandOver(){
        Global.Utils.playSound("sound/4");
        for(let i = 0 ; i < this.handItemArr.length ; i++){
            if(this.handItemArr[i].isShow){
                this.handItemArr[i].showMajiongPut()
            }
        }
        cc.tween(this.node).delay(TimeAndMoveManager.ins.finishHandTime).call(()=>{
            if(UserInfo.ins.selfIsLookPlayer){
                let cardArr:Array<number> = new Array<number>(GameInfo.ins.nowBookMakerSit == UserInfo.ins.mySitIndex ?  14 : 13)
                let addIndex:number = 0;
                for(let i = 0 ; i < this.handItemArr.length ; i++){
                    if(this.handItemArr[i].isShow){
                        if(addIndex < cardArr.length){
                            this.handItemArr[i].showMajiongUp();
                        }
                        addIndex++;
                    }
                    this.handItemArr[i].node.on(cc.Node.EventType.TOUCH_START , this.onCardItemClick , this);
                }
            }else{
                let cardArr:Array<number> = Global.Utils.cloneArr(UserInfo.ins.myHandCardArr)
                let addIndex:number = 0;
                for(let i = 0 ; i < this.handItemArr.length ; i++){
                    if(this.handItemArr[i].isShow){
                         let value :number = cardArr[addIndex]
                        if(value){
                            this.handItemArr[i].showMajiongUp();
                            this.handItemArr[i].cardValue = value;
                        }
                        addIndex++;
                    }
                    this.handItemArr[i].node.on(cc.Node.EventType.TOUCH_START , this.onCardItemClick , this);
                }
            }
        }).start()
    }
    /**定缺结束**/
    showDingQueed(): void {
        Global.Utils.playSound("sound/5");
        super.showDingQueed();
        UserInfo.ins.sortHandByDingQueed();
        let cardArr:Array<number> = UserInfo.ins.myHandCardArr;
        let value:number=0;
        this.handItemArr.sort((a,b)=>a.node.x-b.node.x)
        for(let i = 0 ; i < this.handItemArr.length ; i++){
            value = cardArr[i]
            if(value && this.handItemArr[i].isShow){
                this.handItemArr[i].cardValue = value;
                this.handItemArr[i].isDice = Global.Utils.getIsDice(value , UserInfo.ins.myDiceType);
            }
        }
        if(GameInfo.ins.nowBookMakerSit == UserInfo.ins.mySitIndex){
            this.isShowAction();
        }
    }
    /***手牌点击*/
    private onCardItemClick(e:cc.Event){
        let item :MajiongHandCard = e.currentTarget.getComponent(MajiongHandCard);
        /***换三*/
        if(GameInfo.ins.nowGameStatus == PlayStauteEnum.ChangeThree){
            this.onChangeThreeClick(item);
            return;
        }
        /***常规出牌*/
        if(GameInfo.ins.nowGameStatus != PlayStauteEnum.PlayCard && GameInfo.ins.nowGameStatus != PlayStauteEnum.DrawNewCard){
			return;
		}
        if(item.isDice == false && this.haveDiceCard()){
			return;
		}
        if(item.isActionOver == false){
            return;
        }
        Global.Utils.playSound("sound/7");
        if(item.isSelect){
            item.isShow = false;
            this.showOutAction(item);
            Global.Utils.debugOutput("我出牌之后的手牌:"+UserInfo.ins.myHandCardArr);
			let msg : Msg_CS_DownMajMsg = new Msg_CS_DownMajMsg();
			msg.majID = item.cardValue;
			Global.mgr.socketMgr.send(-1,msg);
        }else{
            this.downHandCard();
            item.isSelect = true;
            this.showHupaiTishi(item.cardValue);
        }
    }
    /**展示胡牌*/
    showHupai(msg: Msg_SC_HuMajMsg): void {
        super.showHupai(msg);
    }
    /**展示胡牌提示*/
    private showHupaiTishi(cardValue : number){
        this.closeHupaiTips();
        if(UserInfo.ins.getTingByCardValue(cardValue)){
            Global.DialogManager.createDialog("tips/HuPaiTiShiTips/prefab/HuPaiTiShiTips" , UserInfo.ins.getTingByCardValue(cardValue) , (any,createDialog)=>{
                createDialog.x = 230;
                createDialog.y = 190;
                this.hupaiTips = createDialog.getComponent(HuPaiTiShiTips);
            } , this.node)
        }
    }
    public closeHupaiTips(){
        if(this.hupaiTips && this.hupaiTips.node && this.hupaiTips.node.parent){
            this.hupaiTips.disTory();
            this.hupaiTips = null;
        }
    }
    public closeOutTing(){
        for(let i = 0 ; i < this.handItemArr.length ; i++){
            if(this.handItemArr[i].isShow){
                this.handItemArr[i].isOutTing = false;
            }
        }
    }
    showOutCard(cardValue : number){
        if(UserInfo.ins.selfIsLookPlayer){
            this.createMyOutCard(cardValue);
            let movePoint:cc.Vec2 = cc.v2(this.lastOutCard.node.x , this.lastOutCard.node.y);
            let randomOne:number = this.handItemArr.length == 1 ? 0 : Math.floor(Math.random()*this.handItemArr.length);
            let outItem : MajiongHandCard = this.handItemArr[randomOne];
            outItem.isFeel = false;
            outItem.isShow = false;
            this.changeMoveMyHand(outItem);
            this.lastOutCard.node.x = outItem.node.x;
            this.lastOutCard.node.y = outItem.node.y;
            cc.tween(this.lastOutCard.node).to(TimeAndMoveManager.ins.otherOutCardToGroupTime , {x : movePoint.x, y : movePoint.y }).start();
        }
    }
    /***出牌动作*/
    private showOutAction(outItem :MajiongHandCard){
        this.createMyOutCard(outItem.cardValue);
        let movePoint:cc.Vec2 = cc.v2(this.lastOutCard.node.x , this.lastOutCard.node.y);
        this.lastOutCard.node.x = outItem.node.x;
        this.lastOutCard.node.y = outItem.node.y;
        cc.tween(this.lastOutCard.node).to(TimeAndMoveManager.ins.otherOutCardToGroupTime , {x : movePoint.x, y : movePoint.y }).call(()=>{
            this.changeMyMoveMyHand(outItem);
        }).start();
    }
    /****出牌之后移动手牌 */
    private changeMyMoveMyHand(outItem :MajiongHandCard){
        if(outItem.isFeel){
            return;
        }
        let inCard : MajiongHandCard = this.getInputCard();
        let outCardPoint : cc.Vec2 = cc.v2(outItem.node.x , 0);
        let inCardPoint:cc.Vec2 = this.getInPoint(inCard,outCardPoint);
        let tempItem:MajiongHandCard;
        let changeX:number = 0;
        if(inCardPoint.x == outCardPoint.x){
            //直接移动过去插入
            this.showMoveAction(inCardPoint,inCard)
        }else if(inCardPoint.x < outCardPoint.x){
            for(let i = 0 ; i < this.handItemArr.length ; i++){
                tempItem = this.handItemArr[i];
                if(tempItem.isShow){
                    if(tempItem.node.x >= inCardPoint.x && tempItem.node.x < outCardPoint.x){
                        changeX = tempItem.node.x + tempItem.cardSize._w
                        cc.tween(tempItem.node).to(TimeAndMoveManager.ins.outCardHandMoveTime , {x : changeX}).start();
                    }
                }
            }
            cc.tween(this.node).delay(TimeAndMoveManager.ins.outCardHandMoveTime + 0.1).call(()=>{
                this.showMoveAction(inCardPoint,inCard)
            }).start()
        }else if(inCardPoint.x > outCardPoint.x){
            for(let i = 0 ; i < this.handItemArr.length ; i++){
                tempItem = this.handItemArr[i];
                if(tempItem.isShow){// && tempItem.isFeel==false
                    if(tempItem.node.x > outCardPoint.x && tempItem.node.x <= inCardPoint.x){
                        changeX = tempItem.node.x - tempItem.cardSize._w
                        cc.tween(tempItem.node).to(TimeAndMoveManager.ins.outCardHandMoveTime , {x : changeX}).start();
                    }
                }
            }
            cc.tween(this.node).delay(TimeAndMoveManager.ins.outCardHandMoveTime+0.1).call(()=>{
                this.showMoveAction(inCardPoint,inCard)
            }).start()
        }
    }
    /***摸牌插入得移动动画*/
    private showMoveAction(targetPoint:cc.Vec2 , incard:MajiongHandCard){
        if(this.isAddToLast || (incard.node.x - targetPoint.x == incard.cardSize._w) || (incard.node.x - targetPoint.x == incard.cardSize._w + this.feelCardChange[this.bySelfPoint])){
            cc.tween(incard.node).to(TimeAndMoveManager.ins.outCardHandMoveTime , {x : targetPoint.x}).call(()=>{
                this.initMyHandsFeel();
            }).start();
        }else{
            let len : number = (incard.node.x - this.feelCardChange[this.bySelfPoint] - targetPoint.x)/incard.cardSize._w;
            cc.tween(incard.node).to(TimeAndMoveManager.ins.addCardMoveYTime , {y : 180}).call(()=>{
                cc.tween(incard.node).to(TimeAndMoveManager.ins.addCardRotationTime , {angle: 30}).call(()=>{
                    cc.tween(incard.node).to(TimeAndMoveManager.ins.outCardHandMoveTime*len , {x: targetPoint.x}).call(()=>{
                        cc.tween(incard.node).to(TimeAndMoveManager.ins.addCardRotationTime , {angle: 0}).call(()=>{
                            cc.tween(incard.node).to(TimeAndMoveManager.ins.addCardMoveYTime , {y : 0}).call(()=>{
                                this.initMyHandsFeel()
                            }).start();
                        }).start();
                    }).start();
                }).start();
            }).start();
        }
    }
    /***获取当前摸牌应该插入手牌中的那个位置*/
    private getInPoint(inCard:MajiongHandCard , outPoint:cc.Vec2):cc.Vec2{
        let newHand : Array<MajiongHandCard> = [];
        for(let i = 0 ; i < this.handItemArr.length ; i++){
            if(this.handItemArr[i].isShow){
                newHand.push(this.handItemArr[i]);
            }
        }
        let que : Array<MajiongHandCard> = [];
        let hand:Array<MajiongHandCard> = [];
        for(let i = 0 ; i < newHand.length ; i++){
            if(Global.Utils.getIsDice(newHand[i].cardValue , UserInfo.ins.myDiceType)){
                que.push(newHand[i])
            }else{
                hand.push(newHand[i]);
            }
        }
        hand.sort(Global.Utils.compareValue)
        que.sort(Global.Utils.compareValue)
        let all : Array<MajiongHandCard> = hand.concat(que);
        newHand = all;
        let tempItem:MajiongHandCard;
        let inPoint:cc.Vec2;
        for(let i = 0 ; i < newHand.length ; i++){
            tempItem = newHand[i];
            if(tempItem.cardValue == inCard.cardValue && tempItem.isFeel){
                if(i == 0){
                    return new cc.Vec2(CardHelpManager.ins.changePointByEat , 0);
                }else{
                    if(outPoint){
                        inPoint = new cc.Vec2(newHand[i-1].node.x , 0);
                        if(inPoint.x > outPoint.x){
                            return inPoint;
                        }else{
                            return new cc.Vec2(newHand[i-1].node.x + tempItem.cardSize._w , 0)
                        }
                    }else{
                        return new cc.Vec2(newHand[i-1].node.x + tempItem.cardSize._w , 0)
                    }
                }
            }
        }
    }
    /**初始化我手牌得状态*/
    private initMyHandsFeel(isSort:boolean=true){
        for(let i = 0 ; i < this.handItemArr.length ; i++){
            this.handItemArr[i].isFeel = false;
        }
        if(isSort){
            this.handItemArr.sort(Global.Utils.compareX)
        }
    }
    /***获取手牌中我摸得那一张*/
    private getInputCard():MajiongHandCard{
        for(let i = 0 ; i < this.handItemArr.length ; i++){
            if(this.handItemArr[i].isShow &&this.handItemArr[i].isFeel){
                return this.handItemArr[i];
            }
        }
    }
    /**放下上一张手牌*/
	private downHandCard(){
		for(let i = 0 ; i < this.handItemArr.length ; i++){
			this.handItemArr[i].isSelect = false;
		}
	}
    /**是否还有未打出的定缺牌*/
    private haveDiceCard():boolean{
        for(let i = 0 ; i < this.handItemArr.length ; i++){
			if(this.handItemArr[i].isShow && this.handItemArr[i].isDice){
				return true;		
			}
		}
        return false;
    }
    private createMyOutCard(value:number = 1): void {
        let item : MajiongOutCard = cc.instantiate(this.dialogParameters[1]).getComponent(MajiongOutCard);
        item.bySelfPoint = this.bySelfPoint;
        item.cardValue = value;
        let row:number = this.getOutRow();
        let baseNum:number = 0;
        if(row > 0){
            baseNum = this.myOutArray.length - this.getBaseNum();
        }else{
            baseNum = this.myOutArray.length;
        }
        let changeX:number = baseNum * CardHelpManager.ins.outCardWidth[0];
        let changeY:number = row*70;
        let initX:number = CardHelpManager.ins.myOutCardInitPoint.x - CardHelpManager.ins.myHandCardInitPoint.x;
        let initY:number = CardHelpManager.ins.myOutCardInitPoint.y - CardHelpManager.ins.myHandCardInitPoint.y;
        initX = initX - row*CardHelpManager.ins.outCardWidth[0];
        item.node.x = initX + changeX;
        item.node.y = initY - changeY;
        this.onMyOutChangeData(item);
        this.node.addChild(item.node);
        this.lastOutCard = item;
    }
    /**展示碰杠*/
    showPengGang(msg: Msg_SC_PengMajMsg): void {
        super.showPengGang(msg);
        let eatType : EatCardEnum = Global.Utils.getOutType(msg.isGang , msg.fromSiteNum , msg.pengSiteNum , this.isHaveEat(msg.isGang , msg.majID) , this.haveEatType(msg.isGang , msg.majID));
        let eatDat : PengGangData = new PengGangData();
        eatDat.cardValue = msg.majID;
        eatDat.eatType = eatType;
        eatDat.havePointBySelf = this.bySelfPoint;
        if(eatType == EatCardEnum.CrossAllUp || eatType == EatCardEnum.CrossAllDown || eatType == EatCardEnum.CrossAllOpp){
            UserInfo.ins.changePenggang(eatDat);
			this.changCreateSelfEat(msg.majID,eatType,eatDat);
		}else{
            UserInfo.ins.myPengGang.push(eatDat);
			this.onCreateSelfEat(msg.majID , eatType,eatDat);
		}
        this.createNewSelfFeel(msg)
    }
    private createNewSelfFeel(msg: Msg_SC_PengMajMsg){

    }   
    /**展示暗杠*/
    showSelfGang(msg:Msg_SC_GangSelfMsg){
        super.showSelfGang(msg);
        let eatType : EatCardEnum = Global.Utils.getOutType(1 , msg.pengSiteNum , msg.pengSiteNum , this.isHaveEat(1 , msg.majID) , this.haveEatType(1 , msg.majID));
        let eatDat : PengGangData = new PengGangData();
        eatDat.cardValue = msg.majID;
        eatDat.eatType = eatType;
        eatDat.havePointBySelf = this.bySelfPoint;
        if(msg.isPapo == 0){
			this.onCreateSelfEat(msg.majID , EatCardEnum.CrossSelf , eatDat);
		}else{
			this.changCreateSelfEat(msg.majID,this.haveEatType(1 , msg.majID) , eatDat);
		}
    }
    /**补杠*/
    private changCreateSelfEat(card : number , eatType : EatCardEnum , eatData : PengGangData){
        if(UserInfo.ins.selfIsLookPlayer){
            return;
        }
        this.removeMyPengGang(card , eatType , eatData , (eatData)=>{
            this.changeEatSelfHand(eatData);
        },true)
    }
    /**生成碰杠*/
    private onCreateSelfEat(cardValue : number , eatType : EatCardEnum , eatData : PengGangData){
        if(UserInfo.ins.selfIsLookPlayer){
            return;
        }
        this.removeMyPengGang(cardValue , eatType ,eatData, (eatData)=>{
            this.changeHand(eatData);
        })
    }
    private changeEatSelfHand(eatData : PengGangData){
        let item : MajiongEatItem;
        let outItem : MajiongHandCard;
        for(let i = 0 ; i < this.handItemArr.length ; i++){
            if(this.handItemArr[i].cardValue == eatData.cardValue){
                outItem = this.handItemArr[i];
                this.handItemArr[i].isShow = false;
            }
        }
        for(let i = 0 ; i < this.myPenggangArr.length ; i++){
            if(this.myPenggangArr[i].eatData.cardValue == eatData.cardValue){
                item = this.myPenggangArr[i];
                item.setNewData(eatData.eatType);
            }
        }
        this.changeMyHandByEat(eatData);
    }
    private changeHand(eatData : PengGangData){
        let item : MajiongEatItem;
        for(let i = 0 ; i < this.myPenggangArr.length ; i++){
            if(this.myPenggangArr[i].eatData.cardValue == eatData.cardValue){
                item = this.myPenggangArr[i];
                item.setNewData(eatData.eatType);
            }
        }
        if(!item){
            item = cc.instantiate(this.majiongEatPrefab).getComponent(MajiongEatItem)
            item.eatData = eatData;
            this.myPenggangArr.push(item);
            item.setPoint(this.myPenggangArr.length);
        }
        
        let changeX : number = item.size.x + item.eatSplc[eatData.havePointBySelf];
        CardHelpManager.ins.changePointByEat += changeX;
        this.changeMyHandByEat(eatData)
        // let moveX:number=changeX;
        // for(let i = 0 ; i < this.handItemArr.length ; i++){
        //     moveItem = this.handItemArr[i];
        //     if(moveItem.isShow){
        //         moveX = changeX + moveItem.node.x;
        //         if(moveItem.isFeel && eatData.eatType >= EatCardEnum.CrossOpposite){
        //             moveX -= this.feelCardChange[this.bySelfPoint];
        //             moveItem.isFeel = false;
        //         }
        //         cc.tween(moveItem.node).to(TimeAndMoveManager.ins.outCardHandMoveTime , {x : moveX}).call(()=>{
        //         }).start();
        //     }
        // }
        cc.tween(this.node).delay(TimeAndMoveManager.ins.outCardHandMoveTime ).call(()=>{
            this.node.addChild(item.node);
        }).start();
    }
    private changeMyHandByEat(eatData:PengGangData){
        let moveItem : MajiongHandCard;
        for(let i = 0 ; i < this.handItemArr.length ; i++){
            this.handItemArr[i].isShow = false;
        }
        for(let i = 0 ; i < UserInfo.ins.myHandCardArr.length ; i++){
            moveItem = this.handItemArr[i];
            moveItem.cardValue = UserInfo.ins.myHandCardArr[i];
            moveItem.isShow = true;
            moveItem.node.x = CardHelpManager.ins.changePointByEat + i*moveItem.cardSize._w
        }
        if(eatData.eatType < EatCardEnum.CrossOpposite){
            this.getSelfLastHand().node.x += this.feelCardChange[this.bySelfPoint];
            this.getSelfLastHand().isFeel = true;
        }
    }
    /**移除碰杠*/
    private removeMyPengGang(card : number , type : EatCardEnum,eatData : PengGangData, fun:Function , isChange : boolean = false){
        let removeNum:number = this.getRemoveNum(type);
        let removeArr:Array<number> = [];
        let removeX : number = 0;
		if(removeNum){
			for(let i = 0 ; i < this.handItemArr.length ; i++){
				if(this.handItemArr[i].cardValue == card && removeArr.length < removeNum){
					this.handItemArr[i].isShow = false;
                    if(removeX == 0){
                        removeX = this.handItemArr[i].node.x;
                    }else{
                        removeX = removeX > this.handItemArr[i].node.x ? removeX : this.handItemArr[i].node.x;
                    }
					removeArr.push(i);
				}
			}
		}
        for(let i = 0 ; i < removeArr.length ; i++){
            UserInfo.ins.spliceCardByMyHand(this.handItemArr[removeArr[i]].cardValue);
        }

        this.initMyHandsFeel();
        fun(eatData);
    }
	// private removeMyPengGang(card : number , type : EatCardEnum,eatData : PengGangData, fun:Function , isChange : boolean = false){
	// 	let removeNum:number = this.getRemoveNum(type);
    //     let removeArr:Array<number> = [];
    //     let removeX : number = 0;
	// 	if(removeNum){
	// 		for(let i = 0 ; i < this.handItemArr.length ; i++){
	// 			if(this.handItemArr[i].cardValue == card && removeArr.length < removeNum){
	// 				this.handItemArr[i].isShow = false;
    //                 if(removeX == 0){
    //                     removeX = this.handItemArr[i].node.x;
    //                 }else{
    //                     removeX = removeX > this.handItemArr[i].node.x ? removeX : this.handItemArr[i].node.x;
    //                 }
	// 				removeArr.push(i);
	// 			}
	// 		}
	// 	}
    //     for(let i = 0 ; i < removeArr.length ; i++){
    //         UserInfo.ins.spliceCardByMyHand(this.handItemArr[removeArr[i]].cardValue);
    //     }
    //     if(isChange){
    //         let changeItem : MajiongHandCard;
    //         for(let i = 0 ; i < this.handItemArr.length ; i++){
    //             if(this.handItemArr[i].isShow && this.handItemArr[i].cardValue == card){
    //                 changeItem = this.handItemArr[i];
    //             }
    //         }
    //         UserInfo.ins.spliceCardByMyHand(changeItem.cardValue);
    //         changeItem.isFeel = false;
    //         changeItem.isShow = false;
    //         if(!changeItem.isFeel){
    //             let item : MajiongHandCard;
    //             let changeX:number = 0;
    //             for(let i = 0 ; i < this.handItemArr.length ; i++){
    //                 item = this.handItemArr[i];
    //                 if(item.isShow && item.node.x > changeItem.node.x){
    //                     changeX = item.node.x - item.cardSize._w;
    //                     if(item.isFeel){
    //                         changeX -= this.feelCardChange[this.bySelfPoint];
    //                     }
    //                     cc.tween(item.node).to(TimeAndMoveManager.ins.outCardHandMoveTime , {x : changeX}).call(()=>{
    //                         fun(eatData);
    //                     }).start();
    //                 }
    //             }
    //         }else{
    //             fun(eatData);
    //         }
    //     }else{
    //         let item : MajiongHandCard;
    //         let changeX : number = 0;
    //         if(type != EatCardEnum.CrossSelf){
    //             for(let i = 0 ; i < this.handItemArr.length ; i++){
    //                 item = this.handItemArr[i];
    //                 if(item.isShow && item.node.x > removeX){
    //                     changeX = item.node.x - removeArr.length*item.cardSize._w;
    //                     cc.tween(item.node).to(TimeAndMoveManager.ins.outCardHandMoveTime*removeArr.length , {x : changeX}).start();
    //                 }
    //             }
    //         }else{
    //             let inCard = this.getInputCard()
    //             let inCardPoint:cc.Vec2 = this.getInPoint(inCard , null);
    //             for(let i = 0 ; i < this.handItemArr.length ; i++){
    //                 item = this.handItemArr[i];
    //                 if(item.isShow && item.node.x >= inCardPoint.x && item.isFeel==false){
    //                     changeX = item.node.x + item.cardSize._w;
    //                     cc.tween(item.node).to(TimeAndMoveManager.ins.outCardHandMoveTime , {x : changeX}).start();
    //                 }
    //             }
    //             cc.tween(inCard.node).to(TimeAndMoveManager.ins.outCardHandMoveTime , {x : inCardPoint.x}).start();
    //             this.initMyHandsFeel();
    //             cc.tween(this.node).delay(TimeAndMoveManager.ins.outCardHandMoveTime+0.2).call(()=>{
    //                 for(let i = 0 ; i < this.handItemArr.length ; i++){
    //                     item = this.handItemArr[i];
    //                     if(item.isShow && item.node.x > removeX){
    //                         changeX = item.node.x - removeArr.length*item.cardSize._w;
    //                         cc.tween(item.node).to(TimeAndMoveManager.ins.outCardHandMoveTime , {x : changeX}).start();
    //                     }
    //                 }
    //             }).start();
    //         }
    //         let time:number = type != EatCardEnum.CrossSelf ? TimeAndMoveManager.ins.outCardHandMoveTime : TimeAndMoveManager.ins.outCardHandMoveTime + 0.3
    //         cc.tween(this.node).delay(time).call(()=>{
    //             let item:MajiongHandCard = this.getSelfLastHand();
    //             if(type < EatCardEnum.CrossOpposite ){
    //                 item.isFeel = true;
    //                 let changeX : number = item.node.x + this.feelCardChange[this.bySelfPoint];
    //                 cc.tween(item.node).to(TimeAndMoveManager.ins.addCardMoveYTime , {x : changeX}).call(()=>{
    //                     fun(eatData);
    //                 }).start();
    //             }else{
    //                 fun(eatData);
    //             }
    //         }).start();
    //     }
	// }
    public getSelfLastHand():MajiongHandCard{
        let lastX:number = 0;
        let lastItem : MajiongHandCard;
        for(let i = 0 ; i < this.handItemArr.length ; i++){
            if(this.handItemArr[i].isShow && this.handItemArr[i].node.x > lastX){
                lastX = this.handItemArr[i].node.x;
                lastItem = this.handItemArr[i];
            }
        }
        return lastItem;
    }

//--------------------------------------------------------------换三----------------------------------------------------------------

    private changeThreeTips : ChangeThreeTips;
    private changeThreeCard : Array<MajiongHandCard>=[];
	private changeCardArr:Array<number> = [];
    /**服务器通知换三张*/
    private onChangeThree(e, msg:Msg_SC_StartChange3){
        cc.tween(this.node).delay(TimeAndMoveManager.ins.finishHandTime + TimeAndMoveManager.ins.getWallTime).call(()=>{
            if(this.changeThreeTips){
                this.changeThreeTips.disTory();
            }
            this.changeThreeTips = cc.instantiate(Global.Utils.getPreFabBySource("changeThree/prefab/ChangeThreeTips")).getComponent(ChangeThreeTips);
            this.node.addChild(this.changeThreeTips.node);
            this.changeThreeTips.node.x = 0;
            this.changeThreeTips.node.y = 185;

            let cardLightDic : Array<MajCardLight> =  CardHelpManager.ins.getThreeCard(this.handItemArr);
            this.changeCardArr = CardHelpManager.ins.getSmallThree(cardLightDic,this.handItemArr);
            this.showSelect();
        }).start()
    }
    /***默认推荐*/
	private showSelect(){
        let nowValue:number;
        let nowCard : MajiongHandCard;
		for(let i = 0 ; i < this.changeCardArr.length ; i++){
            nowValue = this.changeCardArr[i];
			for(let l = 0 ; l < this.handItemArr.length ; l++){
                nowCard = this.handItemArr[l];
                if(nowCard.isShow && nowCard.cardValue == nowValue && nowCard.isSelect == false){
                    nowCard.isSelect = true;
                    this.changeThreeCard.push(nowCard);
                    break;
                }
			}
		}
		this.changeThreeTips.setBtnEnabled(this.changeThreeCard.length == 3);
	}
    /***选中了3张牌并点击交换按钮时候*/
    private onSelect3Majiong(){
        let arr:Array<number> = [];
		for(let i = 0 ; i < this.changeThreeCard.length ; i++){
			arr.push(this.changeThreeCard[i].cardValue);
		}
		if(arr.length != 3){
			return;
		}
		this.changeThreeTips.disTory();
        this.changeThreeTips = null;
		let msg:Msg_CS_Change3Maj = new Msg_CS_Change3Maj();
		msg.lstMajID = arr;
		Global.mgr.socketMgr.send(-1,msg);

        let nowCard:MajiongHandCard;
        let nowValue:number;
		for(let l = 0 ; l < this.changeThreeCard.length ; l++){
            nowValue = this.changeThreeCard[l].cardValue;
			for(let i = 0 ; i < this.handItemArr.length ; i++){
                nowCard = this.handItemArr[i];
				if(nowCard.cardValue == nowValue && nowCard.isSelect && nowCard.isShow){
                    nowCard.isSelect = false;
                    nowCard.isShow = false;
                    UserInfo.ins.spliceCardByMyHand(nowValue);
					break;
				}
			}
		}
        let pointX:number=0;
        let setIndex:number=0;
        for(let i = 0 ; i < this.handItemArr.length ; i++){
            nowCard = this.handItemArr[i];
            if(nowCard.isShow){
                pointX = setIndex*nowCard.cardSize._w;
                let changeCount:number = (nowCard.node.x - pointX)/nowCard.cardSize._w; 
                cc.tween(nowCard.node).to(TimeAndMoveManager.ins.outCardHandMoveTime*changeCount , {x : pointX}).start();
                setIndex++;
            }
        }
        cc.tween(this.node).delay(TimeAndMoveManager.ins.outCardHandMoveTime + 0.1).call(()=>{
            if(UserInfo.ins.mySitIndex == GameInfo.ins.nowBookMakerSit){
                this.getInputCard().node.x += this.feelCardChange[this.bySelfPoint];
            }
        }).start();
    }
    /***换三时候任意手牌点击*/
    private onChangeThreeClick( handCard : MajiongHandCard){
        if(handCard.isSelect){
            handCard.node.y = 0 ;
            handCard.isSelect = false;
			this.changeThreeCard.splice(this.changeThreeCard.indexOf(handCard) , 1);

			this.changeThreeTips.setBtnEnabled(this.changeThreeCard.length == 3);
        }else{
			let count:number  = Math.floor(handCard.cardValue/10);
			if(this.changeThreeCard.length == 0){
                this.changeThreeCard.push(handCard);
                handCard.isSelect = true;
			}else{
                if(Math.floor(this.changeThreeCard[0].cardValue/10) == count){
                    this.changeThreeCard.push(handCard);
                    handCard.isSelect = true;
                    if(this.changeThreeCard.length > 3){
                        this.changeThreeCard[0].isSelect = false;
                        this.changeThreeCard.splice(0,1);
                    }
                }else{
                    for(let i = 0 ; i < this.changeThreeCard.length ; i++){
                        this.changeThreeCard[i].isSelect = false;
                    }
                    this.changeThreeCard = [];
                    this.changeThreeCard.push(handCard);
                    handCard.isSelect = true;
                }
			}
			this.changeThreeTips.setBtnEnabled(this.changeThreeCard.length == 3);
		}
    }
    
    showOnChangeThree(msg: Msg_SC_Change3Maj): void {
        super.showOnChangeThree(msg);
    }

	showGetChangeThree(msg:Msg_SC_You3Maj){
        let addArr:Array<number> = Global.Utils.cloneArr(msg.lstMajID);
        for(let i = 0 ; i < msg.lstMajID.length ; i++){
            UserInfo.ins.addNewCardToMyHand(msg.lstMajID[i]);
        }
        addArr.sort(Global.Utils.compare);
        let nowCard:MajiongHandCard;
        let bigCount:number=0;
        let pointArr:Array<cc.Vec2> = [];
        let nowCardArr:Array<MajiongHandCard> = [];
        for(let i = this.handItemArr.length-1 ; i >= 0  ; i--){
            nowCard = this.handItemArr[i];
            if(nowCard.isShow == false){
                continue;
            }
            bigCount = this.getBigNum(nowCard.cardValue , addArr);
            if(bigCount > 0){
                for(let n = 0 ; n < pointArr.length ; n++){
                    pointArr[n].x += bigCount*nowCard.cardSize._w;
                }
                let pointCard:MajiongHandCard;
                for(let n = 0 ; n < nowCardArr.length ; n++){
                    pointCard = nowCardArr[n];
                    pointCard.setNewPoint(pointCard.getNewPoint().x + pointCard.cardSize._w*bigCount , pointCard.getNewPoint().y);
                    pointCard.changeCount++;
                }
            }
            for(let n = 0 ; n < bigCount ; n++){
                pointArr.push(cc.v2(nowCard.node.x + (n+1)*nowCard.cardSize._w , 50));
                addArr.splice(addArr.length-1 , 1);
            }
            nowCardArr.push(nowCard);
            nowCard.setNewPoint(nowCard.node.x , nowCard.node.y);
        }
        
        let pointCard:MajiongHandCard;
        for(let n = 0 ; n < pointArr.length ; n++){
            pointArr[n].x += addArr.length*nowCard.cardSize._w;
        }
        for(let n = 0 ; n < nowCardArr.length ; n++){
            pointCard = nowCardArr[n];
            pointCard.setNewPoint(pointCard.getNewPoint().x + pointCard.cardSize._w*addArr.length , pointCard.getNewPoint().y);
            pointCard.changeCount+=addArr.length;
        }
        for(let n = 0 ; n < addArr.length ; n++){
            pointArr.push(cc.v2(n*nowCard.cardSize._w , 50));
        }
        addArr = [];

        for(let i = 0 ; i < this.handItemArr.length ; i++){
            if(this.handItemArr[i].isShow){
                cc.tween(this.handItemArr[i].node).to(TimeAndMoveManager.ins.outCardHandMoveTime*this.handItemArr[i].changeCount , {x : this.handItemArr[i].getNewPoint().x}).call(()=>{
                    
                }).start();
            }
        }
        cc.tween(this.node).delay(TimeAndMoveManager.ins.outCardHandMoveTime+0.1).call(()=>{
            this.showAddThree(msg.lstMajID , pointArr);
        }).start();
    }
    private showAddThree(addArr:Array<number> , pointArr:Array<cc.Vec2>){
        addArr.sort(Global.Utils.compare);
        pointArr.sort(Global.Utils.compareV2);
        for(let i = 0 ; i < addArr.length ; i++){
            let newHand : MajiongHandCard = this.getMyNewHand();
            newHand.node.x = pointArr[i].x;
            newHand.node.y = pointArr[i].y;
            newHand.cardValue = addArr[i];
            newHand.isDice = Global.Utils.getIsDice(addArr[i] , UserInfo.ins.myDiceType);
            newHand.isShow = true;
            cc.tween(newHand.node).to(TimeAndMoveManager.ins.ChangeThreeMoveYTime, {y : 0}).call(()=>{
                newHand.isSelect = false;
                if(UserInfo.ins.mySitIndex == GameInfo.ins.nowBookMakerSit){
                    this.initMyHandsFeel();
                    let feelCard:MajiongHandCard = this.getMyLastHand();
                    feelCard.node.x += this.feelCardChange[this.bySelfPoint]/3;
                    feelCard.isFeel = true;
                }
            }).start();
        }
    }
    private getBigNum(value : number , arr:Array<number>):number{
        let bigNum:number = 0;
        for(let i = 0 ; i< arr.length ; i++){
            if(value <= arr[i]){
                bigNum++;
            }
        }
        return bigNum;
    }



    disTory(): void {
        super.disTory();
    }
}
