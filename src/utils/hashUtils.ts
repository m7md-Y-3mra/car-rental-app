import { SALT_ROUNDS } from "@/config/env";
import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error(
      `Error hashing password: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};
