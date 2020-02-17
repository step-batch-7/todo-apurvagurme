const showWarning = function(){
  const warning = '<p>Incorrect Username or Password</p>';
  warningBar.innerHTML = warning;
};

const attemptLogin = function(){
  const userName = userNameField.value;
  const password = passwordField.value;
  if(userName && password) {
    sendDataToServer('/login', {userName, password}, (confirmation) => {
      if(JSON.parse(confirmation).isSuccessful){
        return location.assign('index.html');
      }
      showWarning();
    });
  }
};

const attachEventListeners = function() {
  submitBtn.onclick = attemptLogin;
};

const main = function(){
  attachEventListeners();
};

window.onload = main;
