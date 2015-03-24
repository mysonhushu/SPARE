// see github.com/paulkienitz/SPARE
var SPARE=function(){var canDoAJAX=!1,canUseResponseXML=!1,canUseQuerySelector=!1,canOverrideMimeType=!1,ResultExtractor=function(e,t){this.fakeErrorNumber=0,this.fakeErrorText="",this.documentFragmentMode=!e,this.extractAndUse=function(r){var n=null,o=!1;try{var a=!1,s=!1;try{a="document"==r.responseType&&r.responseXML&&!!(this.documentFragmentMode?r.responseXML.getElementsByTagName:r.responseXML.getElementById)}catch(i){}try{s="document"!=r.responseType&&r.responseText&&r.responseText.length}catch(i){}if(a)if(o=!0,this.documentFragmentMode){var c=r.responseXML.getElementsByTagName("body");n=c[0]||r.responseXML}else n=r.responseXML.getElementById(e);if(!n&&s)if(this.documentFragmentMode){n=document.createElement("div"),n.innerHTML=r.responseText,o=!0;var c=n.getElementsByTagName("body");n=c[0]||n}else{var l=document.createElement("div");l.innerHTML=r.responseText,o=!0,n=l.querySelector("#"+e)}if(!o)return this.fakeErrorNumber=-2,this.fakeErrorText="SPARE could not interpret the content of "+r.ourUrl+" as HTML",!1;if(!n&&e)return this.fakeErrorNumber=-1,this.fakeErrorText="SPARE could not find element '"+e+"' in downloaded content",!1;for(;t.firstChild;)t.removeChild(t.firstChild);for(;n.firstChild;)t.appendChild(n.firstChild);return!0}catch(i){this.fakeErrorNumber||(this.fakeErrorNumber=-3),this.fakeErrorText="SPARE caught exception "+i.name+": "+i.message}}},Transaction=function(url,postData,timeout,extractor,callbackContextData,onSuccess,onFailure){var xmlhttp=new XMLHttpRequest,verb="GET",aborted=!1,timer=null;this.abort=function(){if(xmlhttp.readyState<4){aborted=!0;try{xmlhttp.abort()}catch(e){}downloadFailed(408,"SPARE time limit exceeded")}},this.start=function(){"POST"==verb?(xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded"),xmlhttp.send(postData)):xmlhttp.send(),timeout&&(timer=setTimeout(this.abort,1e3*timeout))};var downloadFailed=function(errorNumber,errorText){"string"==typeof onFailure?eval(onFailure):onFailure?onFailure(callbackContextData,errorNumber,errorText):window.location.href=url},downloadSucceeded=function(){extractor.extractAndUse(xmlhttp)?"string"==typeof onSuccess?eval(onSuccess):onSuccess&&onSuccess(callbackContextData):downloadFailed(extractor.fakeErrorNumber,extractor.fakeErrorText)},stateChangedHandler=function(){4!=xmlhttp.readyState||aborted||(clearTimeout(timer),200==xmlhttp.status?downloadSucceeded():downloadFailed(xmlhttp.status,xmlhttp.statusText))};"string"==typeof postData&&(verb="POST"),xmlhttp.onreadystatechange=stateChangedHandler,xmlhttp.ourUrl=url,xmlhttp.open(verb,url,!0),!canUseResponseXML||!canOverrideMimeType&&extractor.documentFragmentMode?xmlhttp.responseType="text":(xmlhttp.responseType="document",canOverrideMimeType&&xmlhttp.overrideMimeType("text/html"))};if("XMLHttpRequest"in window&&"getElementById"in document){canDoAJAX=!0,document.querySelector&&(canUseQuerySelector=!0);var xhr=new XMLHttpRequest;if(xhr.open("GET",window.location.href,!1),xhr.overrideMimeType)try{xhr.overrideMimeType("text/html"),canOverrideMimeType=!0}catch(e){}if(canUseQuerySelector)try{xhr.responseType="document"}catch(e){canUseResponseXML=!0}}return{timeout:null,transitionalContentID:null,onSuccess:null,onFailure:null,makeTransaction:function(e,t,r,n,o,a,s){return new Transaction(e,t,r,n,o,a,s)},makeResultExtractor:function(e,t){return new ResultExtractor(e,t)},supportLevel:function(){return canDoAJAX?canUseResponseXML&&canOverrideMimeType?3:canUseQuerySelector?2:1:0},replaceContent:function(e,t,r,n,o,a,s,i,c){if(!canDoAJAX||r&&!canUseQuerySelector&&!canUseResponseXML)throw new Error("SPARE cannot operate; supportLevel is "+(canDoAJAX?1:0));if("string"!=typeof t||0==t.length)throw new Error("SPARE - pageURL is required");var l=document.getElementById(e);if(!l)throw new Error("SPARE could not find target element '"+e+"'");a||(a=SPARE.onSuccess),s||(s=SPARE.onFailure),i||(i=SPARE.transitionalContentID),isNaN(c)&&!isNaN(SPARE.timeout)&&(c=SPARE.timeout),(isNaN(c)||1>c||c>3600)&&(c=null);var u=new ResultExtractor(r,l),d=new Transaction(t,n,c,u,o,a,s);if(i){var m=document.getElementById(i);m&&m.innerHTML&&(l.innerHTML=m.innerHTML)}d.start()}}}();
