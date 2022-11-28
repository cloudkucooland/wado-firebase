import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default class user {
  public name: string;

  constructor(obj: any) {
    this.name = obj.name;
  }

  public toString() {
    return this.name;
  }

  public static async me() {
    if (!auth.currentUser) return false;

    const res = await auth.currentUser.getIdTokenResult();
    console.log(res);
  }

  public static async UpdateStreak(uid: string) {
    const now = new Date();
    const d =
      now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();

    const ref = doc(db, "user", uid);

    try {
      const loaded = await getDoc(ref);
      if (loaded.exists()) {
        const dd = loaded.data();
        if (!dd.consecutiveDays || !dd.lastDay) {
          // console.debug("user exists, but no streak data, starting new streak");
          await setDoc(
            ref,
            { consecutiveDays: 1, lastDay: d },
            { merge: true }
          );
          return 1;
        }
        if (dd.lastDay == d) {
          // console.debug("already logged today");
          return dd.consecutiveDays;
        }

        const s = d.split("-");
	const sd = dd.lastDay.split("-");
        if (s[0] == sd[0] && s[1] == sd[1] && +s[2] == +sd[2] + 1) {
	  // console.debug("bumping streak!");
          await setDoc(
            ref,
            {
              consecutiveDays: dd.consecutiveDays + 1,
              lastDay: d,
            },
            { merge: true }
          );
          return 1;
        }

        // console.debug("starting new streak");
        await setDoc(ref, { consecutiveDays: 1, lastDay: d }, { merge: true });
        return 1;
      } else {
        // console.debug("creating user data, starting new streak");
        await setDoc(ref, { consecutiveDays: 1, lastDay: d });
        return 1;
      }
    } catch (err) {
      console.log(err);
      return 0;
    }
  }
}
