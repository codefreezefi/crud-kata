import type {Session} from "./session.types.js";

export function looksLikeASession(x: unknown): x is Session {
    return x !== null &&
        typeof x === "object" &&
        "title" in x &&
        "id" in x
}