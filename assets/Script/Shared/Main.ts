// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { SocketAdapter } from "../com/SocketAdapter";
import MjSound_test, { MjSound_testItem } from "../config/MjSound_test";
import EventType from "../event/EventType";
import UserInfo from "../Game/info/UserInfo";
import ConfigManager, { ConfigName } from "../mgr/ConfigManager";
import GMTips from "../tips/GMTips";
import MainLobbyPanel from "../UI/MainLobbyPanel";
import { Global } from "./GloBal";

const {ccclass, property} = cc._decorator;

/**视图修改抗锯齿平滑度*/
cc.macro.ENABLE_WEBGL_ANTIALIAS = true;
@ccclass
export default class Main extends cc.Component {
    @property(cc.Label)
    initLabel: cc.Label = null;
    @property()
    sceneType = "Main";
    @property(cc.Node)
    initGroup: cc.Node = null;
    @property(cc.Node)
    tipsLayar: cc.Node = null;
    @property(cc.Node)
    frontNode: cc.Node = null;

    initGlobal() {
        window["Global"] = Global;
        Global.Utils.setErroShow(true);
        ConfigManager.ins.init();
        this.initLabel.string = '初始化中';
    }
    protected start(): void {
        Global.Utils.debugOutput("Main ==> start")
    }
    onLoad() {
        if(Global.isInit){
            Global.DialogManager.init(this.node);
            this.CreateMainLobbyPannel(true);
            return;
        }
        Global.Utils.debugOutput("Main ==> onLoad")
        // 初始化全局变量
        this.initGlobal();
        Global.isInit=true;
        // 适配处理
        // Global.CCHelper.screenAdaptation(new cc.Size(1080, 1920), this.node.getComponent(cc.Canvas));
        // 初始化界面管理器
        Global.Utils.debugOutput("Main ==> 初始化界面管理器")
        Global.DialogManager.init(this.node);
        Global.Utils.debugOutput("Main ==> 初始化界面管理器over")
        //音乐音效初始化
        // Global.AudioManager.init();
        // 初始化网络
        Global.Utils.debugOutput("Main ==> 初始化网络")
        Global.GameProtocol.initProtocol();
        Global.Utils.debugOutput("Main ==> 初始化网络over")
        Global.mgr.socketMgr.config(SocketAdapter);
        Global.Utils.debugOutput("Main ==> cc.game = "+cc.game)
        cc.game.on(cc.game.EVENT_HIDE, this.onEventHide.bind(this));
        cc.game.on(cc.game.EVENT_HIDE, this.onEventShow.bind(this));
        this.enterGame();
        cc.systemEvent.on("keydown", this.onKeyDown, this);
    }
    private gm:GMTips;
    private onKeyDown(e : cc.Event.EventKeyboard){
        if(e.keyCode == 192){
            if(this.gm){
                this.gm.disTory();
                this.gm = null;
            }else{
                Global.DialogManager.createDialog('tips/GM/prefab/GMTips', null , (any,createDialog)=>{
                    createDialog.x = 58;
                    createDialog.y = -1250;
                    this.gm = createDialog.getComponent(GMTips);
                    this.gm.onRemove(()=>{
                        this.gm = null;
                    })
                } , this.tipsLayar)
            }
        }
    }
    enterGame() {
        let _this = this;
        let cb = function () {
            _this.notifyNativeLaunched();
            this.initGroup.destroy();
        }.bind(this);
        let param:string=window.location.search;
        if(param.indexOf("?type=")>=0){
            let index=parseInt(param.split("?type=")[1]);
            console.log(index);
            let severArr=["ws://192.168.0.24/WebGateSrv/Webgate","ws://192.168.0.18:8080/WebGateSrv/Webgate","ws://192.168.0.11/Webgate"];
            if(severArr[index]){
                Global.mgr.socketMgr.createSocketByUrl(severArr[index]);
            }
            console.log("链接服务器：  "+severArr[index]);
        }else{
            Global.mgr.socketMgr.createSocketByUrl("ws://192.168.0.24/WebGateSrv/Webgate")
            // Global.mgr.socketMgr.createSocketByUrl("ws://192.168.0.18:8080/WebGateSrv/Webgate")
            // Global.mgr.socketMgr.createSocketByUrl("ws://192.168.0.11/Webgate")
        }
        Global.EventCenter.addEventListener(EventType.LOGIN_OK , this.onLoginOk , this);
        Global.EventCenter.addEventListener(EventType.RefreshPlayerInfo,this.checkPlayerInfo,this)

        Global.DialogManager.createDialog('login/prefab/LoginPanel', null, cb);
    }
    private CreateMainLobbyPannel(isBackToLobby:boolean = false):void{
        Global.DialogManager.createDialog('mainLobby/prefab/MainLobbyPanel',null,(any,createDialog)=>{
            createDialog.y = 0;
            if(isBackToLobby){
                (createDialog.getComponent(MainLobbyPanel) as MainLobbyPanel).showAddRoom();
            }
        });
        
    }
    
    onLoginOk(type , data){
        // this.checkPlayerInfo();
        // Global.DialogManager.createDialog('mainLobby/prefab/MainLobbyPanel', null, ()=>{
        //     Global.DialogManager.destroyDialog('login/prefab/LoginPanel' , true)
        // })
    }
    private checkPlayerInfo(type,arg): void {
        if (UserInfo.ins.myInfo && UserInfo.ins.myInfo.noviceState == 0) {
            Global.Utils.debugOutput("需要完善个人信息");
            Global.DialogManager.createDialog('personData/prefab/PersonEditPanel', { type: 0 }, (any, createDialog) => {
                createDialog.y = -1920 / 2;
                createDialog.x = 540;
                Global.DialogManager.destroyDialog('login/prefab/LoginPanel', true)
            });
        } else if (UserInfo.ins.myInfo && UserInfo.ins.myInfo.noviceState == 1&&arg!="0") {
            Global.DialogManager.createDialog('mainLobby/prefab/MainLobbyPanel', null, () => {
                Global.DialogManager.destroyDialog('login/prefab/LoginPanel', true)
            })
        }
    }
    private notifyNativeLaunched(){
        if( CC_JSB ){
            Global.Utils.debugOutput("notifyNativeLaunched")
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onGameLoaded", "()V");
        }
    }
    onEventHide() {
        Global.MessageCallback.emitMessage("GAME_EVENT", cc.game.EVENT_HIDE);
    }
    onEventShow() {
        Global.MessageCallback.emitMessage("GAME_EVENT", cc.game.EVENT_SHOW);
    }
    onDestroy() {
        cc.game.off(cc.game.EVENT_HIDE, this.onEventHide.bind(this));
        cc.game.off(cc.game.EVENT_HIDE, this.onEventShow.bind(this));
    }
}
