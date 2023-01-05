// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { DirectionEnum, TurnTableItemStateEnum, } from "../enum/EnumManager";
import GameInfo from "../Game/info/GameInfo";
import { Global } from "../Shared/GloBal";
import Utils from "../Shared/Utils";
import UIBase from "../UIBase";

const { ccclass, property } = cc._decorator;

class SeabedItem {
    public dir: DirectionEnum;
    public spiteNode: cc.Node;
    public labelNode: cc.Node;
    public sprite: cc.Sprite;
    private label: cc.Label;
    private spriteAnim:cc.Animation;
    private labelAnim:cc.Animation;
    constructor(_dir, _spriteNode,labelNode, _sprite, _label) {
        this.dir = _dir;
        this.spiteNode = _spriteNode;
        this.labelNode = labelNode;

        this.sprite = _sprite;
        this.label = _label;
        this.spriteAnim=this.spiteNode.getComponent(cc.Animation);
        this.labelAnim=this.labelNode.getComponent(cc.Animation);
    }
    public set labelShow(_value:string){
        if(_value!="out"){
            this.label.string=_value;
        }
    }
    public playAnim():void{
        this.spriteAnim.play();
        this.labelAnim.play();
    }
    public stopAnim():void{
        this.spriteAnim.stop();
        this.labelAnim.stop();
        this.spiteNode.opacity=255;
        this.labelNode.opacity=255;
    }
    public reset():void{
       this.stopAnim();
    }
}

class PlayerDirecItem {
    public dir: DirectionEnum;
    public lightNode: cc.Node;
    public darkNode: cc.Node;
    public lightSprite: cc.Sprite;
    public darkSprite: cc.Sprite;
    public seabedItem: SeabedItem;
    private playerState: TurnTableItemStateEnum;
    private lightAnim:cc.Animation;
    constructor(_dir, _lightNode:cc.Node, _darkNode, _lightSprite, _darkSprite) {
        this.dir = _dir;
        this.lightNode = _lightNode;
        this.darkNode = _darkNode;
        this.lightSprite = _lightSprite;
        this.darkSprite = _darkSprite;
        this.playerState = TurnTableItemStateEnum.None;
        this.lightAnim=_lightNode.getComponent(cc.Animation);
    }
    public get PlayerState():number{
        return this.playerState;
    }
    public setSeabedItem(_seabedItem): void {
        this.seabedItem = _seabedItem;
        this.seabedItem.labelShow="";
    }
    public get isSeabedSate():boolean{
        return this.playerState==TurnTableItemStateEnum.CurRoundInSeabed||this.playerState==TurnTableItemStateEnum.NotCurRoundInSeabed;
    }
    public get isFinisheState():boolean{
        return this.playerState==TurnTableItemStateEnum.Finish;
    }
    public setPlayerDirState(_state: TurnTableItemStateEnum,_parm:any=null): void {
        this.stopPlayerAnim();
        this.playerState=_state;
        this.lightNode.active = _state == TurnTableItemStateEnum.CurrentRound|| _state == TurnTableItemStateEnum.NotInRound;
        this.darkNode.active =  _state == TurnTableItemStateEnum.NotInRound||_state==TurnTableItemStateEnum.Finish;
        this.seabedItem.spiteNode.active=this.isSeabedSate;
        switch (_state) {
            case TurnTableItemStateEnum.CurrentRound:
                this.playPlayerAnim();
                break;
            case TurnTableItemStateEnum.NotInRound:
                break;
            case TurnTableItemStateEnum.CurRoundInSeabed:
                this.playPlayerAnim();
                this.seabedItem.labelShow=_parm.value;
                break;
            case TurnTableItemStateEnum.NotCurRoundInSeabed:
                this.seabedItem.labelShow=_parm.value;
                break;
            case TurnTableItemStateEnum.Finish:
                break;
        }
    }

    private playPlayerAnim(): void {
        if (this.isSeabedSate) {
            this.seabedItem.playAnim();
        } else {
            this.lightAnim.play();
        }
    }

    private stopPlayerAnim(): void {
        this.lightAnim.stop();
        this.lightNode.opacity=255;
        this.seabedItem.stopAnim();
    }

