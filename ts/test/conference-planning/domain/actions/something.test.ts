import type {FindsSessions, Session} from "../../../../src/conference-planning/domain/session.types.js"
import {expect} from "chai"

class SessionProjection implements FindsSessions {
  findById(_id: string): Promise<Session> {
    throw new Error('Not found')
  }

  findAll(): Promise<Session[]> {
    throw new Error('Not implemented')
  }
}

describe('Session Projection', () => {

  it('does magic', async () => {
    const sessionProjection = new SessionProjection()

    const fn = () => sessionProjection.findById('non-existing')
    try {
      await fn()
      throw new Error('Should have been thrown')
    } catch (err) {
      // @ts-ignore
      expect(err.message).to.equal('Not found')
    }
  })
})
