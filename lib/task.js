class Task{
  constructor(name, id){
    this.name = name;
    this.id = id;
    this.status = false;
  }

  rename(newName){
    this.name = newName;
  }

  toggleStatus(){
    this.status = !this.status;
  }

  isSameId(id){
    return this.id === id;
  }

  static load({name, id, status}){
    const task = new Task(name, id);
    task.status = status;
    return task;
  }
}

module.exports = Task;
