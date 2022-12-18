const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require("path");
import axios from "axios";
import * as IO from "../sharedcode/IO_CONSTANTS";
import { IPlayer, IRESTresponse } from "../sharedcode/interfaces";

const players: IPlayer[] = [{url: "http://192.168.1.8:3900/linkurl", label: "Olzzon Basement", link: {viewer: "", guest: "", broadcast: "", director: ""}}];
//axios.get<Todo>(url).then((res) => {

app.use('/', express.static(path.resolve(__dirname, '../../dist/client')))

app.get('/', (req: any, res: any) => {
  console.log('Request :', req)
  res.sendFile(path.resolve(__dirname, '../../public/index.html'))
})

io.on("connection", (socket: any) => {
  console.log("User connected :", socket.id);

  socket.on(IO.GET_ALL_PLAYERS, () => {
    console.log("GET_ALL_PLAYERS");
    axios.get<IRESTresponse>(players[0].url).then((links) => {
        console.log(links.data);
        players[0].link = links.data;
        socket.emit(IO.ALL_PLAYERS, players);
    });

  });
});

server.listen(3000);
console.log("Server started on port 3000");
