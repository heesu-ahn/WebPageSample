  function returnAuthCheckSuccess(){
    var modalAuthCode = document.getElementById("modalAuthCode").value;
    var callBackResult = new Object();
    callBackResult.request = 'returnAuthCheck'; 
    callBackResult.modalAuthCode = modalAuthCode;
    console.log(JSON.stringify(callBackResult));
  }
  function returnAuthResult(){
    var callBackResult = new Object();
    callBackResult.request = 'requestAuthNumber'; 
    var eamilAddress = document.getElementById("modalEmail").value;
    callBackResult.eamilAddress =eamilAddress;
    document.getElementById("modalEmail").value = "";
    console.log(JSON.stringify(callBackResult));
  }  
  function returnResetResult(){
    var callBackResult = new Object();
    callBackResult.request = 'requestResetPassword'; 
    console.log(JSON.stringify(callBackResult));
  }
  function returnFinish(loginUserInfo){
    if(loginUserInfo){
      if(window.localStorage.getItem('currentUserName')) window.localStorage.removeItem("currentUserName");
      window.localStorage.setItem('currentUserName', JSON.stringify(loginUserInfo));
      console.log(window.localStorage.getItem('currentUserName'));
    }
    document.body.innerHTML = '';
    variableObject.set('request');
  }

  var modal = document.getElementById("alertModal");
  function OpenAlert(msg,target){
    let alertContainer = document.getElementById('alertContainer');
    if(alertContainer != null){
      alertContainer.setAttribute("class","");
    }
    var alertMessage = document.getElementById("alertMessage");
    alertMessage.textContent = msg;
    modal.style.display = "block";
    setTimeout(() => {
      if(alertContainer != null){
        alertContainer.setAttribute("class","hidden");
      }
      else {
        CloseAlert(closetarget(target)); 
      }
    }, 3000);
  }
  function CloseAlert(callback){modal.style.display = "none";}
  function closetarget(target){if(target !== undefined) target.className = "hidden";}