    public reset(): void {
        this.playerState = TurnTableItemStateEnum.None;
        this.lightNode.active = true;
        this.stopPlayerAnim();
        this.seabedItem=null;
    }
}
@ccclass
export default class GameTurntablePanel extends UIBase {

    @property(cc.Sprite)
    table_bg: cc.Sprite = null;

    @property(cc.Label)
    label_remain: cc.Label = null;

    @property({ type: cc.Node })
    darkDirectorNodeRoot: cc.Node = null;

    @property({ type: cc.Node })
    lightDirectorNodeRoot: cc.Node = null;

    @property({ type: [cc.Node] })
    darkDirectorNodeArr: cc.Node[] = [];
    darkDirectorSpriteArr: cc.Sprite[] = [];

    @property({ type: [cc.Node] })
    lightDirectorNodeArr: cc.Node[] = [];
    lightDirectorSpriteArr: cc.Sprite[] = [];

    @property({ type: cc.Node })
    seabedStateNodeRoot: cc.Node=null;

    /*** 转盘图片路径*/
    private resSpriteBasePath = "turnTable/resource/";
    /*** 转盘底部图片命名前缀 */
    private resSpriteBgPrefix = "game_fangxiang_";
    /*** 转盘暗图片命名前缀*/
    private resSpriteDarkPrefix = "game_an_zi_";
    /*** 转盘亮图片命名前缀*/
    private resSpriteLightPrefix = "game_fangxiang_zi_";
    /**当前剩余牌数 */
    private nowRemainCardNum: number = 0;

    private nowTableDicType: DirectionEnum = DirectionEnum.Dong;

    // private seabedItemMap:{[key:number]:SeabedItem};
    private playerDirecItemMap: { [key: number]: PlayerDirecItem };
    private nowTurnPlayerDirect: number = 1;
    private sumCardNum = 108;
    private triggerSeabedPlayer: number = -1;
    private playerArr = [1, 2, 3];

    onLoad(): void {
        this.darkDirectorSpriteArr = [];
        this.lightDirectorSpriteArr = [];
        for (let item of this.darkDirectorNodeArr) {
            let sprite = item.getComponent(cc.Sprite);
            sprite && this.darkDirectorSpriteArr.push(sprite);
        }
        for (let item of this.lightDirectorNodeArr) {
            let sprite = item.getComponent(cc.Sprite);
            sprite && this.lightDirectorSpriteArr.push(sprite);
        }
        this.ResetTable();

    }
    protected start() {

    }
    /** 初始化桌面显示（游戏准备阶段） */
    public ResetTable(): void {
        this.playerArr = [0, 1, null, 3];
        this.triggerSeabedPlayer=-1;
        for(let key in this.playerDirecItemMap){
            let item=this.playerDirecItemMap[key];
            item.reset();
        }
        this.playerDirecItemMap={};
        this.initPlayerNodeMap(0,true);
        this.setRemainCardNum(108);
    }

    private ontestbtnclick(): void {
        if (this.nowRemainCardNum <= 0) {
            Global.Utils.debugOutput("当前剩余牌数为0！！！");
            return;
        }
        this.nowTurnPlayerDirect++;
        this.nowTurnPlayerDirect = this.nowTurnPlayerDirect % 4;
        while (!this.playerArr.includes(this.nowTurnPlayerDirect)) {
            this.nowTurnPlayerDirect++;
            this.nowTurnPlayerDirect = this.nowTurnPlayerDirect % 4;
        }
        this.setRemainCardNum(--this.nowRemainCardNum);

        this.SetCurrentTurnState(this.nowRemainCardNum, this.nowTurnPlayerDirect, this.playerArr);
    }
    private onResetBtnClick(): void {
        Global.Utils.debugOutput("重置转盘！！");
        this.ResetTable();
        this.InitPlayerDicType(Global.Utils.getRandomNum(0, 3));
        this.setRemainCardNum(11);
        this.nowTurnPlayerDirect++;
        this.nowTurnPlayerDirect = this.nowTurnPlayerDirect % 4;
        while (!this.playerArr.includes(this.nowTurnPlayerDirect)) {
            this.nowTurnPlayerDirect++;
            this.nowTurnPlayerDirect = this.nowTurnPlayerDirect % 4;
        }
        this.SetCurrentTurnState(this.nowRemainCardNum, this.nowTurnPlayerDirect, this.playerArr);
    }

