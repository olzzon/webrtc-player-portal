import express, { Express } from "express";
const app: Express = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require("path");
const fs = require("fs");

import * as IO from "../sharedcode/IO_CONSTANTS";
import { ISource } from "../sharedcode/interfaces";
import {
  checkIfSourceLinksAreOld,
  filterSourcesForClient,
  updateRecievedSourceLink,
  updateSettingsInSourceLinks
} from "./utils/handleSourceLinks";
import { getSettings } from "./utils/storage";

let oldSettings: ISource[] = [];
let sourceLinks: ISource[] = [];
const updateSourceListTimer = setInterval(() => {
  const settings = getSettings();
  if (JSON.stringify(settings) !== JSON.stringify(oldSettings)) {    
    oldSettings = settings;
    sourceLinks = updateSettingsInSourceLinks(sourceLinks, settings);
  }
  sourceLinks = checkIfSourceLinksAreOld(sourceLinks);
}, 10000);

io.on("connection", (socket: any) => {
  console.log("User connected :", socket.id);
  let clientUserGroups: string[];
  let clientsOldSourceLinks: ISource[] = [];

  const sendSourcesToClient = () => {
    if (JSON.stringify(clientsOldSourceLinks) !== JSON.stringify(sourceLinks)) {
      const clientSideSources = filterSourcesForClient(
        sourceLinks,
        clientUserGroups
      );
      console.log("Sending sources");
      socket.emit(IO.SOURCE_LIST, clientSideSources);
      clientsOldSourceLinks = JSON.parse(JSON.stringify(sourceLinks));
    }
  };
  const thisClientTimer = setInterval(() => sendSourcesToClient(), 1000);

  socket
    .on(IO.GET_SOURCES, (userGroups: string[]) => {
      clientUserGroups = userGroups;
      console.log("GET_ALL_PLAYERS");
      sendSourcesToClient();
    })
    .on("disconnect", () => {
      console.log("User disconnected");
      clearInterval(thisClientTimer);
    });
});

app.use("/", express.static(path.resolve(__dirname, "../../dist/client")));
app.use("/updatelink", express.json());

app.post("/updatelink", (req, res) => {
  sourceLinks = updateRecievedSourceLink(
    sourceLinks,
    req.body?.id,
    req.body?.link
  );
  console.log("Received Request : ", req.body);
  res.send("ok");
});

server.listen(3910, () => console.log("Server started on port 3910"));
