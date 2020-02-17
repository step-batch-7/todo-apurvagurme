let isUniqUserName;

const checkForUniqUserName = function(){
  isUniqUserName = false;
  sendDataToServer('/userNameAvailability', {entered: userNameField.value}, confirmation => {
    if(confirmation.isUniq){
      isUniqUserName = true;
      return;
    }
    warningBar.innerHTML = '<p> Entered Username is already taken</p>';
  });
};

const clearUserNameWarning = function(){
  warningBar.innerHTML = '';
};

const doPasswordsMatch = function(){
  const arePasswordsEqual = reTypePassword.value === passwordField.value;
  !arePasswordsEqual && (warningBar2.innerHTML = '<p> Entered Passwords do not match</p>');
  console.log(arePasswordsEqual);
  return arePasswordsEqual;
};

const clearPasswordWarning = function(){
  warningBar2.innerHTML = '';
};

const isValidSubmission = function(){
  return isUniqUserName && doPasswordsMatch();
};

const attachEventListeners = function() {
  userNameField.onblur = checkForUniqUserName;
  userNameField.oninput = clearUserNameWarning;
  signUpForm.onsubmit = isValidSubmission;
  reTypePassword.oninput = clearPasswordWarning;
  passwordField.oninput = clearPasswordWarning;
};

const main = function(){
  attachEventListeners();
};

window.onload = main;
