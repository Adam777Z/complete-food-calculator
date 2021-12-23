const cacheName = 'complete-food-calculator-cache';
const cacheVersion = '1.0.1'; // Needed for service worker auto update

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.delete(cacheName).then((deleted) => {
			caches.open(cacheName).then((cache) => cache.addAll([
				'/complete-food-calculator/',
				'/complete-food-calculator/manifest.json',
				'/complete-food-calculator/assets/images/icon.png',
				'/complete-food-calculator/assets/images/icon-192x192.png',
				'/complete-food-calculator/assets/css/bootstrap.min.css',
				'/complete-food-calculator/assets/css/bootstrap-icons.min.css',
				'/complete-food-calculator/assets/css/fonts/bootstrap-icons.woff2',
				// '/complete-food-calculator/assets/css/style.min.css',
				'/complete-food-calculator/assets/js/bootstrap.bundle.min.js',
				'/complete-food-calculator/assets/js/database.min.js',
				'/complete-food-calculator/assets/js/script.min.js',
			]));
		})
	);
});

self.addEventListener('fetch', (event) => {
	event.respondWith(caches.open(cacheName).then((cache) => cache.match(event.request).then((response) => response || fetch(event.request))));
});