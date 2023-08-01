import {
  ISource,
  IRESTresponse,
  ISourceClients,
} from "../../sharedcode/interfaces";

export const updateSettingsInSourceLinks = (
  sourceLinks: ISource[],
  settings: ISource[]
): ISource[] => {
  const updateSources = settings.map((settingsElement) => {
    const updateSource = sourceLinks.find(
      (source) => source.id === settingsElement.id
    );
    if (updateSource && !updateSource.staticUrl) {
      settingsElement.link = updateSource.link;
      settingsElement.linkUpdateTime = updateSource.linkUpdateTime;
    } else if (updateSource && updateSource.staticUrl) {
      settingsElement.link = {
        viewer: updateSource.staticUrl,
        guest: updateSource.staticUrl,
        broadcast: updateSource.staticUrl,
        director: updateSource.staticUrl,
        lores: updateSource.staticUrl,
      };
      settingsElement.linkUpdateTime = updateSource.linkUpdateTime;
    } 
    return settingsElement;
  });
  return updateSources;
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
): ISourceClients[] => {
  const filteredSources = sources.filter((source: ISource) => {
    return !source.userGroup || userGroups?.includes(source.userGroup);
  });
  let sourceClientList: ISourceClients[] = filteredSources.map(
    (source: ISource) => {
      return {
        id: source.id,
        label: source.label,
        viewer: source.link?.viewer || "",
        lores: source.link?.lores || "",
      };
    }
  );

  return sourceClientList;
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
};

export const hasSourceLinksChanged = (
  sources: ISource[],
  newSources: ISource[]
): boolean => {
  let changed = false;
  if (sources.length !== newSources.length) {
    console.log("Source list changed, length not equal");
    changed = true;
  }
  
  sources.forEach((source) => {
    const newSource = newSources.find(
      (newSource) => newSource.id === source.id
    );
    if (!newSource) {
      console.log("Source list changed, new source not found in old list");
      changed = true;
    } else if (
      source.label !== newSource.label ||
      source.userGroup !== newSource.userGroup ||
      source.link?.viewer !== newSource.link?.viewer ||
      source.link?.guest !== newSource.link?.guest ||
      source.link?.broadcast !== newSource.link?.broadcast ||
      source.link?.director !== newSource.link?.director ||
      source.link?.lores !== newSource.link?.lores
    ) {
      changed = true;
    }
  });
  return changed;
};
