export function expandDigraphs(romanized: string): string {
  return romanized
    .replace(/v/g, 'th')
    .replace(/x/g, 'kh')
    .replace(/\*/g, 'dh')
    .replace(/\$/g, 'sh')
    .replace(/g/g, 'gh')
    .replace(/A/g, 'aa')
    .replace(/I/g, 'ii')
    .replace(/U/g, 'uu')
    .replace(/E/g, '\u1d9c')
    // .replace(/'/g, '\u02bea')
    .replace(/'/g, '\u2019')
}

export function mergeDigraphs(userInput: string): string {
  return userInput
    .replace(/th/g, 'v')
    .replace(/kh/g, 'x')
    .replace(/dh/g, '*')
    .replace(/sh/g, '$')
    .replace(/gh/g, 'g')
    .replace(/aa/g, 'A')
    .replace(/ii/g, 'I')
    .replace(/uu/g, 'U')
    .replace(/c/g, 'E')
    .replace(/`/g, 'E')
}