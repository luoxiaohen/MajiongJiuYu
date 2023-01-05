// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../../Shared/GloBal";
import { MajCardLight } from "../../utils/InterfaceHelp";
import MajiongHandCard from "./MajiongHandCard";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CardHelpManager{
    private static _ins: CardHelpManager;
    public static get ins() {
        return this._ins || (this._ins = new CardHelpManager());
    }

    /**四方牌墙得初始位置*/
    private _wallCardInitPoint: Array<cc.Vec2> = [cc.v2(548, -820), cc.v2(1432, -237), cc.v2(620, -130), cc.v2(470, -221)];
    public get wallCardInitPoint(): Array<cc.Vec2> {
        return this._wallCardInitPoint;
    }
    public set wallCardInitPoint(value: Array<cc.Vec2>) {
        this._wallCardInitPoint = value;
    }
    /**四方牌墙牌宽度*/
    private _wallCardWidth: Array<number> = [62, 79, 52, 79];
    public get wallCardWidth(): Array<number> {
        return this._wallCardWidth;
    }
    public set wallCardWidth(value: Array<number>) {
        this._wallCardWidth = value;
    }
    /**四方牌墙牌高度*/
    private _wallCardHeight: Array<number> = [86, 59, 61, 59];
    public get wallCardHeight(): Array<number> {
        return this._wallCardHeight;
    }
    public set wallCardHeight(value: Array<number>) {
        this._wallCardHeight = value;
    }
    /**四方出牌宽度*/
    private _outCardWidth: Array<number> = [67, 82, 55, 82];
    public get outCardWidth(): Array<number> {
        return this._outCardWidth;
    }
    public set outCardWidth(value: Array<number>) {
        this._outCardWidth = value;
    }
    /**四方出牌高度*/
    private _outCardHeight: Array<number> = [90, 67, 75, 67];
    public get outCardHeight(): Array<number> {
        return this._outCardHeight;
    }
    public set outCardHeight(value: Array<number>) {
        this._outCardHeight = value;
    }

    /**自己出牌的初始位置*/
    private _myOutCardInitPoint = cc.v2(790, -650);
    public get myOutCardInitPoint() {
        return this._myOutCardInitPoint;
    }
    public set myOutCardInitPoint(value) {
        this._myOutCardInitPoint = value;
    }
    /**下家出牌的初始位置*/
    private _downOutCardInitPoint = cc.v2(1145, -584);
    public get downOutCardInitPoint() {
        return this._downOutCardInitPoint;
    }
    public set downOutCardInitPoint(value) {
        this._downOutCardInitPoint = value;
    }
    /**对家出牌的初始位置*/
    private _oppOutCardInitPoint = cc.v2(1035, -150);
    public get oppOutCardInitPoint() {
        return this._oppOutCardInitPoint;
    }
    public set oppOutCardInitPoint(value) {
        this._oppOutCardInitPoint = value;
    }
    /**上家出牌的初始位置*/
    private _upOutCardInitPoint = cc.v2(768, 1228.5);
    public get upOutCardInitPoint() {
        return this._upOutCardInitPoint;
    }
    public set upOutCardInitPoint(value) {
        this._upOutCardInitPoint = value;
    }


    /**自己手牌的初始位置
     * 当出现碰杠时候,需要修改位置,每次开局需要重新初始化
    */
    private _myHandCardInitPoint = cc.v2(26, -1058);
    public get myHandCardInitPoint() {
        return this._myHandCardInitPoint;
    }
    public set myHandCardInitPoint(value) {
        this._myHandCardInitPoint = value;
    }

    /***碰杠之后的移动位置*/
    private _changePointByEat: number = 0;
    public get changePointByEat(): number {
        return this._changePointByEat;
    }
    public set changePointByEat(value: number) {
        this._changePointByEat = value;
    }

    /**对家手牌的初始位置
    */
     private _oppHandCardInitPoint = cc.v2(520.5, -103);
    public get oppHandCardInitPoint() {
        return this._oppHandCardInitPoint;
    }
    public set oppHandCardInitPoint(value) {
        this._oppHandCardInitPoint = value;
    }
     /**下家手牌的初始位置
    */
    private _downHandCardInitPoint = cc.v2(1620, -807.5);
    public get downHandCardInitPoint() {
        return this._downHandCardInitPoint;
    }
    public set downHandCardInitPoint(value) {
        this._downHandCardInitPoint = value;
    }
     /**上家手牌的初始位置
    */
    private _upHandCardInitPoint = cc.v2(350, -808.5);
    public get upHandCardInitPoint() {
        return this._upHandCardInitPoint;
    }
    public set upHandCardInitPoint(value) {
        this._upHandCardInitPoint = value;
    }
    /**重新开局或者其他某些时候 需要初始化一次基础数据*/
    init(){
        this.myHandCardInitPoint = cc.v2(26, -1058);
        this.oppHandCardInitPoint = cc.v2(550.5, -103);
        this.downHandCardInitPoint = cc.v2(1650, -844.5);
        this.upHandCardInitPoint = cc.v2(325, -844.5);
        this.changePointByEat = 0;
    }
    initOver(){
        this.init();
    }


    private getLightByValue(value : number , disArr : Array<MajCardLight>):number{
        for(let i = 0 ; i < disArr.length ; i++){
            if(disArr[i].cardValue == value){
                return disArr[i].cardLight;
            }
        }
        return 0;
    }
    /**获取所有牌中权重最低的三张*/
     getSmallThree(disArr : Array<MajCardLight> , handArr:Array<MajiongHandCard>) : Array<number>{
        let dis : Array<MajCardLight> = [];
        let light:MajCardLight;
        for(let i = 0 ; i < handArr.length ; i++){
            light = new MajCardLight();
            if(handArr[i].isShow){
                light.cardValue = handArr[i].cardValue;
                light.cardLight = this.getLightByValue(handArr[i].cardValue , disArr);
                dis.push(light);
            }
        }
		let threeArr:Array<number>=[];
        let nowAllLight:number = 0;
        let smallAllLight:number = 0;
        let nowType:number = 0;
        let oneTypeLight:Array<MajCardLight> = [];
        for(let i = 0 ; i < 3 ; i++){
            oneTypeLight = this.getLightByType(dis , i);
            if(oneTypeLight.length > 3){
                nowAllLight = this.getSmallLight(oneTypeLight);
                if(smallAllLight == 0){
                    smallAllLight = nowAllLight;
                    nowType = i;
                }else{
                    if(nowAllLight < smallAllLight){
                        smallAllLight = nowAllLight;
                        nowType = i;
                    }
                }
            }else if(oneTypeLight.length == 3){
                threeArr = [oneTypeLight[0].cardValue , oneTypeLight[1].cardValue , oneTypeLight[2].cardValue]
                return threeArr;
            }
        }
        let smlTypeLight:Array<MajCardLight> = [];
        let nowSmlType:number = -1;
        let nowSmlNum:number = -1;
        for(let i = 0 ; i < 3 ; i++){
            smlTypeLight = this.getLightByType(dis , i);
            if(smlTypeLight.length > 3){
                if(nowSmlType == -1){
                    nowSmlType = i;
                    nowSmlNum = smlTypeLight.length;
                }else{
                    if(nowSmlNum > smlTypeLight.length){
                        nowSmlType = i;
                        nowSmlNum = smlTypeLight.length;
                    }
                }
            }
        }
        nowType = nowSmlType;
        oneTypeLight = this.getLightByType(dis ,nowType);
        oneTypeLight.sort(Global.Utils.compareLight);
        threeArr = [oneTypeLight[0].cardValue , oneTypeLight[1].cardValue , oneTypeLight[2].cardValue]
        return threeArr;
	}
    private getSmallLight(arr:Array<MajCardLight>):number{
        let small:number = 0;
        arr.sort(Global.Utils.compareLight);
        small =arr[0].cardLight + arr[1].cardLight + arr[2].cardLight
        return small;
    }
    private getLightByType(dis : Array<MajCardLight> , type:number) :  Array<MajCardLight>{
        let arr : Array<MajCardLight> = [];
        for(let i = 0 ; i < dis.length ; i++){
            if(Math.floor(dis[i].cardValue/10) == type){
                arr.push(dis[i]);
            }
        }
        return arr;
    }
    /**获取所有牌的权重列表**/
	getThreeCard(handItemArr:Array<MajiongHandCard> , ):Array<MajCardLight>{
		let allArr:Array<number> = [];
		let nowArr:Array<number> = [];
		for(let i = 0 ; i < handItemArr.length ; i++){
            if(handItemArr[i].isShow){
			    allArr.push(handItemArr[i].cardValue)
            }
		}
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

		return dic;
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
	private haveThree(arr:Array<MajCardLight> , card:number):boolean{
		let nowT:number = Math.floor(card/10);
		let haveIndex:number = 0;
		for(let i = 0 ; i < arr.length ; i++){
			if(Math.floor(arr[i].cardValue/10) == nowT){
				haveIndex++;
			}
		}
		return haveIndex >= 3;
	}
	private isOne(a:number , b:number){
		if(Math.floor(a/10) == Math.floor(b/10)){
			return true;
		}
		return false;
	}
    
}
