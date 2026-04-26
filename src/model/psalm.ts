import type { prayerFromFirestore } from './types';
import prayer from './prayer';
import type { DocumentReference } from 'firebase/firestore';

export default class psalm extends prayer {
	public rubric?: string;
	public antiphon?: DocumentReference; // a reference to another firestore document

	public constructor(obj: prayerFromFirestore) {
		super(obj);
		this.rubric = obj.Rubric;
		this.antiphon = obj.Antiphon;
	}

	public override toFirebase(): prayerFromFirestore {
		const out = super.toFirebase();
		if (this.rubric) out.Rubric = this.rubric;
		if (this.antiphon) out.Antiphon = this.antiphon;
		return out;
	}
}
