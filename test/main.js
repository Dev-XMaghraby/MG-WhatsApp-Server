var MessageWorker = /** @class */ (function () {
    
    function MessageWorker(name) {
        this.name = name;
    }
    MessageWorker.prototype.update = function (message) {
        console.log(message.text, this.name);
    };
    return MessageWorker;
}());
var SocketManager = /** @class */ (function () {
    function SocketManager() {
        this.observers = [];
    }
    SocketManager.prototype.regObserver = function (observer) {
        this.observers.push(observer);
    };
    SocketManager.prototype.removeObserver = function (observer) {
        var index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    };
    SocketManager.prototype.notify = function (data) {
        for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
            var observer = _a[_i];
            observer.update(data);
        }
    };
    return SocketManager;
}());
var manager = new SocketManager();
var worker1 = new MessageWorker("worker1");
var worker2 = new MessageWorker("worker2");
manager.regObserver(worker1);
manager.regObserver(worker2);
manager.notify({ type: "text", text: "Fuck", jid: "99898900" });
