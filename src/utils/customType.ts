import { Request } from 'express';

// export interface TypedRequestBody<T> extends Request {
//   body: T;
// }

export interface TypedRequestUser<T> extends Request {
  user?: T;
}

export interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  USERNAME: string;
  DATABASE: string;
  DATABASE_PASSWORD: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_COOKIE_EXPIRES_IN: number;
}
