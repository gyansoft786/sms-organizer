import "reflect-metadata";
import { Container } from "inversify";

import { IDENTIFIER_TOKEN } from "./identifierToken";
import { UserStore, MockUserStore } from "../users/userStore";
import { UserStoreFactory } from "../users/userStoreFactory";



export const container: Container = new Container();


container.bind<UserStore>(IDENTIFIER_TOKEN.USER_STORE).to( MockUserStore ).inSingletonScope();
// container.bind<UserStoreFactory>(IDENTIFIER_TOKEN.USER_STORE_FACTORY).to( UserStoreFactory ).inSingletonScope();


export default container;