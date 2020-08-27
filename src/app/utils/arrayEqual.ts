export function arrayEqual(array1: any[], array2: any[]) {
    return array1.length === array2.length && array1.every((element, index) => {
        return element === array2[index];
    });
}
