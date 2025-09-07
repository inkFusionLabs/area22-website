import { NextResponse } from 'next/server';

export const config = {
	matcher: [
		'/music-request',
		'/music-request.html',
		'/unlock',
		'/lock'
	]
};

export default function middleware(req) {
	const url = new URL(req.url);
	const pathname = url.pathname;

	// Utility: unlock via /unlock?key=PIN or ?pin=PIN
	if (pathname === '/unlock') {
		const key = url.searchParams.get('key') || url.searchParams.get('pin');
		const expected = process.env.REQUEST_UNLOCK_KEY; // optional

		if (expected && key !== expected) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const res = NextResponse.redirect(new URL('/music-request.html', req.url));
		res.cookies.set('req_unlocked', '1', {
			path: '/',
			httpOnly: false,
			secure: true,
			sameSite: 'Lax',
			maxAge: 60 * 60 * 8 // 8 hours
		});
		return res;
	}

	// Utility: clear cookie and redirect to maintenance page
	if (pathname === '/lock') {
		const res = NextResponse.redirect(new URL('/maintenance.html', req.url));
		res.cookies.set('req_unlocked', '0', { path: '/', maxAge: 0 });
		return res;
	}

	// Protect the request page
	if (pathname === '/music-request' || pathname === '/music-request.html') {
		const unlocked = req.cookies.get('req_unlocked');
		if (unlocked && unlocked.value === '1') {
			return NextResponse.next();
		}
		return NextResponse.redirect(new URL('/maintenance.html', req.url));
	}

	return NextResponse.next();
}

