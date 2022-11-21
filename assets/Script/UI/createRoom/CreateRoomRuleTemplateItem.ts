// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { AntesMultipleEnum } from "../../enum/EnumManager";
import GameInfo from "../../Game/info/GameInfo";
import { GamePiaoTypeEnum, GamePlayTypeEnum, GameRoomTypeEnum, TableRuleInfo, TableRuleTempl } from "../../proto/LobbyMsgDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import CreateRoomHelper from "./CreateRoomHelper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CreateRoomRuleTemplateItem extends UIBase {
    @property (cc.Node)
    changGroup : cc.Node = null;
    @property (cc.Node)
    deletGroup : cc.Node = null;
    @property (cc.Node)
    roomTypeGroup : cc.Node = null;
    @property (cc.Toggle)
    selectBox : cc.Toggle = null;
    @property (cc.Sprite)
    gameTypeImage : cc.Sprite = null;
    @property (cc.Sprite)
    coinImage : cc.Sprite = null;
    @property (cc.Sprite)
    handsImage : cc.Sprite = null;
    @property (cc.Sprite)
    piaoImage : cc.Sprite = null;
    @property (cc.Sprite)
    horseImage : cc.Sprite = null;
    @property (cc.Label)
    roomNameLabel : cc.Label = null;
    @property (cc.Label)
    needCoinsLabel : cc.Label = null;
    @property (cc.Label)
    gameHandsLabel : cc.Label = null;
    @property (cc.Label)
    piaoLabel : cc.Label = null;
    @property (cc.Label)
    horseNumLabel : cc.Label = null;

    private ruleInfo : TableRuleInfo;

	private ruleTemplate : TableRuleTempl;

	private callBack : Function ;
	private thisObj : any;
    protected onLoad(): void {
    }
    setData(ruleInfo : TableRuleTempl , callBack : Function , thisOnj : any){
        this.ruleInfo = ruleInfo.rule;
		this.ruleTemplate = ruleInfo;
		this.callBack = callBack;
		this.thisObj = thisOnj;
        this.createElements();
    }
    private createElements(){
		this.showGameType();
		this.showRoomType(); 
		this.roomNameLabel.string = this.ruleTemplate ? this.ruleTemplate.name : "";
		this.needCoinsLabel.string = this.getAll(this.ruleInfo.baseScore).toString();
		this.gameHandsLabel.string = this.ruleInfo.handsCnt + "手";
		this.showPiao();
		this.showMa();
		this.setSelect(false);
    }
	private getAll(nowAntes):number{
		let isOpenBookmakerMustBuyHorse:boolean = false;
		let allMut : number = 0;
		allMut += CreateRoomHelper.ins.initialMultiple;
		if(this.ruleInfo.haveHorse){
			allMut += CreateRoomHelper.ins.openBuyHorseMultiple;
		}
		if(this.ruleInfo.baozi){
			allMut += CreateRoomHelper.ins.openDoubleMultiple;
		}
		if(this.ruleInfo.handsCnt==16){
			allMut += CreateRoomHelper.ins.moreHandMultiple;
		}
		if(this.ruleInfo.gamePlayType==2){
			allMut += CreateRoomHelper.ins.changeThreeMultiple;
		}
		if(this.ruleInfo.isSelectBankerBuyHorse){
			isOpenBookmakerMustBuyHorse = true;
		}
		let allFen : number = nowAntes*allMut;
		if(isOpenBookmakerMustBuyHorse){
			allFen *= CreateRoomHelper.ins.openBookmakerMustBuyHorseMultiple;
		}
		return allFen;
	}
	onBoxClick(){
		this.callBack.bind(this.thisObj)(this ,1);
	}
	onChangeClick(){
		this.callBack.bind(this.thisObj)(this ,2);
	}
	onDeletClick(){
		this.callBack.bind(this.thisObj)(this ,3);
	}
	private showMa(){
		if(this.ruleInfo.haveHorse){
			this.horseImage.node.active = true;
			this.horseNumLabel.node.active = true;
			this.horseNumLabel.string = this.ruleInfo.buyHorseNum == 1 ? "1马" : "2马";
		}else{
			this.horseImage.node.active = false;
			this.horseNumLabel.node.active = false;
		}
	}
	private showPiao(){
		if(this.ruleInfo.baozi == GamePiaoTypeEnum.None){
			this.piaoImage.node.active = false;
			this.piaoLabel.node.active = false;
		}else{
			this.piaoImage.node.active = true;
			this.piaoLabel.node.active = true;
			if(this.ruleInfo.baozi == GamePiaoTypeEnum.ZhuangJiaBiPiao){
				this.piaoLabel.string = "庄家必飘";
			}else{
				let str : string = "";
				if(this.ruleInfo.baozi == GamePiaoTypeEnum.ShuaiPiao){
					str = "甩飘"
				}else{
					str = "豹子"
				}
				if(this.ruleInfo.baoziDouble){
					str += "(双豹)"
				}
				this.piaoLabel.string = str;
			}
		}
	}
	private showGameType(){
		let type:GamePlayTypeEnum = this.ruleInfo.gamePlayType;
        let source : string = "createRoom/resource/createRoom_xuezhan";
        if(type == GamePlayTypeEnum.HuanSanZhang){
            source = "createRoom/resource/createRoom_huansan"
        }
        Global.Utils.setNewImageToSprite(this.gameTypeImage , source);
	}
	private showRoomType(){
		let type:GameRoomTypeEnum = this.ruleInfo.roomType;
		let roomStr:string = "";
		switch(type){
			case GameRoomTypeEnum.SiRenSanFang : 
				roomStr = "四人三房";
			break;
			case GameRoomTypeEnum.SiRenLiangFang : 
				roomStr = "四人两房";
			break;
			case GameRoomTypeEnum.SanRenLiangFang : 
				roomStr = "三人两房";
			break;
			case GameRoomTypeEnum.LiangRenMaJiang : 
				roomStr = "两人两房";
			break;
		}
        cc.find("/label" , this.roomTypeGroup).getComponent(cc.Label).string = roomStr;
	}
	public getRuleInfo():TableRuleTempl {
		let temp : TableRuleTempl = new TableRuleTempl();
		temp.rule = this.ruleInfo;
		temp.name = this.roomNameLabel.string;
		temp.templId = this.ruleTemplate ? this.ruleTemplate.templId  : null;
		return temp;
	}
	public getRuleName():string{
		return this.roomNameLabel.string;
	}
	public setSelect(boo:boolean){
        if(boo){
            this.selectBox.check();
        }else{
            this.selectBox.uncheck();
        }
	}
	public getSelect():boolean{
		return this.selectBox.isChecked;
	}
	public disTory(){
		super.disTory();
	}
}
