import { auth, db } from '../firebase';
import {
	doc,
	setDoc,
	getDoc,
	query,
	collection,
	where,
	orderBy,
	getDocs,
	Timestamp
} from 'firebase/firestore';

export default class user {
	// Use $state for reactive fields
	public displayName = $state('Anon');
	public longestStreak = $state(0);
	public consecutiveDays = $state(0);
	public lastDay = $state('2020-01-01');
	public lastActivity = $state(new Date());

	private _userID = $state<string | undefined>(undefined);
	private _isEditor = $state(false);
	private _isMediaManager = $state(false);
	private _loggedIn = $state(false);

	constructor(obj: any) {
		this.displayName = obj.displayName ?? 'Anon';
		this.longestStreak = Number(obj.longestStreak ?? 0);
		this.consecutiveDays = Number(obj.consecutiveDays ?? 0);
		this.lastDay = obj.lastDay ?? '2020-01-01';

		if (obj.lastActivity instanceof Timestamp) {
			this.lastActivity = obj.lastActivity.toDate();
		} else {
			const la = obj.lastActivity ?? '2023-01-01';
			this.lastActivity = new Date(la);
		}
	}

	get details() {
		return this;
	}

	get uid(): string | undefined {
		return this._userID;
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

	public toString(): string {
		return this.displayName;
	}

	public toJSON(): any {
		return {
			displayName: this.displayName,
			longestStreak: this.longestStreak,
			consecutiveDays: this.consecutiveDays,
			lastDay: this.lastDay,
			lastActivity: this.lastActivity
		};
	}

	public static async me(): Promise<user> {
		const currentUser = auth.currentUser;
		if (!currentUser) {
			console.log("not logged in, returning empty 'me'");
			return new user({ lastActivity: new Date('2023-01-01') });
		}

		const ref = doc(db, 'user', currentUser.uid);
		try {
			const loaded = await getDoc(ref);
			const res = await currentUser.getIdTokenResult();

			let u: user;
			if (loaded.exists()) {
				u = new user(loaded.data());
			} else {
				// New user setup
				u = new user({ displayName: currentUser.displayName });
				await setDoc(ref, u.toJSON(), { merge: true });
			}

			u._userID = currentUser.uid;
			u._isEditor = res.claims.role === 'Editor';
			u._isMediaManager = res.claims.role === 'Media';
			u._loggedIn = true;
			return u;
		} catch (err: any) {
			console.error('Error fetching user data:', err);
			return new user({});
		}
	}

	public async setDisplayName(newname: string): Promise<void> {
		if (!this._userID) return;
		this.displayName = newname;

		try {
			const ref = doc(db, 'user', this._userID);
			await setDoc(ref, this.toJSON(), { merge: true });
		} catch (err: any) {
			console.error('Error setting display name:', err);
		}
	}

	public async logAction(): Promise<void> {
		if (!this._userID) return;
		this.lastActivity = new Date();

		try {
			const ref = doc(db, 'user', this._userID);
			await setDoc(ref, this.toJSON(), { merge: true });
		} catch (err: any) {
			console.error('Error logging action:', err);
		}
	}

	public async UpdateStreak(): Promise<string> {
		if (!this._userID) return 'Not logged in';

		const now = new Date();
		const d = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();

		if (this.lastDay === d) {
			return 'Current streak: ' + this.consecutiveDays + ' days';
		}

		const yesterday = new Date();
		yesterday.setDate(now.getDate() - 1);
		const y =
			yesterday.getFullYear() + '-' + (yesterday.getMonth() + 1) + '-' + yesterday.getDate();

		if (this.lastDay === y) {
			this.consecutiveDays++;
			if (this.consecutiveDays > this.longestStreak) {
				this.longestStreak = this.consecutiveDays;
			}
		} else {
			this.consecutiveDays = 1;
		}

		this.lastDay = d;

		try {
			const ref = doc(db, 'user', this._userID);
			await setDoc(ref, this.toJSON(), { merge: true });
			return 'Streak updated: ' + this.consecutiveDays + ' days';
		} catch (err: any) {
			return err.message;
		}
	}

	public static async getRecent(): Promise<Array<user>> {
		const oneWeekAgo = new Date();
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

		let q = query(
			collection(db, 'user'),
			where('lastActivity', '>', oneWeekAgo),
			orderBy('lastActivity', 'desc')
		);

		try {
			const res = await getDocs(q);
			return res.docs.map((a) => new user(a.data()));
		} catch (err) {
			console.error('Error getting recent users:', err);
			return [];
		}
	}
}
