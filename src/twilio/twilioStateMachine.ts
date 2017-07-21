import * as twilio from "twilio";
import { Optional, None, Some } from "../util/optional";


export class StateMachine {
  private state: State = new StartAndEndState();


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
   return transitionPromise.then((tr: TransitionResult) => {
      this.state = tr.state;
      return tr.responseMessage;
   });
  }
}

export interface TransitionResult {
  state: State,
  responseMessage: string
}

export abstract class State {
  abstract transitionTo(input: string): Promise<TransitionResult>;
  constructor (){}; 
  // This may also need a reference to the system state, or it may need to be injected
  
  // protected static readonly EMPTY_TRANSITON_RESULT: TransitionResult = {responseMessage: "", state: {}};


  private static COMMAND_ORGANIZE_BOAT: string = "organize boat";

  protected static checkIfHelp(input: string): Promise<string> {
    return new Promise((resolve, reject)=> {
      const normalizedInput = State.normalizeInput(input);
      switch (normalizedInput) {
        case "":
        case "commands":
        case "options":
          resolve("Organize boat - Requests that a new boat be organized.") 
        default:
          reject();
      }
    }); 
  }

  protected static checkForConfirmationOrDeclination(input: string): Promise<boolean> {
    return new Promise((resolve, reject)=> {
      const normalizedInput = State.normalizeInput(input);
      console.log(`input: ${normalizedInput}`);
      switch (normalizedInput) {
        case "yup":
        case "yeah":
        case "yes":
          console.log("resolving");
          resolve(true);
          break;
        case "nah":
        case "nope":
        case "no thank you":
        case "no thanks":
        case "no thankyou":
        case "no": 
          resolve(false);
          break
        default:
          reject()
      }
    }); 
  }


  protected static handleHelpSpecificCommands(input: string) {
    if (input.toLowerCase() == State.COMMAND_ORGANIZE_BOAT) {
    }

  }

  protected static normalizeInput(input: string) {
    return input.toLowerCase();
  }

  //TODO consider adding a help message to this.
  protected indicateInvalidInputAndMaintainState(): TransitionResult {
    return {responseMessage: "unrecogonized input", state: this}
  }

}




export class AwaitingConfirmation extends State {

  public transitionTo(input: string): Promise<TransitionResult> {
    const normalizedInput = State.normalizeInput(input);
    let transitionResult: TransitionResult = this.indicateInvalidInputAndMaintainState(); // assume the input will be invalid, overwrite the result if input is valid.

    return State.checkForConfirmationOrDeclination(normalizedInput).then((didAccept: boolean) => {
      console.log("did resolve")
      if (didAccept) {
        return {responseMessage: "You are confirmed for $event at $time", state: new StartAndEndState()};
      } else {
        return {responseMessage: "You have declined the request", state: new StartAndEndState()};
      }
    }).catch(() => {
      return State.checkIfHelp(normalizedInput).then( (helpMessage: string)=>{
        return {responseMessage: helpMessage, state: new AwaitingConfirmation()}; // respond with the help response and stay in the same state.
      });
    });
  }
}

// Should probably make this the end AND start state, as a conversation is never really "over"
export class StartAndEndState extends State {
  public transitionTo(input: string): Promise<TransitionResult> {
    State.checkIfHelp(input).then( (helpMessage: string) => {
      return {responseMessage: helpMessage, state: new StartAndEndState()};
    });
    return Promise.resolve({responseMessage: "End_state", state: new StartAndEndState()});
  }
}