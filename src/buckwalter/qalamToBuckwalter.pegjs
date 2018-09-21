start
  = first:first? cvcs:cvc+ {
    return (first !== null ? first : '')
      + cvcs.reduce((accum, cvc) => accum + cvc, '')
  }

first
  = "'al" "-"? { return 'Al' }
  / "el" "-"? &"'a" { return "Al" }
  / "el" "-"? &"r" { return 'Alr' }
  / "el" "-"? &"T" { return 'AlT' }
  / "el" "-"? &[bjm] { return 'Alo' }
  / "e" !"l" c2:c2 "-"? { return 'A' + c2 }
  / "i" c2:c2 { return 'Ai' + c2 }
  / "'i" c2:c2 { return '<i' + c2 }
  / "'u" c2:c2 { return '>u' + c2 }

cvc
  = "'aa" c2:c2 { return '|' + c2 }
  / "'a" c2:c2 { return '>a' + c2 }
  / "'a" { return '>a' }
  / "'i" c2:c2 { return '\u007di' + c2 }
  / "'u" c2:c2 { return '>' + c2 }
  / "llAh" { return 'll`h' }
  / c1:c1 "aeN" { return c1 + 'YF' }
  / c1:c1 "-"? "aN" { return c1 + 'AF' }
  / c1:c1 "Ah" { return c1 + '`h' }
  / c1:c1 "ah" !. { return c1 + 'ap' }
  / c1:c1 "-"? "at" "-"? "u" !. { return c1 + 'apu' }
  / c1:c1 "u'" { return c1 + 'u&o' }
  / c1:c1 "-"? v:v "-"? c2:c2 "-"? { return c1 + v + c2 }

c1
  = [wy]
  / c

c2
  = "w" &"w" { return 'w' }
  / "y" &"y" { return 'y' }
  / "bc" !. { return 'boEo' }
  / "ld" !. { return 'lodo' }
  / "ml" !. { return 'molo' }
  / c:c !("-"? [aiuA]) { return c + 'o' }
  / ""

c
  = "c" { return 'E' }
  / "sh" { return '$' }
  / "h" &. { return 'h' }
  / "dh" { return '*' }
  / "gh" { return 'g' }
  / "th" { return 'v' }
  / c:[DHSTZbdfjklmnqrstx]

v
  = "aa" { return 'A' }
  / "ae" { return 'Y' } // alef maksura
  / "aw" ![a] { return 'awo' }
  / "ay" { return 'ayo' }
  / "ii" { return 'y' }
  / "uuaa" { return 'wA' } // silent inflectional 'alif Tawiila
  / "uu" { return 'w' }
  / "A" { return '`' }
  / [aiu]