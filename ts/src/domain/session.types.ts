export interface Session {
    title: string;
    id: string;
}

export interface SessionRepository {
    addSession: (session: Session) => Promise<void>;

    findById(id: string): Promise<Session>;
    findAll(): Promise<Session[]>;
}

export interface CreatesSessions {
    createASession: (session: Session) => Promise<void>;
}

export interface FindsSessions {
    findById: (id: string) => Promise<Session>;
    findAll: () => Promise<Session[]>;
}