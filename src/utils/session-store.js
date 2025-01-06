import { generateId } from '../models/db.js'

export class SessionStore {
  constructor() {
    this.store = new Map()
  }

  create() {
    const sessionId = generateId()
    this.store.set(sessionId, { createdAt: Date.now() })
    return sessionId
  }

  get(sessionId) {
    return this.store.get(sessionId)
  }

  set(sessionId, data) {
    this.store.set(sessionId, data)
  }

  delete(sessionId) {
    this.store.delete(sessionId)
  }

  list() {
    return Array.from(this.store.entries())
  }
}

// Singleton instance of the session store
export const sessionStore = new SessionStore()
