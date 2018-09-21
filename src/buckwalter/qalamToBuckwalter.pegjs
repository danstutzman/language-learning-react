start
  = "Hayaat" !. { return 'HayAp' }
  / "qanaat" !. { return 'qanAp' }
  / "Salaat" !. { return 'SalAp' }
  / first:first? cvcs:cvc+ {
    return (first !== null ? first : '')
      + cvcs.reduce((accum, cvc) => accum + cvc, '')
  }

first
  = [ae] "l" "-"? &"'" { return "Al" }
  / [ae] "l" "-"? &"l" { return 'All' }
  / [ae] "l" "-"? &"r" { return 'Alr' }
  / [ae] "l" "-"? &"T" { return 'AlT' }
  / [ae] "l" "-"? &[bjmw] { return 'Alo' }
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
  / "llAh" { return 'l`h' }
  / c1:c1 "aah" !. { return c1 + 'Ap' }
  / c1:c1 "aeN" { return c1 + 'YF' }
  / c1:c1 "-"? "aN" { return c1 + 'AF' }
  / c1:c1 "-"? "uN" { return c1 + 'N' }
  / c1:c1 "Ah" { return c1 + '`h' }
  / c1:c1 "ah" !. { return c1 + 'ap' }
  / c1:c1 "-"? "aat" "-"? "iN" !. { return c1 + 'ApK' }
  / c1:c1 "-"? "at" "-"? "iN" !. { return c1 + 'apK' }
  / c1:c1 "-"? "at" "-"? "uN" !. { return c1 + 'apN' }
  / c1:c1 "-"? "at" "-"? "u" !. { return c1 + 'apu' }
  / c1:c1 "u'" { return c1 + 'u&o' }
  / c1:c1 "-"? v:v "-"? c2:c2 "-"? { return c1 + v + c2 }

c1
  = [wy]
  / "tr" // istraatiijiyy
  / c

c2
  = "w" &"w" { return 'w' }
  / "yy" !. { return 'yy' } // istraatiijiyy
  / "y" &"y" { return 'y' }
  / "bb" !. { return 'bobo' }
  / "bc" !. { return 'boEo' }
  / "bl" !. { return 'bolo' } // isTabl
  / "jj" !. { return 'jojo' }
  / "kk" !. { return 'koko' }
  / "ld" !. { return 'lodo' }
  / "ml" !. { return 'molo' }
  / "shq" !. { return 'shoqo' } // dimashq
  / c:c !("-"? [aiouA]) { return c + 'o' }
  / ""

c
  = "c" { return 'E' }
  / "sh" { return '$' }
  / "h" &. { return 'h' }
  / "dh" { return '*' }
  / "gh" { return 'g' }
  / "th" { return 'v' }
  / c:[DHSTZbdfjklmnqrstxz]

v
  = "aa" { return 'A' }
  / "ae" { return 'Y' } // alef maksura
  / "aw" ![aiouA] { return 'awo' }
  / "ay" ![aiouA] { return 'ayo' }
  / "ii" { return 'y' }
  / "uuaa" { return 'wA' } // silent inflectional 'alif Tawiila
  / "uu" { return 'w' }
  / "A" { return '`' }
  / [aiu]