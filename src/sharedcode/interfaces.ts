export interface IRESTresponse {
  viewer: string;
  guest: string;
  broadcast: string;
  director: string;
}

export interface ISource {
  url: string;
  label: string;
  link: IRESTresponse;
}
