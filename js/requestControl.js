"use strict"



let excluedeElemnets = [];
let rowCount = 0;

let resetBtnFn = function(){
    let resetBtn = document.getElementById('resetBtn');
    if(resetBtn) resetBtn.addEventListener("click",()=>{InitForm(globalVariable.moduleName);});
    return resetBtn ? true  : this;
}; 
if(!resetBtnFn()) excluedeElemnets.push(resetBtnFn);

let requestBtnFn = function(){
    let requestBtn = document.getElementById('requestBtn');
    if(requestBtn) requestBtn.addEventListener("click",()=>{WebSocketConnectionTest();});
    return requestBtn ? true  : this;
} 
if(!requestBtnFn()) excluedeElemnets.push(requestBtnFn);

let checkAllFn = function(){
    let checkAll = document.getElementById('checkAll');
    if(checkAll) checkAll.addEventListener("click",()=>{checkAllItems(checkAll);});
    return checkAll ? true  : this;
}
if(!checkAllFn()) excluedeElemnets.push(checkAllFn);

let imgBtnFn = function(){
    let img_btn = document.getElementById('img_btn');
    if(img_btn) {
        img_btn.addEventListener("click",(elem)=>{insertRow();});
        let btnImg = img_btn ? img_btn.querySelector('img[class=addBtn]') : undefined;
        if(btnImg){
            btnImg.src = './addbtn.png';
        }
    }
    return img_btn ? true  : this;
}
if(!imgBtnFn())excluedeElemnets.push(imgBtnFn);


let closeModalFn = function(){
    let closeModal = document.getElementById('closeModal');
    if(closeModal)closeModal.addEventListener("click",(elem)=>{
        let modalContent = document.getElementById('modalContent');
        modalContent.setAttribute("class","hidden");    
    });
    return closeModal ? true  : this;
}
if(!closeModalFn()) excluedeElemnets.push(closeModalFn);

if(window.localStorage.getItem('currentUserName')) {
  let loginUserInfo = JSON.parse(window.localStorage.getItem('currentUserName'));
  if(loginUserInfo && (typeof loginUserInfo === 'object') && loginUserInfo.hasOwnProperty('loginUserName')){
    document.getElementById("loginPassword").value = loginUserInfo.loginPassword;
  }
}

let testServerList = [];

const alertModal = document.getElementById("alertModal");

__valueObject['request'].excluedeElemnets = excluedeElemnets;
        
function WebSocketConnectionTest() {

    var params = [];

    const selectedEls = testServerList;
    selectedEls.forEach((el) => {
        params.push({METHOD_NAME : "TEST", REQUEST_TYPE : el.type});
    });

    if (params.length == 0) {
        alertModal.setAttribute("class","");
        OpenAlert('테스트 서버를 선택해주세요.',alertModal);
        return;
    }
    
    var password = '';
    var cookieValue = getCookie(globalVariable.moduleName);

    if (cookieValue != "") password = cookieValue;
    else {
        if(window.localStorage.getItem('currentUserName')){
            password = JSON.parse(window.localStorage.getItem('currentUserName')).loginPassword;
        }
        else{
            password = document.getElementById("loginPassword").value;
        }
    }
    if (password == "") {
        alertModal.setAttribute("class","");
        OpenAlert('비밀번호를 입력해주세요.',alertModal);
    }
    else {
        const savePassword = document.getElementById("reUsePassword").checked;
        if(__valueObject.WebSocketServiceModule){
            let WS = __valueObject.WebSocketServiceModule.WebSocketMessageModule;
            WS.WebSocketConnection(params, password, savePassword, callbackSuccess, callbackFail);

        }
    }
}
function callbackSuccess(result) {
    if (result != undefined) {
        if(typeof (result) == 'string' && result.startsWith('{')){
            let data = JSON.parse(result);
            if(!data.hasOwnProperty('Authorization')){
                console.log(data);
            }
        }
        else{
            alertModal.setAttribute("class","");
            getResult(result);
        }
    }
}
function callbackFail(result) {
    if (result != undefined) {
        if (typeof (result) == 'string' && result.startsWith('{')) {
            let data = JSON.parse(result);
            console.log(data);
        }
        else {
            getResult(result); 
        }
    }
}
const getResult = function(result){
    let resultTextArea = document.getElementById('getResult').getElementsByClassName('getResult')[0];
    resultTextArea.value += '\n' + result;
    resultTextArea.scrollTop = resultTextArea.scrollHeight;
}
function clearResult(){
    document.getElementById('getResult').getElementsByClassName('getResult')[0].value = "";
}


function getCookie(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value ? unescape(value[2]) : '';
};

