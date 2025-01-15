import type {Session, SessionRepository} from "../domain/session.types.js";


export class InMemorySessionRepository implements SessionRepository {
    private sessions: Record<string, Session> = {};

    addSession(session: Session): Promise<void> {
        this.sessions[session.id] = session;
        return Promise.resolve();
    }

    findById(id: string): Promise<Session> {
        const s = this.sessions[id];
        if (s) {
            return Promise.resolve(s);
        }
        throw new Error('not found')
    }

    findAll(): Promise<Session[]> {
        return Promise.resolve(Object.values(this.sessions))
    }
}