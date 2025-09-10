import { initializeApp, registerVersion } from 'firebase/app';
import { type Analytics, getAnalytics, logEvent, setConsent } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import {
	initializeFirestore,
	getDocsFromCache,
	getDocsFromServer,
	getDocFromCache,
	getDocFromServer,
	Query,
	DocumentReference,
	// terminate,
	// waitForPendingWrites,
	persistentLocalCache,
	persistentMultipleTabManager
} from 'firebase/firestore';
// import { toasts } from 'svelte-toasts';

const firebaseConfig = {
	apiKey: 'AIzaSyAtVBGVEjDM50VXljFFV-g_xltotL878b8',
	authDomain: 'osl-dailyoffice.firebaseapp.com',
	projectId: 'osl-dailyoffice',
	storageBucket: 'osl-dailyoffice.appspot.com',
	messagingSenderId: '912288843295',
	appId: '1:912288843295:web:2f760d10ee11a579e3372a'
};

setConsent({
	ad_storage: 'denied',
	ad_user_data: 'denied',
	ad_personalization: 'denied',
	analytics_storage: 'denied',
	functionality_storage: 'denied',
	personalization_storage: 'denied',
	security_storage: 'denied'
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
registerVersion('WADO', '2.1');
export const auth = getAuth(app);
export let db = initializeFirestore(app, {
	localCache: persistentLocalCache({
		useFetchStreams: true,
		tabManager: persistentMultipleTabManager()
	})
});
export const storage = getStorage();
let analytics: Analytics;
let _analyticsRunning: boolean = false;

export function initAnalytics() {
	if (_analyticsRunning) return;
	try {
		analytics = getAnalytics(app);
	} catch (err) {
		console.log(err);
	}
	_analyticsRunning = true;
	setConsent({
		ad_storage: 'granted',
		ad_user_data: 'granted',
		ad_personalization: 'granted',
		analytics_storage: 'granted',
		functionality_storage: 'granted',
		personalization_storage: 'granted',
		security_storage: 'granted'
	});
}

export function recordEvent(name: string, details?: object) {
	if (!_analyticsRunning || !name) return;
	logEvent(analytics, name, details);
}

export function screenView(name: string) {
	recordEvent('screen_view', { firebase_screen: name });
}

export async function getDocsCacheFirst(q: Query) {
	try {
		const res = await getDocsFromCache(q);
		if (res.empty) {
			throw new Error('query cache miss');
		}
		console.debug('query cache hit');
		return res;
	} catch (err) {
		console.debug('query cache miss');
		const res = await getDocsFromServer(q);
		return res;
	}
}

export async function getDocCacheFirst(r: DocumentReference) {
	try {
		const res = await getDocFromCache(r);
		console.debug('doc cache hit');
		return res;
	} catch (err) {
		console.debug('doc cache miss');
		const res = await getDocFromServer(r);
		return res;
	}
}
