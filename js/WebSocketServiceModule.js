
const WebSocketClient = class {
    constructor() {
        this.webSocketObject = {
            webSocket: undefined,
            webSocketServeUrl: 'ws://127.0.0.1:4000/',
        };
        this.paramArray = [];
        this.paramArrayIndex = 0;
        this.paramArrayLength = 0;
        this.paramObject = {};
        this.timerId = undefined;
        this.callBackSuccess = undefined;
        this.callBackFailure = undefined;
        this.timerStop = false;
        this.savePassword = true;
        this.forceCancle = false;
    }
};
export const WebSocketServiceModule = {
    WebSocketMessageModule : {
        WebSocketConnection : function (params, password, savePassword, callbackSuccess, callBackFailure) {
            if (params != undefined) {
        
                const Request = new WebSocketClient();
                if (Array.isArray(params)) {
                    Request.paramArray = params;
                    Request.paramArrayIndex = 0;
                    Request.paramArrayLength = Request.paramArray.length;
                    Request.paramObject = {};
                }
                else {
                    if (typeof (params) == 'object') {
                        Request.paramObject = params;
                        Request.paramArray = [];
                        Request.paramArrayIndex = 0;
                    }
                }
                Request.savePassword = savePassword;
                const urlString = Request.webSocketObject.webSocketServeUrl;
        
                Request.timerId = setInterval(() => {
                    if(Request.forceCancle){
                        clearInterval(Request.timerId);
                    }
                    else{
                        if (Request.paramArrayIndex < Request.paramArrayLength) {
                            if (!Request.timerStop) {
                                Request.paramObject = Request.paramArray[Request.paramArrayIndex];
                                if (Request.paramObject) Request.paramObject.password = password;
                                Request.paramArrayIndex += 1;
                                Request.timerStop = true;
            
                                const temp = Request.paramObject;
                                const sendParamObj = {};
                                const exceptKeys = ['password'];
                                for (const [key, value] of Object.entries(temp)) {
                                    if (!exceptKeys.includes(key)) {
                                        sendParamObj[key] = value;
                                    }
                                }
                                console.log(`서비스 시작 [No. ${Request.paramArrayIndex} : ${JSON.stringify(sendParamObj)}]`);
                                OpenWebSocket(Request, Request.paramObject);
                            }
                        }
                        else {
                            clearInterval(Request.timerId);
                        };
                    }
                }, 1000);
        
                const OpenWebSocket = function (Request, param) {
                    if(!param.hasOwnProperty('password')) return;
                    const password = param.password;
                    const _RequestUrl = `http://localhost:5000/${globalVariable.moduleName}/Service.do`;
                    if(!Request.hasOwnProperty('paramObject')) return;
                    const _RequestInfo = Request.paramObject;
                    if(!Request.hasOwnProperty('savePassword')) return;
                    const _savePassword = Request.savePassword;
                    if(!Request.hasOwnProperty('paramArrayIndex')) return;
                    const _paramArrayIndex = Request.paramArrayIndex;
                    if(!Request.hasOwnProperty('paramArrayLength')) return;
                    const _paramArrayLength = Request.paramArrayLength;
                    if((Request.webSocketObject.webSocket == undefined || Request.webSocketObject.webSocket == null)){
                        let ws = new WebSocket(urlString);
                        ws.onerror = function (event) {
                            callBackFailure(`${globalVariable.moduleName}이 설치되어 있지 않습니다.`);
                        };
                        ws.onopen = function () {
                            ws.onmessage = function (event) {
                                var msg = event.data;
                                if (msg.startsWith('{')) {
                                    msg = JSON.parse(msg);
                                    if (typeof (msg) == 'object' && msg.hasOwnProperty('Authorization')) {
                                        msg.password = password;
                                        msg = JSON.stringify(msg);
                                        ws.send(msg);
                                        callbackSuccess(event.data);
                                    }
                                    else {
                                        if(msg.type == 'message' && msg.message){
                                            callbackSuccess(msg.message);
                                        }
                                        else{
                                            console.log(msg);
                                        }
                                    }
                                }
                                else {
                                    if (msg == '유효한 JWT 토큰입니다.') {
                
                                        var request = { 
                                            RequestUrl : _RequestUrl, 
                                            RequestInfo : _RequestInfo, 
                                            savePassword : _savePassword,
                                            paramArrayIndex : _paramArrayIndex,
                                            paramArrayLength : _paramArrayLength
                                        };
                                        try{
                                            var FetchModule = WebSocketServiceModule.WebSocketRequestModule;
                                            FetchModule.timeout(3000,FetchModule.FetchApi(request))
                                            .then((result)=>{
                                                let message = '';
                                                if(result.data && typeof(result.data == 'string')) message = result.data;
                                                if(result.data.result && typeof(result.data.result == 'string')) message = result.data.result;
                                                callbackSuccess(message);
                                            }).catch((e)=>{
                                                callBackFailure(e.message);
                                            });
                                        }
                                        catch(e){
                                            callBackFailure({type:"error",message:e.message});
                                        }
                                    }
                                    else if (msg == 'timerReStart.') {
                                        Request.timerStop = false;
                                        ws.close();
                                    }
                                    else {
                                        if(event.data) callbackSuccess(event.data);
                                    }
                                };
                            };
                            ws.onclose = function (event) {
                                if(Request.paramArrayIndex != Request.paramArrayLength){
                                    console.log('웹소켓 연결 종료.');
                                } 
                            };
                        };
                    }
                };
            }
        },
    },
    WebSocketRequestModule : {
        timeout : function(ms, promise) {
            return new Promise(function(resolve, reject) {
              setTimeout(function() {
                reject("timeout");
              }, ms)
              promise.then(resolve, reject)
            })
        },
        FetchApi : function(request){
            return new Promise((resolve,reject)=>{
                fetch(request.RequestUrl, {
                    method: "POST", // *GET, POST, PUT, DELETE 등
                    mode: "cors", // no-cors, *cors, same-origin
                    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: "same-origin", // include, *same-origin, omit
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    redirect: "follow", // manual, *follow, error
                    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                    body: new URLSearchParams(request.RequestInfo), // body의 데이터 유형은 반드시 "Content-Type" 헤더와 일치해야 함
                }).then((response)=>{
                    if(response.ok){
                        response.json().then((data)=>{
                            if (data != undefined && data.hasOwnProperty('Set-Cookie')) {
                                var cookie = data['Set-Cookie'];
                                if (request.savePassword && document.cookie == '') document.cookie = cookie;
                                delete data['Set-Cookie'];
                            }
                            const result = {};
                            result.data = data;
                            if(request.paramArrayIndex == request.paramArrayLength) console.log("서비스 종료.");
                            resolve(result);
                        });
                    }
                    else{
                        throw new Error(`${response.status}`);
                    }
                }).catch((e)=>{
                    reject(e);
                });  
            });
        }
    }
}