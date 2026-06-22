/* Service worker minimal — installable + cache léger de la coquille */
const CACHE="weclever-portal-v1";
self.addEventListener("install",e=>{self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(self.clients.claim());});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  // ne pas mettre en cache les appels Supabase (toujours frais)
  if(/supabase\.co/.test(u.host)){return;}
  e.respondWith(
    caches.open(CACHE).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
      if(e.request.method==="GET"&&resp.ok&&u.origin===location.origin)c.put(e.request,resp.clone());
      return resp;
    }).catch(()=>r)))
  );
});
