start
  = wa:wa_prefix? first:first? cvcs:cvc* last:last_consonant? dash:"-"? {
    let new_cvcs = []
    if (wa !== null) {
      new_cvcs.push(wa);
    }
    if (first !== null) {
      new_cvcs.push(first);
    }
    new_cvcs = new_cvcs.concat(cvcs);
    if (new_cvcs.length > 0) {
      const last_cvc = new_cvcs[new_cvcs.length - 1];
      new_cvcs = new_cvcs
        .slice(0, -1)
        .concat([last_cvc + (last || '') + (dash || '')]);
    }
    return new_cvcs;
  }

wa_prefix
  = "wa" !"A" { return "wa" }

first
  = "{l" c:[rSdDs] { return 'al' + c }
  / "{lo" { return 'al' }
  / "{l" { return 'al' }
  / "{" c:end_consonant? { return 'i' + (c || '') }
  / ">a" c:end_consonant? { return "'a" + (c || '') }
  / "<iy" & "y" { return "'iy" }
  / "<i" { return "'i" }
  / "Aals" & "s" { return 'als' }
  / "Aal" { return 'al' }
  / "Ai" end_consonant:end_consonant? { return 'i' + (end_consonant || '') }
  / vowel:vowel end_consonant:end_consonant? {
    return vowel + (end_consonant || '')
  }

last_consonant
  = [mns]
  / "l" !"l" { return "l" }
  / "F" { return "n" }
  / "'"

vowel
  = "Ai"
  / "a`" { return "a" }
  / "aA^" { return "A" }
  / "aA" { return "A" }
  / "ay" !"o" { return "ay" }
  / "iy" !"a" { return "iy" }
  / "uw"
  / "Aa" { return "A" } // after L
  / [aiuA]

cvc
  = c1:consonant "ap" { return c1 + 'ap' }
  / c1:start_consonant v:vowel c2:end_consonant? { return c1 + v + (c2 || '') }

start_consonant
  = "ll" & "ah" { return "ll" }
  / "}" { return "'" }
  / consonant

end_consonant
  = c:consonant "o" { return c }
  / ">o" { return "A'" }
  / "b" & "b" { return "b" }
  / "d" & "d" { return "d" }
  / "l" & "l" { return "l" }
  / "m" & "m" { return "m" }
  / "w" & "w" { return "w" }

consonant
  = c:[btvjHxd*rzs$SDTZEgfqklmnhwy]
