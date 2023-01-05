/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-11-01 10:45:00
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-12-01 11:31:09
 * @FilePath: \MajiongJiuYu\assets\Script\UI\createRoom\GetAddOrRemoveItem.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../../Shared/GloBal";
import Utils from "../../Shared/Utils";
import UIBase from "../../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GetAddOrRemoveItem extends UIBase {

    @property(cc.Label)
    nameLabel: cc.Label = null;

    @property (cc.Label)
    handLabel: cc.Label = null;

    @property (cc.Button)
    handSubBtn : cc.Button = null;
    
    @property (cc.Button)
    handAddBtn : cc.Button = null;

    @property (cc.Sprite)
    addSprite : cc.Sprite = null;

    @property (cc.Sprite)
    removeSprite : cc.Sprite = null;

    private valueArr:Array<any> = [];
    private _currLv: number = 0;
    public get currLv(): number {
        return this._currLv;
    }
    public set currLv(value: number) {
        this._currLv = value;
    }

    protected onLoad(): void {
        
    }
    private callFun:Function;
    private thisObj:any;
    setData(valueArr:Array<any> , initLv:number , nameStr:string , callFun : Function = null , thisObj:any=null){
        this.valueArr = valueArr ;
        this.currLv = initLv;
        this.createElements();
        this.nameLabel.string = nameStr;
        this.callFun = callFun;
        this.thisObj = thisObj;
        
        let isGray:boolean = this.currLv == this.valueArr.length -1;
        Global.Utils.setGray(this.addSprite , isGray)
        isGray = this.currLv == 0;
        Global.Utils.setGray(this.removeSprite , isGray);
    }
    onAddClick(){
        if(this.currLv >= this.valueArr.length-1){
            return;
        }
        this.currLv++;
        this.showHandLabel();
        if(this.callFun){
            this.callFun.bind(this.thisObj)();
        }
        let isGray:boolean = this.currLv == this.valueArr.length -1;
        Global.Utils.setGray(this.addSprite , isGray)
        Global.Utils.setGray(this.removeSprite , false);
    }
    onRemoveClick(){
        if(this.currLv <= 0){
            return;
        }
        
        Global.Utils.setGray(this.addSprite , false)
        this.currLv--
        this.showHandLabel();
        if(this.callFun){
            this.callFun.bind(this.thisObj)();
        }
        let isGray:boolean = this.currLv == 0;
        Global.Utils.setGray(this.removeSprite , isGray);
    }
    private createElements(){
        this.showHandLabel();
    }
    private showHandLabel(){
        this.handLabel.string = this.valueArr[this.currLv].toString();
    }
}
