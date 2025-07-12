import { BASE_URL } from "@/config/env";
import { IMailer } from "@/services/mailer/interface";
import { sendVerificationEmail } from "@/utils/emailUtils";
import { User } from "@prisma/client";

describe("emailUtils", () => {
  describe("sendVerificationEmail", () => {
    let mockMailer: jest.Mocked<IMailer>;
    let mockUser: User;
    const testToken = "test-token";

    beforeEach(() => {
      mockMailer = {
        send: jest.fn().mockResolvedValue(undefined),
      };

      mockUser = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        password: "hashedpassword",
        isEmailVerified: false,
        phone: "",
        address: "",
        imageUrl: null,
        jobTitle: null,
        bio: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    it("should call mailer.send with correct notification data", async () => {
      await sendVerificationEmail(mockMailer, mockUser, testToken);

      expect(mockMailer.send).toHaveBeenCalledTimes(1);
      expect(mockMailer.send).toHaveBeenCalledWith({
        to: mockUser.email,
        subject: "Verify Your Email Address",
        text: expect.stringContaining(mockUser.name),
        html: expect.stringContaining(mockUser.name),
      });
    });

    it("should include verification link in the email", async () => {
      await sendVerificationEmail(mockMailer, mockUser, testToken);

      const expectedLink = `${BASE_URL}/api/auth/verify-email?token=${testToken}`;
      expect(mockMailer.send).toHaveBeenCalledWith(
        expect.objectContaining({
          text: expect.stringContaining(expectedLink),
          html: expect.stringContaining(expectedLink),
        }),
      );
    });

    it("should throw error if mailer.send fails", async () => {
      const error = new Error("Failed to send email");
      mockMailer.send.mockRejectedValue(error);

      await expect(sendVerificationEmail(mockMailer, mockUser, testToken)).rejects.toThrow(error);
    });
  });
});
