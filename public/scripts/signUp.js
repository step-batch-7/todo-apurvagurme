const checkForUniqUserName = function(){
  signUpForm.onsubmit = () => false;
  sendDataToServer('/userNameAvailability', {entered: userNameField.value}, confirmation => {
    if(JSON.parse(confirmation).isUniq){
      signUpForm.onsubmit = () => true;
      return;
    }
    warningBar.innerHTML = '<p> Entered Username is already taken</p>';
  });
};

const clearWarning = function(){
  warningBar.innerHTML = '';
};

const attachEventListeners = function() {
  userNameField.onblur = checkForUniqUserName;
  userNameField.oninput = clearWarning;
};

const main = function(){
  attachEventListeners();
};

window.onload = main;
