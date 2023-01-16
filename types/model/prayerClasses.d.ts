export interface prayerClass {
  new (any: any): prayerClass;
  name: string;
  body: string;
  reviewed: boolean;
  license: boolean;
  lastEditor: string;
  lastEdited: string;
  author: string;
  media: string;
  class: string;
}
export declare const classes: Map<string, prayerClass>;
export declare function getClass(className: string): prayerClass;
