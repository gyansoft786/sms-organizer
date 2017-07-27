import { StateMachine, State } from "../twilio/twilioStateMachine"
import { Group } from "../group/group";
import { ArrayUtil } from "../util/arrayUtil";


export class User {

  private readonly _phoneNumber: string;
  private _firstName: string;
  private _lastName: string;
  private _groups: Array<Group>;
  private stateMachine: StateMachine;
  private _provisionalState: string;

  constructor( firstName: string, lastName: string, phoneNumber: string ) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._phoneNumber = phoneNumber;
    this.stateMachine = new StateMachine();
  }


  public setState(state: State) {
    this.stateMachine.externallySetSatate(state);
  }

  public processInput(message: string ): Promise<string> {
   return this.stateMachine.processInput(message);
  }

  public setFirstName(value: string): boolean {
    if( this._provisionalState) {
      this._firstName = value;
      return true;
    }
    return false; 
  
}
  public setLastName(value: string): boolean {
    if( this._provisionalState) {
      this._lastName = value;
      return true;
    }
    return false; 
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

  public get groups(): Array<Group> {
    return this._groups;
  }

  // adds groups to the user so a query will see if they are interested
  public registerGroups(groups: Array<Group>){
    this._groups = ArrayUtil.union(this.groups, groups);
  }

  public deregisterGroups(groups: Array<Group>){
    this._groups = ArrayUtil.removeElementsFromFirstArray(this.groups, groups);
  }



  //Useful if you want a static way of creating a properly formatted full name.
  public static generateFullName(firstName: string, lastName: string) {
        return `${firstName} ${lastName}`;

  }
}