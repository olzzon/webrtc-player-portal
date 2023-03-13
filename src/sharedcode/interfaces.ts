export interface IRESTresponse {
  viewer: string;
  guest: string;
  broadcast: string;
  director: string;
  lores: string;
}

export interface ISource {
  id?: string;
  url: string;
  label: string;
  userGroup?: string;
  link: IRESTresponse;
}

export interface IUserGroup {
  name: string;
}
