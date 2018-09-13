export function expandQalam1(romanized: string): string {
  return romanized
    .replace(/v/g, 'th')
    .replace(/x/g, 'kh')
    .replace(/\*/g, 'dh')
    .replace(/\$/g, 'sh')
    .replace(/g/g, 'gh')
    .replace(/A/g, 'aa')
    .replace(/E/g, '\u1d9c')
    // .replace(/'/g, '\u02bea')
    .replace(/'/g, '\u2019')
}

export function mergeToQalam1(userInput: string): string {
  return userInput
    .replace(/th/g, 'v')
    .replace(/kh/g, 'x')
    .replace(/dh/g, '*')
    .replace(/sh/g, '$')
    .replace(/gh/g, 'g')
    .replace(/aa/g, 'A')
    .replace(/c/g, 'E')
    .replace(/`/g, 'E')
}