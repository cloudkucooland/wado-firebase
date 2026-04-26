class Preferences {
	showMedia = $state(localStorage.getItem('showMedia') === 'true');
	showEdit = $state(localStorage.getItem('showEdit') === 'true');
	showAlt = $state(localStorage.getItem('showAlt') === 'true');
	darkMode = $state(localStorage.getItem('darkMode') === 'true');
	fontSize = $state(Number(localStorage.getItem('fontSize') || '2')); // 1-5 scale
	highLegibility = $state(localStorage.getItem('highLegibility') === 'true');

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
			$effect(() => {
				localStorage.setItem('darkMode', String(this.darkMode));
				if (this.darkMode) {
					document.documentElement.classList.add('dark');
				} else {
					document.documentElement.classList.remove('dark');
				}
			});
			$effect(() => {
				localStorage.setItem('fontSize', String(this.fontSize));
				document.documentElement.style.setProperty('--wado-font-scale', `${0.8 + this.fontSize * 0.2}rem`);
			});
			$effect(() => {
				localStorage.setItem('highLegibility', String(this.highLegibility));
				if (this.highLegibility) {
					document.documentElement.classList.add('high-legibility');
				} else {
					document.documentElement.classList.remove('high-legibility');
				}
			});
		});
	}

	toggle(key: 'showMedia' | 'showEdit' | 'showAlt' | 'darkMode' | 'highLegibility') {
		this[key] = !this[key];
	}
}

export const prefs = new Preferences();
