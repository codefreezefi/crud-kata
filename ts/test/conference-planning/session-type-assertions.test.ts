import {expect} from "chai"
import {looksLikeASession} from "../../src/domain/session-type-assertions.js"

describe('SessionTypeAssertions', () => {
  it('not if totally wrong type', () => {
    expect(looksLikeASession("string")).to.be.false
    expect(looksLikeASession(null)).to.be.false
    expect(looksLikeASession({})).to.be.false
    expect(looksLikeASession({title: "name"})).to.be.false
  })

  it('Looks correct', () => {
    expect(looksLikeASession({title: "name", id: 'any id'})).to.be.true
  })
})
