import React, { useState } from "react";
import { io } from "socket.io-client";
import { IPlayer } from "../../sharedcode/interfaces";
import * as IO from "../../sharedcode/IO_CONSTANTS";
import WebRTCSource from "./WebRTCSource";

const socketClient = io();
console.log("socketClient :", socketClient);

socketClient.emit(IO.GET_ALL_PLAYERS);

const App = () => {
  const [players, setPlayers] = useState<IPlayer[]>([]);

  socketClient.on(IO.ALL_PLAYERS, (receivedPlayers: IPlayer[]) => {
    setPlayers(receivedPlayers);
    console.log(
      "Players received :",
      receivedPlayers.map((player) => player.label)
    );
  });

  return (
    <div>
      <h1>WebRTC Portal</h1>
      <div>
        {players.map((player: IPlayer) => {
          return <WebRTCSource {...player} />;
        })}{" "}
      </div>
    </div>
  );
};

export default App;
