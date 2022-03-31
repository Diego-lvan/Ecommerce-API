declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      DB_HOST: string;
      DB_USER: string;
      DB_PWD: string;
      DB_NAME: string;
      ACCESS_TOKEN_SECRET: string;
      URL: string;
    }
  }
}
export {};
