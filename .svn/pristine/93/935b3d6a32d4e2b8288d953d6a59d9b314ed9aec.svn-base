// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameInfo from "../../Game/info/GameInfo";
import UserInfo from "../../Game/info/UserInfo";
import TimeAndMoveManager from "../../mgr/TimeAndMoveManager";
import { Msg_SC_You3Maj } from "../../proto/TableMsg";
import { Global } from "../../Shared/GloBal";
import UIBase from "../../UIBase";
import CreateRoomHelper from "../createRoom/CreateRoomHelper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChangeThreePanel extends UIBase {
    @property(cc.Sprite)
    myImage: cc.Sprite = null;
    @property(cc.Sprite)
    oppImage: cc.Sprite = null;
    @property(cc.Sprite)
    downImage: cc.Sprite = null;
    @property(cc.Sprite)
    upImage: cc.Sprite = null;
    @property(cc.Sprite)
    leftImage: cc.Sprite = null;
    @property(cc.Sprite)
    rightImage: cc.Sprite = null;
    @property(cc.Sprite)
    fontImage: cc.Sprite = null;
    @property(cc.Node)
    duijiaGroup : cc.Node = null;

    private changeMsg : Msg_SC_You3Maj;

    private callBackFun:Function;
    private thisObj : any;
    protected onLoad(): void {
        this.showFourImage(false);
        this.duijiaGroup.active = false;
    }

    showOneReady(readySit:number){
        let index:number = (readySit - UserInfo.ins.mySitIndex + 40)%Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType);
        let image:cc.Sprite;
        switch(index){
            case 0:
                image = this.myImage;
            break;
            case 1:
                image = this.downImage;
            break;
            case 2:
                image = this.oppImage;
            break;
            case 3:
                image = this.upImage;
            break;
        }
        image.node.active = true;
    }
    public setData(msg : Msg_SC_You3Maj , callBackFun , thisObj){
        this.callBackFun = callBackFun;
        this.thisObj = thisObj;
        this.changeMsg = msg;
        this.showAction(msg.type);
    }

    private showAction(type:number){
        
        Global.Utils.playSound("sound/6");
        // this.showFourImage(false);
        this.duijiaGroup.active = true;
        if(type == 0){
            this.showDuijia();
        }else if(type == 1){
            this.showShun()
        }else{
            this.showNi();
        }
    }
    private showDuijia(){
        this.leftImage.node.scaleY = 1;
        this.leftImage.node.x = -39 ;
        this.leftImage.node.y = 24;
        this.rightImage.node.scaleY = -1;
        this.rightImage.node.x = 518 ;
        this.rightImage.node.y = 484;
        Global.Utils.setNewImageToSprite(this.leftImage , "changeThree/resource/changeThree_duijia" )
        Global.Utils.setNewImageToSprite(this.rightImage , "changeThree/resource/changeThree_duijia")
        Global.Utils.setNewImageToSprite(this.fontImage , "changeThree/resource/changeThree_duijiahuanpai");
        let moveY : number = 33;
        let time:number = TimeAndMoveManager.ins.changeThreeLightMoveTime;
        let leftInitY : number = this.leftImage.node.y;
        let rightInitY : number = this.rightImage.node.y;
        cc.tween(this.leftImage.node).to(time/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) , {y : leftInitY - moveY}).call(()=>{
            cc.tween(this.leftImage.node).to(time/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) , {y : leftInitY}).call(()=>{
                cc.tween(this.leftImage.node).to(time/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) , {y : leftInitY - moveY}).call(()=>{
                    cc.tween(this.leftImage.node).to(time/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) , {y : leftInitY}).start();
                }).start();
            }).start();
        }).start();
        cc.tween(this.rightImage.node).to(time/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) , {y : rightInitY + moveY}).call(()=>{
            cc.tween(this.rightImage.node).to(time/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) , {y : rightInitY}).call(()=>{
                cc.tween(this.rightImage.node).to(time/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) , {y : rightInitY + moveY}).call(()=>{
                    cc.tween(this.rightImage.node).to(time/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) , {y : rightInitY}).call(()=>{
                        this.showDuijiaCardAction();
                    }).start();
                }).start();
            }).start();
        }).start();
    }
    private showShun(){
        this.leftImage.node.x = -30 ;
        this.leftImage.node.y = 444;
        this.leftImage.node.scaleY = -1;
        this.rightImage.node.x = 286 ;
        this.rightImage.node.y = 296;
        this.rightImage.node.scaleY = -1;
        Global.Utils.setNewImageToSprite(this.leftImage , "changeThree/resource/changeThreenxuanzhuan2" )
        Global.Utils.setNewImageToSprite(this.rightImage , "changeThree/resource/changeThree_nxuanzhuan")
        Global.Utils.setNewImageToSprite(this.fontImage , "changeThree/resource/changeThree_sshuanpai");
        let moveX : number = 68;
        let moveY : number = 50;
        let moveR : number = 0;
        let leftInitY : number = this.leftImage.node.y;
        let leftInitX : number = this.leftImage.node.x;
        let rightInitX : number = this.rightImage.node.x;
        let rightInitY : number = this.rightImage.node.y;
        let time:number = TimeAndMoveManager.ins.changeThreeLightMoveTime;
        cc.tween(this.leftImage.node).to(time/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) , {x : leftInitX + moveX , y : leftInitY + moveY , angle : moveR}).call(()=>{
            cc.tween(this.leftImage.node).to(time/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) , {x : leftInitX , y : leftInitY , angle : 0}).call(()=>{
                cc.tween(this.leftImage.node).to(time/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) , {x : leftInitX + moveX , y : leftInitY + moveY , angle : moveR}).call(()=>{
                    cc.tween(this.leftImage.node).to(time/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) ,  {x : leftInitX , y : leftInitY , angle : 0}).start();
                }).start();
            }).start();
        }).start();

        cc.tween(this.rightImage.node).to(time/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) , {x : rightInitX - moveX ,y : rightInitY - moveY , angle : moveR}).call(()=>{
            cc.tween(this.rightImage.node).to(time/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) , {x : rightInitX ,y : rightInitY , angle : 0}).call(()=>{
                cc.tween(this.rightImage.node).to(time/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) , {x : rightInitX - moveX ,y : rightInitY - moveY , angle : moveR}).call(()=>{
                    cc.tween(this.rightImage.node).to(time/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) ,{x : rightInitX ,y : rightInitY , angle : 0}).call(()=>{
                        this.showShunCardAction();
                    }).start();
                }).start();
            }).start();
        }).start();
    }
    private showNi(){
        this.leftImage.node.scaleY = 1;
        this.leftImage.node.x = -38 ;
        this.leftImage.node.y = 82;
        this.rightImage.node.scaleY = 1;
        this.rightImage.node.x = 310 ;
        this.rightImage.node.y = 208;
        Global.Utils.setNewImageToSprite(this.leftImage , "changeThree/resource/changeThreenxuanzhuan2" )
        Global.Utils.setNewImageToSprite(this.rightImage , "changeThree/resource/changeThree_nxuanzhuan" )
        Global.Utils.setNewImageToSprite(this.fontImage , "changeThree/resource/changeThree_nshuanpai");
        let moveX : number = 68;
        let moveY : number = 50;
        let moveR : number = 0;
        let leftInitY : number = this.leftImage.node.y;
        let leftInitX : number = this.leftImage.node.x;
        let rightInitX : number = this.rightImage.node.x;
        let rightInitY : number = this.rightImage.node.y;
        let time:number = TimeAndMoveManager.ins.changeThreeLightMoveTime;
        cc.tween(this.leftImage.node).to(time/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) , {x : leftInitX - moveX , y : leftInitY + moveY , angle : moveR}).call(()=>{
            cc.tween(this.leftImage.node).to(time/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) , {x : leftInitX , y : leftInitY , angle : 0}).call(()=>{
                cc.tween(this.leftImage.node).to(time/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) , {x : leftInitX - moveX , y : leftInitY + moveY , angle : moveR}).call(()=>{
                    cc.tween(this.leftImage.node).to(time/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) ,  {x : leftInitX , y : leftInitY , angle : 0}).start();
                }).start();
            }).start();
        }).start();

        cc.tween(this.rightImage.node).to(time/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) , {x : rightInitX + moveX ,y : rightInitY - moveY , angle : moveR}).call(()=>{
            cc.tween(this.rightImage.node).to(time/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) , {x : rightInitX ,y : rightInitY , angle : 0}).call(()=>{
                cc.tween(this.rightImage.node).to(time/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) , {x : rightInitX + moveX ,y : rightInitY - moveY , angle : moveR}).call(()=>{
                    cc.tween(this.rightImage.node).to(time/Global.Utils.getMaxPlayerByGameType(GameInfo.ins.roomTableInfo.rule.roomType) ,{x : rightInitX ,y : rightInitY , angle : 0}).call(()=>{
                        this.showNiCardAction();
                    }).start();
                }).start();
            }).start();
        }).start();
    }


    private showDuijiaCardAction(){
        this.showFourImage(true);
        let time : number = TimeAndMoveManager.ins.changeThreeCardMoveTime;
        cc.tween(this.myImage.node).to(time/2 , {x : 306.5 , y : 232}).call(()=>{
            cc.tween(this.myImage.node).to(time/2 , {x : 306.5 , y : 46}).start()
        }).start();
        cc.tween(this.oppImage.node).to(time/2 , {x : 306.5 , y : 232}).call(()=>{
            cc.tween(this.oppImage.node).to(time/2 , {x : 306.5 , y : 427}).start()
        }).start();
        cc.tween(this.downImage.node).to(time/2 , {x : 306 , y : 232}).call(()=>{
            cc.tween(this.downImage.node).to(time/2 , {x : 556.5 , y : 232}).start()
        }).start();
        cc.tween(this.upImage.node).to(time/2 , {x : 306 , y : 232}).call(()=>{
            cc.tween(this.upImage.node).to(time/2 , {x : 55.5 , y : 232}).call(()=>{
                this.callBackFun.bind(this.thisObj)(this.changeMsg);
            }).start()
        }).start();
    }
    private showShunCardAction(){
        this.showFourImage(true);
        let time : number = TimeAndMoveManager.ins.changeThreeCardMoveTime;
        //306.5  46
        cc.tween(this.myImage.node).to(time/2,{x:131 , y:95 , angle:-35  }).call(()=>{
            this.myImage.node.x = 406.5;
            this.myImage.node.y = 46;
            this.myImage.node.angle = 0;
            this.myImage.node.opacity = 255*0.4;
            cc.tween(this.myImage.node).to(time/5 , {x : 306.5 , opacity : 255}).start();
        }).start();
        //556.5 232
        cc.tween(this.downImage.node).to(time/2,{x:486 , y:86 , angle:-35  }).call(()=>{
            this.downImage.node.x = 556.5;
            this.downImage.node.y = 278;
            this.downImage.node.angle = 0;
            this.downImage.node.opacity = 255*0.4;
            cc.tween(this.downImage.node).to(time/5 , {y : 232 , opacity : 255}).start();
        }).start();
        //306.5 427
        cc.tween(this.oppImage.node).to(time/2,{x:486 , y:383 , angle:-35  }).call(()=>{
            this.oppImage.node.x = 246.5;
            this.oppImage.node.y = 427;
            this.oppImage.node.angle = 0;
            this.oppImage.node.opacity = 255*0.4;
            cc.tween(this.oppImage.node).to(time/5 , {x : 306.5 , opacity : 255}).start();
        }).start();
        //55.5 232
        cc.tween(this.upImage.node).to(time/2,{x:146 , y:391 , angle:-35  }).call(()=>{
            this.upImage.node.x = 55.5;
            this.upImage.node.y = 130;
            this.upImage.node.angle = 0;
            this.upImage.node.opacity = 255*0.4;
            cc.tween(this.upImage.node).to(time/5 , {y : 232 , opacity : 255}).call(()=>{
                this.callBackFun.bind(this.thisObj)(this.changeMsg);
            }).start();
        }).start();
    }
    private showNiCardAction(){
        this.showFourImage(true);
        let time : number = TimeAndMoveManager.ins.changeThreeCardMoveTime;
        //306.5  46
        cc.tween(this.myImage.node).to(time/2,{x:495 , y:74 , angle:35  }).call(()=>{
            this.myImage.node.x = 206;
            this.myImage.node.y = 46;
            this.myImage.node.angle = 0;
            this.myImage.node.opacity = 255*0.4;
            cc.tween(this.myImage.node).to(time/5 , {x : 306.5 , opacity : 255}).start();
        }).start();
        //556.5 232
        cc.tween(this.downImage.node).to(time/2,{x:488 , y:385 , angle: 35  }).call(()=>{
            this.downImage.node.x = 556.5;
            this.downImage.node.y = 180;
            this.downImage.node.angle = 0;
            this.downImage.node.opacity = 255*0.4;
            cc.tween(this.downImage.node).to(time/5 , {y : 232 , opacity : 255}).start();
        }).start();
        //306.5 427
        cc.tween(this.oppImage.node).to(time/2,{x:146 , y:379 , angle: 35  }).call(()=>{
            this.oppImage.node.x = 366.5;
            this.oppImage.node.y = 427;
            this.oppImage.node.angle = 0;
            this.oppImage.node.opacity = 255*0.4;
            cc.tween(this.oppImage.node).to(time/5 , {x : 306.5 , opacity : 255}).start();
        }).start();
        //55.5 232
        cc.tween(this.upImage.node).to(time/2,{x:117 , y:79 , angle: 35  }).call(()=>{
            this.upImage.node.x = 55.5;
            this.upImage.node.y = 284;
            this.upImage.node.angle = 0;
            this.upImage.node.opacity = 255*0.4;
            cc.tween(this.upImage.node).to(time/5 , {y : 232 , opacity : 255}).call(()=>{
                this.callBackFun.bind(this.thisObj)(this.changeMsg);
            }).start();
        }).start();
    }
    private showFourImage(boo:boolean){
        this.myImage.node.active = boo;
        this.oppImage.node.active = boo;
        this.downImage.node.active = boo;
        this.upImage.node.active = boo;
    }


    disTory(){
        super.disTory()
    }
}

