/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.4.0
build: nightly
*/
YUI.add("json-stringify",function(b){var j=(b.config.win||{}).JSON,N=b.Lang,p=N.isFunction,I=N.isObject,v=N.isArray,k=Object.prototype.toString,C=(k.call(j)==="[object JSON]"&&j),F=!!C,D="undefined",r="object",A="null",L="string",B="number",x="boolean",l="date",E={"undefined":D,"string":L,"[object String]":L,"number":B,"[object Number]":B,"boolean":x,"[object Boolean]":x,"[object Date]":l,"[object RegExp]":r},g="",q="{",a="}",y="[",i="]",s=",",c=",\n",m="\n",G=":",h=": ",u='"',d=/[\x00-\x07\x0b\x0e-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,n=[[/\\/g,"\\\\"],[/\"/g,'\\"'],[/\x08/g,"\\b"],[/\x09/g,"\\t"],[/\x0a/g,"\\n"],[/\x0c/g,"\\f"],[/\x0d/g,"\\r"]],t=n.length,f={},o,H;function O(P){var e=typeof P;return E[e]||E[k.call(P)]||(e===r?(P?r:A):D);}function K(e){if(!f[e]){f[e]="\\u"+("0000"+(+(e.charCodeAt(0))).toString(16)).slice(-4);o[e]=0;}if(++o[e]===H){n.push([new RegExp(e,"g"),f[e]]);t=n.length;}return f[e];}function w(Q){var e,P;for(e=0;e<t;e++){P=n[e];Q=Q.replace(P[0],P[1]);}return u+Q.replace(d,K)+u;}function z(e,P){return e.replace(/^/gm,P);}function J(P,X,e){if(P===undefined){return undefined;}var R=p(X)?X:null,W=k.call(e).match(/String|Number/)||[],Y=b.JSON.dateToString,V=[],T,S,U;o={};H=b.JSON.charCacheThreshold;if(R||!v(X)){X=undefined;}if(X){T={};for(S=0,U=X.length;S<U;++S){T[X[S]]=true;}X=T;}e=W[0]==="Number"?new Array(Math.min(Math.max(0,e),10)+1).join(" "):(e||g).slice(0,10);function Q(ab,ah){var af=ab[ah],aj=O(af),ae=[],ad=e?h:G,ac,aa,ai,Z,ag;if(I(af)&&p(af.toJSON)){af=af.toJSON(ah);}else{if(aj===l){af=Y(af);}}if(p(R)){af=R.call(ab,ah,af);}if(af!==ab[ah]){aj=O(af);}switch(aj){case l:case r:break;case L:return w(af);case B:return isFinite(af)?af+g:A;case x:return af+g;case A:return A;default:return undefined;}for(aa=V.length-1;aa>=0;--aa){if(V[aa]===af){throw new Error("JSON.stringify. Cyclical reference");}}ac=v(af);V.push(af);if(ac){for(aa=af.length-1;aa>=0;--aa){ae[aa]=Q(af,aa)||A;}}else{ai=X||af;aa=0;for(Z in ai){if(ai.hasOwnProperty(Z)){ag=Q(af,Z);if(ag){ae[aa++]=w(Z)+ad+ag;}}}}V.pop();if(e&&ae.length){return ac?y+m+z(ae.join(c),e)+m+i:q+m+z(ae.join(c),e)+m+a;}else{return ac?y+ae.join(s)+i:q+ae.join(s)+a;}}return Q({"":P},"");}if(C){try{F=("0"===C.stringify(0));}catch(M){F=false;}}b.mix(b.namespace("JSON"),{useNativeStringify:F,dateToString:function(P){function e(Q){return Q<10?"0"+Q:Q;}return P.getUTCFullYear()+"-"+e(P.getUTCMonth()+1)+"-"+e(P.getUTCDate())+"T"+e(P.getUTCHours())+G+e(P.getUTCMinutes())+G+e(P.getUTCSeconds())+"Z";},stringify:function(Q,e,P){return C&&b.JSON.useNativeStringify?C.stringify(Q,e,P):J(Q,e,P);},charCacheThreshold:100});},"3.4.0",{requires:["yui-base"]});