import { sessionStore } from '$lib/session-store';
import type { Handle } from '@sveltejs/kit';
import { randomBytes } from 'crypto';

function generateSessionId(): string {
	return randomBytes(32).toString('hex');
}

export const handle: Handle = async ({ event, resolve }) => {
	let sessionId = event.cookies.get('session_id');

	if (!sessionId || !sessionStore.hasSession(sessionId)) {
		sessionId = generateSessionId();
		event.cookies.set('session_id', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 12 // 12 hours
		});
		console.log('Users: ' + sessionStore.getSessionCount());
	}

	sessionStore.addSession(sessionId);

	event.locals.sessionCount = sessionStore.getSessionCount();

	return resolve(event);
};
