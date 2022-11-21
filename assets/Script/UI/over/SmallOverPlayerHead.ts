// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameInfo from "../../Game/info/GameInfo";
import UserInfo from "../../Game/info/UserInfo";
import { GameResultInfo, SitInfo } from "../../proto/TableMsgDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SmallOverPlayerHead extends UIBase {
    @property (cc.Sprite)
    bgImag : cc.Sprite = null; 
    @property (cc.Sprite)
    touxiangImage : cc.Sprite = null; 
    @property (cc.Sprite)
    piaoImage : cc.Sprite = null; 
    @property (cc.Sprite)
    zhuangImage : cc.Sprite = null; 
    @property (cc.Sprite)
    horseImage1 : cc.Sprite = null; 
    @property (cc.Sprite)
    horseImage2 : cc.Sprite = null; 
    @property (cc.Sprite)
    huImage : cc.Sprite = null; 
    @property (cc.Label)
    fenLabel : cc.Label = null; 
    @property (cc.Label)
    nameLabel : cc.Label = null; 

    /**结算数据*/
    private _esultInfo: GameResultInfo;
    public get esultInfo(): GameResultInfo {
        return this._esultInfo;
    }
    public set esultInfo(value: GameResultInfo) {
        this._esultInfo = value;
        this.showHorse();
        this.showFenLabel();
    }
    /**玩家数据*/
    private _playerInfo: SitInfo;
    public get playerInfo(): SitInfo {
        return this._playerInfo;
    }
    public set playerInfo(value: SitInfo) {
        this._playerInfo = value;
        this.showZhuangImage();
        this.showNameLabel();
    }
    /**是否有胡*/
    private _isBreak: boolean;
    public get isBreak(): boolean {
        return this._isBreak;
    }
    public set isBreak(value: boolean) {
        this._isBreak = value;
        this.showHuImage()
    }
    /**是否选中*/
    private _isSelect: boolean;
    public get isSelect(): boolean {
        return this._isSelect;
    }
    public set isSelect(value: boolean) {
        this._isSelect = value;
        this.showBgImage();
    }
    protected onLoad(): void {
        
    }
    setPlayerData (info : GameResultInfo , isBreak : boolean){
        this.esultInfo = info;
        this.isBreak = isBreak;
        this.playerInfo = GameInfo.ins.getPlayerBySit(info.sitNum);
    }
    private getPointStr():string{
        let changeNum : number = (this.esultInfo.sitNum - UserInfo.ins.mySitIndex + 40)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) ;
        switch(changeNum){
            case 0:
                return "本家";
            case 1:
                return "下家";
            case 2:
                return "对家";
            case 3:
                return "上家";
        }
        return "";
    }
    public showHorse(){

    }
    public showNameLabel(){
        this.nameLabel.string = this.getPointStr() + this.playerInfo.player.nike
    }
    public showFenLabel(){
        let fontSource:string = this.esultInfo.score >= 0 ? "comResource/mapFont/jiesuanJiafen" : "comResource/mapFont/jiesuanJianfen";
        cc.loader.loadRes(fontSource , cc.Font , (error , assest)=>{
            if(error){
                return;
            }
            this.fenLabel.font = assest;
            this.fenLabel.string = this.esultInfo.score >= 0 ? ("+" + this.esultInfo.score) : this.esultInfo.score.toString();
        })
    }
    public showZhuangImage(){
        this.zhuangImage.node.active = this.esultInfo.sitNum == GameInfo.ins.nowBookMakerSit;
    }
    public showPiaoImage(){

    }
    public showHuImage(){
        if(this.isBreak){
            this.huImage.node.active = false;
            return;
        }
        if(this.esultInfo.state != 2){
            this.huImage.node.active = false;
            return;
        }
        this.huImage.node.active = true;
        let source : string = "smallOver/resource/game_hu";
        if(this.esultInfo.huNum == 0){
            source = "smallOver/resource/game_hu";
        }
        if(this.esultInfo.huNum == 1){
            source = "smallOver/resource/game_hu2";
        }
        if(this.esultInfo.huNum == 2){
            source = "smallOver/resource/game_hu3";
        }
        Global.Utils.setNewImageToSprite(this.huImage , source);
    }
    public showBgImage(){
        let source : string = this.isSelect ? "smallOver/resource/game_kuang1" : "smallOver/resource/game_kuang2";
        Global.Utils.setNewImageToSprite(this.bgImag , source);
    }


}
