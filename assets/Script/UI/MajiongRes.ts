// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class MajiongRes extends cc.Component {

    @property(cc.SpriteAtlas)
    res: cc.SpriteAtlas = null;

    public getSpriteFrame(frameName: string): cc.SpriteFrame{
        return this.res.getSpriteFrame(frameName);
    }
}
