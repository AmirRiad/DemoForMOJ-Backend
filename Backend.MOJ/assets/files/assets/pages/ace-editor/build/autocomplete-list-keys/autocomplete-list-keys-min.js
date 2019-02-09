/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.4.0
build: nightly
*/
YUI.add("autocomplete-list-keys",function(g){var c=40,a=13,d=27,f=9,b=38;function e(){g.before(this._unbindKeys,this,"destructor");g.before(this._bindKeys,this,"bindUI");this._initKeys();}e.prototype={_initKeys:function(){var h={},i={};this._keyEvents=[];h[c]=this._keyDown;i[a]=this._keyEnter;i[d]=this._keyEsc;i[f]=this._keyTab;i[b]=this._keyUp;this._keys=h;this._keysVisible=i;},_bindKeys:function(){this._keyEvents.push(this._inputNode.on("keydown",this._onInputKey,this));},_unbindKeys:function(){while(this._keyEvents.length){this._keyEvents.pop().detach();}},_keyDown:function(){if(this.get("visible")){this._activateNextItem();}else{this.show();}},_keyEnter:function(i){var h=this.get("activeItem");if(h){this.selectItem(h,i);}else{return false;}},_keyEsc:function(){this.hide();},_keyTab:function(i){var h;if(this.get("tabSelect")){h=this.get("activeItem");if(h){this.selectItem(h,i);return true;}}return false;},_keyUp:function(){this._activatePrevItem();},_onInputKey:function(j){var h,i=j.keyCode;this._lastInputKey=i;if(this.get("results").length){h=this._keys[i];if(!h&&this.get("visible")){h=this._keysVisible[i];}if(h){if(h.call(this,j)!==false){j.preventDefault();}}}}};g.Base.mix(g.AutoCompleteList,[e]);},"3.4.0",{requires:["autocomplete-list","base-build"]});