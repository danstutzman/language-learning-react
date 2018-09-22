start
  = only:only !. { return only }
  / first:first? cvvs:cvv* { return (first ? first : "") + cvvs.join("") }

only
  = "ato" { return "at" }
  / [aiu] // case endings
  / "yna" { return "iina" }
  / "y" { return "ii" }
  / "K" { return "iN" }
  / "N" { return "uN" }
  / "AF" { return "aN" }
  / "wA" { return "uuaa" } // 3rd-MASC-past: aa isn't actually pronounced
  / "wna" { return "uuna" }
  / "w" { return "uu" }
  / "{l" c:[T] { return "el" + c }

first
  = "{l" "o"? { return "el" }
  / "{" { return "e" }

cvv
  = "$" vv:vv { return "sh" + vv }
  / "*" vv:vv { return "dh" + vv }
  / "g" vv:vv { return "gh" + vv }
  / "v" vv:vv { return "th" + vv }
  / "<" vv:vv { return "'" + vv }
  / ">o" { return "'" }
  / ">" !. { return "'" }
  / ">" vv:vv { return "'" + (vv ? vv : "u") }
  / "|" { return "'aa" }
  / "}" vv:vv { return "'" + vv }
  / "'" vv:vv { return "'" + vv }
  / "&" vv:vv { return "'" + vv }
  / "E" vv:vv { return "c" + vv }
  / "p" vv:vv t:tanween { return "h" + vv + t }
  / "w" "A" t:tanween { return "waa" + t }
  / "w" "Y" t:tanween { return "wae" + t }
  / "w" "o" { return "w" }
  / "w" "y" { return "wii" }
  / "w" v:[Yaiu]? { return "w" + (v ? v : "") }
  / "h" vv:vv { return "h" + vv }
  / "yy" vv:vv { return "yy" + vv }
  / c:c vv:vv { return c + vv }

c
  = [DHSTZbdfjklmnqrstxyz]

vv
  = "o" { return "" }
  / "wA" { return "uuaa" } // silent inflectional 'alif Tawiila
  / "w" ![a] { return "uu" }
  / "AF" { return "aaN" }
  / "A" { return "aa" }
  / "K" { return "iN" }
  / "y" { return "ii" }
  / "Y" t:tanween { return "ae" + t }
  / "`&" { return "A'u" }
  / "`" { return "A" }
  / "iy" "o"? ![Ay] { return "ii" }
  / [aiu]
  / "" { return "" }

tanween
  = "F" { return "N" }
  / "N" { return "N" }
  / ""