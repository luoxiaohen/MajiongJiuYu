/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-11-15 11:56:50
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-11-25 13:38:35
 * @FilePath: \MajiongJiuYu\assets\Script\UI\BuyHorseItem.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { HorserInfo } from "../proto/TableMsgDef";
import UIBase from "../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BuyHorseItem extends UIBase {

    @property(cc.Label)
    cardIndexLabel: cc.Label = null;
    @property(cc.Label)
    countLabel: cc.Label = null;
    @property(cc.Sprite)
    playerIcon : cc.Sprite = null;
    @property(cc.Sprite)
    bgImage : cc.Sprite = null;
    @property(cc.Node)
    playerGroup : cc.Node = null;
    @property (cc.Label)
    bookHorseLabel : cc.Label = null;

    isBook : boolean = false;
    private _index: number = 1;
    public itemData : HorserInfo = null;
    public get index(): number {
        return this._index;
    }
    public set index(value: number) {
        this._index = value;
    }

    protected onLoad(): void {
        this.playerGroup.active = false;
        this.bookHorseLabel.node.active = false;
    }
    showZhuangMa(){
        this.playerGroup.active = false;
        this.bookHorseLabel.node.active = true;
        this.isBook = true;
    }
    showNone(){
        this.playerGroup.active = false;
        this.bookHorseLabel.node.active = false;
    }
    showPlayerHave(data:HorserInfo){
        this.itemData = data;
        this.playerGroup.active = true;
        this.bookHorseLabel.node.active = false;
        this.countLabel.string = data.horseGold.toString();
        this.cardIndexLabel.string = (data.majNum+1).toString();
    }
    setData(cb : Function , thisObj:any){
        this.callBack  = cb;
        this.thisObj = thisObj;
    }
    private callBack : Function;
    private thisObj:any;
    onBuyHorseClick(){
        if(this.itemData){
            return;
        }
        this.callBack.bind(this.thisObj)(this);
    }
}
