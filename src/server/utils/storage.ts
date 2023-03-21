import fs from "fs";
import os from "os";
import path from "path";
import { ISource } from "../../sharedcode/interfaces";
import { filterSourcesForClient } from "./handleSourceLinks";

const homeDir = os.homedir();
const SETTINGS_FILE = path.join(homeDir, "webrtcportal-settings.json");

export const getSettings = (): ISource[] => {
  try {
    let data: ISource[] = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf8"));
    data = data.map((source) => {
      if (!source.id) {
        console.error("Error reading settings file, no id found");        
      }
      if (!source.userGroup) {
        source.userGroup = "";
      }
      if (!source.label) {
        source.label = "Olzzon Basement";
      }
      if (!source.link) {
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
    return data;
  } catch (e) {
    console.log("Error reading settings file", e);
    const data: ISource[] = [
      {
        label: "Olzzon Basement",
        id: "longRandomHASH",
        userGroup: "",
        link: { viewer: "", guest: "", broadcast: "", director: "", lores: "" },
      },
    ];
    saveSettings(data);
    return data;
  }
};

export const saveSettings = (settings: ISource[]): void => {
  if (fs.existsSync(SETTINGS_FILE)) {
    const backupFilename = SETTINGS_FILE + Date.now().toString() + ".bak";
    console.log("Backing up settings file to :", backupFilename);
    
    fs.copyFileSync(SETTINGS_FILE, backupFilename);
  }
  fs.writeFileSync(
    SETTINGS_FILE,
    JSON.stringify(filterSourcesForClient(settings, ["default"]))
  );
};
