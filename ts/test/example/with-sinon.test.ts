import { expect, use } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

use(sinonChai)

import {
  type CollaboratorWithSideEffect,
  ConcreteClassThatHasASideEffect,
  ConcreteClassThatResponds,
  type RespondsToAMessage,
  secondMethodUndertest,
  theMethodUnderTest,
} from '../../src/example.js'

describe('using sinon', () => {
  describe('using stubs', () => {
    it('with a custom-override with sinon', () => {
      // with sinon.stub(), we stub a single method
      const message: sinon.SinonStub = sinon.stub()
      const collaborator: RespondsToAMessage = {
        // ..that we inject to the 'shape'
        respondsToAMessage: message,
      }
      // and we prepare the stub to return a canned value
      message.returns('4321')

      const result = theMethodUnderTest(collaborator, 0)

      expect(result).to.eql('4321')
    })

    it('with a stub an interface', () => {
      // stub a concrete implementation - does this partial mock? That would be scary.
      const collaborator = sinon.createStubInstance(ConcreteClassThatResponds, {
        respondsToAMessage: 'A String',
      })

      const result = theMethodUnderTest(collaborator, 0)

      expect(result).to.eql('A String')
    })
  })

  describe('using mocks/spies', () => {
    it('ref', () => {
      class MyApiClass {
        method( _: number ) { // eslint-disable-line typescript-eslint/no-unused-vars
          /* no-op */
        }
      }

      const x = new MyApiClass()
      const mockingAnInstance = sinon.mock(x)

      // What happens here is a partial mocking - it only mocks the function 'method' all the rest are the original
      // concrete implementation. This is a huge smell.
      mockingAnInstance.expects('method').withArgs(3).atLeast(1)

      x.method(3)

      // you actually don't need to verify - that's part of the mocking framework
      // mockingAnInstance.verify()
    })

    it('mocks - this is only for reference, I personally never do this.', () => {
      // I never use mocks - I also learned that sinon mocks is too powerful.
      const instance = new ConcreteClassThatHasASideEffect()
      const sinonMock = sinon.mock(instance)

      // this is a smell, not really typesafe - using a string
      sinonMock.expects('thisHasASideEffect').withArgs(3).atLeast(1)

      // @ts-ignore - as you see, not really nicely working
      secondMethodUndertest(sinonMock.object, 3)
    })

    it('using a spy', () => {
      // This is my favorite strategy for verifying that message is being sent
      const collaborator = mockWith({ thisHasASideEffect: sinon.spy() })

      secondMethodUndertest(collaborator, 3)

      expect(collaborator.thisHasASideEffect).to.have.been.calledOnceWith(3)
    })
  })
})

const mockWith: (x: Partial<CollaboratorWithSideEffect>) => CollaboratorWithSideEffect = overrides => {
  const defaultValues: CollaboratorWithSideEffect = {
    thisHasASideEffect: () => {
      throw new Error("unexpected call to 'respondsToAMessage'")
    },
  }
  return { ...defaultValues, ...overrides }
}
