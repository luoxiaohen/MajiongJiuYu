/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-10-08 09:24:45
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-11-18 10:44:12
 * @FilePath: \MajiongJiuYu\assets\Script\mgr\TimeAndMoveManager.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class TimeAndMoveManager{
    private static _ins: TimeAndMoveManager;
    public static get ins() {
        return this._ins || (this._ins = new TimeAndMoveManager());
    }

    /**新人坐下位置动画展示时间*/
	newPlayerSitMcTime : number = 0.5;
    /**定庄骰子旋转时间*/
    public zhuangRollTime : number = 2;
	/**定庄骰子展示时常*/
	public diceRotation : number = 0.8;
    /**矫座头像显示时间*/
	public changeCharTime :number = 1;
	/**矫座头像动画时间*/
	public changeCharAcyionTime :number = 0.3;
	/**发牌时间*/
	public getWallTime :number = 0.2;
	/**发牌动作时间*/
	public getWallActionTime : number = 0.01;
	/**整理手牌时间*/
	public finishHandTime : number = 0.5;
	/**出牌后手牌移动时间*/
	public outCardHandMoveTime:number =0.07;
	/**其他玩家出牌飞入牌池时间*/
	public otherOutCardToGroupTime:number = 0.05;
	/**入牌时候手牌提起 落下时间*/
	public addCardMoveYTime:number =0.1;
	/**入牌时候手牌旋转时间*/
	public addCardRotationTime:number =0.05;
	
	/**入牌时候手牌提起 落下时间*/
	public ChangeThreeMoveYTime:number =0.3;
    
	/**其他玩家出牌动作显示时间*/
	public otherOutCardActionTime:number = 0.03;
	/**游戏规则界面移动时间系数*/
	public gameRuleItemMoveTime:number = 0.001;
	/**展示界面飞人主屏时间*/
	public showPanelTime : number = 0.25;


	/**换三张箭头移动时间*/
	public changeThreeLightMoveTime:number = 0.8;
	/**换三张牌移动时间*/
	public changeThreeCardMoveTime:number = 0.75;

}
