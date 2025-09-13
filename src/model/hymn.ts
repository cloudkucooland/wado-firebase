import type { prayerFromFirestore } from './types';
import prayer from './prayer';

export default class hymn extends prayer {
	public hymntune: string | null;
	public hymnmeter: string | null;

	public constructor(obj: prayerFromFirestore) {
		super(obj);
		this.hymntune = null;
		this.hymnmeter = null;
		if (obj['Hymn Tune']) this.hymntune = obj['Hymn Tune'];
		if (obj['Hymn Meter']) this.hymnmeter = obj['Hymn Meter'];
		if (obj.Class) this.class = obj.Class;
	}

	public toFirebase(): any {
		return {
			Name: this.name,
			Body: this.body,
			Reviewed: this.reviewed,
			License: this.license,
			Author: this.author,
			'Last Editor': this.lastEditor,
			'Last Edited': this.lastEdited,
			'Hymn Meter': this.hymnmeter,
			'Hymn Tune': this.hymntune,
			Media: this.media,
			Class: this.class
		};
	}
}
