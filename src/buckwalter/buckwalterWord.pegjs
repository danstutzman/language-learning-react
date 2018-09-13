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
    return new_cvcs;
  }

first
  = "{l" c:[rSdDs] { return [null, 'A', 'l' + c] }
  / "{lo" { return [null, 'A', 'l'] }
  / "{l" { return [null, 'A', 'l'] }
  / "{" c:end_consonant? { return [null, 'i', c] }
  / ">a" c:end_consonant? { return ["'", 'a', c] }
  / "<iy" & "y" { return ["'", 'i', 'y'] }
  / "<i" { return ["'", 'i', null] }
  / "Aals" & "s" { return [null, 'Aa', 'ls'] }
  / "Aal" { return [null, 'Aa', 'l'] }
  / vowel:vowel end_consonant:end_consonant? {
    return [null, vowel, end_consonant]
  }

last_consonant
  = [ns]
  / "l" !"l" { return "l" }
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
  = "ll" & "ah" { return "ll" }
  / "}" { return "'" }
  / [btvjHxd*rzs$SDTZEgfqklmnhwy]

end_consonant
  = c:[btvjHxd*rzs$SDTZEgfqklmnhwy] "o" { return c }
  / ">o" { return "A'" }
  / "b" & "b" { return "b" }
  / "l" & "l" { return "l" }
