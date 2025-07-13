import { prisma } from "@/config/prismaClient";
import { PrismaClient } from "@prisma/client";

export default class BaseRepository {
  protected client: PrismaClient;

  constructor() {
    this.client = prisma;
  }

  getClient() {
    return this.client;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = object> = new (...arg: any[]) => T;
