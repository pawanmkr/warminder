import dotenv from "dotenv";
dotenv.config();

const config = {
  env: process.env.ENVIRONMENT,
  port: 10000,
  jwtSecret: "lakjdsfkajsdnflaoidkjfaisdfjkasdf",
  database: {
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY_ID,
    secretKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Region: process.env.S3_REGION,
    s3Bucket: process.env.S3_BUCKET,
  },
  email: {
    smtp: {
      server: process.env.SMTP_SERVER,
      port: process.env.SMTP_PORT,
      username: process.env.SMTP_USERNAME,
      password: process.env.SMTP_PASSWORD,
    },
  },
};

// You can add more configuration sections and parameters as needed

export default config;
