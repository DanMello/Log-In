let events = {
  events: {},
  on: function (eventName, fn) {
    
    this.events[eventName] = this.events[eventName] || []
    this.events[eventName].push(fn)

    // console.log("pubsub", events)
  },
  off: function (eventName, fn) {

  },
  emit: function (eventName, data) {

    if (this.events[eventName]) {

      this.events[eventName].forEach(fn => {
        fn(data)
      })
    }
  }
}