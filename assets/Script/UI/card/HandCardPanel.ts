// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CardGroupPointBySelfEnum, EatCardEnum, PlayHintImageType } from "../../enum/EnumManager";
import GameInfo from "../../Game/info/GameInfo";
import UserInfo from "../../Game/info/UserInfo";
import TimeAndMoveManager from "../../mgr/TimeAndMoveManager";
import { Msg_SC_Change3Maj, Msg_SC_GangSelfMsg, Msg_SC_HuMajMsg, Msg_SC_PengMajMsg } from "../../proto/TableMsg";
import { Global } from "../../Shared/GloBal";
import Utils from "../../Shared/Utils";
import UIBase from "../../UIBase";
import { PengGangData, SelectHandCardData } from "../../utils/InterfaceHelp";
import MajiongEatItem from "./MajiongEatItem";
import MajiongHandCard from "./MajiongHandCard";
import MajiongOutCard from "./MajiongOutCard";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HandCardPanel extends UIBase {
    @property (cc.Sprite)
    actionImage : cc.Sprite = null;
    
	protected huCard : MajiongOutCard;

    /**当前牌组属于那个位置*/
    private _sitIndex: number = 0;
    public get sitIndex(): number {
        return this._sitIndex;
    }
    public set sitIndex(value: number) {
        this._sitIndex = value;
    }
    /***摸牌得距离间隔*/
    public feelCardChange: Array<number> = [50 , 22 , 50 , 22];

    /***当前牌组相对于第一视角属于那个位置*/
    private _bySelfPoint: CardGroupPointBySelfEnum = CardGroupPointBySelfEnum.Self;
    public get bySelfPoint(): CardGroupPointBySelfEnum {
        return this._bySelfPoint;
    }
    public set bySelfPoint(value: CardGroupPointBySelfEnum) {
        this._bySelfPoint = value;
    }
    /**当前所有玩家出牌*/
    private _allPlayerOut: Array<MajiongOutCard> = [];
    public get allPlayerOut(): Array<MajiongOutCard> {
        return this._allPlayerOut;
    }
    public set allPlayerOut(value: Array<MajiongOutCard>) {
        this._allPlayerOut = value;
    }

    /**当前我自己的出牌*/
    private _myOutArray: Array<MajiongOutCard> = [];
    public get myOutArray(): Array<MajiongOutCard> {
        return this._myOutArray;
    }
    public set myOutArray(value: Array<MajiongOutCard>) {
        this._myOutArray = value;
    }

    /***我得碰杠牌数据*/
    private _myPenggangArr: Array<MajiongEatItem> = [];
    public get myPenggangArr(): Array<MajiongEatItem> {
        return this._myPenggangArr;
    }
    public set myPenggangArr(value: Array<MajiongEatItem>) {
        this._myPenggangArr = value;
    }

    /**手牌数组*/
    private _handItemArr: Array<MajiongHandCard> = [];
    public get handItemArr(): Array<MajiongHandCard> {
        return this._handItemArr;
    }
    public set handItemArr(value: Array<MajiongHandCard>) {
        this._handItemArr = value;
    }

    /**出牌布局*/
    public outCardRowArr:Array<number> = [5,7,9,11];

    /**碰杠组*/
    public majiongEatPrefab : cc.Prefab = null;
    protected onLoad(): void {
        if(this.majiongEatPrefab == null){
            this.majiongEatPrefab = Global.Utils.getPreFabBySource("majiongCard/prefab/MajiongEatItem");
        }
        this.actionImage.node.active = false;
    }

    /***我的手牌数量*/
    private _myHandLen: number = 0;
    public get myHandLen(): number {
        return this._myHandLen;
    }
    public set myHandLen(value: number) {
        this._myHandLen = value;
    }

    public clearHandItemArr(){
        for(let i = 0 ; i < this.handItemArr.length ; i++){
            this.handItemArr[i].disTory();
        }
        this.handItemArr = [];
    }
    /**我的最后一张出牌*/
    private _lastOutCard: MajiongOutCard;
    public get lastOutCard(): MajiongOutCard {
        return this._lastOutCard;
    }
    public set lastOutCard(value: MajiongOutCard) {
        this._lastOutCard = value;
    }
    /***碰杠胡图片动画是否进行中*/
    private isAction:boolean = false;
    /***初始化手牌*/
    initHandData(){
        this.clearHandItemArr();
        if(UserInfo.ins.selfIsLookPlayer){
            this.bySelfPoint = CardGroupPointBySelfEnum.Self;
        }
    }

    private changeThreeArr:Array<MajiongHandCard> = [];
    /**
     * 展示换三状态
     * **/
     showOnChangeThree(msg:Msg_SC_Change3Maj){
        this.changeThreeArr = [];
        if(this.bySelfPoint>0){
            let hand:MajiongHandCard;
            for(let i = 0 ; i < 3 ; i++){
                hand = this.getLastHand();
                hand.isShow = false;
                this.changeThreeArr.push(hand);
            }
        }
     }
    showEndChangeThree(){
        if(this.bySelfPoint > 0){
            for(let i = 0 ; i < this.changeThreeArr.length ; i++){
                this.changeThreeArr[i].isShow = true;
            }
        }
     }
     /***展示手牌选中*/
     showHandCardSelect(data:SelectHandCardData){
        let outCard:MajiongOutCard;
        for(let i = 0 ; i < this.myOutArray.length ; i++){
            outCard = this.myOutArray[i];
            if(outCard.cardValue == data.cardValue){
                outCard.showSelectImage(data.isSelect);
            }
        }
        for(let i = 0 ; i < this.myPenggangArr.length ; i++){
            if(this.myPenggangArr[i].eatData.cardValue == data.cardValue){
                this.myPenggangArr[i].showSelectHandCard(data);
            }
        }
     }
    /***展示摸牌获取手牌*/
    showGetHnads(getNum:number){
        this.myHandLen+=getNum;
    }
    /***展示摸一张新牌*/ 
    showFeelWall(cardValue : number = null){
        this.myHandLen++;
        let newHand : MajiongHandCard = this.getNewHand();
        let lastHand : MajiongHandCard = this.getLastHand();
        switch(this.bySelfPoint){
            case 0:
                if(UserInfo.ins.selfIsLookPlayer){
                    newHand.node.x = lastHand.node.x + lastHand.cardSize._w + this.feelCardChange[this.bySelfPoint];
                    newHand.node.y = 0;
                    newHand.isFeel = true;
                    newHand.isShow = true;
                }
            break;
            case 1:
                newHand.node.x = lastHand.node.x - 2;
                newHand.node.y = lastHand.node.y + 38 + this.feelCardChange[this.bySelfPoint];
                newHand.isFeel = true;
                newHand.isShow = true;
                this.handItemArr.sort(Global.Utils.compareY);
                for(let i = 0 ; i < this.handItemArr.length ; i++){
                    this.handItemArr[i].node.zIndex = i;
                }
                break;
            case 2:
                newHand.node.x = lastHand.node.x - lastHand.cardSize._w - this.feelCardChange[this.bySelfPoint];
                newHand.node.y = 0;
                newHand.isFeel = true;
                newHand.isShow = true;
                break;
            case 3:
                newHand.node.x = lastHand.node.x - 2;
                newHand.node.y = lastHand.node.y - 38 - this.feelCardChange[this.bySelfPoint];
                newHand.isFeel = true;
                newHand.isShow = true;
                this.handItemArr.sort(Global.Utils.compareY);
                for(let i = 0 ; i < this.handItemArr.length ; i++){
                    this.handItemArr[i].node.zIndex = i;
                }
                break;
        }
    }
    /**get last by point 0*/
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
    /***获取当前展示得最后一张手牌,根据位置不同,最后一张手牌也不同*/
    protected getLastHand():MajiongHandCard{
        let lastHand : MajiongHandCard = null;
        let tempHand : MajiongHandCard ;
        for(let i = 0 ; i < this.handItemArr.length ; i++){
            tempHand = this.handItemArr[i];
            if(tempHand.isShow){
                if(lastHand == null){
                    lastHand = tempHand
                }else{
                    if(this.bySelfPoint == 0){
                        if(UserInfo.ins.selfIsLookPlayer){
                            if(tempHand.node.x > lastHand.node.x){
                                lastHand = tempHand;
                            }
                        }
                    }else  if(this.bySelfPoint == 1){
                        if(tempHand.node.y > lastHand.node.y){
                            lastHand = tempHand;
                        }
                    }else if(this.bySelfPoint == 2){
                        if(tempHand.node.x < lastHand.node.x){
                            lastHand = tempHand;
                        }
                    }else if(this.bySelfPoint == 3){
                        if(tempHand.node.y < lastHand.node.y){
                            lastHand = tempHand;
                        }
                    }
                }
            }
        }
        if(this.bySelfPoint || UserInfo.ins.selfIsLookPlayer){
            return lastHand;
        }
    }
    /***获取一张藏起来得手牌*/
    protected getNewHand():MajiongHandCard{
        for(let i = 0 ; i < this.handItemArr.length ; i++){
            if(this.handItemArr[i].isShow == false){
                return this.handItemArr[i];
            }
        }
    }
    /***展示定缺结束*/
    showDingQueed(){
        
    }
    /**展示出牌*/
    showOutCard(value:number){
        this.createOutCard(value);
        this.myHandLen--;
        let movePoint:cc.Vec2 = cc.v2(this.lastOutCard.node.x , this.lastOutCard.node.y);
        let outItem : MajiongHandCard ;
        while(true){
            let mathOne:number = Math.floor(Math.random()*this.handItemArr.length);
            if(this.handItemArr[mathOne].isShow){
                outItem = this.handItemArr[mathOne];
                outItem.isFeel = false;
                outItem.isShow = false;
                this.changeMoveMyHand(outItem);
                this.lastOutCard.node.x = outItem.node.x;
                this.lastOutCard.node.y = outItem.node.y;
                cc.tween(this.lastOutCard.node).to(TimeAndMoveManager.ins.otherOutCardToGroupTime , {x : movePoint.x, y : movePoint.y }).start();
                return;
            }
        }
    }
    /**创建一张出牌*/
    createOutCard(value:number){
        
    }
    /***出牌移动*/
    changeMoveMyHand(outItem : MajiongHandCard){
        let handItem:MajiongHandCard;
        let changePoint:cc.Vec2 = cc.v2(0,0);
        this.handItemArr.sort(Global.Utils.compareY)
        for(let i = 0 ; i < this.handItemArr.length ; i++){
            handItem = this.handItemArr[i];
            if(handItem.isShow){
                changePoint = this.getChangePoint(handItem , outItem,this.handItemArr.length);
                if(this.bySelfPoint == 2){
                    if(changePoint){
                        if(handItem.node.x < outItem.node.x){
                            cc.tween(handItem.node).to(TimeAndMoveManager.ins.outCardHandMoveTime , {x : changePoint.x , y: changePoint.y }).call(()=>{
                                for(let i = 0 ; i < this.handItemArr.length ; i++){
                                    this.handItemArr[i].isFeel = false;
                                }
                            }).start()
                        }
                    }
                }else{
                    if(changePoint){
                        cc.tween(handItem.node).to(TimeAndMoveManager.ins.outCardHandMoveTime, {x : changePoint.x , y: changePoint.y }).call(()=>{
                            for(let i = 0 ; i < this.handItemArr.length ; i++){
                                this.handItemArr[i].isFeel = false;
                            }
                        }).start()
                    }
                }
            }
        }
    }
    /***获取出牌位置偏移*/
    getChangePoint(handItem:MajiongHandCard , outItem:MajiongHandCard , len:number):cc.Vec2{
        let point:cc.Vec2 = cc.v2(0,0);
        if(this.bySelfPoint == 0 ){
            if(UserInfo.ins.selfIsLookPlayer){
                if(handItem.node.x > outItem.node.x){
                    point.x = handItem.node.x - handItem.cardSize._w;
                    point.y = handItem.node.y;
                    if(handItem.isFeel){
                        point.x -= this.feelCardChange[this.bySelfPoint]
                    }
                    return point;
                }
            }
        } else if(this.bySelfPoint == 1){
            if(len == 1){
                point.x = handItem.node.x;
                point.y = handItem.node.y;
                return point;
            }
            if(handItem.node.y > outItem.node.y){
                point.x = handItem.node.x + 2;
                point.y = handItem.node.y - 38;
                if(handItem.isFeel){
                    point.y -= (this.feelCardChange[this.bySelfPoint])
                }
                return point;
            }else{
                point.x = handItem.node.x// - 2;
                point.y = handItem.node.y// + 38;
                if(handItem.isFeel){
                    point.y += (this.feelCardChange[this.bySelfPoint])
                }
                return point;
            }
        }else if(this.bySelfPoint == 2){
            if(handItem.node.x < outItem.node.x){
                point.x = handItem.node.x + handItem.cardSize._w;
                point.y = handItem.node.y;
                if(handItem.isFeel){
                    point.x += this.feelCardChange[this.bySelfPoint]
                }
                return point;
            }
        }else if(this.bySelfPoint == 3){
            if(len == 1){
                point.x = handItem.node.x;
                point.y = handItem.node.y;
                return point;
            }
            if(handItem.node.y < outItem.node.y){
                point.x = handItem.node.x + 3;
                point.y = handItem.node.y + 38;
                if(handItem.isFeel){
                    point.y += (this.feelCardChange[this.bySelfPoint])
                }
                return point;
            }else{
                point.x = handItem.node.x;
                point.y = handItem.node.y;
                if(handItem.isFeel){
                    point.y -= (this.feelCardChange[this.bySelfPoint])
                }
                return point;
            }
        }
        return null;
    }
    /**获取当前处在第几列*/
    getOutRow():number{
        let len:number = this.myOutArray.length;
        if(len < 5){
            return 0;
        }
        if(len < 12){
            return 1;
        }
        if(len < 21){
            return 2;
        }
        return 3;
    }
    /**获取基础偏移基数*/
    getBaseNum():number{
        let num:number = 0;
        for(let i = 0 ; i < this.getOutRow() ; i++){
            num += this.outCardRowArr[i];
        }
        return num;
    }

    /**获取我有多少牌是在展示得*/
    getMyShowNum():number{
        let index : number = 0 ;
        for(let i = 0 ; i < this.handItemArr.length ; i++){
            if(this.handItemArr[i].isShow){
                index++;
            }
        }
        return index;
    }
    /**我出了一张牌
     * 这时候需要添加一张到数据中
    */
    onMyOutChangeData(maj:MajiongOutCard){
        this.allPlayerOut.push(maj);
        this.myOutArray.push(maj);
    }
    /***当我出牌被别人碰杠胡时候，
     * 我需要收回这张牌
    */
    onMyOutBeEat(){

    }
    disTory(){
        super.disTory()
    }
    /**展示暗杠*/
    showSelfGang(msg:Msg_SC_GangSelfMsg){
        this.showActionImage("comResource/font/game_gang2");
        if(this.bySelfPoint == 0 && UserInfo.ins.selfIsLookPlayer != true){
            return;
        }
        if(msg.isPapo == 0){
			this.onCreateEat(msg.majID , EatCardEnum.CrossSelf);
		}else{
            this.myHandLen--;
			this.changCreateEat(msg.majID,this.haveEatType(1 , msg.majID));
		}
    }
    /**展示碰杠*/
    showPengGang(msg:Msg_SC_PengMajMsg){
        let source:string = msg.isGang == 1 ?  "comResource/font/game_gang2" : "comResource/font/game_peng2";
        this.showActionImage(source);
        if(this.bySelfPoint == 0 && UserInfo.ins.selfIsLookPlayer != true){
            return;
        }
        let eatType : EatCardEnum = Global.Utils.getOutType(msg.isGang , msg.fromSiteNum , msg.pengSiteNum , this.isHaveEat(msg.isGang , msg.majID) , this.haveEatType(msg.isGang , msg.majID));
        if(eatType == EatCardEnum.CrossAllUp || eatType == EatCardEnum.CrossAllDown || eatType == EatCardEnum.CrossAllOpp){
            this.myHandLen--;
			this.changCreateEat(msg.majID,eatType);
		}else{
			this.onCreateEat(msg.majID , eatType);
		}
    }
    /**展示抢杠*/
    public showQiangGang(msg : Msg_SC_HuMajMsg){
        if(msg.tarSit == UserInfo.ins.mySitIndex){
            
        }else{
            for(let i = 0 ; i < this.handItemArr.length ; i++){
                if(this.handItemArr[i].isShow && this.handItemArr[i].isFeel){
                    this.handItemArr[i].isShow = false;
                    this.handItemArr[i].isFeel = false;
                    break;
                }
            }
        }
    }
    /**展示胡牌*/
    showHupai(msg: Msg_SC_HuMajMsg): void {
        let card : MajiongHandCard;
		for(let i = 0 ; i < this.handItemArr.length ; i++){
			card = this.handItemArr[i];
			card.isOutTing = false;
		}
		if(this.huCard && this.huCard.node.parent){
			this.huCard.disTory()
            this.huCard = null;
		}
        let isShow:boolean = false;
        if(msg.zmType == 1 || msg.zmType == 2){
            for(let i = 0 ; i < this.handItemArr.length ; i++){
                if(this.handItemArr[i].isFeel && this.handItemArr[i].isShow){
                    isShow = true;
                    this.huCard = cc.instantiate(Global.Utils.getPreFabBySource("majiongCard/prefab/MajiongOutCard")).getComponent(MajiongOutCard);
                    this.huCard.bySelfPoint = this.bySelfPoint;
                    this.huCard.cardValue = msg.majID ? msg.majID : GameInfo.ins.otherLastCard;
                    this.huCard.node.x = this.handItemArr[i].node.x;
                    this.huCard.node.y = this.handItemArr[i].node.y;
                    this.handItemArr[i].disTory();
                    this.huCard.setLiangpai(GameInfo.ins.roomTableInfo.rule.zmOpen)
                    this.node.addChild(this.huCard.node);
                }
            }
        }
        if(!isShow){
            let hand:MajiongHandCard = this.getLastHand();
            if(this.bySelfPoint == 0){
                hand = this.getSelfLastHand();
            }
            this.huCard = cc.instantiate(Global.Utils.getPreFabBySource("majiongCard/prefab/MajiongOutCard")).getComponent(MajiongOutCard);
            this.huCard.bySelfPoint = this.bySelfPoint;
            this.huCard.cardValue = msg.majID ? msg.majID : GameInfo.ins.otherLastCard;
            this.huCard.node.x = this.getHuY(hand).x;
            this.huCard.node.y = this.getHuY(hand).y;
            this.node.addChild(this.huCard.node);
        }
        let source:string = this.getHuImageSource(msg);
        this.showActionImage(source,false);//"comResource/font/game_"+GameInfo.ins.hupaiArr.length+"hu"
    }
    hideOutLight(){
        for(let i = 0 ; i < this.myOutArray.length ; i++){
            this.myOutArray[i].hideOutSelectImage();
        }
    }
    private getHuImageSource(msg:Msg_SC_HuMajMsg):string{
        let source:string = "";
        let index:number = msg.huNum + 1;
        let huStr:string = "hu";
        if(msg.zmType == 0){
            huStr = "hu";
        }else if(msg.zmType == 1){
            huStr = "zimo";
        }else if(msg.zmType == 2){
            huStr = "gangshanghua";
        }else if(msg.zmType == 3){
            huStr = "jgangshanghua";
        }else if(msg.zmType == 4){
            huStr = "qiangganghu";
        }
        source = "comResource/font/game_"+index+huStr
        console.log(":source===="+source)
        return source;
    }
    private getHuY(hand : MajiongHandCard):cc.Vec2{
        let v2 : cc.Vec2 = cc.v2(0 , 0)
        if(this.bySelfPoint == 0){
            return cc.v2(hand.node.x + hand.cardSize._w + this.feelCardChange[this.bySelfPoint] , 0);
        }
        if(this.bySelfPoint == 1){
            return cc.v2(hand.node.x + 2 , hand.node.y + 38 + this.feelCardChange[this.bySelfPoint] + 20)
        }
        if(this.bySelfPoint == 2){
            return cc.v2(hand.node.x - hand.cardSize._w - this.feelCardChange[this.bySelfPoint] , 0)
        }
        if(this.bySelfPoint == 3){
            return cc.v2(hand.node.x - 2 , hand.node.y - 38 - this.feelCardChange[this.bySelfPoint])
        }
    }
    /**展示点炮*/
    showDianPao (huCut : number){

    }
    /**补杠*/
    private changCreateEat(card : number , eatType : EatCardEnum){
		if(eatType == EatCardEnum.EatDown){
			eatType = EatCardEnum.CrossAllDown;
		}
		if(eatType == EatCardEnum.EatOpposite){
			eatType = EatCardEnum.CrossAllOpp;
		}
		if(eatType == EatCardEnum.EatUp){
			eatType = EatCardEnum.CrossAllUp;
		}
		for(let i = 0 ; i < this.myPenggangArr.length ; i++){
			if(this.myPenggangArr[i].eatData.cardValue == card){
				this.myPenggangArr[i].setNewData(eatType);
			}
		}
	}
    /***展示碰杠*/
    private onCreateEat(cardValue : number , eatType : EatCardEnum){
        this.removePenggang(cardValue , eatType , ()=>{
            let removeNum : number = this.getRemoveNum(eatType);
            let penggangData : PengGangData = new PengGangData();
            penggangData.cardValue = cardValue;
            penggangData.eatType = eatType;
            penggangData.havePointBySelf = this.bySelfPoint;
            let item : MajiongEatItem = cc.instantiate(this.majiongEatPrefab).getComponent(MajiongEatItem);
            this.myPenggangArr.push(item);
            item.eatData = penggangData;
            item.setPoint(this.myPenggangArr.length);
            this.node.addChild(item.node);
            let changePoingt : cc.Vec2 = cc.v2(0 , 0);
            if(this.bySelfPoint == 0 && UserInfo.ins.selfIsLookPlayer){
                changePoingt.x = item.size.x + item.eatSplc[penggangData.havePointBySelf];
                changePoingt.y = 0;
            }
            else if(this.bySelfPoint == 1){
                changePoingt.x = 0;
                changePoingt.y = removeNum*38/2
            }
            else if(this.bySelfPoint == 2){
                changePoingt.x = 800 - this.myPenggangArr.length * (item.size.x + item.eatSplc[penggangData.havePointBySelf])
                changePoingt.y = 0;
            }
            else if(this.bySelfPoint == 3){
                changePoingt.x = 0;
                changePoingt.y = removeNum*38/2
            }
            let moveItem : MajiongHandCard;
            let movePoint : cc.Vec2 = cc.v2(0,0)
            if(this.bySelfPoint == 2){
                let moveIndex:number=0;
                for(let i = 0 ; i < this.handItemArr.length ; i++){
                    moveItem = this.handItemArr[i];
                    if(moveItem.isShow){
                        moveItem.node.x = changePoingt.x - moveIndex*moveItem.cardSize._w - 50;
                        if(moveItem.isFeel){
                            moveItem.node.x -= this.feelCardChange[this.bySelfPoint];
                        }
                        moveIndex++;
                    }
                }
                
            }else{
                console.log("changePoingt.y"+changePoingt)
                for(let i = 0 ; i < this.handItemArr.length ; i++){
                    moveItem = this.handItemArr[i];
                    if(moveItem.isShow){
                        if(this.bySelfPoint == 0 && UserInfo.ins.selfIsLookPlayer){
                            movePoint.x = moveItem.node.x + changePoingt.x + 83;
                            movePoint.y = 0;
                        }
                        else if(this.bySelfPoint == 1){
                            movePoint.x = moveItem.node.x;
                            movePoint.y = moveItem.node.y + changePoingt.y;
                            moveItem.node.zIndex = 49-i;
                        }
                        else if(this.bySelfPoint == 3){
                            movePoint.x = moveItem.node.x;
                            movePoint.y = moveItem.node.y + changePoingt.y;
                        }
                    }
                    cc.tween(moveItem.node).to(TimeAndMoveManager.ins.outCardHandMoveTime , {x : movePoint.x , y : movePoint.y}).start();
                }
            }
        });

    }
    /**移除手牌中的碰杠牌*/
    private removePenggang(cardValue : number , eatType : EatCardEnum , fun){
        let removeNum:number = this.getRemoveNum(eatType);
        this.myHandLen -= removeNum;
        let moveItem : MajiongHandCard;
        let handNum:number = 0;
        for(let i = 0 ; i < this.handItemArr.length ; i++){
            if(this.handItemArr[i].isShow){
                handNum++;
            }
        }
        for(let i = 0 ; i < this.handItemArr.length ; i++){
            this.handItemArr[i].isFeel = false;
            this.handItemArr[i].isShow = false;
        }
        for(let i = 0 ; i < this.myHandLen ; i++){
            moveItem = this.handItemArr[i];
            if(this.bySelfPoint == 0 && UserInfo.ins.selfIsLookPlayer){
                moveItem.node.x = i*moveItem.cardSize._w;
            }
            else if(this.bySelfPoint == 1){
                moveItem.node.x = i*-2;
                moveItem.node.y = i*38 + (13-handNum)*38/2;
                moveItem.node.zIndex = 49-i;
            }
            else if(this.bySelfPoint == 2){
                moveItem.node.x = 819 - i*moveItem.cardSize._w;
            }
            else if(this.bySelfPoint == 3){
                moveItem.node.x = i*3 - moveItem.cardSize._w*2;
                moveItem.node.y = (i+1)*38 + (13-handNum)*38/2;
                moveItem.node.zIndex = this.myHandLen - i;
            }
            moveItem.isShow = true;
        }
        let lastItem : MajiongHandCard = null;
        let nowItem : MajiongHandCard;
        for(let i = 0 ; i < this.handItemArr.length ; i++){
            nowItem = this.handItemArr[i];

            nowItem.isFeel = false;
            if(nowItem.isShow){
                if(lastItem){
                    if(this.bySelfPoint == 0 && UserInfo.ins.selfIsLookPlayer){
                        if(nowItem.node.x > lastItem.node.x){
                            lastItem = nowItem;
                        }
                    }
                    else if(this.bySelfPoint == 1){
                        if(nowItem.node.y > lastItem.node.y){
                            lastItem = nowItem;
                        }
                    }
                    else if(this.bySelfPoint == 2){
                        if(nowItem.node.x < lastItem.node.x){
                            lastItem = nowItem;
                        }
                    }
                    else if(this.bySelfPoint == 3){
                        if(nowItem.node.y < lastItem.node.y){
                            lastItem = nowItem;
                        }
                    }
                }else{
                    lastItem = nowItem;
                }
            }
        }
        if(eatType < EatCardEnum.CrossOpposite ){
            if(this.bySelfPoint == 0 && UserInfo.ins.selfIsLookPlayer ){
                lastItem.node.x += this.feelCardChange[this.bySelfPoint]
            }
            else if(this.bySelfPoint == 1){
                lastItem.node.y+=this.feelCardChange[this.bySelfPoint]
            }
            else if(this.bySelfPoint == 2){
                lastItem.node.x-=this.feelCardChange[this.bySelfPoint]
            }
            else if(this.bySelfPoint == 3){
                lastItem.node.y-=this.feelCardChange[this.bySelfPoint]
            }
            lastItem.isFeel = true;
        }
        fun();
    }
    public getRemoveNum(type:EatCardEnum):number{
		if(type <= EatCardEnum.EatDown){
			return 2;
		}
		if(type <= EatCardEnum.CrossDown){
			return 3;
		}
		if(type <= EatCardEnum.CrossSelf){
			return 4;
		}
		if(type <= EatCardEnum.CrossAllOpp){
			return 1;
		}
		return 0;

	}
    public isHaveEat(isGang : number , card : number):boolean{
		if(isGang == 1){
			for(let i = 0 ; i < this.myPenggangArr.length ; i++){
				let have : number = this.myPenggangArr[i].eatData.cardValue;
				if(have == card){
					return true;
				}
			}
		}
		return false;
	}
	public haveEatType(isGang : number , card : number):EatCardEnum{
		if(isGang == 1){
			for(let i = 0 ; i < this.myPenggangArr.length ; i++){
				let have : number = this.myPenggangArr[i].eatData.cardValue;
				if(have == card){
					return this.myPenggangArr[i].eatData.eatType;
				}
			}
		}
		return EatCardEnum.EndValue;
	}
    private showActionImage(source : string , isRemove:boolean = true){
        if(this.isAction){
            return;
        }
        this.isAction = true;
        this.actionImage.node.zIndex = 99;
        Global.Utils.setNewImageToSprite(this.actionImage , source , ()=>{
            this.actionImage.node.active = true;
            if(isRemove){
                cc.tween(this.node).delay(1).call(()=>{
                    this.actionImage.node.active = false;
                    this.isAction = false;
                }).start();
            }else{
                this.isAction = false;
            }
        });
    }
    /**清除最后一个出牌*/
    clearLastPlay(){
        if(UserInfo.ins.selfIsLookPlayer){
            return;
        }
        if(this.myOutArray.length>=1){
            this.myOutArray[this.myOutArray.length - 1].disTory();
            this.myOutArray.splice(this.myOutArray.length - 1 , 1);
        }
    }
}
