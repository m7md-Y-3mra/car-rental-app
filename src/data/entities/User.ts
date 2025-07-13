import { User as IUser } from "@prisma/client";
import { Exclude, instanceToPlain } from "class-transformer";

export class User implements IUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  imageUrl: string;
  jobTitle: string;
  bio: string;

  @Exclude({ toPlainOnly: true })
  password: string;
  @Exclude({ toPlainOnly: true })
  isEmailVerified: boolean;
  @Exclude({ toPlainOnly: true })
  createdAt: Date;
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  constructor(
    id: number,
    name: string,
    email: string,
    phone: string,
    address: string,
    imageUrl: string,
    jobTitle: string,
    bio: string,
    password: string,
    isEmailVerified: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.imageUrl = imageUrl;
    this.jobTitle = jobTitle;
    this.bio = bio;
    this.password = password;
    this.isEmailVerified = isEmailVerified;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  asDto(): UserDTO {
    return instanceToPlain(this) as UserDTO;
  }
}
