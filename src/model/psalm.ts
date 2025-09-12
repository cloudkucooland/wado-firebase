import type { prayerFromFirestore } from './types';
import prayer from './prayer';
import type { DocumentReference } from 'firebase/firestore';

export default class psalm extends prayer {
	public rubric?: string;
	public antiphon?: DocumentReference; // a reference to another firestore document

	public constructor(obj: prayerFromFirestore) {
		super(obj);
		if (obj.Class) this.class = obj.Class;
		if (obj.Rubric) this.rubric = obj.Rubric;
		if (obj.Antiphon) this.antiphon = obj.Antiphon;
	}

	public toFirebase(): any {
		const out: any = {
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
		if (this.rubric) out.Rubric = this.rubric;
		if (this.antiphon) out.Antiphon = this.antiphon;
		return out;
	}
}
