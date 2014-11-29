define("phyxdown/ionejs/1.0.0/ionejs-debug", [ "./core/Engine-debug", "./utils/inherits-debug", "./core/One-debug", "./geom/Point-debug", "./core/Matrix-debug", "./geom/Matrix2D-debug", "./core/events/MouseEvent-debug", "./core/Event-debug", "./core/ones/Stage-debug", "./core/ones/Painter-debug", "./core/hitTests/all-debug", "./core/hitTests/ifInCircle-debug", "./helpers/Creator-debug" ], function(require, exports, module) {
    //init ionejs namespace
    var ionejs = {};
    //ionejs.core
    var Engine = require("./core/Engine-debug");
    var Event = require("./core/Event-debug");
    var One = require("./core/One-debug");
    var Stage = require("./core/ones/Stage-debug");
    var Painter = require("./core/ones/Painter-debug");
    //ionejs.core.hitTests
    var hitTests = require("./core/hitTests/all-debug");
    //ionejs.geom
    var Point = require("./geom/Point-debug");
    var Matrix2D = require("./geom/Matrix2D-debug");
    //ionejs.helpers
    var Creator = require("./helpers/Creator-debug");
    //ionejs.utils
    var inherits = require("./utils/inherits-debug");
    //init creator
    var creator = new Creator();
    //register ones
    creator.set("One", One);
    creator.set("Stage", Stage);
    creator.set("Painter", Painter);
    //API
    ionejs.inherits = inherits;
    ionejs.create = function(config) {
        return creator.parse(config);
    };
    ionejs.register = function(alias, constructor) {
        return creator.set(alias, constructor);
    };
    //Abstract Constructors
    ionejs.One = One;
    ionejs.Stage = Stage;
    ionejs.Painter = Painter;
    ionejs.Event = Event;
    ionejs.hitTests = hitTests;
    //Helpful Classes
    ionejs.Point = Point;
    ionejs.Matrix2D = Matrix2D;
    //Helpful Functions
    ionejs.hitTests = hitTests;
    //instance
    ionejs.instance = new Engine();
    module.exports = ionejs;
});

define("phyxdown/ionejs/1.0.0/core/Engine-debug", [ "phyxdown/ionejs/1.0.0/utils/inherits-debug", "phyxdown/ionejs/1.0.0/core/One-debug", "phyxdown/ionejs/1.0.0/geom/Point-debug", "phyxdown/ionejs/1.0.0/core/Matrix-debug", "phyxdown/ionejs/1.0.0/geom/Matrix2D-debug", "phyxdown/ionejs/1.0.0/core/events/MouseEvent-debug", "phyxdown/ionejs/1.0.0/core/Event-debug" ], function(require, exports, module) {
    var inherits = require("phyxdown/ionejs/1.0.0/utils/inherits-debug");
    var One = require("phyxdown/ionejs/1.0.0/core/One-debug");
    var MouseEvent = require("phyxdown/ionejs/1.0.0/core/events/MouseEvent-debug");
    var Point = require("phyxdown/ionejs/1.0.0/geom/Point-debug");
    var Engine = function(options) {
        this._stage = null;
        this._canvas = null;
        this._debug = true;
    };
    var p = Engine.prototype;
    /**
     * @param  {core.Stage} stage
     */
    p.init = function(stage, canvas) {
        this._stage = stage;
        this._canvas = canvas;
        var offsetLeft = canvas.offsetLeft;
        var offsetTop = canvas.offsetTop;
        /**
         * Currently, the size of stage concerts the size window.
         */
        var _onResize = function() {
            canvas.width = stage.width = window.innerWidth - (offsetLeft * 2 + 5);
            canvas.height = stage.height = window.innerHeight - (offsetLeft * 2 + 5);
        };
        window.addEventListener("resize", _onResize);
        _onResize();
        /**
         * Mouse Event is transfered with capsulation.
         * See {core.events.MouseEvent} for details.
         */
        var _onMouse = function(e) {
            var global = new Point(e.pageX - offsetLeft, e.pageY - offsetTop);
            var target = stage.hit(global);
            if (!target) return;
            var local = target.globalToLocal(global);
            target.dispatchEvent(new MouseEvent({
                type: e.type,
                global: global,
                local: local
            }));
        };
        var me = this;
        canvas.addEventListener("mousedown", function() {
            _onMouse.apply(null, arguments);
        });
        document.addEventListener("mouseup", function() {
            _onMouse.apply(null, arguments);
        });
        document.addEventListener("mousemove", function() {
            _onMouse.apply(null, arguments);
        });
        canvas.addEventListener("click", _onMouse);
    };
    p.run = function() {
        var me = this;
        var canvas = me._canvas, stage = me._stage, context = canvas.getContext("2d");
        var lt = Date.now();
        var frame = function() {
            var t1 = Date.now();
            stage._draw(context);
            var t2 = Date.now();
            var dt = t2 - t1;
            setTimeout(frame, 16.6 - dt > 0 ? 16.6 - dt : 0);
            //show debug info
            var fps = 1e3 / (Date.now() - lt);
            lt = Date.now();
            if (me._debug) {
                context.save();
                context.fillStyle = "#000000";
                context.font = "bold 28px Aerial";
                context.fillText("FPS: " + (fps * 100 << 0) / 100, 30, 52);
                context.restore();
            }
        };
        frame();
    };
    module.exports = Engine;
});

