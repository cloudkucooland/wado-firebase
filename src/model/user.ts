import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default class user {
  public displayName: string;
  public longestStreak: string;
  public consecutiveDays: string;
  public lastDay: string;
  public lastActivity: string;

  constructor(obj: any) {
    this.displayName = obj.displayName;
    this.longestSream = obj.longestSream;
    this.consecutiveDays = obj.consecutiveDays;
    this.lastDay = obj.lastDay;
    this.lastActivity = obj.lastActivity;
  }

  public toString() {
    return this.userName;
  }

  public static async me() {
    if (!auth.currentUser) return false;

    const res = await auth.currentUser.getIdTokenResult();
    console.log(res);
    try {
      const ref = doc(db, "user", res.id);
      const loaded = await getDoc(ref);
      const u = new user(loaded.data());
      console.log(u);
      return u;
    } catch (err) {
      console.log(err);
    }
  }

  public async setDisplayName(newname: string) {
    this.displayName = newname;
    this.lastActivity = new Date();
    const res = await auth.currentUser.getIdTokenResult();
    const ref = doc(db, "user", res.id);

    try {
      await setDoc(ref, this.toJSON());
    } catch (err) {
      console.log(err);
    }
  }

  public async logAction() {
    this.lastActivity = new Date();
    const res = await auth.currentUser.getIdTokenResult();
    const ref = doc(db, "user", res.id);

    try {
      await setDoc(ref, this.toJSON());
    } catch (err) {
      console.log(err);
    }
  }

  public static async UpdateStreak(uid: string) {
    const now = new Date();
    const d =
      now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const ref = doc(db, "user", uid);

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
}
