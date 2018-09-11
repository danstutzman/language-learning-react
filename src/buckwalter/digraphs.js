export function expandDigraphs(romanized: string): string {
  return romanized
    .replace('v', 'th')
    .replace('x', 'kh')
    .replace('*', 'dh')
    .replace('$', 'sh')
    .replace('g', 'gh')
    .replace('A', 'aa')
    .replace('I', 'ii')
    .replace('U', 'uu')
}

export function mergeDigraphs(userInput: string): string {
  return userInput
    .replace('th', 'v')
    .replace('kh', 'x')
    .replace('dh', '*')
    .replace('sh', '$')
    .replace('gh', 'g')
    .replace('aa', 'A')
    .replace('ii', 'I')
    .replace('uu', 'U')
}