import { expect } from 'chai'
import { Example } from '../src/example.js'

describe('example', () => {
  it('fails', () => {
    expect(new Example().todo()).to.eql('This is example!')
  })
})
