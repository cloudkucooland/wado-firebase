import type proper from './proper';
import type { associationFromFirestore } from './types';
export default class association {
	id: string;
	CalendarDate: string;
	Location: string;
	Proper: number;
	Season: string;
	Weekday: number;
	Weight: number;
	Year: string;
	Reference: any;
	private _dirty;
	private _season;
	constructor(id: string, d: associationFromFirestore);
	toFirebase(): {
		CalendarDate: string;
		Location: string;
		Proper: number;
		Season: string;
		Weekday: number;
		Weight: number;
		Year: string;
		Reference: any;
	};
	get WeekdayDisplay(): string;
	get ProperDisplay(): number | 'Any';
	get ReferenceDisplay(): any;
	static sort(a: [string, association], b: [string, association]): number;
	get dirty(): boolean;
	get dirtyStyle(): 'dirty' | 'clean';
	static fromProper(p: proper): association;
	static locations: string[];
}
