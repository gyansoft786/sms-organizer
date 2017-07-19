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

  public processInput(message: string): string {
   let transitionResult = this.state.transitionTo(message);
   this.state = transitionResult.state;
   return transitionResult.responseMessage;
  }
}

export interface TransitionResult {
  state: State,
  responseMessage: string
}


export abstract class State {
  abstract transitionTo(input: string): TransitionResult;
  constructor (){}; 
  // This may also need a reference to the system state, or it may need to be injected
  
  protected static handleRequestForHelp(input: string): Optional<string> {
    if(input == "H" || input == "h" || input == "commands") {
      return new Optional<string>("Organize boat - Requests that a new boat be organized.")
    } else {
      return new Optional<string>(new None());
    }
  }
  protected static handleHelpSpecificCommands(input: string) {
    if (input == "Organize boat")
  }
}




export class AwaitingConfirmation extends State {
  public transitionTo(input: string): TransitionResult {
    let transitionResult: TransitionResult | undefined = State.handleRequestForHelp(input).some_or( (helpMessage: string) => {
      return {responseMessage: helpMessage, state: new AwaitingConfirmation()};
    });
    if (transitionResult != undefined) {
      return transitionResult;
    }
    

    if (input == "yes") {
      // TODO add to ledger of confirmed users
      return {responseMessage: "You are confirmed for $event at $time", state: new StartAndEndState()};
    } else if ( input == "no") {
      return {responseMessage: "You have declined the request", state: new StartAndEndState()};
    } else {
      return {responseMessage: "Response must be either \"yes\" or \"no\".", state: new AwaitingConfirmation()};
    }

  }


}

// Should probably make this the end AND start state, as a conversation is never really "over"
export class StartAndEndState extends State {
  public transitionTo(input: string): TransitionResult {

    State.handleRequestForHelp(input).some_or( (helpMessage: string) => {
      return {responseMessage: helpMessage, state: new StartAndEndState()};
    });
    return {responseMessage: "End_state", state: new StartAndEndState()};
  }
}