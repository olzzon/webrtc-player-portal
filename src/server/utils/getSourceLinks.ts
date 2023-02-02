import axios from "axios";
import { ISource } from "../../sharedcode/interfaces";

export const getSourceLinks = async (
  sourceList: ISource[]
): Promise<ISource[]> => {
  let sourceLinks = await Promise.all(
    sourceList.map(async (source) => {
      try {
        const links = await axios.get(source.url);
        console.log("Data received from", source.label, " : ", links.data);
        source.link = links.data;
        return source;
      } catch (e) {
        console.log("Error getting REST from WebRTC ", source.label, " : ", e);
        return source;
      }
    })
  );
  sourceLinks = sourceLinks.filter((source) => source.link.viewer !== "");
  return sourceLinks;
};

export const filterSourcesForClient = (
  sources: ISource[],
  userGroup: string
): ISource[] => {
  let sourcelist = sources.map((source) => {
    source.link = { viewer: "", guest: "", broadcast: "", director: "" };
    return source;
  });
  sourcelist = sourcelist.filter((source) => {
    return !source.usergroup || source.usergroup === userGroup
  });
  return sourcelist;
};
