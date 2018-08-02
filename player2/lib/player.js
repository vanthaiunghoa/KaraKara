!function(){"use strict";function f(e,t){for(var n=[],r=[],o=arguments.length;2<o--;)n.push(arguments[o]);for(;n.length;){var a=n.pop();if(a&&a.pop)for(o=a.length;o--;)n.push(a[o]);else null!=a&&!0!==a&&!1!==a&&r.push(a)}return"function"==typeof e?e(t||{},r):{nodeName:e,attributes:t||{},children:r,key:t&&t.key}}var e=function(e){return e&&2===e.CLOSING},r=function(){return{constructor:"undefined"!=typeof WebSocket&&e(WebSocket)?WebSocket:null,maxReconnectionDelay:1e4,minReconnectionDelay:1500,reconnectionDelayGrowFactor:1.3,connectionTimeout:4e3,maxRetries:1/0,debug:!1}},b=function(t,e,n){Object.defineProperty(e,n,{get:function(){return t[n]},set:function(e){t[n]=e},enumerable:!0,configurable:!0})},w=function(e){return e.minReconnectionDelay+Math.random()*e.minReconnectionDelay},_=["onopen","onclose","onmessage","onerror"],o=function(u,s,t){var f,i,c=this;void 0===t&&(t={});var d=0,p=0,v=!0,y=null,m={};if(!(this instanceof o))throw new TypeError("Failed to construct 'ReconnectingWebSocket': Please use the 'new' operator");var g=r();if(Object.keys(g).filter(function(e){return t.hasOwnProperty(e)}).forEach(function(e){return g[e]=t[e]}),!e(g.constructor))throw new TypeError("Invalid WebSocket constructor. Set `options.constructor`");var h=g.debug?function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];return console.log.apply(console,["RWS:"].concat(e))}:function(){},l=function(e,n){return setTimeout(function(){var t=new Error(n);t.code=e,Array.isArray(m.error)&&m.error.forEach(function(e){return(0,e[0])(t)}),f.onerror&&f.onerror(t)},0)},k=function(){var e,t;(h("handleClose",{shouldRetry:v}),h("retries count:",++p),p>g.maxRetries)?l("EHOSTDOWN","Too many failed connection attempts"):(d?(t=d*(e=g).reconnectionDelayGrowFactor,d=t>e.maxReconnectionDelay?e.maxReconnectionDelay:t):d=w(g),h("handleClose - reconnectDelay:",d),v&&setTimeout(n,d))},n=function(){if(v){h("connect");var o,t,e,n=f,r="function"==typeof u?u():u;for(var a in f=new g.constructor(r,s),i=setTimeout(function(){h("timeout"),f.close(),l("ETIMEDOUT","Connection timeout")},g.connectionTimeout),h("bypass properties"),f)["addEventListener","removeEventListener","close","send"].indexOf(a)<0&&b(f,c,a);f.addEventListener("open",function(){clearTimeout(i),h("open"),d=w(g),h("reconnectDelay:",d),p=0}),f.addEventListener("close",k),o=f,t=n,e=m,Object.keys(e).forEach(function(r){e[r].forEach(function(e){var t=e[0],n=e[1];o.addEventListener(r,t,n)})}),t&&_.forEach(function(e){o[e]=t[e]}),f.onclose=f.onclose||y,y=null}};h("init"),n(),this.close=function(e,t,n){void 0===e&&(e=1e3),void 0===t&&(t="");var r=void 0===n?{}:n,o=r.keepClosed,a=void 0!==o&&o,u=r.fastClose,s=void 0===u||u,i=r.delay,c=void 0===i?0:i;if(h("close - params:",{reason:t,keepClosed:a,fastClose:s,delay:c,retriesCount:p,maxRetries:g.maxRetries}),v=!a&&p<=g.maxRetries,c&&(d=c),f.close(e,t),s){var l={code:e,reason:t,wasClean:!0};k(),f.removeEventListener("close",k),Array.isArray(m.close)&&m.close.forEach(function(e){var t=e[0],n=e[1];t(l),f.removeEventListener("close",t,n)}),f.onclose&&(y=f.onclose,f.onclose(l),f.onclose=null)}},this.send=function(e){f.send(e)},this.addEventListener=function(e,t,n){Array.isArray(m[e])?m[e].some(function(e){return e[0]===t})||m[e].push([t,n]):m[e]=[[t,n]],f.addEventListener(e,t,n)},this.removeEventListener=function(e,t,n){Array.isArray(m[e])&&(m[e]=m[e].filter(function(e){return e[0]!==t})),f.removeEventListener(e,t,n)}},a=o,t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function n(e,t){return e(t={exports:{}},t.exports),t.exports}var u,s=n(function(e,t){var n;"undefined"!=typeof self&&self,n=function(){return function(n){var r={};function o(e){if(r[e])return r[e].exports;var t=r[e]={i:e,l:!1,exports:{}};return n[e].call(t.exports,t,t.exports,o),t.l=!0,t.exports}return o.m=n,o.c=r,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:n})},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=5)}([function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){if(!isNaN(e))return e;var t=e.match(/^(?:(\d{2,}):)?(\d{2}):(\d{2})[,.](\d{3})$/);if(!t)throw new Error('Invalid SRT or VTT time format: "'+e+'"');var n=t[1]?36e5*parseInt(t[1],10):0,r=6e4*parseInt(t[2],10),o=1e3*parseInt(t[3],10),a=parseInt(t[4],10);return n+r+o+a}},function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){if(isNaN(e))return e;var t=new Date(0,0,0,0,0,0,e),n=(0,u.default)(2,t.getHours()),r=(0,u.default)(2,t.getMinutes()),o=(0,u.default)(2,t.getSeconds()),a=e-(36e5*n+6e4*r+1e3*o);return n+":"+r+":"+o+","+(0,u.default)(3,a)};var r,o=n(2),u=(r=o)&&r.__esModule?r:{default:r}},function(e,t){e.exports=function n(r,e,t){return void 0===e?function(e,t){return n(r,e,t)}:(void 0===t&&(t="0"),0<(r-=e.toString().length)?new Array(r+(/\./.test(e)?2:1)).join(t)+e:e+"")}},function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){if(isNaN(e))return e;var t=new Date(0,0,0,0,0,0,e),n=(0,u.default)(2,t.getHours()),r=(0,u.default)(2,t.getMinutes()),o=(0,u.default)(2,t.getSeconds()),a=e-(36e5*n+6e4*r+1e3*o);return n+":"+r+":"+o+"."+(0,u.default)(3,a)};var r,o=n(2),u=(r=o)&&r.__esModule?r:{default:r}},function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t=u.exec(e),n={start:(0,a.default)(t[1]),end:(0,a.default)(t[2])};t[3]&&(n.settings=t[3]);return n};var r,o=n(0),a=(r=o)&&r.__esModule?r:{default:r};var u=/^((?:\d{2,}:)?\d{2}:\d{2}[,.]\d{3}) --> ((?:\d{2,}:)?\d{2}:\d{2}[,.]\d{3})(?: (.*))?$/},function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0});var r=n(0);Object.defineProperty(t,"toMS",{enumerable:!0,get:function(){return f(r).default}});var o=n(1);Object.defineProperty(t,"toSrtTime",{enumerable:!0,get:function(){return f(o).default}});var a=n(3);Object.defineProperty(t,"toVttTime",{enumerable:!0,get:function(){return f(a).default}});var u=n(6);Object.defineProperty(t,"parse",{enumerable:!0,get:function(){return f(u).default}});var s=n(7);Object.defineProperty(t,"stringify",{enumerable:!0,get:function(){return f(s).default}});var i=n(8);Object.defineProperty(t,"stringifyVtt",{enumerable:!0,get:function(){return f(i).default}});var c=n(9);Object.defineProperty(t,"resync",{enumerable:!0,get:function(){return f(c).default}});var l=n(4);function f(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"parseTimestamps",{enumerable:!0,get:function(){return f(l).default}})},function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){if(!e)return[];var o=e.trim().concat("\n").replace(/\r\n/g,"\n").replace(/\n{3,}/g,"\n\n").replace(/^WEBVTT.*\n{2}/,"").split("\n");return o.reduce(function(e,t,n){var r=e[e.length-1];return!r.index&&/^\d+$/.test(t)?r.index=parseInt(t,10):r.hasOwnProperty("start")?""===t?(delete r.index,n!==o.length-1&&e.push({})):r.text=r.text?r.text+"\n"+t:t:Object.assign(r,(0,a.default)(t)),e},[{}])};var r,o=n(4),a=(r=o)&&r.__esModule?r:{default:r}},function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return e.map(function(e,t){return(0<t?"\n":"")+[t+1,(0,a.default)(e.start)+" --\x3e "+(0,a.default)(e.end),e.text].join("\n")}).join("\n")+"\n"};var r,o=n(1),a=(r=o)&&r.__esModule?r:{default:r}},function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return"WEBVTT\n\n"+e.map(function(e,t){return(0<t?"\n":"")+[t+1,(0,a.default)(e.start)+" --\x3e "+(0,a.default)(e.end)+(e.settings?" "+e.settings:""),e.text].join("\n")}).join("\n")+"\n"};var r,o=n(3),a=(r=o)&&r.__esModule?r:{default:r}},function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,r){return e.map(function(e){var t=(0,a.default)(e.start)+r,n=(0,a.default)(e.end)+r;return Object.assign({},e,{start:t,end:n})})};var r,o=n(0),a=(r=o)&&r.__esModule?r:{default:r}}])},e.exports=n()}),i=(u=s)&&u.__esModule&&Object.prototype.hasOwnProperty.call(u,"default")?u.default:u,c=(s.Subtitle,"undefined"!=typeof window?window:void 0!==t?t:"undefined"!=typeof self?self:{}),l=function(e){var t=d.call(e);return"[object Function]"===t||"function"==typeof e&&"[object RegExp]"!==t||"undefined"!=typeof window&&(e===window.setTimeout||e===window.alert||e===window.confirm||e===window.prompt)},d=Object.prototype.toString;var p=n(function(e,t){(t=e.exports=function(e){return e.replace(/^\s*|\s*$/g,"")}).left=function(e){return e.replace(/^\s*/,"")},t.right=function(e){return e.replace(/\s*$/,"")}}),v=(p.left,p.right,Function.prototype.toString),y=/^\s*class\b/,m=function(e){try{var t=v.call(e);return y.test(t)}catch(e){return!1}},g=Object.prototype.toString,h="function"==typeof Symbol&&"symbol"==typeof Symbol.toStringTag,k=function(e){if(!e)return!1;if("function"!=typeof e&&"object"!=typeof e)return!1;if("function"==typeof e&&!e.prototype)return!0;if(h)return function(e){try{return!m(e)&&(v.call(e),!0)}catch(e){return!1}}(e);if(m(e))return!1;var t=g.call(e);return"[object Function]"===t||"[object GeneratorFunction]"===t},j=Object.prototype.toString,q=Object.prototype.hasOwnProperty,T=function(e,t,n){if(!k(t))throw new TypeError("iterator must be a function");var r;3<=arguments.length&&(r=n),"[object Array]"===j.call(e)?function(e,t,n){for(var r=0,o=e.length;r<o;r++)q.call(e,r)&&(null==n?t(e[r],r,e):t.call(n,e[r],r,e))}(e,t,r):"string"==typeof e?function(e,t,n){for(var r=0,o=e.length;r<o;r++)null==n?t(e.charAt(r),r,e):t.call(n,e.charAt(r),r,e)}(e,t,r):function(e,t,n){for(var r in e)q.call(e,r)&&(null==n?t(e[r],r,e):t.call(n,e[r],r,e))}(e,t,r)},E=function(e){if(!e)return{};var a={};return T(p(e).split("\n"),function(e){var t,n=e.indexOf(":"),r=p(e.slice(0,n)).toLowerCase(),o=p(e.slice(n+1));void 0===a[r]?a[r]=o:(t=a[r],"[object Array]"===Object.prototype.toString.call(t)?a[r].push(o):a[r]=[a[r],o])}),a},O=function(){for(var e={},t=0;t<arguments.length;t++){var n=arguments[t];for(var r in n)N.call(n,r)&&(e[r]=n[r])}return e},N=Object.prototype.hasOwnProperty;var M=P,R=P;function x(e,t,n){var r=e;return l(t)?(n=t,"string"==typeof e&&(r={uri:e})):r=O(t,{uri:e}),r.callback=n,r}function P(e,t,n){return S(t=x(e,t,n))}function S(r){if(void 0===r.callback)throw new Error("callback argument missing");var o=!1,a=function(e,t,n){o||(o=!0,r.callback(e,t,n))};function t(e){return clearTimeout(i),e instanceof Error||(e=new Error(""+(e||"Unknown XMLHttpRequest Error"))),e.statusCode=0,a(e,y)}function e(){if(!u){var e;clearTimeout(i),e=r.useXDR&&void 0===s.status?200:1223===s.status?204:s.status;var t=y,n=null;return 0!==e?(t={body:function(){var e=void 0;if(e=s.response?s.response:s.responseText||function(e){try{if("document"===e.responseType)return e.responseXML;var t=e.responseXML&&"parsererror"===e.responseXML.documentElement.nodeName;if(""===e.responseType&&!t)return e.responseXML}catch(e){}return null}(s),v)try{e=JSON.parse(e)}catch(e){}return e}(),statusCode:e,method:l,headers:{},url:c,rawRequest:s},s.getAllResponseHeaders&&(t.headers=E(s.getAllResponseHeaders()))):n=new Error("Internal XMLHttpRequest Error"),a(n,t,t.body)}}var n,u,s=r.xhr||null;s||(s=r.cors||r.useXDR?new P.XDomainRequest:new P.XMLHttpRequest);var i,c=s.url=r.uri||r.url,l=s.method=r.method||"GET",f=r.body||r.data,d=s.headers=r.headers||{},p=!!r.sync,v=!1,y={body:void 0,headers:{},statusCode:0,method:l,url:c,rawRequest:s};if("json"in r&&!1!==r.json&&(v=!0,d.accept||d.Accept||(d.Accept="application/json"),"GET"!==l&&"HEAD"!==l&&(d["content-type"]||d["Content-Type"]||(d["Content-Type"]="application/json"),f=JSON.stringify(!0===r.json?f:r.json))),s.onreadystatechange=function(){4===s.readyState&&setTimeout(e,0)},s.onload=e,s.onerror=t,s.onprogress=function(){},s.onabort=function(){u=!0},s.ontimeout=t,s.open(l,c,!p,r.username,r.password),p||(s.withCredentials=!!r.withCredentials),!p&&0<r.timeout&&(i=setTimeout(function(){if(!u){u=!0,s.abort("timeout");var e=new Error("XMLHttpRequest timeout");e.code="ETIMEDOUT",t(e)}},r.timeout)),s.setRequestHeader)for(n in d)d.hasOwnProperty(n)&&s.setRequestHeader(n,d[n]);else if(r.headers&&!function(e){for(var t in e)if(e.hasOwnProperty(t))return!1;return!0}(r.headers))throw new Error("Headers cannot be set on an XDomainRequest object");return"responseType"in r&&(s.responseType=r.responseType),"beforeSend"in r&&"function"==typeof r.beforeSend&&r.beforeSend(s),s.send(f||null),s}function L(e,t,r){M({method:"GET",uri:"https://"+X()+"/queue/"+H()+"/"+t+".json",useXDR:!0,json:!0},function(e,t,n){200===t.statusCode?r(n.data):console.log(e,t,n)})}function C(e){return Math.floor(e/60)+":"+(Math.floor(e%60)+"").padStart(2,"0")}function D(e,t,n){for(var r=0;r<t.attachments.length;r++)if(t.attachments[r].type===n)return A()+"//"+X()+"/files/"+t.attachments[r].location;return""}function A(){return"file:"===document.location.protocol?"https:":document.location.protocol}function X(){return"file:"===document.location.protocol?"karakara.org.uk":document.location.hostname}function H(){return"file:"===document.location.protocol?"demo":function(e){for(var t=window.location.search.substring(1).split("&"),n=0;n<t.length;n++){var r=t[n].split("=");if(r[0]==e)return decodeURIComponent(r[1])}return""}("queue_id")}P.XMLHttpRequest=c.XMLHttpRequest||function(){},P.XDomainRequest="withCredentials"in new P.XMLHttpRequest?P.XMLHttpRequest:c.XDomainRequest,function(e,t){for(var n=0;n<e.length;n++)t(e[n])}(["get","put","post","patch","head","delete"],function(r){P["delete"===r?"del":r]=function(e,t,n){return(t=x(e,t,n)).method=r.toUpperCase(),S(t)}}),M.default=R;var I=function(e){var o=e.state;return f("div",{className:"lyrics"},[f("ol",null,[o.queue[0].track.lyrics.map(function(e){return f("li",{key:e.start,className:(t=e,n=o,r=1e3*n.progress,n.playing?"-"===t.text?"past":t.start<r&&t.end>r?"present":t.end<r?"past":t.start>r?"future":void 0:"present")},[f("span",null,[e.text])]);var t,n,r})])])},W=function(e){var t=e.state;e.actions;return f("div",{className:"screen_preview"},[f("div",{className:"preview_holder"},[f("video",{src:D(0,t.queue[0].track,"preview"),poster:D(0,t.queue[0].track,"thumbnail"),autoPlay:!0,loop:!0,muted:!0}),f("video",{src:D(0,t.queue[0].track,"video"),preload:"auto",muted:!0,style:{display:"none"}})]),f("div",{id:"playlist",key:"playlist"},[f("ol",null,[t.queue.slice(0,5).map(function(e){return f("li",{key:e.time_touched},[f("img",{src:D(0,e.track,"image")}),f("p",{className:"title"},[e.track.tags.title[0]]),f("p",{className:"from"},[e.track.tags.from[0]]),f("p",{className:"performer"},[e.performer_name]),f("p",{className:"time"},[f("span",null,[(t=1e3*e.total_duration,n=Math.floor(t/1e3),r=n%60,o=Math.floor(n/60),1<=o?o+"min":0===r?"Now":r+"sec")])])]);var t,n,r,o})])]),5<t.queue.length&&f("div",{id:"playlist_obscured",key:"playlist_obscured"},[f("ul",null,[t.queue.slice(5).map(function(e){return f("li",{key:e.time_touched},[e.performer_name])})])]),f("div",{id:"join_info",key:"join_info"},["Join at ",f("strong",null,[X()])," - Queue is ",f("strong",null,[H()]),t.settings["karakara.event.end"]&&f("span",null,[f("br"),"Event ends at ",f("strong",null,[t.settings["karakara.event.end"]])])])])};var B=function(e,t,n,r){var o,a=[].map,u=r&&r.children[0]||null,s=u&&function t(e){return{nodeName:e.nodeName.toLowerCase(),attributes:{},children:a.call(e.childNodes,function(e){return 3===e.nodeType?e.nodeValue:t(e)})}}(u),g=[],h=!0,i=b(e),c=function e(r,o,a){for(var t in a)"function"==typeof a[t]?function(e,n){a[e]=function(e){var t=n(e);return"function"==typeof t&&(t=t(p(r,i),a)),t&&t!==(o=p(r,i))&&!t.then&&f(i=d(r,b(o,t),i)),t}}(t,a[t]):e(r.concat(t),o[t]=b(o[t]),a[t]=b(a[t]));return a}([],i,b(t));return f(),c;function k(e){return"function"==typeof e?k(e(i,c)):null!=e?e:""}function l(){o=!o;var e=k(n);for(r&&!o&&(u=function e(t,n,r,o,a){if(o===r);else if(null==r||r.nodeName!==o.nodeName){var u=function e(t,n){var r="string"==typeof t||"number"==typeof t?document.createTextNode(t):(n=n||"svg"===t.nodeName)?document.createElementNS("http://www.w3.org/2000/svg",t.nodeName):document.createElement(t.nodeName),o=t.attributes;if(o){o.oncreate&&g.push(function(){o.oncreate(r)});for(var a=0;a<t.children.length;a++)r.appendChild(e(t.children[a]=k(t.children[a]),n));for(var u in o)_(r,u,o[u],null,n)}return r}(o,a);t.insertBefore(u,n),null!=r&&j(t,n,r),n=u}else if(null==r.nodeName)n.nodeValue=o;else{!function(e,t,n,r){for(var o in b(t,n))n[o]!==("value"===o||"checked"===o?e[o]:t[o])&&_(e,o,n[o],t[o],r);var a=h?n.oncreate:n.onupdate;a&&g.push(function(){a(e,t)})}(n,r.attributes,o.attributes,a=a||"svg"===o.nodeName);for(var s={},i={},c=[],l=r.children,f=o.children,d=0;d<l.length;d++){c[d]=n.childNodes[d];var p=w(l[d]);null!=p&&(s[p]=[c[d],l[d]])}for(var d=0,v=0;v<f.length;){var p=w(l[d]),y=w(f[v]=k(f[v]));if(i[p])d++;else if(null==y||y!==w(l[d+1]))if(null==y||h)null==p&&(e(n,c[d],l[d],f[v],a),v++),d++;else{var m=s[y]||[];p===y?(e(n,m[0],m[1],f[v],a),d++):m[0]?e(n,n.insertBefore(m[0],c[d]),m[1],f[v],a):e(n,c[d],null,f[v],a),i[y]=f[v],v++}else null==p&&j(n,c[d],l[d]),d++}for(;d<l.length;)null==w(l[d])&&j(n,c[d],l[d]),d++;for(var d in s)i[d]||j(n,s[d][0],s[d][1])}return n}(r,u,s,s=e)),h=!1;g.length;)g.pop()()}function f(){o||(o=!0,setTimeout(l))}function b(e,t){var n={};for(var r in e)n[r]=e[r];for(var r in t)n[r]=t[r];return n}function d(e,t,n){var r={};return e.length?(r[e[0]]=1<e.length?d(e.slice(1),t,n[e[0]]):t,b(n,r)):t}function p(e,t){for(var n=0;n<e.length;)t=t[e[n++]];return t}function w(e){return e?e.key:null}function v(e){return e.currentTarget.events[e.type](e)}function _(e,t,n,r,o){if("key"===t);else if("style"===t)for(var a in b(r,n)){var u=null==n||null==n[a]?"":n[a];"-"===a[0]?e[t].setProperty(a,u):e[t][a]=u}else"o"===t[0]&&"n"===t[1]?(t=t.slice(2),e.events?r||(r=e.events[t]):e.events={},(e.events[t]=n)?r||e.addEventListener(t,v):e.removeEventListener(t,v)):t in e&&"list"!==t&&"type"!==t&&"draggable"!==t&&"spellcheck"!==t&&"translate"!==t&&!o?e[t]=null==n?"":n:null!=n&&!1!==n&&e.setAttribute(t,n),null!=n&&!1!==n||e.removeAttribute(t)}function j(e,t,n){function r(){e.removeChild(function e(t,n){var r=n.attributes;if(r){for(var o=0;o<n.children.length;o++)e(t.childNodes[o],n.children[o]);r.ondestroy&&r.ondestroy(t)}return t}(t,n))}var o=n.attributes&&n.attributes.onremove;o?o(t,r):r()}}({connected:!1,settings:{"karakara.player.title":"KaraKara","karakara.player.theme":"metalghosts","karakara.player.video.preview_volume":.2,"karakara.player.video.skip.seconds":20,"karakara.player.autoplay":30,"karakara.player.subs_on_screen":!0,"karakara.websocket.path":"/ws/","karakara.websocket.port":null,"karakara.event.end":null},socket:null,queue:[],playing:!1,paused:!1,progress:0},{dequeue:function(){return function(e){return{queue:e.queue.slice(1),playing:!1,paused:!1,progress:0}}},play:function(){return function(e){return{playing:!0,paused:!!e.playing&&e.paused,progress:e.playing?e.progress:0}}},stop:function(){return function(){return{playing:!1,paused:!1,progress:0}}},get_state:function(){return function(e){return e}},set_socket:function(e){return function(){return{socket:e}}},set_progress:function(e){return function(){return{progress:e}}},set_connected:function(e){return function(){return{connected:e}}},send_play:function(e){return function(e,t){e.socket.send("play")}},send_ended:function(e){return function(e,t){e.socket.send("ended")}},check_settings:function(){return function(t,n){L(0,"settings",function(e){n.set_settings(Object.assign(t.settings,e.settings))})}},set_settings:function(e){return function(){return{settings:e}}},check_queue:function(){return function(e,r){L(0,"queue_items",function(e){function t(e){var t,n,r;return e.track.lyrics=(t=e.track,n=new XMLHttpRequest,r="",n.open("GET",D(0,t,"srt"),!1),n.onload=function(e){r=e.target.responseText},n.send(),i.parse(r)),e}var n=e.queue.map(function(e){return t(e)});r.set_queue(n)})}},set_queue:function(e){return function(){return{queue:e}}},pause:function(e){return function(e,t){var n=document.getElementsByTagName("video")[0];return n&&(e.paused?n.play():n.pause()),{paused:!e.paused}}},seek_forwards:function(e){return function(e,t){var n=e.settings["karakara.player.video.skip.seconds"],r=document.getElementsByTagName("video")[0];return r&&(r.currentTime+=n),{progress:e.progress+n}}},seek_backwards:function(e){return function(e,t){var n=e.settings["karakara.player.video.skip.seconds"],r=document.getElementsByTagName("video")[0];return r&&(r.currentTime-=n),{progress:e.progress-n}}}},function(e,t){var n,r,o,a,u,s,i=f("div",null,["Unknown state :("]);return 0===e.queue.length?(c={state:e,actions:t},l=c.state,c.actions,i=f("div",{className:"screen_title"},[f("h1",null,[l.settings["karakara.player.title"]]),f("div",{id:"join_info"},["Join at ",f("strong",null,[X()])," - Queue is ",f("strong",null,[H()])])])):"#podium"===window.location.hash?(u=(a={state:e,actions:t}).state,s=a.actions,i=f("div",{className:"screen_podium"},[f("h1",null,[u.queue[0].performer_name," - ",u.queue[0].track.tags.title[0]]),I({state:u}),u.playing?f("div",{className:"progressBar",style:{"background-position":100-u.progress/u.queue[0].track.duration*100+"%"}},["Track Playing",f("small",null,["(",C(u.progress)," ","/"," ",C(u.queue[0].track.duration),")"])]):f("div",{className:"startButton",onclick:function(){return s.send_play()},style:{"background-position":100-u.progress/u.settings["karakara.player.autoplay"]*100+"%"}},[f("span",null,["Press to Start",0===u.settings["karakara.player.autoplay"]?f("small",null,["(autoplay disabled)"]):f("small",null,["(autoplay in ",Math.ceil(u.settings["karakara.player.autoplay"]-u.progress)," seconds)"])])])])):0<e.queue.length&&!e.playing?i=W({state:e,actions:t}):0<e.queue.length&&e.playing&&(r=(n={state:e,actions:t}).state,o=n.actions,i=f("div",{className:"screen_video"},[f("video",{src:D(0,r.queue[0].track,"video"),autoPlay:!0,ontimeupdate:function(e){return o.set_progress(e.target.currentTime)},onended:function(){return o.send_ended()}}),f("div",{id:"seekbar",style:{left:r.progress/r.queue[0].track.duration*100+"%"}}),f("div",{id:"pimpkk",className:"pimp"},["KaraKara"]),f("div",{id:"pimpsong",className:"pimp"},[r.queue[0].track.tags.title[0],f("br"),"Performed by ",r.queue[0].performer_name]),r.settings["karakara.player.subs_on_screen"]?I({state:r}):null])),f("div",{className:"theme-"+e.settings["karakara.player.theme"]},[i]);var c,l},document.body);if(B.set_socket(function(){var e=B.get_state().settings,t=e["karakara.websocket.path"],n=e["karakara.websocket.port"];if(n||t){var r=("http:"===A()?"ws://":"wss://")+X()+(n&&!t?":"+n:"")+(t||"");console.log("setup_websocket",r);var o=new a(r);return o.onopen=function(){var e=document.cookie.match(/karakara_session=([^;\s]+)/)[1];o.send(e),B.set_connected(!0),B.check_settings(),B.check_queue()},o.onclose=function(){B.set_connected(!1)},o.onmessage=function(e){var t=e.data.trim();console.log("Websocket: Remote command: "+t);var n={skip:B.dequeue,play:B.play,stop:B.stop,pause:B.pause,seek_forwards:B.seek_forwards,seek_backwards:B.seek_backwards,ended:B.dequeue,queue_updated:B.check_queue,settings:B.check_settings};t in n?n[t]():console.log("unknown command: "+t)},o}console.error("setup_websocket","Websocket port or path not specified - remote control disabled")}()),document.onkeydown=function(e){var t=!0;switch(e.key){case"s":B.dequeue();break;case"Enter":B.play();break;case"Escape":B.stop();break;case"ArrowLeft":B.seek_backwards();break;case"ArrowRight":B.seek_forwards();break;case"Space":B.pause();break;default:t=!1}t&&e.preventDefault()},"#podium"===window.location.hash){setInterval(function(){var e=B.get_state();if(!e.paused)if(e.playing)e.progress>=e.queue[0].track.duration?B.dequeue():B.set_progress(e.progress+.2);else{if(0===e.settings["karakara.player.autoplay"])return;e.progress>=e.settings["karakara.player.autoplay"]?B.send_play():B.set_progress(e.progress+.2)}},200)}}();
//# sourceMappingURL=player.js.map
