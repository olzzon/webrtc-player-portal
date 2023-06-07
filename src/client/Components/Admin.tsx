import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ISourceClients } from "../../sharedcode/interfaces";
import * as IO from "../../sharedcode/IO_CONSTANTS";
import "../style/app.css";

const socketClient = io();
console.log("socketClient :", socketClient);

const hostUrl = new URL(window.location.href).origin;
const USERINFO_URL = hostUrl + "/oauth2/userinfo";

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
      const userGroups = ["default"];
      socketClient.emit(IO.GET_SOURCES, userGroups);
    });
});

const Admin = () => {
  const [sources, setSources] = useState<ISourceClients[]>([]);
  const [isSelected, setIsSelected] = useState<number>(-1);

  useEffect(() => {
    socketClient.on(IO.SOURCE_LIST, (receivedSources: ISourceClients[]) => {
      setSources([...receivedSources]);
    });
  });

  return (
    <div className="app" style={{backgroundColor:"#112811"}}>
        <div>
          <h1>Viewer Links: Select source and copy+paste  - Links are renewed each night at 4.00 am</h1>
        </div>
      <div className="buttons">
        <button
          className="button-off"
          onClick={() => {
            setIsSelected(-1);
          }}
        >
          HIDE
        </button>
        {sources.map((source: ISourceClients, index: number) => {
          return (
            <button
              key={source.id}
              style={source.viewer ? { color: "white" } : { color: "#111111" }}
              className={index !== isSelected ? "button" : "button-selected"}
              onClick={() => {
                console.log("Button clicked : ", source.label);
                setIsSelected(index);
              }}
            >
              {source.label}
            </button>
          );
        })}{" "}
      </div>
      {isSelected > -1 ? (
        <div className="link-view">
          <div>Viewer link:</div>
          <div>{sources[isSelected].viewer}</div>
          <button className="link-copy-button"
          onClick={() => {navigator.clipboard.writeText(sources[isSelected].viewer)}}>
            COPY TO CLIPBOARD
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Admin;
