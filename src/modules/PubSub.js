class PubSub {
    constructor() {
        this.events = {};
    }

    subscribe(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    unsubscribe(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter((fn) => fn !== callback);
    }

    publish(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach((callback) => callback(data));
    }
}

const mainPubSub = new PubSub();
export default mainPubSub;
