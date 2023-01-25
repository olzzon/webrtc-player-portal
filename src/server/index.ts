const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require("path");
import * as IO from "../sharedcode/IO_CONSTANTS";
import { ISource } from "../sharedcode/interfaces";
import { sourcesWithNoLinks, getSources } from "./utils/getSources";
import { getSettings } from "./utils/storage";

let sources: ISource[] = getSettings();

app.use("/", express.static(path.resolve(__dirname, "../../dist/client")));
app.get("/", (req: any, res: any) => {
  console.log("Request :", req);
  res.sendFile(path.resolve(__dirname, "../../public/index.html"));
});

io.on("connection", (socket: any) => {
  console.log("User connected :", socket.id);

  const sendSources = () => {
    getSources(sources).then((sources) => {
      const clientSideSources = sourcesWithNoLinks(sources);
      console.log("Sending sources", clientSideSources);
      socket.emit(IO.ALL_PLAYERS, clientSideSources);
    });
  };
  const clientTimerSources = setInterval(() => sendSources(), 5000);

  socket
    .on(IO.GET_ALL_PLAYERS, () => {
      console.log("GET_ALL_PLAYERS");
      sendSources();
    })
    .on("disconnect", () => {
      console.log("User disconnected");
      clearInterval(clientTimerSources);
    });
});

server.listen(3000);
console.log("Server started on port 3000");
