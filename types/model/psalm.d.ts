import type { prayerFromFirestore } from './types';
import prayer from './prayer';
import type { DocumentReference } from 'firebase/firestore';
export default class psalm extends prayer {
	rubric?: string;
	antiphon?: DocumentReference;
	constructor(obj: prayerFromFirestore);
	toFirebase(): any;
}
