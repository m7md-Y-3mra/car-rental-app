import { GmailMailer } from "@/services/mailer/gmail-mailer/GmailMailer";
import nodemailer from "nodemailer";

jest.mock("nodemailer");

describe("GmailMailer", () => {
  let mailer: GmailMailer;
  let mockTransporter: jest.Mocked<Pick<nodemailer.Transporter, "sendMail">>;

  beforeEach(() => {
    mockTransporter = {
      sendMail: jest.fn(),
    };
    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);
    mailer = new GmailMailer();
  });

  it("should send email successfully", async () => {
    const notification = {
      to: "test@example.com",
      subject: "Test Subject",
      text: "Test text",
      html: "<p>Test HTML</p>",
    };

    mockTransporter.sendMail.mockResolvedValue(undefined);

    await mailer.send(notification);

    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: expect.stringContaining("Car Rental Service"),
        to: notification.to,
        subject: notification.subject,
        text: notification.text,
        html: notification.html,
      }),
    );
  });

  it("should throw error when email sending fails", async () => {
    const notification = {
      to: "test@example.com",
      subject: "Test Subject",
      text: "Test text",
    };

    mockTransporter.sendMail.mockRejectedValue(new Error("Send failed"));

    await expect(mailer.send(notification)).rejects.toThrow();
  });
});
