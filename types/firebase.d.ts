import { Query, DocumentReference } from "firebase/firestore";
export declare const auth: import("@firebase/auth").Auth;
export declare let db: import("@firebase/firestore").Firestore;
export declare const storage: import("@firebase/storage").FirebaseStorage;
export declare function initAnalytics(): void;
export declare function recordEvent(name: string, details?: object): void;
export declare function screenView(name: string): void;
export declare function enableOfflineDataMode(): void;
export declare function getDocsCacheFirst(
  q: Query,
): Promise<
  import("@firebase/firestore").QuerySnapshot<
    import("@firebase/firestore").DocumentData
  >
>;
export declare function getDocCacheFirst(
  r: DocumentReference,
): Promise<
  import("@firebase/firestore").DocumentSnapshot<
    import("@firebase/firestore").DocumentData
  >
>;
