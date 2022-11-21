// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventType from "../event/EventType";
import GameInfo from "../Game/info/GameInfo";
import { Msg_CS_CreateTable, Msg_CS_GMMsg, Msg_CS_ReqGetRoomRuleTemplate } from "../proto/LobbyMsg";
import { GamePiaoTypeEnum, GamePlayTypeEnum, GameRoomTypeEnum, TableRuleInfo, TableRuleTempl } from "../proto/LobbyMsgDef";
import { Msg_SC_RoomInfo } from "../proto/TableMsg";
import { Global } from "../Shared/GloBal";
import Utils from "../Shared/Utils";
import UIBase from "../UIBase";
import CreateRommAndFriendPanel from "./createRoom/CreateRommAndFriendPanel";
import CreateRoomHelper from "./createRoom/CreateRoomHelper";
import CreateRoomRulerPanel from "./createRoom/CreateRoomRulerPanel";
import CreateRoomRuleTemplate from "./createRoom/CreateRoomRuleTemplate";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainLobbyPanel extends UIBase {

    @property(cc.Node)
    panelGroup: cc.Node = null;

    @property(cc.Node)
    menuGroup: cc.Node = null;
    
    @property(cc.Button)
    mainBtn: cc.Button = null;

    @property(cc.Button)
    recordBtn: cc.Button = null;

    @property(cc.Button)
    teamBtn: cc.Button = null;

    @property(cc.Button)
    clubBtn: cc.Button = null;

    @property(cc.Button)
    infoBtn: cc.Button = null;

    @property (cc.Node)
    tipsGroup : cc.Node = null;

    private nowType : number = 3;


    private createRoomPanel : CreateRommAndFriendPanel;
    private createRoomRuler : CreateRoomRulerPanel;
    private createRoomTemplate : CreateRoomRuleTemplate;
    onLoad(): void {
        Global.Utils.debugOutput("MainLobbyPanel ==> onLoad")
        this.addEvent();
    }

    private addEvent(){
        Global.EventCenter.addEventListener(EventType.GET_NEW_ROOM_INFO , this.onRspRoomInfo , this)
        Global.EventCenter.addEventListener(EventType.CreateRoomRuleTipsClick , this.onShowRuleTips , this);

		Global.EventCenter.addEventListener(EventType.RspGetRoomRuleTemplate , this.onGetTemplateBack , this);
		Global.EventCenter.addEventListener(EventType.GameInviteMsg , this.onGameInvite , this);

    }
	private onShowRuleTips(){
		// if(this.createRuleTips){
		// 	this.clearCreateRuleTips();
		// }
		// this.createRuleTips = new CreateRoomRuleTips(e.data);
		// this.topGroup.addChild(this.createRuleTips);
	}
    /**创建游戏房间返回*/
    private onRspRoomInfo(type,data:Msg_SC_RoomInfo){
        cc.director.loadScene("mainMajiong");
        this.destroy();
    }   
     /**主页按钮点击*/
     onMainBtnClick(event, param){
        if(this.nowType == 3){
            return;
        }
        this.removeAll();
        this.nowType = 3;
         Global.Utils.debugOutput("MainLobbyPanel ==> 主页点击")

    }
    /**战绩按钮点击*/
    onRecordBtnClick(event, param){
        if(this.nowType == 1){
            return;
        }
        this.removeAll();
        this.nowType = 1;
        Global.Utils.debugOutput("MainLobbyPanel ==> 战绩点击")

    }
    /**约局按钮点击*/
    onTeamBtnClick(event, param){
        if(this.nowType == 2){
            return;
        }
        this.removeAll();
        this.nowType = 2;
        Global.Utils.debugOutput("MainLobbyPanel ==> 约局按钮点击")
        Global.DialogManager.createDialog('createRoom/prefab/CreateRommAndFriendPanel',null,(any,createDialog)=>{
            this.createRoomPanel = createDialog.getComponent(CreateRommAndFriendPanel);
            this.createRoomPanel.setCallBack(this.onCreateOrSave , this);
            createDialog.y = -1920;
        },this.panelGroup);
    }
    private onCreateOrSave(type:number){
		if(type == 1){
			this.showSavePanel();
		}else{
			this.showCreatePanel();
		}
	}
    private showCreatePanel(ruleInfo : TableRuleTempl=null){
        Global.DialogManager.createDialog('createRoom/prefab/CreateRoomRulerPanel',null,(any,createDialog)=>{
            this.createRoomRuler = createDialog.getComponent(CreateRoomRulerPanel);
            createDialog.y = -1920;
            createDialog.x = 1080;
            this.createRoomRuler.setData(this.onRuleBack , this , ruleInfo)
            Global.Utils.showPanelAction(this.createRoomRuler.node , new cc.Vec2(0,-1920))
        },this.tipsGroup);
    }
    /**规则界面回调*/
	private onRuleBack(type:number){
		if(type == 1){
			this.onRuleToBack();
		}else{
			if(this.createRoomRuler){
				Global.Utils.hidePanelAction(this.createRoomRuler.node , new cc.Vec2(-1080 , -1920) , ()=>{
					this.clearRoomRule();
				} , this);
                this.showSavePanel();
			}
		}
	}
    /**打开模板*/
	private showSavePanel(){
		this.clearRoomTemplate();
		let arr:Array<TableRuleTempl> = CreateRoomHelper.ins.getCreateRoomRuleArr();
		if(arr && arr.length > 0){
			this.onGetTemplateBack();
		}else{
			Global.Utils.showWait();
			let msg : Msg_CS_ReqGetRoomRuleTemplate = new Msg_CS_ReqGetRoomRuleTemplate();
			Global.mgr.socketMgr.send(-1,msg);
		}
	}
	private onGetTemplateBack(){
		Global.Utils.hideWait();
        Global.DialogManager.createDialog('createRoom/prefab/CreateRoomRuleTemplate',null,(any,createDialog)=>{
            this.createRoomTemplate = createDialog.getComponent(CreateRoomRuleTemplate);
            createDialog.y = -1920;
            createDialog.x = 1080;
            this.createRoomTemplate.setData(CreateRoomHelper.ins.getCreateRoomRuleArr(), this.onTempLateBack , this)
            Global.Utils.showPanelAction(this.createRoomTemplate.node , new cc.Vec2(0,-1920))
        },this.tipsGroup);
		this.onRuleToBack();
	}
    /**
	 * @param type  1 back 2 template 3 room 4 open or change
	*/
	private onTempLateBack(type:number , ruleInfo : TableRuleTempl=null){
		if(type == 1){
			Global.Utils.hidePanelAction(this.createRoomTemplate.node , new cc.Vec2(-1080 , -1920) , ()=>{
				this.clearRoomTemplate();
			} , this);
		}else if(type == 2){
			Global.Utils.hidePanelAction(this.createRoomTemplate.node , new cc.Vec2(-1080 , -1920) , ()=>{
				this.clearRoomTemplate();
			} , this);
            this.showCreatePanel();

		}else if(type == 3){
			Global.Utils.hidePanelAction(this.createRoomTemplate.node , new cc.Vec2(-1080 , -1920) , ()=>{
				this.clearRoomTemplate();
			} , this);
		}else if(type == 4){
			Global.Utils.hidePanelAction(this.createRoomTemplate.node , new cc.Vec2(-1080 , -1920) , ()=>{
				this.clearRoomTemplate();
			} , this);
            this.showCreatePanel(ruleInfo);
		}
	}
	private clearRoomTemplate(){
		if(this.createRoomTemplate){
			this.createRoomTemplate.disTory();
			this.createRoomTemplate = null;
		}
	}
	/**规则界面返回*/
	private onRuleToBack(){
		if(this.createRoomRuler){
			Global.Utils.hidePanelAction(this.createRoomRuler.node , new cc.Vec2(-1080 , -1920) , ()=>{
				this.clearRoomRule();
			} , this);
		}
	}
    private clearRoomRule(){
		if(this.createRoomRuler){
			this.createRoomRuler.disTory();
			this.createRoomRuler = null;
		}
	}
    /**俱乐部按钮点击*/
    onClubBtnClick(event, param){
        if(this.nowType == 4){
            return;
        }
        this.removeAll();
        this.nowType = 4;
        Global.Utils.debugOutput("MainLobbyPanel ==> 俱乐部点击")

    }
    /**玩家信息按钮点击*/
    onInfoBtnClick(event, param){
        if(this.nowType == 5){
            return;
        }
        this.removeAll();
        this.nowType = 5;
        Global.Utils.debugOutput("MainLobbyPanel ==> 个人信息点击")

    }
    private removeAll(){
        if(this.createRoomPanel){
            this.createRoomPanel.disTory();
            this.createRoomPanel = null;
        }
        if(this.createRoomRuler){
            this.createRoomRuler.disTory();
            this.createRoomRuler = null;
        }
    }
    private removeEvent(){
        Global.EventCenter.removeEventListener(EventType.GET_NEW_ROOM_INFO , this.onRspRoomInfo , this);
        Global.EventCenter.removeEventListener(EventType.CreateRoomRuleTipsClick , this.onShowRuleTips , this);
		Global.EventCenter.removeEventListener(EventType.RspGetRoomRuleTemplate , this.onGetTemplateBack , this);
		Global.EventCenter.removeEventListener(EventType.GameInviteMsg , this.onGameInvite , this);

    }

    private onGameInvite():void{
        Global.DialogManager.createDialog("smallOver/prefab/InviteToRoomPannel_Hall",null,(any,dialog)=>{
            dialog.x=540;
            dialog.y=-960;
        })
    }
    destroy(): boolean {
        super.destroy();
        this.removeEvent();
        return true;
    }

}
