import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default class user {
  public displayName: string;
  public longestStreak: string;
  public consecutiveDays: string;
  public lastDay: string;
  public lastActivity: string;
  private _userID: string;
  private _isEditor: boolean;
  private _loggedIn: boolean;

  constructor(obj: any) {
    this.displayName = obj.displayName;
    this.longestStreak = obj.longestStreak;
    this.consecutiveDays = obj.consecutiveDays;
    this.lastDay = obj.lastDay;
    this.lastActivity = obj.lastActivity;
    this._isEditor = false;
    this._loggedIn = false;
  }

  public toString() {
    return this.displayName;
  }

  public toJSON() {
    const u = {};
    if (this.displayName) u.displayName = this.displayName;
    if (this.longestStreak) u.longestStreak = this.longestStreak;
    if (this.consecutiveDays) u.consecutiveDays = this.consecutiveDays;
    if (this.lastDay) u.lastDay = this.lastDay;
    if (this.lastActivity) u.lastActivity = this.lastActivity;
    return u;
  }

  // load from firestore
  public static async me() {
    if (!auth.currentUser) {
      console.log("not logged in, returning empty 'me'");
      return new user({ lastActivity: "0" });
    }
    console.log(auth.currentUser);

    const ref = doc(db, "user", auth.currentUser.uid);
    try {
      const loaded = await getDoc(ref);
      if (loaded.exists()) {
        const u = new user(loaded.data());
        u._userID = auth.currentUser.uid;
        const res = await auth.currentUser.getIdTokenResult();
        u._isEditor = res.claims.role == "Editor";
        u._loggedIn = true;
        return u;
      }
    } catch (err) {
      console.log(err);
    }

    // write something back, so future reads succeed
    const u = new user({ lastActivity: "0" });
    u._userID = auth.currentUser.uid;
    await setDoc(ref, u.toJSON(), { merge: true });
    return u;
  }

  // update firestore
  public async setDisplayName(newname: string) {
    if (!this._userID) return;
    const ref = doc(db, "user", this._userID);

    this.displayName = newname;
    try {
      await setDoc(ref, this.toJSON(), { merge: true });
    } catch (err) {
      console.log(err);
    }
  }

  // report that there has been activity
  public async logAction() {
    if (!this._userID) return;
    const ref = doc(db, "user", this._userID);

    this.lastActivity = new Date().toJSON();
    try {
      await setDoc(ref, this.toJSON()), { merge: true };
    } catch (err) {
      console.log(err);
    }
  }

  // can probably be simplified since other things access the userdata on the server....
  public async UpdateStreak() {
    if (!this._userID) return false;

    const now = new Date();
    const d =
      now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const ref = doc(db, "user", this._userID);

    try {
      const loaded = await getDoc(ref);
      if (!loaded.exists()) {
        await setDoc(ref, { consecutiveDays: 1, lastDay: d });
        return "Establishing user data and starting first streak";
      }

      const dd = loaded.data();
      if (!dd.consecutiveDays || !dd.lastDay) {
        await setDoc(ref, { consecutiveDays: 1, lastDay: d }, { merge: true });
        return "Starting first streak";
      }

      if (dd.lastDay == d) {
        return "Current streak: " + dd.consecutiveDays + " days";
      }

      const sd = dd.lastDay.split("-");
      const lastDate = new Date(sd[0], sd[1] - 1, sd[2]);
      const diff = today - lastDate;
      if (diff <= 86400001) {
        // 1 day + 1 msec
        const newStreak = dd.consecutiveDays + 1;
        await setDoc(
          ref,
          {
            consecutiveDays: newStreak,
            lastDay: d,
          },
          { merge: true }
        );
        if (!dd.longestStreak || newStreak > +dd.longestStreak)
          await setDoc(ref, { longestStreak: newStreak }, { merge: true });

        return "Increasing current streak: " + newStreak + " days";
      }

      await setDoc(ref, { consecutiveDays: 1, lastDay: d }, { merge: true });
      return "Starting new streak";
    } catch (err) {
      console.log(err);
      return err.message;
    }
  }

  get isEditor() {
    return this._isEditor;
  }
}
