import type { prayerFromFirestore } from './types';
import prayer from './prayer';

export default class hymn extends prayer {
	public hymntune: string | null;
	public hymnmeter: string | null;

	public constructor(obj: prayerFromFirestore) {
		super(obj);
		this.hymntune = obj['Hymn Tune'] || null;
		this.hymnmeter = obj['Hymn Meter'] || null;
	}

	public override toFirebase(): prayerFromFirestore {
		const out = super.toFirebase();
		if (this.hymnmeter) out['Hymn Meter'] = this.hymnmeter;
		if (this.hymntune) out['Hymn Tune'] = this.hymntune;
		return out;
	}
}
