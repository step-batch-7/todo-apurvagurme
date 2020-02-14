const sendReq = function({method, url, headers}, content, callback){
  const xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if(this.status === 401) {
      location.assign('login.html');
      return;
    }
    if (this.status === 200) {
      callback && callback(this.responseText);
    }
  };
  xhr.open(method, url);
  Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value));
  xhr.send(content);
};

const getDataFromServer = function(url, callback) {
  sendReq({method: 'GET', url, headers: {}}, undefined, callback);
};

const sendDataToServer = function(url, data, callback){
  const headers = {'Content-Type': 'application/json'};
  sendReq({method: 'POST', url, headers}, JSON.stringify(data), callback);
};
