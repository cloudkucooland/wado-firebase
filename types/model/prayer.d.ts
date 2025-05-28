import type { prayerFromFirestore } from './types';
export default class prayer {
	name: string;
	body: string;
	reviewed: boolean;
	license: boolean;
	lastEditor: string;
	lastEdited: string;
	author: string;
	media: string;
	class: string;
	private _id;
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
	get shortname(): string;
	set id(n: string);
	get id(): string;
}
