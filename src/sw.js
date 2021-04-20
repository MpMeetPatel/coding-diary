/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */


self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('--- SKIP_WAITING ---');
        self.skipWaiting();
    }
});


workbox.routing.registerRoute(
    new RegExp('https:.*min.(css|js)'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'cdn-cache',
    })
);

// Below code is only for example

// self.addEventListener('install', event => {
//   console.log("install")
// })

// self.addEventListener('activate', event => {
//   console.log('activate')
// })

// self.addEventListener('fetch', (event) => {
//     if (event.request.method === 'POST' || event.request.method === 'DELETE') {
//         event.respondWith(
//             fetch(event.request).catch((err) => {
//                 return new Response(
//                     JSON.stringify({
//                         error: 'This action is disabled while app is offline',
//                     }),
//                     {
//                         headers: { 'Content-Type': 'application/json' },
//                     }
//                 );
//             })
//         );
//     }
// });

workbox.precaching.precacheAndRoute(self.__precacheManifest || []);
