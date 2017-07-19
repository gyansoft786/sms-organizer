import { StateMachine, State } from "../twilio/twilioStateMachine"


export class User {

  private readonly _phoneNumber: string;
  private readonly _firstName: string;
  private readonly _lastName: string;
  //private groups: Array<Group>;
  private stateMachine: StateMachine;

  constructor( firstName: string, lastName: string, phoneNumber: string ) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._phoneNumber = phoneNumber;
    this.stateMachine = new StateMachine()
  }


  public setState(state: State) {
    this.stateMachine.externallySetSatate(state);
  }

  public processInput(message: string ): string {
   return this.stateMachine.processInput(message);
  }


  public get firstName(){
    return this._firstName;
  }

  public get lastName() {
    return this._lastName;
  }

  public get fullName() {
    return User.generateFullName(this.firstName, this.lastName);
  }
  
  public get phoneNumber(): string {
    return this._phoneNumber;
  }

  



  //Useful if you want a static way of creating a properly formatted full name.
  public static generateFullName(firstName: string, lastName: string) {
        return `${firstName} ${lastName}`;

  }
}