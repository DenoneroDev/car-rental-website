(()=>{"use strict";$("#cars");const e=$("#search"),t=$("#menue-button"),a=$("#menue"),n=$(".number"),s=$("#search-icon"),o=$(".logo"),i=$("#search"),c=$("#header"),r=$("#search-input"),l=$("#loading");$("#error"),$("#msg");let d,h=!1,u=!1,g=!0,p=!0,m=!0;const f=new URL(window.location);let w;function v(){p&&(p=!1,u?(r.focusout(),c.css({"justify-content":"space-around"}),i.css({border:"none"}),s.css({position:"absolute",top:`${s.position().top}px`,left:`${s.position().left}px`}),s.animate({left:"65.4219px"},250,(()=>{s.css({position:"unset"})})),r.animate({width:"0"},250,(()=>{r.hide(),m?$(n).showFlex():t.show(),$(o[0]).show(),u=!1,p=!0}))):(m=$(n[0]).is(":visible"),c.css({"justify-content":"center"}),i.css({border:"1px solid var(--black)"}),r.width(0),r.show(),$(o[0]).hide(),$(n[0]).hide(),t.hide(),r.animate({width:"100%"},250,(()=>{u=!0,p=!0,r.focus()}))))}function y(){if(g)if(g=!1,t.toggleClass("open"),h)a.animate({height:0,padding:0},250,(()=>{a.hide(),h=!1,g=!0}));else{a.showGrid(),a.css("height","auto"),a.css("padding","20px");const e=a.outerHeight();a.height(0),a.animate({height:e},250,(()=>{h=!0,g=!0}))}}$(document).ready((function(){c.height(c.height());for(var n=1;n<=26;n++){var o=175-25*Math.ceil(n/2),r=-.1*n+"s";n%2==0&&(r=-(.1*n+1)+"s");var l=$('<div class="dot"></div>').css("animation-delay",r).css("left",o+"px"),d=$("<div></div>").css("animation-delay",r);l.append(d),$(".loader").append(l)}t.click((()=>y())),e.submit((e=>{e.preventDefault(),f.pathname="/browse",f.searchParams.set("page",1);const t=$("#search-input").val();""!=t?f.searchParams.set("search",t):f.searchParams.delete("search"),location.href=f.href})),$(document).bind("mouseup touchend",(e=>{!h||a.is(e.target)||0!==a.has(e.target).length||0!=t.has(e.target).length||t.is(e.target)||y(),u&&!i.is(e.target)&&0===i.has(e.target).length&&v()})).on("scroll",(()=>{h&&y(),u&&v()})),document.body.clientWidth<=1e3&&s.click((()=>v()))})),Array.prototype.remove=function(e){const t=this.indexOf(e);-1!==t&&this.splice(t,1)},$.fn.showFlex=function(){this.css({display:"flex"})},$.fn.showGrid=function(){this.css({display:"grid"})};$("#menue .contact");const b={lang:null,dropdown:null,section:null,init:()=>{b.section=document.getElementById("language"),b.dropdown=new Choices(b.section,{removeItemButton:!0,duplicateItemsAllowed:!1,editItems:!0,searchEnabled:!1,searchChoices:!1,allowHTML:!0});const e={english:"en",deutsch:"de",čeština:"cs"};var t;b.lang=$("html").attr("lang"),b.dropdown._findAndSelectChoiceByValue((t=function(e,t){for(const a in e)if(e.hasOwnProperty(a)&&e[a]===t)return a;return null}(e,b.lang)).charAt(0).toUpperCase()+t.slice(1)),b.section.addEventListener("change",(t=>{Cookies.set("language",e[t.target.value.toLowerCase()]),$("html").attr("lang",e[t.target.value.toLowerCase()]),b.update()})),b.update()},update:()=>{b.lang=$("html").attr("lang"),w.special(),$("[data-langKey]").each(((e,t)=>{const a=w[$(t).data().langkey][b.lang];if("INPUT"===$(t).get(0).nodeName||"TEXTAREA"===$(t).get(0).nodeName)return $(t).attr("placeholder",a);$(t).html(a)}))}},x={"search-input-placeholder":{en:"Search...",de:"Suchen...",cs:"Hledat..."},"navigation-home":{en:"Home",de:"Startseite",cs:"Domů"},"navigation-browse":{en:"Browse",de:"Durchsuchen",cs:"Prohlížet"},"navigation-aboutus":{en:"About Us",de:"Über uns",cs:"O nás"},"navigation-favorites":{en:"My Favorites",de:"Meine Favoriten",cs:"Mé oblíbené"}};$(document).ready((async()=>{w=x,x.special=()=>{};const e=await $.ajax({url:"/api/page",data:{slug:new URL(location.href).searchParams.get("slug")||""},error:e=>{location.href="/error/404"}});await async function(e=""){d=new Quill("#quill-editor",{theme:"snow",readOnly:!0}),d.root.innerHTML=e}(e.content),document.title=document.title.replace("Page",e.title),b.init(),l.fadeOut(),$("html").css({overflow:"auto"})}))})();