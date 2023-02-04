const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require("path");
import * as IO from "../sharedcode/IO_CONSTANTS";
import { ISource } from "../sharedcode/interfaces";
import { filterSourcesForClient, getSourceLinks } from "./utils/getSourceLinks";
import { getSettings } from "./utils/storage";



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
  let clientUserGroup: string;

  let oldSourceLinks: ISource[] = [];
  const sendSourcesToClient = () => {
    if (JSON.stringify(oldSourceLinks) !== JSON.stringify(sourceLinks)) {
      const clientSideSources = filterSourcesForClient(sourceLinks, clientUserGroup);
      console.log("Sending sources");
      socket.emit(IO.SOURCE_LIST, clientSideSources);
      oldSourceLinks = sourceLinks;
    }
  };
  const thisClientTimer = setInterval(() => sendSourcesToClient(), 1000);

  socket
    .on(IO.GET_SOURCES, (userGroup: string) => {
      clientUserGroup = userGroup;
      console.log("GET_ALL_PLAYERS");
      sendSourcesToClient();
    })
    .on("disconnect", () => {
      console.log("User disconnected");
      clearInterval(thisClientTimer);
    });
});


app.use("/", express.static(path.resolve(__dirname, "../../dist/client")));
server.listen(3910);
console.log("Server started on port 3910");
