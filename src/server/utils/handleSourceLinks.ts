import { ISource, IRESTresponse } from "../../sharedcode/interfaces";

export const updateSettingsInSourceLinks = (
  sourceLinks: ISource[],
  settings: ISource[]
): ISource[] => {
  const updatedSources = settings.map((settingsElement) => {
    const updatedSource = sourceLinks.find((source) => source.id === settingsElement.id);
    if (updatedSource) {
      settingsElement.link = updatedSource.link;
      settingsElement.linkUpdateTime = updatedSource.linkUpdateTime;
    }
    return settingsElement;
  });
  return updatedSources;
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
    source.linkUpdateTime = Date.now();
    return source;
  });
  return updatedSources;
};

export const filterSourcesForClient = (
  sources: ISource[],
  userGroups: string[]
): ISource[] => {
  let sourcelist = sources.map((source: ISource) => {
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

export const checkIfSourceLinksAreOld = (sources: ISource[]): ISource[] => {
  const currentTime = Date.now();
  sources.forEach((source) => {
    if (source.linkUpdateTime) {
      const timeSinceLastUpdate = currentTime - source.linkUpdateTime;
      if (timeSinceLastUpdate > 30000) {
        source.link = {
          viewer: "",
          guest: "",
          broadcast: "",
          director: "",
          lores: "",
        };
      }
    }
  });
  return sources;
}

