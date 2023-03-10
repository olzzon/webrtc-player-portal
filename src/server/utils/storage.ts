import fs from "fs";
import os from "os";
import path from "path";
import { ISource } from "../../sharedcode/interfaces";
import { filterSourcesForClient } from "./getSourceLinks";

const homeDir = os.homedir();
const SETTINGS_FILE = path.join(homeDir, "webrtcportal-settings.json");

export const getSettings = (): ISource[] => {
  try {
    const data: ISource[] = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf8"));
    return data;
  } catch (e) {
    console.log("Error reading settings file", e);
    const data: ISource[] = [
      {
        url: "http://192.168.100.2:3900/linkurl",
        label: "Olzzon Basement",
        userGroup: "default",
        link: { viewer: "", guest: "", broadcast: "", director: "", lores: "" },
      },
    ];
    saveSettings(data);
    return data;
  }
};

export const saveSettings = (settings: ISource[]): void => {  
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(filterSourcesForClient(settings, ['default'])));
};
