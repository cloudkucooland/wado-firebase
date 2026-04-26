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
		this._id = '';
		this.name = obj.Name || '• New Prayer';
		this.body = obj.Body || ' -- nothing -- ';
		this.author = obj.Author || '';
		this.reviewed = obj.Reviewed || false;
		this.license = obj.License || false;
		this.lastEditor = obj['Last Editor'] || 'unknown';
		this.lastEdited = obj['Last Edited'] || '2010-01-01T00:00:00.000Z';
		this.media = obj.Media || '';
		this.class = obj.Class || 'Prayer';
	}

	public toFirebase(): prayerFromFirestore {
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

	public get shortname(): string {
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
