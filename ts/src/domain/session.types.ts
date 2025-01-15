export interface Session {
    title: string;
    id: string;
}

export interface SessionRepository {
    addSession: (session: Session) => Promise<void>;
}

export interface CreatesSessions {
    createASession: (session: Session) => Promise<void>;
}
