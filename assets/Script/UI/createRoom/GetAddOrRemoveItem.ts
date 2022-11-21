// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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
    }
    onRemoveClick(){
        if(this.currLv <= 0){
            return;
        }
        this.currLv--
        this.showHandLabel();
        if(this.callFun){
            this.callFun.bind(this.thisObj)();
        }
    }
    private createElements(){
        this.showHandLabel();
    }
    private showHandLabel(){
        this.handLabel.string = this.valueArr[this.currLv].toString();
    }
}
