import { Global } from "./Shared/GloBal";

const { ccclass } = cc._decorator;
@ccclass
export default class UIBase extends cc.Component {
    /**打开ui的参数 */
    public dialogParameters: any;



    disTory(){
        if(this.node && this.node.parent){
            this.node.parent.removeChild(this.node);
            this.destroy();
        }else{
            Global.Utils.debugOutput("you want remove a nil object");
        }
    }
}

