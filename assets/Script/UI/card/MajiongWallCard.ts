/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-10-08 09:24:45
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-12-16 11:41:49
 * @FilePath: \MajiongJiuYu\assets\Script\UI\card\MajiongWallCard.ts
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
export default class MajiongWallCard extends UIBase {
    start () {
    }
    @property (cc.Sprite)
    majiongImage : cc.Sprite = null;
    @property (cc.Label)
    idLabel : cc.Label = null;
    /**当前牌在牌墙的位置*/
    private _cardId: number = 0;
    public get cardId(): number {
        return this._cardId;
    }
    public set cardId(value: number) {
        this._cardId = value;
        this.idLabel.string = "";//value.toString();
    }

    /**牌墙在桌子的位置*/
    private _cardPoint: number = 0;
    public get cardPoint(): number {
        return this._cardPoint;
    }
    public set cardPoint(value: number) {
        this._cardPoint = value;
        this.showImage();
    }

    /***麻将摸牌顺序,依据庄家位置和摸牌起点得出*/
    private _majiongDrawOeder: number = 0;
    public get majiongDrawOeder(): number {
        return this._majiongDrawOeder;
    }
    public set majiongDrawOeder(value: number) {
        this._majiongDrawOeder = value;
    }
    protected onLoad(): void {
        
    }

    /**设置当前是否可见*/
    public setVisible(boo:boolean){
        this.node.active = boo;
    }

    /***当前是否是马牌*/
    private _isHorse: boolean = false;
    public get isHorse(): boolean {
        return this._isHorse;
    }
    public set isHorse(value: boolean) {
        this._isHorse = value;
    }
    public showHorse(num:number){
        this.isHorse = true;
        let source : string ;
        this.majiongImage.node.scaleX = 1;
        if(this.cardPoint == 0){
            source = "buyHorse/resource/maima_ma" + (num+1);
        }else if(this.cardPoint == 1){
            source = "buyHorse/resource/maima_ma" + (num+1) + "you";
        }else if(this.cardPoint == 2){
            source = "buyHorse/resource/maima_ma" + (num+1) + "dui";
        }else if(this.cardPoint == 3){
            source = "buyHorse/resource/maima_ma" + (num+1) + "you";
            this.majiongImage.node.scaleX = -1;
        }
        Global.Utils.setNewImageToSprite(this.majiongImage , source);
    }
    public showNone(){
        this.isHorse = false;
        this.majiongImage.node.scaleX = 1;
        if(this.cardPoint == 3){
            // Global.Utils.setNewImageToSprite(this.majiongImage , "majiongCard/resource/1_0_1" , null)
            Global.Utils.setMJImageToSprite(this.majiongImage , "1_0_1")
        }else{
            // Global.Utils.setNewImageToSprite(this.majiongImage , "majiongCard/resource/"+this.cardPoint+"_0_1" , null)
            Global.Utils.setMJImageToSprite(this.majiongImage , this.cardPoint+"_0_1")
        }
        if(this.cardPoint == 3){
            this.majiongImage.node.scaleX = -1;
        }else{
            this.majiongImage.node.scaleX = 1;
        }
    }
    private showImage(){
        if(this.cardPoint == 3){
            // Global.Utils.setNewImageToSprite(this.majiongImage , "majiongCard/resource/1_0_1" , null)
            Global.Utils.setMJImageToSprite(this.majiongImage , "1_0_1")
        }else{
            // Global.Utils.setNewImageToSprite(this.majiongImage , "majiongCard/resource/"+this.cardPoint+"_0_1" , null)
            Global.Utils.setMJImageToSprite(this.majiongImage , this.cardPoint+"_0_1")
        }
        if(this.cardPoint == 3){
            this.majiongImage.node.scaleX = -1;
        }else{
            this.majiongImage.node.scaleX = 1;
        }
    }
}
