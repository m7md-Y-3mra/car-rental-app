import { SMTP_FROM, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from "@/config/env";
import { createTransport, TransportOptions } from "nodemailer";
import { IMailer, IMailNotification } from "../interface";

export class GmailMailer implements IMailer {
  private transporter;

  constructor() {
    this.transporter = createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      requireTLS: true,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    } as TransportOptions);
  }

  async send(mailNotification: IMailNotification) {
    const mailOptions = {
      from: `"Car Rental Service" <${SMTP_FROM}>`,
      to: mailNotification.to,
      subject: mailNotification.subject,
      text: mailNotification.text,
      html: mailNotification.html,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
