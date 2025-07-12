import bcrypt from "bcrypt";
import { hashPassword } from "../../../utils/hashUtils";

jest.mock("bcrypt");

describe("hash utils", () => {
  describe("hash password", () => {
    it("hash password successfully", async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue("salt");
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

      const hashedPassword = await hashPassword("password");

      expect(hashedPassword).toBe("hashedPassword");
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith("password", "salt");
    });

    it("hash password failure", async () => {
      (bcrypt.genSalt as jest.Mock).mockRejectedValue(new Error());

      await expect(hashPassword("password")).rejects.toThrow();
    });
  });
});
