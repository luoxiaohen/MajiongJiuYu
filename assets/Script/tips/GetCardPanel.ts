// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventCenter from "../event/EventCenter";
import EventType from "../event/EventType";
import { Msg_CS_TGMMsg } from "../proto/TableExMsg";
import { Msg_SC_PoolsList } from "../proto/TableMsg";
import { Global } from "../Shared/GloBal";
import UIBase from "../UIBase";
import GetCardItem from "./GetCardItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GetCardPanel extends UIBase {
    @property (cc.Node)
    cardGroup : cc.Node = null;
    @property (cc.Node)
    haveGroup : cc.Node = null;
    @property (cc.Button)
    getHandBtn : cc.Button = null;
    @property (cc.Button)
    closeBtn : cc.Button = null;
    @property (cc.Button)
    getFeelBtn : cc.Button = null;


	private msg:Msg_SC_PoolsList ;

    private lastClick : GetCardItem;
    private allClickCard : Array<number> = [];
    protected onLoad(): void {
        let msg : Msg_CS_TGMMsg = new Msg_CS_TGMMsg();
		msg.cmd = "getpools";
		msg.gmMsg = "1";
		Global.mgr.socketMgr.send(-1 , msg);
		this.addEvent();
    }
	private addEvent(){
        Global.EventCenter.addEventListener(EventType.PoolsList , this.onPoolsList, this);
	}	
    private onPoolsList(e,msg:Msg_SC_PoolsList){
        this.msg = msg;
		this.createElements();
    }
    
	private createElements(){
		if(this.msg.pools){
			this.showPools();
		}else{
			this.showAll();
		}
	}
    private showAll(){
		let card : GetCardItem;
		let index:number = 0;
		for(let i = 1 ; i < 30 ; i++){
			if(i%10 != 0){
				card = cc.instantiate(Global.Utils.getPreFabBySource("tips/GetCardPanel/prefab/GetCardItem")).getComponent(GetCardItem);
				this.cardGroup.addChild(card.node);
                card.setData(i , 4, this.onCardClick,this);
				card.node.x = (i%10 - 1)*130;
				card.node.y = 460 - (index * 140);
			}else{
				index++;
			}
		}
	}
    private showPools(){
		let arr : Array<number> = this.msg.pools;
		let remainArr : Array<number> = [];
		for(let i = 1 ; i < 30 ; i++){
			if(i%0 != 0){
				remainArr[i] = 0;
			}
		}
		for(let i = 0 ; i < arr.length ; i++){
			remainArr[arr[i]] += 1;
		}
		let card : GetCardItem;
		let index:number = 0;
		for(let i = 1 ; i < 30 ; i++){
			if(i%10 != 0){
				card = cc.instantiate(Global.Utils.getPreFabBySource("tips/GetCardPanel/prefab/GetCardItem")).getComponent(GetCardItem);
				this.cardGroup.addChild(card.node);
                card.setData(i , remainArr[i] , this.onCardClick,this)
				card.node.x = (i%10 - 1)*130;
				card.node.y = 460 - (index * 140);
			}else{
				index++;
			}
		}
	}
    private onCardClick(clickCard : GetCardItem){
		if(clickCard.getCardNum() <= 0){
			return;
		}
		this.lastClick = clickCard;
		this.allClickCard.push(clickCard.getCardValue());
		this.showMyHand(clickCard.getCardValue());
	}
	private showMyHand(cardValue : number){
		let card : GetCardItem = cc.instantiate(Global.Utils.getPreFabBySource("tips/GetCardPanel/prefab/GetCardItem")).getComponent(GetCardItem);
		this.haveGroup.addChild(card.node);
		card.node.x = (this.allClickCard.length - 1)*130;
		card.node.y = 0;
        card.setData(cardValue , -1, this.onHandCardClick,this)
	}
	private onHandCardClick(clickCard){
		clickCard.disTory();
		this.allClickCard.splice(this.allClickCard.indexOf(clickCard.getCardValue()) , 1);
		this.haveGroup.removeAllChildren();
		for(let i = 0 ; i < this.allClickCard.length ; i++){
			let card : GetCardItem = cc.instantiate(Global.Utils.getPreFabBySource("tips/GetCardPanel/prefab/GetCardItem")).getComponent(GetCardItem);
			this.haveGroup.addChild(card.node);
            card.setData(this.allClickCard[i] , -1, this.onHandCardClick,this);
			card.node.x = i*130;
			card.node.y = 0;
		}
	}

    onCloseClick(){
        this.disTory();
    }
    onGetFeelClick(){
        let msg : Msg_CS_TGMMsg = new Msg_CS_TGMMsg();
		msg.cmd = "want";
		msg.gmMsg = this.allClickCard[this.allClickCard.length - 1].toString();
		Global.mgr.socketMgr.send(-1, msg);
		this.disTory();
    }
    onGetHandClick(){
        let msg : Msg_CS_TGMMsg = new Msg_CS_TGMMsg();
		msg.cmd = "wanth";
		msg.gmMsg = this.allClickCard.toString();
		Global.mgr.socketMgr.send(-1 , msg);
		this.disTory();
    }
	public disTory(){
		this.haveGroup.removeAllChildren();
		this.cardGroup.removeAllChildren();
		super.disTory()
	}
}
