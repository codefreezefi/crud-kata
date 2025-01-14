import { expect } from 'chai'
import { type RespondsToAMessage, theMethodUnderTest } from '../../src/example.js'

class TestableClass implements RespondsToAMessage {
  constructor(private readonly val: number) {}

  respondsToAMessage(/* _: number */) {
    return `${this.val}`
  }
}

describe('using testable classes', () => {
  it('can be overridden', () => {
    const result = theMethodUnderTest(new TestableClass(22), 0)
    expect(result).to.eql('22')
  })
})
