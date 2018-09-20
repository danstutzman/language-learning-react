start
  = first:first? cvcs:cvc+ ending:ending? {
    return (first !== null ? first : '')
      + cvcs.reduce((accum, cvc) => accum + cvc, '')
      + (ending !== null ? ending : '')
  }

first
  = "'i" c2:c2 { return '<i' + c2 }
  / "'u" c2:c2 { return '>u' + c2 }

ending
  = c
  / "h" { return 'p' }

cvc
  = "'aa" c2:c2 { return '|' + c2 }
  / "'a" c2:c2 { return '>a' + c2 }
  / "'a" { return '>a' }
  / "'i" c2:c2 { return '\u007di' + c2 }
  / "w" v:v c2:c2 { return 'w' + v + c2 }
  / c1:c v:v c2:c2 { return c1 + v + c2 }

c2
  = c:c !. { return c }
  / c:c ![ai] { return c + 'o' }
  / ""

c
  = "c" { return 'E' }
  / c:[HZbdjklmnqrsx]

v
  = "aa" { return 'A' }
  / "uu" { return 'w' }
  / [ai]