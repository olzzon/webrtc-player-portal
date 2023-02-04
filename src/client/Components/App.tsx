import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ISource } from "../../sharedcode/interfaces";
import * as IO from "../../sharedcode/IO_CONSTANTS";
import "../style/app.css";

const socketClient = io();
console.log("socketClient :", socketClient);

const urlParams = new URLSearchParams(window.location.search);
const userGroup = urlParams.get("group") || "default";

socketClient.emit(IO.GET_SOURCES, userGroup);

const WebRTCSourceButton = (
  source: ISource,
  index: number,
  changeSelectedSource: any
) => {
  return (
    <button
      className="button"
      onClick={() => {
        console.log("Button clicked : ", source.label);        
        changeSelectedSource(index);
      }}
    >
      {source.label}
    </button>
  );
};

const App = () => {
  const [sources, setSources] = useState<ISource[]>([]);
  const [isSelected, setIsSelected] = useState<number>(-1);

  useEffect(() => {
    socketClient.on(IO.SOURCE_LIST, (receivedSources: ISource[]) => {
      console.log(
        "Sources received :",
        receivedSources.map((source) => source.label)
      );
      setSources(receivedSources);
    });
  }, []);

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
          return WebRTCSourceButton(source, index, setIsSelected);
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
