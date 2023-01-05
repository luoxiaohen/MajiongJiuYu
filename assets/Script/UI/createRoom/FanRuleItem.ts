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

    private isZimoJiaFan: boolean = true;

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
		if(this.sunshine > 0){
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
		this.sunshine = 1;
		this.showSunShine();
	}
	private onSaitaiyangfanyuClick(){
		this.sunshine = 2;
		this.showSunShine();
	}
	private onGuozhuangClick(){
		this.passHu = this.passHu == 1 ? 0 : 1;
		this.showGuozhuangHu();
	}
    private onGuozhuangPengClick(){
        this.passPeng = this.passPeng == 1 ? 0 : 1;
		this.showGuozhuangPeng();
    }
	private onLunzhuangClick(){
		this.lunZhuang = this.lunZhuang == 1 ? 0 : 1;
		this.showLunzhuang();
	}
	private onLiangfenClick(){
		this.hu2Score = this.hu2Score == 1 ? 0 : 1;
		this.showLiangfen();
	}
	private onSizhangClick(){
		this.last4Hu = this.last4Hu == 1 ? 0 : 1;
		this.showSizhanghu();
	}
	private onLiangPaiClick(){
		this.zmOpen = this.zmOpen == 1 ? 0 : 1;
		this.showZimoliangpai();
	}
	private onLiushuiClick(){
		this.realTimeCalc = this.realTimeCalc == 1 ? 0 : 1;
		this.showLiushui();
	}
	private onIPClick(){
		this.limitIP = this.limitIP == 1 ? 0 : 1;
		this.showIp();
	}
	private onGpsClick(){
		this.limitGPS = this.limitGPS == 1 ? 0 : 1;
		this.showGps();
	}
	private onBaoyuClick(){
		this.caGua = this.caGua == 1 ? 0 : 1;
		this.showChagua();
	}
	private onJishiyuClick(){
		this.jiShiYu = this.jiShiYu == 1 ? 0 : 1;
		this.showJishiyu();
	}
	private onSaitaiyangClick(){
		if(this.sunshine){
			this.sunshine = 0;
		}else{
			this.sunshine = 1;
		}
		this.showSaitaiyangItem();
		this.showSaitaiyang();
	}

	private showSaitaiyangItem(){
		if(this.sunshine){
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
		this.showSunShine()
	}

	private onLiangangClick(){
		this.allGangShift = this.allGangShift == 1 ? 0 : 1;
		this.showLiangang();
	}
	private onZimoJiaFenClick(){
		this.zmType = this.zmType == 0 ? (this.isZimoJiaFan ? 1 : 2) : 0;
		this.showZimoJIafen();
	}
	private onMenqingClick(){
		this.menqing = this.menqing == 1 ? 0 : 1;
		this.showMenqing();
	}
	private onZhongzhangClick(){
		this.zhongzhang = this.zhongzhang == 1 ? 0 : 1;
		this.showZhongzhang();
	}
	private onYaojiuClick(){
		this.yao9 = this.yao9 == 1 ? 0 : 1;
		this.showYaojiu();
	}
	private onJiangduiClick(){
		this.jiangdui = this.jiangdui == 1 ? 0 : 1;
		this.showJiangdui();
	}
	private onJiaxinClick(){
		this.jiaxin5 = this.jiaxin5 == 1 ? 0 : 1;
		this.showJiaxin();
	}
	private onTiandiClick(){
		this.tdHu = this.tdHu == 1 ? 0 : 1;
		this.showTiandihu();
	}
	private onWujiaoClick(){
		this.findMaxHu = this.findMaxHu == 1 ? 0 : 1;
		this.showFindMax();
	}
	private onZimoPaoClick(){
		if(this.dianGangHua == 1){
			this.dianGangHua = 2;
		}else{
			this.dianGangHua = 1;
		}
		this.showZimoPao();
	}
	private onZimojiafanClick(){
    	if(this.zmType !== 0){
			if(this.zmType == 1){
				this.zmType = 2;
			}else{
				this.zmType = 1;
			}
		}
		this.isZimoJiaFan = !this.isZimoJiaFan;
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
		this.showGuozhuangPeng();
		this.showLunzhuang();
		this.showLiangfen();
		this.showSizhanghu();
		this.showZimoliangpai();
		this.showLiushui();
		this.showIp();
		this.showGps();
	}
	private showZimoFan(){
		if(this.isZimoJiaFan){
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
		if(this.dianGangHua == 1){
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
		if(this.sunshine == 1){
			this.taiyangBox.showSelect (true);
			this.taiyangyuBox.showSelect(false);
			this.taiyangBox.textColor(CreateRoomHelper.ins.colorData[2]);
			this.taiyangyuBox.textColor(CreateRoomHelper.ins.colorData[1]);
		}else if(this.sunshine == 2){
			this.taiyangBox.showSelect (false);
			this.taiyangyuBox.showSelect(true);
			this.taiyangBox.textColor(CreateRoomHelper.ins.colorData[1]);
			this.taiyangyuBox.textColor(CreateRoomHelper.ins.colorData[2]);
		}
	}
	private showGps(){
		this.showLabelAndBox(this.gpsBox  , this.limitGPS == 1);
	}
	private showIp(){
		this.showLabelAndBox(this.ipBox  , this.limitIP == 1);
	}
	private showLiushui(){
		this.showLabelAndBox(this.liushuiBox  , this.realTimeCalc == 1);
	}
	private showZimoliangpai(){
		this.showLabelAndBox(this.liangpaiBox  , this.zmOpen == 1);
	}
	private showSizhanghu(){
		this.showLabelAndBox(this.sizhanghuBox , this.last4Hu == 1);
	}
	private showLiangfen(){
		this.showLabelAndBox(this.liangfenhuBox  , this.hu2Score == 1);
	}
	private showLunzhuang(){
		this.showLabelAndBox(this.lunzhuangBox  , this.lunZhuang == 1);
	}
	private showGuozhuangHu(){
		this.showLabelAndBox(this.guozhuanghuBox  , this.passHu == 1);
	}
    private showGuozhuangPeng(){
        this.showLabelAndBox(this.guozhuangpengBox  , this.passPeng == 1);
    }
	private showLiangang(){
		this.showLabelAndBox(this.liangangBox  , this.allGangShift == 1);
	}
	private showSaitaiyang(){
		this.showLabelAndBox(this.saitaiyangBox  , this.sunshine > 0);
	}
	private showJishiyu(){
		this.showLabelAndBox(this.jishiyuBox , this.jiShiYu == 1);
	}
	private showChagua(){
		this.showLabelAndBox(this.baoyuBox , this.caGua == 1);
	}
	private showFindMax(){
		this.showLabelAndBox(this.wujiaoBox  , this.findMaxHu == 1);
	}
	private showTiandihu(){
		this.showLabelAndBox(this.tiandiBox  , this.tdHu == 1);
	}
	private showJiaxin(){
		this.showLabelAndBox(this.jiaxinBox , this.jiaxin5 == 1);
	}
	private showJiangdui(){
		this.showLabelAndBox(this.jiangduiBox , this.jiangdui == 1);
	}
	private showYaojiu(){
		this.showLabelAndBox(this.yaojiuBox  , this.yao9 == 1);
	}
	private showZhongzhang(){
		this.showLabelAndBox(this.zhongzhangBox, this.zhongzhang == 1);
	}
	private showZimoJIafen(){
		this.showLabelAndBox(this.zimoJiafenBox, this.zmType > 0)
	}
	private showMenqing(){
		this.showLabelAndBox(this.menqingBox  , this.menqing == 1);
	}
    private showLabelAndBox(box : CreateCheckItem , isSelect : boolean){
		box.textColor(isSelect ? CreateRoomHelper.ins.colorData[2] : CreateRoomHelper.ins.colorData[1] );
		box.showSelect(isSelect);
	}
    public getHeight():number{
		return this.sunshine > 0 ? 1966 : 1767;
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

		this.sunshine = this.ruleInfo.sunshine;
		this.dianGangHua = this.ruleInfo.dianGangHua;
		this.zmType = this.ruleInfo.zmType;
		this.menqing = this.ruleInfo.menqing;
		this.zhongzhang = this.ruleInfo.zhongzhang;
		this.yao9 = this.ruleInfo.yao9;
		this.jiangdui = this.ruleInfo.jiangdui;
		this.jiaxin5 = this.ruleInfo.jiaxin5;
		this.tdHu = this.ruleInfo.tdHu;
		this.findMaxHu = this.ruleInfo.findMaxHu;
		this.caGua = this.ruleInfo.caGua;
		this.jiShiYu = this.ruleInfo.jiShiYu;
		this.allGangShift = this.ruleInfo.allGangShift;
		this.passHu = this.ruleInfo.passHu;
		this.passPeng = this.ruleInfo.passPeng;
		this.lunZhuang = this.ruleInfo.lunZhuang;
		this.hu2Score = this.ruleInfo.hu2Score;
		this.last4Hu = this.ruleInfo.last4Hu;
		this.zmOpen = this.ruleInfo.zmOpen;
		this.realTimeCalc = this.ruleInfo.realTimeCalc;
		this.limitIP = this.ruleInfo.limitIP;
		this.limitGPS = this.ruleInfo.limitGPS;

		this.isZimoJiaFan = this.zmType !== 2;
	}


    private addItem(){
        let prefab : cc.Prefab = Global.Utils.getPreFabBySource("createRoom/prefab/CreateCheckItem");

        this.zimoJiafenBox = cc.instantiate(prefab).getComponent(CreateCheckItem);
        this.zimoJiafenBox.node.x = 92;
        this.zimoJiafenBox.node.y = -214.5;
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
		for(let key in this.tableInfo){
			this.tableInfo[key] = null;
		}
		this.tableInfo.sunshine = this.sunshine;
		this.tableInfo.dianGangHua = this.dianGangHua;
		this.tableInfo.zmType = this.zmType;
		this.tableInfo.menqing = this.menqing;
		this.tableInfo.zhongzhang = this.zhongzhang;
		this.tableInfo.yao9 = this.yao9;
		this.tableInfo.jiangdui = this.jiangdui;
		this.tableInfo.jiaxin5 = this.jiaxin5;
		this.tableInfo.tdHu = this.tdHu;
		this.tableInfo.findMaxHu = this.findMaxHu;
		this.tableInfo.caGua = this.caGua;
		this.tableInfo.jiShiYu = this.jiShiYu;
		this.tableInfo.allGangShift = this.allGangShift;
		this.tableInfo.passHu = this.passHu;
		this.tableInfo.passPeng = this.passPeng;
		this.tableInfo.lunZhuang = this.lunZhuang;
		this.tableInfo.hu2Score = this.hu2Score;
		this.tableInfo.last4Hu = this.last4Hu;
		this.tableInfo.zmOpen = this.zmOpen;
		this.tableInfo.realTimeCalc = this.realTimeCalc;
		this.tableInfo.limitIP = this.limitIP;
		this.tableInfo.limitGPS = this.limitGPS;
		return this.tableInfo;
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

	private sunshine: number = 0;
	private dianGangHua: number = 0;
	private zmType: number = 0;
	private menqing: number = 0;
	private zhongzhang: number = 0;
	private yao9: number = 0;
	private jiangdui: number = 0;
	private jiaxin5: number = 0;
	private tdHu: number = 0;
	private findMaxHu: number = 0;
	private caGua: number = 0;
	private jiShiYu: number = 0;
	private allGangShift: number = 0;
	private passHu: number = 0;
	private passPeng: number = 0;
	private lunZhuang: number = 0;
	private hu2Score: number = 0;
	private last4Hu: number = 0;
	private zmOpen: number = 0;
	private realTimeCalc: number = 0;
	private limitIP: number = 0;
	private limitGPS: number = 0;
}
