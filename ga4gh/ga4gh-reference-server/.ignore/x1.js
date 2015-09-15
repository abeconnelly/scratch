(function(e, t, n) {
    function i(n) {
        var i = t.console;
        r[n] || (r[n] = !0, e.migrateWarnings.push(n), i && i.warn && !e.migrateMute && (i.warn("JQMIGRATE: " + n), e.migrateTrace && i.trace && i.trace()))
    }

    function s(t, n, r, s) {
        if (Object.defineProperty) try {
            Object.defineProperty(t, n, {
                configurable: !0,
                enumerable: !0,
                get: function() {
                    return i(s), r
                },
                set: function(e) {
                    i(s), r = e
                }
            });
            return
        } catch (o) {}
        e._definePropertyBroken = !0, t[n] = r
    }
    var r = {};
    e.migrateWarnings = [], !e.migrateMute && t.console && t.console.log && t.console.log("JQMIGRATE: Logging is active"), e.migrateTrace === n && (e.migrateTrace = !0), e.migrateReset = function() {
        r = {}, e.migrateWarnings.length = 0
    }, document.compatMode === "BackCompat" && i("jQuery is not compatible with Quirks Mode");
    var o = e("<input/>", {
            size: 1
        }).attr("size") && e.attrFn,
        u = e.attr,
        a = e.attrHooks.value && e.attrHooks.value.get || function() {
            return null
        },
        f = e.attrHooks.value && e.attrHooks.value.set || function() {
            return n
        },
        l = /^(?:input|button)$/i,
        c = /^[238]$/,
        h = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
        p = /^(?:checked|selected)$/i;
    s(e, "attrFn", o || {}, "jQuery.attrFn is deprecated"), e.attr = function(t, r, s, a) {
        var f = r.toLowerCase(),
            d = t && t.nodeType;
        if (a) {
            u.length < 4 && i("jQuery.fn.attr( props, pass ) is deprecated");
            if (t && !c.test(d) && (o ? r in o : e.isFunction(e.fn[r]))) return e(t)[r](s)
        }
        return r === "type" && s !== n && l.test(t.nodeName) && t.parentNode && i("Can't change the 'type' of an input or button in IE 6/7/8"), !e.attrHooks[f] && h.test(f) && (e.attrHooks[f] = {
            get: function(t, r) {
                var i, s = e.prop(t, r);
                return s === !0 || typeof s != "boolean" && (i = t.getAttributeNode(r)) && i.nodeValue !== !1 ? r.toLowerCase() : n
            },
            set: function(t, n, r) {
                var i;
                return n === !1 ? e.removeAttr(t, r) : (i = e.propFix[r] || r, i in t && (t[i] = !0), t.setAttribute(r, r.toLowerCase())), r
            }
        }, p.test(f) && i("jQuery.fn.attr('" + f + "') may use property instead of attribute")), u.call(e, t, r, s)
    }, e.attrHooks.value = {
        get: function(e, t) {
            var n = (e.nodeName || "").toLowerCase();
            return n === "button" ? a.apply(this, arguments) : (n !== "input" && n !== "option" && i("jQuery.fn.attr('value') no longer gets properties"), t in e ? e.value : null)
        },
        set: function(e, t) {
            var n = (e.nodeName || "").toLowerCase();
            if (n === "button") return f.apply(this, arguments);
            n !== "input" && n !== "option" && i("jQuery.fn.attr('value', val) no longer sets properties"), e.value = t
        }
    };
    var d, v, m = e.fn.init,
        g = e.parseJSON,
        y = /^([^<]*)(<[\w\W]+>)([^>]*)$/;
    e.fn.init = function(t, n, r) {
        var s;
        if (t && typeof t == "string" && !e.isPlainObject(n) && (s = y.exec(e.trim(t))) && s[0]) {
            t.charAt(0) !== "<" && i("$(html) HTML strings must start with '<' character"), s[3] && i("$(html) HTML text after last tag is ignored"), s[0].charAt(0) === "#" && (i("HTML string cannot start with a '#' character"), e.error("JQMIGRATE: Invalid selector string (XSS)")), n && n.context && (n = n.context);
            if (e.parseHTML) return m.call(this, e.parseHTML(s[2], n, !0), n, r)
        }
        return m.apply(this, arguments)
    }, e.fn.init.prototype = e.fn, e.parseJSON = function(e) {
        return !e && e !== null ? (i("jQuery.parseJSON requires a valid JSON string"), null) : g.apply(this, arguments)
    }, e.uaMatch = function(e) {
        e = e.toLowerCase();
        var t = /(chrome)[ \/]([\w.]+)/.exec(e) || /(webkit)[ \/]([\w.]+)/.exec(e) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e) || /(msie) ([\w.]+)/.exec(e) || e.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e) || [];
        return {
            browser: t[1] || "",
            version: t[2] || "0"
        }
    }, e.browser || (d = e.uaMatch(navigator.userAgent), v = {}, d.browser && (v[d.browser] = !0, v.version = d.version), v.chrome ? v.webkit = !0 : v.webkit && (v.safari = !0), e.browser = v), s(e, "browser", e.browser, "jQuery.browser is deprecated"), e.sub = function() {
        function t(e, n) {
            return new t.fn.init(e, n)
        }
        e.extend(!0, t, this), t.superclass = this, t.fn = t.prototype = this(), t.fn.constructor = t, t.sub = this.sub, t.fn.init = function(i, s) {
            return s && s instanceof e && !(s instanceof t) && (s = t(s)), e.fn.init.call(this, i, s, n)
        }, t.fn.init.prototype = t.fn;
        var n = t(document);
        return i("jQuery.sub() is deprecated"), t
    }, e.ajaxSetup({
        converters: {
            "text json": e.parseJSON
        }
    });
    var b = e.fn.data;
    e.fn.data = function(t) {
        var r, s, o = this[0];
        if (o && t === "events" && arguments.length === 1) {
            r = e.data(o, t), s = e._data(o, t);
            if ((r === n || r === s) && s !== n) return i("Use of jQuery.fn.data('events') is deprecated"), s
        }
        return b.apply(this, arguments)
    };
    var w = /\/(java|ecma)script/i,
        E = e.fn.andSelf || e.fn.addBack;
    e.fn.andSelf = function() {
        return i("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()"), E.apply(this, arguments)
    }, e.clean || (e.clean = function(t, n, r, s) {
        n = n || document, n = !n.nodeType && n[0] || n, n = n.ownerDocument || n, i("jQuery.clean() is deprecated");
        var o, u, a, f, l = [];
        e.merge(l, e.buildFragment(t, n).childNodes);
        if (r) {
            a = function(e) {
                if (!e.type || w.test(e.type)) return s ? s.push(e.parentNode ? e.parentNode.removeChild(e) : e) : r.appendChild(e)
            };
            for (o = 0;
                (u = l[o]) != null; o++)
                if (!e.nodeName(u, "script") || !a(u)) r.appendChild(u), typeof u.getElementsByTagName != "undefined" && (f = e.grep(e.merge([], u.getElementsByTagName("script")), a), l.splice.apply(l, [o + 1, 0].concat(f)), o += f.length)
        }
        return l
    });
    var S = e.event.add,
        x = e.event.remove,
        T = e.event.trigger,
        N = e.fn.toggle,
        C = e.fn.live,
        k = e.fn.die,
        L = "ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess",
        A = new RegExp("\\b(?:" + L + ")\\b"),
        O = /(?:^|\s)hover(\.\S+|)\b/,
        M = function(t) {
            return typeof t != "string" || e.event.special.hover ? t : (O.test(t) && i("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'"), t && t.replace(O, "mouseenter$1 mouseleave$1"))
        };
    e.event.props && e.event.props[0] !== "attrChange" && e.event.props.unshift("attrChange", "attrName", "relatedNode", "srcElement"), e.event.dispatch && s(e.event, "handle", e.event.dispatch, "jQuery.event.handle is undocumented and deprecated"), e.event.add = function(e, t, n, r, s) {
        e !== document && A.test(t) && i("AJAX events should be attached to document: " + t), S.call(this, e, M(t || ""), n, r, s)
    }, e.event.remove = function(e, t, n, r, i) {
        x.call(this, e, M(t) || "", n, r, i)
    }, e.fn.error = function() {
        var e = Array.prototype.slice.call(arguments, 0);
        return i("jQuery.fn.error() is deprecated"), e.splice(0, 0, "error"), arguments.length ? this.bind.apply(this, e) : (this.triggerHandler.apply(this, e), this)
    }, e.fn.toggle = function(t, n) {
        if (!e.isFunction(t) || !e.isFunction(n)) return N.apply(this, arguments);
        i("jQuery.fn.toggle(handler, handler...) is deprecated");
        var r = arguments,
            s = t.guid || e.guid++,
            o = 0,
            u = function(n) {
                var i = (e._data(this, "lastToggle" + t.guid) || 0) % o;
                return e._data(this, "lastToggle" + t.guid, i + 1), n.preventDefault(), r[i].apply(this, arguments) || !1
            };
        u.guid = s;
        while (o < r.length) r[o++].guid = s;
        return this.click(u)
    }, e.fn.live = function(t, n, r) {
        return i("jQuery.fn.live() is deprecated"), C ? C.apply(this, arguments) : (e(this.context).on(t, this.selector, n, r), this)
    }, e.fn.die = function(t, n) {
        return i("jQuery.fn.die() is deprecated"), k ? k.apply(this, arguments) : (e(this.context).off(t, this.selector || "**", n), this)
    }, e.event.trigger = function(e, t, n, r) {
        return !n && !A.test(e) && i("Global events are undocumented and deprecated"), T.call(this, e, t, n || document, r)
    }, e.each(L.split("|"), function(t, n) {
        e.event.special[n] = {
            setup: function() {
                var t = this;
                return t !== document && (e.event.add(document, n + "." + e.guid, function() {
                    e.event.trigger(n, null, t, !0)
                }), e._data(this, n, e.guid++)), !1
            },
            teardown: function() {
                return this !== document && e.event.remove(document, n + "." + e._data(this, n)), !1
            }
        }
    })
})(jQuery, window)