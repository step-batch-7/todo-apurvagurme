const getUniqSId = function(){
  return `${new Date().getTime()}`;
};

class SessionManager{
  constructor(){
    this.sessions = {};
  }
  
  addSession(userName){
    const id = getUniqSId();
    this.sessions[id] = {userName};
    return id;
  }

  isValidSId(id){
    return Object.keys(this.sessions).includes(id);
  }

  getSessionAttribute(id, attributeName){
    return this.isValidSId(id) && this.sessions[id][attributeName];
  }

  clearSession(id){
    delete this[id];
  }
}

module.exports = new SessionManager();
