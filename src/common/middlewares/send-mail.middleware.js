import nodeMailer from "nodemailer";
import dns from "dns/promises";
import logger from "../logger";

const mailLogger = logger.withLabel("MAIL");
const isLocalMailEnv =
  `${process.env.NODE_ENV || process.env.ENV || ""}`.toLowerCase() === "local";

const sendMail = async (obj) => {
  if (
    !process.env.MAIL_HOST ||
    !process.env.MAIL_PORT ||
    !process.env.MAIL_USERNAME ||
    !process.env.MAIL_PASSWORD
  ) {
    mailLogger.warn("Mail config missing. Skipping email send.", {
      to: obj?.to || null,
      subject: obj?.subject || null,
    });
    return true;
  }

  const port = Number(process.env.MAIL_PORT);
  const secure = port === 465;
  const resolvedHost = await dns.lookup(process.env.MAIL_HOST, { family: 4 });
  const socketHost = resolvedHost?.address || process.env.MAIL_HOST;

  mailLogger.info("Resolved SMTP host.", {
    host: process.env.MAIL_HOST,
    socketHost,
    family: resolvedHost?.family || null,
  });

  const transporter = nodeMailer.createTransport({
    host: socketHost,
    port,
    secure,
    requireTLS: !secure,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: {
      minVersion: "TLSv1.2",
      servername: process.env.MAIL_HOST,
      rejectUnauthorized: !isLocalMailEnv,
    },
  });

  const html = obj.html
    ? obj.html
    : `<p>${obj.message || ""}</p>${obj.otp ? `<p>OTP: ${obj.otp}</p>` : ""}`;

  mailLogger.info("Preparing to send email.", {
    host: process.env.MAIL_HOST,
    socketHost,
    port,
    secure,
    requireTLS: !secure,
    rejectUnauthorized: !isLocalMailEnv,
    to: obj?.to || null,
    subject: obj?.subject || null,
    username: process.env.MAIL_USERNAME || null,
  });

  try {
    await transporter.verify();
    mailLogger.info("SMTP verification succeeded.", {
      host: process.env.MAIL_HOST,
      socketHost,
      port,
      secure,
      rejectUnauthorized: !isLocalMailEnv,
    });

    await transporter.sendMail({
      from: `${process.env.APP_NAME} <${process.env.MAIL_USERNAME}>`,
      to: obj.to,
      subject: obj.subject,
      html,
    });

    mailLogger.info("Email sent successfully.", {
      to: obj?.to || null,
      subject: obj?.subject || null,
    });
  } catch (error) {
    mailLogger.error("Email send failed.", {
      host: process.env.MAIL_HOST,
      socketHost,
      port,
      secure,
      requireTLS: !secure,
      rejectUnauthorized: !isLocalMailEnv,
      to: obj?.to || null,
      subject: obj?.subject || null,
      message: error?.message || "Unknown error",
      code: error?.code || null,
      command: error?.command || null,
      response: error?.response || null,
      responseCode: error?.responseCode || null,
      stack: error?.stack || null,
    });
    throw error;
  }

  return true;
};

module.exports = sendMail;
