import { auth } from "../firebase";

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
}
