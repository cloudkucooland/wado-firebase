class Preferences {
	showMedia = $state(localStorage.getItem('showMedia') === 'true');
	showEdit = $state(localStorage.getItem('showEdit') === 'true');
	showAlt = $state(localStorage.getItem('showAlt') === 'true');

	constructor() {
		// 2. Use an effect to automatically sync changes back to localStorage
		$effect.root(() => {
			$effect(() => {
				localStorage.setItem('showMedia', String(this.showMedia));
			});
			$effect(() => {
				localStorage.setItem('showEdit', String(this.showEdit));
			});
			$effect(() => {
				localStorage.setItem('showAlt', String(this.showAlt));
			});
		});
	}

	toggle(key: 'showMedia' | 'showEdit' | 'showAlt') {
		this[key] = !this[key];
	}
}

export const prefs = new Preferences();
