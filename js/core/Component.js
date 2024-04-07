import { Observer } from './observer.js';
export class ComponentModel extends Observer  {
  #pageName
  #initialHead
  constructor(pageName) {
    super();
    this.#pageName = globalVariable.pageName;
    this.observer = new MutationObserver(this.callback);
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
    if(__valueObject && __valueObject.hasOwnProperty(this.#pageName)){
      this.observer.observe(document.body, this.config);
      compView.loadScript(this.#pageName,__valueObject[this.#pageName].addScript);
    } else {
      this.observer.observe(document.body, this.config);
      compView.loadScript(this.#pageName);
    }
    globalVariable.pageName = this.#pageName;
  }
}

export class ComponentView {
  #target
  constructor(model) {
    this.#target = document.getElementById("BODY");
    this.compModel = model;
    this.render();
    this.srcType = { // 지정된 네이밍룰에 맞춰서 동적으로 자원을 가져올 수 있게 해주는 변수
      style:  { name : "Style", pattern:"css", element: "link", type: "text/css", rel: "stylesheet" },
      script: { name : "Control", pattern:"js", element: "script", type: "text/javascript", rel: "" }
    }
    // 템플릿 페이지에서 동적으로 현재 페이지의 HTML 텍스트를 받아오는 함수
    this.loadHtml = async function (pageName) {
      if(this.compModel.observer){
        this.compModel.observer.disconnect();
      }
      const response = await fetch(`./template/template.html`);
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      if(doc.body.getElementsByClassName(`${pageName}`)[0] != undefined) document.body.innerHTML += doc.body.getElementsByClassName(`${pageName}`)[0].innerHTML;
      else document.body.innerHTML = '';
      // else{
      //   if(this.compModel.observer){
      //     this.compModel.observer.disconnect();
      //     const targetElement = doc.body.getElementsByClassName('targetElement');
      //     if(targetElement.childNodes.length > 0){
      //       console.log(targetElement.childNodes);
      //     }
      //     if(__valueObject){
      //       // 사용자 정의 HTML 요소
      //       __valueObject[`${pageName}`].elementIds = [
      //         {elementId : 'checkAll',tagName : 'input',type: 'checkbox', name:'all'},
      //         {elementId : 'img_btn', colspan : '2',label:'통신 요청 구분'}
      //       ];
      //     }
      //   }
      //   if(doc.body.getElementsByClassName(`${pageName}`)[0] != undefined){
      //     document.body.innerHTML += doc.body.getElementsByClassName(`${pageName}`)[0].outerHTML;
      //     // $$TableComponent; 문자열 치환 방식
      //     if(document.body.getElementsByTagName('div').getElementsByClassName('targetElement').childNodes.length > 0){
      //       // 사용자 정의 HTML 요소
      //       let elementIds = [
      //         {elementId : 'checkAll',tagName : 'input',type: 'checkbox', name:'all'},
      //         {elementId : 'img_btn', colspan : '2',label:'통신 요청 구분'}
      //       ];
      //       const createTable = this.tblComp.TableLoad('requestTable','SelectServer',__valueObject[`${pageName}`].elementIds); // 테이블 ID,tbody ID 기준 테이블 동적 생성
      //       document.body.innerHTML = document.body.innerHTML.replace('$$TableComponent;',createTable); // 생성된 동적 테이블 요소로 문자열 치환
      //     }
      //   }
      //   else document.body.innerHTML = '';
      // }
      return document.body.innerHTML;
    }
    // 동적으로 자바스크립트와 스타일 시트를 받아오는 함수
    this.loadScript = function (pageName,addScript) {
      const target = this.srcType;
      const loadDynamicSrc = this.loadDynamicSrc;
      const convertArrayItemData = this.convertArrayItemData;
      
      this.removeSrc(convertArrayItemData);
      this.loadHtml(pageName).then((html) => {if (html) {
      // 신규 스크립트 및 스타일 시트 동적 로드
      convertArrayItemData(Object.entries(target),function(undefined,idx,script){
        const source = target[script[idx][0]];
        const srcList = [`./${source.pattern}/${pageName}`.concat(source.name,'.',source.pattern)]; // 기본 스크립트를 제외하고 추가로 로드하는 경우를 대비해서 배열로 관리
        if(source.pattern == 'js' && !srcList.includes('./js/commonFunctuion.js') ){ srcList.push('./js/commonFunctuion.js'); };
        let params = [source.pattern,source.element,source.type,source.rel];
        convertArrayItemData(srcList,function(style,idx,undefined){srcList[idx] = Promise.resolve(loadDynamicSrc(params[0],params[1],params[2],params[3],style,((result) => {
          console.log(result);
        })));});});
      }});
      document.body.setAttribute("class",document.body.getAttribute("class").replace("hidden",""));
    }
    this.loadDynamicSrc = function (pattern, element, type, rel, file, callback) {
      var addNewScript;
      var script = document.createElement(element);
      script.type = type;
      if (pattern == 'css') { // 스타일시트
          script.rel = rel;
          script.href = file;
          addNewScript = document.getElementsByTagName('script')[0];
          addNewScript.parentNode.insertBefore(script, addNewScript);
      } else { // 스크립트
          script.src = file;
          if(!file.includes('commonFunctuion')) script.defer = true;
          addNewScript = document.getElementsByTagName('script')[0];
          addNewScript.parentNode.insertBefore(script, addNewScript);
      }
      script.onload = function () {
          document.head.appendChild(this);
          callback(this);
      };
    }
    this.removeSrc = function(convertArrayItemData){
        // 기존의 스크립트 파일 제거
        convertArrayItemData(document.head.childNodes,
        function(item){
          if(item.localName && item.localName == 'script' && !item.src.includes('pageControl')){
            document.head.removeChild(item);
          }
      });
      // 기존의 스타일시트 제거
      convertArrayItemData(document.head.childNodes,
      function(item){
        if(item.localName && item.localName == 'link'){
          document.head.removeChild(item);
        }
      });
    }
    this.convertArrayItemData = function(origin, method){ // 반복문 처리 관련 공통 함수
        origin.forEach(function(item,index,array){
          method(item,index,array);
      }); 
    }
  }
  render() {
    this.compModel.getPageName(); //Model의 상태를 가져와서 렌더링
    document.body.innerHTML = '';
    document.body.setAttribute("class","hidden");
  }
}