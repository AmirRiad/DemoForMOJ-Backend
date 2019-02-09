/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.4.0
build: nightly
*/
YUI.add("scrollview-base",function(c){var h=c.ClassNameManager.getClassName,w="scrollview",v={vertical:h(w,"vert"),horizontal:h(w,"horiz")},A="scrollEnd",k="flick",a=k,b="drag",j="ui",n="left",q="top",g="px",o="scrollY",p="scrollX",e="bounce",s="disabled",u="x",t="y",x="boundingBox",m="contentBox",z="",r="0s",i=c.UA.ie,d=c.Transition,f=d.useNative,l=function(D,C,B){return Math.min(Math.max(D,C),B);};function y(){y.superclass.constructor.apply(this,arguments);}c.ScrollView=c.extend(y,c.Widget,{initializer:function(){var B=this;B._cb=B.get(m);B._bb=B.get(x);},_uiSizeCB:function(){},_onTransEnd:function(B){this.fire(A);},bindUI:function(){var B=this;B._bindDrag(B.get(b));B._bindFlick(B.get(a));B._bindAttrs();if(i){B._fixIESelect(B._bb,B._cb);}},_bindAttrs:function(){var B=this,D=B._afterScrollChange,C=B._afterDimChange;this.after({"disabledChange":B._afterDisabledChange,"flickChange":B._afterFlickChange,"dragChange":B._afterDragChange,"scrollYChange":D,"scrollXChange":D,"heightChange":C,"widthChange":C});if(!i){this.after("renderedChange",function(E){this._uiDimensionsChange();});}},_bindDrag:function(B){var C=this._bb;if(B){C.on("drag|gesturemovestart",c.bind(this._onGestureMoveStart,this));}else{C.detach("drag|*");}},_bindFlick:function(C){var B=this._cb;if(C){B.on("flick|flick",c.bind(this._flick,this),C);}else{B.detach("flick|*");}},syncUI:function(){this._cDisabled=this.get(s);this._uiDimensionsChange();this.scrollTo(this.get(p),this.get(o));},scrollTo:function(L,K,F,I){if(!this._cDisabled){var E=this._cb,G=(L!==null),D=(K!==null),C=(G)?L*-1:0,B=(D)?K*-1:0,H,J=y._TRANSITION,M=this._transEndCB;F=F||0;I=I||y.EASING;if(G){this.set(p,L,{src:j});}if(D){this.set(o,K,{src:j});}if(f){E.setStyle(J.DURATION,r).setStyle(J.PROPERTY,z);}if(F!==0){H={easing:I,duration:F/1000};if(f){H.transform=this._transform(C,B);}else{if(G){H.left=C+g;}if(D){H.top=B+g;}}if(!M){M=this._transEndCB=c.bind(this._onTransEnd,this);}E.transition(H,M);}else{if(f){E.setStyle("transform",this._transform(C,B));}else{if(G){E.setStyle(n,C+g);}if(D){E.setStyle(q,B+g);}}}}},_transform:function(B,C){return(this._forceHWTransforms)?"translate("+B+"px,"+C+"px) translateZ(0px)":"translate("+B+"px,"+C+"px)";},_moveTo:function(C,B,D){if(f){C.setStyle("transform",this._transform(B,D));}else{C.setStyle(n,B+g);C.setStyle(q,D+g);}},_forceHWTransforms:c.UA.webkit,_prevent:{start:false,move:true,end:false},_onGestureMoveStart:function(C){var B=this,D=B._bb;if(!B._cDisabled){if(B._prevent.start){C.preventDefault();}B._killTimer();B._hm=D.on("drag|gesturemove",c.bind(B._onGestureMove,B));B._hme=D.on("drag|gesturemoveend",c.bind(B._onGestureMoveEnd,B));B._startY=C.clientY+B.get(o);B._startX=C.clientX+B.get(p);B._startClientY=B._endClientY=C.clientY;B._startClientX=B._endClientX=C.clientX;B._isDragging=false;B._flicking=false;B._snapToEdge=false;}},_onGestureMove:function(C){var B=this;if(B._prevent.move){C.preventDefault();}B._isDragging=true;B._endClientY=C.clientY;B._endClientX=C.clientX;if(B._scrollsVertical){B.set(o,-(C.clientY-B._startY));}if(B._scrollsHorizontal){B.set(p,-(C.clientX-B._startX));}},_onGestureMoveEnd:function(J){if(this._prevent.end){J.preventDefault();}var Q=this,F=Q._minScrollY,B=Q._maxScrollY,G=Q._minScrollX,D=Q._maxScrollX,I=Q._scrollsVertical,R=Q._scrollsHorizontal,E=I?Q._startClientY:Q._startClientX,O=I?Q._endClientY:Q._endClientX,C=E-O,H=Math.abs(C),L=Q._bb,P,N,M,K;Q._hm.detach();Q._hme.detach();Q._scrolledHalfway=Q._snapToEdge=Q._isDragging=false;Q.lastScrolledAmt=C;if((R&&H>L.get("offsetWidth")/2)||(I&&H>L.get("offsetHeight")/2)){Q._scrolledHalfway=true;Q._scrolledForward=C>0;}if(I){K=Q.get(o);N=l(K,F,B);}if(R){M=Q.get(p);P=l(M,G,D);}if(P!==M||N!==K){this._snapToEdge=true;if(I){Q.set(o,N);}if(R){Q.set(p,P);}}if(Q._snapToEdge){return;}Q.fire(A,{onGestureMoveEnd:true});return;},_afterScrollChange:function(C){var B=C.duration,E=C.easing,D=C.newVal;if(C.src!==j){if(C.attrName==p){this._uiScrollTo(D,null,B,E);}else{this._uiScrollTo(null,D,B,E);}}},_afterFlickChange:function(B){this._bindFlick(B.newVal);},_afterDisabledChange:function(B){this._cDisabled=B.newVal;},_afterDragChange:function(B){this._bindDrag(B.newVal);},_uiScrollTo:function(B,E,C,D){C=C||this._snapToEdge?400:0;D=D||this._snapToEdge?y.SNAP_EASING:null;this.scrollTo(B,E,C,D);},_afterDimChange:function(){this._uiDimensionsChange();},_getScrollDims:function(){var G,H=this.get(p),F=this.get(o),B=this.get(m),E=this.get(x),D,C=y._TRANSITION;if(f){B.setStyle(C.DURATION,r);B.setStyle(C.PROPERTY,z);}D=this._forceHWTransforms;this._forceHWTransforms=false;this._moveTo(B,0,0);G=[E.get("offsetWidth"),E.get("offsetHeight"),E.get("scrollWidth"),E.get("scrollHeight")];this._moveTo(B,-1*H,-1*F);this._forceHWTransforms=D;return G;},_uiDimensionsChange:function(){var C=this,H=C._bb,G=y.CLASS_NAMES,I=this._getScrollDims(),F=I[0],B=I[1],D=I[2],E=I[3];if(B&&E>B){C._scrollsVertical=true;C._maxScrollY=E-B;C._minScrollY=0;C._scrollHeight=E;H.addClass(G.vertical);}else{C._scrollsVertical=false;delete C._maxScrollY;delete C._minScrollY;delete C._scrollHeight;H.removeClass(G.vertical);}if(F&&D>F){C._scrollsHorizontal=true;C._maxScrollX=D-F;C._minScrollX=0;C._scrollWidth=D;H.addClass(G.horizontal);}else{C._scrollsHorizontal=false;delete C._maxScrollX;delete C._minScrollX;delete C._scrollWidth;H.removeClass(G.horizontal);}},_flick:function(D){var C=D.flick,B=this;if(!B._cDisabled){B._currentVelocity=C.velocity;B._flicking=true;B._cDecel=B.get("deceleration");B._cBounce=B.get("bounce");B._pastYEdge=false;B._pastXEdge=false;B._flickFrame();B.fire(k);}},_flickFrame:function(){var K=this,N,C,F,B,D,G,L=K._scrollsVertical,I=K._scrollsHorizontal,H=K._cDecel,M=K._cBounce,J=K._currentVelocity,E=y.FRAME_STEP;if(L){C=K._maxScrollY;F=K._minScrollY;N=K.get(o)-(J*E);}if(I){D=K._maxScrollX;G=K._minScrollX;B=K.get(p)-(J*E);}J=K._currentVelocity=(J*H);if(Math.abs(J).toFixed(4)<=0.015){K._flicking=false;K._killTimer(!(K._pastYEdge||K._pastXEdge));if(L){if(N<F){K._snapToEdge=true;K.set(o,F);}else{if(N>C){K._snapToEdge=true;
K.set(o,C);}}}if(I){if(B<G){K._snapToEdge=true;K.set(p,G);}else{if(B>D){K._snapToEdge=true;K.set(p,D);}}}return;}if(L){if(N<F||N>C){K._pastYEdge=true;K._currentVelocity*=M;}K.set(o,N);}if(I){if(B<G||B>D){K._pastXEdge=true;K._currentVelocity*=M;}K.set(p,B);}if(!K._flickTimer){K._flickTimer=c.later(E,K,"_flickFrame",null,true);}},_killTimer:function(C){var B=this;if(B._flickTimer){B._flickTimer.cancel();B._flickTimer=null;}if(C){B.fire(A);}},_setScroll:function(H,G){if(this._cDisabled){H=c.Attribute.INVALID_VALUE;}else{var D=this._cachedBounce||this.get(e),C=y.BOUNCE_RANGE,F=(G==u)?this._maxScrollX:this._maxScrollY,E=D?-C:0,B=D?F+C:F;if(!D||!this._isDragging){if(H<E){H=E;}else{if(H>B){H=B;}}}}return H;},_setScrollX:function(B){return this._setScroll(B,u);},_setScrollY:function(B){return this._setScroll(B,t);}},{NAME:"scrollview",ATTRS:{scrollY:{value:0,setter:"_setScrollY"},scrollX:{value:0,setter:"_setScrollX"},deceleration:{value:0.93},bounce:{value:0.1},flick:{value:{minDistance:10,minVelocity:0.3}},drag:{value:true}},CLASS_NAMES:v,UI_SRC:j,BOUNCE_RANGE:150,FRAME_STEP:30,EASING:"cubic-bezier(0, 0.1, 0, 1.0)",SNAP_EASING:"ease-out",_TRANSITION:{DURATION:d._VENDOR_PREFIX+"TransitionDuration",PROPERTY:d._VENDOR_PREFIX+"TransitionProperty"}});},"3.4.0",{requires:["widget","event-gestures","transition"],skinnable:true});