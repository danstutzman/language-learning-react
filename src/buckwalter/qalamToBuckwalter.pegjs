start
  = "Hayaat" !. { return 'HayAp' }
  / "qanaat" !. { return 'qanAp' }
  / "Salaat" !. { return 'SalAp' }
  / prefix:prefix? first:first? cvcs:cvc* {
    return (prefix !== null ? prefix : '')
      + (first !== null ? first : '')
      + cvcs.reduce((accum, cvc) => accum + cvc, '')
  }

prefix
  = "bi-" { return 'bi' }
  / "fa-" { return 'fa' }
  / "wa-" { return 'wa' }

first
  = [ae] "l" "-"? &"'" { return "Al" }
  / [ae] "l" "-"? &"l" { return 'All' }
  / [ae] "l" "-"? &"r" { return 'Alr' }
  / [ae] "l" "-"? &"sh" { return 'Al$' }
  / [ae] "l" "-"? &"T" { return 'AlT' }
  / [ae] "l" "-"? &[bjkmw] { return 'Alo' }
  / "e" !"l" c2:c2 "-"? { return 'A' + c2 }
  / "i" c2:c2 { return 'Ai' + c2 }
  / "'i" c2:c2 { return '<i' + c2 }
  / "'u" c2:c2 { return '>u' + c2 }

cvc
  = "'aa" c2:c2 { return '|' + c2 }
  / "'ah" !. { return '>ap' }
  / "'a" c2:c2 { return '>a' + c2 }
  / "'ii" c2:c2 { return '\u007dy' + c2 }
  / "'i" c2:c2 { return '\u007di' + c2 }
  / "'u" c2:c2 { return '>' + c2 }
  / "llAh" !. { return 'l`h' }
  / "llA" c2:c2 { return 'l`' + c2 }
  / c1:c1 "aah" !. { return c1 + 'Ap' }
  / c1:c1 "aeN" { return c1 + 'YF' }
  / c1:c1 "-"? "aN" { return c1 + 'AF' }
  / c1:c1 "-"? "uN" { return c1 + 'N' }
  / c1:c1 "Ah" { return c1 + '`h' }
  / c1:c1 "-"? "aah" "-"? "iN" !. { return c1 + 'ApK' }
  / c1:c1 "-"? "ah" !. { return c1 + 'ap' }
  / c1:c1 "-"? "ah" "-"? v2:[aiu] !. { return c1 + 'ap' + v2 }
  / c1:c1 "-"? "ah" "-"? "iN" !. { return c1 + 'apK' }
  / c1:c1 "-"? "ah" "-"? "uN" !. { return c1 + 'apN' }
  / c1:c1 "a'" !. { return c1 + 'a>o' }
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
  / "bn" !. { return 'bono' } // ibn
  / "jj" !. { return 'jojo' }
  / "kk" !. { return 'koko' }
  / "ld" !. { return 'lodo' }
  / "ml" !. { return 'molo' }
  / "sm" !. { return 'somo' } // ism
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