
export type normalizedInput_string = string;

export namespace StringUtil {
  export function normalizeInput(input: string): normalizedInput_string {
    return input.toLowerCase();
  }

  export function formatArrayOfStrings(stringArray: Array<string> ): string {
    let formattedString: string = "";
    for ( let str of stringArray) {
      formattedString += str +"\n";
    }
    return formattedString;
  }


}