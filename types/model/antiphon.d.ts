import type { prayerFromFirestore } from './types';
import prayer from './prayer';
export default class antiphon extends prayer {
	private _antiphon?;
	constructor(obj: prayerFromFirestore);
	toFirebase(): {
		Name: string;
		Body: string;
		Author: string;
		Reviewed: boolean;
		License: boolean;
		'Last Editor': string;
		'Last Edited': string;
		Media: string;
		Class: string;
	};
}
