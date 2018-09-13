start
  = wa:wa_prefix? first:first? cvcs:cvc* last:last_consonant? {
    let new_cvcs = []
    if (wa !== null) {
      new_cvcs.push(['w', 'a', ''])
    }
    if (first !== null) {
      new_cvcs.push(first)
    }
    new_cvcs = new_cvcs.concat(cvcs)
    if (new_cvcs.length > 0 && last !== null) {
      const last_cvc = new_cvcs[new_cvcs.length - 1]
      new_cvcs = new_cvcs
        .slice(0, -1)
        .concat([[last_cvc[0], last_cvc[1], last_cvc[2] + last]])
    }
    return new_cvcs
  }

wa_prefix
  = "wa" !"A" { return ['w', 'a', ''] }

first
  = curly:"{" "l" c:[rSdDs] { return ['', curly, 'l' + c] }
  / curly:"{" "lo" { return ['', curly, 'lo'] }
  / curly:"{" "l" { return ['', curly, 'l'] }
  / curly:"{" c:end_consonant? { return ['', curly, c || ''] }
  / ">a" c:end_consonant? { return ['', '>a', c || ''] }
  / "<iy" & "y" { return ['', '<i', 'y'] }
  / "<i" { return ['', '<', 'i'] }
  / "Aals" & "s" { return ['', 'a', 'ls'] }
  / "Aal" { return ['', 'a', 'l'] }
  / "Ai" c:end_consonant? { return ['', 'Ai', c || ''] }
  / v:vowel c:end_consonant? { return ['', v, c || ''] }

last_consonant
  = [mns]
  / "l" !"l" { return 'l' }
  / "F"
  / "'"

vowel
  = "Ai"
  / "a`"
  / "aA^"
  / "aA"
  / "ay" !"o" { return 'ay' }
  / "iy" !"a" { return 'iy' }
  / "uw"
  / "Aa" // after L
  / [aiuA]

cvc
  = c1:consonant "ap" { return [c1, 'a', 'p'] }
  / c1:start_consonant v:vowel c2:end_consonant? { return [c1, v, c2 || ''] }

start_consonant
  = "ll" & "ah" { return 'll' }
  / curly:"}" { return curly }
  / consonant

end_consonant
  = c:consonant "o" { return c + 'o' }
  / ">o"
  / "b" & "b" { return 'b' }
  / "d" & "d" { return 'd' }
  / "l" & "l" { return 'l' }
  / "m" & "m" { return 'm' }
  / "w" & "w" { return 'w' }

consonant
  = c:[btvjHxd*rzs$SDTZEgfqklmnhwy]