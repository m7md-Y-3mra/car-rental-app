import { IMailer, IMailNotification } from "../interface";

export class ConsoleLogMailer implements IMailer {
  async send(mailNotification: IMailNotification) {
    console.log("📧 Email would be sent:", {
      to: mailNotification.to,
      subject: mailNotification.subject,
      text: mailNotification.text,
      ...(mailNotification.html && { html: mailNotification.html }),
    });
  }
}
