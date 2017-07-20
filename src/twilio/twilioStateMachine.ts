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
  

  private static COMMAND_ORGANIZE_BOAT: string = "organize boat"
  protected static handleRequestForHelp(input: string): Optional<string> {
    if(input == "H" || input == "h" || input == "commands") {
      return new Optional<string>("Organize boat - Requests that a new boat be organized.")
    } else {
      return new Optional<string>(new None());
    }
  
}
  protected static handleHelpSpecificCommands(input: string) {
    if (input.toLowerCase() == State.COMMAND_ORGANIZE_BOAT) {
      
    }

  }

  protected normalizeInput(input: string) {
    return input.toLowerCase();
  }

}




export class AwaitingConfirmation extends State {

  //The commands enumerated here _MUST_ have a help message.
  // Other inputs are allowed to have the same state change
  private static COMMAND_YES: string = "yes";
  private static COMMAND_NO: string = "no";

  public transitionTo(input: string): TransitionResult {
    const normalizedInput = this.normalizeInput(input);
    let transitionResult: TransitionResult | undefined;

    State.handleRequestForHelp(normalizedInput).some_or( (helpMessage: string) => {
      //TODO, possibly add a state-relevant help message here.
      transitionResult = {responseMessage: helpMessage, state: new AwaitingConfirmation()}; // respond with the help response and stay in the same state.
    });


    switch (normalizedInput) { 
      case "yup":
      case "yeah":
      case AwaitingConfirmation.COMMAND_YES:
        // eventStore.addParticipantToEvent(user, event)
        transitionResult = {responseMessage: "You are confirmed for $event at $time", state: new StartAndEndState()};
        break;
      case "nah":
      case "nope":
      case "no thank you":
      case "no thanks":
      case "no thankyou":
      case AwaitingConfirmation.COMMAND_NO:       
        transitionResult = {responseMessage: "You have declined the request", state: new StartAndEndState()};
        break;
      default:
        transitionResult = {responseMessage: "Response must be either \"yes\" or \"no\".", state: new AwaitingConfirmation()};
        break;
    }

    return transitionResult; 
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