define("phyxdown/ionejs/1.0.0/utils/inherits-debug", [], function(require, exports, module) {
    module.exports = function(construct, superConstruct) {
        construct._super = superConstruct;
        return construct.prototype = Object.create(superConstruct.prototype, {
            constructor: {
                value: construct,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
    };
});

define("phyxdown/ionejs/1.0.0/core/One-debug", [ "phyxdown/ionejs/1.0.0/geom/Point-debug", "phyxdown/ionejs/1.0.0/core/Matrix-debug", "phyxdown/ionejs/1.0.0/geom/Matrix2D-debug", "phyxdown/ionejs/1.0.0/utils/inherits-debug" ], function(require, exports, module) {
    var Point = require("phyxdown/ionejs/1.0.0/geom/Point-debug");
    var Matrix = require("phyxdown/ionejs/1.0.0/core/Matrix-debug");
    /**
     * What is one?
     * I mean oberservable nested existing.
     * eh..
     * That is a pity.
     */
    var One = function(options) {
        /**
         * Param check is expected.
         * The code line below is temporary.
         */
        options = options || {};
        var listeners = {};
        listeners["bubble"] = {};
        listeners["capture"] = {};
        this._listeners = listeners;
        /**
         * Duplicated names and anonymity are both permitted.
         * But this._name can't be changed after this is constructed.
         * Basically, no properties with _ prefixed can be accessed directly.
         * @option {string} name
         */
        this._name = options.name || null;
        this._parent = null;
        this._childMap = {};
        this._children = [];
        //Docs expected
        this._active = true;
        //Docs expected
        this._visible = true;
        //Docs expected
        this._hitable = false;
        this.x = options.x;
        this.y = options.y;
        this.regX = options.regX;
        this.regY = options.regY;
        this.rotation = options.rotation;
        this.scaleX = options.scaleX;
        this.scaleY = options.scaleY;
        this.skewX = options.skewX;
        this.skewY = options.skewY;
        this.alpha = options.alpha;
    };
    var p = One.prototype;
    p._mapChild = function(one) {
        if (one._name) {
            var name = one._name;
            var map = this._childMap;
            if (!map[name]) {
                map[name] = [ one ];
            } else {
                map[name].unshift(one);
            }
        }
    };
    p._unmapChild = function(one) {
        if (one._name) {
            var name = one._name;
            var map = this._childMap;
            if (!map[name]) return; else if (map[name].length == 1) delete map[name]; else {
                for (var i = 0, l = map[name].length; i < l; i++) {
                    if (map[name][i] === one) map[name].splice(i, 1);
                }
            }
        }
    };
    /**
     * Add one at the end of the child list(_children), as the tail or the top.
     * In rendering phase, the tail of the child list will be rendered over any other ones in same list.
     * @param {core.One} one
     */
    p.addChild = function(one) {
        one.setParent(this);
        this._children.push(one);
        this._mapChild(one);
    };
    /**
     * Insert one into the child list(_children) according to the index.
     * If index exceeds the length of the child list, one will be added as the tail.
     * @param  {core.One} one
     * @param  {number} index
     */
    p.insertChild = function(one, index) {
        one.setParent(this);
        this._children.splice(index, 0, one);
        this._mapChild(one);
    };
    /**
     * Remove one from the child list(_children)
     * If the one is not in the child list, removing will not make sense.
     * As this process needs iteration, meaningless removing causes considerable performance demerit.
     * @param  {core.One} one
     */
    p.removeChild = function(one) {
        var children = this._children;
        for (var i = 0, l = children.length; i < l; i++) {
            if (children[i] === one) {
                one.setParent(null);
                children.splice(i, 1);
                this._unmapChild(one);
            }
        }
    };
    /**
     * Name based query
     * @param  {string} path      eg. "pricess.leg.skin"
     * @param  {string} separator eg. "."
     * @return {core.One}
     */
    p.query = function(path, separator) {
        try {
            var separator = separator || ".";
            var names = path.split(separator);
            var _query = function(one, names) {
                if (names.length > 1) {
                    return _query(one._childMap[names.shift()][0], names);
                } else return one._childMap[names.shift()][0];
            };
            return _query(this, names) || null;
        } catch (e) {
            return null;
        }
    };
    /**
     * Get parent.
     * @return {core.One} parent
     */
    p.getParent = function() {
        return this._parent;
    };
    /**
     * Set parent.
     * @param {core.One} parent
     */
    p.setParent = function(one) {
        this._parent = one;
    };
    /**
     * Get ancestors.
     * Please read source code if you don't understand what ancestors are.
     * It's not long.
     * @return {Array}
     */
    p.getAncestors = function() {
        var arr = [];
        var cur = this;
        while (cur._parent) {
            cur = cur._parent;
            arr.push(cur);
        }
        return arr;
    };
    /**
     * Add event listener.
     * Duplicated adding would be ignored.
     * @param {string} type
     * @param {function} listener
     * @param {boolean} useCapture
     * @return {function} listener
     */
    p.addEventListener = function(type, listener, useCapture) {
        var phase = useCapture ? "capture" : "bubble";
        var arr = this._listeners[phase][type];
        for (var i = 0, l = arr ? arr.length : 0; i < l; i++) {
            if (arr[i] === listener) return;
        }
        if (!arr) this._listeners[phase][type] = [ listener ]; else arr.push(listener);
        return listener;
    };
    /**
     * Remove event listener.
     * @param  {string} type
     * @param  {function} listener
     * @param  {boolean} useCapture
     */
    p.removeEventListener = function(type, listener, useCapture) {
        var phase = useCapture ? "capture" : "bubble";
        var arr = this._listeners[phase][type];
        for (var i = 0, l = arr ? arr.length : 0; i < l; i++) {
            if (arr[i] === listener) {
                if (l == 1) delete this._listeners[phase][type]; else arr.splice(i, 1);
                break;
            }
        }
    };
    /**
     * Fire event.
     * Event dispatching in ionejs has three phases, which is similar to DOM.
     * Capture --> Target --> Bubble
     * See {core.Event} for more information.
     * @param  {core.Event} event
     */
    p.dispatchEvent = function(event) {
        event.target = this;
        var arr = this.getAncestors();
        event.phase = Event.CAPTURING_PHASE;
        for (var i = arr.length - 1; i >= 0; i--) {
            arr[i]._dispatchEvent(event);
            if (event._propagationStopped) return;
        }
        event.phase = Event.TARGET_PHASE;
        this._dispatchEvent(event);
        if (event._propagationStopped) return;
        event.phase = Event.BUBBLING_PHASE;
        for (var i = 0, len = arr.length; i < len; i++) {
            arr[i]._dispatchEvent(event);
            if (event._propagationStopped) return;
        }
    };
    p._dispatchEvent = function(event) {
        event.currentTarget = this;
        try {
            var phase = event.phase === Event.CAPTURING_PHASE ? "capture" : "bubble";
            var arr = this._listeners[phase][event.type].slice();
            for (i = 0, len = arr.length; i < len; i++) {
                arr[i](event);
                if (event._immediatePropagationStopped) break;
            }
        } catch (e) {}
    };
    p.getAbsoluteMatrix = function() {
        var ancestors = this.getAncestors();
        var m = new Matrix();
        for (var i = ancestors.length - 1; i > -1; i--) {
            m.transform(ancestors[i]);
        }
        return m.transform(this);
    };
    /**
     * convert global coordinates to local
     * @param  {geom.Point} point
     * @return {geom.Point}
     */
    p.globalToLocal = function(point) {
        //modifying
        var am = this.getAbsoluteMatrix();
        am.invert().append(1, 0, 0, 1, point.x, point.y);
        return new Point(am.x, am.y);
    };
    /**
     * convert local coordinates to global
     * @param  {geom.Point} point
     * @return {geom.Point}
     */
    p.localToGlobal = function(point) {
        var am = this.getAbsoluteMatrixi();
        am.append(1, 0, 0, 1, point.x, point.y);
        return new Point(am.x, am.y);
    };
    /**
     * Get one from descendants that seems to intersect the local coordinates,
     * which means this one is rendered over other intersected ones.
     * Please read source code if you don't understand what descendants are.
     * It's not long.
     * @param  {geom.Point} point
     * @return {core.Object}
     */
    p.hit = function(point) {
        var children = this._children;
        for (var i = children.length - 1; i > -1; i--) {
            var descendant = children[i].hit(point);
            if (descendant) return descendant;
        }
        if (this._hitable) {
            if (this.testHit(this.globalToLocal(point))) return this;
        }
        return null;
    };
    /**
     * testHit is useful when overrided, to test whether this one intersects the hit point.
     * When _hitable is set to false, testHit does not work.
     * @param  {geom.Point} point
     * @return {boolean}
     */
    p.testHit = function(point) {
        return false;
    };
    p._draw = function(context) {
        context.save();
        var am = new Matrix(this);
        context.transform(am.a, am.b, am.c, am.d, am.x, am.y);
        this._visible && this.draw(context);
        for (var i = 0, l = this._children.length; i < l; i++) {
            var child = this._children[i];
            child._draw(context);
        }
        context.restore();
    };
    /**
     * Abstract method
     * Override it to draw something.
     * @param  {Context} context This context is defined as local.
     */
    p.draw = function(context) {};
    module.exports = One;
});

define("phyxdown/ionejs/1.0.0/geom/Point-debug", [], function(require, exports, module) {
    var Point = function(x, y) {
        this.x = x;
        this.y = y;
    };
    var p = Point.prototype;
    p.distance = function(point) {
        var dx = point.x - this.x;
        var dy = point.y - this.y;
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    };
    module.exports = Point;
});

define("phyxdown/ionejs/1.0.0/core/Matrix-debug", [ "phyxdown/ionejs/1.0.0/geom/Matrix2D-debug", "phyxdown/ionejs/1.0.0/geom/Point-debug", "phyxdown/ionejs/1.0.0/utils/inherits-debug" ], function(require, exports, module) {
    var Matrix2D = require("phyxdown/ionejs/1.0.0/geom/Matrix2D-debug");
    var Point = require("phyxdown/ionejs/1.0.0/geom/Point-debug");
    var inherits = require("phyxdown/ionejs/1.0.0/utils/inherits-debug");
    var Matrix = function() {
        if (arguments.length == 6) {
            Matrix2D.apply(this, arguments);
        } else if (arguments.length == 1) {
            Matrix2D.apply(this, []);
            this.transform(arguments[0]);
        } else if (arguments.length == 0) {
            Matrix2D.apply(this, []);
        } else throw new Error("Illegal params for core.Matrix.");
    };
    var p = inherits(Matrix, Matrix2D);
    p.transform = function(one) {
        var x = one.x, y = one.y, scaleX = one.scaleX, scaleY = one.scaleY, rotation = one.rotation, skewX = one.skewX, skewY = one.skewY, regX = one.regX, regY = one.regY;
        rotation *= Math.PI / 180;
        skewX *= Math.PI / 180;
        skewY *= Math.PI / 180;
        var cos = Math.cos, sin = Math.sin;
        this.prepend(1, 0, 0, 1, regX, regY);
        this.prepend(scaleX, 0, 0, scaleY, 0, 0);
        this.prepend(cos(rotation), sin(rotation), -sin(rotation), cos(rotation), 0, 0);
        this.prepend(cos(skewY), sin(skewY), -sin(skewX), cos(skewX), 0, 0);
        this.prepend(1, 0, 0, 1, x, y);
        return this;
    };
    p.translate = function() {};
    p.rotate = function() {};
    p.skew = function() {};
    p.scale = function() {};
    module.exports = Matrix;
});

define("phyxdown/ionejs/1.0.0/geom/Matrix2D-debug", [], function(require, exports, module) {
    /**
     * Undrawable context or mathematical context is expected.
     * This class should not be exposed.
     * But currently....
     */
    function Matrix2D(a, b, c, d, x, y) {
        this.setValues(a, b, c, d, x, y);
    }
    function ignorify(args, def) {
        var defult = def || [];
        for (var i = 0, l = def.length; i < l; i++) {
            if (typeof args[i] != "number") args[i] = def[i] || 0;
        }
        return args;
    }
    var p = Matrix2D.prototype;
    p.setValues = function(a, b, c, d, x, y) {
        ignorify(arguments, [ 1, 0, 0, 1, 0, 0 ]);
        var keys = [ "a", "b", "c", "d", "x", "y" ];
        var me = this;
        var args = arguments;
        keys.forEach(function(key, i) {
            me[key] = args[i];
        });
        return this;
    };
    p.append = function(a, b, c, d, x, y) {
        ignorify(arguments, [ 1, 0, 0, 1, 0, 0 ]);
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;
        var x1 = this.x;
        var y1 = this.y;
        this.a = a1 * a + c1 * b;
        this.b = b1 * a + d1 * b;
        this.c = a1 * c + c1 * d;
        this.d = b1 * c + d1 * d;
        this.x = a1 * x + c1 * y + x1;
        this.y = b1 * x + d1 * y + y1;
        return this;
    };
    p.appendMatrix = function(matrix) {
        return this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.x, matrix.y);
    };
    p.prepend = function(a, b, c, d, x, y) {
        var pre = new Matrix2D(a, b, c, d, x, y);
        return this.copy(pre.appendMatrix(this));
    };
    p.prependMatrix = function(matrix) {
        return this.copy(matrix.appendMatrix(this));
    };
    p.identity = function() {
        this.a = this.d = 1;
        this.b = this.c = this.x = this.y = 0;
        return this;
    };
    p.invert = function() {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;
        var x1 = this.x;
        var y1 = this.y;
        var n = a1 * d1 - b1 * c1;
        this.a = d1 / n;
        this.b = -b1 / n;
        this.c = -c1 / n;
        this.d = a1 / n;
        this.x = (c1 * y1 - d1 * x1) / n;
        this.y = (b1 * x1 - a1 * y1) / n;
        return this;
    };
    p.equals = function(matrix) {
        return this.x === matrix.x && this.y === matrix.y && this.a === matrix.a && this.b === matrix.b && this.c === matrix.c && this.d === matrix.d;
    };
    p.copy = function(matrix) {
        var keys = [ "a", "b", "c", "d", "x", "y" ];
        var me = this;
        keys.forEach(function(key) {
            me[key] = matrix[key];
        });
        return this;
    };
    p.clone = function() {
        return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
    };
    module.exports = Matrix2D;
});

define("phyxdown/ionejs/1.0.0/core/events/MouseEvent-debug", [ "phyxdown/ionejs/1.0.0/utils/inherits-debug", "phyxdown/ionejs/1.0.0/core/Event-debug" ], function(require, exports, module) {
    var inherits = require("phyxdown/ionejs/1.0.0/utils/inherits-debug");
    var Event = require("phyxdown/ionejs/1.0.0/core/Event-debug");
    var lx = 0;
    var ly = 0;
    var MouseEvent = function(options) {
        Event.apply(this, arguments);
        var local = options.local;
        var global = options.global;
        this.x = local.x;
        this.y = local.y;
        this.dx = global.x - lx;
        this.dy = global.y - ly;
        lx = global.x;
        ly = global.y;
    };
    var p = inherits(MouseEvent, Event);
    module.exports = MouseEvent;
});

define("phyxdown/ionejs/1.0.0/core/Event-debug", [], function(require, exports, module) {
    var Event = function(options) {
        this.type = options.type;
        this.target = null;
        this.currentTarget = null;
        this.phase = null;
        this._immediatePropagationStoped = false;
        this._propagationStoped = false;
    };
    Event.CAPTURING_PHASE = 1;
    Event.BUBBLING_PHASE = 2;
    Event.TARGET_PHASE = 3;
    var p = Event.prototype;
    p.isPropagationStopped = function() {
        return this._propagationStoped;
    };
    p.stopImmediatePropagation = function() {
        this._immediatePropagationStoped = true;
        this._propagationStoped = true;
    };
    p.stopPropagation = function() {
        this._propagationStoped = true;
    };
    module.exports = Event;
});

define("phyxdown/ionejs/1.0.0/core/ones/Stage-debug", [ "phyxdown/ionejs/1.0.0/utils/inherits-debug", "phyxdown/ionejs/1.0.0/core/One-debug", "phyxdown/ionejs/1.0.0/geom/Point-debug", "phyxdown/ionejs/1.0.0/core/Matrix-debug", "phyxdown/ionejs/1.0.0/geom/Matrix2D-debug" ], function(require, exports, module) {
    var inherits = require("phyxdown/ionejs/1.0.0/utils/inherits-debug");
    var One = require("phyxdown/ionejs/1.0.0/core/One-debug");
    var Stage = function(options) {
        options.parent = null;
        One.apply(this, arguments);
        this._hitable = true;
        this.width = 0;
        this.height = 0;
    };
    var p = inherits(Stage, One);
    p.testHit = function(point) {
        var x = point.x, y = point.y;
        if (x > 0 && x < this.width && y > 0 && y < this.height) {
            return true;
        }
        return false;
    };
    p.draw = function(context) {
        try {
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, this.width, this.height);
        } catch (e) {}
    };
    module.exports = Stage;
});

define("phyxdown/ionejs/1.0.0/core/ones/Painter-debug", [ "phyxdown/ionejs/1.0.0/utils/inherits-debug", "phyxdown/ionejs/1.0.0/core/One-debug", "phyxdown/ionejs/1.0.0/geom/Point-debug", "phyxdown/ionejs/1.0.0/core/Matrix-debug", "phyxdown/ionejs/1.0.0/geom/Matrix2D-debug" ], function(require, exports, module) {
    var inherits = require("phyxdown/ionejs/1.0.0/utils/inherits-debug");
    var One = require("phyxdown/ionejs/1.0.0/core/One-debug");
    var Painter = function(options) {
        One.apply(this, arguments);
        var me = this;
        options.src && me.set(options.src);
    };
    var p = inherits(Painter, One);
    /**
     * set _image.src
     * ionejs does not report illegal src, but the browser does.
     * @param {string} src
     */
    p.set = function(src) {
        var me = this;
        var image = new Image();
        image.src = src;
        me._image = image;
    };
    p.draw = function(context) {
        var me = this, image = me._image;
        try {
            context.drawImage(image, 0, 0);
        } catch (e) {}
    };
    module.exports = Painter;
});

define("phyxdown/ionejs/1.0.0/core/hitTests/all-debug", [ "phyxdown/ionejs/1.0.0/core/hitTests/ifInCircle-debug" ], function(require, exports, module) {
    exports.ifInCircle = require("phyxdown/ionejs/1.0.0/core/hitTests/ifInCircle-debug");
});

define("phyxdown/ionejs/1.0.0/core/hitTests/ifInCircle-debug", [], function(require, exports, module) {
    exports.getTester = function(center, radius) {
        return function(point) {
            return point.distance(center) <= radius;
        };
    };
});

define("phyxdown/ionejs/1.0.0/helpers/Creator-debug", [], function(require, exports, module) {
    var Creator = function() {
        this._genesis = {};
    };
    var p = Creator.prototype;
    p.set = function(alias, constructor) {
        this._genesis[alias] = constructor;
        return constructor;
    };
    p.parse = function(config) {
        var me = this;
        var _parse = function(config) {
            var constructor = me._genesis[config.alias];
            var options = config.options;
            var children = config.children;
            var one = new constructor(options);
            for (var i = 0, l = children.length; i < l; i++) {
                var child = _parse(children[i]);
                one.addChild(child);
            }
            return one;
        };
        return _parse(config);
    };
    module.exports = Creator;
});
