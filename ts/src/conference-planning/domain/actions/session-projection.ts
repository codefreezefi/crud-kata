import type {FindsSessions, Session} from "../session.types.js"
import {looksLikeASession} from "../session-type-assertions.js"
import type {SessionEvent} from "./session-event.js"

export class SessionProjection implements FindsSessions {
  private hashMap: Record<string, Partial<Session>>

  constructor() {
    this.hashMap = {}
  }

  findById(id: string): Promise<Session> {
    const session = this.hashMap[id]

    if (session && looksLikeASession(session)) {
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
      this.hashMap[event.sessionId] = {id: event.sessionId}
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
