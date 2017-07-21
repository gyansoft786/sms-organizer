import { User } from "./user";
import { Optional, None, Some } from "../util/optional";
import { injectable } from "inversify";

export interface UserStore {
  getAllUsers(): Array<User>
  getUserByName(name: string): Optional<User>;
  getUserByNumber(number: string): Optional<User>;
  addUser(user: User): void;
}


@injectable()
export class MockUserStore implements UserStore {
  
  private _userArray: Array<User>;

  constructor(){
    this._userArray = [];
  }
  
  
  public getAllUsers(): Array<User> {
    return this._userArray;
  }


  public getUserByName(name: string): Optional<User> {
    for (let user of this._userArray) {
      if (user.fullName == name) {
        return new Optional<User>(user);
      }
    }
    return new Optional<User>(new None())
  }

  public getUserByNumber(phoneNumber: string): Optional<User> {
    console.log(`looking for ${phoneNumber}`);
    for (let user of this._userArray) {
      console.log(`searching: ${user.phoneNumber}`);
      if (user.phoneNumber == phoneNumber) {
        console.log(`found`);
        return new Optional<User>(user);
      }
    }
    return new Optional<User>(new None())
  }

  public addUser(user: User): void {
    console.log(`adding user: ${user}`)
    this._userArray.push(user);
  }

}