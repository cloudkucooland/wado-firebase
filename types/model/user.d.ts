export default class user {
  displayName: string;
  longestStreak: string;
  consecutiveDays: string;
  lastDay: string;
  lastActivity: string;
  private _userID?;
  private _isEditor;
  private _loggedIn;
  constructor(obj: any);
  toString(): string;
  toJSON(): this;
  static me(): Promise<user>;
  setDisplayName(newname: string): Promise<void>;
  logAction(): Promise<void>;
  UpdateStreak(): Promise<any>;
  get isEditor(): boolean;
  get loggedIn(): boolean;
}
