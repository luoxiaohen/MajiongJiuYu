/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-11-19 11:11:41
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-12-14 15:05:06
 * @FilePath: \MajiongJiuYu\assets\Script\UI\buyHorse\BuyHorseICardtem.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BuyHorseICardtem extends UIBase {

    @property (cc.Sprite)
    cardImage : cc.Sprite = null;
    @property (cc.Label)
    selectLabel : cc.Label = null;
    @property (cc.Label)
    cardIndexLabel : cc.Label = null;
    private _cardData: BuyHorseICard;
    public get cardData(): BuyHorseICard {
        return this._cardData;
    }
    public set cardData(value: BuyHorseICard) {
        this._cardData = value;
    }


    private _isSelect: boolean = false;
    public get isSelect(): boolean {
        return this._isSelect;
    }
    public set isSelect(value: boolean) {
        this._isSelect = value;
        this.showSelect();
    }
    protected onLoad(): void {
    }
    setData(data:BuyHorseICard){
        this.cardData = data;
        switch(data.cardType){
            case BuyHorseEnum.DontSelect:
                this.showNoSelect();
            break;
            case BuyHorseEnum.OtherSelect:
                this.showOtherSelect();
                this.enabled = false;
            break;
            case BuyHorseEnum.BookSelect:
                this.showBookSelect();
                this.enabled = false;
            break;
        }
    }
    private showNoSelect(){
        this.selectLabel.node.active = false;
        this.cardIndexLabel.string = this.cardData.index.toString();
        let source:string = "buyHorse/resource/maima_mapai1";
        Global.Utils.setNewImageToSprite(this.cardImage , source);
    }
    private showOtherSelect(){
        this.selectLabel.node.active = true;
        this.selectLabel.string = "他人已选"
        this.cardIndexLabel.string = this.cardData.index.toString();
        let source:string = "buyHorse/resource/maima_mapai3";
        Global.Utils.setNewImageToSprite(this.cardImage , source);
    }
    private showBookSelect(){
        this.selectLabel.node.active = true;
        this.selectLabel.string = "庄家已选"
        this.cardIndexLabel.string = this.cardData.index.toString();
        let source:string = "buyHorse/resource/maima_mapai3";
        Global.Utils.setNewImageToSprite(this.cardImage , source);
    }

    private showSelect(){
        if(this.cardData.cardType == BuyHorseEnum.BookSelect || this.cardData.cardType == BuyHorseEnum.OtherSelect){
            return;
        }
        let source:string = "buyHorse/resource/maima_mapai2";
        if(this.isSelect == false){
            source = "buyHorse/resource/maima_mapai1";
        }
        Global.Utils.setNewImageToSprite(this.cardImage , source);
    }
}
export class BuyHorseICard{
    index :number;
    cardType:BuyHorseEnum;
}

export enum BuyHorseEnum{
    None,
    DontSelect,
    OtherSelect,
    BookSelect,
    EndValue
}



