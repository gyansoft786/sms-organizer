export class ArrayUtil {
  public static union<T>(arr1: Array<T>, arr2: Array<T>): Array<T> {
    let retArray: Array<T> = [];
    let arr1Copy = arr1.copyWithin(0,0);
    let arr2Copy = arr2.copyWithin(0,0);

    for (let element of arr1Copy) {
        retArray.push(element);
    }
    for (let element of arr2Copy) {
        retArray.push(element);
    }
    return retArray;
  }

  public static intersecion<T>(arr1: Array<T>, arr2: Array<T>): Array<T> {
    let retArray: Array<T> = [];
    let arr1Copy = arr1.copyWithin(0,0);
    let arr2Copy = arr2.copyWithin(0,0);

    for(let element of arr1Copy) {
      if (arr2Copy.indexOf(element) >= 0) {
        retArray.push(element);
      }
    }

    for(let element of arr2Copy) {
      if (arr1Copy.indexOf(element) >= 0) {
        retArray.push(element);
      }
    }

    return retArray;
  }

  //TODO better name here
  public static removeElementsFromFirstArray<T>(arr1: Array<T>, arr2: Array<T>): Array<T> {
    let retArray: Array<T> = [];
    let arr1Copy = arr1.copyWithin(0,0);
    let arr2Copy = arr2.copyWithin(0,0);

    for(let element of arr1Copy) {
      if (arr2Copy.indexOf(element) >= 0) {
        retArray.push(element);
      }
    }
    return retArray;
  }

  /**
   * If any elements from arr2 are present in arr1, then this is true
   */
  public static containsAny<T>(arr1: Array<T>, arr2: Array<T>): boolean {
    for (let element of arr2) {
      if (arr1.indexOf(element) >= 0) {
        return true;
      }
    }
    return false
  }


}