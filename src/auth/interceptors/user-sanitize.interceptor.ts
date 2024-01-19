import { Exclude } from "class-transformer";

export class SanitizerUser{
  @Exclude()
  password: string;

  constructor(partial: Partial<SanitizerUser>) {
    Object.assign(this,partial)
  }
}