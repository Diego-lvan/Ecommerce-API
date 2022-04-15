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
      STRIPE_PRIVATE_KEY: string;
      STRIPE_RESTRICTED_KEY: string;
      EMAIL_ADRESS: string;
      EMAIL_PWD: string;
    }
  }
}
export {};
