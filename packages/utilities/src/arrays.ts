export function arraysMatchUnordered(arr1: string[], arr2: string[]) {
  if (arr1.length !== arr2.length) return false;
  return arr1.slice().sort().join(',') === arr2.slice().sort().join(',');
}
