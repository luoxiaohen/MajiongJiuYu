// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CardGroupPointBySelfEnum, CardTypeEnum } from "../../enum/EnumManager";
import GameInfo from "../../Game/info/GameInfo";
import UserInfo from "../../Game/info/UserInfo";
import TimeAndMoveManager from "../../mgr/TimeAndMoveManager";
import { GangSelfStepRcd } from "../../proto/MahjStepMsgDef";
import { Global } from "../../Shared/GloBal";
import Utils from "../../Shared/Utils";
import UIBase from "../../UIBase";
import { ListenCard } from "../../utils/InterfaceHelp";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MajiongHandCard extends UIBase {
    @property (cc.Sprite)
    majiongBg : cc.Sprite = null;
    @property (cc.Sprite)
    majiongFont : cc.Sprite = null;
    @property (cc.Sprite)
    majiongDice : cc.Sprite = null;
    @property (cc.Sprite)
    majiongCanOut : cc.Sprite = null;
    private _isLoadShow: boolean = false;
    public get isLoadShow(): boolean {
        return this._isLoadShow;
    }
    public set isLoadShow(value: boolean) {
        this._isLoadShow = value;
    }
    /**牌值*/
    private _cardValue: number = 0;
    public get cardValue(): number {
        return this._cardValue;
    }
    public set cardValue(value: number) {
        this._cardValue = value;
        this.showCardValue();
    }
    /**牌类型*/
    private _cardType: CardTypeEnum = CardTypeEnum.EndValue;
    public get cardType(): CardTypeEnum {
        return this._cardType;
    }
    public set cardType(value: CardTypeEnum) {
        this._cardType = value;
    }
    /**听牌数据*/
	private _listenData: ListenCard;
    public get listenData(): ListenCard {
        return this._listenData;
    }
    public set listenData(value: ListenCard) {
        this._listenData = value;
    }
    /**是否是定缺牌*/
    private _isDice: boolean = false;
    public get isDice(): boolean {
        return this._isDice;
    }
    public set isDice(value: boolean) {
        this._isDice = value;
        this.majiongDice.node.active = value;
    }
    /**是否被选中*/
    private _isSelect: boolean = false;
    public get isSelect(): boolean {
        return this._isSelect;
    }
    public set isSelect(value: boolean) {
        this._isSelect = value;
        this.showSelect();
    }
    /***是否是出牌可听*/
    private _isOutTing: boolean = false;
    public get isOutTing(): boolean {
        return this._isOutTing;
    }
    public set isOutTing(value: boolean) {
        this._isOutTing = value;
        this.majiongCanOut&&(this.majiongCanOut.node.active = value);
    }
    /***是否在展示中*/
    private _isShow: boolean = false;
    public get isShow(): boolean {
        return this._isShow;
    }
    public set isShow(value: boolean) {
        this._isShow = value;
        this.node.active = value;
        if(!value){
            this.tingData = null;
            this.tingLv = -1;
        }
    }
    /***当前牌相对于第一视角属于那个位置*/
    private _bySelfPoint: CardGroupPointBySelfEnum = CardGroupPointBySelfEnum.Self;
    public get bySelfPoint(): CardGroupPointBySelfEnum {
        return this._bySelfPoint;
    }
    public set bySelfPoint(value: CardGroupPointBySelfEnum) {
        this._bySelfPoint = value;
        this.initCardSize();
    }
    /***当前牌的大小*/
    private _cardSize = { _w: 131, _h: 182 };
    public get cardSize() {
        return this._cardSize;
    }
    public set cardSize(value) {
        this._cardSize = value;
    }
    protected onLoad(): void {
        this.initMajiong();
        this.showMajiongCard();
    }
    protected start(): void {
    }

    /***摸牌时候得入牌动作是否已经结束*/
    private _isActionOver: boolean = true;
    public get isActionOver(): boolean {
        return this._isActionOver;
    }
    public set isActionOver(value: boolean) {
        this._isActionOver = value;
    }
    /***我的出牌可听权重*/
    private _tingLv: number = 0;
    public get tingLv(): number {
        return this._tingLv;
    }
    public set tingLv(value: number) {
        this._tingLv = value;
    }
    /***我的出牌可听数据*/
    private _tingData: ListenCard = null;
    public get tingData(): ListenCard {
        return this._tingData;
    }
    public set tingData(value: ListenCard) {
        this._tingData = value;
    }

    /***是否是摸起来得最后一张*/
    private _isFeel: boolean = false;
    public get isFeel(): boolean {
        return this._isFeel;
    }
    public set isFeel(value: boolean) {
        this._isFeel = value;
    }
    /**初始化手牌*/
    initMajiong(){
        this.isDice = false;
        this.isSelect = false;
        this.isOutTing = false;
        this.isShow = this.isLoadShow
        this.showCardValue();
    }
    private showSelect(){
        if(this.bySelfPoint == CardGroupPointBySelfEnum.Self){
            if(this.isSelect){
                this.node.y = 50;
            }else{
                this.node.y = 0;
            }
        }
    }
    private showCardValue(){
        if(UserInfo.ins.selfIsLookPlayer){

        }else{
            if(this.cardValue){
                this.cardType = Math.floor(this.cardValue/10);
                this.showMajiongFont();
                this.isDice = Global.Utils.getIsDice(this.cardValue , UserInfo.ins.myDiceType);
            }
        }
    }
    private showMajiongFont(){
        if(this.bySelfPoint == CardGroupPointBySelfEnum.Self){
            let newSource : string = "majiongCard/resource/" + Global.Utils.getCardStrByValue(this.cardValue);
            Global.Utils.setNewImageToSprite(this.majiongFont , newSource , null);
            this.majiongFont.node.active = true;
        }
    }
    showMajiongPut(){
        if(this.bySelfPoint == CardGroupPointBySelfEnum.Self){
            let newSource : string = "comResource/com/ty_majiang0";
            Global.Utils.setNewImageToSprite(this.majiongBg , newSource , null);
            this.majiongFont.node.active = false;
        }
    }
    showMajiongUp(){
        if(this.bySelfPoint == CardGroupPointBySelfEnum.Self){
            if(UserInfo.ins.selfIsLookPlayer){
                Global.Utils.setNewImageToSprite(this.majiongBg , "majiongCard/resource/0_0_2_2" , null);
            }else{
                let newSource : string = "majiongCard/resource/0_0_2";
                Global.Utils.setNewImageToSprite(this.majiongBg , newSource , null);
            }
        }
    }
    showMajiongCard(){
        this.majiongCanOut.node.active = false;
        this.majiongDice.node.active = false;
        let bgSource:string = "";
        switch(this.bySelfPoint){
            case CardGroupPointBySelfEnum.Self:
                if(UserInfo.ins.selfIsLookPlayer){
                    this.majiongBg.node.scaleX = 1;
                    bgSource = "majiongCard/resource/0_0_2_2";
                    this.cardSize = { _w: 131, _h: 182 };
                }else{
                    bgSource = "majiongCard/resource/0_0_2";
                    this.majiongBg.node.scaleX = 1;
                    this.cardSize = { _w: 131, _h: 182 };
                }
            break;
            case CardGroupPointBySelfEnum.Down:
                bgSource = "majiongCard/resource/1_0_2";
                this.majiongBg.node.scaleX = 1;
                this.cardSize = { _w: 57, _h: 77 };
            break;
            case CardGroupPointBySelfEnum.Opp:
                bgSource = "majiongCard/resource/2_0_2";
                this.majiongBg.node.scaleX = 1;
                this.cardSize = { _w: 58, _h: 84 };
            break;
            case CardGroupPointBySelfEnum.Up:
                bgSource = "majiongCard/resource/1_0_2";
                this.majiongBg.node.scaleX = -1;
                this.cardSize = { _w: 57, _h: 77 };
            break;
        }
        Global.Utils.setNewImageToSprite(this.majiongBg , bgSource);
    }

    showGetAction(delyCount:number){
        let nowX:number
        switch(this.bySelfPoint){
            case CardGroupPointBySelfEnum.Self:
                cc.tween(this.node).to(delyCount*TimeAndMoveManager.ins.getWallActionTime/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType), { y : 0}).call(function () {
                }).start();
            break;
            case CardGroupPointBySelfEnum.Down:
                nowX = this.node.x;
                cc.tween(this.node).to(delyCount*TimeAndMoveManager.ins.getWallActionTime/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType), { x : nowX - 20}).call(function () {
                }).start();
            break;
            case CardGroupPointBySelfEnum.Opp:
                cc.tween(this.node).to(delyCount*TimeAndMoveManager.ins.getWallActionTime/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType), { y : 0}).call(function () {
                }).start();
            break;
            case CardGroupPointBySelfEnum.Up:
                nowX = this.node.x;
                cc.tween(this.node).to(delyCount*TimeAndMoveManager.ins.getWallActionTime/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType), { x : nowX+20}).call(function () {
                }).start();
            break;
        }
    }

    initCardSize(){
        switch(this.bySelfPoint){
            case CardGroupPointBySelfEnum.Self:
                this.cardSize = { _w: 131, _h: 182 };
            break;
            case CardGroupPointBySelfEnum.Down:
                this.cardSize = { _w: 57, _h: 77 };
            break;
            case CardGroupPointBySelfEnum.Opp:
                this.cardSize = { _w: 58, _h: 84 };
            break;
            case CardGroupPointBySelfEnum.Up:
                this.cardSize = { _w: 57, _h: 77 };
            break;
        }
    }
    /**展示听牌*/
    public showListion(){
        if(UserInfo.ins.selfIsLookPlayer){
            return;
        }
        this.tingData = UserInfo.ins.getTingByCardValue(this.cardValue);
        if(this.tingData){
            this.tingLv = UserInfo.ins.getOutType(this.tingData , UserInfo.ins.outTing)
        }
        if(this.tingLv >= 0){
            this.showOutLvImage();
            this.isOutTing = true;
        }
    }
    /**展示可出图片*/
    private showOutLvImage(){
        if(UserInfo.ins.selfIsLookPlayer){
            return;
        }
        switch(this.tingLv){
            case 0:
                Global.Utils.setNewImageToSprite(this.majiongCanOut , "comResource/font/game_jiantou2");
            break;
            case 1:
                Global.Utils.setNewImageToSprite(this.majiongCanOut , "comResource/font/game_jiantou3");
            break;
            case 2:
                Global.Utils.setNewImageToSprite(this.majiongCanOut , "comResource/font/game_jiantou4");
            break;
            case 3:
                Global.Utils.setNewImageToSprite(this.majiongCanOut , "comResource/font/game_jiantou1");
            break;
        }
    }
    /***
     * 换三插入后的位置
    */
    private changethreePoint:cc.Vec2;
    private _changeCount: number = 1;
    public get changeCount(): number {
        return this._changeCount;
    }
    public set changeCount(value: number) {
        this._changeCount = value;
    }
    setNewPoint(x,y){
        this.changethreePoint = new cc.Vec2(x , y )
    }
    getNewPoint():cc.Vec2{
        return this.changethreePoint;
    }

    disTory(){
        super.disTory();
    }
}
