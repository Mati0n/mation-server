class Loader {
  constructor() {
    this.queue = [];
  }

  add (task) {
    this.queue.push(task);
  }

  async run () {
    for (const task of this.queue) {
      console.log(`Running task: ${task.name}`);
      await task.run();
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
}

module.exports = Loader;
