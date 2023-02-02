const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require("path");
import * as IO from "../sharedcode/IO_CONSTANTS";
import { ISource } from "../sharedcode/interfaces";
import { filterSourcesForClient, getSourceLinks } from "./utils/getSourceLinks";
import { getSettings } from "./utils/storage";

app.use("/", express.static(path.resolve(__dirname, "../../dist/client")));
app.get("/", (req: any, res: any) => {
  console.log("Request :", req);
  res.sendFile(path.resolve(__dirname, "../../public/index.html"));
});

let sourceList: ISource[] = [];
let sourceLinks: ISource[] = [];
const updateSourceListTimer = setInterval(() => {
  sourceList = getSettings();
}, 10000);

const updateSourceLinkstimer = setInterval(() => {
  getSourceLinks(sourceList).then((newSourceLinks) => {
    sourceLinks = newSourceLinks;
  });
}, 10000);

io.on("connection", (socket: any) => {
  console.log("User connected :", socket.id);

  let oldSourceLinks: ISource[] = [];
  const sendSourcesToClient = () => {
    if (JSON.stringify(oldSourceLinks) !== JSON.stringify(sourceLinks)) {
      // ToDo: Only send souces allowed for client
      const clientSideSources = filterSourcesForClient(sourceLinks, 'default');
      console.log("Sending sources", clientSideSources);
      socket.emit(IO.ALL_PLAYERS, clientSideSources);
      oldSourceLinks = sourceLinks;
    }
  };
  const thisClientTimer = setInterval(() => sendSourcesToClient(), 1000);

  socket
    .on(IO.GET_ALL_PLAYERS, () => {
      console.log("GET_ALL_PLAYERS");
      sendSourcesToClient();
    })
    .on("disconnect", () => {
      console.log("User disconnected");
      clearInterval(thisClientTimer);
    });
});

server.listen(3910);
console.log("Server started on port 3910");
