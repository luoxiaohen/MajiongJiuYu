// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameInfo from "../Game/info/GameInfo";
import UserInfo from "../Game/info/UserInfo";
import { PlayerInfo } from "../proto/LobbyMsgDef";
import { Msg_CS_SitDown } from "../proto/TableMsg";
import { Global } from "../Shared/GloBal";
import CreateRoomHelper from "../UI/createRoom/CreateRoomHelper";
import UIBase from "../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SitDownTips extends UIBase {
    @property(cc.Button)
    buyCoinsBtn: cc.Button = null;
    @property(cc.Toggle)
    isReady : cc.Toggle = null;
    @property (cc.Label)
    tipsLabel : cc.Label = null;
    @property (cc.Label)
    needLabel : cc.Label = null;
    @property (cc.Label)
    haveLabel : cc.Label = null;
    @property (cc.Label)
    mustLabel : cc.Label = null;
    private isHave:boolean = false;
    private wantSit:number = -1;
    private storReady:string;
    private sitNum:number;
    protected onLoad(): void {
        this.createElement();
    }
    private createElement(){
        let isOpenBookmakerMustBuyHorse:boolean = false;
		let allMut : number = 0;
		allMut += CreateRoomHelper.ins.initialMultiple;
		if(GameInfo.ins.roomTableInfo.rule.haveHorse){
			allMut += CreateRoomHelper.ins.openBuyHorseMultiple;
		}
		if(GameInfo.ins.roomTableInfo.rule.baozi){
			allMut += CreateRoomHelper.ins.openDoubleMultiple;
		}
		if(GameInfo.ins.roomTableInfo.rule.handsCnt==16){
			allMut += CreateRoomHelper.ins.moreHandMultiple;
		}
		if(GameInfo.ins.roomTableInfo.rule.gamePlayType==2){
			allMut += CreateRoomHelper.ins.changeThreeMultiple;
		}
		if(GameInfo.ins.roomTableInfo.rule.isSelectBankerBuyHorse){
			isOpenBookmakerMustBuyHorse = true;
		}
		let need : number = GameInfo.ins.roomTableInfo.rule.baseScore*allMut;
		if(isOpenBookmakerMustBuyHorse){
			need *= CreateRoomHelper.ins.openBookmakerMustBuyHorseMultiple;
		}
        let have : number = UserInfo.ins.myInfo.gold;
        let must : number = Global.Utils.getNeedByRule(GameInfo.ins.roomTableInfo.rule);
        this.needLabel.string = need.toString();
        this.haveLabel.string = "个人财富:" + have;
        this.mustLabel.string = "服务费用:" + must;
        this.isHave = (have >= (need + must))
        this.tipsLabel.node.active = !this.isHave;

        this.storReady = Global.Utils.getlocalStorageItem('init_ready_x')
        if(this.storReady == "1"){
            this.isReady.check();
        }else{
            this.isReady.uncheck();
        }
    }
    setData(sitNum:number){
        this.sitNum = sitNum;
    }
    onCheckClick(){
        if(this.storReady == "1"){
            Global.Utils.addlocalStorageItem("init_ready_x" , "-1")
            this.storReady = "-1";
        }else{
            Global.Utils.addlocalStorageItem("init_ready_x" , "1")
            this.storReady = "1"
        }
    }
    onBuyCoinsClick(){
        Global.Utils.debugOutput("我点击了购买金币");
        this.disTory();
    }
    onCloseClick(){
        let msg : Msg_CS_SitDown = new Msg_CS_SitDown();
		msg.sit = this.sitNum;
		Global.mgr.socketMgr.send(-1,msg);
        this.disTory();
    }
    disTory(){
        if(this.node.parent){
            this.node.parent.removeChild(this.node);
            this.destroy();
        }
    }
}
