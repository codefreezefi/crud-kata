import { expect } from 'chai'
import { type RespondsToAMessage, theMethodUnderTest } from '../../src/example.js'

describe('using custom stubs', () => {
  it('does magic', () => {
    // With typescript, we can easily make things to look like the Interface/Shape/Role
    const respondsToMessage: RespondsToAMessage = {
      respondsToAMessage: () => '42',
    }
    const result = theMethodUnderTest(respondsToMessage, 0)

    expect(result).to.eql('42')
  })

  it('can be provided nice defaults', () => {
    // let's create a nice little helper (look below)
    // try commenting the overrides to see the test break
    const respondsToMessage = mockWith({
      respondsToAMessage: () => '42',
    })
    const result = theMethodUnderTest(respondsToMessage, 0)

    expect(result).to.eql('42')
  })
})

const mockWith: (x: Partial<RespondsToAMessage>) => RespondsToAMessage = overrides => {
  const defaultValues: RespondsToAMessage = {
    respondsToAMessage: () => {
      throw new Error("unexpected call to 'respondsToAMessage'")
    },
  }
  return { ...defaultValues, ...overrides }
}
