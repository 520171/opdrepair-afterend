(function(n){function e(e){for(var r,o,u=e[0],i=e[1],l=e[2],s=0,d=[];s<u.length;s++)o=u[s],c[o]&&d.push(c[o][0]),c[o]=0;for(r in i)Object.prototype.hasOwnProperty.call(i,r)&&(n[r]=i[r]);f&&f(e);while(d.length)d.shift()();return a.push.apply(a,l||[]),t()}function t(){for(var n,e=0;e<a.length;e++){for(var t=a[e],r=!0,o=1;o<t.length;o++){var u=t[o];0!==c[u]&&(r=!1)}r&&(a.splice(e--,1),n=i(i.s=t[0]))}return n}var r={},o={app:0},c={app:0},a=[];function u(n){return i.p+"js/"+({}[n]||n)+"."+{"chunk-0b02f7ac":"d13c76b3","chunk-0d9e980a":"f7ae8267","chunk-22fde909":"116254f3","chunk-2d0c9aea":"75113795","chunk-2939428b":"c0ed0f47","chunk-312a1440":"df69ff20","chunk-431dfb69":"d5bc79f9","chunk-4d87cc36":"4fd88867","chunk-7bd8a592":"1304a94b","chunk-d20e9da4":"450e2ad9"}[n]+".js"}function i(e){if(r[e])return r[e].exports;var t=r[e]={i:e,l:!1,exports:{}};return n[e].call(t.exports,t,t.exports,i),t.l=!0,t.exports}i.e=function(n){var e=[],t={"chunk-22fde909":1,"chunk-2939428b":1,"chunk-312a1440":1,"chunk-431dfb69":1,"chunk-4d87cc36":1};o[n]?e.push(o[n]):0!==o[n]&&t[n]&&e.push(o[n]=new Promise(function(e,t){for(var r="css/"+({}[n]||n)+"."+{"chunk-0b02f7ac":"31d6cfe0","chunk-0d9e980a":"31d6cfe0","chunk-22fde909":"d736ad90","chunk-2d0c9aea":"31d6cfe0","chunk-2939428b":"a35730d8","chunk-312a1440":"20f65cb3","chunk-431dfb69":"c5cf36db","chunk-4d87cc36":"9c087c44","chunk-7bd8a592":"31d6cfe0","chunk-d20e9da4":"31d6cfe0"}[n]+".css",c=i.p+r,a=document.getElementsByTagName("link"),u=0;u<a.length;u++){var l=a[u],s=l.getAttribute("data-href")||l.getAttribute("href");if("stylesheet"===l.rel&&(s===r||s===c))return e()}var d=document.getElementsByTagName("style");for(u=0;u<d.length;u++){l=d[u],s=l.getAttribute("data-href");if(s===r||s===c)return e()}var f=document.createElement("link");f.rel="stylesheet",f.type="text/css",f.onload=e,f.onerror=function(e){var r=e&&e.target&&e.target.src||c,a=new Error("Loading CSS chunk "+n+" failed.\n("+r+")");a.request=r,delete o[n],f.parentNode.removeChild(f),t(a)},f.href=c;var p=document.getElementsByTagName("head")[0];p.appendChild(f)}).then(function(){o[n]=0}));var r=c[n];if(0!==r)if(r)e.push(r[2]);else{var a=new Promise(function(e,t){r=c[n]=[e,t]});e.push(r[2]=a);var l,s=document.createElement("script");s.charset="utf-8",s.timeout=120,i.nc&&s.setAttribute("nonce",i.nc),s.src=u(n),l=function(e){s.onerror=s.onload=null,clearTimeout(d);var t=c[n];if(0!==t){if(t){var r=e&&("load"===e.type?"missing":e.type),o=e&&e.target&&e.target.src,a=new Error("Loading chunk "+n+" failed.\n("+r+": "+o+")");a.type=r,a.request=o,t[1](a)}c[n]=void 0}};var d=setTimeout(function(){l({type:"timeout",target:s})},12e4);s.onerror=s.onload=l,document.head.appendChild(s)}return Promise.all(e)},i.m=n,i.c=r,i.d=function(n,e,t){i.o(n,e)||Object.defineProperty(n,e,{enumerable:!0,get:t})},i.r=function(n){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},i.t=function(n,e){if(1&e&&(n=i(n)),8&e)return n;if(4&e&&"object"===typeof n&&n&&n.__esModule)return n;var t=Object.create(null);if(i.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:n}),2&e&&"string"!=typeof n)for(var r in n)i.d(t,r,function(e){return n[e]}.bind(null,r));return t},i.n=function(n){var e=n&&n.__esModule?function(){return n["default"]}:function(){return n};return i.d(e,"a",e),e},i.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},i.p="/",i.oe=function(n){throw console.error(n),n};var l=window["webpackJsonp"]=window["webpackJsonp"]||[],s=l.push.bind(l);l.push=e,l=l.slice();for(var d=0;d<l.length;d++)e(l[d]);var f=s;a.push([0,"chunk-vendors"]),t()})({0:function(n,e,t){n.exports=t("56d7")},"4ec3":function(n,e,t){"use strict";t.d(e,"l",function(){return u}),t.d(e,"k",function(){return i}),t.d(e,"g",function(){return l}),t.d(e,"b",function(){return s}),t.d(e,"j",function(){return d}),t.d(e,"c",function(){return f}),t.d(e,"e",function(){return p}),t.d(e,"a",function(){return h}),t.d(e,"h",function(){return m}),t.d(e,"m",function(){return b}),t.d(e,"f",function(){return g}),t.d(e,"i",function(){return v}),t.d(e,"d",function(){return k});var r=t("bc3a"),o=t.n(r),c=(t("5665"),"https://www.opdgr.cn");o.a.defaults.withCredentials=!0;var a=o.a.create(),u=function(n){return a.post("".concat(c,"/login"),n).then(function(n){return n.data})},i=function(){return a.post("".concat(c,"/autoLogin")).then(function(n){return n.data})},l=function(n){console.log(n);var e=a.post("".concat(c,"/listpage"),{params:n});return console.log(e),e},s=function(n){console.log(n);var e=a.post("".concat(c,"/addUser"),{params:n});return console.log(e),e},d=function(n){console.log(n);var e=a.post("".concat(c,"/removeUsers"),{params:n});return console.log(e),e},f=function(n){console.log(n);var e=a.post("".concat(c,"/updateUser"),{params:n});return console.log(e),e},p=function(n){console.log(n);var e=a.post("".concat(c,"/listdepartment"),{params:n});return console.log(e),e},h=function(n){console.log(n);var e=a.post("".concat(c,"/addDepartment"),{params:n});return console.log(e),e},m=function(n){console.log(n);var e=a.post("".concat(c,"/removeDepartment"),{params:n});return console.log(e),e},b=function(n){console.log(n);var e=a.post("".concat(c,"/updateDepartment"),{params:n});return console.log(e),e},g=function(n){console.log(n);var e=a.post("".concat(c,"/listService"),{params:n});return console.log(e),e},v=function(n){console.log(n);var e=a.post("".concat(c,"/removeRepairs"),{params:n});return console.log(e),e},k=function(n){console.log(n);var e=a.post("".concat(c,"/users/getAnnex"),{sid:n});return console.log(e),e}},5665:function(n,e,t){"use strict";var r=t("8c4f"),o=t("2b0e");o["default"].use(r["a"]);var c=new r["a"]({mode:"history",base:"/",routes:[{path:"/login",component:function(){return t.e("chunk-431dfb69").then(t.bind(null,"a55b"))},name:"",hidden:!0,meta:{title:"登陆"}},{path:"/404",component:function(){return t.e("chunk-312a1440").then(t.bind(null,"8cdb"))},name:"",hidden:!0},{path:"/",component:function(){return t.e("chunk-2939428b").then(t.bind(null,"bb51"))},name:"报修记录",iconCls:"el-icon-opdbaoxiujilu",leaf:!1,redirect:"/RepairList",children:[{path:"/RepairList",component:function(){return Promise.all([t.e("chunk-22fde909"),t.e("chunk-2d0c9aea")]).then(t.bind(null,"59d4"))},name:"报修记录列表",meta:{title:"报修记录列表"}},{path:"/RepairManager",component:function(){return t.e("chunk-22fde909").then(t.bind(null,"fa2d"))},name:"报修记录管理",meta:{title:"报修记录管理"}}]},{path:"/",component:function(){return t.e("chunk-2939428b").then(t.bind(null,"bb51"))},name:"员工",iconCls:"el-icon-opdyuangong",redirect:"/UserList",children:[{path:"/UserList",component:function(){return t.e("chunk-7bd8a592").then(t.bind(null,"a71d"))},name:"员工列表",meta:{title:"员工列表"}},{path:"/UserManager",component:function(){return t.e("chunk-0b02f7ac").then(t.bind(null,"8418"))},name:"员工管理",meta:{title:"员工管理"}}]},{path:"/",component:function(){return t.e("chunk-2939428b").then(t.bind(null,"bb51"))},name:"部门",iconCls:"el-icon-opdbumen",redirect:"/DepartmentList",children:[{path:"/DepartmentList",component:function(){return t.e("chunk-d20e9da4").then(t.bind(null,"cee9"))},name:"部门列表",meta:{title:"部门列表"}},{path:"/DepartmentManager",component:function(){return t.e("chunk-0d9e980a").then(t.bind(null,"c3bf"))},name:"部门管理",meta:{title:"部门管理"}}]},{path:"/",component:function(){return t.e("chunk-2939428b").then(t.bind(null,"bb51"))},name:"统计",iconCls:"fa fa-bar-chart",redirect:"/echarts",children:[{path:"/echarts",component:function(){return t.e("chunk-4d87cc36").then(t.bind(null,"9748"))},name:"数据分析",meta:{title:"数据分析"}}]},{path:"*",hidden:!0,redirect:{path:"/404"}}]});c.beforeEach(function(n,e,t){var r=1===n.matched.length?0:1;document.title=n.matched[r].meta.title,t()}),e["a"]=c},"56d7":function(n,e,t){"use strict";t.r(e);var r={};t.r(r),t.d(r,"increment",function(){return k}),t.d(r,"decrement",function(){return y});var o={};t.r(o),t.d(o,"getCount",function(){return w});var c=t("f499"),a=t.n(c),u=(t("cadf"),t("551c"),t("f751"),t("097d"),t("2b0e")),i=function(){var n=this,e=n.$createElement,t=n._self._c||e;return t("div",{attrs:{id:"app"}},[t("transition",{attrs:{name:"fade",mode:"out-in"}},[t("router-view")],1)],1)},l=[],s={name:"app",components:{}},d=s,f=(t("5c0b"),t("2877")),p=Object(f["a"])(d,i,l,!1,null,null,null),h=p.exports,m=t("5c96"),b=t.n(m),g=(t("0fae"),t("5665")),v=(t("1f54"),t("2f62")),k=function(n){var e=n.commit;e("INCREMENT")},y=function(n){var e=n.commit;e("DECREMENT")},w=function(n){return n.count};u["default"].use(v["a"]);var E={count:10,name:"zjj",departments:[]},j={INCREMENT:function(n){n.count++},DECREMENT:function(n){n.count--},storeDepartments:function(n,e){n.departments=e}},C=new v["a"].Store({actions:r,getters:o,state:E,mutations:j}),M=(t("ed2c"),t("6944")),O=t.n(M),S=t("4ec3"),T=t("2b27"),x=t.n(T);u["default"].use(O.a),u["default"].use(b.a),u["default"].use(x.a),g["a"].beforeEach(function(n,e,t){"/login"===n.path?t():"/404"===n.path?t():sessionStorage.getItem("user")?t():Object(S["k"])().then(function(n){200==n.code?(sessionStorage.setItem("user",a()(n)),t()):t({path:"/login"})}).catch(function(n){console.log(n),t({path:"/login"})})});var N=new u["default"]({router:g["a"],store:C,render:function(n){return n(h)}}).$mount("#app");console.log(N.$router.options.routes)},"5c0b":function(n,e,t){"use strict";var r=t("5e27"),o=t.n(r);o.a},"5e27":function(n,e,t){},ed2c:function(n,e,t){}});
//# sourceMappingURL=app.997dba9b.js.map