function InitForm(name) {
    
    if(document.cookie == ""){
        alertModal.setAttribute("class","");
        OpenAlert('저장된 비밀번호가 존재하지 않습니다.',alertModal);
    }
    else{
        let question = confirm('저장된 비밀번호를 삭제 하시겠습니까?');
        if(question){
            alertModal.setAttribute("class","");
            OpenAlert('저장된 비밀번호가 삭제되었습니다.',alertModal);
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            
            if(window.localStorage.getItem('currentUserName')){
                window.localStorage.removeItem('currentUserName');
            }
        }
    }
}

var cookieValue = getCookie(globalVariable.moduleName);
if (cookieValue != '') {
    document.getElementById("reUsePassword").checked = true;
    document.getElementById("loginPassword").readOnly  = true;
}

var insertRow = function(){
    let tbl = document.getElementById("SelectServer");
    let row = undefined;
    let rowIdx = 0;
    
    if(rowCount < 4){
        if(rowCount == 0){
            row = tbl.insertRow(0);
            row.setAttribute("id","ro_"+ rowCount.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}));
            row.setAttribute("class","active-row");
            rowCount +=1;
        } 
        else{
            let currentActive = document.querySelector(".active-row");
            currentActive.setAttribute("class","");
            row = tbl.insertRow(rowCount);
            row.setAttribute("id","ro_"+ rowCount.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}));
            row.setAttribute("class","active-row");
            rowCount +=1;
        }
        rowIdx = rowCount;
    }
    else if(rowCount == 4){
        alertModal.setAttribute("class","");
        OpenAlert('복합 요청은 3가지 조합까지만 가능합니다.',alertModal);
    }
    
    if(row != undefined){
        if(rowCount == 4){
            alertModal.setAttribute("class","");
            OpenAlert('복합 요청은 3가지 조합까지만 가능합니다.',alertModal);
        }
        else{

            const addRow = function(){
                var elem = document.createElement("td"); 
                elem.setAttribute("id",`ro_${tbl.rows.length}_td01`);
                elem.innerHTML = `<input type="checkbox" name="server" id="ro_${tbl.rows.length}_chk01" value="false">`;
                row.appendChild(elem); 
                // 전체 체크 박스 선택 시 추가된 체크박스에서도 체크박스 표시
                if(checkAll.checked){
                    var cbs = document.getElementById(elem.id).querySelector('input[name=server]');
                    cbs.checked = true;
                }
                elem = document.createElement("td"); 
                elem.setAttribute("id",`ro_${tbl.rows.length}_td02`);
                elem.innerHTML = `<select name="${row.id.replace('ro','select')}" id="${row.id.replace('ro','select')}"><option id="tcp" value="TestTcpServer">TCP/IP 통신</option><option id="http" value="TestHttpServer">HTTP 통신</option><option id="websocket" value="TestWebSocketServer">웹소켓 통신</option></select>`
                // 옵션 변경 시점 값 저장
                elem.addEventListener("change", function() {
                    let id = row.id.replace('ro','select')
                    let selectOption = document.getElementById(id);
                    selectOption =  selectOption.options[selectOption.selectedIndex].value;
                    (testServerList.find(e => e.id == id))["type"] = selectOption;
                });
                row.appendChild(elem); 
                elem = document.createElement("td"); 
                elem.setAttribute("id",`ro_${tbl.rows.length}_td03`);
                elem.innerHTML = `<a id="requestMethod">요청 작성</a>`;
                elem.getElementsByTagName('a')[0].addEventListener('click',()=>{
                    tblComp.RegReqeust(elem);
                });
                row.appendChild(elem);
                return elem.innerHTML;
            };
            addRow();
            testServerList.push({id : row.id.replace('ro','select'), type : 'TestTcpServer'});
        }
    }
}
const checkAllItems = function(bx) {
    let cnt = 0;
    const regex = /_chk/gi;
    var cbs = document.getElementsByTagName('input');
    for(var i =0; i < cbs.length; i++) {
        if(cbs[i].type == 'checkbox' && cbs[i].id.match(regex) != null) {
            cbs[i].checked = bx.checked;
            cnt ++;
        }
    }
    if(cnt == 0) {
        bx.checked = false;
        alertModal.setAttribute("class","");
        OpenAlert('선택할 대상이 존재하지 않습니다.',alertModal);
    }
}


var targetElement = __valueObject.commonFunction.setTargetElement('reqeust');
if(targetElement){
    let elementIds = [
        {elementId : 'checkAll',tagName : 'input',type: 'checkbox', name:'all'},
        {elementId : 'img_btn', colspan : '2',label:'통신 요청 구분'}
    ];
    const createTable = __valueObject.tableComponent.TableLoad('requestTable','SelectServer',elementIds); // 테이블 ID,tbody ID 기준 테이블 동적 생성
    document.getElementById('tableComponent').innerHTML = createTable; 
    __valueObject.request.excluedeElemnets.forEach((excludeElement)=>{
        return excludeElement();
    })
    __valueObject.request.excluedeElemnets = [];
}