import type { prayerFromFirestore } from './types';
import prayer from './prayer';

export default class commemoration extends prayer {
	public morningcollect: string | null;
	public eveningcollect: string | null;

	public constructor(obj: prayerFromFirestore) {
		super(obj);
		this.morningcollect = obj.MorningCollect || null;
		this.eveningcollect = obj.EveningCollect || null;
	}

	public override toFirebase(): prayerFromFirestore {
		const out = super.toFirebase();
		if (this.morningcollect) out.MorningCollect = this.morningcollect;
		if (this.eveningcollect) out.EveningCollect = this.eveningcollect;
		return out;
	}
}
