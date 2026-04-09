// service-worker.js

self.addEventListener('install', (event) => {
	event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
	event.waitUntil(self.clients.claim());
	// Schedule the next one immediately on activation
	scheduleNextPrayer();
});

self.addEventListener('message', (event) => {
	if (event.data.eventType === 'reset') {
		scheduleNextPrayer();
	}
});

async function scheduleNextPrayer() {
	const nextOfficeDate = getNextOfficeTime();

	if ('showTrigger' in Notification.prototype) {
		try {
			await self.registration.showNotification('Wado Prayer Reminder', {
				body: `Time to pray.`,
				tag: 'prayer-reminder',
				includeTriggerClass: true, // Required in some implementations
				showTrigger: new TimestampTrigger(nextOfficeDate.getTime()),
				icon: '/icons/icon-192.png'
			});
			console.log(`Scheduled for: ${nextOfficeDate.toLocaleString()}`);
		} catch (err) {
			console.error('Trigger failed, falling back to basic notify:', err);
		}
	} else {
		// console.warn('Notification Triggers not supported in this browser.');
	}
}

function getNextOfficeTime() {
	const now = new Date();
	const officeHours = [7, 9, 12, 15, 18, 21];

	// Find the first hour in the list that is greater than the current hour
	let nextHour = officeHours.find((h) => h > now.getHours());
	const targetDate = new Date(now);

	if (nextHour === undefined) {
		// If no hours are left today, it's 7 AM tomorrow
		targetDate.setDate(now.getDate() + 1);
		nextHour = 7;
	}

	targetDate.setHours(nextHour, 0, 0, 0);
	return targetDate;
}

self.addEventListener('notificationclick', (event) => {
	event.notification.close();

	// Open the app
	event.waitUntil(
		Promise.all([
			clients.openWindow('/wado/#/'),
			scheduleNextPrayer() // Queue the next office reminder
		])
	);
});
