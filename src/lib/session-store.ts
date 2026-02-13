/**
 * Simple in-memory session store to track unique users
 */
class SessionStore {
	private sessions: Set<string> = new Set();
	private sessionTimestamps: Map<string, number> = new Map();
	private readonly SESSION_TIMEOUT = 60 * 60 * 1000 * 12; // 12 hours

	/**
	 * Add or update a session
	 */
	addSession(sessionId: string): void {
		this.sessions.add(sessionId);
		this.sessionTimestamps.set(sessionId, Date.now());
		this.cleanupExpiredSessions();
	}

	/**
	 * Get the count of active sessions
	 */
	getSessionCount(): number {
		this.cleanupExpiredSessions();
		return this.sessions.size + 1;
	}

	/**
	 * Remove expired sessions (inactive for more than SESSION_TIMEOUT)
	 */
	private cleanupExpiredSessions(): void {
		const now = Date.now();
		const expiredSessions: string[] = [];

		for (const [sessionId, timestamp] of this.sessionTimestamps.entries()) {
			if (now - timestamp > this.SESSION_TIMEOUT) {
				expiredSessions.push(sessionId);
			}
		}

		for (const sessionId of expiredSessions) {
			this.sessions.delete(sessionId);
			this.sessionTimestamps.delete(sessionId);
		}
	}

	/**
	 * Check if a session exists
	 */
	hasSession(sessionId: string): boolean {
		return this.sessions.has(sessionId);
	}
}

export const sessionStore = new SessionStore();
