import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  preffered_website_name: process.env.PREFFERED_WEBSITE_NAME,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,

  cloudinary: {
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  },

  emailSender: {
    mail_service_email: process.env.GOOGLE_MAIL_SERVICE_EMAIL,
    mail_service_password: process.env.GOOGLE_MAIL_SERVICE_PASSWORD,
  },

  superAdmin: {
    name: process.env.SUPER_ADMIN_NAME,
    email: process.env.SUPER_ADMIN_EMAIL,
    password: process.env.SUPER_ADMIN_PASSWORD,
    contact_number: process.env.SUPER_ADMIN_CONTACT_NUMBER,
  },

  jwt: {
    access_secret: process.env.ACCESS_SECRET,
    access_secter_expires_in: process.env.ACCESS_SECRET_EXPIRES_IN,
    refresh_secret: process.env.REFRESH_SECRET,
    refresh_secret_expires_in: process.env.REFRESH_SECRET_EXPIRES_IN,
    reset_pass_secret: process.env.RESET_PASS_SECRET,
    reset_pass_secret_expires_in: process.env.RESET_PASS_SECRET_EXPIRES_IN,
  },

  ssl: {
    storeId: process.env.STORE_ID,
    storePass: process.env.STORE_PASS,
    successUrl: process.env.SUCCESS_URL,
    cancelUrl: process.env.CANCEL_URL,
    failUrl: process.env.FAIL_URL,
    // sslPaymentApi: process.env.SSL_PAYMENT_API,
    // sslValidationApi: process.env.SSL_VALIDATIOIN_API
  },
};
