import Lauds from '../components/offices/Lauds.svelte';
import Terce from '../components/offices/Terce.svelte';
import Sext from '../components/offices/Sext.svelte';
import None from '../components/offices/None.svelte';
import Vespers from '../components/offices/Vespers.svelte';
import Compline from '../components/offices/Compline.svelte';
import Vigil from '../components/offices/Vigil.svelte';
import Matins from '../components/offices/Matins.svelte';
import TestOffice from '../components/offices/TestOffice.svelte';

// Lookup table of office-name to component...
const officeLUT = new Map([
	['Lauds', Lauds],
	['Terce', Terce],
	['Sext', Sext],
	['None', None],
	['Vespers', Vespers],
	['Compline', Compline],
	['Vigil', Vigil],
	['Matins', Matins],
	['TestOffice', TestOffice]
]);

export function getOffice(officeName: string): string {
	return officeLUT.get(officeName);
}

export function currentOffice(): string {
	const d = new Date();
	const hour = d.getHours();

	if (hour < 5 && d.getDay() == 0) return 'Vigil'; // or Matins
	if (hour >= 5 && hour < 9) return 'Lauds';
	if (hour >= 9 && hour < 12) return 'Terce';
	if (hour >= 12 && hour < 15) return 'Sext';
	if (hour >= 15 && hour < 17) return 'None';
	if (hour >= 17 && hour < 21) {
		if (d.getDay() == 6) return 'Vigil';
		return 'Vespers';
	}

	if (hour >= 21 && d.getDay() == 6) return 'Vigil';
	// default
	return 'Compline';
}

export function getCurrentOffice(): office {
	return officeLUT.get(currentOffice());
}
