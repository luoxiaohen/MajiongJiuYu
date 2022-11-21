/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-11-15 11:56:50
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-11-15 13:49:21
 * @FilePath: \MajiongJiuYu\assets\Script\UI\BuyHorseItem.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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

    private _index: number = 1;
    public get index(): number {
        return this._index;
    }
    public set index(value: number) {
        this._index = value;
    }

    protected onLoad(): void {
        this.playerGroup.active = false;
    }

    setData(){

    }
    onBuyHorseClick(){
        
    }
}
