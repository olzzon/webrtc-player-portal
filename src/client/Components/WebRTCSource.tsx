import React, { useState } from "react";
import { IPlayer } from "../../sharedcode/interfaces";

const WebRTCSource = (source: IPlayer) => {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <div>
      <button
        onClick={() => {
          setIsSelected(true);
          console.log("CLICKED", source.label);
        }}
      >
        {source.label}
      </button>
      {isSelected ? <meta httpEquiv="refresh" content={"0; url =" + source.link.viewer} /> : null}
    </div>
  );
};

export default WebRTCSource;
