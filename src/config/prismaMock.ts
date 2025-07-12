import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";

export const prismaMock = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => prismaMock),
}));

beforeEach(() => {
  mockReset(prismaMock);
});
