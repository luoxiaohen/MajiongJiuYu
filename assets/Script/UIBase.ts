import { UIViewZorderEnum } from "./enum/EnumManager";
import DialogManager from "./Shared/DialogManager";
import { Global } from "./Shared/GloBal";

const { ccclass } = cc._decorator;
@ccclass
export default class UIBase extends cc.Component {
    /**打开ui的参数 */
    public dialogParameters: any;
    /**默认为0 大于0时 代表当打开自身时会关闭其他相同值的界面*/
    public z_order:UIViewZorderEnum=UIViewZorderEnum.None;
    /**销毁标识符 */
    public isDestroy:boolean=false;
    disTory(){
        if(this.node && this.node.parent){
            DialogManager.ins.onDestroyOneDialog(this);
            this.isDestroy=true;
            this.node.parent.removeChild(this.node);
            this.destroy();
        }else{
            this.isDestroy=true;
            Global.Utils.debugOutput("you want remove a nil object");
        }
    }
}

