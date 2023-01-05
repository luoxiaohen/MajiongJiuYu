// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CallBack } from "../com/CallBack";
import { SocketAdapter } from "../com/SocketAdapter";
import { Msg_CS_LoginAcc, Msg_CS_RegistAcc } from "../proto/AccountMsg";
import { Global } from "../Shared/GloBal";
import MD5 from "../Shared/MD5";
import UIBase from "../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginPanel extends UIBase {
    @property(cc.ProgressBar)
    proGroup : cc.ProgressBar = null;
    
    @property(cc.EditBox)
    accLabel : cc.EditBox = null;

    @property(cc.EditBox)
    passLabel : cc.EditBox = null;

    @property(cc.Button)
    registerBtn : cc.EditBox = null;

    @property(cc.Button)
    loginBtn : cc.Button = null;

    @property(cc.Label)
    proLabel : cc.Label = null;

    @property(cc.Node)
    loginGroup : cc.Node = null;

    @property(cc.Node)
    registerGroup : cc.Node = null;
    
    @property(cc.EditBox)
    regAccLabel : cc.EditBox = null;
    
    @property(cc.EditBox)
    regPassLabel : cc.EditBox = null;
    
    @property(cc.EditBox)
    regPassAginLabel : cc.EditBox = null;

    @property(cc.Button)
    regRegisterBtn : cc.Button = null;

    /*是否加载完成**/
    public isLoadingFinished: boolean = false;

    onLoad(): void {
        Global.Utils.debugOutput("loginPanel ==> onLoad")

        Global.Utils.debugOutput("this.loginGroup=="+this.loginGroup)

        this.loginGroup.active = false;
        this.registerGroup.active = false;

        this.isLoadingFinished = false;
        this.loading();
    }
    loading(){

        Global.Utils.debugOutput("LoginPanel ===>  loading");
        let loadDirArr = [
            "buyHorse",
            "changeThree",
            "comResource",
            "createRoom",
            "dingQue",
            "login",
            "GameIActiontem",
            "mainGame",
            "mainLobby",
            "majiongCard",
            "pieChart",
            "playerHead",
            "smallOver",
            "sound",
            "tips",
            "turnTable",
            "gameRecord",
            "setting",
            "personData",
            "shop"
        ];
        
        let allTotalCount = 0;
        let allCompletedCount = 0;
        let finishedCount = 0;
        this.proGroup.progress = 0;
        let self = this;

        function loadDir(dir) {
            let lastTotalCount = 0;
            let lastCompletedCount = 0;
            cc.loader.loadResDir(dir, cc.Prefab,
                function (completedCount, totalCount) {
                    if ((finishedCount === loadDirArr.length) && (self.proGroup.progress === 1)) return;
                    if (self.isLoadingFinished) return;
                    if (lastTotalCount === 0) {
                        allTotalCount += totalCount;
                        allCompletedCount += completedCount;
                    } else {
                        allTotalCount += (totalCount - lastTotalCount);
                        allCompletedCount += (completedCount - lastCompletedCount);
                    }
                    lastTotalCount = totalCount;
                    lastCompletedCount = completedCount;
                    if (totalCount === completedCount) {
                        finishedCount++;
                    }
                    let newProgress = 0;
                    if (allTotalCount === 0) {
                        newProgress = finishedCount / loadDirArr.length;
                    } else {
                        newProgress = allCompletedCount / allTotalCount;
                    }
                    if (newProgress > self.proGroup.progress) {
                        self.proLabel.string = (newProgress * 100).toFixed(0) + '%';
                        self.proGroup.progress = newProgress;
                    }

                    if (newProgress >= 1) {
                        self.loadingFinished();
                    }
                },
                function (err) {
                    if (!!err) {
                        cc.log(err);
                    }
                });
        }
        for (let i = 0; i < loadDirArr.length; ++i) {
            loadDir(loadDirArr[i]);
        }
    }

    loadingFinished() {
        Global.Utils.debugOutput("LoginPanel ===>  loadingFinished");
        if (this.isLoadingFinished) return;
        this.isLoadingFinished = true;
        this.proGroup.progress = 1;
        let num: any = this.proGroup.progress;
        this.proLabel.string = Math.floor(num.toFixed(2) * 100) + '%';
        this.proGroup.node.active = false;

        let autoLogin = cc.sys.isMobile;

        if (!!this.dialogParameters && this.dialogParameters.logoutEvent) {
            autoLogin = false;
        }

        let account = cc.sys.localStorage.getItem('accLabel');
        if (autoLogin && !!account && account.length > 0) {
            let accountData = {
                account: account,
                password: cc.sys.localStorage.getItem('passLabel'),
            };
            this.login(accountData);
        } else {
            this.loginGroup.active = true;
        }
    }

    login(data){
        if (!data.account || !data.password || !data.loginPlatform) {
            Global.Utils.dialogOutTips("请输入有效帐号密码", null , (dialog)=>{
				dialog.x = 540;
				dialog.y = -960;
			} , this);
            return;
        }
        Global.mgr.socketMgr.send()
    }

    /**申请注册账号按钮点击*/
    onRegClick(event, param){
        this.loginGroup.active = false;
        this.registerGroup.active = true;

        let len:number = Math.floor(Math.random()*12) + 6;
        let str : string = "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
        let randomStr:string = "";
        for(let i = 0 ; i < len ; i++){
            randomStr += str.charAt(Math.floor(Math.random()*str.length))
        }
        this.regAccLabel.string = randomStr;
        this.regPassLabel.string = "1";
        this.regPassAginLabel.string = "1";
    }
    
    /**登录游戏点击*/
    onLoginClick(event, param){
        let acc : string = this.accLabel.string;
        let pass : string = this.passLabel.string;
        if(acc && pass){
            let msg:Msg_CS_LoginAcc = new Msg_CS_LoginAcc();
			msg.plat = "H5";
			msg.account = acc;
			msg.md5Pass = new MD5().hex_md5(pass);
			Global.mgr.socketMgr.send(-1,msg);
        }else{
            Global.Utils.dialogOutTips("请输入正确的账号密码!", null , (dialog)=>{
				dialog.x = 540;
				dialog.y = -960;
			} , this);
        }
    }

    /**注册界面注册账号按钮点击*/
    onRegisterBtnClick(event, param){
        let acc : string = this.regAccLabel.string;
        let pass : string = this.regPassLabel.string;
        let passAgin : string = this.regPassAginLabel.string;
        if(acc && pass && passAgin){
            if(pass != passAgin){
                Global.Utils.dialogOutTips("LoginPanel ==> 两次密码输入不一致", null , (dialog)=>{
                    dialog.x = 540;
                    dialog.y = -960;
                } , this);
            }else{
                Global.Utils.debugOutput("LoginPanel ==> 账号注册输入");
                Global.Utils.debugOutput("LoginPanel ==> acc:" + acc);
                Global.Utils.debugOutput("LoginPanel ==> pass:" + pass);
                Global.Utils.debugOutput("LoginPanel ==> passAgin:" + passAgin);
                let msg:Msg_CS_RegistAcc = new Msg_CS_RegistAcc();
				msg.plat = "H5";
				msg.account = acc;
				msg.md5Pass = new MD5().hex_md5(pass);
                Global.mgr.socketMgr.send(-1,msg);
            }
        }else{
            Global.Utils.dialogOutTips("请输入正确的账号密码", null , (dialog)=>{
				dialog.x = 540;
				dialog.y = -960;
			} , this);
        }
    }
}
