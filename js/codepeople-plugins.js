﻿// Namespace
var mejs = mejs || {};
var avpjQuery;
if(jQuery && parseInt(jQuery.fn.jquery.replace(/\./g, '')) >= 183){
    avpjQuery = jQuery.noConflict();
    codepeople_avp(avpjQuery);
    
}else{
    jQuery.ajax({
      url: 'http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js',
      dataType: "script",
      success: function(data){
        codepeople_avp(jQuery.noConflict());
      }
    });
}
	
function codepeople_avp($){
var jQuery = $;

// MEJS CODE
/*!
* MediaElement.js
* HTML5 <video> and <audio> shim and player
* http://mediaelementjs.com/
*
* Creates a JavaScript object that mimics HTML5 MediaElement API
* for browsers that don't understand HTML5 or can't play the provided codec
* Can play MP4 (H.264), Ogg, WebM, FLV, WMV, WMA, ACC, and MP3
*
* Copyright 2010-2012, John Dyer (http://j.hn)
* Dual licensed under the MIT or GPL Version 2 licenses.
*
*/
var mejs=mejs||{};mejs.version="2.10.1";mejs.meIndex=0;mejs.plugins={silverlight:[{version:[3,0],types:["video/mp4","video/m4v","video/mov","video/wmv","audio/wma","audio/m4a","audio/mp3","audio/wav","audio/mpeg"]}],flash:[{version:[9,0,124],types:["video/mp4","video/m4v","video/mov","video/flv","video/rtmp","video/x-flv","audio/flv","audio/x-flv","audio/mp3","audio/m4a","audio/mpeg","video/youtube","video/x-youtube"]}],youtube:[{version:null,types:["video/youtube","video/x-youtube"]}],vimeo:[{version:null,types:["video/vimeo","video/x-vimeo"]}]};mejs.Utility={encodeUrl:function(a){return encodeURIComponent(a)},escapeHTML:function(a){return a.toString().split("&").join("&amp;").split("<").join("&lt;").split('"').join("&quot;")},absolutizeUrl:function(a){var b=document.createElement("div");b.innerHTML='<a href="'+this.escapeHTML(a)+'">x</a>';return b.firstChild.href},getScriptPath:function(h){var e=0,c,k="",a="",f,b=document.getElementsByTagName("script"),g=b.length,d=h.length;for(;e<g;e++){f=b[e].src;for(c=0;c<d;c++){a=h[c];if(f.indexOf(a)>-1){k=f.substring(0,f.indexOf(a));break}}if(k!==""){break}}return k},secondsToTimeCode:function(c,g,a,b){if(typeof a=="undefined"){a=false}else{if(typeof b=="undefined"){b=25}}var f=Math.floor(c/3600)%24,d=Math.floor(c/60)%60,h=Math.floor(c%60),e=Math.floor(((c%1)*b).toFixed(3)),j=((g||f>0)?(f<10?"0"+f:f)+":":"")+(d<10?"0"+d:d)+":"+(h<10?"0"+h:h)+((a)?":"+(e<10?"0"+e:e):"");return j},timeCodeToSeconds:function(c,k,d,e){if(typeof d=="undefined"){d=false}else{if(typeof e=="undefined"){e=25}}var f=c.split(":"),a=parseInt(f[0],10),b=parseInt(f[1],10),h=parseInt(f[2],10),j=0,g=0;if(d){j=parseInt(f[3])/e}g=(a*3600)+(b*60)+h+j;return g},convertSMPTEtoSeconds:function(a){if(typeof a!="string"){return false}a=a.replace(",",".");var d=0,b=(a.indexOf(".")!=-1)?a.split(".")[1].length:0,e=1;a=a.split(":").reverse();for(var c=0;c<a.length;c++){e=1;if(c>0){e=Math.pow(60,c)}d+=Number(a[c])*e}return Number(d.toFixed(b))},removeSwf:function(b){var a=document.getElementById(b);if(a&&a.nodeName=="OBJECT"){if(mejs.MediaFeatures.isIE){a.style.display="none";(function(){if(a.readyState==4){mejs.Utility.removeObjectInIE(b)}else{setTimeout(arguments.callee,10)}})()}else{a.parentNode.removeChild(a)}}},removeObjectInIE:function(c){var b=document.getElementById(c);if(b){for(var a in b){if(typeof b[a]=="function"){b[a]=null}}b.parentNode.removeChild(b)}}};mejs.PluginDetector={hasPluginVersion:function(c,a){var b=this.plugins[c];a[1]=a[1]||0;a[2]=a[2]||0;return(b[0]>a[0]||(b[0]==a[0]&&b[1]>a[1])||(b[0]==a[0]&&b[1]==a[1]&&b[2]>=a[2]))?true:false},nav:window.navigator,ua:window.navigator.userAgent.toLowerCase(),plugins:[],addPlugin:function(d,c,e,a,b){this.plugins[d]=this.detectPlugin(c,e,a,b)},detectPlugin:function(g,b,c,k){var h=[0,0,0],j,d,a;if(typeof(this.nav.plugins)!="undefined"&&typeof this.nav.plugins[g]=="object"){j=this.nav.plugins[g].description;if(j&&!(typeof this.nav.mimeTypes!="undefined"&&this.nav.mimeTypes[b]&&!this.nav.mimeTypes[b].enabledPlugin)){h=j.replace(g,"").replace(/^\s+/,"").replace(/\sr/gi,".").split(".");for(d=0;d<h.length;d++){h[d]=parseInt(h[d].match(/\d+/),10)}}}else{if(typeof(window.ActiveXObject)!="undefined"){try{a=new ActiveXObject(c);if(a){h=k(a)}}catch(f){}}}return h}};mejs.PluginDetector.addPlugin("flash","Shockwave Flash","application/x-shockwave-flash","ShockwaveFlash.ShockwaveFlash",function(b){var a=[],c=b.GetVariable("$version");if(c){c=c.split(" ")[1].split(",");a=[parseInt(c[0],10),parseInt(c[1],10),parseInt(c[2],10)]}return a});mejs.PluginDetector.addPlugin("silverlight","Silverlight Plug-In","application/x-silverlight-2","AgControl.AgControl",function(b){var a=[0,0,0,0],c=function(f,d,e,g){while(f.isVersionSupported(d[0]+"."+d[1]+"."+d[2]+"."+d[3])){d[e]+=g}d[e]-=g};c(b,a,0,1);c(b,a,1,1);c(b,a,2,10000);c(b,a,2,1000);c(b,a,2,100);c(b,a,2,10);c(b,a,2,1);c(b,a,3,1);return a});mejs.MediaFeatures={init:function(){var e=this,h=document,g=mejs.PluginDetector.nav,c=mejs.PluginDetector.ua.toLowerCase(),b,a,f=["source","track","audio","video"];e.isiPad=(c.match(/ipad/i)!==null);e.isiPhone=(c.match(/iphone/i)!==null);e.isiOS=e.isiPhone||e.isiPad;e.isAndroid=(c.match(/android/i)!==null);e.isBustedAndroid=(c.match(/android 2\.[12]/)!==null);e.isIE=(g.appName.toLowerCase().indexOf("microsoft")!=-1);e.isChrome=(c.match(/chrome/gi)!==null);e.isFirefox=(c.match(/firefox/gi)!==null);e.isWebkit=(c.match(/webkit/gi)!==null);e.isGecko=(c.match(/gecko/gi)!==null)&&!e.isWebkit;e.isOpera=(c.match(/opera/gi)!==null);e.hasTouch=("ontouchstart" in window);e.svg=!!document.createElementNS&&!!document.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect;for(b=0;b<f.length;b++){a=document.createElement(f[b])}e.supportsMediaTag=(typeof a.canPlayType!=="undefined"||e.isBustedAndroid);e.hasSemiNativeFullScreen=(typeof a.webkitEnterFullscreen!=="undefined");e.hasWebkitNativeFullScreen=(typeof a.webkitRequestFullScreen!=="undefined");e.hasMozNativeFullScreen=(typeof a.mozRequestFullScreen!=="undefined");e.hasTrueNativeFullScreen=(e.hasWebkitNativeFullScreen||e.hasMozNativeFullScreen);e.nativeFullScreenEnabled=e.hasTrueNativeFullScreen;if(e.hasMozNativeFullScreen){e.nativeFullScreenEnabled=a.mozFullScreenEnabled}if(this.isChrome){e.hasSemiNativeFullScreen=false}if(e.hasTrueNativeFullScreen){e.fullScreenEventName=(e.hasWebkitNativeFullScreen)?"webkitfullscreenchange":"mozfullscreenchange";e.isFullScreen=function(){if(a.mozRequestFullScreen){return h.mozFullScreen}else{if(a.webkitRequestFullScreen){return h.webkitIsFullScreen}}};e.requestFullScreen=function(d){if(e.hasWebkitNativeFullScreen){d.webkitRequestFullScreen()}else{if(e.hasMozNativeFullScreen){d.mozRequestFullScreen()}}};e.cancelFullScreen=function(){if(e.hasWebkitNativeFullScreen){document.webkitCancelFullScreen()}else{if(e.hasMozNativeFullScreen){document.mozCancelFullScreen()}}}}if(e.hasSemiNativeFullScreen&&c.match(/mac os x 10_5/i)){e.hasNativeFullScreen=false;e.hasSemiNativeFullScreen=false}}};mejs.MediaFeatures.init();mejs.HtmlMediaElement={pluginType:"native",isFullScreen:false,setCurrentTime:function(a){this.currentTime=a},setMuted:function(a){this.muted=a},setVolume:function(a){this.volume=a},stop:function(){this.pause()},setSrc:function(a){var c=this.getElementsByTagName("source");while(c.length>0){this.removeChild(c[0])}if(typeof a=="string"){this.src=a}else{var b,d;for(b=0;b<a.length;b++){d=a[b];if(this.canPlayType(d.type)){this.src=d.src;break}}}},setVideoSize:function(b,a){this.width=b;this.height=a}};mejs.PluginMediaElement=function(b,c,a){this.id=b;this.pluginType=c;this.src=a;this.events={}};mejs.PluginMediaElement.prototype={pluginElement:null,pluginType:"",isFullScreen:false,playbackRate:-1,defaultPlaybackRate:-1,seekable:[],played:[],paused:true,ended:false,seeking:false,duration:0,error:null,tagName:"",muted:false,volume:1,currentTime:0,play:function(){if(this.pluginApi!=null){if(this.pluginType=="youtube"){this.pluginApi.playVideo()}else{this.pluginApi.playMedia()}this.paused=false}},load:function(){if(this.pluginApi!=null){if(this.pluginType=="youtube"){}else{this.pluginApi.loadMedia()}this.paused=false}},pause:function(){if(this.pluginApi!=null){if(this.pluginType=="youtube"){this.pluginApi.pauseVideo()}else{this.pluginApi.pauseMedia()}this.paused=true}},stop:function(){if(this.pluginApi!=null){if(this.pluginType=="youtube"){this.pluginApi.stopVideo()}else{this.pluginApi.stopMedia()}this.paused=true}},canPlayType:function(e){var d,c,a,b=mejs.plugins[this.pluginType];for(d=0;d<b.length;d++){a=b[d];if(mejs.PluginDetector.hasPluginVersion(this.pluginType,a.version)){for(c=0;c<a.types.length;c++){if(e==a.types[c]){return true}}}}return false},positionFullscreenButton:function(a,c,b){if(this.pluginApi!=null&&this.pluginApi.positionFullscreenButton){this.pluginApi.positionFullscreenButton(a,c,b)}},hideFullscreenButton:function(){if(this.pluginApi!=null&&this.pluginApi.hideFullscreenButton){this.pluginApi.hideFullscreenButton()}},setSrc:function(a){if(typeof a=="string"){this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(a));this.src=mejs.Utility.absolutizeUrl(a)}else{var b,c;for(b=0;b<a.length;b++){c=a[b];if(this.canPlayType(c.type)){this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(c.src));this.src=mejs.Utility.absolutizeUrl(a);break}}}},setCurrentTime:function(a){if(this.pluginApi!=null){if(this.pluginType=="youtube"){this.pluginApi.seekTo(a)}else{this.pluginApi.setCurrentTime(a)}this.currentTime=a}},setVolume:function(a){if(this.pluginApi!=null){if(this.pluginType=="youtube"){this.pluginApi.setVolume(a*100)}else{this.pluginApi.setVolume(a)}this.volume=a}},setMuted:function(a){if(this.pluginApi!=null){if(this.pluginType=="youtube"){if(a){this.pluginApi.mute()}else{this.pluginApi.unMute()}this.muted=a;this.dispatchEvent("volumechange")}else{this.pluginApi.setMuted(a)}this.muted=a}},setVideoSize:function(b,a){if(this.pluginElement.style){this.pluginElement.style.width=b+"px";this.pluginElement.style.height=a+"px"}if(this.pluginApi!=null&&this.pluginApi.setVideoSize){this.pluginApi.setVideoSize(b,a)}},setFullscreen:function(a){if(this.pluginApi!=null&&this.pluginApi.setFullscreen){this.pluginApi.setFullscreen(a)}},enterFullScreen:function(){if(this.pluginApi!=null&&this.pluginApi.setFullscreen){this.setFullscreen(true)}},exitFullScreen:function(){if(this.pluginApi!=null&&this.pluginApi.setFullscreen){this.setFullscreen(false)}},addEventListener:function(b,c,a){this.events[b]=this.events[b]||[];this.events[b].push(c)},removeEventListener:function(a,c){if(!a){this.events={};return true}var b=this.events[a];if(!b){return true}if(!c){this.events[a]=[];return true}for(i=0;i<b.length;i++){if(b[i]===c){this.events[a].splice(i,1);return true}}return false},dispatchEvent:function(a){var c,b,d=this.events[a];if(d){b=Array.prototype.slice.call(arguments,1);for(c=0;c<d.length;c++){d[c].apply(null,b)}}},attributes:{},hasAttribute:function(a){return(a in this.attributes)},removeAttribute:function(a){delete this.attributes[a]},getAttribute:function(a){if(this.hasAttribute(a)){return this.attributes[a]}return""},setAttribute:function(a,b){this.attributes[a]=b},remove:function(){mejs.Utility.removeSwf(this.pluginElement.id)}};mejs.MediaPluginBridge={pluginMediaElements:{},htmlMediaElements:{},registerPluginElement:function(c,a,b){this.pluginMediaElements[c]=a;this.htmlMediaElements[c]=b},initPlugin:function(c){var a=this.pluginMediaElements[c],b=this.htmlMediaElements[c];if(a){switch(a.pluginType){case"flash":a.pluginElement=a.pluginApi=document.getElementById(c);break;case"silverlight":a.pluginElement=document.getElementById(a.id);a.pluginApi=a.pluginElement.Content.MediaElementJS;break}if(a.pluginApi!=null&&a.success){a.success(a,b)}}},fireEvent:function(h,c,b){var g,f,a,d=this.pluginMediaElements[h];g={type:c,target:d};for(f in b){d[f]=b[f];g[f]=b[f]}a=b.bufferedTime||0;g.target.buffered=g.buffered={start:function(e){return 0},end:function(e){return a},length:1};d.dispatchEvent(g.type,g)}};mejs.MediaElementDefaults={mode:"auto",plugins:["flash","silverlight","youtube","vimeo"],enablePluginDebug:false,type:"",pluginPath:mejs.Utility.getScriptPath(["mediaelement.js","mediaelement.min.js","mediaelement-and-player.js","mediaelement-and-player.min.js","codepeople-plugins.js"]),flashName:"flashmediaelement.swf",flashStreamer:"",enablePluginSmoothing:false,silverlightName:"silverlightmediaelement.xap",defaultVideoWidth:480,defaultVideoHeight:270,pluginWidth:-1,pluginHeight:-1,pluginVars:[],timerRate:250,startVolume:0.8,success:function(){},error:function(){}};mejs.MediaElement=function(a,b){return mejs.HtmlMediaElementShim.create(a,b)};mejs.HtmlMediaElementShim={create:function(e,d){var n=mejs.MediaElementDefaults,k=(typeof(e)=="string")?document.getElementById(e):e,h=k.tagName.toLowerCase(),g=(h==="audio"||h==="video"),b=(g)?k.getAttribute("src"):k.getAttribute("href"),l=k.getAttribute("poster"),f=k.getAttribute("autoplay"),j=k.getAttribute("preload"),m=k.getAttribute("controls"),a,c;for(c in d){n[c]=d[c]}b=(typeof b=="undefined"||b===null||b=="")?null:b;l=(typeof l=="undefined"||l===null)?"":l;j=(typeof j=="undefined"||j===null||j==="false")?"none":j;f=!(typeof f=="undefined"||f===null||f==="false");m=!(typeof m=="undefined"||m===null||m==="false");a=this.determinePlayback(k,n,mejs.MediaFeatures.supportsMediaTag,g,b);a.url=(a.url!==null)?mejs.Utility.absolutizeUrl(a.url):"";if(a.method=="native"){if(mejs.MediaFeatures.isBustedAndroid){k.src=a.url;k.addEventListener("click",function(){k.play()},false)}return this.updateNative(a,n,f,j)}else{if(a.method!==""){return this.createPlugin(a,n,l,f,j,m)}else{this.createErrorMessage(a,n,l);return this}}},determinePlayback:function(t,c,h,v,f){var o=[],s,r,q,p,m,d,g={method:"",url:"",htmlMediaElement:t,isVideo:(t.tagName.toLowerCase()!="audio")},a,b,u,w,e;if(typeof c.type!="undefined"&&c.type!==""){if(typeof c.type=="string"){o.push({type:c.type,url:f})}else{for(s=0;s<c.type.length;s++){o.push({type:c.type[s],url:f})}}}else{if(f!==null){d=this.formatType(f,t.getAttribute("type"));o.push({type:d,url:f})}else{for(s=0;s<t.childNodes.length;s++){m=t.childNodes[s];if(m.nodeType==1&&m.tagName.toLowerCase()=="source"){f=m.getAttribute("src");d=this.formatType(f,m.getAttribute("type"));e=m.getAttribute("media");if(!e||!window.matchMedia||(window.matchMedia&&window.matchMedia(e).matches)){o.push({type:d,url:f})}}}}}if(!v&&o.length>0&&o[0].url!==null&&this.getTypeFromFile(o[0].url).indexOf("audio")>-1){g.isVideo=false}if(mejs.MediaFeatures.isBustedAndroid){t.canPlayType=function(j){return(j.match(/video\/(mp4|m4v)/gi)!==null)?"maybe":""}}if(h&&(c.mode==="auto"||c.mode==="auto_plugin"||c.mode==="native")){if(!v){w=document.createElement(g.isVideo?"video":"audio");t.parentNode.insertBefore(w,t);t.style.display="none";g.htmlMediaElement=t=w}for(s=0;s<o.length;s++){if(t.canPlayType(o[s].type).replace(/no/,"")!==""||t.canPlayType(o[s].type.replace(/mp3/,"mpeg")).replace(/no/,"")!==""){g.method="native";g.url=o[s].url;break}}if(g.method==="native"){if(g.url!==null){t.src=g.url}if(c.mode!=="auto_plugin"){return g}}}if(c.mode==="auto"||c.mode==="auto_plugin"||c.mode==="shim"){for(s=0;s<o.length;s++){d=o[s].type;for(r=0;r<c.plugins.length;r++){a=c.plugins[r];b=mejs.plugins[a];for(q=0;q<b.length;q++){u=b[q];if(u.version==null||mejs.PluginDetector.hasPluginVersion(a,u.version)){for(p=0;p<u.types.length;p++){if(d==u.types[p]){g.method=a;g.url=o[s].url;return g}}}}}}}if(c.mode==="auto_plugin"&&g.method==="native"){return g}if(g.method===""&&o.length>0){g.url=o[0].url}return g},formatType:function(a,c){var b;if(a&&!c){return this.getTypeFromFile(a)}else{if(c&&~c.indexOf(";")){return c.substr(0,c.indexOf(";"))}else{return c}}},getTypeFromFile:function(a){a=a.split("?")[0];var b=a.substring(a.lastIndexOf(".")+1);return(/(mp4|m4v|ogg|ogv|webm|webmv|flv|wmv|mpeg|mov)/gi.test(b)?"video":"audio")+"/"+this.getTypeFromExtension(b)},getTypeFromExtension:function(a){switch(a){case"mp4":case"m4v":return"mp4";case"webm":case"webma":case"webmv":return"webm";case"ogg":case"oga":case"ogv":return"ogg";default:return a}},createErrorMessage:function(c,b,g){var d=c.htmlMediaElement,a=document.createElement("div");a.className="me-cannotplay";try{a.style.width=d.width+"px";a.style.height=d.height+"px"}catch(f){}a.innerHTML=(g!=="")?'<a href="'+c.url+'"><img src="'+g+'" width="100%" height="100%" /></a>':'<a href="'+c.url+'"><span>'+mejs.i18n.t("Download File")+"</span></a>";d.parentNode.insertBefore(a,d);d.style.display="none";b.error(d)},createPlugin:function(n,a,c,e,d,h){var r=n.htmlMediaElement,m=1,l=1,s="me_"+n.method+"_"+(mejs.meIndex++),o=new mejs.PluginMediaElement(s,n.method,n.url),g=document.createElement("div"),b,p,j;o.tagName=r.tagName;for(var q=0;q<r.attributes.length;q++){var f=r.attributes[q];if(f.specified==true){o.setAttribute(f.name,f.value)}}p=r.parentNode;while(p!==null&&p.tagName.toLowerCase()!="body"){if(p.parentNode.tagName.toLowerCase()=="p"){p.parentNode.parentNode.insertBefore(p,p.parentNode);break}p=p.parentNode}if(n.isVideo){m=(a.videoWidth>0)?a.videoWidth:(r.getAttribute("width")!==null)?r.getAttribute("width"):a.defaultVideoWidth;l=(a.videoHeight>0)?a.videoHeight:(r.getAttribute("height")!==null)?r.getAttribute("height"):a.defaultVideoHeight;m=mejs.Utility.encodeUrl(m);l=mejs.Utility.encodeUrl(l)}else{if(a.enablePluginDebug){m=320;l=240}}o.success=a.success;mejs.MediaPluginBridge.registerPluginElement(s,o,r);g.className="me-plugin";g.id=s+"_container";if(n.isVideo){r.parentNode.insertBefore(g,r)}else{document.body.insertBefore(g,document.body.childNodes[0])}j=["id="+s,"isvideo="+((n.isVideo)?"true":"false"),"autoplay="+((e)?"true":"false"),"preload="+d,"width="+m,"startvolume="+a.startVolume,"timerrate="+a.timerRate,"flashstreamer="+a.flashStreamer,"height="+l];if(n.url!==null){if(n.method=="flash"){j.push("file="+mejs.Utility.encodeUrl(n.url))}else{j.push("file="+n.url)}}if(a.enablePluginDebug){j.push("debug=true")}if(a.enablePluginSmoothing){j.push("smoothing=true")}if(h){j.push("controls=true")}if(a.pluginVars){j=j.concat(a.pluginVars)}switch(n.method){case"silverlight":g.innerHTML='<object data="data:application/x-silverlight-2," type="application/x-silverlight-2" id="'+s+'" name="'+s+'" width="'+m+'" height="'+l+'"><param name="initParams" value="'+j.join(",")+'" /><param name="windowless" value="true" /><param name="background" value="black" /><param name="minRuntimeVersion" value="3.0.0.0" /><param name="autoUpgrade" value="true" /><param name="source" value="'+a.pluginPath+a.silverlightName+'" /></object>';break;case"flash":if(mejs.MediaFeatures.isIE){b=document.createElement("div");g.appendChild(b);b.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" id="'+s+'" width="'+m+'" height="'+l+'"><param name="movie" value="'+a.pluginPath+a.flashName+"?x="+(new Date())+'" /><param name="flashvars" value="'+j.join("&amp;")+'" /><param name="quality" value="high" /><param name="bgcolor" value="#000000" /><param name="wmode" value="transparent" /><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="true" /></object>'}else{g.innerHTML='<embed id="'+s+'" name="'+s+'" play="true" loop="false" quality="high" bgcolor="#000000" wmode="transparent" allowScriptAccess="always" allowFullScreen="true" type="application/x-shockwave-flash" pluginspage="//www.macromedia.com/go/getflashplayer" src="'+a.pluginPath+a.flashName+'" flashvars="'+j.join("&")+'" width="'+m+'" height="'+l+'"></embed>'}break;case"youtube":var k=n.url.substr(n.url.lastIndexOf("=")+1);youtubeSettings={container:g,containerId:g.id,pluginMediaElement:o,pluginId:s,videoId:k,height:l,width:m};if(mejs.PluginDetector.hasPluginVersion("flash",[10,0,0])){mejs.YouTubeApi.createFlash(youtubeSettings)}else{mejs.YouTubeApi.enqueueIframe(youtubeSettings)}break;case"vimeo":o.vimeoid=n.url.substr(n.url.lastIndexOf("/")+1);g.innerHTML='<iframe src="http://player.vimeo.com/video/'+o.vimeoid+'?portrait=0&byline=0&title=0" width="'+m+'" height="'+l+'" frameborder="0"></iframe>';break}r.style.display="none";return o},updateNative:function(d,c,f,b){var e=d.htmlMediaElement,a;for(a in mejs.HtmlMediaElement){e[a]=mejs.HtmlMediaElement[a]}c.success(e,e);return e}};mejs.YouTubeApi={isIframeStarted:false,isIframeLoaded:false,loadIframeApi:function(){if(!this.isIframeStarted){var a=document.createElement("script");a.src="http://www.youtube.com/player_api";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b);this.isIframeStarted=true}},iframeQueue:[],enqueueIframe:function(a){if(this.isLoaded){this.createIframe(a)}else{this.loadIframeApi();this.iframeQueue.push(a)}},createIframe:function(c){var b=c.pluginMediaElement,a=new YT.Player(c.containerId,{height:c.height,width:c.width,videoId:c.videoId,playerVars:{controls:0},events:{onReady:function(){c.pluginMediaElement.pluginApi=a;mejs.MediaPluginBridge.initPlugin(c.pluginId);setInterval(function(){mejs.YouTubeApi.createEvent(a,b,"timeupdate")},250)},onStateChange:function(d){mejs.YouTubeApi.handleStateChange(d.data,a,b)}}})},createEvent:function(d,c,b){var e={type:b,target:c};if(d&&d.getDuration){c.currentTime=e.currentTime=d.getCurrentTime();c.duration=e.duration=d.getDuration();e.paused=c.paused;e.ended=c.ended;e.muted=d.isMuted();e.volume=d.getVolume()/100;e.bytesTotal=d.getVideoBytesTotal();e.bufferedBytes=d.getVideoBytesLoaded();var a=e.bufferedBytes/e.bytesTotal*e.duration;e.target.buffered=e.buffered={start:function(f){return 0},end:function(f){return a},length:1}}c.dispatchEvent(e.type,e)},iFrameReady:function(){this.isLoaded=true;this.isIframeLoaded=true;while(this.iframeQueue.length>0){var a=this.iframeQueue.pop();this.createIframe(a)}},flashPlayers:{},createFlash:function(c){this.flashPlayers[c.pluginId]=c;var b,a="http://www.youtube.com/apiplayer?enablejsapi=1&amp;playerapiid="+c.pluginId+"&amp;version=3&amp;autoplay=0&amp;controls=0&amp;modestbranding=1&loop=0";if(mejs.MediaFeatures.isIE){b=document.createElement("div");c.container.appendChild(b);b.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" id="'+c.pluginId+'" width="'+c.width+'" height="'+c.height+'"><param name="movie" value="'+a+'" /><param name="wmode" value="transparent" /><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="true" /></object>'}else{c.container.innerHTML='<object type="application/x-shockwave-flash" id="'+c.pluginId+'" data="'+a+'" width="'+c.width+'" height="'+c.height+'" style="visibility: visible; "><param name="allowScriptAccess" value="always"><param name="wmode" value="transparent"></object>'}},flashReady:function(e){var c=this.flashPlayers[e],b=document.getElementById(e),a=c.pluginMediaElement;a.pluginApi=a.pluginElement=b;mejs.MediaPluginBridge.initPlugin(e);b.cueVideoById(c.videoId);var d=c.containerId+"_callback";window[d]=function(f){mejs.YouTubeApi.handleStateChange(f,b,a)};b.addEventListener("onStateChange",d);setInterval(function(){mejs.YouTubeApi.createEvent(b,a,"timeupdate")},250)},handleStateChange:function(c,b,a){switch(c){case -1:a.paused=true;a.ended=true;mejs.YouTubeApi.createEvent(b,a,"loadedmetadata");break;case 0:a.paused=false;a.ended=true;mejs.YouTubeApi.createEvent(b,a,"ended");break;case 1:a.paused=false;a.ended=false;mejs.YouTubeApi.createEvent(b,a,"play");mejs.YouTubeApi.createEvent(b,a,"playing");break;case 2:a.paused=true;a.ended=false;mejs.YouTubeApi.createEvent(b,a,"pause");break;case 3:mejs.YouTubeApi.createEvent(b,a,"progress");break;case 5:break}}};function onYouTubePlayerAPIReady(){mejs.YouTubeApi.iFrameReady()}function onYouTubePlayerReady(a){mejs.YouTubeApi.flashReady(a)}window.mejs=mejs;window.MediaElement=mejs.MediaElement;
/*!
 * Adds Internationalization and localization to objects.
 *
 * What is the concept beyond i18n?
 *   http://en.wikipedia.org/wiki/Internationalization_and_localization
 *
 *
 * This file both i18n methods and locale which is used to translate
 * strings into other languages.
 *
 * Default translations are not available, you have to add them
 * through locale objects which are named exactly as the langcode
 * they stand for. The default language is always english (en).
 *
 *
 * Wrapper built to be able to attach the i18n object to
 * other objects without changing more than one line.
 *
 *
 * LICENSE:
 *
 *   The i18n file uses methods from the Drupal project (drupal.js):
 *     - i18n.methods.t() (modified)
 *     - i18n.methods.checkPlain() (full copy)
 *     - i18n.methods.formatString() (full copy)
 *
 *   The Drupal project is (like mediaelementjs) licensed under GPLv2.
 *    - http://drupal.org/licensing/faq/#q1
 *    - https://github.com/johndyer/mediaelement
 *    - http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 *
 *
 * @author
 *   Tim Latz (latz.tim@gmail.com)
 *
 * @see
 *   me-i18n-locale.js
 *
 * @params
 *  - $       - zepto || jQuery  ..
 *  - context - document, iframe ..
 *  - exports - CommonJS, window ..
 *
 */
(function(d,b,a,e){var c={locale:{strings:{}},methods:{}};c.locale.getLanguage=function(){return{language:navigator.language}};c.locale.INIT_LANGUAGE=c.locale.getLanguage();c.methods.checkPlain=function(j){var h,g,f={"&":"&amp;",'"':"&quot;","<":"&lt;",">":"&gt;"};j=String(j);for(h in f){if(f.hasOwnProperty(h)){g=new RegExp(h,"g");j=j.replace(g,f[h])}}return j};c.methods.formatString=function(h,f){for(var g in f){switch(g.charAt(0)){case"@":f[g]=c.methods.checkPlain(f[g]);break;case"!":break;case"%":default:f[g]='<em class="placeholder">'+c.methods.checkPlain(f[g])+"</em>";break}h=h.replace(g,f[g])}return h};c.methods.t=function(h,g,f){if(c.locale.strings&&c.locale.strings[f.context]&&c.locale.strings[f.context][h]){h=c.locale.strings[f.context][h]}if(g){h=c.methods.formatString(h,g)}return h};c.t=function(j,g,f){if(typeof j==="string"&&j.length>0){var h=c.locale.getLanguage();f=f||{context:h.language};return c.methods.t(j,g,f)}else{throw {name:"InvalidArgumentException",message:"First argument is either not a string or empty."}}};a.i18n=c}(jQuery,document,mejs));
/*!
 * This is a i18n.locale language object.
 *
 *<de> German translation by Tim Latz, latz.tim@gmail.com
 *
 * @author
 *   Tim Latz (latz.tim@gmail.com)
 *
 * @see
 *   me-i18n.js
 *
 * @params
 *  - exports - CommonJS, window ..
 */
(function(a,b){a.de={Fullscreen:"Vollbild","Go Fullscreen":"Vollbild an","Turn off Fullscreen":"Vollbild aus",Close:"SchlieÃŸen"}}(mejs.i18n.locale.strings));
/*!
 * MediaElementPlayer
 * http://mediaelementjs.com/
 *
 * Creates a controller bar for HTML5 <video> add <audio> tags
 * using jQuery and MediaElement.js (HTML5 Flash/Silverlight wrapper)
 *
 * Copyright 2010-2012, John Dyer (http://j.hn/)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */
if(typeof jQuery!="undefined"){mejs.$=jQuery}else{if(typeof ender!="undefined"){mejs.$=ender}}(function(a){mejs.MepDefaults={poster:"",defaultVideoWidth:480,defaultVideoHeight:270,videoWidth:-1,videoHeight:-1,defaultAudioWidth:430,defaultAudioHeight:30,defaultSeekBackwardInterval:function(b){return(b.duration*0.05)},defaultSeekForwardInterval:function(b){return(b.duration*0.05)},audioWidth:-1,audioHeight:-1,startVolume:0.8,loop:false,enableAutosize:true,alwaysShowHours:false,showTimecodeFrameCount:false,framesPerSecond:25,autosizeProgress:true,alwaysShowControls:false,iPadUseNativeControls:false,iPhoneUseNativeControls:false,AndroidUseNativeControls:false,features:["playpause","current","progress","duration","tracks","volume","fullscreen"],isVideo:true,enableKeyboard:true,pauseOtherPlayers:true,keyActions:[{keys:[32,179],action:function(b,c){if(c.paused||c.ended){c.play()}else{c.pause()}}},{keys:[38],action:function(b,d){var c=Math.min(d.volume+0.1,1);d.setVolume(c)}},{keys:[40],action:function(b,d){var c=Math.max(d.volume-0.1,0);d.setVolume(c)}},{keys:[37,227],action:function(b,d){if(!isNaN(d.duration)&&d.duration>0){if(b.isVideo){b.showControls();b.startControlsTimer()}var c=Math.max(d.currentTime-b.options.defaultSeekBackwardInterval(d),0);d.setCurrentTime(c)}}},{keys:[39,228],action:function(b,d){if(!isNaN(d.duration)&&d.duration>0){if(b.isVideo){b.showControls();b.startControlsTimer()}var c=Math.min(d.currentTime+b.options.defaultSeekForwardInterval(d),d.duration);d.setCurrentTime(c)}}},{keys:[70],action:function(b,c){if(typeof b.enterFullScreen!="undefined"){if(b.isFullScreen){b.exitFullScreen()}else{b.enterFullScreen()}}}}]};mejs.mepIndex=0;mejs.players=[];mejs.MediaElementPlayer=function(c,d){if(!(this instanceof mejs.MediaElementPlayer)){return new mejs.MediaElementPlayer(c,d)}var b=this;b.$media=b.$node=a(c);b.node=b.media=b.$media[0];if(typeof b.node.player!="undefined"){return b.node.player}else{b.node.player=b}if(typeof d=="undefined"){d=b.$node.data("mejsoptions")}b.options=a.extend({},mejs.MepDefaults,d);mejs.players.push(b);b.init();return b};mejs.MediaElementPlayer.prototype={hasFocus:false,controlsAreVisible:true,init:function(){var d=this,e=mejs.MediaFeatures,h=a.extend(true,{},d.options,{success:function(k,j){d.meReady(k,j)},error:function(j){d.handleError(j)}}),c=d.media.tagName.toLowerCase();d.isDynamic=(c!=="audio"&&c!=="video");if(d.isDynamic){d.isVideo=d.options.isVideo}else{d.isVideo=(c!=="audio"&&d.options.isVideo)}if((e.isiPad&&d.options.iPadUseNativeControls)||(e.isiPhone&&d.options.iPhoneUseNativeControls)){d.$media.attr("controls","controls");if(e.isiPad&&d.media.getAttribute("autoplay")!==null){d.media.load();d.media.play()}}else{if(e.isAndroid&&d.AndroidUseNativeControls){}else{d.$media.removeAttr("controls");d.id="mep_"+mejs.mepIndex++;d.container=a('<div id="'+d.id+'" class="mejs-container '+(mejs.MediaFeatures.svg?"svg":"no-svg")+'"><div class="mejs-inner"><div class="mejs-mediaelement"></div><div class="mejs-layers"></div><div class="mejs-controls"></div><div class="mejs-clear"></div></div></div>').addClass(d.$media[0].className).insertBefore(d.$media);d.container.addClass((e.isAndroid?"mejs-android ":"")+(e.isiOS?"mejs-ios ":"")+(e.isiPad?"mejs-ipad ":"")+(e.isiPhone?"mejs-iphone ":"")+(d.isVideo?"mejs-video ":"mejs-audio "));if(e.isiOS){var g=d.$media.clone();d.container.find(".mejs-mediaelement").append(g);d.$media.remove();d.$node=d.$media=g;d.node=d.media=g[0]}else{d.container.find(".mejs-mediaelement").append(d.$media)}d.controls=d.container.find(".mejs-controls");d.layers=d.container.find(".mejs-layers");var f=(d.isVideo?"video":"audio"),b=f.substring(0,1).toUpperCase()+f.substring(1);if(d.options[f+"Width"]>0||d.options[f+"Width"].toString().indexOf("%")>-1){d.width=d.options[f+"Width"]}else{if(d.media.style.width!==""&&d.media.style.width!==null){d.width=d.media.style.width}else{if(d.media.getAttribute("width")!==null){d.width=d.$media.attr("width")}else{d.width=d.options["default"+b+"Width"]}}}if(d.options[f+"Height"]>0||d.options[f+"Height"].toString().indexOf("%")>-1){d.height=d.options[f+"Height"]}else{if(d.media.style.height!==""&&d.media.style.height!==null){d.height=d.media.style.height}else{if(d.$media[0].getAttribute("height")!==null){d.height=d.$media.attr("height")}else{d.height=d.options["default"+b+"Height"]}}}d.setPlayerSize(d.width,d.height);h.pluginWidth=d.height;h.pluginHeight=d.width}}mejs.MediaElement(d.$media[0],h)},showControls:function(b){var c=this;b=typeof b=="undefined"||b;if(c.controlsAreVisible){return}if(b){c.controls.css("visibility","visible").stop(true,true).fadeIn(200,function(){c.controlsAreVisible=true});c.container.find(".mejs-control").css("visibility","visible").stop(true,true).fadeIn(200,function(){c.controlsAreVisible=true})}else{c.controls.css("visibility","visible").css("display","block");c.container.find(".mejs-control").css("visibility","visible").css("display","block");c.controlsAreVisible=true}c.setControlsSize()},hideControls:function(b){var c=this;b=typeof b=="undefined"||b;if(!c.controlsAreVisible){return}if(b){c.controls.stop(true,true).fadeOut(200,function(){a(this).css("visibility","hidden").css("display","block");c.controlsAreVisible=false});c.container.find(".mejs-control").stop(true,true).fadeOut(200,function(){a(this).css("visibility","hidden").css("display","block")})}else{c.controls.css("visibility","hidden").css("display","block");c.container.find(".mejs-control").css("visibility","hidden").css("display","block");c.controlsAreVisible=false}},controlsTimer:null,startControlsTimer:function(c){var b=this;c=typeof c!="undefined"?c:1500;b.killControlsTimer("start");b.controlsTimer=setTimeout(function(){b.hideControls();b.killControlsTimer("hide")},c)},killControlsTimer:function(c){var b=this;if(b.controlsTimer!==null){clearTimeout(b.controlsTimer);delete b.controlsTimer;b.controlsTimer=null}},controlsEnabled:true,disableControls:function(){var b=this;b.killControlsTimer();b.hideControls(false);this.controlsEnabled=false},enableControls:function(){var b=this;b.showControls(false);b.controlsEnabled=true},meReady:function(c,f){var k=this,j=mejs.MediaFeatures,g=f.getAttribute("autoplay"),d=!(typeof g=="undefined"||g===null||g==="false"),b,l;if(k.created){return}else{k.created=true}k.media=c;k.domNode=f;if(!(j.isAndroid&&k.options.AndroidUseNativeControls)&&!(j.isiPad&&k.options.iPadUseNativeControls)&&!(j.isiPhone&&k.options.iPhoneUseNativeControls)){k.buildposter(k,k.controls,k.layers,k.media);k.buildkeyboard(k,k.controls,k.layers,k.media);k.buildoverlays(k,k.controls,k.layers,k.media);k.findTracks();for(b in k.options.features){l=k.options.features[b];if(k["build"+l]){try{k["build"+l](k,k.controls,k.layers,k.media)}catch(h){}}}k.container.trigger("controlsready");k.setPlayerSize(k.width,k.height);k.setControlsSize();if(k.isVideo){if(mejs.MediaFeatures.hasTouch){k.$media.bind("touchstart",function(){if(k.controlsAreVisible){k.hideControls(false)}else{if(k.controlsEnabled){k.showControls(false)}}})}else{k.media.addEventListener("click",function(){if(k.media.paused){k.media.play()}else{k.media.pause()}});k.container.bind("mouseenter mouseover",function(){if(k.controlsEnabled){if(!k.options.alwaysShowControls){k.killControlsTimer("enter");k.showControls();k.startControlsTimer(2500)}}}).bind("mousemove",function(){if(k.controlsEnabled){if(!k.controlsAreVisible){k.showControls()}if(!k.options.alwaysShowControls){k.startControlsTimer(2500)}}}).bind("mouseleave",function(){if(k.controlsEnabled){if(!k.media.paused&&!k.options.alwaysShowControls){k.startControlsTimer(1000)}}})}if(d&&!k.options.alwaysShowControls){k.hideControls()}if(k.options.enableAutosize){k.media.addEventListener("loadedmetadata",function(m){if(k.options.videoHeight<=0&&k.domNode.getAttribute("height")===null&&!isNaN(m.target.videoHeight)){k.setPlayerSize(m.target.videoWidth,m.target.videoHeight);k.setControlsSize();k.media.setVideoSize(m.target.videoWidth,m.target.videoHeight)}},false)}}c.addEventListener("play",function(){for(var m=0,e=mejs.players.length;m<e;m++){var n=mejs.players[m];if(n.id!=k.id&&k.options.pauseOtherPlayers&&!n.paused&&!n.ended){n.pause()}n.hasFocus=false}k.hasFocus=true},false);k.media.addEventListener("ended",function(m){try{k.media.setCurrentTime(0)}catch(n){}k.media.pause();if(k.setProgressRail){k.setProgressRail()}if(k.setCurrentRail){k.setCurrentRail()}if(k.options.loop){k.media.play()}else{if(!k.options.alwaysShowControls&&k.controlsEnabled){k.showControls()}}},false);k.media.addEventListener("loadedmetadata",function(m){if(k.updateDuration){k.updateDuration()}if(k.updateCurrent){k.updateCurrent()}if(!k.isFullScreen){k.setPlayerSize(k.width,k.height);k.setControlsSize()}},false);setTimeout(function(){k.setPlayerSize(k.width,k.height);k.setControlsSize()},50);a(window).resize(function(){if(!(k.isFullScreen||(mejs.MediaFeatures.hasTrueNativeFullScreen&&document.webkitIsFullScreen))){k.setPlayerSize(k.width,k.height)}k.setControlsSize()});if(k.media.pluginType=="youtube"){k.container.find(".mejs-overlay-play").hide()}}if(d&&c.pluginType=="native"){c.load();c.play()}if(k.options.success){if(typeof k.options.success=="string"){window[k.options.success](k.media,k.domNode,k)}else{k.options.success(k.media,k.domNode,k)}}},handleError:function(c){var b=this;b.controls.hide();if(b.options.error){b.options.error(c)}},setPlayerSize:function(g,b){var e=this;if(typeof g!="undefined"){e.width=g}if(typeof b!="undefined"){e.height=b}if(e.height.toString().indexOf("%")>0||e.$node.css("max-width")==="100%"||(e.$node[0].currentStyle&&e.$node[0].currentStyle.maxWidth==="100%")){var h=e.isVideo?((e.media.videoWidth&&e.media.videoWidth>0)?e.media.videoWidth:e.options.defaultVideoWidth):e.options.defaultAudioWidth,d=e.isVideo?((e.media.videoHeight&&e.media.videoHeight>0)?e.media.videoHeight:e.options.defaultVideoHeight):e.options.defaultAudioHeight,f=e.container.parent().closest(":visible").width(),c=parseInt(f*d/h,10);if(e.container.parent()[0].tagName.toLowerCase()==="body"){f=a(window).width();c=a(window).height()}if(c!=0){e.container.width(f).height(c);e.$media.width("100%").height("100%");e.container.find("object, embed, iframe").width("100%").height("100%");if(e.isVideo){if(e.media.setVideoSize){e.media.setVideoSize(f,c)}}e.layers.children(".mejs-layer").width("100%").height("100%")}}else{e.container.width(e.width).height(e.height);e.layers.children(".mejs-layer").width(e.width).height(e.height)}},setControlsSize:function(){var c=this,g=0,j=0,h=c.controls.find(".mejs-time-rail"),e=c.controls.find(".mejs-time-total"),f=c.controls.find(".mejs-time-current"),b=c.controls.find(".mejs-time-loaded"),d=h.siblings();if(c.options&&!c.options.autosizeProgress){j=parseInt(h.css("width"))}if(j===0||!j){d.each(function(){if(a(this).css("position")!="absolute"){g+=a(this).outerWidth(true)}});j=c.controls.width()-g-(h.outerWidth(true)-h.width())}h.width(j);e.width(j-(e.outerWidth(true)-e.width()));if(c.setProgressRail){c.setProgressRail()}if(c.setCurrentRail){c.setCurrentRail()}},buildposter:function(e,b,g,f){var d=this,h=a('<div class="mejs-poster mejs-layer"></div>').appendTo(g),c=e.$media.attr("poster");if(e.options.poster!==""){c=e.options.poster}if(c!==""&&c!=null){d.setPoster(c)}else{h.hide()}f.addEventListener("play",function(){h.hide()},false)},setPoster:function(c){var d=this,e=d.container.find(".mejs-poster"),b=e.find("img");if(b.length==0){b=a('<img width="100%" height="100%" />').appendTo(e)}b.attr("src",c)},buildoverlays:function(e,b,g,f){if(!e.isVideo){return}var h=a('<div class="mejs-overlay mejs-layer"><div class="mejs-overlay-loading"><span></span></div></div>').hide().appendTo(g),c=a('<div class="mejs-overlay mejs-layer"><div class="mejs-overlay-error"></div></div>').hide().appendTo(g),d=a('<div class="mejs-overlay mejs-layer mejs-overlay-play"><div class="mejs-overlay-button"></div></div>').appendTo(g).click(function(){if(f.paused){f.play()}else{f.pause()}});f.addEventListener("play",function(){d.hide();h.hide();b.find(".mejs-time-buffering").hide();c.hide()},false);f.addEventListener("playing",function(){d.hide();h.hide();b.find(".mejs-time-buffering").hide();c.hide()},false);f.addEventListener("seeking",function(){h.show();b.find(".mejs-time-buffering").show()},false);f.addEventListener("seeked",function(){h.hide();b.find(".mejs-time-buffering").hide()},false);f.addEventListener("pause",function(){if(!mejs.MediaFeatures.isiPhone){d.show()}},false);f.addEventListener("waiting",function(){h.show();b.find(".mejs-time-buffering").show()},false);f.addEventListener("loadeddata",function(){h.show();b.find(".mejs-time-buffering").show()},false);f.addEventListener("canplay",function(){h.hide();b.find(".mejs-time-buffering").hide()},false);f.addEventListener("error",function(){h.hide();b.find(".mejs-time-buffering").hide();c.show();c.find("mejs-overlay-error").html("Error loading this resource")},false)},buildkeyboard:function(d,b,f,e){var c=this;a(document).keydown(function(n){if(d.hasFocus&&d.options.enableKeyboard){for(var m=0,g=d.options.keyActions.length;m<g;m++){var l=d.options.keyActions[m];for(var h=0,k=l.keys.length;h<k;h++){if(n.keyCode==l.keys[h]){n.preventDefault();l.action(d,e,n.keyCode);return false}}}}return true});a(document).click(function(g){if(a(g.target).closest(".mejs-container").length==0){d.hasFocus=false}})},findTracks:function(){var b=this,c=b.$media.find("track");b.tracks=[];c.each(function(e,d){d=a(d);b.tracks.push({srclang:d.attr("srclang").toLowerCase(),src:d.attr("src"),kind:d.attr("kind"),label:d.attr("label")||"",entries:[],isLoaded:false})})},changeSkin:function(b){this.container[0].className="mejs-container "+b;this.setPlayerSize(this.width,this.height);this.setControlsSize()},play:function(){this.media.play()},pause:function(){this.media.pause()},load:function(){this.media.load()},setMuted:function(b){this.media.setMuted(b)},setCurrentTime:function(b){this.media.setCurrentTime(b)},getCurrentTime:function(){return this.media.currentTime},setVolume:function(b){this.media.setVolume(b)},getVolume:function(){return this.media.volume},setSrc:function(b){this.media.setSrc(b)},remove:function(){var b=this;if(b.media.pluginType==="flash"){b.media.remove()}else{if(b.media.pluginType==="native"){b.$media.prop("controls",true)}}if(!b.isDynamic){b.$node.insertBefore(b.container)}b.container.remove()}};if(typeof jQuery!="undefined"){jQuery.fn.mediaelementplayer=function(b){return this.each(function(){new mejs.MediaElementPlayer(this,b)})}}a(document).ready(function(){a(".mejs-player").mediaelementplayer()});window.MediaElementPlayer=mejs.MediaElementPlayer})(mejs.$);(function(a){a.extend(mejs.MepDefaults,{playpauseText:"Play/Pause"});a.extend(MediaElementPlayer.prototype,{buildplaypause:function(d,b,g,f){var c=this,e=a('<div class="mejs-button mejs-playpause-button mejs-play" ><button type="button" aria-controls="'+c.id+'" title="'+c.options.playpauseText+'"></button></div>').appendTo(b).click(function(h){h.preventDefault();if(f.paused){f.play()}else{f.pause()}return false});f.addEventListener("play",function(){e.removeClass("mejs-play").addClass("mejs-pause")},false);f.addEventListener("playing",function(){e.removeClass("mejs-play").addClass("mejs-pause")},false);f.addEventListener("pause",function(){e.removeClass("mejs-pause").addClass("mejs-play")},false);f.addEventListener("paused",function(){e.removeClass("mejs-pause").addClass("mejs-play")},false)}})})(mejs.$);(function(a){a.extend(mejs.MepDefaults,{stopText:"Stop"});a.extend(MediaElementPlayer.prototype,{buildstop:function(e,b,g,f){var d=this,c=a('<div class="mejs-button mejs-stop-button mejs-stop"><button type="button" aria-controls="'+d.id+'" title="'+d.options.stopText+'"></button></div>').appendTo(b).click(function(){if(!f.paused){f.pause()}if(f.currentTime>0){f.setCurrentTime(0);f.pause();b.find(".mejs-time-current").width("0px");b.find(".mejs-time-handle").css("left","0px");b.find(".mejs-time-float-current").html(mejs.Utility.secondsToTimeCode(0));b.find(".mejs-currenttime").html(mejs.Utility.secondsToTimeCode(0));g.find(".mejs-poster").show()}})}})})(mejs.$);(function(a){a.extend(MediaElementPlayer.prototype,{buildprogress:function(n,o,f,c){a('<div class="mejs-time-rail"><span class="mejs-time-total"><span class="mejs-time-buffering"></span><span class="mejs-time-loaded"></span><span class="mejs-time-current"></span><span class="mejs-time-handle"></span><span class="mejs-time-float"><span class="mejs-time-float-current">00:00</span><span class="mejs-time-float-corner"></span></span></span></div>').appendTo(o);o.find(".mejs-time-buffering").hide();var p=this,l=o.find(".mejs-time-total"),g=o.find(".mejs-time-loaded"),k=o.find(".mejs-time-current"),j=o.find(".mejs-time-handle"),m=o.find(".mejs-time-float"),b=o.find(".mejs-time-float-current"),e=function(u){var q=u.pageX,v=l.offset(),s=l.outerWidth(true),r=0,t=0,w=q-v.left;if(q>v.left&&q<=s+v.left&&c.duration){r=((q-v.left)/s);t=(r<=0.02)?0:r*c.duration;if(h){c.setCurrentTime(t)}if(!mejs.MediaFeatures.hasTouch){m.css("left",w);b.html(mejs.Utility.secondsToTimeCode(t));m.show()}}},h=false,d=false;l.bind("mousedown",function(q){if(q.which===1){h=true;e(q);a(document).bind("mousemove.dur",function(r){e(r)}).bind("mouseup.dur",function(r){h=false;m.hide();a(document).unbind(".dur")});return false}}).bind("mouseenter",function(q){d=true;a(document).bind("mousemove.dur",function(r){e(r)});if(!mejs.MediaFeatures.hasTouch){m.show()}}).bind("mouseleave",function(q){d=false;if(!h){a(document).unbind(".dur");m.hide()}});c.addEventListener("progress",function(q){n.setProgressRail(q);n.setCurrentRail(q)},false);c.addEventListener("timeupdate",function(q){n.setProgressRail(q);n.setCurrentRail(q)},false);p.loaded=g;p.total=l;p.current=k;p.handle=j},setProgressRail:function(f){var b=this,d=(f!=undefined)?f.target:b.media,c=null;if(d&&d.buffered&&d.buffered.length>0&&d.buffered.end&&d.duration){c=d.buffered.end(0)/d.duration}else{if(d&&d.bytesTotal!=undefined&&d.bytesTotal>0&&d.bufferedBytes!=undefined){c=d.bufferedBytes/d.bytesTotal}else{if(f&&f.lengthComputable&&f.total!=0){c=f.loaded/f.total}}}if(c!==null){c=Math.min(1,Math.max(0,c));if(b.loaded&&b.total){b.loaded.width(b.total.width()*c)}}},setCurrentRail:function(){var b=this;if(b.media.currentTime!=undefined&&b.media.duration){if(b.total&&b.handle){var d=b.total.width()*b.media.currentTime/b.media.duration,o = b.handle.outerWidth(true),w=b.loaded.width(),c=d-o/2;if(c < 0) c = 0;if((c > w-o) && (w-o > 0)) c = w-o;b.current.width(d);b.handle.css("left",c)}}}})})(mejs.$);(function(a){a.extend(mejs.MepDefaults,{duration:-1,timeAndDurationSeparator:" <span> | </span> "});a.extend(MediaElementPlayer.prototype,{buildcurrent:function(d,b,f,e){var c=this;a('<div class="mejs-time"><span class="mejs-currenttime">'+(d.options.alwaysShowHours?"00:":"")+(d.options.showTimecodeFrameCount?"00:00:00":"00:00")+"</span></div>").appendTo(b);c.currenttime=c.controls.find(".mejs-currenttime");e.addEventListener("timeupdate",function(){d.updateCurrent()},false)},buildduration:function(d,b,f,e){var c=this;if(b.children().last().find(".mejs-currenttime").length>0){a(c.options.timeAndDurationSeparator+'<span class="mejs-duration">'+(c.options.duration>0?mejs.Utility.secondsToTimeCode(c.options.duration,c.options.alwaysShowHours||c.media.duration>3600,c.options.showTimecodeFrameCount,c.options.framesPerSecond||25):((d.options.alwaysShowHours?"00:":"")+(d.options.showTimecodeFrameCount?"00:00:00":"00:00")))+"</span>").appendTo(b.find(".mejs-time"))}else{b.find(".mejs-currenttime").parent().addClass("mejs-currenttime-container");a('<div class="mejs-time mejs-duration-container"><span class="mejs-duration">'+(c.options.duration>0?mejs.Utility.secondsToTimeCode(c.options.duration,c.options.alwaysShowHours||c.media.duration>3600,c.options.showTimecodeFrameCount,c.options.framesPerSecond||25):((d.options.alwaysShowHours?"00:":"")+(d.options.showTimecodeFrameCount?"00:00:00":"00:00")))+"</span></div>").appendTo(b)}c.durationD=c.controls.find(".mejs-duration");e.addEventListener("timeupdate",function(){d.updateDuration()},false)},updateCurrent:function(){var b=this;if(b.currenttime){b.currenttime.html(mejs.Utility.secondsToTimeCode(b.media.currentTime,b.options.alwaysShowHours||b.media.duration>3600,b.options.showTimecodeFrameCount,b.options.framesPerSecond||25))}},updateDuration:function(){var b=this;if(b.media.duration&&b.durationD){b.durationD.html(mejs.Utility.secondsToTimeCode(b.media.duration,b.options.alwaysShowHours,b.options.showTimecodeFrameCount,b.options.framesPerSecond||25))}}})})(mejs.$);(function(a){a.extend(mejs.MepDefaults,{muteText:"Mute Toggle",hideVolumeOnTouchDevices:true,audioVolume:"horizontal",videoVolume:"vertical"});a.extend(MediaElementPlayer.prototype,{buildvolume:function(n,o,j,d){if(mejs.MediaFeatures.hasTouch&&this.options.hideVolumeOnTouchDevices){return}var p=this,l=(p.isVideo)?p.options.videoVolume:p.options.audioVolume,f=(l=="horizontal")?a('<div class="mejs-button mejs-volume-button mejs-mute"><button type="button" aria-controls="'+p.id+'" title="'+p.options.muteText+'"></button></div><div class="mejs-horizontal-volume-slider"><div class="mejs-horizontal-volume-total"></div><div class="mejs-horizontal-volume-current"></div><div class="mejs-horizontal-volume-handle"></div></div>').appendTo(o):a('<div class="mejs-button mejs-volume-button mejs-mute"><button type="button" aria-controls="'+p.id+'" title="'+p.options.muteText+'"></button><div class="mejs-volume-slider"><div class="mejs-volume-total"></div><div class="mejs-volume-current"></div><div class="mejs-volume-handle"></div></div></div>').appendTo(o),q=p.container.find(".mejs-volume-slider, .mejs-horizontal-volume-slider"),b=p.container.find(".mejs-volume-total, .mejs-horizontal-volume-total"),h=p.container.find(".mejs-volume-current, .mejs-horizontal-volume-current"),g=p.container.find(".mejs-volume-handle, .mejs-horizontal-volume-handle"),m=function(w,x){if(!q.is(":visible")&&typeof x=="undefined"){q.show();m(w,true);q.hide();return}w=Math.max(0,w);w=Math.min(w,1);if(w==0){f.removeClass("mejs-mute").addClass("mejs-unmute")}else{f.removeClass("mejs-unmute").addClass("mejs-mute")}if(l=="vertical"){var u=b.height(),t=b.position(),s=u-(u*w);g.css("top",Math.round(t.top+s-(g.height()/2)));h.height(u-s);h.css("top",t.top+s)}else{var r=b.width(),t=b.position(),v=r*w;g.css("left",Math.round(t.left+v-(g.width()/2)));h.width(Math.round(v))}},c=function(w){var u=null,s=b.offset();if(l=="vertical"){var t=b.height(),r=parseInt(b.css("top").replace(/px/,""),10),v=w.pageY-s.top;u=(t-v)/t;if(s.top==0||s.left==0){return}}else{var y=b.width(),x=w.pageX-s.left;u=x/y}u=Math.max(0,u);u=Math.min(u,1);m(u);if(u==0){d.setMuted(true)}else{d.setMuted(false)}d.setVolume(u)},k=false,e=false;f.hover(function(){q.show();e=true},function(){e=false;if(!k&&l=="vertical"){q.hide()}});q.bind("mouseover",function(){e=true}).bind("mousedown",function(r){c(r);a(document).bind("mousemove.vol",function(s){c(s)}).bind("mouseup.vol",function(){k=false;a(document).unbind(".vol");if(!e&&l=="vertical"){q.hide()}});k=true;return false});f.find("button").click(function(){d.setMuted(!d.muted)});d.addEventListener("volumechange",function(r){if(!k){if(d.muted){m(0);f.removeClass("mejs-mute").addClass("mejs-unmute")}else{m(d.volume);f.removeClass("mejs-unmute").addClass("mejs-mute")}}},false);if(p.container.is(":visible")){m(n.options.startVolume);if(d.pluginType==="native"){d.setVolume(n.options.startVolume)}}}})})(mejs.$);(function(a){a.extend(mejs.MepDefaults,{usePluginFullScreen:true,newWindowCallback:function(){return""},fullscreenText:mejs.i18n.t("Fullscreen")});a.extend(MediaElementPlayer.prototype,{isFullScreen:false,isNativeFullScreen:false,docStyleOverflow:null,isInIframe:false,buildfullscreen:function(q,p,g,f){if(!q.isVideo){return}q.isInIframe=(window.location!=window.parent.location);if(mejs.MediaFeatures.hasTrueNativeFullScreen){var u=null;if(mejs.MediaFeatures.hasMozNativeFullScreen){u=a(document)}else{u=q.container}u.bind(mejs.MediaFeatures.fullScreenEventName,function(t){if(mejs.MediaFeatures.isFullScreen()){q.isNativeFullScreen=true;q.setControlsSize()}else{q.isNativeFullScreen=false;q.exitFullScreen()}})}var o=this,e=0,c=0,n=q.container,b=a('<div class="mejs-button mejs-fullscreen-button"><button type="button" aria-controls="'+o.id+'" title="'+o.options.fullscreenText+'"></button></div>').appendTo(p);if(o.media.pluginType==="native"||(!o.options.usePluginFullScreen&&!mejs.MediaFeatures.isFirefox)){b.click(function(){var t=(mejs.MediaFeatures.hasTrueNativeFullScreen&&mejs.MediaFeatures.isFullScreen())||q.isFullScreen;if(t){q.exitFullScreen()}else{q.enterFullScreen()}})}else{var m=null,h=(function(){var v=document.createElement("x"),w=document.documentElement,x=window.getComputedStyle,t;if(!("pointerEvents" in v.style)){return false}v.style.pointerEvents="auto";v.style.pointerEvents="x";w.appendChild(v);t=x&&x(v,"").pointerEvents==="auto";w.removeChild(v);return !!t})();if(h&&!mejs.MediaFeatures.isOpera){var l=false,r=function(){if(l){j.hide();d.hide();k.hide();b.css("pointer-events","");o.controls.css("pointer-events","");l=false}},j=a('<div class="mejs-fullscreen-hover" />').appendTo(o.container).mouseover(r),d=a('<div class="mejs-fullscreen-hover"  />').appendTo(o.container).mouseover(r),k=a('<div class="mejs-fullscreen-hover"  />').appendTo(o.container).mouseover(r),s=function(){var v={position:"absolute",top:0,left:0};j.css(v);d.css(v);k.css(v);j.width(o.container.width()).height(o.container.height()-o.controls.height());var t=b.offset().left-o.container.offset().left;fullScreenBtnWidth=b.outerWidth(true);d.width(t).height(o.controls.height()).css({top:o.container.height()-o.controls.height()});k.width(o.container.width()-t-fullScreenBtnWidth).height(o.controls.height()).css({top:o.container.height()-o.controls.height(),left:t+fullScreenBtnWidth})};a(document).resize(function(){s()});b.mouseover(function(){if(!o.isFullScreen){var t=b.offset(),v=q.container.offset();f.positionFullscreenButton(t.left-v.left,t.top-v.top,false);b.css("pointer-events","none");o.controls.css("pointer-events","none");j.show();k.show();d.show();s();l=true}});f.addEventListener("fullscreenchange",function(t){r()})}else{b.mouseover(function(){if(m!==null){clearTimeout(m);delete m}var t=b.offset(),v=q.container.offset();f.positionFullscreenButton(t.left-v.left,t.top-v.top,true)}).mouseout(function(){if(m!==null){clearTimeout(m);delete m}m=setTimeout(function(){f.hideFullscreenButton()},1500)})}}q.fullscreenBtn=b;a(document).bind("keydown",function(t){if(((mejs.MediaFeatures.hasTrueNativeFullScreen&&mejs.MediaFeatures.isFullScreen())||o.isFullScreen)&&t.keyCode==27){q.exitFullScreen()}})},enterFullScreen:function(){var c=this;if(c.media.pluginType!=="native"&&(mejs.MediaFeatures.isFirefox||c.options.usePluginFullScreen)){return}docStyleOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow="hidden";normalHeight=c.container.height();normalWidth=c.container.width();if(c.media.pluginType==="native"){if(mejs.MediaFeatures.hasTrueNativeFullScreen){mejs.MediaFeatures.requestFullScreen(c.container[0]);if(c.isInIframe){setTimeout(function d(){if(c.isNativeFullScreen){if(a(window).width()!==screen.width){c.exitFullScreen()}else{setTimeout(d,500)}}},500)}}else{if(mejs.MediaFeatures.hasSemiNativeFullScreen){c.media.webkitEnterFullscreen();return}}}if(c.isInIframe){var b=c.options.newWindowCallback(this);if(b!==""){if(!mejs.MediaFeatures.hasTrueNativeFullScreen){c.pause();window.open(b,c.id,"top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight+",resizable=yes,scrollbars=no,status=no,toolbar=no");return}else{setTimeout(function(){if(!c.isNativeFullScreen){c.pause();window.open(b,c.id,"top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight+",resizable=yes,scrollbars=no,status=no,toolbar=no")}},250)}}}c.container.addClass("mejs-container-fullscreen").width("100%").height("100%");setTimeout(function(){c.container.css({width:"100%",height:"100%"});c.setControlsSize()},500);if(c.pluginType==="native"){c.$media.width("100%").height("100%")}else{c.container.find("object, embed, iframe").width("100%").height("100%");c.media.setVideoSize(a(window).width(),a(window).height())}c.layers.children("div").width("100%").height("100%");if(c.fullscreenBtn){c.fullscreenBtn.removeClass("mejs-fullscreen").addClass("mejs-unfullscreen")}c.setControlsSize();c.isFullScreen=true},exitFullScreen:function(){var b=this;if(b.media.pluginType!=="native"&&mejs.MediaFeatures.isFirefox){b.media.setFullscreen(false);return}if(mejs.MediaFeatures.hasTrueNativeFullScreen&&(mejs.MediaFeatures.isFullScreen()||b.isFullScreen)){mejs.MediaFeatures.cancelFullScreen()}document.documentElement.style.overflow=docStyleOverflow;b.container.removeClass("mejs-container-fullscreen").width(normalWidth).height(normalHeight);if(b.pluginType==="native"){b.$media.width(normalWidth).height(normalHeight)}else{b.container.find("object embed").width(normalWidth).height(normalHeight);b.media.setVideoSize(normalWidth,normalHeight)}b.layers.children("div").width(normalWidth).height(normalHeight);b.fullscreenBtn.removeClass("mejs-unfullscreen").addClass("mejs-fullscreen");b.setControlsSize();b.isFullScreen=false}})})(mejs.$);(function(a){a.extend(mejs.MepDefaults,{startLanguage:"",tracksText:"Captions/Subtitles"});a.extend(MediaElementPlayer.prototype,{hasChapters:false,buildtracks:function(f,b,h,g){if(!f.isVideo){return}if(f.tracks.length==0){return}var e=this,d,c="";f.chapters=a('<div class="mejs-chapters mejs-layer"></div>').prependTo(h).hide();f.captions=a('<div class="mejs-captions-layer mejs-layer"><div class="mejs-captions-position"><span class="mejs-captions-text"></span></div></div>').prependTo(h).hide();f.captionsText=f.captions.find(".mejs-captions-text");f.captionsButton=a('<div class="mejs-button mejs-captions-button"><button type="button" aria-controls="'+e.id+'" title="'+e.options.tracksText+'"></button><div class="mejs-captions-selector"><ul><li><input type="radio" name="'+f.id+'_captions" id="'+f.id+'_captions_none" value="none" checked="checked" /><label for="'+f.id+'_captions_none">None</label></li></ul></div></div>').appendTo(b).hover(function(){a(this).find(".mejs-captions-selector").css("visibility","visible")},function(){a(this).find(".mejs-captions-selector").css("visibility","hidden")}).delegate("input[type=radio]","click",function(){lang=this.value;if(lang=="none"){f.selectedTrack=null}else{for(d=0;d<f.tracks.length;d++){if(f.tracks[d].srclang==lang){f.selectedTrack=f.tracks[d];f.captions.attr("lang",f.selectedTrack.srclang);f.displayCaptions();break}}}});if(!f.options.alwaysShowControls){f.container.bind("mouseenter",function(){f.container.find(".mejs-captions-position").addClass("mejs-captions-position-hover")}).bind("mouseleave",function(){if(!g.paused){f.container.find(".mejs-captions-position").removeClass("mejs-captions-position-hover")}})}else{f.container.find(".mejs-captions-position").addClass("mejs-captions-position-hover")}f.trackToLoad=-1;f.selectedTrack=null;f.isLoadingTrack=false;for(d=0;d<f.tracks.length;d++){if(f.tracks[d].kind=="subtitles"){f.addTrackButton(f.tracks[d].srclang,f.tracks[d].label)}}f.loadNextTrack();g.addEventListener("timeupdate",function(j){f.displayCaptions()},false);g.addEventListener("loadedmetadata",function(j){f.displayChapters()},false);f.container.hover(function(){if(f.hasChapters){f.chapters.css("visibility","visible");f.chapters.fadeIn(200).height(f.chapters.find(".mejs-chapter").outerHeight())}},function(){if(f.hasChapters&&!g.paused){f.chapters.fadeOut(200,function(){a(this).css("visibility","hidden");a(this).css("display","block")})}});if(f.node.getAttribute("autoplay")!==null){f.chapters.css("visibility","hidden")}},loadNextTrack:function(){var b=this;b.trackToLoad++;if(b.trackToLoad<b.tracks.length){b.isLoadingTrack=true;b.loadTrack(b.trackToLoad)}else{b.isLoadingTrack=false}},loadTrack:function(c){var d=this,b=d.tracks[c],e=function(){b.isLoaded=true;d.enableTrackButton(b.srclang,b.label);d.loadNextTrack()};a.ajax({url:b.src,dataType:"text",success:function(f){if(typeof f=="string"&&(/<tt\s+xml/ig).exec(f)){b.entries=mejs.TrackFormatParser.dfxp.parse(f)}else{b.entries=mejs.TrackFormatParser.webvvt.parse(f)}e();if(b.kind=="chapters"){d.media.addEventListener("play",function(g){if(d.media.duration>0){d.displayChapters(b)}},false)}},error:function(){d.loadNextTrack()}})},enableTrackButton:function(d,b){var c=this;if(b===""){b=mejs.language.codes[d]||d}c.captionsButton.find("input[value="+d+"]").prop("disabled",false).siblings("label").html(b);if(c.options.startLanguage==d){a("#"+c.id+"_captions_"+d).click()}c.adjustLanguageBox()},addTrackButton:function(d,b){var c=this;if(b===""){b=mejs.language.codes[d]||d}c.captionsButton.find("ul").append(a('<li><input type="radio" name="'+c.id+'_captions" id="'+c.id+"_captions_"+d+'" value="'+d+'" disabled="disabled" /><label for="'+c.id+"_captions_"+d+'">'+b+" (loading)</label></li>"));c.adjustLanguageBox();c.container.find(".mejs-captions-translations option[value="+d+"]").remove()},adjustLanguageBox:function(){var b=this;b.captionsButton.find(".mejs-captions-selector").height(b.captionsButton.find(".mejs-captions-selector ul").outerHeight(true)+b.captionsButton.find(".mejs-captions-translations").outerHeight(true))},displayCaptions:function(){if(typeof this.tracks=="undefined"){return}var d=this,c,b=d.selectedTrack;if(b!=null&&b.isLoaded){for(c=0;c<b.entries.times.length;c++){if(d.media.currentTime>=b.entries.times[c].start&&d.media.currentTime<=b.entries.times[c].stop){d.captionsText.html(b.entries.text[c]);d.captions.show().height(0);return}}d.captions.hide()}else{d.captions.hide()}},displayChapters:function(){var c=this,b;for(b=0;b<c.tracks.length;b++){if(c.tracks[b].kind=="chapters"&&c.tracks[b].isLoaded){c.drawChapters(c.tracks[b]);c.hasChapters=true;break}}},drawChapters:function(f){var c=this,b,d,e=0,g=0;c.chapters.empty();for(b=0;b<f.entries.times.length;b++){d=f.entries.times[b].stop-f.entries.times[b].start;e=Math.floor(d/c.media.duration*100);if(e+g>100||b==f.entries.times.length-1&&e+g<100){e=100-g}c.chapters.append(a('<div class="mejs-chapter" rel="'+f.entries.times[b].start+'" style="left: '+g.toString()+"%;width: "+e.toString()+'%;"><div class="mejs-chapter-block'+((b==f.entries.times.length-1)?" mejs-chapter-block-last":"")+'"><span class="ch-title">'+f.entries.text[b]+'</span><span class="ch-time">'+mejs.Utility.secondsToTimeCode(f.entries.times[b].start)+"&ndash;"+mejs.Utility.secondsToTimeCode(f.entries.times[b].stop)+"</span></div></div>"));g+=e}c.chapters.find("div.mejs-chapter").click(function(){c.media.setCurrentTime(parseFloat(a(this).attr("rel")));if(c.media.paused){c.media.play()}});c.chapters.show()}});mejs.language={codes:{af:"Afrikaans",sq:"Albanian",ar:"Arabic",be:"Belarusian",bg:"Bulgarian",ca:"Catalan",zh:"Chinese","zh-cn":"Chinese Simplified","zh-tw":"Chinese Traditional",hr:"Croatian",cs:"Czech",da:"Danish",nl:"Dutch",en:"English",et:"Estonian",tl:"Filipino",fi:"Finnish",fr:"French",gl:"Galician",de:"German",el:"Greek",ht:"Haitian Creole",iw:"Hebrew",hi:"Hindi",hu:"Hungarian",is:"Icelandic",id:"Indonesian",ga:"Irish",it:"Italian",ja:"Japanese",ko:"Korean",lv:"Latvian",lt:"Lithuanian",mk:"Macedonian",ms:"Malay",mt:"Maltese",no:"Norwegian",fa:"Persian",pl:"Polish",pt:"Portuguese",ro:"Romanian",ru:"Russian",sr:"Serbian",sk:"Slovak",sl:"Slovenian",es:"Spanish",sw:"Swahili",sv:"Swedish",tl:"Tagalog",th:"Thai",tr:"Turkish",uk:"Ukrainian",vi:"Vietnamese",cy:"Welsh",yi:"Yiddish"}};mejs.TrackFormatParser={webvvt:{pattern_identifier:/^([a-zA-z]+-)?[0-9]+$/,pattern_timecode:/^([0-9]{2}:[0-9]{2}:[0-9]{2}([,.][0-9]{1,3})?) --\> ([0-9]{2}:[0-9]{2}:[0-9]{2}([,.][0-9]{3})?)(.*)$/,parse:function(g){var e=0,d=mejs.TrackFormatParser.split2(g,/\r?\n/),c={text:[],times:[]},b,f;for(;e<d.length;e++){if(this.pattern_identifier.exec(d[e])){e++;b=this.pattern_timecode.exec(d[e]);if(b&&e<d.length){e++;f=d[e];e++;while(d[e]!==""&&e<d.length){f=f+"\n"+d[e];e++}f=a.trim(f).replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,"<a href='$1' target='_blank'>$1</a>");c.text.push(f);c.times.push({start:(mejs.Utility.convertSMPTEtoSeconds(b[1])==0)?0.2:mejs.Utility.convertSMPTEtoSeconds(b[1]),stop:mejs.Utility.convertSMPTEtoSeconds(b[3]),settings:b[5]})}}}return c}},dfxp:{parse:function(l){l=a(l).filter("tt");var j=0,c=l.children("div").eq(0),p=c.find("p"),h=l.find("#"+c.attr("style")),o,d,f,n,k={text:[],times:[]};if(h.length){var g=h.removeAttr("id").get(0).attributes;if(g.length){o={};for(j=0;j<g.length;j++){o[g[j].name.split(":")[1]]=g[j].value}}}for(j=0;j<p.length;j++){var b;var m={start:null,stop:null,style:null};if(p.eq(j).attr("begin")){m.start=mejs.Utility.convertSMPTEtoSeconds(p.eq(j).attr("begin"))}if(!m.start&&p.eq(j-1).attr("end")){m.start=mejs.Utility.convertSMPTEtoSeconds(p.eq(j-1).attr("end"))}if(p.eq(j).attr("end")){m.stop=mejs.Utility.convertSMPTEtoSeconds(p.eq(j).attr("end"))}if(!m.stop&&p.eq(j+1).attr("begin")){m.stop=mejs.Utility.convertSMPTEtoSeconds(p.eq(j+1).attr("begin"))}if(o){b="";for(var e in o){b+=e+":"+o[e]+";"}}if(b){m.style=b}if(m.start==0){m.start=0.2}k.times.push(m);n=a.trim(p.eq(j).html()).replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,"<a href='$1' target='_blank'>$1</a>");k.text.push(n);if(k.times.start==0){k.times.start=2}}return k}},split2:function(c,b){return c.split(b)}};if("x\n\ny".split(/\n/gi).length!=3){mejs.TrackFormatParser.split2=function(f,d){var e=[],b="",c;for(c=0;c<f.length;c++){b+=f.substring(c,c+1);if(d.test(b)){e.push(b.replace(d,""));b=""}}e.push(b);return e}}})(mejs.$);(function(a){a.extend(mejs.MepDefaults,{contextMenuItems:[{render:function(b){if(typeof b.enterFullScreen=="undefined"){return null}if(b.isFullScreen){return"Turn off Fullscreen"}else{return"Go Fullscreen"}},click:function(b){if(b.isFullScreen){b.exitFullScreen()}else{b.enterFullScreen()}}},{render:function(b){if(b.media.muted){return"Unmute"}else{return"Mute"}},click:function(b){if(b.media.muted){b.setMuted(false)}else{b.setMuted(true)}}},{isSeparator:true},{render:function(b){return"Download Video"},click:function(b){window.location.href=b.media.currentSrc}}]});a.extend(MediaElementPlayer.prototype,{buildcontextmenu:function(c,b,e,d){c.contextMenu=a('<div class="mejs-contextmenu"></div>').appendTo(a("body")).hide();c.container.bind("contextmenu",function(f){if(c.isContextMenuEnabled){f.preventDefault();c.renderContextMenu(f.clientX-1,f.clientY-1);return false}});c.container.bind("click",function(){c.contextMenu.hide()});c.contextMenu.bind("mouseleave",function(){c.startContextMenuTimer()})},isContextMenuEnabled:true,enableContextMenu:function(){this.isContextMenuEnabled=true},disableContextMenu:function(){this.isContextMenuEnabled=false},contextMenuTimeout:null,startContextMenuTimer:function(){var b=this;b.killContextMenuTimer();b.contextMenuTimer=setTimeout(function(){b.hideContextMenu();b.killContextMenuTimer()},750)},killContextMenuTimer:function(){var b=this.contextMenuTimer;if(b!=null){clearTimeout(b);delete b;b=null}},hideContextMenu:function(){this.contextMenu.hide()},renderContextMenu:function(b,j){var g=this,f="",d=g.options.contextMenuItems;for(var e=0,c=d.length;e<c;e++){if(d[e].isSeparator){f+='<div class="mejs-contextmenu-separator"></div>'}else{var h=d[e].render(g);if(h!=null){f+='<div class="mejs-contextmenu-item" data-itemindex="'+e+'" id="element-'+(Math.random()*1000000)+'">'+h+"</div>"}}}g.contextMenu.empty().append(a(f)).css({top:j,left:b}).show();g.contextMenu.find(".mejs-contextmenu-item").each(function(){var k=a(this),l=parseInt(k.data("itemindex"),10),m=g.options.contextMenuItems[l];if(typeof m.show!="undefined"){m.show(k,g)}k.click(function(){if(typeof m.click!="undefined"){m.click(g)}g.contextMenu.hide()})});setTimeout(function(){g.killControlsTimer("rev3")},100)}})})(mejs.$);(function(a){a.extend(mejs.MepDefaults,{postrollCloseText:mejs.i18n.t("Close")});a.extend(MediaElementPlayer.prototype,{buildpostroll:function(e,c,g,f){var d=this,b=d.container.find('link[rel="postroll"]').attr("href");if(typeof b!=="undefined"){e.postroll=a('<div class="mejs-postroll-layer mejs-layer"><a class="mejs-postroll-close" onclick="$(this).parent().hide();return false;">'+d.options.postrollCloseText+'</a><div class="mejs-postroll-layer-content"></div></div>').prependTo(g).hide();d.media.addEventListener("ended",function(h){a.ajax({dataType:"html",url:b,success:function(j,k){g.find(".mejs-postroll-layer-content").html(j)}});e.postroll.show()},false)}}})})(mejs.$);
// END MEJS CODE

	/***  PLAYLIST CONTROLS  ***/
	mejs.Playlist = function(player){
		var me 		 = this,
			c 		 = player.container,
			n  		 = player.$node,
			id 		 = n.attr('id'),
			clss 	 = n.attr('class').split(/\s+/),
			playlist = $('[id="'+id+'-list"]');
		
		// There is a playlist associated to the player
		if(playlist.length){
			// Set the playlist node
			me.playlist = playlist;
			
			// Set the playlist class
			me.playlist.addClass('emjs-playlist');
			
			// Set the skin class to playlist
			for(var i = 0, h = clss.length; i < h; i++){
				if(/\-skin/i.test(clss[i])){
					me.skin = clss[i];
					me.playlist.addClass(me.skin);
					break;
				}
			}

			// Player size
			me.playerWidth  = c.width();
			me.playerHeight = c.height();
			
			// Set the playlist width
			me.playlist.width(c.width());
			
			// The playlist loop was activated
			me.loop = (n.attr('loop')) ? true : false;
			
            // Set the player object associated to the playlist
			me.player = player;
			// Set the player id
			me.playerId = id;

			// Set a player wrapper
			//me.playerWrapper = me.player.container.wrap('<div id="'+id+'-wrapper"></div>').parent();

			// Associate click events to the playlist items
			$('li', me.playlist).click(function(){me.selectItem($(this));});

			// Playback the next playlist item
			me.player.media.addEventListener('ended', function (e) {
				me.playNext();
			}, false);
			
			// Associate the playist to the music player
			me.player.playlist = me;
		}	
	};

	mejs.Playlist.prototype = {
		playlist 		: null,
		player 			: null,
		playerId 		: '',
		//playerWrapper 	: null,
		playerWidth 	: null,
		playerHeight 	: null,
		attributes 		:{
			show : true
		},
		skin 			: null, 
		
		removePlayer : function(){
			var me = this;
			for(var i = 0, h = mejs.players.length; i < h; i++){
				if(mejs.players[i].$media[0].id == me.playerId){
					mejs.players[i].pause();
					mejs.players.splice(i,1);
					break;
				}
					
			}
			me.player.container.remove();
		},
		
		parseItem : function(item){
			var e;
			try{
				return $.parseJSON(item);
			}catch(e){
				return item;
			}
			
		},
		
		parseSrc : function(src){
			function adjustedSrc(v){
				var d = new Date();
				v += ((v.indexOf('?') == -1) ? '?' : '&cpmp=')+d.getTime();
				return v;
			};
			
			var source = '<source';
				
			if(typeof src != 'string'){ // The src is an object 
				if(src.type) source += ' type="' + src.type + '"';
				if(src.src)  source += ' src="'  + adjustedSrc(src.src) + '"';
			}else { // The src is a string with media location
				source += ' src="' + adjustedSrc(src) + '"';
			}
			
			source += ' />';
			return source;
		},
		
		parseTrack : function(trck){
			var track = '<track';
			
			if(typeof src != 'string'){ // The trck is an object
				track += ' srclang = "' + ((trck.srclang) ? trck.srclang : 'en') + '"';
				track += ' kind = "'    + ((trck.kind)    ? trck.kind    : 'subtitles') + '"';
				if(trck.src) track += ' src="' + trck.src + '"'; 
			}else{ // The trck is a string with caption location
				track += ' kind="subtitles" srclang="en" src="' + trck + '"';
			}
			
			track += ' />';
			return track;
		},
		
		playItem : function(item){
			
			function useSilverlight(src){
				return /wmv$/i.test(src.src) || /wmv$/i.test(src.type);
			};
			
			function setClass(t, c){
				return (t.indexOf(c) == -1) ? t.replace('class="', 'class="'+c+' ') : t;
			};
			
			var me       = this,
				dim 	 = '',
				options  = me.player.options,
				isVideo  = me.player.isVideo,
				tag      = (isVideo) ? '<video' : '<audio';

			// Set ID
			tag += ' id="' + me.playerId + '"';
			
			// Set player size
			if(me.playerWidth){
				tag += ' width="' + me.playerWidth + '"';
			}	
			
			if(me.playerHeight){
				tag += ' height="' + me.playerHeight + '"';
			}	
			
			// Set the music player skin
			tag += ' class="' + ((me.skin) ? me.skin : '') + '"';
			
			if(typeof item != 'string'){
				// Assign the poster
				if(item.poster){
					tag += ' poster="' + item.poster + '"';
				}
				
				tag += ' autoplay >';

				// Assign sources
				if(item.source){
					if($.isArray(item.source)){ // many source formats
						$.each(item.source, function(i, src){
							if(useSilverlight(src)) tag = setClass(tag, 'silverlight');
							tag += me.parseSrc(src);
						});
					}else{ // only one source
						if(useSilverlight(item.source)) tag = setClass(tag, 'silverlight');
						tag += me.parseSrc(item.source);
					}
				}
				
				// Assign tracks
				if(item.track){
					if($.isArray(item.track)){ // many captions 
						$.each(item.track, function(i, track){
							tag += me.parseTrack(track);
						});
					}else{
						tag += me.parseTrack(item.track);
					}
				}
			}else{ // The item is a string with media source
				tag += ' src="' + item + '">';
			}
			
			tag += (isVideo) ? '</video>' : '</audio>';

			me.player.container.before(tag);
			//$(tag).appendTo(me.playerWrapper.empty());
			me.removePlayer();
			//me.playerWrapper.empty();
			
			
			// Set the success callback
			options['success'] = function(media, domNode, player) {
				me.player = player;
				me.player.playlist = me;
				me.player.media.addEventListener('ended', function (e) {
					me.playNext();
				}, false);
				me.player.load();
				me.player.play();
			};
			
			// Set the startVolume
			options['startVolume'] = me.player.media.volume;
			new MediaElementPlayer('[id="'+me.playerId+'"]', options);
		},
		
		/**
		 * playNext allow to play the next and previous items from playlist 
		 * if next argument is false the previous item is selected
		 */
		playNext : function(next){
			var me = this;
			
			// If playlist has fewer than  two elements, the buttons take no action
			if(me.playlist.find('li').length < 2)
				return;
			
			var	current_item = me.playlist.find('li.current:first'), // get the .current song
				item;
			
			if(typeof next == 'undefined') next = true;
			
			if (current_item.length == 0){ 
				current_item = me.playlist.find('li:first'); // get :first if we don't have .current class
			}
			
			//me.player.pause();
			
			if(current_item.length){ // If playlist is not empty
				if( ($(current_item).is(':last-child') && next) ||  ($(current_item).is(':first-child') && !next)) { // if it is last - stop playing or jump to the first item
					$(current_item).removeClass('current');
					if(me.loop){
						if(next){
							item = $('li:first', me.playlist).addClass('current')[0].getAttribute('value');
						}else{
							item = $('li:last', me.playlist).addClass('current')[0].getAttribute('value');
						}	
						me.playItem(me.parseItem(item));
					}		
				}else{ // take the next item to playback
					var next = (next) ? $(current_item).next() : $(current_item).prev(),
						item = next[0].getAttribute('value');
						
					next.addClass('current').siblings().removeClass('current');
					me.playItem(me.parseItem(item));
				}
			}
		},
		
		selectItem : function(item){
			var me = this;
			item.addClass('current').siblings().removeClass('current');
			var item = item[0].getAttribute('value');
			me.playItem(me.parseItem(item));
		}
	};
	
	/***  NEXT BUTTON CONTROL  ***/
	MediaElementPlayer.prototype.buildnext = function(player, controls, layers, media) {
        var
            // create the loop button
            next = 
            $('<div class="mejs-button mejs-next-button">' +
                '<button></button>' +
            '</div>')
            // append it to the toolbar
            .appendTo(controls)
            // add a click toggle event
            .click(function() {
				if(player.playlist)
					player.playlist.playNext();
            });    
    };
	
	/***  PREVIOUS BUTTON CONTROL  ***/
	MediaElementPlayer.prototype.buildprevious = function(player, controls, layers, media) {
        var
            // create the loop button
            next = 
            $('<div class="mejs-button mejs-previous-button">' +
                '<button></button>' +
            '</div>')
            // append it to the toolbar
            .appendTo(controls)
            // add a click toggle event
            .click(function() {
				if(player.playlist)
					player.playlist.playNext(false);
            });    
    };
	
	/***  EQ CONTROL  ***/
	MediaElementPlayer.prototype.buildeq = function(player, controls, layers, media) {
        var
            // create the eq bars
            eq = 
            $('<div class="eq" style="display:none">'+
				'<span class="bar"></span>'+
				'<span class="bar"></span>'+
				'<span class="bar"></span>'+
				'<span class="bar"></span>'+
				'<span class="bar"></span>'+
			  '</div>')	
            // append it to the toolbar
            .appendTo(controls);
			
        
		// Animate bars
		function fluctuate(bar, h) {
			var v = player.media.volume || 0,
				hgt = (Math.random()) * h * v,
				t = (hgt+1) * 30;
			
			if(media.paused || media.ended) {
				eq.hide();
			}else 
				if(media.currentTime){
					eq.show();
				}	
			
			bar.animate({
				height: hgt
			}, t, function() {
				fluctuate($(this), h);
			});
		}
		
		controls.find('.bar').each(function(i, bar){
			var b = $(bar),
				w = b.width(),
				h = b.height();
				
			b.css('left', (w*i+2*i)+'px');
			fluctuate(b, h);
		});
	};
	
	$('.codepeople-media').mediaelementplayer({
		features: ['previous','playpause','next','fullscreen','tracks','eq','current','progress','duration','volume'],
		videoVolume: 'horizontal',
		iPadUseNativeControls: false,
		iPhoneUseNativeControls: false, 
		success: function(media, node,  player) {
			if(media.pluginType && media.pluginType == 'silverlight'){
				$(node).parents('.codepeople-media').addClass('silverlight');
			}	
			
			new mejs.Playlist(player);
		}
	});
}

