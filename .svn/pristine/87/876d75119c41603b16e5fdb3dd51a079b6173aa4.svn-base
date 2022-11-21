// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventType from "../../event/EventType";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import CardScoreRecordPanel from "./CardScoreRecordPanel";
import GameRealTimePannel from "./GameRealTimePannel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameRecordPannel extends UIBase {

    @property(cc.Node)
    contentRoot_time: cc.Node = null;

    @property(cc.Node)
    contentRoot_card: cc.Node = null;

    @property(cc.ScrollView)
    scrollView_time: cc.ScrollView = null;
    @property(cc.ScrollView)
    scrollView_card: cc.ScrollView = null;

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
        this.OnToggleClick(null, "0");
    }
    OnToggleClick(toggle, parm: string): void {
        this.viewType = parm;
        this.chooseNode.active = this.viewType == "1";
        this.scrollView_time.node.active=this.viewType=="0";
        this.scrollView_card.node.active=this.viewType=="1";
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
            this.scrollView_time.scrollToTop(1);
        } else {
            if (!this.cardScoreRecordPanel) {
                let obj = cc.instantiate(this.cardScoreRecordPrefab);
                if (obj) {
                    this.contentRoot_card.addChild(obj);
                    obj.y = 0;
                    this.cardScoreRecordPanel = obj.getComponent(CardScoreRecordPanel);
                    this.cardScoreRecordPanel.initeValue();
                }
            }
            this.scrollView_card.scrollToTop(1);

        }

    }
    onBgClick(): void {
        this.disTory();
    }
    private isLike = false;
    onLikeBtnClick(): void {
        this.isLike = !this.isLike;
        if (this.isLike) {
            Global.Utils.debugOutput("收藏成功！");
        } else {
            Global.Utils.debugOutput("取消收藏！");
        }
    }
    private nowPage = 1;
    private maxPage = 12;
    onClcikPage(target, _offset: string): void {
        this.nowPage += Number(_offset);
        if (this.nowPage <= 0 || this.maxPage > 12) {
            return;
        }
        this.page_label.string = this.nowPage + "/" + this.maxPage;
        this.cardScoreRecordPanel.initeValue(null, this.nowPage);
        this.scrollView_card.scrollToTop(1);

    }

    protected onDestroy(): void {
    }

    // update (dt) {}
}
