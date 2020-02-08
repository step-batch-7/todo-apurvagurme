const sendGetReq = function(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if (this.status === 200) {
      callback(this.responseText);
    }
  };
  xhr.open('GET', url);
  xhr.send();
};

const sendPostReq = function(url, content, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if (this.status === 200) {
      callback(this.responseText);
    }
  };
  xhr.open('POST', url, false);
  xhr.send(content);
};
