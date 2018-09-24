// @flow
import addContextToAtoms from './addContextToAtoms.js'

const default1 = {
  beginPunctuation: '',
  endPunctuation: '',
  endsMorpheme: false,
  endsWord: false,
}

it('adds context to atoms', () => {
  const bada1 = { ...default1, atom:'b' }
  const bada2 = { ...default1, atom:'a' }
  const bada3 = { ...default1, atom:'d' }
  const bada4 = { ...default1, atom:'a', endsMorpheme: true, endsWord: true }
  expect(addContextToAtoms([bada1, bada2, bada3, bada4])).toEqual([
    { ...bada1,left2:null,left:null,right:'a', right2:'d', endsSyllable:false },
    { ...bada2,left2:null,left:'b', right:'d', right2:'a', endsSyllable:true },
    { ...bada3,left2:'b', left:'a', right:'a', right2:null,endsSyllable:false },
    { ...bada4,left2:'a', left:'d', right:null,right2:null,endsSyllable:true },
  ])
})
