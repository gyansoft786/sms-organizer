import { UserStore, MockUserStore } from "./userStore";
import { User } from "./user";
import { injectable } from "inversify";


// @injectable()
export class UserStoreFactory {
  
  public static defaultUserStore(): UserStore {
    const userStore: UserStore = new MockUserStore();
    const henryUser = new User("Henry", "Zimmerman", "+18472871920");

    userStore.addUser(henryUser);

    return userStore;
  }
}