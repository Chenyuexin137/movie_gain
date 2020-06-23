;
! function (t, e) {
    function n() {
        var n = "-",
            i = a.encode,
            r = t.screen,
            o = t.navigator,
            s = this._getViewport();
        this.screen = r ? r.width + "x" + r.height : n, this.viewport = s.width + "x" + s.height, this.charset = i(e.characterSet ? e.characterSet : e.charset ? e.charset : n), this.language = (o && o.language ? o.language : o && o.browserLanguage ? o.browserLanguage : n).toLowerCase(), this.javaEnabled = o && o.javaEnabled() ? 1 : 0, this.isFirstVisit = !1, this.setCookie()
    }

    function i(t) {
        this.url = t
    }

    function r(t) {
        this._config = a.merge({
            sampleRate: 100,
            useCombo: !0,
            autotags: !0,
            beacon: e.location.protocol + "//frep.meituan.net/_.gif"
        }, t || {}), this._client = new n, this._beacon = new i(this._config.beacon), this._queue = [], this._timer = null, this._app = null, this._tags = {}, this.visitorCode = a.random()
    }
    var o = Object.prototype.hasOwnProperty,
        a = {
            hash: function (t) {
                var e, n = 1,
                    i = 0;
                if (t)
                    for (n = 0, e = t.length - 1; e >= 0; e--) i = t.charCodeAt(e), n = (n << 6 & 268435455) + i + (i << 14), i = 266338304 & n, n = 0 !== i ? n ^ i >> 21 : n;
                return n
            },
            keyPaths: function (t, e) {
                function n(t) {
                    return r.length >= 10 ? void e(r.concat(), t) : t instanceof Object ? void i(t).forEach(function (e) {
                        r.push(e), n(t[e]), r.pop()
                    }) : void e(r.concat(), t)
                }
                var i = Object.keys || function (t) {
                        var e = [];
                        for (var n in t) o.call(t, n) && e.push(n);
                        return e
                    },
                    r = [];
                n(t)
            },
            whitelistify: function (t, e) {
                var n = [];
                a.keyPaths(e, function (t) {
                    n.push(t.join("."))
                });
                var i = "|" + n.join("|") + "|",
                    r = {};
                return a.keyPaths(t, function (t, e) {
                    if (-1 !== i.indexOf("|" + t.join(".") + "|"))
                        for (var n = r, o = 0; o < t.length; o++) n[t[o]] || (n[t[o]] = {}), o === t.length - 1 && (n[t[o]] = e), n = n[t[o]]
                }), r
            },
            random: function () {
                return Math.round(2147483647 * Math.random())
            },
            stringify: function (t) {
                if ("undefined" != typeof JSON && JSON.stringify) return JSON.stringify(t);
                var e = typeof t;
                switch (e) {
                    case "string":
                        return '"' + t + '"';
                    case "boolean":
                    case "number":
                        return String(t);
                    case "object":
                        if (null === t) return "null";
                        var n = !1,
                            i = "";
                        for (var r in t)
                            if (o.call(t, r)) {
                                var s = "" + r,
                                    c = a.stringify(t[r]);
                                c.length && (n ? i += "," : n = !0, i += t instanceof Array ? c : '"' + s + '":' + c)
                            }
                        return t instanceof Array ? "[" + i + "]" : "{" + i + "}";
                    default:
                        return ""
                }
            },
            debug: function (t, e) {
                "undefined" != typeof console && console.log && (e && console.warn ? console.warn(t) : console.log(t))
            },
            encode: function (t, e) {
                return encodeURIComponent instanceof Function ? e ? encodeURI(t) : encodeURIComponent(t) : escape(t)
            },
            decode: function (t, e) {
                var n;
                if (t = t.split("+").join(" "), decodeURIComponent instanceof Function) try {
                    n = e ? decodeURI(t) : decodeURIComponent(t)
                } catch (i) {
                    n = unescape(t)
                } else n = unescape(t);
                return n
            },
            merge: function (t, e) {
                for (var n in e) o.call(e, n) && (t[n] = e[n]);
                return t
            },
            buildQueryString: function (t) {
                var e, n = a.encode,
                    i = [];
                for (e in t)
                    if (o.call(t, e)) {
                        var r = "object" == typeof t[e] ? a.stringify(t[e]) : t[e];
                        i.push(n(e) + "=" + n(r))
                    }
                return i.join("&")
            },
            addEventListener: function (e, n, i) {
                return t.addEventListener ? t.addEventListener(e, n, i) : t.attachEvent ? t.attachEvent("on" + e, n) : void 0
            },
            onload: function (t) {
                "complete" === e.readyState ? t() : a.addEventListener("load", t, !1)
            },
            domready: function (t) {
                "interactive" === e.readyState ? t() : e.addEventListener ? e.addEventListener("DOMContentLoaded", t, !1) : e.attachEvent && e.attachEvent("onreadystatechange", t)
            },
            onunload: function (t) {
                a.addEventListener("unload", t, !1), a.addEventListener("beforeunload", t, !1)
            },
            now: function () {
                return (new Date).getTime()
            },
            ajax: function (e) {
                if ("file:" !== t.location.protocol) {
                    var n, i = a.merge({
                        method: "GET",
                        async: !0
                    }, e);
                    if (t.XDomainRequest) try {
                        n = new t.XMLHttpRequest, n.open(i.method, i.url), n.send(a.stringify(i.data))
                    } catch (r) {} else {
                        if (!t.XMLHttpRequest) return;
                        if (n = new t.XMLHttpRequest, "withCredentials" in n) try {
                            n.open(i.method, i.url, i.async), n.setRequestHeader("Content-type", "application/json"), n.send(a.stringify(i.data))
                        } catch (r) {}
                    }
                }
            }
        },
        s = {
            queue: {},
            on: function (t, e) {
                "function" == typeof e && (this.queue[t] || (this.queue[t] = []), this.queue[t].push(e))
            },
            trigger: function (t) {
                var e, n = [];
                for (e = 1; e < arguments.length; e++) n.push(arguments[e]);
                if (this.queue[t])
                    for (e = 0; e < this.queue[t].length; e++) this.queue[t][e].apply(this, n)
            }
        },
        c = {
            get: function (t) {
                for (var n = e.cookie, i = t + "=", r = i.length, o = n.length, a = 0; o > a;) {
                    var s = a + r;
                    if (n.substring(a, s) === i) return this._getValue(s);
                    if (a = n.indexOf(" ", a) + 1, 0 === a) break
                }
                return ""
            },
            set: function (t, n, i, r, o, a) {
                o = o ? o : this._getDomain(), e.cookie = t + "=" + encodeURIComponent(n) + (i ? "; expires=" + i : "") + (r ? "; path=" + r : "; path=/") + (o ? "; domain=" + o : "") + (a ? "; secure" : "")
            },
            getExpire: function (t, e, n) {
                var i = new Date;
                return "number" == typeof t && "number" == typeof e && "number" == typeof e ? (i.setDate(i.getDate() + parseInt(t, 10)), i.setHours(i.getHours() + parseInt(e, 10)), i.setMinutes(i.getMinutes() + parseInt(n, 10)), i.toGMTString()) : void 0
            },
            _getValue: function (t) {
                var n = e.cookie,
                    i = n.indexOf(";", t);
                return -1 === i && (i = n.length), decodeURIComponent(n.substring(t, i))
            },
            _getDomain: function () {
                var t = e.domain;
                return "localhost" === t ? "" : ("undefined" != typeof M && M.DOMAIN_HOST && (t = "." + M.DOMAIN_HOST), "www." === t.substring(0, 4) && (t = t.substring(4)), t)
            }
        },
        u = "__mta";
    n.prototype = {
        setCookie: function () {
            var t = c.get(u),
                e = c.getExpire(720, 0, 0),
                n = a.now();
            if (t) t = t.split("."), t[2] = t[3], t[3] = n, t[4] = parseInt(t[4], 10) + 1, c.set(u, t.join("."), e), this.uuid = t[0];
            else {
                var i = this._hashInfo(),
                    r = n,
                    o = n,
                    s = n,
                    d = 1;
                t = [i, r, o, s, d].join("."), c.set(u, t, e), this.isFirstVisit = !0, this.uuid = i
            }
        },
        getInfo: function () {
            return {
                sr: this.screen,
                vp: this.viewport,
                csz: e.cookie ? e.cookie.length : 0,
                uuid: this.uuid
            }
        },
        _hashInfo: function () {
            var n = t.navigator,
                i = t.history.length;
            n = n.appName + n.version + this.language + n.platform + n.userAgent + this.javaEnabled + this.screen + (e.cookie ? e.cookie : "") + (e.referrer ? e.referrer : "");
            for (var r = n.length; i > 0;) n += i-- ^ r++;
            return a.hash(n)
        },
        _getViewport: function () {
            return null !== t.innerWidth ? {
                width: t.innerWidth,
                height: t.innerHeight
            } : "CSS1Compat" === e.compatMode ? {
                width: e.documentElement.clientWidth,
                height: e.documentElement.clientHeight
            } : {
                width: e.body.clientWidth,
                height: e.body.clientWidth
            }
        }
    }, i.MAX_URL_LENGTH = 2083, i.prototype = {
        config: function (t) {
            this.url = t
        },
        send: function (t) {
            t.version = r.VERSION;
            var e = a.buildQueryString(t);
            e.length && ((this.url + "?" + e).length <= i.MAX_URL_LENGTH ? this._sendByScript(e) : this.post(t))
        },
        post: function (t) {
            a.ajax({
                url: this.url,
                method: "POST",
                data: t
            })
        },
        _sendByScript: function (t) {
            var n = e.createElement("script");
            n.type = "text/javascript", n.async = !0, n.src = this.url + "?" + t;
            var i = e.getElementsByTagName("script")[0];
            i.parentNode.insertBefore(n, i)
        }
    };
    var d = 100;
    r.VERSION = "0.6.1", r.Plugins = {}, r.addPlugin = function (t, e) {
            if ("function" != typeof e.data) throw new Error("cannot add plugin: " + t);
            r.Plugins[t] = e
        }, r.prototype = {
            push: function () {
                for (var t = Array.prototype.slice, e = 0, n = 0, i = arguments.length; i > n; n++) try {
                    var r = arguments[n];
                    if ("function" == typeof r) arguments[n](this);
                    else {
                        r = t.call(r, 0);
                        var o = r[0];
                        this[o].apply(this, r.slice(1))
                    }
                } catch (a) {
                    e++
                }
                return e
            },
            create: function (t, e) {
                this._app = t, this._config = a.merge(this._config, e || {}), this._config.sampleRate = 5, this.send("resources")
            },
            config: function (t, e) {
                if (void 0 !== e) switch (t) {
                    case "sampleRate":
                        "number" == typeof e && (this._config.sampleRate = e);
                        break;
                    case "beaconImage":
                        this._beacon.config(this._config.beacon = e);
                        break;
                    case "useCombo":
                        "boolean" == typeof e && (this._config.useCombo = e);
                        break;
                    case "autotags":
                        "boolean" == typeof e && (this._config.autotags = e)
                }
            },
            tag: function (t, e) {
                "string" == typeof t && t.length && ("undefined" != typeof e ? this._tags[t] = e : "undefined" != typeof this._tags[t] && delete this._tags[t])
            },
            send: function (e, n, i, o) {
                if (e) {
                    if ("resources" === e) return void this.sendResources();
                    var a = r.Plugins[e];
                    a && (n = a.data(), o = a.type);
                    var s = {};
                    n && (s[e] = n, this._push(o || "timer", s, i));
                    var c = this;
                    this._timer && (t.clearTimeout(this._timer), this._timer = null), this._timer = t.setTimeout(function () {
                        c._send.call(c)
                    }, d)
                }
            },
            sendResources: function () {
                if (!(Math.random() > .1)) {
                    var t = r.Plugins.resources;
                    try {
                        var e = t.data();
                        if (!e) return;
                        for (var n = 0; n < e.length; n++) {
                            var i = e[n];
                            this.timing("browser.resource", i.data, i.tags)
                        }
                    } catch (o) {
                        console.error(o)
                    }
                }
            },
            timing: function (t, e, n) {
                this.send(t, e || 1, n, "timer")
            },
            count: function (t, e, n) {
                this.send(t, e || 1, n, "counter")
            },
            gauge: function (t, e, n) {
                this.send(t, e || 1, n, "gauge")
            },
            on: function (t, e) {
                s.on(t, e)
            },
            _push: function (t, e, n) {
                this._queue.push({
                    type: t,
                    data: e,
                    tags: n ? n : this._tags
                })
            },
            _send: function () {
                if (this._isSampleHit()) {
                    var e = a.merge,
                        n = this._config.useCombo,
                        i = this._client.getInfo(),
                        r = {
                            app: this._app,
                            type: "combo",
                            url: t.location.protocol + "//" + t.location.hostname + t.location.pathname,
                            autotags: this._config.autotags
                        };
                    if (r = e(r, i), this._queue.length) {
                        if (n) 1 === this._queue.length ? (r = e(r, this._queue[0]), s.trigger("data", r), this._beacon.send(r)) : (r.data = this._queue, s.trigger("data", r), this._beacon.send(r));
                        else
                            for (var o = 0, c = this._queue.length; c > o; o++) r = e(r, this._queue[o]), s.trigger("data", r), this._beacon.send(r);
                        this._queue = []
                    }
                }
            },
            _isSampleHit: function () {
                return this.visitorCode % 1e4 < 100 * this._config.sampleRate
            }
        }, r.addPlugin("page", {
            type: "timer",
            data: function () {
                function e(t, e) {
                    return t > 0 && e > 0 && t - e >= 0 ? t - e : void 0
                }
                var n = t,
                    i = n.performance || n.mozPerformance || n.msPerformance || n.webkitPerformance;
                if (i) {
                    var r = i.timing,
                        o = {
                            redirect: e(r.fetchStart, r.navigationStart),
                            dns: e(r.domainLookupEnd, r.domainLookupStart),
                            connect: e(r.connectEnd, r.connectStart),
                            network: e(r.connectEnd, r.navigationStart),
                            send: e(r.responseStart, r.requestStart),
                            receive: e(r.responseEnd, r.responseStart),
                            backend: e(r.responseEnd, r.requestStart),
                            render: e(r.loadEventEnd, r.loadEventStart),
                            dom: e(r.domComplete, r.domLoading),
                            frontend: e(r.loadEventEnd, r.domLoading),
                            load: e(r.loadEventEnd, r.navigationStart),
                            domReady: e(r.domContentLoadedEventStart, r.navigationStart),
                            interactive: e(r.domInteractive, r.navigationStart),
                            ttf: e(r.fetchStart, r.navigationStart),
                            ttr: e(r.requestStart, r.navigationStart),
                            ttdns: e(r.domainLookupStart, r.navigationStart),
                            ttconnect: e(r.connectStart, r.navigationStart),
                            ttfb: e(r.responseStart, r.navigationStart)
                        };
                    if ("object" == typeof M && M.subresources && M.subresources.names && "undefined" != typeof t.SubResoucesTiming) {
                        var a = M.subresources.lastImage || "",
                            s = M.subresources.firstImage || "",
                            c = new t.SubResoucesTiming(M.subresources.names, a, s);
                        c.length && "fsImg" === c[c.length - 1].id && (o.atf = c[c.length - 1].start, o.c_atf = c[c.length - 1].start - e(r.responseStart, r.navigationStart))
                    }
                    if (r.msFirstPaint && "number" == typeof r.msFirstPaint && (o.firstPaint = e(r.msFirstPaint, r.navigationStart)), n.chrome && n.chrome.loadTimes) {
                        var u = n.chrome.loadTimes();
                        o.firstPaint = Math.round(1e3 * e(u.firstPaintTime, u.startLoadTime))
                    }
                    return ("number" != typeof o.firstPaint || o.firstPaint < 0) && (o.firstPaint = void 0), "undefined" != typeof M && M.TimeTracker && M.TimeTracker.fst && (o.firstScreen = e(M.TimeTracker.fst, r.navigationStart)), o
                }
            }
        }),
        function () {
            function e(t, e, n, i) {
                0 >= n || 0 >= i || 0 >= n - i || (t[e] = parseInt(n - i))
            }
            r.addPlugin("resources", {
                type: "timer",
                data: function () {
                    var n = t,
                        i = n.performance || n.mozPerformance;
                    if (i && i.getEntriesByType) {
                        for (var r = t.performance.getEntriesByType("resource"), o = [], a = 0; a < r.length; a++) {
                            var s = r[a],
                                c = {
                                    load: parseInt(s.duration, 10)
                                };
                            e(c, "redirect", s.redirectEnd, s.redirectStart), e(c, "appcache", s.domainLookupStart, s.fetchStart), e(c, "dns", s.domainLookupEnd, s.domainLookupStart), e(c, "network", s.connectEnd, s.connectStart), e(c, "send", s.requestStart, s.connectEnd), e(c, "ttfb", s.responseStart, s.requestStart), e(c, "receive", s.responseEnd, s.responseStart);
                            var u = s.name + "?",
                                d = {
                                    tags: {
                                        path: u.slice(0, u.indexOf("?")),
                                        type: s.initiatorType
                                    }
                                };
                            d.data = c, o.push(d)
                        }
                        return o
                    }
                }
            })
        }(), a.onload(function () {
            if (t.MeituanAnalyticsObject) {
                var e = t.MeituanAnalyticsObject;
                "[object String]" === Object.prototype.toString.call(e) && (e = [e]);
                for (var n = 0; n < e.length; n++) ! function (e) {
                    var n = t[e];
                    if ("function" == typeof n && !(n.q && n.q.isInitialized && n.q.isInitialized())) {
                        var i = Object.prototype.toString,
                            o = new r,
                            a = n ? n.q : [];
                        n.q = o, a && "[object Array]" === i.call(a) && o.push.apply(o, a)
                    }
                }(e[n])
            }
        })
}(window, document);