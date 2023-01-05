// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ArtFontEnum } from "../../enum/EnumManager";
import GameInfo from "../../Game/info/GameInfo";
import UserInfo from "../../Game/info/UserInfo";
import { FanTypeEnum, GangTypeEnum, HuTypeEnum, ScoreEventInfo, ScoreTypeEnum } from "../../proto/TableMsgDef";
import { Global } from "../../Shared/GloBal";
import Utils from "../../Shared/Utils";
import UIBase from "../../UIBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class OverInfoLabelItem extends UIBase {
    @property (cc.Label)
    typeLabel : cc.Label = null;
    @property (cc.Label)
    hitLabel : cc.Label = null;
    @property (cc.Label)
    fenLabel : cc.Label = null;
    @property (cc.Label)
    huLabel : cc.Label = null;

    
	private _info: ScoreEventInfo;
	public get info(): ScoreEventInfo {
		return this._info;
	}
	public set info(value: ScoreEventInfo) {
		this._info = value;
        this.createElements();
	}
    protected onLoad(): void {
    }

    private createElements(){
		let typeStr : string = this.getTypeStr(this.info.scoreType);
		let gangStr : string = this.getGangStr();
		let fanStr : string = this.getFanStr();
		let objStr : string = this.getObjStr();
		let chaguaStr : string = this.getChagua();

		let gangfan:string = gangStr + fanStr;
		if(gangfan.length > 0){
			gangfan = "("+gangStr + fanStr+")";
		}
		this.typeLabel.string = typeStr;
        this.huLabel.string = gangfan;
		if(chaguaStr.length > 0){
			chaguaStr = "擦挂:" + chaguaStr;
		}
		this.hitLabel.string = objStr + chaguaStr;
		this.fenLabel.string = this.info.win > 0 ? "+" + this.info.win : this.info.win.toString();
		if(this.info.win>=0){
			Global.Utils.setLabelFont(ArtFontEnum.jiesuanJiafen,this.fenLabel);
		}else{
			Global.Utils.setLabelFont(ArtFontEnum.jiesuanJianfen,this.fenLabel);
		}
	}

	@property(cc.BitmapFont)
    redFont:cc.BitmapFont=null;
    @property(cc.BitmapFont)
    greenFont:cc.BitmapFont=null;
	public getMaxHeight():number{
		if(this.hitLabel.node.height > this.typeLabel.node.height){
			return this.hitLabel.node.height
		}else{
			return this.typeLabel.node.height;
		}
	}

	private getChagua():string{
		let str : string = "";
		if(this.info.tarSitsEx){
			for(let i = 0 ; i < this.info.tarSitsEx.length ; i++){
				str += this.getObj(this.info.tarSitsEx[i]);
			}
		}
		return str;
	}
	private getObjStr():string{
		let str:string = "";
		for(let i = 0 ; i < this.info.tarSits.length ; i++){
			str +=this.getObj(this.info.tarSits[i]);
		}
		return str;
	}
	private getObj(sit:number):string{
		let str:string = "";
		if(sit == UserInfo.ins.mySitIndex){
			str = "本家"
		}
		if(sit%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) == UserInfo.ins.mySitIndex + 1){
			str = "下家"
		}
		if(sit%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) == (UserInfo.ins.mySitIndex + 3)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType)){
			str = "上家"
		}
		if(sit%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) == (UserInfo.ins.mySitIndex + 2)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType)){
			str = "对家"
		}
		if(sit == 4){
			str = "1马"
		}
		if(sit == 5){
			str = "2马"
		}
		return str + ",";
	}
	private getFanStr():string{
		let str : string = "";
		if(this.info.fanTypes){
			for(let i = 0 ; i < this.info.fanTypes.length ; i++){
				str += this.getAllFanStr(this.info.fanTypes[i]);
			}
		}
		return str;
	}
	private getAllFanStr(code : FanTypeEnum):string{
		let str : string = "";
		switch(code){
			case FanTypeEnum.Gen : 
				str =  this.info.param + "根";
			break;
			case FanTypeEnum.GangShangHua : 
				str = "杠上花";
			break;
			case FanTypeEnum.GangShangPao : 
				str = "杠上炮";
			break;
			case FanTypeEnum.QiangGangHu : 
				str = "抢杠胡";
			break;
			case FanTypeEnum.HaiDiLaoYue : 
				str = "海底捞月";
			break;
			case FanTypeEnum.MenQing : 
				str = "门清";
			break;
			case FanTypeEnum.ZhongZhang : 
				str = "中张";
			break;
			case FanTypeEnum.JiaXinWu : 
				str = "夹心五";
			break;
			case FanTypeEnum.ZiMo : 
				str = "自摸加番";
			break;
			case FanTypeEnum.TianHu : 
				str = "天胡";
			break;
			case FanTypeEnum.DiHu : 
				str = "地胡";
			break;
		}
		return str + ",";
	}
	private getGangStr():string{
		let str : string = "";
		if(this.info.huGangTypes){
			if(this.info.scoreType == ScoreTypeEnum.eGang || this.info.scoreType == ScoreTypeEnum.eBeiGang){
				for(let i = 0 ; i < this.info.huGangTypes.length ; i++){
					str += this.getAllHuStr(this.info.huGangTypes[i]);
				}
			}else{
				for(let i = 0 ; i < this.info.huGangTypes.length ; i++){
					str += this.getAllGangStr(this.info.huGangTypes[i]);
				}
			}

		}
		return str;
	}
	private getAllGangStr(code : GangTypeEnum):string{
		let str : string = "";
		switch(code){
			case GangTypeEnum.eAnGang : 
				str = "暗杠";
			break;
			case GangTypeEnum.eDianGang : 
				str = "点杠";
			break;
			case GangTypeEnum.eBuGang : 
				str = "补杠";
			break;
			case GangTypeEnum.eCaGua : 
				str = "擦挂";
			break;
		}
		return str + ",";
	}
	private getAllHuStr(code : HuTypeEnum):string{
		let str : string = "";
		switch(code){
			case HuTypeEnum.PingHu : 
				str = "平胡";
			break;
			case HuTypeEnum.DuiDuiHu : 
				str = "对对胡";
			break;
			case HuTypeEnum.QingYiSe : 
				str = "清一色";
			break;
			case HuTypeEnum.QiDui : 
				str = "七对";
			break;
			case HuTypeEnum.LongQiDui : 
				str = "龙七对";
			break;
			case HuTypeEnum.JinGouDiao : 
				str = "金钩钓";
			break;
			case HuTypeEnum.YaoJiu : 
				str = "幺九";
			break;
			case HuTypeEnum.JiangDui : 
				str = "将对";
			break;
		}
		return str + ",";
	}

	private getTypeStr(type:ScoreTypeEnum):string{
		let typeStr:string = "";
		let value : string = Global.Utils.getMaJiangValue(this.info.majid);
		if(type == ScoreTypeEnum.None){
			typeStr = "";
		}
		else if(type < ScoreTypeEnum.eSunshine){
			switch(type){
				case ScoreTypeEnum.eZiMo : 
					typeStr = "自摸";
				break;
				case ScoreTypeEnum.eHuPai : 
					typeStr = "胡牌";
				break;
				case ScoreTypeEnum.eBeiZiMo : 
					typeStr = "被自摸";
				break;
				case ScoreTypeEnum.eDianPao : 
					typeStr = "点炮";
				break;
				case ScoreTypeEnum.eGang : 
					typeStr = "杠";
				break;
				case ScoreTypeEnum.eBeiGang : 
					typeStr = "被杠";
				break;
			}
		}else{
			typeStr = "";
		}
		return typeStr + value;
	}
}
