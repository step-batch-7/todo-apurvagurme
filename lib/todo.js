class Todo {
  constructor(name, comment, time) {
    this.name = name;
    this.comment = comment;
    this.time = time;
  }

  toHTML() {
    return `<div class='task'>
    </div>`;
  }
}

module.exports = Todo;
