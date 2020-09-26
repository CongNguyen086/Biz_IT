import Server from "socket.io";

export class SocketServer {
    constructor(server) {
        this.io = Server(server, { pingInterval: 20000 });
    }

    init() {
        this.handler(this.io);
    }

    handler(io) {
        io.on("connection", socket => {
            console.log("Socket connected");
            socket.on("chat message", msg => {
                console.log(msg);
                io.emit("chat message", msg);
            });
        });
    }
}