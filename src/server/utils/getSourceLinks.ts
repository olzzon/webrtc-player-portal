import axios from "axios";
import { ISource, IRESTresponse } from "../../sharedcode/interfaces";

export const getSourceLinks = async (
  sourceList: ISource[]
): Promise<ISource[]> => {
  let sourceLinks = await Promise.all(
    sourceList.map(async (source) => {
      try {
        if (source.url !== "") {
          const links = await axios.get(source.url);
          source.link = links.data;
          source.link.lores ? null : (source.link.lores = source.link.viewer);
        } 
        return source;
      } catch (e) {
        console.log(
          "Error getting REST from WebRTC ",
          source.label,
          " From IP : ",
          source.url
        );
        return source;
      }
    })
  );
  console.log("Data received from sources");
  return sourceLinks;
};

export const updateRecievedSourceLink = (
  sources: ISource[],
  id: string,
  recievedSourceLinks: IRESTresponse
): ISource[] => {
  const updatedSources = sources.map((source) => {
    if (id && source.id === id) {
      source.link = recievedSourceLinks;
    }
    return source;
  });
  return updatedSources;
};

export const filterSourcesForClient = (
  sources: ISource[],
  userGroups: string[]
): ISource[] => {
  let sourcelist = sources.map((source: ISource) => {
    source.url = "";
    source.link = {
      viewer: source.link.viewer,
      guest: "",
      broadcast: "",
      director: "",
      lores: source.link.lores,
    };
    return source;
  });
  sourcelist = sourcelist.filter((source: ISource) => {
    return !source.userGroup || userGroups?.includes(source.userGroup);
  });
  return sourcelist;
};
