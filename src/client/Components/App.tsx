import React, { useState } from "react";
import { io } from "socket.io-client";
import { ISource } from "../../sharedcode/interfaces";
import * as IO from "../../sharedcode/IO_CONSTANTS";
import "../style/app.css";

const socketClient = io();
console.log("socketClient :", socketClient);

socketClient.emit(IO.GET_ALL_PLAYERS);

const App = () => {
  const [sources, setSources] = useState<ISource[]>([]);
  const [isSelected, setIsSelected] = useState<number>(-1);

  socketClient.on(IO.ALL_PLAYERS, (receivedSources: ISource[]) => {
    console.log(
      "Sources received :",
      receivedSources.map((source) => source.label)
    );
    setSources(receivedSources);
  });

  const WebRTCSourceButton = (source: ISource, index: number) => {
    return (
      <button
        className="button"
        onClick={() => {
          setIsSelected(index);
        }}
      >
        {source.label}
      </button>
    );
  };

  return (
    <div className="app">
      <div className="buttons">
        <button
          className="button"
          onClick={() => {
            setIsSelected(-1);
          }}
        >
          OFF
        </button>
        {sources.map((source: ISource, index: number) => {
          return WebRTCSourceButton(source, index);
        })}{" "}
      </div>
      {isSelected > -1 ? (
        <iframe
          className="video"
          src={sources[isSelected].link.viewer}
          title={sources[isSelected].label}
          allow="autoplay"
          allowFullScreen={true}
        />
      ) : null}
    </div>
  );
};

export default App;
