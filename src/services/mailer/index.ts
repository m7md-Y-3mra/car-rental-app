import { CONSOLE_LOG_EMAILS } from "@/config/env";
import { mailer as consoleLogMailer } from "./console-log-mailer";
import { mailer as gmailMailer } from "./gmail-mailer";
import { IMailer } from "./interface";

let mailer: IMailer = gmailMailer;

if (CONSOLE_LOG_EMAILS) {
  mailer = consoleLogMailer;
}

export { mailer };
