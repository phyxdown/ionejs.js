define("phyxdown/ionejs/1.0.0/ionejs",["./core/Engine","./utils/inherits","./core/One","./geom/Point","./core/Matrix","./geom/Matrix2D","./core/events/MouseEvent","./core/Event","./core/ctrls/DropCtrl","./core/events/DropEvent","./core/ones/Phantom","./core/ctrls/MoveCtrl","./core/ones/Stage","./core/ones/Painter","./core/hitTests/all","./core/hitTests/ifInCircle","./helpers/Creator"],function(a,b,c){var d={},e=a("./core/Engine"),f=a("./core/Event"),g=a("./core/One"),h=a("./core/ones/Stage"),i=a("./core/ones/Painter"),j=a("./core/hitTests/all"),k=a("./geom/Point"),l=a("./geom/Matrix2D"),m=a("./helpers/Creator"),n=a("./utils/inherits"),o=new m;o.set("One",g),o.set("Stage",h),o.set("Painter",i),d.inherits=n,d.create=function(a){return o.parse(a)},d.register=function(a,b){return o.set(a,b)},d.One=g,d.Stage=h,d.Painter=i,d.Event=f,d.hitTests=j,d.Point=k,d.Matrix2D=l,d.hitTests=j,d.instance=new e,c.exports=d}),define("phyxdown/ionejs/1.0.0/core/Engine",["phyxdown/ionejs/1.0.0/utils/inherits","phyxdown/ionejs/1.0.0/core/One","phyxdown/ionejs/1.0.0/geom/Point","phyxdown/ionejs/1.0.0/core/Matrix","phyxdown/ionejs/1.0.0/geom/Matrix2D","phyxdown/ionejs/1.0.0/core/events/MouseEvent","phyxdown/ionejs/1.0.0/core/Event","phyxdown/ionejs/1.0.0/core/ctrls/DropCtrl","phyxdown/ionejs/1.0.0/core/events/DropEvent","phyxdown/ionejs/1.0.0/core/ones/Phantom","phyxdown/ionejs/1.0.0/core/ctrls/MoveCtrl"],function(a,b,c){a("phyxdown/ionejs/1.0.0/utils/inherits"),a("phyxdown/ionejs/1.0.0/core/One");var d=a("phyxdown/ionejs/1.0.0/core/events/MouseEvent"),e=a("phyxdown/ionejs/1.0.0/geom/Point"),f=function(){this._stage=null,this._canvas=null,this._debug=!0},g=f.prototype;g.init=function(a,b){this._stage=a,this._canvas=b;var c=b.offsetLeft,f=b.offsetTop,g=function(){b.width=a.width=window.innerWidth-(2*c+5),b.height=a.height=window.innerHeight-(2*c+5)};window.addEventListener("resize",g),g();var h=function(b){var g=new e(b.pageX-c,b.pageY-f),h=a.hit(g);if(h){var i=h.globalToLocal(g);h.dispatchEvent(new d({type:b.type,global:g,local:i}))}};b.addEventListener("mousedown",function(){h.apply(null,arguments)}),document.addEventListener("mouseup",function(){h.apply(null,arguments)}),document.addEventListener("mousemove",function(){h.apply(null,arguments)}),b.addEventListener("click",h)},g.run=function(){var a=this,b=a._canvas,c=a._stage,d=b.getContext("2d"),e=Date.now(),f=function(){var b=Date.now();c._draw(d),c._update();var g=Date.now(),h=g-b;setTimeout(f,16.6-h>0?16.6-h:0);var i=1e3/(Date.now()-e);e=Date.now(),a._debug&&(d.save(),d.fillStyle="#000000",d.font="bold 28px Aerial",d.fillText("FPS: "+(100*i<<0)/100,30,52),d.restore())};f()},g.dropable=function(){var b=a("phyxdown/ionejs/1.0.0/core/ctrls/DropCtrl");return b.init(this._stage)},g.moveable=function(){var b=a("phyxdown/ionejs/1.0.0/core/ctrls/MoveCtrl");return b.init(this._stage)},c.exports=f}),define("phyxdown/ionejs/1.0.0/utils/inherits",[],function(a,b,c){c.exports=function(a,b){return a._super=b,a.prototype=Object.create(b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}})}}),define("phyxdown/ionejs/1.0.0/core/One",["phyxdown/ionejs/1.0.0/geom/Point","phyxdown/ionejs/1.0.0/core/Matrix","phyxdown/ionejs/1.0.0/geom/Matrix2D","phyxdown/ionejs/1.0.0/utils/inherits"],function(a,b,c){a("phyxdown/ionejs/1.0.0/geom/Point");var d=a("phyxdown/ionejs/1.0.0/core/Matrix"),e=function(a){a=a||{};var b={};b.bubble={},b.capture={},this._listeners=b,this._name=a.name||null,this._parent=null,this._childMap={},this._children=[],this._active=!0,this._visible=!0,this._hitable=!1,this._moveable=!1,this._dropable=!1,this.x=a.x||0,this.y=a.y||0,this.regX=a.regX||0,this.regY=a.regY||0,this.rotation=a.rotation||0,this.scaleX=a.scaleX||1,this.scaleY=a.scaleY||1,this.skewX=a.skewX||0,this.skewY=a.skewY||0,this.alpha=a.alpha||1},f=e.prototype;f._mapChild=function(a){if(a._name){var b=a._name,c=this._childMap;c[b]?c[b].unshift(a):c[b]=[a]}},f._unmapChild=function(a){if(a._name){var b=a._name,c=this._childMap;if(!c[b])return;if(1==c[b].length)delete c[b];else for(var d=0,e=c[b].length;e>d;d++)c[b][d]===a&&c[b].splice(d,1)}},f.addChild=function(a){a.setParent(this),this._children.push(a),this._mapChild(a)},f.insertChild=function(a,b){a.setParent(this),this._children.splice(b,0,a),this._mapChild(a)},f.removeChild=function(a){for(var b=this._children,c=0,d=b.length;d>c;c++)b[c]===a&&(a.setParent(null),b.splice(c,1),this._unmapChild(a))},f.query=function(a,b){try{var b=b||".",c=a.split(b),d=function(a,b){return b.length>1?d(a._childMap[b.shift()][0],b):a._childMap[b.shift()][0]};return d(this,c)||null}catch(e){return null}},f.getParent=function(){return this._parent},f.setParent=function(a){this._parent=a},f.getAncestors=function(){for(var a=[],b=this;b._parent;)b=b._parent,a.push(b);return a},f.addEventListener=function(a,b,c){for(var d=c?"capture":"bubble",e=this._listeners[d][a],f=0,g=e?e.length:0;g>f;f++)if(e[f]===b)return;return e?e.push(b):this._listeners[d][a]=[b],b},f.removeEventListener=function(a,b,c){for(var d=c?"capture":"bubble",e=this._listeners[d][a],f=0,g=e?e.length:0;g>f;f++)if(e[f]===b){1==g?delete this._listeners[d][a]:e.splice(f,1);break}},f.dispatchEvent=function(a){a.target=this;var b=this.getAncestors();a.phase=Event.CAPTURING_PHASE;for(var c=b.length-1;c>=0;c--)if(b[c]._dispatchEvent(a),a._propagationStopped)return;if(a.phase=Event.TARGET_PHASE,this._dispatchEvent(a),!a._propagationStopped){a.phase=Event.BUBBLING_PHASE;for(var c=0,d=b.length;d>c;c++)if(b[c]._dispatchEvent(a),a._propagationStopped)return}},f._dispatchEvent=function(a){a.currentTarget=this;var b,c;try{b=a.phase===Event.CAPTURING_PHASE?"capture":"bubble",c=this._listeners[b][a.type].slice()}catch(d){return}for(var e=0,f=c.length;f>e;e++)try{if(c[e](a),a._immediatePropagationStopped)break}catch(d){console.log(d)}},f.overlay=function(a,b){var b=b||["x","y","scaleX","scaleY","rotation","skewX","skewY","regX","regY","alpha"],c=this;b.forEach(function(b){c[b]=a[b]})},f.getAbsoluteMatrix=function(){for(var a=this.getAncestors(),b=new d,c=a.length-1;c>-1;c--)b.transform(a[c]);return b.transform(this)},f.globalToLocal=function(a){return a.clone().retransform(this.getAbsoluteMatrix())},f.localToGlobal=function(a){return a.clone().transform(this.getAbsoluteMatrix())},f.hit=function(a){for(var b=this._children,c=b.length-1;c>-1;c--){var d=b[c].hit(a);if(d)return d}return this._hitable&&this.testHit(this.globalToLocal(a))?this:null},f.testHit=function(){return!1},f._draw=function(a){a.save();var b=new d(this);if(a.transform(b.a,b.b,b.c,b.d,b.x,b.y),a.globalAlpha*=this.alpha,this._visible)try{this.draw(a)}catch(c){console.log(c,this)}for(var e=0,f=this._children.length;f>e;e++){var g=this._children[e];g._draw(a)}a.restore()},f.draw=function(){},f._update=function(){if(this._active)try{this.update()}catch(a){console.log(a,this)}for(var b=0,c=this._children.length;c>b;b++){var d=this._children[b];d._update()}},f.update=function(){},f.mode=function(a){switch(a){case"moveable":this._hitable=!0,this._moveable=!0,this._dropable=!1;break;case"dropable":this._hitable=!0,this._moveable=!1,this._dropable=!0}},c.exports=e}),define("phyxdown/ionejs/1.0.0/geom/Point",[],function(a,b,c){var d=function(a,b){this.x=a,this.y=b},e=d.prototype;e.distance=function(a){var b=a.x-this.x,c=a.y-this.y;return Math.sqrt(Math.pow(b,2)+Math.pow(c,2))},e.transform=function(a){var b=a.append(1,0,0,1,this.x,this.y);return this.x=b.x,this.y=b.y,this},e.retransform=function(a){var b=a.invert().append(1,0,0,1,this.x,this.y);return this.x=b.x,this.y=b.y,this},e.clone=function(){return new d(this.x,this.y)},c.exports=d}),define("phyxdown/ionejs/1.0.0/core/Matrix",["phyxdown/ionejs/1.0.0/geom/Matrix2D","phyxdown/ionejs/1.0.0/geom/Point","phyxdown/ionejs/1.0.0/utils/inherits"],function(a,b,c){var d=a("phyxdown/ionejs/1.0.0/geom/Matrix2D");a("phyxdown/ionejs/1.0.0/geom/Point");var e=a("phyxdown/ionejs/1.0.0/utils/inherits"),f=function(){if(6==arguments.length)d.apply(this,arguments);else if(1==arguments.length)d.apply(this,[]),this.transform(arguments[0]);else{if(0!=arguments.length)throw new Error("Illegal params for core.Matrix.");d.apply(this,[])}},g=e(f,d);g.transform=function(a){var b=a.x,c=a.y,d=a.scaleX,e=a.scaleY,f=a.rotation,g=a.skewX,h=a.skewY,i=a.regX,j=a.regY;f*=Math.PI/180,g*=Math.PI/180,h*=Math.PI/180;var k=Math.cos,l=Math.sin;return this.prepend(1,0,0,1,i,j),this.prepend(d,0,0,e,0,0),this.prepend(k(f),l(f),-l(f),k(f),0,0),this.prepend(k(h),l(h),-l(g),k(g),0,0),this.prepend(1,0,0,1,b,c),this},g.translate=function(){},g.rotate=function(){},g.skew=function(){},g.scale=function(){},c.exports=f}),define("phyxdown/ionejs/1.0.0/geom/Matrix2D",[],function(a,b,c){function d(a,b,c,d,e,f){this.setValues(a,b,c,d,e,f)}function e(a,b){for(var c=0,d=b.length;d>c;c++)"number"!=typeof a[c]&&(a[c]=b[c]||0);return a}var f=d.prototype;f.setValues=function(){e(arguments,[1,0,0,1,0,0]);var a=["a","b","c","d","x","y"],b=this,c=arguments;return a.forEach(function(a,d){b[a]=c[d]}),this},f.append=function(a,b,c,d,f,g){e(arguments,[1,0,0,1,0,0]);var h=this.a,i=this.b,j=this.c,k=this.d,l=this.x,m=this.y;return this.a=h*a+j*b,this.b=i*a+k*b,this.c=h*c+j*d,this.d=i*c+k*d,this.x=h*f+j*g+l,this.y=i*f+k*g+m,this},f.appendMatrix=function(a){return this.append(a.a,a.b,a.c,a.d,a.x,a.y)},f.prepend=function(a,b,c,e,f,g){var h=new d(a,b,c,e,f,g);return this.copy(h.appendMatrix(this))},f.prependMatrix=function(a){return this.copy(a.appendMatrix(this))},f.identity=function(){return this.a=this.d=1,this.b=this.c=this.x=this.y=0,this},f.invert=function(){var a=this.a,b=this.b,c=this.c,d=this.d,e=this.x,f=this.y,g=a*d-b*c;return this.a=d/g,this.b=-b/g,this.c=-c/g,this.d=a/g,this.x=(c*f-d*e)/g,this.y=(b*e-a*f)/g,this},f.equals=function(a){return this.x===a.x&&this.y===a.y&&this.a===a.a&&this.b===a.b&&this.c===a.c&&this.d===a.d},f.copy=function(a){var b=["a","b","c","d","x","y"],c=this;return b.forEach(function(b){c[b]=a[b]}),this},f.clone=function(){return new d(this.a,this.b,this.c,this.d,this.tx,this.ty)},c.exports=d}),define("phyxdown/ionejs/1.0.0/core/events/MouseEvent",["phyxdown/ionejs/1.0.0/utils/inherits","phyxdown/ionejs/1.0.0/core/Event"],function(a,b,c){var d=a("phyxdown/ionejs/1.0.0/utils/inherits"),e=a("phyxdown/ionejs/1.0.0/core/Event"),f=0,g=0,h=function(a){e.apply(this,arguments);var b=a.local.clone(),c=a.global.clone();this.x=b.x,this.y=b.y,this.dx=c.x-f,this.dy=c.y-g,f=c.x,g=c.y,this.local=b,this.global=c};h.validate=function(){},d(h,e),c.exports=h}),define("phyxdown/ionejs/1.0.0/core/Event",[],function(a,b,c){var d=function(a){this.type=a.type,this.target=null,this.currentTarget=null,this.phase=null,this._immediatePropagationStoped=!1,this._propagationStoped=!1};d.CAPTURING_PHASE=1,d.BUBBLING_PHASE=2,d.TARGET_PHASE=3;var e=d.prototype;e.isPropagationStopped=function(){return this._propagationStoped},e.stopImmediatePropagation=function(){this._immediatePropagationStoped=!0,this._propagationStoped=!0},e.stopPropagation=function(){this._propagationStoped=!0},c.exports=d}),define("phyxdown/ionejs/1.0.0/core/ctrls/DropCtrl",["phyxdown/ionejs/1.0.0/core/events/DropEvent","phyxdown/ionejs/1.0.0/utils/inherits","phyxdown/ionejs/1.0.0/core/Event","phyxdown/ionejs/1.0.0/core/ones/Phantom","phyxdown/ionejs/1.0.0/core/One","phyxdown/ionejs/1.0.0/geom/Point","phyxdown/ionejs/1.0.0/core/Matrix","phyxdown/ionejs/1.0.0/geom/Matrix2D"],function(a){var b=a("phyxdown/ionejs/1.0.0/core/events/DropEvent"),c=a("phyxdown/ionejs/1.0.0/core/ones/Phantom"),d=function(){this.down=!1,this.dropSource=null,this.phantom=new c,this.phantom.set(null),this.phantom.alpha=.4},e=d.prototype;return e.init=function(a){var c=this;a.addChild(c.phantom),a.addEventListener("mousedown",function(a){c.down=!0,a.target._dropable&&(c.dropSource=a.target,c.phantom.set(a.target))}),a.addEventListener("mouseup",function(a){c.down=!1;var d=a.target;c.dropSource&&d&&d!==c.dropSource&&d.dispatchEvent(new b({type:b.DROP,global:a.global,local:a.local,dropSource:c.dropSource})),c.dropSource=null,c.phantom.set(null)}),a.addEventListener("mousemove",function(a){if(c.dropSource){if(!c.down)return c.dropSource=null,void 0;c.phantom.x+=a.dx,c.phantom.y+=a.dy}})},new d}),define("phyxdown/ionejs/1.0.0/core/events/DropEvent",["phyxdown/ionejs/1.0.0/utils/inherits","phyxdown/ionejs/1.0.0/core/Event"],function(a,b,c){var d=a("phyxdown/ionejs/1.0.0/utils/inherits"),e=a("phyxdown/ionejs/1.0.0/core/Event"),f=function(a){e.apply(this,arguments);var b=a.local.clone(),c=a.global.clone();this.x=b.x,this.y=b.y,this.local=b,this.global=c,this.dropSource=a.dropSource};f.DROP="drop",f.validate=function(){},d(f,e),c.exports=f}),define("phyxdown/ionejs/1.0.0/core/ones/Phantom",["phyxdown/ionejs/1.0.0/utils/inherits","phyxdown/ionejs/1.0.0/core/One","phyxdown/ionejs/1.0.0/geom/Point","phyxdown/ionejs/1.0.0/core/Matrix","phyxdown/ionejs/1.0.0/geom/Matrix2D"],function(a,b,c){var d=a("phyxdown/ionejs/1.0.0/utils/inherits"),e=a("phyxdown/ionejs/1.0.0/core/One"),f=function(){e.apply(this,arguments)},g=d(f,e);g.set=function(a){a instanceof e||null==a?(this._origin=a,a&&this.overlay(a.getParent(),["x","y","scaleX","scaleX","rotation","skewX","skewY","regX","regY"])):console.log("#phantom.set#","illegal params.")},g.draw=function(a){var b=this;b._origin&&b._origin._draw(a)},c.exports=f}),define("phyxdown/ionejs/1.0.0/core/ctrls/MoveCtrl",[],function(){var a=function(){this.down=!1,this.moveSource=null},b=a.prototype;return b.init=function(a){var b=this;a.addEventListener("mousedown",function(a){b.down=!0,a.target._moveable&&(b.moveSource=a.target)}),a.addEventListener("mouseup",function(){b.down=!1,b.dropSource=null}),a.addEventListener("mousemove",function(a){if(b.moveSource){if(!b.down)return b.moveSource=null,void 0;b.moveSource.x+=a.dx,b.moveSource.y+=a.dy}})},new a}),define("phyxdown/ionejs/1.0.0/core/ones/Stage",["phyxdown/ionejs/1.0.0/utils/inherits","phyxdown/ionejs/1.0.0/core/One","phyxdown/ionejs/1.0.0/geom/Point","phyxdown/ionejs/1.0.0/core/Matrix","phyxdown/ionejs/1.0.0/geom/Matrix2D"],function(a,b,c){var d=a("phyxdown/ionejs/1.0.0/utils/inherits"),e=a("phyxdown/ionejs/1.0.0/core/One"),f=function(a){a.parent=null,e.apply(this,arguments),this._hitable=!0,this.width=0,this.height=0},g=d(f,e);g.testHit=function(a){var b=a.x,c=a.y;return b>0&&b<this.width&&c>0&&c<this.height?!0:!1},g.draw=function(a){try{a.fillStyle="#ffffff",a.fillRect(0,0,this.width,this.height)}catch(b){}},c.exports=f}),define("phyxdown/ionejs/1.0.0/core/ones/Painter",["phyxdown/ionejs/1.0.0/utils/inherits","phyxdown/ionejs/1.0.0/core/One","phyxdown/ionejs/1.0.0/geom/Point","phyxdown/ionejs/1.0.0/core/Matrix","phyxdown/ionejs/1.0.0/geom/Matrix2D"],function(a,b,c){var d=a("phyxdown/ionejs/1.0.0/utils/inherits"),e=a("phyxdown/ionejs/1.0.0/core/One"),f=function(a){e.apply(this,arguments);var b=this;a.src&&b.set(a.src)},g=d(f,e);g.set=function(a){var b=this,c=new Image;c.src=a,b._image=c},g.draw=function(a){var b=this,c=b._image;a.drawImage(c,0,0)},c.exports=f}),define("phyxdown/ionejs/1.0.0/core/hitTests/all",["phyxdown/ionejs/1.0.0/core/hitTests/ifInCircle"],function(a,b){b.ifInCircle=a("phyxdown/ionejs/1.0.0/core/hitTests/ifInCircle")}),define("phyxdown/ionejs/1.0.0/core/hitTests/ifInCircle",[],function(a,b){b.getTester=function(a,b){return function(c){return c.distance(a)<=b}}}),define("phyxdown/ionejs/1.0.0/helpers/Creator",[],function(a,b,c){var d=function(){this._genesis={}},e=d.prototype;e.set=function(a,b){return this._genesis[a]=b,b},e.parse=function(a){var b=this,c=function(a){for(var d=b._genesis[a.alias],e=a.options,f=a.children,g=new d(e),h=0,i=f.length;i>h;h++){var j=c(f[h]);g.addChild(j)}return g};return c(a)},c.exports=d});
