import fs from "fs";
import os from "os";
import path from "path";
import { ISource } from "../../sharedcode/interfaces";
import { createRandomHash } from "./createRandomHash";

const homeDir = os.homedir();
const SETTINGS_FILE = path.join(homeDir, "webrtcportal-settings.json");

export const getSettings = (): ISource[] => {
  let recievedSettings: ISource[];
  try {
    recievedSettings = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf8"));
    if (!validateRecievedSettings(recievedSettings)) {
      throw new Error("Invalid settings file");
    }
    return addLinksToSettings(recievedSettings);
  } catch (e) {
    console.log("Error in settings file, attempting to repair");
    let repairedSettings = repairRecievedSettings(recievedSettings);
    console.log("Old settings file", recievedSettings);
    console.log("Repaired settings file", repairedSettings);

    saveSettings(repairedSettings);
    return addLinksToSettings(repairedSettings);
  }
};

const saveSettings = (settings: ISource[]): void => {
  if (fs.existsSync(SETTINGS_FILE)) {
    const backupFilename = SETTINGS_FILE + Date.now().toString() + ".bak";
    console.log("Backing up settings file to :", backupFilename);
    fs.copyFileSync(SETTINGS_FILE, backupFilename);
  }
  console.log("Saving settings file to :", SETTINGS_FILE);

  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings));
};

function validateRecievedSettings(settings: ISource[]): boolean {
  let valid = true;
  settings.forEach((source) => {
    if (!source.id) {
      console.error("Error reading settings file, no id found");
    } else if (
      settings.find((otherSources) => otherSources.id === source.id) !== source
    ) {
      console.error("Error reading settings file, duplicate id found");
    }
    if (!source.userGroup) {
      console.error(
        "Error reading settings file, missing userGroup in source",
        source
      );
      valid = false;
    }
    if (!source.label) {
      console.error(
        "Error reading settings file, missing label in source",
        source
      );
      valid = false;
    }
  });
  return valid;
}

function addLinksToSettings(settings: ISource[]): ISource[] {
  settings = settings.map((source: ISource) => {
    if (source.staticUrl) {
      source.link = {
        viewer: source.staticUrl,
        guest: source.staticUrl,
        broadcast: source.staticUrl,
        director: source.staticUrl,
        lores: source.staticUrl,
      };
    } else {
      source.link = {
        viewer: "",
        guest: "",
        broadcast: "",
        director: "",
        lores: "",
      };
    }
    return source;
  });
  return settings;
}

function repairRecievedSettings(settings: ISource[]): ISource[] {
  let repairedSettings: ISource[] = [];
  repairedSettings = settings.map((source: ISource) => {
    if (
      !source.id ||
      settings.find((otherSources) => otherSources.id === source.id) !== source
    ) {
      source.id = createRandomHash();
    }
    if (!source.userGroup) {
      source.userGroup = "default";
    }
    if (!source.label) {
      source.label = "NoLabel";
    }
    return {
      id: source.id,
      label: source.label,
      userGroup: source.userGroup,
    };
  });

  if (repairedSettings.length === 0) {
    repairedSettings = [
      {
        id: createRandomHash(),
        label: "NoLabel",
        userGroup: "default",
      },
    ];
  }
  return repairedSettings;
}
