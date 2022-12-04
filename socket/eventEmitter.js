class EventEmitter {
  constructor() {
    this.events = {};
  }

  subscribe(type, userId, fn) {
    if (!this.events[type]) {
      this.events[type] = {};
    }

    this.events[type][userId] = fn;

    return () => {
      delete this.events[type][userId];
    };
  }

  emit(type, userId, ...args) {
    const event = this.events[type]?.[userId];
    if (event) {
      event(...args);
    }
  }
}

module.exports = EventEmitter;
