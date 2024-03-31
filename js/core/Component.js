import { Observer } from './observer.js';
import { TableComponent } from './TableComponent.js';

export class ComponentModel extends Observer  {
  #pageName
  #initialHead
  #WebSocketServiceModule
  constructor(pageName) {
    super();
    this.#pageName = pageName;
    if(this.#pageName) this.setPageName(this.#pageName,this.#initialHead);
  }
  getPageName() {
    return this.#pageName;
  }
  setPageName(pageName,initialHead) {
    this.#pageName = pageName; //상태 변경
    this.#initialHead = initialHead;
    if(this.#initialHead){
      console.log(initialHead);
    }
    this.notify(); //등록된 렌더링 함수들 호출
  }
  notify(){
    const compView = new ComponentView(this);
    compView.render();
    compView.loadScript(this.#pageName);
  }
}

export class ComponentView {
  #target
  constructor(model) {
    this.#target = document.getElementById("BODY");
    this.compModel = model;
    this.WebSocketServiceModule = model.WebSocketServiceModule;
    this.tblComp = new TableComponent(); // HTML 테이블 동적 생성 컴포넌트
    this.render();
    this.srcType = {
      script: { element: "script", type: "text/javascript", rel: "" },
      style: { element: "link", type: "text/css", rel: "stylesheet" }
    }
    this.loadHtml = async function (pageName) {
      console.log('loadHtml');
      const response = await fetch(`/template/template.html`);
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      if(pageName == 'login'){
        if(doc.body.getElementsByClassName(`${pageName}`)[0] != undefined) document.body.innerHTML += doc.body.getElementsByClassName(`${pageName}`)[0].innerHTML;
        else document.body.innerHTML = '';
      }
      else{
        if(doc.body.getElementsByClassName(`${pageName}`)[0] != undefined){
          document.body.innerHTML += doc.body.getElementsByClassName(`${pageName}`)[0].outerHTML;
          // $$TableComponent; 문자열 치환 방식
          if(document.body.innerHTML.indexOf('$$TableComponent;') > -1){
            // 사용자 정의 HTML 요소
            let elementIds = [
              {elementId : 'checkAll',tagName : 'input',type: 'checkbox', name:'all'},
              {elementId : 'img_btn', colspan : '2',label:'통신 요청 구분'}
            ];
            const createTable = tblComp.TableLoad('requestTable','SelectServer',elementIds); // 테이블 ID,tbody ID 기준 테이블 동적 생성
            document.body.innerHTML = document.body.innerHTML.replace('$$TableComponent;',createTable); // 생성된 동적 테이블 요소로 문자열 치환
          }
        }
        else document.body.innerHTML = '';
      }
      return document.body.innerHTML;
    }
    this.loadScript = function (pageName) {
      window.WebSocketServiceModule = this.WebSocketServiceModule;
      window.tblComp = this.tblComp;
      let styles = [`./css/${pageName}.css`];
      styles.forEach((style, idx) => {
        styles[idx] = Promise.resolve(this.loadDynamicSrc(
            this.srcType.style.element, 
            this.srcType.style.type, 
            this.srcType.style.rel, 
            style, 
            ((result) => {
                console.log(result);
                document.body.removeAttribute("class");
            })));
      });
      Promise.all(styles)
      .then(() => {
          this.loadHtml(pageName)
          .then((html) => {
            if (html) {
              let scripts = [`./js/${pageName}Control.js`,'./js/commonFunctuion.js'];
              scripts.forEach((script) => {
                  this.loadDynamicSrc(
                      this.srcType.script.element, 
                      this.srcType.script.type, 
                      this.srcType.script.rel, 
                      script, 
                      ((result) => {
                      console.log(result);
                  }));
              });
              }
          });
      });
    }
    this.loadDynamicSrc = function (element, type, rel, file, callback) {
        console.log('Loading script ' + file);
        var addNewScript;
        var script = document.createElement(element);
        script.type = type;
        if (rel != '') {
            script.rel = rel;
            script.href = file;
            addNewScript = document.getElementsByTagName('script')[0];
            addNewScript.parentNode.insertBefore(script, addNewScript);
        }
        else {
            script.src = file;
            script.defer = true;
            addNewScript = document.getElementsByTagName('script')[0];
            addNewScript.parentNode.insertBefore(script, addNewScript);
        }
        script.onload = function () {
            console.log(`Loaded ${type}`);
            document.head.appendChild(this);
            callback(this);
        };
    }
  }
  render() {
    this.compModel.getPageName(); //Model의 상태를 가져와서 렌더링
    document.body.innerHTML = '';
    document.body.setAttribute("class","hidden");
  }
}