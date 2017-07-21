
export enum Group {
  FirstTime, // no experience
  PreNovice, // no racing, some experience
  Novice, // first year racing
  HighSchool,// U14 < age < U18
  Collegate, //  U18 < age < U23
  Masters, //  age > U23
  TeamOnly, // Only for the team in question
  Casual, // anyone wanting to be matched with anyone
  Private // just used to manage people who want to be manually paired, or want to reserve a boat on their own.
}

export function getStringForGroupEnum(group: Group): string {
  switch (group) {
    case Group.FirstTime:
      return "First Time";
    case Group.PreNovice:
      return "Pre Novice";
    case Group.Novice:
      return "Novice";
    case Group.HighSchool:
      return "High School";
    case Group.Collegate:
      return "Collegate";
    case Group.Masters:
      return "Masters";
    case Group.TeamOnly:
      return "ARC"; // Possibly create a global that replaces this.
    case Group.Casual:
      return "Casual";
    case Group.Private:
      return "Private"
  }
}