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
import HallGameRecordPanel from "./gameRecord/HallGameRecordPanel";
import CreateRulerTips from "./createRoom/CreateRulerTips";
import TimeAndMoveManager from "../mgr/TimeAndMoveManager";
import PersonInfoPanel from "./personData/PersonInfoPanel";
import UserInfo from "../Game/info/UserInfo";
import { UIViewZorderEnum } from "../enum/EnumManager";
const {ccclass, property} = cc._decorator;

@ccclass
export default class MainLobbyPanel extends UIBase {
    public z_order=UIViewZorderEnum.HallPanels;
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

    private _nowType: number = 3;
    public get nowType(): number {
        return this._nowType;
    }
    public set nowType(value: number) {
        this._nowType = value;
        this.showBtn();
    }

    private showBtn(){
        let btnArr:Array<cc.Button> = [this.recordBtn , this.teamBtn , this.mainBtn , this.clubBtn , this.infoBtn]
        let image : cc.Sprite;
        for(let i = 0 ; i < 5  ; i++){
            image = cc.find("/Background" , btnArr[i].node).getComponent(cc.Sprite);
            Global.Utils.setGray(image , true)
        }
        image = cc.find("/Background" , btnArr[this.nowType-1].node).getComponent(cc.Sprite);
        Global.Utils.setGray(image , false)
    }


    private createRoomPanel : CreateRommAndFriendPanel;
    private createRoomRuler : CreateRoomRulerPanel;
    private hallGameRecordPanel:HallGameRecordPanel;
    private personInfoPanel:PersonInfoPanel;
    private createRoomTemplate : CreateRoomRuleTemplate;
    onLoad(): void {
        Global.Utils.debugOutput("MainLobbyPanel ==> onLoad")
        this.addEvent();
        this.nowType = 3;
    }

    private addEvent(){
        Global.EventCenter.addEventListener(EventType.GET_NEW_ROOM_INFO , this.onRspRoomInfo , this)
        Global.EventCenter.addEventListener(EventType.CreateRoomRuleTipsClick , this.onShowRuleTips , this);

		Global.EventCenter.addEventListener(EventType.RspGetRoomRuleTemplate , this.onGetTemplateBack , this);
		Global.EventCenter.addEventListener(EventType.GameInviteMsg , this.onGameInvite , this);
		Global.EventCenter.addEventListener(EventType.SaveRoomRuleTemplate , this.onSaveRoomRuleTemplate , this);

    }
 
    private ruleTips:CreateRulerTips;
	private onShowRuleTips(e , num){
        if(this.ruleTips){
            this.ruleTips.disTory();
        }
        this.ruleTips = cc.instantiate(Global.Utils.getPreFabBySource("createRoom/prefab/CreateRulerTips")).getComponent(CreateRulerTips)
        this.ruleTips.node.y = -1920;
        this.ruleTips.setData(num);
		this.tipsGroup.addChild(this.ruleTips.node);
	}
    /**创建游戏房间返回*/
    private onRspRoomInfo(type,data:Msg_SC_RoomInfo){
        cc.director.loadScene("mainMajiong",function(){
            GameInfo.ins.nowSceneName="mainMajiong";
        });
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

        Global.DialogManager.createDialog('gameRecord/prefab/HallGameRecordPanel',null,(any,createDialog)=>{
            this.hallGameRecordPanel = createDialog.getComponent(HallGameRecordPanel);
            createDialog.y = -1920/2;
            createDialog.x=540;
        },this.panelGroup);

    }
    public showAddRoom(){
        this.onTeamBtnClick(null , null);
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
        this.scheduleOnce(()=>{
            this.createRoomPanel.node.active = false;
        },TimeAndMoveManager.ins.showPanelTime)
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
    private onSaveRoomRuleTemplate(){
        Global.Utils.hidePanelAction(this.createRoomRuler.node , new cc.Vec2(-1080 , -1920) , ()=>{
            this.clearRoomRule();
        } , this);
        this.showSavePanel();
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
            this.createRoomPanel.node.active = true;
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
        this.createRoomPanel.node.active = true;
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

        
        Global.Utils.createObjToNode('personData/prefab/PersonInfoPanel',this.panelGroup,null,cc.v2(540,-1920/2),(any,createDialog)=>{
            this.personInfoPanel = createDialog.getComponent(PersonInfoPanel);
        },);

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
        if(this.hallGameRecordPanel){
            this.hallGameRecordPanel.disTory();
            this.hallGameRecordPanel=null;
        }
        if(this.personInfoPanel){
            this.personInfoPanel.disTory();
            this.personInfoPanel=null;
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
