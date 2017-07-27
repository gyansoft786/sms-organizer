import * as twilio from "twilio";
import { Optional, None, Some } from "../util/optional";
import { InputChecker } from './inputChecker';
import { User } from '../users/user';


export interface TransitionResult {
  state: State,
  responseMessage: string
}



export class StateMachine {
  private state: State;


  constructor(state?: State) {
    if (state instanceof State) {
      this.state = state;
    }
  }

  public externallySetSatate(newState: State) {
    this.state = newState;
  }

  public processInput(message: string): Promise<string> {
   let transitionPromise: Promise<TransitionResult> = this.state.transitionTo(message);
   transitionPromise.then((tr: TransitionResult) => {
     this.state = tr.state;
   })
   return transitionPromise.then((tr: TransitionResult) => {
      console.log(`setting state to: ${typeof tr.state}`)
      this.state = tr.state;
      return tr.responseMessage;
   });
  }
}


export abstract class State {
  abstract transitionTo(input: string): Promise<TransitionResult>;
  constructor (readonly user: User){}; 
  // This may also need a reference to the system state, or it may need to be injected

  private static COMMAND_ORGANIZE_BOAT: string = "organize boat";


  protected static handleHelpSpecificCommands(input: string) {
    if (input.toLowerCase() == State.COMMAND_ORGANIZE_BOAT) {
    }

  }

  //TODO consider adding a help message to this.
  protected indicateInvalidInputAndMaintainState(): TransitionResult {
    return {responseMessage: "Unrecogonized input. Here's some help...", state: this}
  }

}




export class AwaitingConfirmation extends State {

  public transitionTo(input: string): Promise<TransitionResult> {
    const normalizedInput = InputChecker.normalizeInput(input);
    let transitionResult: TransitionResult = this.indicateInvalidInputAndMaintainState(); // assume the input will be invalid, overwrite the result if input is valid.

    return InputChecker.checkForConfirmationOrDeclination(normalizedInput)
      .then((didAccept: boolean) => {
        if (didAccept) {
          return {responseMessage: "You are confirmed for $event at $time", state: new StartAndEndState(this.user)};
        } else {
          return {responseMessage: "You have declined the request", state: new StartAndEndState(this.user)};
        }
      })
      .catch(() => {
        return InputChecker.checkIfHelp(normalizedInput).then( (helpMessage: string) => {
          return {responseMessage: helpMessage, state: new AwaitingConfirmation(this.user)}; // respond with the help response and stay in the same state.
        })
        .catch(() => {
          return Promise.resolve(this.indicateInvalidInputAndMaintainState());
        });
    });
  }
}

export class StartAndEndState extends State {
  public transitionTo(input: string): Promise<TransitionResult> {
    return InputChecker.checkIfHelp(input)
      .then( (helpMessage: string) => {
        return {responseMessage: helpMessage, state: this};
      }).catch( () => {
        return InputChecker.checkForCancel(input).then( () => {
          // get events, enumerate through them.
          // Events must be returned in order, or with some identifier, so they can be used by differnt promise chains.
          return {responseMessage: "You have $n scheduled events. 1: $time, 2: $time, 3: $time. Which one do you want to cancel?", state: new CancelConfirmationState(this.user)}
        })
      })
      .catch( () => {
        return Promise.resolve({responseMessage: "You are at the end or start state, you currently can't do anything from here.", state: new StartAndEndState(this.user)});
      });
  }

}


export class CancelConfirmationState extends State {
  public transitionTo(input: string): Promise<TransitionResult> {
    return InputChecker.checkIfHelp(input).then( (helpMessage: string) => {
      return {responseMessage: helpMessage, state: this};
    }).catch( () => {
      return InputChecker.checkForNumber(input).then( (chosenNumber) => {
        // get boats for user, (assuming there are 4 here)
        if ( chosenNumber < 5 ) {
          return {responseMessage: `You chose ${chosenNumber}, canceling your participation at boat at $time`, state: new StartAndEndState(this.user)};
        } else {
          return {responseMessage: `You chose ${chosenNumber}, there is no boat associated with that number, try again.`, state: this};
        }

      })
    }).catch( () => {
       return Promise.resolve(this.indicateInvalidInputAndMaintainState());
    });
  }
}

export class AwaitingFirstName extends State {
  public transitionTo(input: string): Promise<TransitionResult> {
    this.user.setFirstName(input);
    return Promise.resolve({responseMessage: `Please enter your last name.`, state: new AwaitingLastName(this.user)});


  }



}

export class AwaitingLastName extends State {
    public transitionTo(input: string): Promise<TransitionResult> {
      this.user.setLastName(input);
      return Promise.resolve({responseMessage: `Your full name is ${this.user.fullName}. Text 'Reset' to restart the name input process or 'Confirm' to acknowledge that your name is correct.`, state: new ConfirmOrResetNameState(this.user)});
  }
}

export class ConfirmOrResetNameState extends State {
  public transitionTo(input: string): Promise<TransitionResult> {
    return InputChecker.checkIfConfirmOrReset(input).then((didConfirm: boolean) => {
      if (didConfirm){
        return {responseMessage: `You have confirmed your name as: ${this.user.fullName}. You must wait to be confirmed by an administrator in order to recieve $event notifications.`, state: new StartAndEndState(this.user)};
      } else {
        return {responseMessage: `Please enter your first name.`, state: new AwaitingFirstName(this.user)};
      }
    }).catch( () => {
      return Promise.resolve({responseMessage: `Please enter either 'confirm' or 'reset'.`, state: this});
    })
  }
}