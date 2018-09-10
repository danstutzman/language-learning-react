start
  = wa:"wa"? first:first? cvcs:cvc* last:last_consonant? {
    let new_cvcs = []
    if (wa !== null) {
      new_cvcs.push(['w', 'a', null]);
    }
    if (first !== null) {
      new_cvcs.push(first);
    }
    new_cvcs = new_cvcs.concat(cvcs);
    if (last !== null) {
      const last_cvc = new_cvcs[cvcs.length - 1];
      const new_last_cvc = [last_cvc[0], last_cvc[1], (last_cvc[2] || '') + last];
      new_cvcs = new_cvcs.slice(0, -1).concat([new_last_cvc])
    }
    for (let i = 1; i < new_cvcs.length; i++) {
      if (new_cvcs[i][0] === 'bb') {
        new_cvcs[i][0] = 'b';
        new_cvcs[i - 1][2] = 'b';
      } else if (new_cvcs[i][0] === 'll' && new_cvcs[i][1] !== 'a') {
        new_cvcs[i][0] = 'l';
        new_cvcs[i - 1][2] = 'l';
      } else if (new_cvcs[i][0] === 'yy') {
        new_cvcs[i][0] = 'y';
        new_cvcs[i - 1][2] = 'y';
      }
    }
    return new_cvcs;
  }

first
  = "{l" c:[rSdDs] { return [null, 'A', c] }
  / "{lo" { return [null, 'A', 'l'] }
  / "{l" { return [null, 'A', 'l'] }
  / "{" c:end_consonant? { return [null, 'i', c] }
  / ">a" c:end_consonant? { return ["'", 'a', c] }
  / "<i" { return ["'", 'i', null] }
  / "Aals" { return [null, 'Aa', 'ls'] }
  / vowel:vowel end_consonant:end_consonant? {
    return [null, vowel, end_consonant]
  }

last_consonant
  = [lns]
  / "F" { return "n" }

vowel
  = "Ai"
  / "a`" { return "a" }
  / "aA^" { return "aA" }
  / "aA"
  / "ay" !"o" { return "ay" }
  / "iy" !"a" { return "iy" }
  / "uw"
  / [aiuA]

cvc
  = start_consonant vowel end_consonant?

start_consonant
  = "ll"
  / "bb"
  / "yy"
  / "}" { return "'" }
  / [btvjHxd*rzs$SDTZEgfqklmnhwy]

end_consonant
  = c:[btvjHxd*rzs$SDTZEgfqklmnhwy] "o" { return c }
  / ">o" { return "A'" }
