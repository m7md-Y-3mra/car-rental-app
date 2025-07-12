import { PrismaClient } from "@prisma/client";

export default class BaseRepository {
  protected client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }

  getClient() {
    return this.client;
  }
}

export type Constructor<T = object> = new (...arg: any[]) => T;
