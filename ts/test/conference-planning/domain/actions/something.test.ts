import type {FindsSessions, Session} from "../../../../src/conference-planning/domain/session.types.js"
import {expect} from "chai"
import {looksLikeASession} from "../../../../src/conference-planning/domain/session-type-assertions.js"

interface SessionEvent<T extends string> {
  type: T
}

class SessionProjection implements FindsSessions {
  private hashMap: Record<string, Partial<Session>>
  constructor( ) {
    this.hashMap = {}
  }

  findById(id: string): Promise<Session> {
    const session = this.hashMap[id]

    if( session && looksLikeASession(session)) {
      return Promise.resolve(session)
    }
    throw new Error('Not found')
  }

  findAll(): Promise<Session[]> {
    throw new Error('Not implemented')
  }

  apply(event: SessionEvent<string>): SessionProjection {
    if (event.type === 'session-drafted') {
      // @ts-ignore
      this.hashMap[event.sessionId] = { id: event.sessionId }
    } else if (event.type === 'session-proposed') {
      // @ts-ignore
      const session = {...this.hashMap[event.sessionId]}
      // @ts-ignore
      session.title = event.title
      // @ts-ignore
      this.hashMap[event.sessionId] = session
    } else if (event.type === 'session-accepted') {
    }
    return this
  }
}

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
