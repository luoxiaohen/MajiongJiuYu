// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EatCardEnum } from "../../enum/EnumManager";
import GameInfo from "../../Game/info/GameInfo";
import UserInfo from "../../Game/info/UserInfo";
import { MsgMajSer } from "../../proto/TableMsgDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import { PengGangData } from "../../utils/InterfaceHelp";
import MajiongEatItem from "../card/MajiongEatItem";
import MajiongHandCard from "../card/MajiongHandCard";
import MajiongOutCard from "../card/MajiongOutCard";

const {ccclass, property} = cc._decorator;

@ccclass
export default class OverHandCardItem extends UIBase {
    @property (cc.Node)
    cardGroup : cc.Node = null;

    private handArr : Array<number> = [];
	private eatArr : Array<MsgMajSer> = [];
	private huCard : number;
	private _w:number=0;

	private cardScale=0.6;
	private mysit=-1;
	private maxPlayerNum=4;
    public setNewData(eatArr : Array<MsgMajSer> , handCard:Array<number> , huCard:number,cardScale:number=0.6,mysit:number=-1,maxPlayerNum:number=4){
		this.mysit=mysit;
        this.handArr = handCard;
		this.eatArr = eatArr;
		this.huCard = huCard;
		this._w = 0;
		this.cardScale=cardScale;
        this.createElements();
    }
    private createElements(){
		this.cardGroup.removeAllChildren();
        this.showEat();
		this.showHand();
		this.showFeel();
    }
    private showFeel(){
		if(this.huCard > 0){
			let playe : MajiongOutCard = cc.instantiate(Global.Utils.getPreFabBySource("majiongCard/prefab/MajiongOutCard")).getComponent(MajiongOutCard);
			playe.cardValue = this.huCard;
			playe.bySelfPoint = 0;
			this.cardGroup.addChild(playe.node);
			let offsetScale=this.cardScale/0.6;
			playe.node.scaleX = offsetScale; 
			playe.node.scaleY = offsetScale;

			this._w += playe.node.width*offsetScale + 20;
			playe.node.x = this._w
		}
	}
	private showHand(){
		let card : MajiongHandCard;
		let isRemoveHu : boolean = false;
		let dingQueType = GameInfo.ins.dingQueList[this.mysit];
		for(let i = 0 ; i < this.handArr.length ; i++){
			if(this.handArr[i] == this.huCard && !isRemoveHu){
				isRemoveHu = true;
				continue;
			}
			card = cc.instantiate(Global.Utils.getPreFabBySource("majiongCard/prefab/MajiongHandCard")).getComponent(MajiongHandCard);
			card.cardValue = this.handArr[i];
			card.isLoadShow = true;
			card.bySelfPoint = 0;
			card.node.scaleX = this.cardScale; 
			card.node.scaleY = this.cardScale;
			card.node.x = this._w;
			this.cardGroup.addChild(card.node);
			this._w += card.cardSize._w*this.cardScale;

			card.isDice = Global.Utils.getIsDice(card.cardValue, dingQueType);
		}
	}
	private showEat(){
		let eat : MsgMajSer;
		let data:PengGangData;
		let item : MajiongEatItem;
		for(let i = 0 ; i < this.eatArr.length ; i++){
			eat = this.eatArr[i];
			data = new PengGangData();
			data.cardValue = eat.majID;
			data.eatType = this.getEatType(eat.type,eat.targetNum , eat.getType);
			data.havePointBySelf = 0;
			item = cc.instantiate(Global.Utils.getPreFabBySource("majiongCard/prefab/MajiongEatItem")).getComponent(MajiongEatItem);
			item.eatData = data;
			item.node.scaleX = this.cardScale;
			item.node.scaleY = this.cardScale;
			item.node.x = this._w;
			this.cardGroup.addChild(item.node);
			this._w += item.size.x * this.cardScale + 10;
		}
	}
	private getEatType(type : number , sit:number , getType : number):EatCardEnum{
		let point=0;
		if(this.mysit==-1){
			point = (UserInfo.ins.mySitIndex - sit)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType)
		}else{
			point=(this.mysit-sit)%this.maxPlayerNum;
		}
		if(point < 0){
			point = point*-1;
		}
		if(type == 3){
			if(point == 1){
				return EatCardEnum.EatDown;
			}else if(point == 2){
				return EatCardEnum.EatOpposite;
			}else if(point == 3){
				return EatCardEnum.EatUp;
			}
		}else if(type == 4){
			if(getType == 2){
				if(point == 1){
					return EatCardEnum.CrossAllDown;
				}else if(point == 2){
					return EatCardEnum.CrossAllOpp;
				}else if(point == 3){
					return EatCardEnum.CrossAllUp;
				}
			}else{
				if(point == 0){
					return EatCardEnum.CrossSelf;
				}else if(point == 1){
					return EatCardEnum.CrossDown;
				}else if(point == 2){
					return EatCardEnum.CrossOpposite;
				}else if(point == 3){
					return EatCardEnum.CrossUp;
				}
			}
		}
	}
}
