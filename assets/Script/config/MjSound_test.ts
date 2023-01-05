export default class MjSound_test{
    private configName = "MjSound_test";
    public dataLength:number = 120;
    public data = {
        key_0:new MjSound_testItem("01001",1,[1,3,],[1111]),
        key_1:new MjSound_testItem("01002",1,[1],[0]),
        key_2:new MjSound_testItem("01003",1,[3],[1]),
        key_3:new MjSound_testItem("01004",1,[4],[2]),
        key_4:new MjSound_testItem("01005",1,[5],[3]),
        key_5:new MjSound_testItem("01006",1,[6],[4]),
        key_6:new MjSound_testItem("01007",1,[7],[5]),
        key_7:new MjSound_testItem("01008",1,[8],[6]),
        key_8:new MjSound_testItem("01009",1,[9],[7]),
        key_9:new MjSound_testItem("01011",2,[10],[8]),
        key_10:new MjSound_testItem("01012",1,[11],[9]),
        key_11:new MjSound_testItem("01013",1,[12],[10]),
        key_12:new MjSound_testItem("01014",1,[13],[11]),
        key_13:new MjSound_testItem("01015",1,[14],[12]),
        key_14:new MjSound_testItem("01016",1,[15],[13]),
        key_15:new MjSound_testItem("01017",1,[16],[14]),
        key_16:new MjSound_testItem("01018",1,[17],[15]),
        key_17:new MjSound_testItem("01019",1,[18],[16]),
        key_18:new MjSound_testItem("01021",1,[19],[17]),
        key_19:new MjSound_testItem("01022",1,[20],[18]),
        key_20:new MjSound_testItem("01023",1,[21],[19]),
        key_21:new MjSound_testItem("01024",1,[22],[20]),
        key_22:new MjSound_testItem("01025",1,[23],[21]),
        key_23:new MjSound_testItem("01026",1,[24],[22]),
        key_24:new MjSound_testItem("01027",1,[25],[23]),
        key_25:new MjSound_testItem("01028",1,[26],[24]),
        key_26:new MjSound_testItem("01029",1,[27],[25]),
        key_27:new MjSound_testItem("0103",2,[28],[26]),
        key_28:new MjSound_testItem("0104",2,[29],[27]),
        key_29:new MjSound_testItem("0105",1,[30],[28]),
        key_30:new MjSound_testItem("01101",1,[31],[29]),
        key_31:new MjSound_testItem("01102",1,[32],[30]),
        key_32:new MjSound_testItem("01103",1,[33],[31]),
        key_33:new MjSound_testItem("01104",1,[34],[32]),
        key_34:new MjSound_testItem("01105",1,[35],[33]),
        key_35:new MjSound_testItem("01106",1,[36],[34]),
        key_36:new MjSound_testItem("01107",1,[37],[35]),
        key_37:new MjSound_testItem("01108",1,[38],[36]),
        key_38:new MjSound_testItem("01109",1,[39],[37]),
        key_39:new MjSound_testItem("01111",1,[40],[38]),
        key_40:new MjSound_testItem("01112",1,[41],[39]),
        key_41:new MjSound_testItem("01113",1,[42],[40]),
        key_42:new MjSound_testItem("01114",1,[43],[41]),
        key_43:new MjSound_testItem("01115",1,[44],[42]),
        key_44:new MjSound_testItem("01116",1,[45],[43]),
        key_45:new MjSound_testItem("01117",1,[46],[44]),
        key_46:new MjSound_testItem("01118",1,[47],[45]),
        key_47:new MjSound_testItem("01119",1,[48],[46]),
        key_48:new MjSound_testItem("01121",1,[49],[47]),
        key_49:new MjSound_testItem("01122",1,[50],[48]),
        key_50:new MjSound_testItem("01123",1,[51],[49]),
        key_51:new MjSound_testItem("01124",1,[52],[50]),
        key_52:new MjSound_testItem("01125",1,[53],[51]),
        key_53:new MjSound_testItem("01126",1,[54],[52]),
        key_54:new MjSound_testItem("01127",1,[55],[53]),
        key_55:new MjSound_testItem("01128",1,[56],[54]),
        key_56:new MjSound_testItem("01129",1,[57],[55]),
        key_57:new MjSound_testItem("0113",2,[58],[56]),
        key_58:new MjSound_testItem("0114",2,[59],[57]),
        key_59:new MjSound_testItem("0115",1,[60],[58]),
        key_60:new MjSound_testItem("00001",2,[61],[59]),
        key_61:new MjSound_testItem("00002",2,[62],[60]),
        key_62:new MjSound_testItem("00003",2,[63],[61]),
        key_63:new MjSound_testItem("00004",3,[64],[62]),
        key_64:new MjSound_testItem("00005",1,[65],[63]),
        key_65:new MjSound_testItem("00006",1,[66],[64]),
        key_66:new MjSound_testItem("00007",1,[67],[65]),
        key_67:new MjSound_testItem("00008",1,[68],[66]),
        key_68:new MjSound_testItem("00009",2,[69],[67]),
        key_69:new MjSound_testItem("00011",4,[70],[68]),
        key_70:new MjSound_testItem("00012",4,[71],[69]),
        key_71:new MjSound_testItem("00013",1,[72],[70]),
        key_72:new MjSound_testItem("00014",2,[73],[71]),
        key_73:new MjSound_testItem("00015",1,[74],[72]),
        key_74:new MjSound_testItem("00016",2,[75],[73]),
        key_75:new MjSound_testItem("00017",1,[76],[74]),
        key_76:new MjSound_testItem("00018",3,[77],[75]),
        key_77:new MjSound_testItem("00019",2,[78],[76]),
        key_78:new MjSound_testItem("00021",4,[79],[77]),
        key_79:new MjSound_testItem("00022",3,[80],[78]),
        key_80:new MjSound_testItem("00023",3,[81],[79]),
        key_81:new MjSound_testItem("00024",3,[82],[80]),
        key_82:new MjSound_testItem("00025",3,[83],[81]),
        key_83:new MjSound_testItem("00026",1,[84],[82]),
        key_84:new MjSound_testItem("00027",1,[85],[83]),
        key_85:new MjSound_testItem("00028",2,[86],[84]),
        key_86:new MjSound_testItem("00029",3,[87],[85]),
        key_87:new MjSound_testItem("0003",3,[88],[86]),
        key_88:new MjSound_testItem("0004",4,[89],[87]),
        key_89:new MjSound_testItem("0005",2,[90],[88]),
        key_90:new MjSound_testItem("00101",2,[91],[89]),
        key_91:new MjSound_testItem("00102",1,[92],[90]),
        key_92:new MjSound_testItem("00103",2,[93],[91]),
        key_93:new MjSound_testItem("00104",3,[94],[92]),
        key_94:new MjSound_testItem("00105",1,[95],[93]),
        key_95:new MjSound_testItem("00106",1,[96],[94]),
        key_96:new MjSound_testItem("00107",1,[97],[95]),
        key_97:new MjSound_testItem("00108",1,[98],[96]),
        key_98:new MjSound_testItem("00109",2,[99],[97]),
        key_99:new MjSound_testItem("00111",4,[100],[98]),
        key_100:new MjSound_testItem("00112",4,[101],[99]),
        key_101:new MjSound_testItem("00113",1,[102],[100]),
        key_102:new MjSound_testItem("00114",2,[103],[101]),
        key_103:new MjSound_testItem("00115",1,[104],[102]),
        key_104:new MjSound_testItem("00116",2,[105],[103]),
        key_105:new MjSound_testItem("00117",1,[106],[104]),
        key_106:new MjSound_testItem("00118",3,[107],[105]),
        key_107:new MjSound_testItem("00119",2,[108],[106]),
        key_108:new MjSound_testItem("00121",4,[109],[107]),
        key_109:new MjSound_testItem("00122",2,[110],[108]),
        key_110:new MjSound_testItem("00123",3,[111],[109]),
        key_111:new MjSound_testItem("00124",3,[112],[110]),
        key_112:new MjSound_testItem("00125",3,[113],[111]),
        key_113:new MjSound_testItem("00126",1,[114],[112]),
        key_114:new MjSound_testItem("00127",1,[115],[113]),
        key_115:new MjSound_testItem("00128",2,[116],[114]),
        key_116:new MjSound_testItem("00129",3,[117],[115]),
        key_117:new MjSound_testItem("0013",3,[118],[116]),
        key_118:new MjSound_testItem("0014",4,[119],[117]),
        key_119:new MjSound_testItem("0015",2,[120],[118]),
    }
    public getData(id:number):MjSound_testItem{

            let key = "key_"+id;
            let data = this.data[key];
            if(!data){
                console.error("配置表错误,找不到对应ID数据,配置表名称:"+this.configName+",ID:"+id);
            }
            return data;
        }
    }
        
export class MjSound_testItem{
    public id:string;
    public num:number;
    public arg:any;
    public argstr:any;
    constructor(id:string,num:number,arg:any,argstr:any){
        this.id=id;
        this.num=num;
        this.arg=arg;
        this.argstr=argstr;

    }
}
    