/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.4.0
build: nightly
*/
YUI.add("history-base",function(b){var i=b.Lang,e=b.Object,l=YUI.namespace("Env.History"),m=b.Array,n=b.config.doc,f=n.documentMode,j=b.config.win,c={merge:true},h="change",a="add",g="replace";function d(){this._init.apply(this,arguments);}b.augment(d,b.EventTarget,null,null,{emitFacade:true,prefix:"history",preventable:false,queueable:true});if(!l._state){l._state={};}function k(o){return i.type(o)==="object";}d.NAME="historyBase";d.SRC_ADD=a;d.SRC_REPLACE=g;d.html5=!!(j.history&&j.history.pushState&&j.history.replaceState&&("onpopstate" in j||b.UA.gecko>=2));d.nativeHashChange=("onhashchange" in j||"onhashchange" in n)&&(!f||f>7);b.mix(d.prototype,{_init:function(p){var o;p=this._config=p||{};this.force=!!p.force;o=this._initialState=this._initialState||p.initialState||null;this.publish(h,{broadcast:2,defaultFn:this._defChangeFn});if(o){this.replace(o);}},add:function(){var o=m(arguments,0,true);o.unshift(a);return this._change.apply(this,o);},addValue:function(p,r,o){var q={};q[p]=r;return this._change(a,q,o);},get:function(p){var q=l._state,o=k(q);if(p){return o&&e.owns(q,p)?q[p]:undefined;}else{return o?b.mix({},q,true):q;}},replace:function(){var o=m(arguments,0,true);o.unshift(g);return this._change.apply(this,o);},replaceValue:function(p,r,o){var q={};q[p]=r;return this._change(g,q,o);},_change:function(q,p,o){o=o?b.merge(c,o):c;if(o.merge&&k(p)&&k(l._state)){p=b.merge(l._state,p);}this._resolveChanges(q,p,o);return this;},_fireEvents:function(q,p,o){this.fire(h,{_options:o,changed:p.changed,newVal:p.newState,prevVal:p.prevState,removed:p.removed,src:q});e.each(p.changed,function(s,r){this._fireChangeEvent(q,r,s);},this);e.each(p.removed,function(s,r){this._fireRemoveEvent(q,r,s);},this);},_fireChangeEvent:function(q,o,p){this.fire(o+"Change",{newVal:p.newVal,prevVal:p.prevVal,src:q});},_fireRemoveEvent:function(q,o,p){this.fire(o+"Remove",{prevVal:p,src:q});},_resolveChanges:function(u,s,p){var t={},o,r=l._state,q={};s||(s={});p||(p={});if(k(s)&&k(r)){e.each(s,function(v,w){var x=r[w];if(v!==x){t[w]={newVal:v,prevVal:x};o=true;}},this);e.each(r,function(w,v){if(!e.owns(s,v)||s[v]===null){delete s[v];q[v]=w;o=true;}},this);}else{o=s!==r;}if(o||this.force){this._fireEvents(u,{changed:t,newState:s,prevState:r,removed:q},p);}},_storeState:function(p,o){l._state=o||{};},_defChangeFn:function(o){this._storeState(o.src,o.newVal,o._options);}},true);b.HistoryBase=d;},"3.4.0",{requires:["event-custom-complex"]});