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
    if (last !== null && cvcs.length > 0) {
      const last_cvc = cvcs[cvcs.length - 1];
      const new_last_cvc = [last_cvc[0], last_cvc[1], (last_cvc[2] || '') + last];
      new_cvcs = new_cvcs.slice(0, -1).concat([new_last_cvc])
    }
    for (let i = 1; i < new_cvcs.length; i++) {
      let prev = new_cvcs[i - 1];
      let curr = new_cvcs[i];
      let prevC2 = prev[2] || '';
      if (curr[0] === 'bb') {
        curr[0] = 'b';
        prev[2] = prevC2 + 'b';
      } else if (curr[0] === 'll' && curr[1] !== 'a') {
        curr[0] = 'l';
        prev[2] = prevC2 + 'l';
      } else if (curr[0] === 'ss') {
        curr[0] = 's';
        if (prev[1] === 'Aa' && prevC2 == 'l') {
          prev[2] = 's';
        } else {
          prev[2] = prevC2 + 's';
        }
      } else if (curr[0] === 'yy') {
        curr[0] = 'y';
        prev[2] = prevC2 + 'y';
      }
    }
    return new_cvcs;
  }

first
  = "{l" c:[rSdDs] { return [null, 'A', 'l' + c] }
  / "{lo" { return [null, 'A', 'l'] }
  / "{l" { return [null, 'A', 'l'] }
  / "{" c:end_consonant? { return [null, 'i', c] }
  / ">a" c:end_consonant? { return ["'", 'a', c] }
  / "<i" { return ["'", 'i', null] }
  / "Aal" { return [null, 'Aa', 'l'] }
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
  / "ss"
  / "yy"
  / "}" { return "'" }
  / [btvjHxd*rzs$SDTZEgfqklmnhwy]

end_consonant
  = c:[btvjHxd*rzs$SDTZEgfqklmnhwy] "o" { return c }
  / ">o" { return "A'" }
