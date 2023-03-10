import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ISource } from "../../sharedcode/interfaces";
import * as IO from "../../sharedcode/IO_CONSTANTS";
import "../style/app.css";

const socketClient = io();
console.log("socketClient :", socketClient);

const hostUrl = new URL(window.location.href).origin;
const USERINFO_URL = hostUrl + "/oauth2/userinfo";
const LOGOUT_URL = hostUrl + "/logout";

socketClient.on("connect", () => {
  fetch(USERINFO_URL)
    .then((res) => res.json())
    .then((res) => {
      console.log("userinfo group response :", res.groups);
      const userGroups = res.groups || [];
      socketClient.emit(IO.GET_SOURCES, userGroups);
    })
    .catch((err) => {
      console.log("No authorization groups recevied :", err);
    });
});

const App = () => {
  const [sources, setSources] = useState<ISource[]>([]);
  const [isSelected, setIsSelected] = useState<number>(-1);
  const [isLoRes, setIsLoRes] = useState<boolean>(false);

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
        <p className="button-logout">
          <a className="button-logout-href" href={LOGOUT_URL}>
            LOG OUT
          </a>
        </p>
        <button
          className={isLoRes ? "button-lo-res-on" : "button-lo-res-off"}
          onClick={() => {
            setIsLoRes(!isLoRes);
          }}
        >
          LO RES
        </button>
        <button
          className="button-off"
          onClick={() => {
            setIsSelected(-1);
          }}
        >
          OFF
        </button>
        {sources.map((source: ISource, index: number) => {
          return <button
            className={index !== isSelected ? "button" : "button-selected"}
            onClick={() => {
              console.log("Button clicked : ", source.label);
              setIsSelected(index);
            }}
          >
            {source.label}
          </button>;
        })}{" "}
      </div>
      {isSelected > -1 ? (
        <iframe
          className="video"
          src={
            isLoRes
              ? sources[isSelected].link.lores
              : sources[isSelected].link.viewer
          }
          title={sources[isSelected].label}
          allow="autoplay"
          allowFullScreen={true}
        />
      ) : null}
    </div>
  );
};

export default App;
