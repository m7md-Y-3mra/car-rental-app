import { User as IUser } from "@prisma/client";
import { Exclude, instanceToPlain } from "class-transformer";

export class User implements IUser {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  imageUrl: string | null;
  jobTitle: string | null;
  bio: string | null;

  @Exclude({ toPlainOnly: true })
  password: string | null;
  @Exclude({ toPlainOnly: true })
  isEmailVerified: boolean;
  @Exclude({ toPlainOnly: true })
  createdAt: Date;
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  constructor(
    id: number,
    name: string,
    email: string | null,
    phone: string | null,
    address: string | null,
    imageUrl: string | null,
    jobTitle: string | null,
    bio: string | null,
    password: string | null,
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
