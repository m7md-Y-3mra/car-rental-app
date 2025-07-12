import { mailer as gmailMailer } from "./gmail-mailer";
import { IMailer } from "./interface";
import { mailer as consoleLogMailer } from "./console-log-mailer";
import { consoleLogEmails } from "@/config/env";

let mailer: IMailer = gmailMailer;

if (consoleLogEmails) {
  mailer = consoleLogMailer;
}

export { mailer };
