// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CardTypeEnum, PlayStauteEnum } from "../enum/EnumManager";
import EventType from "../event/EventType";
import GameInfo from "../Game/info/GameInfo";
import UserInfo from "../Game/info/UserInfo";
import TimeAndMoveManager from "../mgr/TimeAndMoveManager";
import { PlayerInfo } from "../proto/LobbyMsgDef";
import { Msg_CS_SitDown, Msg_SC_DiceRslt } from "../proto/TableMsg";
import { SitInfo } from "../proto/TableMsgDef";
import { Global } from "../Shared/GloBal";
import UIBase from "../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerHeadItem extends UIBase {
    @property(cc.Node)
    headGroup : cc.Node = null;

    @property(cc.Node)
    noneGroup : cc.Node = null;
    @property(cc.Label)
    changeLabel : cc.Label = null;

    @property(cc.Sprite)
    playerHeadImage : cc.Sprite = null;

    @property(cc.Sprite)
    zhuangImage : cc.Sprite = null;

    @property(cc.Sprite)
    queImage : cc.Sprite = null;

    @property(cc.Sprite)
    piaoImage : cc.Sprite = null;

    @property(cc.Label)
    nameLabel : cc.Label = null;

    @property(cc.Label)
    countLabel : cc.Label = null;

    @property(cc.Button)
    sitDownBtn : cc.Button = null;

    @property (cc.Sprite)
    isReadyImage : cc.Sprite = null;
    
    @property (cc.Sprite)
    playerDiceOneImage : cc.Sprite = null;
    
    @property (cc.Sprite)
    playerDiceTwoImage : cc.Sprite = null;

    @property (cc.Sprite)
    dingqueImage : cc.Sprite = null;

    @property (cc.Sprite)
    queActionImage : cc.Sprite = null;
    @property (cc.Sprite)
    actionImage : cc.Sprite = null;



    /**是否漂*/
    private _isPiao: boolean = false;
    public get isPiao(): boolean {
        return this._isPiao;
    }
    public set isPiao(value: boolean) {
        this.showPiao(value);
        this._isPiao = value;
    }

    /**是否是庄*/
    private _isZhuang: boolean = false;
    public get isZhuang(): boolean {
        return this._isZhuang;
    }
    public set isZhuang(value: boolean) {
        this.showZhuang(value);
        this._isZhuang = value;
    }

    /**玩家个人信息*/
    private _playerInfo: PlayerInfo = null;
    public get playerInfo(): PlayerInfo {
        return this._playerInfo;
    }
    public set playerInfo(value: PlayerInfo) {
        this._playerInfo = value;
        this.showName();
        this.showFen(this.myGameFen);
    }

    /**坐下的位置信息*/
    private _sitInfo: SitInfo;
    public get sitInfo(): SitInfo {
        return this._sitInfo;
    }
    public set sitInfo(value: SitInfo) {
        this.playerInfo = value.player;
        this._sitInfo = value;
        this.showSit();
    }
    /**不考虑玩家时候的基础位置*/
    private _directionSitNum: number;
    public get directionSitNum(): number {
        return this._directionSitNum;
    }
    public set directionSitNum(value: number) {
        this._directionSitNum = value;
    }

    /**是否是我自己的动作回合*/
    private _isMyAction: boolean = false;
    public get isMyAction(): boolean {
        return this._isMyAction;
    }
    public set isMyAction(value: boolean) {
        this._isMyAction = value;
        this.actionImage.node.active = value;
    }


    private myGameFen:number = 0;
    start () {
    }
    protected onLoad(): void {
        this.directionSitNum = this.dialogParameters;
        this.showUiPoint()
        this.headGroup.active = false;
        this.noneGroup.active = true;
        this.isPiao = false;
        this.isZhuang = false;
        this.showDingQue(CardTypeEnum.EndValue);
        this.showNone();
        this.showPlayerDice(false);
        this.showIsReady(false);
        this.showIsDingQueIng(false);
        this.showQueAction(false)
        this.isMyAction = false;
        this.changeLabel.node.active = false;
    }
    showQueAction(boo:boolean , type:number = CardTypeEnum.EndValue){
        if(boo){
            this.showQueActionPoint();
        }
        this.queActionImage.node.active = boo;
        cc.tween(this.queActionImage.node).to(0.3 , {x : this.queImage.node.x , y : this.queImage.node.y , scaleX : 0 , scaleY : 0}).call(()=>{
            this.showDingQue(type)
        }).start();
    }
    private showQueActionPoint(){
        let num:number = (this.sitInfo.sitNum + 16 - UserInfo.ins.mySitIndex)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType);
        switch(num){
            case 0:
                this.queActionImage.node.x = 890;
                this.queActionImage.node.y = 250;
            break;
            case 1:
                this.queActionImage.node.x = -522;
                this.queActionImage.node.y = 65;
            break;
            case 2:
                this.queActionImage.node.x = -525;
                this.queActionImage.node.y = -66;
            break;
            case 3:
                this.queActionImage.node.x = 660;
                this.queActionImage.node.y = 65;
            break;
        }
    }
    /**初始化时候某些部件因为方位原因需要移动位置*/
    public showUiPoint(){
        this.showReadyPoint();
        this.initDicePoint();
    }
    showIsDingQueIng(boo:boolean){
        if(boo){
            if(UserInfo.ins.isSelf(this.playerInfo.gpid)){
                return;
            }
            this.showDingQuePoint();
        }
        this.dingqueImage.node.active = boo;
    }
    showDingQuePoint(){
        // if(this.node.x > 1500){
        //     this.isReadyImage.node.x = -73;
        // }
    }
    showReadyPoint(){
        if(this.node.x > 1500){
            this.isReadyImage.node.x = -170;
        }
    }
    initDicePoint(){
        if(this.node.x == 36 || this.node.x == 26){
            if(this.node.y == -669 || this.node.y == -679){
                this.playerDiceOneImage.node.x = 890;
                this.playerDiceOneImage.node.y = 264;
                this.playerDiceTwoImage.node.x = 976;
                this.playerDiceTwoImage.node.y = 264;
            }else{
                this.playerDiceOneImage.node.x = 775;
                this.playerDiceOneImage.node.y = 99;
                this.playerDiceTwoImage.node.x = 775;
                this.playerDiceTwoImage.node.y = 13;
            }
        }else if(this.node.x == 1748 || this.node.x == 1738){
            this.playerDiceOneImage.node.x = -615;
            this.playerDiceOneImage.node.y = 15;
            this.playerDiceTwoImage.node.x = -615;
            this.playerDiceTwoImage.node.y = 103;
        }else{
            this.playerDiceOneImage.node.x = -431;
            this.playerDiceOneImage.node.y = -122;
            this.playerDiceTwoImage.node.x = -517;
            this.playerDiceTwoImage.node.y = -122;
        }
    }
    
    showShishiJifenChange(fen:number){
        let chaneg:string = fen.toString();
        if(fen > 0){
            chaneg = "+" + fen.toString();
        }
        this.changeLabel.string = fen.toString();
        this.changeLabel.node.active = true;
        this.changeLabel.node.y = 28;
        cc.tween(this.changeLabel.node).to(0.3 , {y :242 }).call(()=>{
            this.showFen(fen);
            this.changeLabel.node.active = false;
        }).start()
    }
    /**展示是否准备好了*/
    public showIsReady(boo:boolean){
        if(boo){
            this.showReadyPoint();
        }
        this.isReadyImage.node.active = boo;
    }
    /***展示空座*/
    public showNone(){
        this.noneGroup.active = true;
        this.headGroup.active = false;
    }
    /**展示有人*/
    public showSit(){
        this.noneGroup.active = false;
        this.headGroup.active = true;
        if(GameInfo.ins.nowGameStatus < PlayStauteEnum.CheckBookMaker){
            if(this.sitInfo && this.sitInfo.onReady){
                this.showIsReady(true)
            }else{
                this.showIsReady(false);
            }
        }
    }

    /**展示名字*/
    private showName(){
        this.nameLabel.string = this.playerInfo.gpid+"";
    }

    /**展示分*/
    showFen(changeFen : number = 0){
        this.myGameFen += changeFen;
        this.countLabel.string = this.myGameFen.toString();
    }

    /**展示漂*/
    private showPiao(isPiao : boolean){
        this.piaoImage.node.active = isPiao;
    }

    /**展示庄*/
    public showZhuang(isZhuang : boolean){
        this.zhuangImage.node.active = isZhuang;
    }

    /***展示矫座动作*/
    public showRollDiceAction(bigNum:number , smallNum:number){
        this.initDicePoint();
        this.showPlayerDice(true);
        cc.tween(this.playerDiceOneImage.node).to(TimeAndMoveManager.ins.zhuangRollTime , {angle : 36000},{easing:cc.easing.quadInOut}).start();
        cc.tween(this.playerDiceTwoImage.node).to(TimeAndMoveManager.ins.zhuangRollTime , {angle : 36000},{easing:cc.easing.quadInOut}).start();
        cc.tween(this.node).delay(TimeAndMoveManager.ins.zhuangRollTime*0.7).call(()=>{
            this.changeCharDiceOver(bigNum , smallNum);
        }).start();
    }
    changeCharDiceOver(bigNum:number , smallNum:number){
        Global.Utils.setNewImageToSprite(this.playerDiceOneImage , "comResource/dice/game_shaizi" + bigNum);
        Global.Utils.setNewImageToSprite(this.playerDiceTwoImage , "comResource/dice/game_shaizi" + smallNum);
    }
    /**展示定缺*/
    public showDingQue(type : CardTypeEnum){
        if(type == CardTypeEnum.EndValue){
            this.queImage.node.active = false;
        }else{
            this.queImage.node.active = true;
            let url : string = "comResource/font/game_biaoshi2";
            switch(type){
                case CardTypeEnum.Wan:
                    url = 'comResource/font/game_biaoshi2';
                break;
                case CardTypeEnum.Tiao:
                    url = 'comResource/font/game_biaoshi3';
                break;
                case CardTypeEnum.Tong:
                    url = 'comResource/font/game_biaoshi4';
                break;
            }
            Global.Utils.setNewImageToSprite(this.queImage , url);
        }
    }
    /**展示定庄骰子*/
    showDiceBookMaker(msg:Msg_SC_DiceRslt){
        let toX:Array<number> = [];
        let toY:number;
        console.log(":this.node.x=="+this.node.x+">>>>"+this.node.y)
        if(this.node.x == 36 || this.node.x == 26){
            if(this.node.y == -669 || this.node.y == -679){
                toX[0] = 864;
                toX[1] = 1007;
                toY = 407;
                this.playerDiceOneImage.node.x = 190;
                this.playerDiceOneImage.node.y = 49;
                this.playerDiceTwoImage.node.x = 297;
                this.playerDiceTwoImage.node.y = 49;
            }else{
                toX[0] = 861;
                toX[1] = 1009;
                toY = 55;
                this.playerDiceOneImage.node.x = 190;
                this.playerDiceOneImage.node.y = 49;
                this.playerDiceTwoImage.node.x = 297;
                this.playerDiceTwoImage.node.y = 49;
            }
        }else if(this.node.x == 1748 || this.node.x == 1738){
            toX[0] = -852;
            toX[1] = -706;
            toY = 53;
            this.playerDiceOneImage.node.x = -146;
            this.playerDiceOneImage.node.y = 36;
            this.playerDiceTwoImage.node.x = -39;
            this.playerDiceTwoImage.node.y = -36;
        }else{
            toX[0] = -546;
            toX[1] = -398;
            toY = -264;
            this.playerDiceOneImage.node.x = 26;
            this.playerDiceOneImage.node.y = 38;
            this.playerDiceTwoImage.node.x = 132;
            this.playerDiceTwoImage.node.y = 38;
        }
        this.showPlayerDice(true);
        cc.tween(this.playerDiceOneImage.node).to(0.5 , {x:toX[0] , y : toY}).start();
        cc.tween(this.playerDiceTwoImage.node).to(0.5 , {x:toX[1] , y : toY}).start();
        cc.tween(this.playerDiceOneImage.node).to(TimeAndMoveManager.ins.zhuangRollTime , {angle : 36000},{easing:cc.easing.quadInOut}).start();
        cc.tween(this.playerDiceTwoImage.node).to(TimeAndMoveManager.ins.zhuangRollTime , {angle : 36000},{easing:cc.easing.quadInOut}).call(()=>{
            this.diceRotationOver(msg)
        }).start();
        cc.tween(this.node).delay(TimeAndMoveManager.ins.zhuangRollTime*0.7).call(()=>{
            this.changeCharDiceOver(msg.bigNum , msg.smlNum);
        }).start();

    }
    /**定庄骰子结束*/
	private diceRotationOver(msg : Msg_SC_DiceRslt){
        cc.tween(this.node).delay(TimeAndMoveManager.ins.diceRotation).call(()=>{
            if(GameInfo.ins.nowGameStatus == PlayStauteEnum.CheckBookMaker){
                let num:number = (msg.bigNum + msg.smlNum - 1)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType);
                GameInfo.ins.nowBookMakerSit = num;
            }
			this.showPlayerDice(false);
        }).start();
	}
    /**是否展示骰子*/
    showPlayerDice(boo:boolean){
        this.playerDiceOneImage.node.active = boo;
        this.playerDiceTwoImage.node.active = boo;
    }
    /**空座入座点击**/
    onSitDownClick(event, param){
        Global.Utils.debugOutput("PlayerHeadItem ==> 入座点击");
        if(UserInfo.ins.mySitIndex >= 0){
            return;
        }
        Global.EventCenter.dispatchEvent(EventType.PlayerHeadSitClick , this.directionSitNum);
    }

    /**定缺展示**/
    showQue(queType:CardTypeEnum){
        let num:number = 4 + queType;
        let source:string = "comResource/font/game_dingque" + num;
        Global.Utils.setNewImageToSprite(this.queActionImage , source , ()=>{
            this.showQueAction(true , queType);
        });

    }
}
