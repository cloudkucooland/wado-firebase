import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default class user {
  public userName: string;

  constructor(obj: any) {
    this.userName = obj.userName;
  }

  public toString() {
    return this.userName;
  }

  public static async me() {
    if (!auth.currentUser) return false;

    const res = await auth.currentUser.getIdTokenResult();
    console.log(res);
    this.userName = res.Name;
    // load data from firestore...
  }

  public static async UpdateStreak(uid: string) {
    const now = new Date();
    const d =
      now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();

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

      const s = d.split("-");
      const sd = dd.lastDay.split("-");
      if (s[0] == sd[0] && s[1] == sd[1] && +s[2] == +sd[2] + 1) {
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
