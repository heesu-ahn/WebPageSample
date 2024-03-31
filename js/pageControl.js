import { ComponentModel } from './core/Component.js';
import { WebSocketServiceModule } from './WebSocketServiceModule.js';
const Router = class{
    constructor(pageName) {
        this.comp = new ComponentModel(pageName);
        this.comp.WebSocketServiceModule = WebSocketServiceModule;
        this.loadPage = function(){
            let comp = this.comp;
            variableObject.set(pageName);
            variableObject.getOnChange = function() {
                if(this.value) {
                    console.log(this.value);
                    document.head.childNodes.forEach((item)=>{
                        if(item.nodeName == 'LINK'){
                            document.head.removeChild(item);
                        }
                    })
                    comp.setPageName(this.value);
                }
            }
        }
    }
}

var router = new Router(globalVariable.pageName);
router.loadPage();