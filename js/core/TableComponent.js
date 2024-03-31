export class TableComponent {
    #tbodyId
    constructor() {
        this.TableLoad = function(tableElement,tbodyElement,elementIds){
            if(tbodyElement && tbodyElement != '') this.#tbodyId = tbodyElement;
            if( typeof(tableElement) == 'string'){
                let createNewTable = document.createElement('table');
                createNewTable.setAttribute('class','styled-table');
                createNewTable.setAttribute('id',tableElement);
                let thead = document.createElement('thead');
                let tr = document.createElement('tr');
                thead.appendChild(tr);
                this.CreateElement(tr,elementIds);
                createNewTable.appendChild(thead);
                this.findParentElement(createNewTable);
                return createNewTable.outerHTML;
            }
            else{
                this.CreateElement(tableElement,elementIds);
                this.findParentElement(createNewTable);
                return tableElement.outerHTML;
            }
        }
    }
    CreateElement(tableElement,elementIds){
        let elementId = undefined;
        let th = undefined;
        const regexBtn = /_btn/gi;

        elementIds.forEach(function(value,idx){
            elementId = value.elementId;
            if(elementId == 'checkAll'){
                let checkAll = undefined;
                if(document.getElementById(elementId)){
                    checkAll = document.getElementById(elementId);
                    checkAll.addEventListener("click",()=>{
                        this.checkAllItems(checkAll);
                    });
                }
                else {
                    checkAll = document.createElement(value.tagName);//'input'
                    checkAll.setAttribute('type',value.type); //'checkbox'
                    checkAll.setAttribute('name',value.name);//'all'
                    checkAll.setAttribute('id',elementId);
                }
                th = document.createElement('th');
                th.appendChild(checkAll);
                tableElement.appendChild(th);
            }
            else {
                th = document.createElement('th');
                if(value.colspan){
                    th.setAttribute('colspan',value.colspan);
                }
                if(value.label){
                    let label = document.createElement('label');
                    label.innerHTML = value.label;
                    th.appendChild(label);
                }
                if(elementId.match(regexBtn)){
                   let btnScript = `<button type="button" class="btm_image" id="${elementId}"><img class="addBtn" src=""></button>`;
                   let parser = new DOMParser();
                   let html = parser.parseFromString(btnScript, 'text/html');
                   let img_btn = html.body.childNodes[0];
                   let btnImg = img_btn.querySelector('img[class=addBtn]');
                   btnImg.src = './addbtn.png';
                   th.appendChild(img_btn);
                }
                tableElement.appendChild(th);
            }
        });
    }
    checkAllItems = function(bx) {
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
    findParentElement(parentElement){
        const className = parentElement.tagName.toLowerCase();
        if(className != 'table'){
            this.findParentElement(parentElement.parentElement);
        }
        else{
            let tbody = document.createElement('tbody');
            tbody.setAttribute('id',this.#tbodyId);
            parentElement.appendChild(tbody);
        }
    }
    RegReqeust = function (elem){
        document.getElementsByClassName('RequestTable')[0].innerHTML = '';
        
        let modalContent = document.getElementById('modalContent'); 
        let rowCount = elem.id.replace('ro_','').replace('_td03','');
    
        let checkAll = document.getElementById('checkAll');
        let tbl = document.getElementById("requestTable");
        
    
        if(checkAll && tbl.tBodies[0].rows.length > 1){
    
          let textContent = {1 : "PRE_LOAD", 2: "METHOD", 3 : "RESPONSE"}
          document.getElementsByName('MethodName')[0].textContent = `${textContent[rowCount]} 방식 작성.`;
          this.SetRequestTable();
        }
        else{
          if(rowCount == 1){
            document.getElementsByName('MethodName')[0].textContent = `${rowCount}st 요청 정의.`;
          }
          else if(rowCount == 2){
            document.getElementsByName('MethodName')[0].textContent = `${rowCount}nd 요청 정의.`;
          }
          else if(rowCount == 3){
            document.getElementsByName('MethodName')[0].textContent = `${rowCount}rd 요청 정의.`;
          }
          this.SetRequestTable();
        }
        modalContent.setAttribute("class","");    
    }
    SetRequestTable = function(){
        // 동적 아이템 기준 테이블 생성
        let RequestTableItems = {
            reqeustTarget : {
                name : '요청 대상',
                select_target : [{id : 'local' , value : 'LocalServer' , desc : '로컬 서버'},{id : 'develop' , value : 'DevServer' , desc : '개발 서버'},{id : 'operaton' , value : 'OperationServer' , desc : '운영서버'}],
                className : 'twoColumn',
                subTarget : '로컬 서버 정보 확인'
            },
            reqeustType : {
                name : '요청 구분',
                select_type : [{id : 'oauth' , value : 'oauth' , desc : 'OAuth인증', hidden : false},{id : 'login' , value : 'login' , desc : '일반 로그인', hidden : true},{id : 'ssl' , value : 'ssl' , desc : 'SSL', hidden : true}],
                className : 'twoColumn',
                subTarget : '인증 가능 서비스'
            },
            reqeustMethod : {
                name : '요청 방식',
                select_method : [{id : 'options' , value : 'OPTIONS' , desc : 'OPTIONS'},{id : 'get' , value : 'GET' , desc : 'GET'},{id : 'post' , value : 'POST' , desc : 'POST'},{id : 'put' , value : 'PUT' , desc : 'PUT'}]
            },
        };
    
        Object.keys(RequestTableItems).forEach(function(v,i){
            let req = RequestTableItems[v];
            let table = document.getElementsByClassName('RequestTable')[0];
            let thead = document.createElement('thead');
            thead.innerHTML = `<tr><th><label>${req.name}</label></th></tr>`;
            table.appendChild(thead);
            
            let tbody = document.createElement('tbody');
            table.appendChild(tbody);
            let select = document.createElement("select");
            select.setAttribute('name',Object.keys(req)[1]); 
            select.setAttribute('id',Object.keys(req)[1]);
            if(req.className){
                select.setAttribute('class',req.className);
            }
            let options = req[Object.keys(req)[1]];
            options.forEach((v)=>{
                let option =document.createElement("option");
                option.setAttribute('id',v.id);
                option.setAttribute('value',v.value);
                option.innerHTML = v.desc;
                select.appendChild(option);
            });
            
            if(req.className && req.className == 'twoColumn'){
                var select_id = select.id.replace('_','');
                tbody.innerHTML = `<tr><td>${select.outerHTML}<a id="${select_id}">${req.subTarget}</a></td></tr>`;
                if(req.select_target){
                    tbody.getElementsByTagName('td')[0].addEventListener("change", function(){
                        let target = this.childNodes[0];
                        target = target.options[target.selectedIndex].innerHTML;
                        document.getElementById(select_id).innerHTML = `${target} 정보 확인`;
                    });
                }
                else if(req.select_type){
                    tbody.getElementsByTagName('td')[0].addEventListener("change", function(){
                        let target = this.childNodes[0];
                        if(target.selectedIndex == 0) { //OAuth인증
                            document.getElementById(select_id).setAttribute('class','');
                            document.getElementById('select_type').setAttribute('class','twoColumn');
                        }
                        else{ 
                            document.getElementById(select_id).setAttribute('class','hidden');
                            document.getElementById('select_type').setAttribute('class','');
                        } 
                    });
                }
            }
            else{
                tbody.innerHTML = `<tr><td>${select.outerHTML}</td></tr>`;
            }
        })
    }
  }