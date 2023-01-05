// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Global } from "./GloBal";
import MD5 from "./MD5";
import MessageCallback from "./MessageCallback";
import Utils from "./Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CCHelper {
    private static _ins: CCHelper;
    public static get ins() {
        return this._ins || (this._ins = new CCHelper());
    }
    /**
     * @param res 资源路径(不带后缀,带resources)
     * @param cb 异步创建，function(err, node)
     */
    public createFrameAnimationNode = function (res, cb) {
        //cc.JsonAsset
        cc.loader.loadRes(res + "_config", cc.Asset, function (err, data) {
            if (!!err) {
                cc.error("createFrameAnimation err: load file fail url=" + res + '.json');
                cb("load file fail");
            } else {
                data = data.json;
                let width = data["width"] || 0;
                let height = data["height"] || 0;
                let count = data["count"] || 0;
                let intervalTime = (data["intervalTime"] || 0);
                if (width <= 0 || height <= 0 || count <= 0 || intervalTime <= 0) {
                    cc.error("animation data err");
                    cb("animation data err");
                    return;
                }
                cc.loader.loadRes(cc.url.raw(res + '.png'), function (err, texture) {
                    if (!!err) {
                        cc.error("createFrameAnimation err: load file fail url=" + res + '.png');
                        cb("load file fail");
                    } else {
                        let wCount = Math.floor(texture.width / width) || 1;
                        let hCount = Math.floor(texture.height / height) || 1;

                        let node = new cc.Node();
                        let sprite: cc.Sprite = node.addComponent(cc.Sprite);
                        sprite.spriteFrame = new cc.SpriteFrame(texture, new cc.Rect(0, 64, width, height));
                        /**
                         * @param loop 是否循环，默认false
                         * @param speed 播放速度，默认1
                         * @param completeCallback，每完成一次的回调
                         */
                        node["startAnimation"] = function (loop, speed, completeCallback) {
                            if (!speed || speed <= 0) speed = 1;
                            intervalTime = intervalTime / speed;
                            node.stopAllActions();
                            let index = 0;
                            function callback() {
                                let curIndex = index++ % data.count;
                                let rect = new cc.Rect((curIndex % wCount) * width, Math.floor(curIndex / hCount) * height, width, height);
                                sprite.spriteFrame = new cc.SpriteFrame(texture, rect);
                                if (!!completeCallback && (curIndex === (data.count - 1))) {
                                    completeCallback();
                                }
                            }
                            if (!!loop) {
                                node.runAction(cc.repeatForever(cc.sequence([cc.delayTime(intervalTime), cc.callFunc(callback)])));
                            } else {
                                node.runAction(cc.repeat(cc.sequence([cc.delayTime(intervalTime), cc.callFunc(callback)]), data.count));
                            }
                        };
                        node["stopAnimation"] = function () {
                            node.stopAllActions();
                        };
                        cb(null, node);
                    }
                })
            }
        });
    };

    // 获取单位向量
    public getUnitVector = function (startPoint, endPoint) {
        let point = cc.v2(0, 0);
        let distance;
        distance = Math.pow((startPoint.x - endPoint.x), 2) + Math.pow((startPoint.y - endPoint.y), 2);
        distance = Math.sqrt(distance);
        if (distance === 0) return point;
        point.x = (endPoint.x - startPoint.x) / distance;
        point.y = (endPoint.y - startPoint.y) / distance;
        return point;
    };

    public getRelativePosition = function (childNode, parentNode) {
        return parentNode.convertToNodeSpace(childNode.parent.convertToWorldSpace(childNode.position));
    };

    public setPageTitle = function (titleText) {
        if (!cc.sys.isBrowser) return;
        document.title = titleText;
    };

    //跨域图片或者本地图片
    public updateSpriteFrame = function (imgUrl, target_, cb=null) {
        let target = target_;
        if(imgUrl==""||imgUrl==undefined||imgUrl==null){
            return;
        }
        if ((imgUrl && imgUrl.indexOf('http') > 0)) {
            cc.loader.load({ url: imgUrl, type: "png" }, function (err, texture) {
                if (!!err) {
                    cc.error(err);
                    Global.Utils.invokeCallback(cb, err);
                } else {
                    if (target.isValid) {
                        target.spriteFrame = new cc.SpriteFrame(texture);
                        Global.Utils.invokeCallback(cb);
                    }
                }
            });
            //加载本地图片
        } else {
            cc.loader.loadRes(imgUrl, cc.SpriteFrame, function (err, spriteFrame) {
                if (!!err) {
                    cc.log(err);
                    Global.Utils.invokeCallback(cb, err);
                } else {
                    if (target.isValid) {
                        target.spriteFrame = spriteFrame;
                        Global.Utils.invokeCallback(cb);
                    }
                }
            });
        }
    };

    public loadRes = function (dirArr, cb) {
        let loadingCount = 0;
        for (let i = 0; i < dirArr.length; i++) {
            cc.loader.loadResDir(dirArr[i], function (err) {
                loadingCount += 1;
                if (loadingCount >= (dirArr.length)) {
                    Global.Utils.invokeCallback(cb, err);
                }
            }.bind(this));
        }
    };

    public releaseRes = function (dirArr) {
        for (let i = 0; i < dirArr.length; i++) {
            cc["assetManager"].releaseAsset(dirArr[i]);
            //cc.loader.releaseResDir(dirArr[i]);
        }
    };

    public createSpriteNode = function (src) {
        let node = new cc.Node();
        let sprite: cc.Sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = new cc.SpriteFrame();
        this.updateSpriteFrame(src, sprite);
        return node;
    };

    // 刷新对齐
    public updateNodeAlignment = function (node) {
        let widget = node.getComponent(cc.Widget);
        if (!!widget) {
            widget.updateAlignment();
        }
        for (let i = 0; i < node.children.length; ++i) {
            this.updateNodeAlignment(node.children[i]);
        }
    };

    // 屏幕适配
    public screenAdaptation = function (baseSize, canvas) {
        let size = cc.size(baseSize.width, baseSize.height);
        let frameSize = cc.view.getFrameSize();
        /*if (size.height/size.width < frameSize.height/frameSize.width){
            size.height = size.width * (frameSize.height / frameSize.width);
        } else {
            return;
        }*/
        //size.width = size.height * (frameSize.width/frameSize.height);
        if (size.height / size.width < frameSize.height / frameSize.width) {
            //size.height = size.width * (frameSize.height / frameSize.width);`
            canvas.fitHeight = false;
            canvas.fitWidth = true;
        } else {
            size.width = size.height * (frameSize.width / frameSize.height);
            canvas.designResolution = size;

            canvas.node.width = size.width;
            canvas.node.height = size.height;
        }

        if (cc.sys.isNative || true) return;
        cc.view.setResizeCallback(function () {
            size = cc.size(baseSize.width, baseSize.height);
            frameSize = cc.view.getFrameSize();
            if (size.height / size.width < frameSize.height / frameSize.width) {
                size.height = size.width * (frameSize.height / frameSize.width);
            } else {
                size.width = size.height * (frameSize.width / frameSize.height);
            }
            canvas.designResolution = size;
            canvas.node.width = size.width;
            canvas.node.height = size.height;

            MessageCallback.ins.emitMessage("DesignResolutionChanged", size);

            this.updateNodeAlignment(canvas.node);
        });
    };

    public playPreSound = function () {
        cc.loader.loadRes('Sound/button', function (err, clip) {
            if (!!err) { } else {
                cc.audioEngine.play(clip, false, 1);
            }
        });
    };

    private color_red=cc.color(181,13,13);//red
    private color_green=cc.color(16,136,50);
    public setLabelColorByValue(_label:cc.Label,_value:number):void{
        if(_value>=0){
            _label.node.color=this.color_red;
        }else{
            _label.node.color=this.color_green;
        }
        _label.string=this.getNumFormStr(_value);
    }
    public setLabelColorByBool(_label:cc.Label,_isred:boolean):void{
        if(_isred){
            _label.node.color=this.color_red;
        }else{
            _label.node.color=this.color_green;
        }
    }
    public getNumFormStr(_value:number):string{
        let str="";
        if(_value>=0){
            str="+"+_value;
        }else{
            str=_value+"";
        }
        return str;
    }
}