    /**
     * 初始化设置用户玩家位置（游戏开始阶段）
     * @param _direcType DirectionEnum
     * @param _sumCardNum 总牌数
     * @returns 
     */
    public InitPlayerDicType(_direcType: DirectionEnum, _sumCardNum = 108): void {
        this.ResetTable();
        this.sumCardNum = _sumCardNum;
        this.nowTableDicType = _direcType;
        if (this.darkDirectorSpriteArr.length != this.lightDirectorSpriteArr.length) {
            Global.Utils.debugOutput("GameTurntable:   预制体图片数量设置有误!");
            return;
        }
        this.setTableSprite(this.table_bg, this.resSpriteBasePath + this.resSpriteBgPrefix + _direcType);

        this.initPlayerNodeMap(_direcType);
        this.initSeabadMap(_direcType);

    }
    private initPlayerNodeMap(_direcType: DirectionEnum,_isReset:boolean=false): void {
        this.playerDirecItemMap = {};
        let darkSpriteUrl = this.resSpriteBasePath + this.resSpriteDarkPrefix + _direcType;
        let lightSpriteUrl = this.resSpriteBasePath + this.resSpriteLightPrefix + _direcType;
        for (let index = 0; index < 4; index++) {
            let formatIndex = "_" + (index + _direcType) % 4;

            let darkSprite = this.darkDirectorSpriteArr[index];
            let lightSprite = this.lightDirectorSpriteArr[index];
            let darkNode = this.darkDirectorNodeArr[index];
            let lightNode = this.lightDirectorNodeArr[index];
            let mapKey = (index + _direcType) % 4;
            if(!_isReset){
                let playerDirecItem = new PlayerDirecItem(mapKey, lightNode, darkNode, lightSprite, darkSprite);
                this.playerDirecItemMap[mapKey] = playerDirecItem;
            }

            this.setTableSprite(darkSprite, darkSpriteUrl + formatIndex);
            this.setTableSprite(lightSprite, lightSpriteUrl + formatIndex);
        }
    }
    private initSeabadMap(_direcType: DirectionEnum): void {
        let seabedSpiteUrl = this.resSpriteBasePath + this.resSpriteBgPrefix + _direcType + "_";
        for (let index = 0; index < 4; index++) {
            let mapKey = (index + _direcType) % 4;
            let seabedItem = this.seabedStateNodeRoot;
            if (seabedItem) {
                let spriteNode = seabedItem.getChildByName("down_sprite_"+index);
                let numLabelNode = seabedItem.getChildByName("num_label_"+index);
                if (spriteNode && numLabelNode) {
                    let sea_item = new SeabedItem(mapKey, spriteNode,numLabelNode, spriteNode.getComponent(cc.Sprite), numLabelNode.getComponent(cc.Label));
                    this.setTableSprite(sea_item.sprite, seabedSpiteUrl + mapKey);
                    let playerItem = this.playerDirecItemMap[mapKey];
                    if (playerItem) {
                        playerItem.setSeabedItem(sea_item);
                    }
                }
            }
        }

    }
    private setTableSprite(_sprite: cc.Sprite, _url: string): void {
        if (!_sprite || !_url) {
            Global.Utils.debugOutput("GameTurntable:   图片设置出错!");
            return;
        }
        Global.Utils.setNewImageToSprite(_sprite, _url);
    }
    /**
     * 设置当前回合数据（游戏中）
     * @param _remainCardsNum  剩余牌数
     * @param _curentTurnPlayer 当前回合玩家
     * @param _playerArr 当前桌子剩余玩家
     */
    public SetCurrentTurnState(_remainCardsNum: number, _curentTurnPlayer: DirectionEnum, _playerArr: number[]): void {
        this.playerArr = _playerArr;
        for(let index=0;index<_playerArr.length;index++){
            let playerItem = this.playerDirecItemMap[index];
            if(_playerArr[index]==null){
                playerItem.setPlayerDirState(TurnTableItemStateEnum.Finish);
            }
        }
        this.setRemainCardNum(_remainCardsNum);
        this.setTurningPlayer(_curentTurnPlayer);
        this.setSeabedStateData(_playerArr);
    }
    /**
     * 设置当前剩余牌数
     * @param _num 数量
     */
    private setRemainCardNum(_num: number): void {
        this.nowRemainCardNum = _num;
        if (_num >= 0) {
            this.label_remain.string = _num.toString();
        } else {
            this.label_remain.string = "";
        }
    }
    /**
     * @param _playerArr 当前桌上剩余玩家 ,为[]时表示全部
     */
    private setSeabedStateData(_playerArr: number[] = []): void {
        if (this.nowRemainCardNum > 4) {
            return;
        }
        let isTriggerTime=this.nowRemainCardNum == 4;
        if (isTriggerTime) {
            this.triggerSeabedPlayer = this.nowTurnPlayerDirect;
        }
        this.setSeabedStateLabelShow(_playerArr,isTriggerTime);
    }
   
