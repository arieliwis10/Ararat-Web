const d=e=>e.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""),z={contact:{whatsapp:"56999405462"}};function f(e="Hola, quiero cotizar un trabajo."){return`https://wa.me/${z.contact.whatsapp}?text=${encodeURIComponent(e)}`}const p={deporte:"Deporte",seguridad:"Seguridad y bienestar",educacion:"Educación y tecnología",ambiente:"Medio ambiente",laboral:"Trabajo seguro y cumplimiento"},C=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function E(e,o){const s=e.fotos[0];return`<a href="/responsabilidad-social/#${r(e.eje)}" class="absolute inset-0 opacity-0 transition-opacity duration-700 data-[activa]:opacity-100" data-diapo${o===0?" data-activa":""}>
    <img src="${r(s.src)}" alt="${r(s.alt)}" loading="${o===0?"eager":"lazy"}" decoding="async" class="size-full object-cover object-[50%_20%]" />
    <span class="absolute bottom-4 left-4 right-4 rounded-md bg-acero-950/80 px-4 py-2 text-white">
      <span class="block font-display text-sm font-semibold uppercase tracking-[0.2em] text-cian-400">${r(p[e.eje]??"")}</span>
      <span class="block font-display text-xl font-bold uppercase tracking-wide">${r(e.titulo)}</span>
    </span>
  </a>`}function S(e){const[o,s]=(e.fecha??"").split("-"),t=o&&s?`${C[Number(s)-1]} ${o}`:"";return{id:e.id,titulo:e.titulo,categoria:e.eje,categoriaNombre:t||p[e.eje]||"",resumen:e.resumen,descripcion:e.descripcion,destacado:!1,fotos:e.fotos,video:null}}const A={"trabajos-tarjetas":"trabajos","trabajos-destacados":"trabajos","equipos-catalogo":"equipos","pyrotect-categorias":"pyrotect","pyrotect-productos":"pyrotect",comunidad:"comunidad","comunidad-diapos":"comunidad",preguntas:"preguntas"},P={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},r=e=>String(e??"").replace(/[&<>"']/g,o=>P[o]),L=new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}),T=e=>e==null?"Consultar":`${L.format(e)} / día`,c=(e,o,s)=>` data-visor-titulo="${r(e)}" data-visor-texto="${r(o)}" data-visor-fotos="${r(JSON.stringify(s.map(({src:t,alt:a,video:i})=>({src:t,alt:a,...i&&{video:i}}))))}"`,_=`<span class="absolute inset-0 flex items-center justify-center" aria-hidden="true">
  <span class="flex size-14 items-center justify-center rounded-full bg-acero-950/70 text-white ring-2 ring-white/70">
    <svg viewBox="0 0 24 24" class="ml-1 size-7" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
  </span>
</span>`;function l(e){return e.video?[...e.fotos,{src:e.video,mini:"",alt:`Video: ${e.titulo}`,video:!0}]:e.fotos}function N(e){const o=e.fotos.length===1?"1 foto":`${e.fotos.length} fotos`;return e.video?`Ver proyecto (${o} y 1 video)`:e.fotos.length>1?`Ver proyecto (${o})`:"Ver foto"}function b(e){return`<ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">${e.map((s,t)=>{const a=s.video?`<video src="${r(s.src)}#t=0.1" muted playsinline preload="metadata" aria-hidden="true" class="aspect-square w-full bg-black object-cover"></video>${_}`:`<img src="${r(s.mini)}" alt="${r(s.alt)}" loading="lazy" decoding="async" class="aspect-square w-full object-cover transition duration-300 group-hover:scale-105" />`;return`<li>
      <a href="${r(s.src)}" class="group relative block overflow-hidden rounded-lg ring-1 ring-white/10" data-visor data-visor-indice="${t}"${s.video?` aria-label="${r(s.alt)}"`:""}>
        ${a}
      </a>
    </li>`}).join("")}</ul>`}function g(e){const o=e.fotos[0];return`<a href="${r(o.src)}" class="group block h-full transition hover:-translate-y-0.5" data-visor${c(e.titulo,e.descripcion||e.resumen,l(e))}>
    <figure class="h-full overflow-hidden rounded-lg bg-white ring-1 ring-acero-100">
      <img src="${r(o.mini)}" alt="${r(o.alt)}" loading="lazy" decoding="async" class="aspect-[3/2] w-full object-cover object-[50%_25%]" />
      <figcaption class="p-4">
        <p class="eyebrow">${r(e.categoriaNombre)}</p>
        <h3 class="mt-1 text-xl text-acero-900">${r(e.titulo)}</h3>
        <p class="mt-1 text-sm text-acero-700">${r(e.resumen)}</p>
        <p class="mt-3 font-display font-semibold uppercase tracking-wide text-cian-600 group-hover:text-cian-500">${N(e)} →</p>
      </figcaption>
    </figure>
  </a>`}function D(e){return`<section class="section border-t border-white/10 bg-acero-950 text-white"${c(e.titulo,e.descripcion||e.resumen,l(e))}>
    <div class="container-x">
      <p class="eyebrow">${r(e.categoriaNombre)}</p>
      <h2 class="mt-2 text-4xl sm:text-5xl">${r(e.titulo)}</h2>
      <p class="mt-4 max-w-2xl whitespace-pre-line text-lg text-acero-300">${r(e.descripcion||e.resumen)}</p>
      <p class="mt-6 text-sm text-acero-300">Toca una foto para verla en grande.</p>
      <div class="mt-3">${b(l(e))}</div>
    </div>
  </section>`}const h=e=>`galeria-${d(e.nombre)}`;function I(e){const o=e.fotos.length-1,s=f(`Hola, quiero consultar disponibilidad y precio del arriendo de: ${e.nombre}.`),t=`/contacto/?servicio=arriendo&equipo=${encodeURIComponent(e.nombre)}`,a=e.unidades>0?`<p class="mt-3 flex items-center gap-2 text-sm font-semibold text-kairos-400">
          <span class="size-2 rounded-full bg-kairos-400" aria-hidden="true"></span>
          ${e.unidades} ${e.unidades===1?"unidad disponible":"unidades disponibles"}
        </p>`:'<p class="mt-3 text-sm font-semibold text-acero-300">Sin unidades disponibles por ahora</p>';return`<article class="flex h-full flex-col overflow-hidden rounded-lg bg-acero-900 text-white ring-1 ring-white/10">
    <img src="${r(e.fotos[0].mini)}" alt="${r(e.fotos[0].alt)}" loading="lazy" decoding="async" class="aspect-square w-full object-cover" />
    <div class="flex flex-1 flex-col p-5">
      <p class="font-display text-sm font-semibold uppercase tracking-[0.2em] text-kairos-400">${r(e.categoria)}</p>
      <h3 class="mt-1 text-2xl">${r(e.nombre)}</h3>
      ${e.detalle?`<p class="mt-1 text-sm text-acero-300">${r(e.detalle)}</p>`:""}
      ${a}
      <p class="mt-2 font-display text-xl font-bold">${T(e.precioDia)}</p>
      ${o>0?`<a href="#${h(e)}" class="mt-2 font-display font-semibold uppercase tracking-wide text-kairos-400 hover:text-white">Ver galería (${o} ${o===1?"foto":"fotos"}) →</a>`:""}
      <div class="mt-auto flex gap-2 pt-4">
        <a href="${r(s)}" target="_blank" rel="noopener" class="btn-whatsapp min-h-11 flex-1 px-3 text-base">Disponibilidad</a>
        <a href="${r(t)}" class="btn-ghost min-h-11 px-3 text-base">Cotizar</a>
      </div>
    </div>
  </article>`}function U(e){const s=[...new Set(e.map(a=>a.categoria))].map(a=>`<div id="${d(a)}" class="mt-10 scroll-mt-20">
      <h3 class="text-2xl text-kairos-400">${r(a)}</h3>
      <div class="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        ${e.filter(i=>i.categoria===a).map(I).join("")}
      </div>
    </div>`),t=e.filter(a=>a.fotos.length>1).map(a=>{const i=a.fotos.slice(1);return`<div id="${h(a)}" class="mt-14 scroll-mt-20"${c(a.nombre,a.detalle,i)}>
        <h3 class="text-2xl text-kairos-400">Galería: ${r(a.nombre)}</h3>
        <p class="mt-1 text-sm text-acero-300">Toca una foto para verla en grande.</p>
        <div class="mt-4">${b(i)}</div>
      </div>`});return s.join("")+t.join("")}const x=e=>f(`Hola, quiero cotizar productos Pyrotect: ${e}.`);function $(e,o){const s=`<img src="${r(e[0].mini)}" alt="${r(e[0].alt)}" loading="lazy" decoding="async" class="aspect-square w-full bg-white object-contain ${o}" />`;return e.length>1?`<a href="${r(e[0].src)}" class="block" data-visor>${s}</a>`:s}function F(e){const o=e.lineas.map(t=>`<li class="rounded-md bg-acero-50 px-3 py-1.5 text-sm text-acero-900 ring-1 ring-acero-100">${r(t)}</li>`),s=`/contacto/?servicio=pyrotect&producto=${encodeURIComponent(e.nombre)}`;return`<article id="${d(e.nombre)}" class="grid scroll-mt-20 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-acero-100 sm:grid-cols-[16rem_1fr]"${c(e.nombre,e.descripcion,e.fotos)}>
    ${$(e.fotos,"p-4")}
    <div class="flex flex-col border-t border-acero-100 p-6 sm:border-l sm:border-t-0">
      <h3 class="text-3xl text-acero-900">${r(e.nombre)}</h3>
      ${e.descripcion?`<p class="mt-2 text-acero-700">${r(e.descripcion)}</p>`:""}
      ${o.length?`<ul class="mt-4 flex flex-wrap gap-2">${o.join("")}</ul>`:""}
      <div class="mt-auto flex flex-col gap-2 pt-6 sm:flex-row">
        <a href="${r(x(e.nombre))}" target="_blank" rel="noopener" class="btn-whatsapp min-h-11 px-4 text-base">Cotizar por WhatsApp</a>
        <a href="${r(s)}" class="btn min-h-11 border border-acero-300 px-4 text-base text-acero-900 hover:bg-acero-100">Formulario</a>
      </div>
    </div>
  </article>`}function R(e){return`<div class="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-acero-100"${c(e.nombre,e.categoria,e.fotos)}>
    ${$(e.fotos,"p-3")}
    <div class="flex flex-1 flex-col border-t border-acero-100 p-4">
      <p class="font-display text-sm font-semibold uppercase tracking-[0.2em] text-pyro-600">${r(e.categoria)}</p>
      <h3 class="mt-1 flex-1 text-xl text-acero-900">${r(e.nombre)}</h3>
      <a href="${r(x(e.nombre))}" target="_blank" rel="noopener" class="btn-whatsapp mt-4 min-h-11 px-3 text-base">Cotizar</a>
    </div>
  </div>`}function M(e){return`<details class="group py-4">
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
      ${r(e.pregunta)}
      <span class="text-cian-500 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
    </summary>
    <p class="mt-3 whitespace-pre-line text-acero-700">${r(e.respuesta)}</p>
  </details>`}const v=(e,o)=>e.preguntas.filter(s=>s.seccion===o);function O(e,o,s){if(e==="comunidad-diapos"){const a=Object.keys(p).map(i=>o.comunidad.find(n=>n.eje===i)).filter(i=>!!i);return{html:a.map(E).join(""),total:a.length}}if(e==="comunidad"){const a=o.comunidad.filter(i=>!s||i.eje===s);return{html:a.map(i=>g(S(i))).join(""),total:a.length}}if(e==="preguntas"){const a=v(o,s);return{html:a.map(M).join(""),total:a.length}}if(e==="pyrotect-categorias"){const{categorias:a}=o.pyrotect;return{html:a.map(F).join(""),total:a.length}}if(e==="pyrotect-productos"){const{productos:a}=o.pyrotect;return{html:a.map(R).join(""),total:a.length}}if(e==="equipos-catalogo")return{html:U(o.equipos),total:o.equipos.length};if(e==="trabajos-destacados"){const a=o.trabajos.filter(i=>i.destacado);return{html:a.map(D).join(""),total:a.length}}const t=s?o.trabajos.filter(a=>a.categoria===s):o.trabajos;return{html:t.map(a=>`<div>${g(a)}</div>`).join(""),total:t.length}}function V(e,o){const s=t=>t.map(a=>({src:new URL(a.src,o).href,mini:new URL(a.mini,o).href,alt:a.alt}));return{trabajos:e.trabajos.map(t=>({id:t.id,titulo:t.titulo,categoria:t.categoria,categoriaNombre:t.categoria_nombre,resumen:t.resumen,descripcion:t.descripcion,destacado:t.destacado,fotos:s(t.fotos),video:t.video?new URL(t.video,o).href:null})),equipos:e.equipos.map(t=>({id:t.id,nombre:t.nombre,categoria:t.categoria,detalle:t.detalle,precioDia:t.precio_dia,unidades:t.unidades,fotos:s(t.fotos)})),pyrotect:{categorias:(e.pyrotect?.categorias??[]).map(t=>({id:t.id,nombre:t.nombre,descripcion:t.descripcion,lineas:t.lineas,fotos:s(t.fotos)})),productos:(e.pyrotect?.productos??[]).map(t=>({id:t.id,nombre:t.nombre,categoria:t.categoria,fotos:s(t.fotos)}))},comunidad:(e.comunidad??[]).map(t=>({id:t.id,titulo:t.titulo,eje:t.eje,resumen:t.resumen,descripcion:t.descripcion,fecha:t.fecha,fotos:s(t.fotos)})),preguntas:(e.preguntas??[]).map(t=>({id:t.id,seccion:t.seccion,pregunta:t.pregunta,respuesta:t.respuesta}))}}function H(e){return{"@context":"https://schema.org","@type":"FAQPage",mainEntity:e.map(o=>({"@type":"Question",name:o.q,acceptedAnswer:{"@type":"Answer",text:o.a}}))}}const Q=8e3,y="https://api.araratchile.com/public".replace(/\/$/,""),w=[...document.querySelectorAll("[data-contenido]")],j=()=>document.documentElement.dataset.cargaContenido="lista";function G(e){let o=document.querySelector('script[data-schema="FAQPage"]');if(!e.length)return o?.remove();o||(o=document.createElement("script"),o.type="application/ld+json",o.dataset.schema="FAQPage",document.head.append(o)),o.textContent=JSON.stringify(H(e.map(s=>({q:s.pregunta,a:s.respuesta}))))}async function J(){const e=new AbortController,o=setTimeout(()=>e.abort(),Q);try{const s=new URL(`${y}/web/contenido/`,location.href),t=await fetch(s,{headers:{Accept:"application/json"},credentials:"omit",signal:e.signal});if(!t.ok)return;const a=await t.json(),i=V(a,s.origin);for(const n of w){const u=n.dataset.contenido;if(!(A[u]in a))continue;const{html:k,total:q}=O(u,i,n.dataset.categoria);n.innerHTML=k;const m=n.closest("[data-contenido-bloque]");m&&(m.hidden=q===0),n.scrollLeft=0,n.dispatchEvent(new Event("scroll")),n.dataset.contenido==="preguntas"&&G(v(i,n.dataset.categoria))}}catch{}finally{clearTimeout(o),j()}}y&&w.length?J():j();
