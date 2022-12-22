import axios from "axios";
import { ISource } from "../../sharedcode/interfaces";

export const getSources = async (sources: ISource[]): Promise<ISource[]> => {
  let sourcelist = await Promise.all(
    sources.map(async (source) => {
      try {
        const links = await axios.get(source.url);
        console.log("Data received from", source.label, " : ", links.data);
        source.link = links.data;
        return source;
      } catch (e) 
      {
        console.log('Error getting REST from WebRTC ', source.label, ' : ', e)
        return source;
      }
    })
  );
  sourcelist = sourcelist.filter((source) => source.link.viewer !== '');
  return sourcelist;
};

export const sourcesWithNoLinks = (sources: ISource[]): ISource[] => {
  let sourcelist = sources.map((source) => {
    source.link = { viewer: "", guest: "", broadcast: "", director: "" };
    return source;
  });
  return sourcelist;
}
