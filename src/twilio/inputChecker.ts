
export namespace InputChecker {
  
  // move to a string util
  export function normalizeInput(input: string) {
    return input.toLowerCase();
  }

  export function checkIfHelp(input: string): Promise<string> {
    return new Promise((resolve, reject)=> {
      const normalizedInput = normalizeInput(input);
      switch (normalizedInput) {
        case "h":
        case "commands":
        case "options":
          resolve("Organize boat - Requests that a new boat be organized.") 
        default:
          reject();
      }
    }); 
  }

  export function checkForConfirmationOrDeclination(input: string): Promise<boolean> {
    return new Promise((resolve, reject)=> {
      const normalizedInput = normalizeInput(input);
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
  export function checkForCancel(input: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const normalizedInput = normalizeInput(input);
      switch (normalizedInput) {
        case "cancel boat":
         resolve(true);
         break;
        default:
          reject();
      }
    });
  }

  export function checkForNumber(input: string): Promise<number> {
    var reg = new RegExp('^[0-9]+$');
    return new Promise((resolve, reject) => {
      if (reg.test(input)) {
        resolve(Number(input));
      } else {
        reject();
      }
    });
  }

}