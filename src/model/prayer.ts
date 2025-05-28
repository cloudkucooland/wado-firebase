import type { prayerFromFirestore } from './types';

export default class prayer {
	public name: string;
	public body: string;
	public reviewed: boolean;
	public license: boolean;
	public lastEditor: string;
	public lastEdited: string;
	public author: string;
	public media: string;
	public class: string;
	private _id: string;

	public constructor(obj: prayerFromFirestore) {
		this.name = '• New Prayer';
		if (obj.Name) this.name = obj.Name;
		this.body = ' -- nothing -- ';
		if (obj.Body) this.body = obj.Body;
		this.author = '';
		if (obj.Author) this.author = obj.Author;
		this.reviewed = false;
		if (obj.Reviewed) this.reviewed = obj.Reviewed;
		this.license = false;
		if (obj.License) this.license = obj.License;
		this.lastEditor = 'unknown';
		if (obj['Last Editor']) this.lastEditor = obj['Last Editor'];
		this.lastEdited = '2010-01-01T00:00:00.000Z';
		if (obj['Last Edited']) this.lastEdited = obj['Last Edited'];
		this.media = '';
		if (obj.Media) this.media = obj.Media;
		this.class = 'Prayer';
		if (obj.Class) this.class = obj.Class;
	}

	public toFirebase() {
		return {
			Name: this.name,
			Body: this.body,
			Author: this.author,
			Reviewed: this.reviewed,
			License: this.license,
			'Last Editor': this.lastEditor,
			'Last Edited': this.lastEdited,
			Media: this.media,
			Class: this.class
		};
	}

	public get shortname() {
		if (this.name.length < 30) return this.name;

		const words: Array<string> = this.name.split(' ');
		let shortName: string = '';
		let i: number = 0;
		while (shortName.length < 25) {
			if (i > 0) shortName += ' ';
			shortName += words[i];
			i = i + 1;
		}
		return shortName;
	}

	set id(n: string) {
		this._id = n;
	}

	get id(): string {
		return this._id;
	}
}
