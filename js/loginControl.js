var defaultTimerCount = 120;
const savedCurrentUserName = window.localStorage.getItem('currentUserName');
let loginUserInfo;
if(savedCurrentUserName) {
  loginUserInfo = JSON.parse(savedCurrentUserName);
  if((typeof loginUserInfo === 'object') && loginUserInfo.hasOwnProperty('loginUserName')){
    document.getElementById("currentUserName").value = loginUserInfo.loginUserName;
  }
}
var currentUserName = document.getElementById("currentUserName").value;

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

if(currentUserName == globalVariable.moduleName || currentUserName == ''){
  document.getElementById("modalContainer").className = "";
}
else {
  document.getElementById("modalContainer").style.display = "none";
  document.getElementById("loginUserName").value = loginUserInfo.loginUserName;
  document.getElementById("loginPassword").value = loginUserInfo.loginPassword;
}

function SendEmailFunction(obj){
  var req = new Object();
  if(document.getElementById("modalUserName").value == '' || document.getElementById("modalEmail").value == ''){
    let emptyValue = "";
    emptyValue = document.getElementById("modalUserName").value;
    if(emptyValue != ''){
      emptyValue = document.getElementById("modalEmail").value;
      if(emptyValue == '') emptyValue = `이메일이 입력되지 않았습니다.`;
    }
    else {
      emptyValue = `아이디가 입력되지 않았습니다.`;
    } 
    OpenAlert(emptyValue);
    return;
  }
  else{
    req.result = 'SUCCESS'
    req.target = obj;
    req.emailAddress = document.getElementById("modalEmail").value;
    if(obj.name == "sendEmail"){
        SendEmailCode(req,SendEmailSuccess,SendEmailFail);
    }else{
      var getModalUserName = document.getElementById("modalUserName").value;
      document.getElementById("loginUserName").value = getModalUserName;
      if(globalVariable.initAuthCode){
        document.getElementById("getAuthCode").value = globalVariable.initAuthCode;
      }
      var getAuthCode = document.getElementById("getAuthCode").value;
      var modalAuthCode = document.getElementById("modalAuthCode").value;
      if(getAuthCode == modalAuthCode){
        returnAuthCheckSuccess();
        closeTarget = document.getElementById("modalContainer");
        timeInt = 0;
        authCheckFinsh = true;
        document.getElementById("modalEmail").classList.remove("countDown");
        OpenAlert('인증번호가 확인되었습니다.',closeTarget);
      }
      else {
        OpenAlert('인증번호가 일치하지 않습니다.');
      }
    }
  }
}
  
function SendEmailCode(req,success,fail){
  if(req.result == 'SUCCESS') {
    if(validateEmail(req.emailAddress)){
      success(req.target);
    }
    else {
      let message = '이메일 주소 형식이 올바르지 않습니다.';
      fail(message);
    }
  }
  else fail();
};
function SendEmailSuccess(target){
  document.getElementById("modalEmail").style.width = "60%";
  document.getElementById("modalAuthCode").removeAttribute("hidden");
  document.getElementById("modalEmail").classList.add("countDown");
  document.getElementById("modalAuthCode").focus();
  target.value = "인증번호 확인";
  target.name = "registUserInfo";
  returnAuthResult();
  OpenAlert('인증번호가 발송되었습니다.');
  countDown;
  var countDown = setInterval(() => {
    if(!authCheckFinsh){
      if(timeInt == 0) {
        OpenAlert('인증번호 입력 시간이 경과하였습니다.');
        authCheckFinsh = false;
        timeInt = defaultTimerCount;
        target.name = "sendEmail"
        document.getElementById("modalEmail").classList.remove("countDown");
        document.getElementById("modalEmail").value = "";
        document.getElementById('sendAutnNumber').value = "인증번호 발송";
        clearInterval(countDown);
      }
      else{
        var min = Math.floor(timeInt/60);
        var sec = timeInt - (60 * min);
        var remain = '';
        if(min > 0) remain = min + '분 ' + sec + '초'; 
        else remain = sec + '초'; 
        document.getElementById("modalEmail").value = remain + ' 남음.';
        timeInt -=1;
      }
    }
  }, 1000);
}
var timeInt = defaultTimerCount
var authCheckFinsh = false;


function SendEmailFail(obj){
  if(obj){
    OpenAlert(obj);
  }
  else{
    alert('실패');
  }
}
function ResetPasswordFunction(obj){
  var req = new Object();
  req.result = 'SUCCESS'
  req.target = obj;
  SendNewPassword(req,SendNewPasswordSuccess,SendNewPasswordFail);
}
function SendNewPassword(req,success,fail){
  if(req.result == 'SUCCESS'){
    success();
  } 
  else fail();
};
function SendNewPasswordSuccess(){
  let message = '신규 비밀번호가 발송되었습니다.';
  CreateOpenModal(message);
}
function SendNewPasswordFail(){
  alert('실패');
}

function SaveUserInfo(){
  let loginUserName = document.getElementById("loginUserName").value;
  let message = `환영합니다.\r${loginUserName} 님.`;
  const saveLoginUserName = document.getElementById("loginUserName").value;
  const saveLoginPassword = document.getElementById("loginPassword").value;
  const loginUserInfo = {
    request : 'closeApp', 
    loginUserName : saveLoginUserName,
    loginPassword : saveLoginPassword
  };
  CreateOpenModal(message,loginUserInfo,returnFinish);
}
const CreateOpenModal = function(message,sendObj,hasNext){
  document.body.innerHTML = '<div id="alertContainer" name="alertContainer" class="hidden"><div class="alert-content" id="alertModal"><div class="modal-body"><p id="alertMessage"></p></div></div></div>' + document.body.innerHTML;
  let alertModal = document.getElementById("alertModal");
  let alertContainer = document.getElementById('alertContainer');
  if(alertContainer != null){
    alertContainer.setAttribute("class","");
  }
  var alertMessage = document.getElementById("alertMessage");
  alertMessage.textContent = message;
  alertModal.style.display = "block";
  if(hasNext){
    setTimeout(() => {
      alertContainer.setAttribute("class","hidden");
      document.getElementById('alertContainer').remove();
      if(sendObj){
        hasNext(sendObj);
      }
      else {
        hasNext();
      }
    }, 3000);
  }
  else{
    setTimeout(() => {
      alertContainer.setAttribute("class","hidden");
      document.getElementById('alertContainer').remove();
    }, 3000);
  }
}