import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import * as dotenv from "dotenv";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");

import { IndexRoute } from "./routes/index";
import { TwilioRoute } from "./routes/twilio";
import { UserStore } from "./users/userStore";
import { container } from './dependencyInjection/inversifyConfig';
import { IDENTIFIER_TOKEN } from './dependencyInjection/identifierToken';
import { User } from './users/user';
import { AwaitingConfirmation } from './twilio/twilioStateMachine';
import { TwilioClient } from './twilio/twilioClient';

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public app: express.Application;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    //create expressjs application
    this.app = express();

    //configure application
    this.config();

    //add routes
    this.routes();

    //add api
    this.api();
  }

  /**
   * Create REST API routes
   *
   * @class Server
   * @method api
   */
  public api() {
    //empty for now
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {
    //add static paths
    this.app.use(express.static(path.join(__dirname, "public")));

    //configure pug
    this.app.set("views", path.join(__dirname, "views"));
    this.app.set("view engine", "pug");

    //mount logger
    this.app.use(logger("dev"));

    //mount json form parser
    this.app.use(bodyParser.json());

    //mount query string parser
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));

    //mount cookie parker
    this.app.use(cookieParser("SECRET_GOES_HERE"));

    //mount override?
    this.app.use(methodOverride());

    // catch 404 and forward to error handler
    this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
        err.status = 404;
        next(err);
    });

    //do misc testing stuff, remove later plz
    const userStore: UserStore = container.get<UserStore>(IDENTIFIER_TOKEN.USER_STORE);
    const henryUser = new User("Henry", "Zimmerman", "+18472871920");
    const twilioClient: TwilioClient = new TwilioClient();
    twilioClient.sendSMSToUser(henryUser,"Are you interested in a boat at 3:30 am July 5th?");
    henryUser.setState(new AwaitingConfirmation(henryUser)); // remove me
    userStore.addUser(henryUser);


    //error handling
    this.app.use(errorHandler());
  }

  /**
   * Create and return Router.
   *
   * @class Server
   * @method config
   * @return void
   */
  private routes() {
    let router: express.Router;
    router = express.Router();

    //IndexRoute
    // IndexRoute.create(router);
    TwilioRoute.create(router);
    

    //use router middleware
    this.app.use(router);
  }

}