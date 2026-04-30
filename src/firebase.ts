import { initializeApp, registerVersion } from 'firebase/app';
import { getAnalytics, logEvent, setConsent, type Analytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import {
	initializeFirestore,
	getDocsFromCache,
	getDocsFromServer,
	getDocFromCache,
	getDocFromServer,
	persistentLocalCache,
	persistentMultipleTabManager,
	type Query,
	type DocumentReference
} from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyAtVBGVEjDM50VXljFFV-g_xltotL878b8',
	authDomain: 'osl-dailyoffice.firebaseapp.com',
	projectId: 'osl-dailyoffice',
	storageBucket: 'osl-dailyoffice.appspot.com',
	messagingSenderId: '912288843295',
	appId: '1:912288843295:web:2f760d10ee11a579e3372a'
};

const fbapp = initializeApp(firebaseConfig);
registerVersion('WADO', '2.5');

export const auth = getAuth(fbapp);
export const storage = getStorage(fbapp);
export const db = initializeFirestore(fbapp, {
	localCache: persistentLocalCache({
		tabManager: persistentMultipleTabManager()
	}),
	experimentalForceLongPolling: true
});

let analytics: Analytics | undefined;

export function initAnalytics() {
	if (analytics) return;

	try {
		analytics = getAnalytics(fbapp);
		setConsent({
			analytics_storage: 'granted',
			ad_storage: 'denied',
			security_storage: 'granted'
		});
	} catch (err) {
		console.error('Analytics failed to init:', err);
	}
}

export function recordEvent(name: string, details?: object) {
	if (!analytics) return;
	logEvent(analytics, name, details);
}

export function screenView(name: string) {
	recordEvent('screen_view', {
		firebase_screen: name,
		firebase_screen_class: 'WADO'
	});
}

export async function getDocsCacheFirst(q: Query) {
	try {
		const snapshot = await getDocsFromCache(q);
		if (snapshot.empty) return await getDocsFromServer(q);
		return snapshot;
	} catch (err) {
		return await getDocsFromServer(q);
	}
}

export async function getDocCacheFirst(r: DocumentReference) {
	try {
		const doc = await getDocFromCache(r);
		return doc;
	} catch (err) {
		return await getDocFromServer(r);
	}
}
