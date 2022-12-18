
export interface IRESTresponse {
    viewer: string;
    guest: string;
    broadcast: string;
    director: string;
  }
  
export interface IPlayer {
      url: string;
      label: string;
      link: IRESTresponse;
  }
