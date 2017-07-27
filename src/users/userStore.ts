import { User } from "./user";
import { Optional, None, Some } from "../util/optional";
import { injectable } from "inversify";
import { Group } from '../group/group';
import { ArrayUtil } from '../util/arrayUtil';

export interface UserStore {
  getAllUsers(): Array<User>
  getUserByName(name: string): Optional<User>;
  getUserByNumber(number: string): Optional<User>;
  addUser(user: User): void;
  getUsersByGroupList(groupList: Array<Group>): Optional<Array<User>>;
}


@injectable()
export class MockUserStore implements UserStore {
  
  private _userArray: Array<User>; // TODO: replace this with some persistent storage; probably replace a lot of these functions with sql statements.

  constructor(){
    this._userArray = [];
  }
  
  
  public getAllUsers(): Array<User> {
    /**
     * SELECT *
     * FROM users
     */
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
    /**
     * SELECT user
     * FROM users
     * WHERE phoneNumber=query
     */
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
    console.log(`adding user: ${user}`);
    this._userArray.push(user);
  }

  public getUsersByGroupList(groupList: Array<Group>): Optional<Array<User>> {

    let usersArray = [];
    for (let user of this._userArray) {
      if (ArrayUtil.containsAny(groupList, user.groups)) {
        usersArray.push(user);
      }
    }

    if (usersArray.length > 0) {
      return new Optional(usersArray);
    } else {
      return new Optional<Array<User>>(new None());
    }
  }

}