

export enum Group {
    FirstTime, // no experience
    PreNovice, // no racing, some experience
    Novice, // first year racing
    Casual, // anyone wanting to be matched with anyone
    HighSchool,// U14 < age < U18
    Collegate, //  U18 < age < U23
    Masters, //  age > U23
    TeamOnly,
    Private // just used to manage people who want to be manually paired, or want to reserve a boat on their own.
}