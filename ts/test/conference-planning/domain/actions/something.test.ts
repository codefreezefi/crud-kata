import type {Session} from "../../../../src/conference-planning/domain/session.types.js"
import {expect} from "chai"
import {SessionProjection} from "../../../../src/conference-planning/domain/actions/session-projection.js"

describe('Session Projection', () => {
  const aSessionId = 'an-id-that-looks-like-123'
  const sessionDrafted = {sessionId: aSessionId, type: 'session-drafted'}
  const sessionProposed = {sessionId: aSessionId, type: 'session-proposed', title: 'title of a session'}
  const sessionAccepted = {sessionId: aSessionId, type: 'session-accepted'}

  it('does not find a session that do not exist', async () => {
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

  it('finds', async () => {
    const sessionProjection = new SessionProjection()
    sessionProjection
      .apply(sessionDrafted)
      .apply(sessionProposed)
      .apply(sessionAccepted)

    const result = await sessionProjection.findById(aSessionId)

    const expected: Session = {id: aSessionId, title: "title of a session"}
    expect(result).to.eql(expected)
  })
})
