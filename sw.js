;
//Asignacion nombre y verdsion al cache
const CACHE_NAME='v1_cache_ontime',
urlsToCache = [
    './',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js',
    'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.cs',
    './app/assets/style.css',
    './app/helpers/xlsx.full.min.js',
    './app/assets/favicon30.png'

]

self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(urlsToCache)
            .then(() => self.skipWaiting())
        })
        .catch(err=>console.log("Fallo el regristo de cache", err))
    )
})

self.addEventListener("activate", e => {
    const cacheWhitelist = [ CACHE_NAME]
    
    e.waitUntil(
        caches.keys()
        .then(cacheNames=>{
            cacheNames.map(cacheName=>{
                if(cacheWhitelist.indexOf(cacheName) === -1){
                    return caches.delete(cacheName)
                }
            })
        })
        .then(()=>self.clients.claim())
    )
})

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request)
        .then(res=>{
            if(res){
                return res
            }

            return fetch(e.request)         
        })
    )
})




