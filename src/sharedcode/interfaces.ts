export interface IRESTresponse {
  viewer: string;
  guest: string;
  broadcast: string;
  director: string;
}

export interface ISource {
  url: string;
  label: string;
  usergroup?: string;
  link: IRESTresponse;
}

export interface IUserGroup {
  name: string;
}
