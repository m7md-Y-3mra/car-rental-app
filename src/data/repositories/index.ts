import BaseRepository from "./BaseRepository";
import { UserRepository } from "./UserRepository";

const repository = new (UserRepository(BaseRepository))();

export default repository;
