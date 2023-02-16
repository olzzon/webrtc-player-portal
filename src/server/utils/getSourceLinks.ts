import axios from "axios";
import { ISource } from "../../sharedcode/interfaces";

export const getSourceLinks = async (
  sourceList: ISource[]
): Promise<ISource[]> => {
  let sourceLinks = await Promise.all(
    sourceList.map(async (source) => {
      try {
        const links = await axios.get(source.url);
        source.link = links.data;
        return source;
      } catch (e) {
        console.log("Error getting REST from WebRTC ", source.label, " : ", e);
        return source;
      }
    })
  );
  sourceLinks = sourceLinks.filter((source) => source.link.viewer !== "");
  console.log("Data received from sources");
  return sourceLinks;
};

export const filterSourcesForClient = (
  sources: ISource[],
  userGroups: string[]
): ISource[] => {
  let sourcelist = sources.map((source: ISource) => {
    source.url = "";
    source.link = { viewer: source.link.viewer, guest: "", broadcast: "", director: "" };
    return source;
  });
  sourcelist = sourcelist.filter((source: ISource) => {
    return !source.userGroup || userGroups?.includes(source.userGroup)
  });
  return sourcelist;
};
