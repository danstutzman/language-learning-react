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
  / [ae] "l" "-"? &[bjkmqw] { return 'Alo' }
  / "e" !"l" c2:c2 "-"? { return 'A' + c2 }
  / "i" c2:c2 { return 'Ai' + c2 }
  / "'ay" { return '>ayo' }
  / "'ii" { return '<iy' }
  / "'i" c2:c2 { return '<i' + c2 }
  / "'u" c2:c2 { return '>u' + c2 }

cvc
  = "llAh" !. { return 'l`h' }
  / "llA" c2:c2 { return 'l`' + c2 }
  / "'aah" !"h" { return '|p' }
  / "'aa" c2:c2 { return '|' + c2 }
  / "'a" c2:c2 { return '>a' + c2 }
  / "'u" c2:c2 { return '>' + c2 }

  / c1:c1 "a'aa" c2:c2 { return c1 + 'a|' + c2 }
  / c1:c1 "a'ah" !. { return c1 + 'a>ap' }
  / c1:c1 "a'" "-"? "a" c2:c2 { return c1 + 'a>a' + c2 }
  / c1:c1 "a'" "-"? "ii" c2:c2 { return c1 + 'a\u007dy' + c2 }
  / c1:c1 "a'" "-"? "uu" !. { return c1 + 'a&wA' }
  / c1:c1 "a'" "-"? c2:c2 { return c1 + 'a>o' + c2 }
  / c1:c1 "aah" !. { return c1 + 'Ap' }
  / c1:c1 "-"? "aah" "-"? "iN" !. { return c1 + 'ApK' }
  / c1:c1 "aa'aa" c2:c2 { return c1 + "A'A" + c2 }
  / c1:c1 "aa'" "-"? "a" c2:c2 "-"? { return c1 + "A'a" + c2 }
  / c1:c1 "aa'i" !. { return c1 + "A'i" }
  / c1:c1 "aa'ii" c2:c2 { return c1 + "A\u007dy" + c2 }
  / c1:c1 "aa'" "-"? "i" c2:c2 "-"? { return c1 + "A\u007di" + c2 }
  / c1:c1 "aa'" "-"? v2:[u]? !. { return c1 + "A'" + (v2 || '') }
  / c1:c1 "aa'" "-"? "u" c2:c2 "-"? { return c1 + "A&u" + c2 }
  / c1:c1 "-"? "aN" { return c1 + 'AF' }
  / c1:c1 "aeN" { return c1 + 'YF' }
  / c1:c1 "-"? "ah" !. { return c1 + 'ap' }
  / c1:c1 "-"? "ah" "-"? v2:[aiu] !. { return c1 + 'ap' + v2 }
  / c1:c1 "-"? "ah" "-"? "iN" !. { return c1 + 'apK' }
  / c1:c1 "-"? "ah" "-"? "uN" !. { return c1 + 'apN' }
  / c1:c1 "aw'i" c2:c2 { return c1 + 'awo\u007di' + c2 }
  / c1:c1 "ay'ah" !. { return c1 + 'ayo\u007dap' }
  / c1:c1 "ay'a" { return c1 + 'ayo\u007da' }

  / c1:c1 "Ah" { return c1 + '`h' }
  / c1:c1 "A'u" c2:c2 { return c1 + '`&' + c2 }

  / c1:c1 "i'" c2:c2 { return c1 + 'i\u007d' + c2 }
  / c1:c1 "ii'" !. { return c1 + "y'" }

  / c1:c1 "u'i" c2:c2 { return c1 + 'u\u007di' + c2 }
  / c1:c1 "u'aa" c2:c2 { return c1 + 'u&A' + c2 }
  / c1:c1 "u'a" c2:c2 { return c1 + 'u&a' + c2 }
  / c1:c1 "u'uu" c2:c2 { return c1 + 'u&w' + c2 }
  / c1:c1 "-"? "uN" { return c1 + 'N' }
  / c1:c1 "uu'ah" !. { return c1 + "w'ap" }
  / c1:c1 "uu'a" c2:c2 { return c1 + "w'a" + c2 }
  / c1:c1 "u'" { return c1 + 'u&o' }
  / c1:c1 "uu'" !. { return c1 + "w'" }

  / c1:c1 "-"? v:v "-"? c2:c2 "-"? { return c1 + v + c2 }

c1
  = [wy]
  / "tr" // istraatiijiyy
  / c

c2
  = "w" &"w" { return 'w' }
  / "yy" !. { return 'yy' } // istraatiijiyy
  / "y" &"y" { return 'y' }
  / c:[bz] "'" !. { return c + "o'" } // juz', cib'
  / "bb" !. { return 'bobo' }
  / "bc" !. { return 'boEo' }
  / "bl" !. { return 'bolo' } // isTabl
  / "bn" !. { return 'bono' } // ibn
  / "jj" !. { return 'jojo' }
  / "kk" !. { return 'koko' }
  / "ld" !. { return 'lodo' }
  / "ml" !. { return 'molo' }
  / "mm" !. { return 'momo' } // 'umm
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
  / "ay'" !. { return "ayo'" }
  / "ay" ![aiouA] { return 'ayo' }
  / "ii" { return 'y' }
  / "uuaa" { return 'wA' } // silent inflectional 'alif Tawiila
  / "uu" { return 'w' }
  / "A" { return '`' }
  / [aiu]