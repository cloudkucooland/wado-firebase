import type { prayerFromFirestore } from './types';
import prayer from './prayer';
export default class commemoration extends prayer {
	morningcollect: string;
	eveningcollect: string;
	constructor(obj: prayerFromFirestore);
	toFirebase(): any;
}
