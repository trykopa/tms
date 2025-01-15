export interface IJwtPayload {
  sub: string;
  email: string;
}

export interface ILoginResponse {
  access_token: string;
  refresh_token: string;
}
