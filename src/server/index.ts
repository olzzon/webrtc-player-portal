import express, { Express, Request, Response } from "express";
const app: Express = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require("path");
const fs = require("fs");

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
  let clientUserGroups: string[];

  let oldSourceLinks: ISource[] = [];
  const sendSourcesToClient = () => {
    if (JSON.stringify(oldSourceLinks) !== JSON.stringify(sourceLinks)) {
      const clientSideSources = filterSourcesForClient(
        sourceLinks,
        clientUserGroups
      );
      console.log("Sending sources");
      socket.emit(IO.SOURCE_LIST, clientSideSources);
      oldSourceLinks = sourceLinks;
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

app.get("/", (req: Request, res: Response) => {
  console.log("GET request", req.url);
  let changedHTML: string = fs.readFileSync(
    path.join(__dirname, "../../dist/client/index.html"),
    "utf8"
  );
  res.send(changedHTML);
});

app.use(express.static(path.join(__dirname, "../../dist/client")));
server.listen(3910, () => console.log("Server started on port 3910"));
