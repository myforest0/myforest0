import{j as o,am as i,an as u,ao as l,ap as c,aq as f,ar as d,as as m,at as h,au as A,av as g,Y as v,d as P,u as y,l as w,z as C,aw as _,ax as E,ay as R,az as b}from"./chunks/framework.DKx8iHFh.js";import{t as D}from"./chunks/theme.yzGKiZRG.js";function p(e){if(e.extends){const a=p(e.extends);return{...a,...e,async enhanceApp(t){a.enhanceApp&&await a.enhanceApp(t),e.enhanceApp&&await e.enhanceApp(t)}}}return e}const s=p(D),j=P({name:"VitePressApp",setup(){const{site:e,lang:a,dir:t}=y();return w(()=>{C(()=>{document.documentElement.lang=a.value,document.documentElement.dir=t.value})}),e.value.router.prefetchLinks&&_(),E(),R(),s.setup&&s.setup(),()=>b(s.Layout)}});async function x(){const e=O(),a=L();a.provide(u,e);const t=l(e.route);return a.provide(c,t),a.component("Content",f),a.component("ClientOnly",d),Object.defineProperties(a.config.globalProperties,{$frontmatter:{get(){return t.frontmatter.value}},$params:{get(){return t.page.value.params}}}),s.enhanceApp&&await s.enhanceApp({app:a,router:e,siteData:m}),{app:a,router:e,data:t}}function L(){return h(j)}function O(){let e=o,a;return A(t=>{let n=g(t),r=null;return n&&(e&&(a=n),(e||a===n)&&(n=n.replace(/\.js$/,".lean.js")),r=v(()=>import(n),__vite__mapDeps([]))),o&&(e=!1),r},s.NotFound)}o&&x().then(({app:e,router:a,data:t})=>{a.go().then(()=>{i(a.route,t.site),e.mount("#app")})});export{x as createApp};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = []
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
