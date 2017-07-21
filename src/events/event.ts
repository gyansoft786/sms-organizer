import { User } from "../users/user";
import { StringUtil } from "../util/stringUtil"

export class Event {
  private time: Date;
  private location: any | null; // implement physical location
  private resource: any | null; // boats
  private participants: Array<User>;
  private eligableGroups: Array<any>; // implement group;

  
  constructor(time: Date, location: any) {
    this.time = time;
    this.location = location;
  }

  public addParticipant(user: User): void {
    this.participants.push(user);
  }


  public toString(): string {
    return `Event at ${this.time} at ${this.location}`;
  }

  public listParticipants(): string {
    return StringUtil.formatArrayOfStrings(this.participants.map( (user) => { return user.fullName}))
  }

  public fullInfo(): string {
    return `${this.toString()} using ${this.resource} with participants: ${this.listParticipants()}`
  }

}