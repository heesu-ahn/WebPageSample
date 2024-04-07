import { ComponentModel } from './core/Component.js';
import { TableComponent } from './core/TableComponent.js';
import { WebSocketServiceModule } from './WebSocketServiceModule.js';

const Router = class{
    constructor(pageName) {
        this.comp = new ComponentModel(pageName);
        this.loadPage = function(){
            let comp = this.comp;
            variableObject.set(pageName);
            variableObject.getOnChange = function() {
                if(this.value) {
                    document.title = this.value;
                    comp.setPageName(document.title);

                    if(__valueObject && __valueObject.hasOwnProperty(document.title)) injectObject(document.title,__valueObject[document.title]);
                    else injectObject(document.title);
                }
            }
        }
    }
}

var router = new Router(globalVariable.pageName);
router.loadPage();
var valueControlObject;
// 전역 상태 관리 변수
function injectObject(target,changeValue){
    function variableModule() {
        this.valueMember = {
        };
        variableModule.prototype.setValue = function(target,changeValue){
            if(!target){
                this.valueMember[globalVariable.pageName] = {};
            }
            else {
                if(!changeValue) this.valueMember[target] = {};
                else this.valueMember[target] = changeValue;
            }
            return this.valueMember;
        };
    }
    if(!__valueObject){
        valueControlObject = new variableModule();
    }
    function commonConrolService(){
        this.setTargetElement = function(pageName){
            const targetElement = document.body.getElementsByClassName('targetElement');
            if(targetElement.length > 0){
              return {targetElement};
            }
        }
        return{
          setTargetElement : this.setTargetElement
        }
    };
    valueControlObject.setValue(target,changeValue);
    __valueObject = valueControlObject.valueMember;
    __valueObject.WebSocketServiceModule = WebSocketServiceModule;
    __valueObject.commonFunction = new commonConrolService();
    __valueObject.tableComponent = new TableComponent(); // HTML 테이블 동적 생성 컴포넌트
}
injectObject();

