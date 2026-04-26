import type { DocumentReference, Timestamp } from 'firebase/firestore';

export interface prayerFromFirestore {
	Name: string;
	Body: string;
	Author?: string;
	Reviewed?: boolean;
	License?: boolean;
	'Last Editor'?: string;
	'Last Edited'?: string;
	Class?: string;
	Media?: string;
	'Hymn Tune'?: string;
	'Hymn Meter'?: string;
	Rubric?: string;
	Antiphon?: DocumentReference;
	MorningCollect?: string;
	EveningCollect?: string;
}

export interface associationFromFirestore {
	Location: string;
	Season: string;
	Proper: number;
	Weekday: number;
	Year: string;
	Weight: number;
	CalendarDate?: string;
	Reference: DocumentReference;
}

export interface lectionFromFirestore {
	morning?: string;
	evening?: string;
	morningpsalm?: string;
	eveningpsalm?: string;
	morningtitle?: string;
	eveningtitle?: string;
	season?: string;
	proper?: number;
	weekday?: number;
	_morning?: string;
	_evening?: string;
	_morningpsalmref?: string; // Document ID string
	_eveningpsalmref?: string; // Document ID string
}

export interface userFromFirestore {
	displayName?: string;
	longestStreak?: number;
	consecutiveDays?: number;
	lastDay?: string;
	lastActivity?: Timestamp | string | Date;
}

export interface seasonObj {
	name: string;
	churchPos: number;
	maxProper: number;
	useWeekdays: boolean;
	startWeekday?: number;
	maxWeekday?: number;
	desc?: string;
	properName?: string;
	comment?: string;
}

export interface prayerRequest {
	Content: string;
	OSLName: string;
}
