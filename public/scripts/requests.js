const sendReq = function(method, url, content, callback){
  const xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if (this.status === 200) {
      callback(this.responseText);
    }
  };
  xhr.open(method, url);
  xhr.send(content);
};

const sendGetReq = function(url, callback) {
  sendReq('GET', url, undefined, callback);
};

const sendPostReq = sendReq.bind(null, 'POST');

const sendDataToServer = function(url, data, callback){
  sendPostReq(url, JSON.stringify(data), callback);
};
