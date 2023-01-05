// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventType from "../../event/EventType";
import GameInfo from "../../Game/info/GameInfo";
import { Msg_CS_AddGameRcd, Msg_SC_RemoveGameRcd } from "../../proto/LobbyMsg";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import CardScoreRecordPanel from "./CardScoreRecordPanel";
import GameRealTimePannel from "./GameRealTimePannel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameRecordPannel extends UIBase {

    @property(cc.Node)
    realTimeSprite_node: cc.Node = null;
    @property(cc.Node)
    contentRoot_time: cc.Node = null;
    @property(cc.Node)
    contentRoot_card: cc.Node = null;
    @property(cc.Toggle)
    likeToggle:cc.Toggle=null;

    private viewType = "0";
    private realTimePrefab: cc.Prefab;
    private cardScoreRecordPrefab: cc.Prefab;
    private realTimePannel: GameRealTimePannel;
    private cardScoreRecordPanel: CardScoreRecordPanel;

    private page_label: cc.Label;
    private chooseNode: cc.Node;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.realTimePrefab = Global.Utils.getPreFabBySource("gameRecord/prefab/GameRealTimePannel");
        this.cardScoreRecordPrefab = Global.Utils.getPreFabBySource("gameRecord/prefab/CardScoreRecordPanel");
        this.chooseNode = this.node.getChildByName("chooseNode");
        this.page_label = this.chooseNode.getChildByName("page_label").getComponent(cc.Label);;
    }
    start() {
        let dataMap=GameInfo.ins.realTimePreformanceData;
        this.maxPage=Global.Utils.getMapLength(dataMap);
        this.nowPage=this.maxPage;
        this.OnToggleClick(null, "0");
        this.likeToggle.enabled=this.maxPage>0;
    }
    OnToggleClick(toggle, parm: string): void {
        this.viewType = parm;
        this.chooseNode.active = this.viewType == "1";
        this.contentRoot_time.active=this.viewType=="0";
        this.contentRoot_card.active=this.viewType=="1";
        if (this.viewType == "0") {
            if (!this.realTimePannel) {
                let obj = cc.instantiate(this.realTimePrefab);
                if (obj) {
                    this.contentRoot_time.addChild(obj);
                    obj.y = 0;
                    this.realTimePannel = obj.getComponent(GameRealTimePannel);
                    this.realTimePannel.initeValue();
                }
            }
            this.realTimeSprite_node.active=true;
            this.realTimePannel.scollView.scrollToTop(1);
        } else {
            if (!this.cardScoreRecordPanel) {
                let obj = cc.instantiate(this.cardScoreRecordPrefab);
                if (obj) {
                    this.contentRoot_card.addChild(obj);
                    obj.y = 0;
                    this.cardScoreRecordPanel = obj.getComponent(CardScoreRecordPanel);
                    this.cardScoreRecordPanel.initeValue(this.nowPage);
                }
            }
            this.realTimeSprite_node.active=false;
            // this.scrollView_card.scrollToTop(1);
            this.page_label.string = this.nowPage + "/" + (this.maxPage>0?this.maxPage:1);
        }

    }
    onBgClick(): void {
        this.disTory();
    }
    private isLike = false;
    private maxLikeNum=2;
    onLikeBtnClick(): void {
        if(this.maxLikeNum>5){
            Global.Utils.dialogOutTips("收藏牌谱数量已达到当前会员等级上限");
        }
        let nowRcdInfo=GameInfo.ins.realTimePreformanceData[this.nowPage];
        if(!nowRcdInfo){
            return;
        }
        this.isLike = !this.isLike;
        if (this.isLike) {
            let msg=new Msg_CS_AddGameRcd();
            msg.tid=nowRcdInfo.gameRuleArr.tid;
            msg.handNum=this.nowPage-1;
            Global.Utils.dialogOutTips("收藏成功！");
        } else {
            let msg=new Msg_SC_RemoveGameRcd();
            msg.tid=nowRcdInfo.gameRuleArr.tid;
            msg.handNum=this.nowPage-1;
            Global.Utils.dialogOutTips("取消收藏！");
        }
    }
    private nowPage = 1;
    private maxPage = 12;
    onClcikPage(target, _offset: string): void {
        let tempPage =this.nowPage+ Number(_offset);
        if (tempPage <= 0 || tempPage > this.maxPage) {
            return;
        }
        this.nowPage=tempPage;
        this.page_label.string = this.nowPage + "/" + this.maxPage;
        this.cardScoreRecordPanel.initeValue(this.nowPage);
        // this.scrollView_card.scrollToTop(1);

    }

    protected onDestroy(): void {
    }

    // update (dt) {}
}
