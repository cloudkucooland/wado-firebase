import { auth, db } from '../firebase';
import {
	doc,
	setDoc,
	getDoc,
	query,
	collection,
	where,
	orderBy,
	getDocs
} from 'firebase/firestore';

export default class user {
	public displayName: string;
	public longestStreak: string;
	public consecutiveDays: string;
	public lastDay: string;
	public lastActivity: Date;
	private _userID?: string;
	private _isEditor?: boolean;
	private _isMediaManager?: boolean;
	private _loggedIn?: boolean;

	constructor(obj: any) {
		this.displayName = obj.displayName ? obj.displayName : 'Anon';
		this.longestStreak = obj.longestStreak ? obj.longestStreak : '0';
		this.consecutiveDays = obj.consecutiveDays ? obj.consecutiveDays : '0';
		this.lastDay = obj.lastDay ? obj.lastDay : '2020-01-01';
		const la = obj.lastActivity ? obj.lastActivity : '2023-01-01';
		this.lastActivity = new Date(la);
		this._isEditor = false;
		this._isMediaManager = false;
		this._loggedIn = false;
	}

	public toString(): string {
		return this.displayName;
	}

	public toJSON(): any {
		const o = { ...this };
		if (o._userID) delete o._userID;
		// @ts-ignore
		o.lastActivity = this.lastActivity.toJSON(); // necessary, or is this automatic?
		delete o._isEditor;
		delete o._isMediaManager;
		delete o._loggedIn;
		return o;
	}

	// load from firestore
	public static async me(): Promise<user> {
		if (!auth.currentUser) {
			console.log("not logged in, returning empty 'me'");
			return new user({ lastActivity: new Date('2023-01-01') });
		}

		const ref = doc(db, 'user', auth.currentUser.uid);
		try {
			const loaded = await getDoc(ref);
			if (loaded.exists()) {
				const u = new user(loaded.data());
				u._userID = auth.currentUser.uid;
				const res = await auth.currentUser.getIdTokenResult();
				u._isEditor = res.claims.role == 'Editor';
				u._isMediaManager = res.claims.role == 'Media';
				u._loggedIn = true;
				return u;
			}
		} catch (err: any) {
			console.log(err);
		}

		// write something back, so future reads succeed
		const u = new user({ lastActivity: new Date('2023-01-01') });
		u._userID = auth.currentUser.uid;
		await setDoc(ref, u.toJSON(), { merge: true });
		return u;
	}

	// update firestore
	public async setDisplayName(newname: string): Promise<void> {
		if (!this._userID) return;
		const ref = doc(db, 'user', this._userID);

		this.displayName = newname;
		try {
			await setDoc(ref, this.toJSON(), { merge: true });
		} catch (err: any) {
			console.log(err);
		}
	}

	// report that there has been activity
	public async logAction(): Promise<void> {
		if (!this._userID) return;
		const ref = doc(db, 'user', this._userID);

		this.lastActivity = new Date();
		try {
			(await setDoc(ref, this.toJSON()), { merge: true });
		} catch (err: any) {
			console.log(err);
		}
	}

	// can probably be simplified since other things access the userdata on the server....
	public async UpdateStreak(): Promise<string | boolean> {
		if (!this._userID) return false;

		const now = new Date();
		const d = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

		const ref = doc(db, 'user', this._userID);

		try {
			const loaded = await getDoc(ref);
			if (!loaded.exists()) {
				await setDoc(ref, { consecutiveDays: 1, lastDay: d });
				return 'Establishing user data and starting first streak';
			}

			const dd = loaded.data();
			if (!dd.consecutiveDays || !dd.lastDay) {
				await setDoc(ref, { consecutiveDays: 1, lastDay: d }, { merge: true });
				return 'Starting first streak';
			}

			if (dd.lastDay == d) {
				return 'Current streak: ' + dd.consecutiveDays + ' days';
			}

			const sd = dd.lastDay.split('-');
			const lastDate = new Date(sd[0], sd[1] - 1, sd[2]);
			// @ts-expect-error
			const diff = today - lastDate;
			if (diff >= 43200000 && diff <= 129600000) {
				// more than half a day, less than a day-and-a-half
				const newStreak = dd.consecutiveDays + 1;
				await setDoc(
					ref,
					{
						consecutiveDays: newStreak,
						lastDay: d
					},
					{ merge: true }
				);
				if (!dd.longestStreak || newStreak > +dd.longestStreak)
					await setDoc(ref, { longestStreak: newStreak }, { merge: true });

				return 'Increasing current streak: ' + newStreak + ' days';
			}

			await setDoc(ref, { consecutiveDays: 1, lastDay: d }, { merge: true });
			return 'Starting new streak';
		} catch (err: any) {
			console.log(err);
			return err.message;
		}
	}

	get isEditor(): boolean {
		return this._isEditor;
	}

	get isMediaManager(): boolean {
		return this._isEditor || this._isMediaManager;
	}

	get loggedIn(): boolean {
		return this._loggedIn;
	}

	public static async getRecent(): Promise<array> {
		const users = new Array();
		const lastweek = new Date().getTime() - 604800000; // 1 week
		const recent = new Date(lastweek);

		let q = query(
			collection(db, 'user'),
			where('lastActivity', '>', recent.toJSON()),
			orderBy('lastActivity', 'desc')
		);

		let res = await getDocs(q);
		for (const a of res.docs) {
			users.push(new user(a.data()));
		}
		return users;
	}
}
