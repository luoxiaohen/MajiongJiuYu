// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { AntesMultipleEnum } from "../../enum/EnumManager";
import EventCenter from "../../event/EventCenter";
import EventType from "../../event/EventType";
import GameInfo from "../../Game/info/GameInfo";
import TimeAndMoveManager from "../../mgr/TimeAndMoveManager";
import { GamePiaoTypeEnum, GamePlayTypeEnum, TableRuleInfo, TableRuleTempl } from "../../proto/LobbyMsgDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import CreateCheckItem from "./CreateCheckItem";
import CreateRoomHelper from "./CreateRoomHelper";
import CreateRoomRuleItem from "./CreateRoomRuleItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FeaturesRuleItem extends CreateRoomRuleItem {

    @property (cc.Button)
    piaoQustionBtn : cc.Button = null;
    @property (cc.Button)
    maQustionBtn : cc.Button = null;
    @property (cc.Node)
    piaoGroup : cc.Node = null;
    @property (cc.Node)
    piaoItemGroup : cc.Node = null;
    @property (cc.Node)
    maGroup : cc.Node = null;
    @property (cc.Node)
    maMoveGroup : cc.Node = null;
    @property (cc.Node)
    maItemGroup : cc.Node = null;
    
    private zhuangjiePiaoBox : CreateCheckItem;
    private shuaipiaoBox : CreateCheckItem;
    private baoziBox : CreateCheckItem;
    private shuangbaoBox : CreateCheckItem;
    private yimaBox : CreateCheckItem;
    private liangmaBox : CreateCheckItem;
    private huomaBox : CreateCheckItem;
    private simaBox : CreateCheckItem;
    private zhuangjiamaBox : CreateCheckItem;
    private buchiBox : CreateCheckItem;


    private isOpenPiao:GamePiaoTypeEnum;
	private doubleBao : number = 0;
	private nowGamePlayType : GamePlayTypeEnum;

	private haveHorse:number = 0;
	private buyHorseNum : number = 0;
	private buyHorseType : number = 0;
	private isSelectBankerBuyHorse : number = 0
	private isSelectEatHorse : number = 0



    protected onLoad(): void {
    }
	
	public setData(temp: TableRuleTempl): void {
		super.setData(temp);
        this.initElements();
	}
    private initElements(){
        this.addItems();
		GameInfo.ins.addItemToMultipleArray(AntesMultipleEnum.initial) ;
		this.itemWeights = 998;
		this.changeHeight = 271;
        if(this.ruleInfo){
			this.nowGamePlayType = this.ruleInfo.gamePlayType;
			this.isOpenPiao = this.ruleInfo.baozi;
			this.doubleBao = this.ruleInfo.baoziDouble;
			this.showPiaoData();
			if(this.isOpenPiao){
				this.maMoveGroup.y = -604;
				this.piaoItemGroup.scaleY = 1;
                this.piaoItemGroup.active = true;
                this.showOrHide(this.piaoGroup , true);
			}else{
				this.maMoveGroup.y = -304;
				this.piaoItemGroup.scaleY = 0;
                this.piaoItemGroup.active = false;
                this.showOrHide(this.piaoGroup , false);
			}

			this.haveHorse = this.ruleInfo.haveHorse;
			this.buyHorseNum = this.ruleInfo.buyHorseNum;
			this.buyHorseType = this.ruleInfo.buyHorseType;
			this.isSelectBankerBuyHorse = this.ruleInfo.isSelectBankerBuyHorse;
			this.isSelectEatHorse = this.ruleInfo.isSelectEatHorse;
			this.showMaData();

			if(this.haveHorse){
				this.maItemGroup.scaleY = 1;
                this.maItemGroup.active = true;
                this.showOrHide(this.maGroup , true);
			}else{
				this.maItemGroup.scaleY = 0;
                this.maItemGroup.active = false;
                this.showOrHide(this.maGroup , false);
			}

			if(this.isOpenPiao == 0 && this.haveHorse == 0){
				this.node.height = 467;
			}else if(this.isOpenPiao > 0 && this.haveHorse == 0){
				this.node.height = 738;
			}else if(this.isOpenPiao == 0 && this.haveHorse == 1){
				this.node.height = 844;
			}else if(this.isOpenPiao > 0 && this.haveHorse == 1){
				this.node.height = 1144;
			}

		}else{
			this.nowGamePlayType = GamePlayTypeEnum.XueZhanDaoDi;
			this.initItem()

		}

		this._height = this.getHeight();

		this.addEvent();
    }
    private initItem(){
		this.haveHorse = 0;
		this.buyHorseNum = 0;
		this.buyHorseType = 0;
		this.isSelectBankerBuyHorse = 0;
		this.isSelectEatHorse = 0;

		this.isOpenPiao = GamePiaoTypeEnum.None;
		this.maMoveGroup.y = -304;
		this.piaoItemGroup.scaleY = 0;
        this.piaoItemGroup.active = false;
        this.showOrHide(this.piaoGroup , false);
        this.showOrHide(this.maGroup , false);
		this.showPiaoData();
		this.showMaData();

	}
    private addEvent(){
		Global.EventCenter.addEventListener(EventType.GameRuleChangePlayType , this.onChangeGameType , this)

		this.piaoGroup.on(cc.Node.EventType.TOUCH_START , this.onPiaoClick , this);

		this.maGroup.on(cc.Node.EventType.TOUCH_START , this.onMaGroupClick , this);
		Global.EventCenter.addEventListener(EventType.CreateRoom_Check_Click , this.onCheckClick , this);


		this.piaoQustionBtn.node.on(cc.Node.EventType.TOUCH_START , this.onPiaoQuestionClick , this);
		this.maQustionBtn.node.on(cc.Node.EventType.TOUCH_START , this.onMaQuestionClick , this);
	}
    private onPiaoQuestionClick(){
		Global.EventCenter.dispatchEvent(EventType.CreateRoomRuleTipsClick , 3);
	}
	private onMaQuestionClick(){
		Global.EventCenter.dispatchEvent(EventType.CreateRoomRuleTipsClick , 4);
	}
    private onMaGroupClick(e){
		if(CreateRoomHelper.ins.gameRuleItemIsMove){
			return;
		}
		this.clearAllMa();
		if(this.haveHorse){
			this.hideMa();
			GameInfo.ins.removeItemByMultipleArray(AntesMultipleEnum.openBuyHorse);
			GameInfo.ins.removeItemByMultipleArray(AntesMultipleEnum.openBookmakerMustBuyHorse);
		}else{
			this.openMa();
			GameInfo.ins.addItemToMultipleArray(AntesMultipleEnum.openBuyHorse);
		}
		this.showMaData();
		Global.EventCenter.dispatchEvent(EventType.OpenRoomUseChange);
	}
    private hideMa(){
		this.haveHorse = 0;
        this.showOrHide(this.maGroup , false);
		
		this.isMoveUp = true;
		CreateRoomHelper.ins.gameRuleItemIsMove = true;
		this.changeHeight = 377;
		let nowHeight : number = this.node.height;
        cc.tween(this.node).to(this.changeHeight*TimeAndMoveManager.ins.gameRuleItemMoveTime , {height : nowHeight - this.changeHeight}).start();
        cc.tween(this.maItemGroup).to(this.changeHeight*TimeAndMoveManager.ins.gameRuleItemMoveTime , {scaleY:0}).call(()=>{
            CreateRoomHelper.ins.gameRuleItemIsMove = false;
            this.maItemGroup.active = false;
        }).start();
		this.disPatchMove(this);
	}
	private openMa(){
		this.haveHorse = 1;
		this.buyHorseNum = 1;
        this.showOrHide(this.maGroup , true);
		this.isMoveUp = false;
		CreateRoomHelper.ins.gameRuleItemIsMove = true;
		this.changeHeight = 377;
		let nowHeight : number = this.node.height;
        this.maItemGroup.active = true;
        cc.tween(this.node).to(this.changeHeight*TimeAndMoveManager.ins.gameRuleItemMoveTime , {height : nowHeight + this.changeHeight}).start();
        cc.tween(this.maItemGroup).to(this.changeHeight*TimeAndMoveManager.ins.gameRuleItemMoveTime , {scaleY:1}).call(()=>{
            CreateRoomHelper.ins.gameRuleItemIsMove = false;
        }).start();
		this.disPatchMove(this);
	}
    private clearAllMa(){
		this.yimaBox.showSelect(false);
		this.liangmaBox.showSelect(false);
		this.huomaBox.showSelect(false);
		this.simaBox.showSelect(false);
		this.zhuangjiamaBox.showSelect(false);
		this.buchiBox.showSelect(false);

		this.yimaBox.textColor(CreateRoomHelper.ins.colorData[1]);
		this.liangmaBox.textColor(CreateRoomHelper.ins.colorData[1]);
		this.huomaBox.textColor(CreateRoomHelper.ins.colorData[1]);
		this.simaBox.textColor(CreateRoomHelper.ins.colorData[1]);
		this.zhuangjiamaBox.textColor(CreateRoomHelper.ins.colorData[1]);
		this.buchiBox.textColor(CreateRoomHelper.ins.colorData[1]);
	}
    private onPiaoClick(e){
		if(CreateRoomHelper.ins.gameRuleItemIsMove){
			return;
		}
		if(this.isOpenPiao){
			this.hidePiao();
			GameInfo.ins.removeItemByMultipleArray(AntesMultipleEnum.openDouble);
		}else{
			this.openPiao();
			GameInfo.ins.addItemToMultipleArray(AntesMultipleEnum.openDouble);
		}
		this.showPiaoData();
		Global.EventCenter.dispatchEvent(EventType.OpenRoomUseChange);
	}
    private hidePiao(){
		this.isOpenPiao = GamePiaoTypeEnum.None;
        this.showOrHide(this.piaoGroup , false);
		this.isMoveUp = true;
		CreateRoomHelper.ins.gameRuleItemIsMove = true;
		this.changeHeight = 304;
		let nowHeight : number = this.node.height;
        cc.tween(this.node).to(this.changeHeight*TimeAndMoveManager.ins.gameRuleItemMoveTime , {height : nowHeight - this.changeHeight}).start();
        cc.tween(this.piaoItemGroup).to(this.changeHeight*TimeAndMoveManager.ins.gameRuleItemMoveTime , {scaleY:0}).start()
        cc.tween(this.maMoveGroup).to(this.changeHeight*TimeAndMoveManager.ins.gameRuleItemMoveTime , {y : -304}).call(()=>{
            CreateRoomHelper.ins.gameRuleItemIsMove = false;
            this.piaoItemGroup.active = false;
        }).start();
		this.disPatchMove(this);
	}
	private openPiao(){
		this.isOpenPiao = GamePiaoTypeEnum.ShuaiPiao;
        this.showOrHide(this.piaoGroup , true);
		this.isMoveUp = false;
		CreateRoomHelper.ins.gameRuleItemIsMove = true;
		this.changeHeight = 304;
		let nowHeight : number = this.node.height;
        this.piaoItemGroup.active = true;
        cc.tween(this.node).to(this.changeHeight*TimeAndMoveManager.ins.gameRuleItemMoveTime , {height : nowHeight + this.changeHeight}).start();
        cc.tween(this.piaoItemGroup).to(this.changeHeight*TimeAndMoveManager.ins.gameRuleItemMoveTime , {scaleY:1}).start()
        cc.tween(this.maMoveGroup).to(this.changeHeight*TimeAndMoveManager.ins.gameRuleItemMoveTime , {y : -604}).call(()=>{
            CreateRoomHelper.ins.gameRuleItemIsMove = false;
        }).start();
		this.disPatchMove(this);
	}
    private onChangeGameType(e,data){
		let type:GamePlayTypeEnum = data;
		this.nowGamePlayType = type;
		this.showDoubleBao();
	}

    public getHeight():number{
		if(this.isOpenPiao == 0 && this.haveHorse == 0){
			return 467;
		}else if(this.isOpenPiao > 0 && this.haveHorse == 0){
			return 738;
		}else if(this.isOpenPiao == 0 && this.haveHorse == 1){
			return 844;
		}else if(this.isOpenPiao > 0 && this.haveHorse == 1){
			return 1144;
		}
	}
    private showMaData(){
		if(this.buyHorseNum == 1){
			this.yimaBox.showSelect (true);
			this.yimaBox.textColor(CreateRoomHelper.ins.colorData[2]);
			this.buchiBox.showEnabled(false);
			this.buchiBox.showSelect(false);
			if(this.isSelectEatHorse){
				this.isSelectEatHorse = 0;
			}
			this.buchiBox.textColor(CreateRoomHelper.ins.colorData[3]);


			this.liangmaBox.showSelect (false);
			this.liangmaBox.textColor(CreateRoomHelper.ins.colorData[1]);

		}else if(this.buyHorseNum == 2){ 
			this.liangmaBox.showSelect (true);
			this.liangmaBox.textColor(CreateRoomHelper.ins.colorData[2]);
			this.buchiBox.showEnabled(true);
			this.buchiBox.textColor(CreateRoomHelper.ins.colorData[1]);

			this.yimaBox.showSelect (false);
			this.yimaBox.textColor(CreateRoomHelper.ins.colorData[1]);
		}

		if(this.buyHorseType == 1){
			this.huomaBox.showSelect(true);
			this.huomaBox.textColor(CreateRoomHelper.ins.colorData[2]);

			this.simaBox.showSelect(false);
			this.simaBox.textColor(CreateRoomHelper.ins.colorData[1]);
		}else if(this.buyHorseType == 2){
			this.simaBox.showSelect(true);
			this.simaBox.textColor(CreateRoomHelper.ins.colorData[2]);

			this.huomaBox.showSelect(false);
			this.huomaBox.textColor(CreateRoomHelper.ins.colorData[1]);
		}

		if(this.isSelectBankerBuyHorse){
			this.zhuangjiamaBox.textColor(CreateRoomHelper.ins.colorData[2]);
		}else{
			this.zhuangjiamaBox.textColor(CreateRoomHelper.ins.colorData[1]);
		}

		if(this.isSelectEatHorse){
			this.buchiBox.textColor(CreateRoomHelper.ins.colorData[2]);
		}else{
			if(this.buyHorseNum == 2){
				this.buchiBox.textColor(CreateRoomHelper.ins.colorData[1]);
			}else{
				this.buchiBox.textColor(CreateRoomHelper.ins.colorData[3]);
			}
		}

	}
    private showPiaoData(){
		this.clearAllPiao();
		if(this.isOpenPiao){
			this.showPiao();
		}else{
			this.doubleBao = 0;
		}
	}
    private clearAllPiao(){
		this.zhuangjiePiaoBox.showSelect(false);
		this.shuaipiaoBox.showSelect(false);
		this.baoziBox.showSelect(false);
		this.zhuangjiePiaoBox.textColor(CreateRoomHelper.ins.colorData[1]);
		this.shuaipiaoBox.textColor(CreateRoomHelper.ins.colorData[1]);
		this.baoziBox.textColor(CreateRoomHelper.ins.colorData[1]);
	}
    private showPiao(){
		if(this.isOpenPiao == GamePiaoTypeEnum.ZhuangJiaBiPiao){
			this.zhuangjiePiaoBox.showSelect(true);
			this.zhuangjiePiaoBox.textColor(CreateRoomHelper.ins.colorData[2]);
			this.shuangbaoBox.showSelect(false);
			this.shuangbaoBox.textColor(CreateRoomHelper.ins.colorData[3]);
			this.shuangbaoBox.showEnabled(false);
		}else if(this.isOpenPiao == GamePiaoTypeEnum.ShuaiPiao){
			this.shuaipiaoBox.showSelect(true);
			this.shuaipiaoBox.textColor(CreateRoomHelper.ins.colorData[2]);
		}else if(this.isOpenPiao == GamePiaoTypeEnum.Baozi){
			this.baoziBox.showSelect(true);
			this.baoziBox.textColor(CreateRoomHelper.ins.colorData[3]);
		}
		this.showDoubleBao()
	}
    private showDoubleBao(){
		if(this.nowGamePlayType == GamePlayTypeEnum.HuanSanZhang){
			this.shuangbaoBox.node.active = true;
			if(this.isOpenPiao == GamePiaoTypeEnum.ZhuangJiaBiPiao){
				//不可选
				this.doubleBao = 0;
				this.shuangbaoBox.showSelect(false);
				this.shuangbaoBox.textColor(CreateRoomHelper.ins.colorData[3]);
				this.shuangbaoBox.showEnabled(false);
			}else{
				this.shuangbaoBox.showEnabled(true);
				if(this.doubleBao == 0){
					//可选未选
					this.shuangbaoBox.showSelect(false);
					this.shuangbaoBox.textColor(CreateRoomHelper.ins.colorData[1]);
				}else{
					//已选择
					this.shuangbaoBox.showSelect(true);
					this.shuangbaoBox.textColor(CreateRoomHelper.ins.colorData[2]);
				}
			}
		}else{
			//不展示
			this.shuangbaoBox.node.active  = false;
		}
	}
    private showOrHide(node : cc.Node , isShow:boolean){
        let color : cc.Color = isShow ? new cc.Color(255,255,255) : new cc.Color(103,101,75);
        let fontImage : cc.Sprite;
        fontImage = cc.find("/bgImage" , node).getComponent(cc.Sprite);
        fontImage.node.color = color;
        fontImage = cc.find("/moveImage" , node).getComponent(cc.Sprite);
        fontImage.node.x = isShow ? -9 : 73;
    }
    
	private onShuangBaoClick(){
		if(this.isOpenPiao == GamePiaoTypeEnum.ZhuangJiaBiPiao){
			return;
		}
		// this.shuangbaoBox.showSelect(!this.shuangbaoBox.isCheck());
		this.doubleBao = this.doubleBao == 0 ? 1 : 0;
	}
	private onZhuangPiaoClick(){
		this.isOpenPiao = GamePiaoTypeEnum.ZhuangJiaBiPiao;
		this.showPiaoData();
	}
	private onShuaiPiaoClick(){
		this.isOpenPiao = GamePiaoTypeEnum.ShuaiPiao;
		this.showPiaoData();
	}
	private onBaoziClick(){
		this.isOpenPiao = GamePiaoTypeEnum.Baozi;
		this.showPiaoData();
	}
    private onYiMaClick(){
		this.buyHorseNum = 1;
		this.showMaData();
		this.liangmaBox.showSelect(false);
		this.liangmaBox.textColor(CreateRoomHelper.ins.colorData[1]);
	}
	private onliangMaClick(){
		this.buyHorseNum = 2;
		this.showMaData();
		this.yimaBox.showSelect(false);
		this.yimaBox.textColor(CreateRoomHelper.ins.colorData[1]);
	}
	private onHuoMaClick(){
		this.buyHorseType = 1;
		this.showMaData();
		this.simaBox.showSelect(false);
		this.simaBox.textColor(CreateRoomHelper.ins.colorData[1]);
	}
	private onSiMaClick(){
		this.buyHorseType = 2;
		this.showMaData();
		this.huomaBox.showSelect(false);
		this.huomaBox.textColor(CreateRoomHelper.ins.colorData[1]);
	}
	private onZhuangMaClick(){
		this.isSelectBankerBuyHorse = this.zhuangjiamaBox.isCheck() ? 1 : 0;
		
		this.showMaData();
		if(this.isSelectBankerBuyHorse){
			GameInfo.ins.addItemToMultipleArray(AntesMultipleEnum.openBookmakerMustBuyHorse);
		}else{
			GameInfo.ins.removeItemByMultipleArray(AntesMultipleEnum.openBookmakerMustBuyHorse);
		}
		Global.EventCenter.dispatchEvent(EventType.OpenRoomUseChange);
	}
	private onBuChiClick(){
		this.isSelectEatHorse = this.isSelectEatHorse == 0 ? 1 : 0;
		this.showMaData();
	}
    private onCheckClick(e,data){
		let item : CreateCheckItem = data;
		switch(item.boxValue){
			case 5:
                this.onZhuangPiaoClick();
			break;
			case 6:
                this.onShuaiPiaoClick();
            break;
			case 7:
                this.onBaoziClick();
            break;
			case 8:
                this.onShuangBaoClick();
			break;
			case 9:
                this.onYiMaClick();
			break;
			case 10:
                this.onliangMaClick();
			break;
			case 11:
                this.onHuoMaClick();
			break;
			case 12:
                this.onSiMaClick();
			break;
			case 13:
                this.onZhuangMaClick();
			break;
			case 14:
                this.onBuChiClick();
			break;
		}
	}

    private addItems(){
        let prefab : cc.Prefab = Global.Utils.getPreFabBySource("createRoom/prefab/CreateCheckItem")
        this.zhuangjiePiaoBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.zhuangjiePiaoBox.node.x = 92;
        this.zhuangjiePiaoBox.node.y = -114;
        this.zhuangjiePiaoBox.setData(5,false,2,true);
        this.piaoItemGroup.addChild(this.zhuangjiePiaoBox.node);

        this.shuaipiaoBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.shuaipiaoBox.node.x = 443;
        this.shuaipiaoBox.node.y = -114;
        this.shuaipiaoBox.setData(6,false,2,true);
        this.piaoItemGroup.addChild(this.shuaipiaoBox.node);

        this.baoziBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.baoziBox.node.x = 692;
        this.baoziBox.node.y = -114;
        this.baoziBox.setData(7,false,2,true);
        this.piaoItemGroup.addChild(this.baoziBox.node);

        this.shuangbaoBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.shuangbaoBox.node.x = 92;
        this.shuangbaoBox.node.y = -214;
        this.shuangbaoBox.setData(8,false,1,true);
        this.piaoItemGroup.addChild(this.shuangbaoBox.node);

        this.yimaBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.yimaBox.node.x = 92;
        this.yimaBox.node.y = -120;
        this.yimaBox.setData(9,false,2,true);
        this.maItemGroup.addChild(this.yimaBox.node);

        this.liangmaBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.liangmaBox.node.x = 502;
        this.liangmaBox.node.y = -120;
        this.liangmaBox.setData(10,false,2,true);
        this.maItemGroup.addChild(this.liangmaBox.node);

        this.huomaBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.huomaBox.node.x = 92;
        this.huomaBox.node.y = -220;
        this.huomaBox.setData(11,false,2,true);
        this.maItemGroup.addChild(this.huomaBox.node);

        this.simaBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.simaBox.node.x = 502;
        this.simaBox.node.y = -220;
        this.simaBox.setData(12,false,2,true);
        this.maItemGroup.addChild(this.simaBox.node);

        this.zhuangjiamaBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.zhuangjiamaBox.node.x = 92;
        this.zhuangjiamaBox.node.y = -329;
        this.zhuangjiamaBox.setData(13,false,1,true);
        this.maItemGroup.addChild(this.zhuangjiamaBox.node);
        
        this.buchiBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.buchiBox.node.x = 502;
        this.buchiBox.node.y = -329;
        this.buchiBox.setData(14,false,1,true);
        this.maItemGroup.addChild(this.buchiBox.node);


    }

	public getSelectData():TableRuleInfo{
		for(let key in this.tableInfo){
			this.tableInfo[key] = null;
		}
		this.tableInfo.baozi = this.isOpenPiao;
		this.tableInfo.baoziDouble = this.doubleBao;
		this.tableInfo.haveHorse = this.haveHorse;
		this.tableInfo.buyHorseNum = this.buyHorseNum;
		this.tableInfo.buyHorseType = this.buyHorseType;
		this.tableInfo.isSelectBankerBuyHorse = this.isSelectBankerBuyHorse;
		this.tableInfo.isSelectEatHorse = this.isSelectEatHorse;

		return this.tableInfo;
	}


	disTory(){

		super.disTory()
	}
}
