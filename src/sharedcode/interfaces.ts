export interface ISource {
  id: string;
  label: string;
  userGroup?: string;
  staticUrl?: string;
  linkUpdateTime?: number;
  link?: IRESTresponse;
}

export interface IUserGroup {
  name: string;
}

export interface ISourceClients {
  id: string;
  label: string;
  viewer: string;
  lores: string;
}

export interface IRESTresponse {
  viewer: string;
  guest: string;
  broadcast: string;
  director: string;
  lores: string;
}

