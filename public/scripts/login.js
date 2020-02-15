const showWarning = function(){
  const warning = '<p>Entered Username or Password does not match</p>';
  warningBar.innerHTML = warning;
};

const attemptLogin = function(){
  const userName = userNameField.value;
  const password = passwordField.value;
  sendDataToServer('/login', {userName, password}, (confirmation) => {
    if(JSON.parse(confirmation).isSuccessful){
      return location.assign('index.html');
    }
    showWarning();
  });
};

const attachEventListeners = function() {
  submitBtn.onclick = attemptLogin;
};

const main = function(){
  attachEventListeners();
};

window.onload = main;
