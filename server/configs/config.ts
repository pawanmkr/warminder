import dotenv from "dotenv";
dotenv.config();

const config = {
    baseApiUrl: process.env.BASE_API_URL,
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
        zoho: {
            mail: process.env.ZOHOMAIL,
            password: process.env.ZOHOMAIL_PASSWORD,
        },
    },
    google: {
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: process.env.GOOGLE_REDIRECT_URI || "http://localhost:10000/api/auth/google/callback",

        gmail: {
            smtp: {
                host: process.env.GMAIL_SMTP_HOST || "smtp.gmail.com",
                port: process.env.GMAIL_SMTP_PORT || 465
            }
        }
    },
    ut: {
        secret: process.env.UPLOADTHING_SECRET,
        app_id: process.env.UPLOADTHING_APP_ID
    },
    azure: {
        connection_string: process.env.ABS_CONNECTION_STRING,
        container_name: process.env.ABS_CONTAINER_NAME
    }
};

// You can add more configuration sections and parameters as needed

export default config;
