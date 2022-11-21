// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventType from "../../event/EventType";
import TimeAndMoveManager from "../../mgr/TimeAndMoveManager";
import { TableRuleInfo, TableRuleTempl } from "../../proto/LobbyMsgDef";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import CreateCheckItem from "./CreateCheckItem";
import CreateRoomHelper from "./CreateRoomHelper";
import CreateRoomRuleItem from "./CreateRoomRuleItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FanRuleItem extends CreateRoomRuleItem {
    @property (cc.Node)
    baseGroup : cc.Node = null;
    @property (cc.Node)
    paoGroup : cc.Node = null;
    @property (cc.Node)
    huGroup : cc.Node = null;
    @property (cc.Node)
    zimojiafanGroup : cc.Node = null;
    @property (cc.Node)
    zimojiaPaoGroup : cc.Node = null;
    @property (cc.Node)
    saitaiyangGroup : cc.Node = null;
    @property (cc.Button)
    jichuQustionBtn : cc.Button = null;
    @property (cc.Button)
    zimoQustionBtn : cc.Button = null;
    @property (cc.Button)
    lunzhuangQustionBtn : cc.Button = null;
    @property (cc.Button)
    gpsQustionBtn : cc.Button = null;
    protected onLoad(): void {
    }
	public setData(temp: TableRuleTempl): void {
		super.setData(temp);
        this.initElements();
	}
    private initElements(){
		this.itemWeights = 997;
		this.changeHeight = 199;
        this.addItem();
        this.initRuleInfo();
        this._height = this.getHeight();
		if(this.ruleInfo.sunshine > 0){
			this.saitaiyangGroup.scaleY = 1;
			this.huGroup.y = -1299;
		}else{
			this.saitaiyangGroup.scaleY = 0;
			this.huGroup.y = -1100;
		}
		this.showAllItem();
		this.addEvent();
    }
    private addEvent(){
        

		Global.EventCenter.addEventListener(EventType.CreateRoom_Check_Click , this.onCheckClick , this);

		this.zimojiaPaoGroup.on(cc.Node.EventType.TOUCH_START , this.onZimoPaoClick , this);
		this.zimojiafanGroup.on(cc.Node.EventType.TOUCH_START , this.onZimojiafanClick , this);
        this.jichuQustionBtn.node.on(cc.Node.EventType.TOUCH_START , this.onJichuClick , this);
		this.zimoQustionBtn.node.on(cc.Node.EventType.TOUCH_START , this.onZiMoClick , this);
		this.lunzhuangQustionBtn.node.on(cc.Node.EventType.TOUCH_START , this.onLunZhuangClick , this);
		this.gpsQustionBtn.node.on(cc.Node.EventType.TOUCH_START , this.onGpsQClick , this);
    }
    
    private onCheckClick(e,data){
		let item : CreateCheckItem = data;
		switch(item.boxValue){
			case 15:
                this.onZimoJiaFenClick();
			break;
			case 16:
                this.onMenqingClick();
            break;
			case 17:
                this.onZhongzhangClick();
            break;
			case 18:
                this.onYaojiuClick();
			break;
			case 19:
                this.onJiangduiClick();
			break;
			case 20:
                this.onJiaxinClick();
			break;
			case 21:
                this.onTiandiClick();
			break;
			case 22:
                this.onWujiaoClick();
			break;
			case 23:
                this.onBaoyuClick();
			break;
			case 24:
                this.onJishiyuClick();
			break;
			case 25:
                this.onSaitaiyangClick();
			break;
			case 26:
                this.onLiangangClick();
			break;
			case 27:
                this.onSaitaiyangyuClick();
			break;
			case 28:
                this.onSaitaiyangfanyuClick();
			break;
			case 29:
                this.onGuozhuangClick();
			break;
			case 30:
                this.onGuozhuangPengClick();
			break;
			case 31:
                this.onLiangfenClick();
			break;
			case 32:
                this.onSizhangClick();
			break;
			case 33:
                this.onLiangPaiClick();
			break;
			case 34:
                this.onLiushuiClick();
			break;
			case 35:
                this.onLunzhuangClick();
			break;
			case 36:
                this.onIPClick();
			break;
			case 37:
                this.onGpsClick();
			break;
		}
	}
    private onSaitaiyangyuClick(){
		this.ruleInfo.sunshine = 1;
		this.showSunShine();
	}
	private onSaitaiyangfanyuClick(){
		this.ruleInfo.sunshine = 2;
		this.showSunShine();
	}
	private onGuozhuangClick(){
		this.ruleInfo.passHu = this.ruleInfo.passHu == 1 ? 0 : 1;
		this.showGuozhuangHu();
	}
    private onGuozhuangPengClick(){
        this.ruleInfo.passPeng = this.ruleInfo.passPeng == 1 ? 0 : 1;
		this.showGuozhuangPeng();
    }
	private onLunzhuangClick(){
		this.ruleInfo.lunZhuang = this.ruleInfo.lunZhuang == 1 ? 0 : 1;
		this.showLunzhuang();
	}
	private onLiangfenClick(){
		this.ruleInfo.hu2Score = this.ruleInfo.hu2Score == 1 ? 0 : 1;
		this.showLiangfen();
	}
	private onSizhangClick(){
		this.ruleInfo.last4Hu = this.ruleInfo.last4Hu == 1 ? 0 : 1;
		this.showSizhanghu();
	}
	private onLiangPaiClick(){
		this.ruleInfo.zmOpen = this.ruleInfo.zmOpen == 1 ? 0 : 1;
		this.showZimoliangpai();
	}
	private onLiushuiClick(){
		this.ruleInfo.realTimeCalc = this.ruleInfo.realTimeCalc == 1 ? 0 : 1;
		this.showLiushui();
	}
	private onIPClick(){
		this.ruleInfo.limitIP = this.ruleInfo.limitIP == 1 ? 0 : 1;
		this.showIp();
	}
	private onGpsClick(){
		this.ruleInfo.limitGPS = this.ruleInfo.limitGPS == 1 ? 0 : 1;
		this.showGps();
	}
	private onBaoyuClick(){
		this.ruleInfo.caGua = this.ruleInfo.caGua == 1 ? 0 : 1;
		this.showChagua();
	}
	private onJishiyuClick(){
		this.ruleInfo.jiShiYu = this.ruleInfo.jiShiYu == 1 ? 0 : 1;
		this.showJishiyu();
	}
	private onSaitaiyangClick(){
		if(this.ruleInfo.sunshine){
			this.ruleInfo.sunshine = 0;
		}else{
			this.ruleInfo.sunshine = 1;
		}
		this.showSaitaiyangItem();
		this.showSaitaiyang();
	}

	private showSaitaiyangItem(){
		if(this.ruleInfo.sunshine){
			this.isMoveUp = false;
			CreateRoomHelper.ins.gameRuleItemIsMove = true;
            this.saitaiyangGroup.active = true;
			cc.tween(this.saitaiyangGroup).to(this.changeHeight*TimeAndMoveManager.ins.gameRuleItemMoveTime , {scaleY : 1}).start();
			cc.tween(this.huGroup).to(this.changeHeight*TimeAndMoveManager.ins.gameRuleItemMoveTime , {y : -1299}).call(()=>{
				CreateRoomHelper.ins.gameRuleItemIsMove = false
			}).start();
		}else{
			this.isMoveUp = true;
			CreateRoomHelper.ins.gameRuleItemIsMove = true;
			cc.tween(this.saitaiyangGroup).to(this.changeHeight*TimeAndMoveManager.ins.gameRuleItemMoveTime , {scaleY : 0}).start();
			cc.tween(this.huGroup).to(this.changeHeight*TimeAndMoveManager.ins.gameRuleItemMoveTime , {y : -1100}).call(()=>{
				CreateRoomHelper.ins.gameRuleItemIsMove = false
                this.saitaiyangGroup.active = false;
			}).start();
		}
	}

	private onLiangangClick(){
		this.ruleInfo.allGangShift = this.ruleInfo.allGangShift == 1 ? 0 : 1;
		this.showLiangang();
	}
	private onZimoJiaFenClick(){
		this.ruleInfo.zmType = this.ruleInfo.zmType == 0 ? 0 : 1;
		this.showZimoJIafen();
	}
	private onMenqingClick(){
		this.ruleInfo.menqing = this.ruleInfo.menqing == 1 ? 0 : 1;
		this.showMenqing();
	}
	private onZhongzhangClick(){
		this.ruleInfo.zhongzhang = this.ruleInfo.zhongzhang == 1 ? 0 : 1;
		this.showZhongzhang();
	}
	private onYaojiuClick(){
		this.ruleInfo.yao9 = this.ruleInfo.yao9 == 1 ? 0 : 1;
		this.showYaojiu();
	}
	private onJiangduiClick(){
		this.ruleInfo.jiangdui = this.ruleInfo.jiangdui == 1 ? 0 : 1;
		this.showJiangdui();
	}
	private onJiaxinClick(){
		this.ruleInfo.jiaxin5 = this.ruleInfo.jiaxin5 == 1 ? 0 : 1;
		this.showJiaxin();
	}
	private onTiandiClick(){
		this.ruleInfo.tdHu = this.ruleInfo.tdHu == 1 ? 0 : 1;
		this.showTiandihu();
	}
	private onWujiaoClick(){
		this.ruleInfo.findMaxHu = this.ruleInfo.findMaxHu == 1 ? 0 : 1;
		this.showFindMax();
	}
	private onZimoPaoClick(){
		if(this.ruleInfo.dianGangHua == 1){
			this.ruleInfo.dianGangHua = 2;
		}else{
			this.ruleInfo.dianGangHua = 1;
		}
		this.showZimoPao();
	}
	private onZimojiafanClick(){
		if(this.ruleInfo.zmType == 1){
			this.ruleInfo.zmType = 2;
		}else{
			this.ruleInfo.zmType = 1;
		}
		this.showZimoFan();
	}
	private onJichuClick(){
		Global.EventCenter.dispatchEvent(EventType.CreateRoomRuleTipsClick , 5);
	}
	private onZiMoClick(){
		Global.EventCenter.dispatchEvent(EventType.CreateRoomRuleTipsClick , 6);
	}
	private onLunZhuangClick(){
		Global.EventCenter.dispatchEvent(EventType.CreateRoomRuleTipsClick , 7);
	}
	private onGpsQClick(){
		Global.EventCenter.dispatchEvent(EventType.CreateRoomRuleTipsClick , 8);
	}
	private showAllItem(){
		this.showSunShine();
		this.showZimoPao();
		this.showZimoFan();
		this.showZimoJIafen();
		this.showMenqing();
		this.showZhongzhang();
		this.showYaojiu();
		this.showJiangdui();
		this.showJiaxin();
		this.showTiandihu();
		this.showFindMax();
		this.showChagua();
		this.showJishiyu();
		this.showSaitaiyang();
		this.showLiangang();
		this.showGuozhuangHu();
		this.showLunzhuang();
		this.showLiangfen();
		this.showSizhanghu();
		this.showZimoliangpai();
		this.showLiushui();
		this.showIp();
		this.showGps();
	}
	private showZimoFan(){
		if(this.ruleInfo.zmType == 1){
            cc.find("/label1" , this.zimojiafanGroup).getComponent(cc.Label).node.color = CreateRoomHelper.ins.colorData[1];
            cc.find("/label2" , this.zimojiafanGroup).getComponent(cc.Label).node.color = CreateRoomHelper.ins.colorData[2];
            cc.find("/zimoBtnImage" , this.zimojiafanGroup).getComponent(cc.Sprite).node.x = -9;
		}else{
            cc.find("/label1" , this.zimojiafanGroup).getComponent(cc.Label).node.color = CreateRoomHelper.ins.colorData[2];
            cc.find("/label2" , this.zimojiafanGroup).getComponent(cc.Label).node.color = CreateRoomHelper.ins.colorData[1];
            cc.find("/zimoBtnImage" , this.zimojiafanGroup).getComponent(cc.Sprite).node.x = 244;
		}
	}
    private showZimoPao(){
		if(this.ruleInfo.dianGangHua == 1){
            cc.find("/label1" , this.zimojiaPaoGroup).getComponent(cc.Label).node.color = CreateRoomHelper.ins.colorData[1];
            cc.find("/label2" , this.zimojiaPaoGroup).getComponent(cc.Label).node.color = CreateRoomHelper.ins.colorData[2];
            cc.find("/zimoBtnImage" , this.zimojiaPaoGroup).getComponent(cc.Sprite).node.x = -9;
		}else{
            cc.find("/label1" , this.zimojiaPaoGroup).getComponent(cc.Label).node.color = CreateRoomHelper.ins.colorData[2];
            cc.find("/label2" , this.zimojiaPaoGroup).getComponent(cc.Label).node.color = CreateRoomHelper.ins.colorData[1];
            cc.find("/zimoBtnImage" , this.zimojiaPaoGroup).getComponent(cc.Sprite).node.x = 244;
		}
	}

	private showSunShine(){
		if(this.ruleInfo.sunshine == 1){
			this.taiyangBox.showSelect (true);
			this.taiyangyuBox.showSelect(false);
			this.taiyangBox.textColor(CreateRoomHelper.ins.colorData[2]);
			this.taiyangyuBox.textColor(CreateRoomHelper.ins.colorData[1]);
		}else if(this.ruleInfo.sunshine == 2){
			this.taiyangBox.showSelect (false);
			this.taiyangyuBox.showSelect(true);
			this.taiyangBox.textColor(CreateRoomHelper.ins.colorData[1]);
			this.taiyangyuBox.textColor(CreateRoomHelper.ins.colorData[2]);
		}
	}
	private showGps(){
		this.showLabelAndBox(this.gpsBox  , this.ruleInfo.limitGPS == 1);
	}
	private showIp(){
		this.showLabelAndBox(this.ipBox  , this.ruleInfo.limitIP == 1);
	}
	private showLiushui(){
		this.showLabelAndBox(this.liushuiBox  , this.ruleInfo.realTimeCalc == 1);
	}
	private showZimoliangpai(){
		this.showLabelAndBox(this.liangpaiBox  , this.ruleInfo.zmOpen == 1);
	}
	private showSizhanghu(){
		this.showLabelAndBox(this.sizhanghuBox , this.ruleInfo.last4Hu == 1);
	}
	private showLiangfen(){
		this.showLabelAndBox(this.liangfenhuBox  , this.ruleInfo.hu2Score == 1);
	}
	private showLunzhuang(){
		this.showLabelAndBox(this.lunzhuangBox  , this.ruleInfo.lunZhuang == 1);
	}
	private showGuozhuangHu(){
		this.showLabelAndBox(this.guozhuanghuBox  , this.ruleInfo.passHu == 1);
	}
    private showGuozhuangPeng(){
        this.showLabelAndBox(this.guozhuangpengBox  , this.ruleInfo.passPeng == 1);
    }
	private showLiangang(){
		this.showLabelAndBox(this.liangangBox  , this.ruleInfo.allGangShift == 1);
	}
	private showSaitaiyang(){
		this.showLabelAndBox(this.saitaiyangBox  , this.ruleInfo.sunshine > 0);
	}
	private showJishiyu(){
		this.showLabelAndBox(this.jishiyuBox , this.ruleInfo.jiShiYu == 1);
	}
	private showChagua(){
		this.showLabelAndBox(this.baoyuBox , this.ruleInfo.caGua == 1);
	}
	private showFindMax(){
		this.showLabelAndBox(this.wujiaoBox  , this.ruleInfo.findMaxHu == 1);
	}
	private showTiandihu(){
		this.showLabelAndBox(this.tiandiBox  , this.ruleInfo.tdHu == 1);
	}
	private showJiaxin(){
		this.showLabelAndBox(this.jiaxinBox , this.ruleInfo.jiaxin5 == 1);
	}
	private showJiangdui(){
		this.showLabelAndBox(this.jiangduiBox , this.ruleInfo.jiangdui == 1);
	}
	private showYaojiu(){
		this.showLabelAndBox(this.yaojiuBox  , this.ruleInfo.yao9 == 1);
	}
	private showZhongzhang(){
		this.showLabelAndBox(this.zhongzhangBox, this.ruleInfo.zhongzhang == 1);
	}
	private showZimoJIafen(){
		this.showLabelAndBox(this.zimoJiafenBox, this.ruleInfo.zmType > 0)
	}
	private showMenqing(){
		this.showLabelAndBox(this.menqingBox  , this.ruleInfo.menqing == 1);
	}
    private showLabelAndBox(box : CreateCheckItem , isSelect : boolean){
		box.textColor(isSelect ? CreateRoomHelper.ins.colorData[2] : CreateRoomHelper.ins.colorData[1] );
	}
    public getHeight():number{
		return this.ruleInfo.sunshine > 0 ? 1966 : 1767;
	}

    private initRuleInfo(){
		if(!this.ruleInfo){
			this.ruleInfo = new TableRuleInfo();
			for(let key in this.ruleInfo){
				this.ruleInfo[key] = null;
			}
			this.ruleInfo.zmType = 1;
			this.ruleInfo.tdHu = 1;
			this.ruleInfo.findMaxHu = 1;
			this.ruleInfo.dianGangHua = 2;
			this.ruleInfo.jiShiYu = 1;
			this.ruleInfo.passHu = 1;
			this.ruleInfo.zmOpen = 1;
		}
	}


    private addItem(){
        let prefab : cc.Prefab = Global.Utils.getPreFabBySource("createRoom/prefab/CreateCheckItem");

        this.zimoJiafenBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.zimoJiafenBox.node.x = 92;
        this.zimoJiafenBox.node.y = -234;
        this.zimoJiafenBox.setData(15,true,1,true);
        this.baseGroup.addChild(this.zimoJiafenBox.node);

        this.menqingBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.menqingBox.node.x = 92;
        this.menqingBox.node.y = -339;
        this.menqingBox.setData(16,false,1,true);
        this.baseGroup.addChild(this.menqingBox.node);

        this.zhongzhangBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.zhongzhangBox.node.x = 605;
        this.zhongzhangBox.node.y = -339;
        this.zhongzhangBox.setData(17,false,1,true);
        this.baseGroup.addChild(this.zhongzhangBox.node);

        this.yaojiuBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.yaojiuBox.node.x = 92;
        this.yaojiuBox.node.y = -444;
        this.yaojiuBox.setData(18,false,1,true);
        this.baseGroup.addChild(this.yaojiuBox.node);

        this.jiangduiBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.jiangduiBox.node.x = 605;
        this.jiangduiBox.node.y = -444;
        this.jiangduiBox.setData(19,false,1,true);
        this.baseGroup.addChild(this.jiangduiBox.node);

        this.jiaxinBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.jiaxinBox.node.x = 92;
        this.jiaxinBox.node.y = -548;
        this.jiaxinBox.setData(20,false,1,true);
        this.baseGroup.addChild(this.jiaxinBox.node);

        this.tiandiBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.tiandiBox.node.x = 605;
        this.tiandiBox.node.y = -548;
        this.tiandiBox.setData(21,true,1,true);
        this.baseGroup.addChild(this.tiandiBox.node);

        this.wujiaoBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.wujiaoBox.node.x = 92;
        this.wujiaoBox.node.y = -653;
        this.wujiaoBox.setData(22,true,1,true);
        this.baseGroup.addChild(this.wujiaoBox.node);
        //----------------------------------------------------------------------------

        this.baoyuBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.baoyuBox.node.x = 92;
        this.baoyuBox.node.y = -187;
        this.baoyuBox.setData(23,false,1,true);
        this.paoGroup.addChild(this.baoyuBox.node);

        this.jishiyuBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.jishiyuBox.node.x = 605;
        this.jishiyuBox.node.y = -187;
        this.jishiyuBox.setData(24,true,1,true);
        this.paoGroup.addChild(this.jishiyuBox.node);

        this.saitaiyangBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.saitaiyangBox.node.x = 92;
        this.saitaiyangBox.node.y = -295;
        this.saitaiyangBox.setData(25,false,1,true);
        this.paoGroup.addChild(this.saitaiyangBox.node);

        this.liangangBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.liangangBox.node.x = 605;
        this.liangangBox.node.y = -295;
        this.liangangBox.setData(26,false,1,true);
        this.paoGroup.addChild(this.liangangBox.node);

        this.taiyangBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.taiyangBox.node.x = 92;
        this.taiyangBox.node.y = -129;
        this.taiyangBox.setData(27,false,2,true);
        this.saitaiyangGroup.addChild(this.taiyangBox.node);

        this.taiyangyuBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.taiyangyuBox.node.x = 453;
        this.taiyangyuBox.node.y = -129;
        this.taiyangyuBox.setData(28,false,2,true);
        this.saitaiyangGroup.addChild(this.taiyangyuBox.node);

        //----------------------------------------------------------------------
        this.guozhuanghuBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.guozhuanghuBox.node.x = 92;
        this.guozhuanghuBox.node.y = -106;
        this.guozhuanghuBox.setData(29,true,1,true);
        this.huGroup.addChild(this.guozhuanghuBox.node);

        this.guozhuangpengBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.guozhuangpengBox.node.x = 605;
        this.guozhuangpengBox.node.y = -106;
        this.guozhuangpengBox.setData(30,false,1,true);
        this.huGroup.addChild(this.guozhuangpengBox.node);

        this.liangfenhuBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.liangfenhuBox.node.x = 92;
        this.liangfenhuBox.node.y = -214;
        this.liangfenhuBox.setData(31,false,1,true);
        this.huGroup.addChild(this.liangfenhuBox.node);

        this.sizhanghuBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.sizhanghuBox.node.x = 605;
        this.sizhanghuBox.node.y = -214;
        this.sizhanghuBox.setData(32,false,1,true);
        this.huGroup.addChild(this.sizhanghuBox.node);

        this.liangpaiBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.liangpaiBox.node.x = 92;
        this.liangpaiBox.node.y = -322;
        this.liangpaiBox.setData(33,true,1,true);
        this.huGroup.addChild(this.liangpaiBox.node);

        this.liushuiBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.liushuiBox.node.x = 605;
        this.liushuiBox.node.y = -322;
        this.liushuiBox.setData(34,false,1,true);
        this.huGroup.addChild(this.liushuiBox.node);

        this.lunzhuangBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.lunzhuangBox.node.x = 92;
        this.lunzhuangBox.node.y = -430;
        this.lunzhuangBox.setData(35,false,1,true);
        this.huGroup.addChild(this.lunzhuangBox.node);

        this.ipBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.ipBox.node.x = 92;
        this.ipBox.node.y = -580;
        this.ipBox.setData(36,false,1,true);
        this.huGroup.addChild(this.ipBox.node);

        this.gpsBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.gpsBox.node.x = 605;
        this.gpsBox.node.y = -580;
        this.gpsBox.setData(37,false,1,true);
        this.huGroup.addChild(this.gpsBox.node);
    }
    
	

	public getSelectData():TableRuleInfo{
		return this.ruleInfo;
	}


	public disTory(){
		super.disTory()
	}


    private zimoJiafenBox : CreateCheckItem;
    private menqingBox : CreateCheckItem;
    private zhongzhangBox : CreateCheckItem;
    private yaojiuBox : CreateCheckItem;
    private jiangduiBox : CreateCheckItem;
    private jiaxinBox : CreateCheckItem;
    private tiandiBox : CreateCheckItem;
    private wujiaoBox : CreateCheckItem;
    private baoyuBox : CreateCheckItem;
    private jishiyuBox : CreateCheckItem;
    private saitaiyangBox : CreateCheckItem;
    private liangangBox : CreateCheckItem;
    private taiyangBox : CreateCheckItem;
    private taiyangyuBox : CreateCheckItem;
    private guozhuanghuBox : CreateCheckItem;
    private guozhuangpengBox : CreateCheckItem;
    private liangfenhuBox : CreateCheckItem;
    private sizhanghuBox : CreateCheckItem;
    private liangpaiBox : CreateCheckItem;
    private liushuiBox : CreateCheckItem;
    private lunzhuangBox : CreateCheckItem;
    private ipBox : CreateCheckItem;
    private gpsBox : CreateCheckItem;
}