    private setSeabedStateLabelShow(_playerArr: number[],triggerTime:boolean=false): void {
        let remainPlayerNum=0;
        for(let item of _playerArr){
            if(item!=null){
                remainPlayerNum++;
            }
        }
        for (let _player of _playerArr) {
            if(_player==null){
                continue;
            }
            let playerItem = this.playerDirecItemMap[_player];
            let offsetDir = this.getOffsetNum(this.nowTurnPlayerDirect,_player,_playerArr);
            let showNum=this.sumCardNum-this.nowRemainCardNum + offsetDir;
            let showStr=showNum>108?"out":showNum==108?"海底":showNum+"";
            let param={value:showStr};
            if(!triggerTime){
                if(this.nowTurnPlayerDirect==playerItem.dir){
                    playerItem.setPlayerDirState(TurnTableItemStateEnum.CurRoundInSeabed,param);
                }else{
                    playerItem.setPlayerDirState(TurnTableItemStateEnum.NotCurRoundInSeabed,param);
                }
            }else{
                if(this.nowTurnPlayerDirect==playerItem.dir){
                    playerItem.setPlayerDirState(TurnTableItemStateEnum.CurrentRound);
                }else{
                    playerItem.setPlayerDirState(TurnTableItemStateEnum.NotCurRoundInSeabed,param);
                }
            }
        }
    }
    public setSumCardNum(sumCardNum:number):void{
        this.sumCardNum=sumCardNum;
    }

    /**
    * 设置当前轮到的玩家
    * @param _direcEnum DirectionEnum
    */
    private setTurningPlayer(_direcEnum: DirectionEnum): void {
        this.nowTurnPlayerDirect = _direcEnum;
        let turningPlayerItem = this.playerDirecItemMap[_direcEnum];
        if (turningPlayerItem.isFinisheState) {
            Global.Utils.debugOutput("当前轮到的玩家已经结束游戏！！！");
            return;
        }
        for (let key in this.playerDirecItemMap) {
            let playerItem = this.playerDirecItemMap[key];
            if(playerItem.isFinisheState){
                continue;
            }
            let isTurningPlayer = Number(key) == _direcEnum;
            if(!playerItem.isSeabedSate){
                let state=this.getTurnItemState(isTurningPlayer,false);
                playerItem.setPlayerDirState(state);
            }
        }
    }

    private getTurnItemState(_isTurn: boolean, _isSeabed: boolean): TurnTableItemStateEnum {
        let state = TurnTableItemStateEnum.None;
        if (_isTurn) {
            if (_isSeabed) {
                state = TurnTableItemStateEnum.CurRoundInSeabed;
            } else {
                state = TurnTableItemStateEnum.CurrentRound;
            }
        } else {
            if (_isSeabed) {
                state = TurnTableItemStateEnum.NotCurRoundInSeabed;
            } else {
                state = TurnTableItemStateEnum.NotInRound;
            }
        }
        return state;
    }

    private getOffsetNum(_startDir:number,_endDir:number,_playerArr:number[]):number{
        if(this.isUndefiendOrNull(_playerArr[_startDir])||this.isUndefiendOrNull(_playerArr[_endDir])){
            Global.Utils.debugOutput("无法到达位置！！");
            return 0;
        }
        let offset=0;
        for(let index=_startDir;index<_startDir+4;index++){
            if(_playerArr[index%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType)]==null){
                continue;
            }
            if(index%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType)==_endDir){
                break;
            }
            offset++;
        }
        return offset;
    }
    private isUndefiendOrNull(_value:any):boolean{
        return _value==null||_value==undefined;
    }

    disTory(){
        super.disTory();
    }

}
