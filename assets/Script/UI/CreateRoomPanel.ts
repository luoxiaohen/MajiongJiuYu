/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-10-08 09:24:45
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-12-07 10:45:39
 * @FilePath: \MajiongJiuYu\assets\Script\UI\CreateRoomPanel.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Msg_CS_CreateTable } from "../proto/LobbyMsg";
import { TableRuleInfo, GamePlayTypeEnum, GameRoomTypeEnum, GamePiaoTypeEnum } from "../proto/LobbyMsgDef";
import { Msg_CS_FindEnterRoom } from "../proto/TableMsg";
import { Global } from "../Shared/GloBal";
import UIBase from "../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CreateRoomPanel extends UIBase {

    @property(cc.Button)
    createBtn: cc.Button = null;
    @property(cc.Button)
    jionRoomBtn: cc.Button = null; 
    @property(cc.EditBox)
    roomIdLabel: cc.EditBox = null;
    

    onload(){
		
    }

    onCreateClick(){
        Global.Utils.debugOutput("CreateRoomPanel ==> 创建房间按钮点击")
		let ruleInfo:TableRuleInfo = new TableRuleInfo();
        ruleInfo.gamePlayType = GamePlayTypeEnum.XueZhanDaoDi;
		ruleInfo.roomType = GameRoomTypeEnum.SiRenSanFang;
		ruleInfo.baseScore = 1;
		ruleInfo.handsCnt = 16;
		ruleInfo.ceiling = 32;
		ruleInfo.tiFan = 0;
		ruleInfo.baozi = GamePiaoTypeEnum.None;
		ruleInfo.baoziDouble = 0;
		ruleInfo.haveHorse = 0;
		ruleInfo.buyHorseNum = 0;
		ruleInfo.buyHorseType = 1;
		ruleInfo.isSelectBankerBuyHorse = 0;
		ruleInfo.isSelectEatHorse = 0;
		ruleInfo.zmType = 1;
		ruleInfo.menqing = 1;
		ruleInfo.zhongzhang = 1;
		ruleInfo.yao9 = 1;
		ruleInfo.jiangdui = 1;
		ruleInfo.jiaxin5 = 1;
		ruleInfo.tdHu = 1;
		ruleInfo.findMaxHu = 1;
		ruleInfo.dianGangHua = 1;
		ruleInfo.caGua = 1;
		ruleInfo.jiShiYu = 1;
		ruleInfo.allGangShift = 1;
		ruleInfo.sunshine = 1;
		ruleInfo.passHu = 1;
		ruleInfo.lunZhuang = 1;
		ruleInfo.hu2Score = 1;
		ruleInfo.last4Hu = 1;
		ruleInfo.zmOpen = 1;
		ruleInfo.realTimeCalc = 1;
		ruleInfo.limitIP = 1;
		ruleInfo.limitGPS = 1;
        let msg : Msg_CS_CreateTable = new Msg_CS_CreateTable();
        msg.info = ruleInfo;
		msg.name = "";
        Global.mgr.socketMgr.send(-1,msg);
    }

    onJoinClick(){
        if(!this.roomIdLabel.string){
            return;
        }
        Global.Utils.dialogOutTips("CreateRoomPanel ==> 请输入正确的房间号", null , (dialog)=>{
			dialog.x = 540;
			dialog.y = -960;
		} , this);
        let msg:Msg_CS_FindEnterRoom = new Msg_CS_FindEnterRoom();
		msg.code = Number(this.roomIdLabel.string);
		Global.mgr.socketMgr.send(-1,msg);


		// Global.DialogManager.createDialog("createRoom/prefab/ListTest" , null , (any,createDialog)=>{
        //     createDialog.x = 0;
        //     createDialog.y = -1920;
        // } , this.node)


    }
}
