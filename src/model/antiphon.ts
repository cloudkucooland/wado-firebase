import type { prayerFromFirestore } from './types';
import prayer from './prayer';

export default class antiphon extends prayer {
	private _antiphon?: boolean;

	public constructor(obj: prayerFromFirestore) {
		super(obj);
		if (obj.Class) this.class = obj.Class;
	}

	public toFirebase() {
		return {
			Name: this.name,
			Body: this.body,
			Author: this.author,
			Reviewed: this.reviewed,
			License: this.license,
			'Last Editor': this.lastEditor,
			'Last Edited': this.lastEdited,
			Media: this.media,
			Class: this.class
		};
	}
}
