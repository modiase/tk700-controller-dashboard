var _n = Object.defineProperty;
var gn = (t, e, n) =>
  e in t ? _n(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (t[e] = n);
var tt = (t, e, n) => gn(t, typeof e != 'symbol' ? e + '' : e, n);
(function () {
  const e = document.createElement('link').relList;
  if (e && e.supports && e.supports('modulepreload')) return;
  for (const i of document.querySelectorAll('link[rel="modulepreload"]')) r(i);
  new MutationObserver(i => {
    for (const o of i)
      if (o.type === 'childList')
        for (const s of o.addedNodes) s.tagName === 'LINK' && s.rel === 'modulepreload' && r(s);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(i) {
    const o = {};
    return (
      i.integrity && (o.integrity = i.integrity),
      i.referrerPolicy && (o.referrerPolicy = i.referrerPolicy),
      i.crossOrigin === 'use-credentials'
        ? (o.credentials = 'include')
        : i.crossOrigin === 'anonymous'
          ? (o.credentials = 'omit')
          : (o.credentials = 'same-origin'),
      o
    );
  }
  function r(i) {
    if (i.ep) return;
    i.ep = !0;
    const o = n(i);
    fetch(i.href, o);
  }
})();
function E() {}
function wn(t, e) {
  for (const n in e) t[n] = e[n];
  return t;
}
function xt(t) {
  return t();
}
function wt() {
  return Object.create(null);
}
function $e(t) {
  t.forEach(xt);
}
function Ut(t) {
  return typeof t == 'function';
}
function ie(t, e) {
  return t != t ? e == e : t !== e || (t && typeof t == 'object') || typeof t == 'function';
}
let qe;
function Sn(t, e) {
  return t === e ? !0 : (qe || (qe = document.createElement('a')), (qe.href = e), t === qe.href);
}
function On(t) {
  return Object.keys(t).length === 0;
}
function $n(t, e, n, r) {
  if (t) {
    const i = Dt(t, e, n, r);
    return t[0](i);
  }
}
function Dt(t, e, n, r) {
  return t[1] && r ? wn(n.ctx.slice(), t[1](r(e))) : n.ctx;
}
function In(t, e, n, r) {
  return (t[2], e.dirty);
}
function Tn(t, e, n, r, i, o) {
  if (i) {
    const s = Dt(e, n, r, o);
    t.p(s, i);
  }
}
function En(t) {
  if (t.ctx.length > 32) {
    const e = [],
      n = t.ctx.length / 32;
    for (let r = 0; r < n; r++) e[r] = -1;
    return e;
  }
  return -1;
}
function p(t, e) {
  t.appendChild(e);
}
function x(t, e, n) {
  t.insertBefore(e, n || null);
}
function M(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function kn(t, e) {
  for (let n = 0; n < t.length; n += 1) t[n] && t[n].d(e);
}
function m(t) {
  return document.createElement(t);
}
function ke(t) {
  return document.createElementNS('http://www.w3.org/2000/svg', t);
}
function re(t) {
  return document.createTextNode(t);
}
function N() {
  return re(' ');
}
function Xe() {
  return re('');
}
function G(t, e, n, r) {
  return (t.addEventListener(e, n, r), () => t.removeEventListener(e, n, r));
}
function d(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function ge(t) {
  return t === '' ? null : +t;
}
function Nn(t) {
  return Array.from(t.childNodes);
}
function Qe(t, e) {
  ((e = '' + e), t.data !== e && (t.data = e));
}
function me(t, e) {
  t.value = e ?? '';
}
function An(t, e, n, r) {
  t.style.setProperty(e, n, '');
}
function B(t, e, n) {
  t.classList.toggle(e, !!n);
}
let Ae;
function Ne(t) {
  Ae = t;
}
function Gt() {
  if (!Ae) throw new Error('Function called outside component initialization');
  return Ae;
}
function Me(t) {
  Gt().$$.on_mount.push(t);
}
function Re(t) {
  Gt().$$.on_destroy.push(t);
}
const ye = [],
  St = [];
let we = [];
const Ot = [],
  Pn = Promise.resolve();
let ot = !1;
function Cn() {
  ot || ((ot = !0), Pn.then(Bt));
}
function st(t) {
  we.push(t);
}
const nt = new Set();
let be = 0;
function Bt() {
  if (be !== 0) return;
  const t = Ae;
  do {
    try {
      for (; be < ye.length; ) {
        const e = ye[be];
        (be++, Ne(e), jn(e.$$));
      }
    } catch (e) {
      throw ((ye.length = 0), (be = 0), e);
    }
    for (Ne(null), ye.length = 0, be = 0; St.length; ) St.pop()();
    for (let e = 0; e < we.length; e += 1) {
      const n = we[e];
      nt.has(n) || (nt.add(n), n());
    }
    we.length = 0;
  } while (ye.length);
  for (; Ot.length; ) Ot.pop()();
  ((ot = !1), nt.clear(), Ne(t));
}
function jn(t) {
  if (t.fragment !== null) {
    (t.update(), $e(t.before_update));
    const e = t.dirty;
    ((t.dirty = [-1]), t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(st));
  }
}
function Mn(t) {
  const e = [],
    n = [];
  (we.forEach(r => (t.indexOf(r) === -1 ? e.push(r) : n.push(r))), n.forEach(r => r()), (we = e));
}
const Ye = new Set();
let ae;
function We() {
  ae = { r: 0, c: [], p: ae };
}
function Fe() {
  (ae.r || $e(ae.c), (ae = ae.p));
}
function $(t, e) {
  t && t.i && (Ye.delete(t), t.i(e));
}
function I(t, e, n, r) {
  if (t && t.o) {
    if (Ye.has(t)) return;
    (Ye.add(t),
      ae.c.push(() => {
        (Ye.delete(t), r && (n && t.d(1), r()));
      }),
      t.o(e));
  } else r && r();
}
function $t(t) {
  return (t == null ? void 0 : t.length) !== void 0 ? t : Array.from(t);
}
function U(t) {
  t && t.c();
}
function F(t, e, n) {
  const { fragment: r, after_update: i } = t.$$;
  (r && r.m(e, n),
    st(() => {
      const o = t.$$.on_mount.map(xt).filter(Ut);
      (t.$$.on_destroy ? t.$$.on_destroy.push(...o) : $e(o), (t.$$.on_mount = []));
    }),
    i.forEach(st));
}
function L(t, e) {
  const n = t.$$;
  n.fragment !== null &&
    (Mn(n.after_update),
    $e(n.on_destroy),
    n.fragment && n.fragment.d(e),
    (n.on_destroy = n.fragment = null),
    (n.ctx = []));
}
function Rn(t, e) {
  (t.$$.dirty[0] === -1 && (ye.push(t), Cn(), t.$$.dirty.fill(0)),
    (t.$$.dirty[(e / 31) | 0] |= 1 << (e % 31)));
}
function oe(t, e, n, r, i, o, s = null, u = [-1]) {
  const l = Ae;
  Ne(t);
  const a = (t.$$ = {
    fragment: null,
    ctx: [],
    props: o,
    update: E,
    not_equal: i,
    bound: wt(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (l ? l.$$.context : [])),
    callbacks: wt(),
    dirty: u,
    skip_bound: !1,
    root: e.target || l.$$.root,
  });
  s && s(a.root);
  let c = !1;
  if (
    ((a.ctx = n
      ? n(t, e.props || {}, (f, h, ...v) => {
          const y = v.length ? v[0] : h;
          return (
            a.ctx &&
              i(a.ctx[f], (a.ctx[f] = y)) &&
              (!a.skip_bound && a.bound[f] && a.bound[f](y), c && Rn(t, f)),
            h
          );
        })
      : []),
    a.update(),
    (c = !0),
    $e(a.before_update),
    (a.fragment = r ? r(a.ctx) : !1),
    e.target)
  ) {
    if (e.hydrate) {
      const f = Nn(e.target);
      (a.fragment && a.fragment.l(f), f.forEach(M));
    } else a.fragment && a.fragment.c();
    (e.intro && $(t.$$.fragment), F(t, e.target, e.anchor), Bt());
  }
  Ne(l);
}
class se {
  constructor() {
    tt(this, '$$');
    tt(this, '$$set');
  }
  $destroy() {
    (L(this, 1), (this.$destroy = E));
  }
  $on(e, n) {
    if (!Ut(n)) return E;
    const r = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return (
      r.push(n),
      () => {
        const i = r.indexOf(n);
        i !== -1 && r.splice(i, 1);
      }
    );
  }
  $set(e) {
    this.$$set && !On(e) && ((this.$$.skip_bound = !0), this.$$set(e), (this.$$.skip_bound = !1));
  }
}
const Wn = '4';
typeof window < 'u' && (window.__svelte || (window.__svelte = { v: new Set() })).v.add(Wn);
var lt = function (t, e) {
  return (
    (lt =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (n, r) {
          n.__proto__ = r;
        }) ||
      function (n, r) {
        for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (n[i] = r[i]);
      }),
    lt(t, e)
  );
};
function X(t, e) {
  if (typeof e != 'function' && e !== null)
    throw new TypeError('Class extends value ' + String(e) + ' is not a constructor or null');
  lt(t, e);
  function n() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : ((n.prototype = e.prototype), new n());
}
function Fn(t, e, n, r) {
  function i(o) {
    return o instanceof n
      ? o
      : new n(function (s) {
          s(o);
        });
  }
  return new (n || (n = Promise))(function (o, s) {
    function u(c) {
      try {
        a(r.next(c));
      } catch (f) {
        s(f);
      }
    }
    function l(c) {
      try {
        a(r.throw(c));
      } catch (f) {
        s(f);
      }
    }
    function a(c) {
      c.done ? o(c.value) : i(c.value).then(u, l);
    }
    a((r = r.apply(t, e || [])).next());
  });
}
function Kt(t, e) {
  var n = {
      label: 0,
      sent: function () {
        if (o[0] & 1) throw o[1];
        return o[1];
      },
      trys: [],
      ops: [],
    },
    r,
    i,
    o,
    s = Object.create((typeof Iterator == 'function' ? Iterator : Object).prototype);
  return (
    (s.next = u(0)),
    (s.throw = u(1)),
    (s.return = u(2)),
    typeof Symbol == 'function' &&
      (s[Symbol.iterator] = function () {
        return this;
      }),
    s
  );
  function u(a) {
    return function (c) {
      return l([a, c]);
    };
  }
  function l(a) {
    if (r) throw new TypeError('Generator is already executing.');
    for (; s && ((s = 0), a[0] && (n = 0)), n; )
      try {
        if (
          ((r = 1),
          i &&
            (o =
              a[0] & 2 ? i.return : a[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) &&
            !(o = o.call(i, a[1])).done)
        )
          return o;
        switch (((i = 0), o && (a = [a[0] & 2, o.value]), a[0])) {
          case 0:
          case 1:
            o = a;
            break;
          case 4:
            return (n.label++, { value: a[1], done: !1 });
          case 5:
            (n.label++, (i = a[1]), (a = [0]));
            continue;
          case 7:
            ((a = n.ops.pop()), n.trys.pop());
            continue;
          default:
            if (
              ((o = n.trys), !(o = o.length > 0 && o[o.length - 1]) && (a[0] === 6 || a[0] === 2))
            ) {
              n = 0;
              continue;
            }
            if (a[0] === 3 && (!o || (a[1] > o[0] && a[1] < o[3]))) {
              n.label = a[1];
              break;
            }
            if (a[0] === 6 && n.label < o[1]) {
              ((n.label = o[1]), (o = a));
              break;
            }
            if (o && n.label < o[2]) {
              ((n.label = o[2]), n.ops.push(a));
              break;
            }
            (o[2] && n.ops.pop(), n.trys.pop());
            continue;
        }
        a = e.call(t, n);
      } catch (c) {
        ((a = [6, c]), (i = 0));
      } finally {
        r = o = 0;
      }
    if (a[0] & 5) throw a[1];
    return { value: a[0] ? a[1] : void 0, done: !0 };
  }
}
function Oe(t) {
  var e = typeof Symbol == 'function' && Symbol.iterator,
    n = e && t[e],
    r = 0;
  if (n) return n.call(t);
  if (t && typeof t.length == 'number')
    return {
      next: function () {
        return (t && r >= t.length && (t = void 0), { value: t && t[r++], done: !t });
      },
    };
  throw new TypeError(e ? 'Object is not iterable.' : 'Symbol.iterator is not defined.');
}
function Pe(t, e) {
  var n = typeof Symbol == 'function' && t[Symbol.iterator];
  if (!n) return t;
  var r = n.call(t),
    i,
    o = [],
    s;
  try {
    for (; (e === void 0 || e-- > 0) && !(i = r.next()).done; ) o.push(i.value);
  } catch (u) {
    s = { error: u };
  } finally {
    try {
      i && !i.done && (n = r.return) && n.call(r);
    } finally {
      if (s) throw s.error;
    }
  }
  return o;
}
function Ce(t, e, n) {
  if (n || arguments.length === 2)
    for (var r = 0, i = e.length, o; r < i; r++)
      (o || !(r in e)) && (o || (o = Array.prototype.slice.call(e, 0, r)), (o[r] = e[r]));
  return t.concat(o || Array.prototype.slice.call(e));
}
function Se(t) {
  return this instanceof Se ? ((this.v = t), this) : new Se(t);
}
function Ln(t, e, n) {
  if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
  var r = n.apply(t, e || []),
    i,
    o = [];
  return (
    (i = Object.create((typeof AsyncIterator == 'function' ? AsyncIterator : Object).prototype)),
    u('next'),
    u('throw'),
    u('return', s),
    (i[Symbol.asyncIterator] = function () {
      return this;
    }),
    i
  );
  function s(v) {
    return function (y) {
      return Promise.resolve(y).then(v, f);
    };
  }
  function u(v, y) {
    r[v] &&
      ((i[v] = function (b) {
        return new Promise(function (g, S) {
          o.push([v, b, g, S]) > 1 || l(v, b);
        });
      }),
      y && (i[v] = y(i[v])));
  }
  function l(v, y) {
    try {
      a(r[v](y));
    } catch (b) {
      h(o[0][3], b);
    }
  }
  function a(v) {
    v.value instanceof Se ? Promise.resolve(v.value.v).then(c, f) : h(o[0][2], v);
  }
  function c(v) {
    l('next', v);
  }
  function f(v) {
    l('throw', v);
  }
  function h(v, y) {
    (v(y), o.shift(), o.length && l(o[0][0], o[0][1]));
  }
}
function xn(t) {
  if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
  var e = t[Symbol.asyncIterator],
    n;
  return e
    ? e.call(t)
    : ((t = typeof Oe == 'function' ? Oe(t) : t[Symbol.iterator]()),
      (n = {}),
      r('next'),
      r('throw'),
      r('return'),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n);
  function r(o) {
    n[o] =
      t[o] &&
      function (s) {
        return new Promise(function (u, l) {
          ((s = t[o](s)), i(u, l, s.done, s.value));
        });
      };
  }
  function i(o, s, u, l) {
    Promise.resolve(l).then(function (a) {
      o({ value: a, done: u });
    }, s);
  }
}
function C(t) {
  return typeof t == 'function';
}
function Ht(t) {
  var e = function (r) {
      (Error.call(r), (r.stack = new Error().stack));
    },
    n = t(e);
  return ((n.prototype = Object.create(Error.prototype)), (n.prototype.constructor = n), n);
}
var rt = Ht(function (t) {
  return function (n) {
    (t(this),
      (this.message = n
        ? n.length +
          ` errors occurred during unsubscription:
` +
          n.map(function (r, i) {
            return i + 1 + ') ' + r.toString();
          }).join(`
  `)
        : ''),
      (this.name = 'UnsubscriptionError'),
      (this.errors = n));
  };
});
function Je(t, e) {
  if (t) {
    var n = t.indexOf(e);
    0 <= n && t.splice(n, 1);
  }
}
var Le = (function () {
    function t(e) {
      ((this.initialTeardown = e),
        (this.closed = !1),
        (this._parentage = null),
        (this._finalizers = null));
    }
    return (
      (t.prototype.unsubscribe = function () {
        var e, n, r, i, o;
        if (!this.closed) {
          this.closed = !0;
          var s = this._parentage;
          if (s)
            if (((this._parentage = null), Array.isArray(s)))
              try {
                for (var u = Oe(s), l = u.next(); !l.done; l = u.next()) {
                  var a = l.value;
                  a.remove(this);
                }
              } catch (b) {
                e = { error: b };
              } finally {
                try {
                  l && !l.done && (n = u.return) && n.call(u);
                } finally {
                  if (e) throw e.error;
                }
              }
            else s.remove(this);
          var c = this.initialTeardown;
          if (C(c))
            try {
              c();
            } catch (b) {
              o = b instanceof rt ? b.errors : [b];
            }
          var f = this._finalizers;
          if (f) {
            this._finalizers = null;
            try {
              for (var h = Oe(f), v = h.next(); !v.done; v = h.next()) {
                var y = v.value;
                try {
                  It(y);
                } catch (b) {
                  ((o = o ?? []),
                    b instanceof rt ? (o = Ce(Ce([], Pe(o)), Pe(b.errors))) : o.push(b));
                }
              }
            } catch (b) {
              r = { error: b };
            } finally {
              try {
                v && !v.done && (i = h.return) && i.call(h);
              } finally {
                if (r) throw r.error;
              }
            }
          }
          if (o) throw new rt(o);
        }
      }),
      (t.prototype.add = function (e) {
        var n;
        if (e && e !== this)
          if (this.closed) It(e);
          else {
            if (e instanceof t) {
              if (e.closed || e._hasParent(this)) return;
              e._addParent(this);
            }
            (this._finalizers = (n = this._finalizers) !== null && n !== void 0 ? n : []).push(e);
          }
      }),
      (t.prototype._hasParent = function (e) {
        var n = this._parentage;
        return n === e || (Array.isArray(n) && n.includes(e));
      }),
      (t.prototype._addParent = function (e) {
        var n = this._parentage;
        this._parentage = Array.isArray(n) ? (n.push(e), n) : n ? [n, e] : e;
      }),
      (t.prototype._removeParent = function (e) {
        var n = this._parentage;
        n === e ? (this._parentage = null) : Array.isArray(n) && Je(n, e);
      }),
      (t.prototype.remove = function (e) {
        var n = this._finalizers;
        (n && Je(n, e), e instanceof t && e._removeParent(this));
      }),
      (t.EMPTY = (function () {
        var e = new t();
        return ((e.closed = !0), e);
      })()),
      t
    );
  })(),
  Vt = Le.EMPTY;
function qt(t) {
  return t instanceof Le || (t && 'closed' in t && C(t.remove) && C(t.add) && C(t.unsubscribe));
}
function It(t) {
  C(t) ? t() : t.unsubscribe();
}
var Un = { Promise: void 0 },
  Dn = {
    setTimeout: function (t, e) {
      for (var n = [], r = 2; r < arguments.length; r++) n[r - 2] = arguments[r];
      return setTimeout.apply(void 0, Ce([t, e], Pe(n)));
    },
    clearTimeout: function (t) {
      return clearTimeout(t);
    },
    delegate: void 0,
  };
function zt(t) {
  Dn.setTimeout(function () {
    throw t;
  });
}
function Tt() {}
function Ze(t) {
  t();
}
var bt = (function (t) {
    X(e, t);
    function e(n) {
      var r = t.call(this) || this;
      return (
        (r.isStopped = !1),
        n ? ((r.destination = n), qt(n) && n.add(r)) : (r.destination = Kn),
        r
      );
    }
    return (
      (e.create = function (n, r, i) {
        return new je(n, r, i);
      }),
      (e.prototype.next = function (n) {
        this.isStopped || this._next(n);
      }),
      (e.prototype.error = function (n) {
        this.isStopped || ((this.isStopped = !0), this._error(n));
      }),
      (e.prototype.complete = function () {
        this.isStopped || ((this.isStopped = !0), this._complete());
      }),
      (e.prototype.unsubscribe = function () {
        this.closed ||
          ((this.isStopped = !0), t.prototype.unsubscribe.call(this), (this.destination = null));
      }),
      (e.prototype._next = function (n) {
        this.destination.next(n);
      }),
      (e.prototype._error = function (n) {
        try {
          this.destination.error(n);
        } finally {
          this.unsubscribe();
        }
      }),
      (e.prototype._complete = function () {
        try {
          this.destination.complete();
        } finally {
          this.unsubscribe();
        }
      }),
      e
    );
  })(Le),
  Gn = (function () {
    function t(e) {
      this.partialObserver = e;
    }
    return (
      (t.prototype.next = function (e) {
        var n = this.partialObserver;
        if (n.next)
          try {
            n.next(e);
          } catch (r) {
            ze(r);
          }
      }),
      (t.prototype.error = function (e) {
        var n = this.partialObserver;
        if (n.error)
          try {
            n.error(e);
          } catch (r) {
            ze(r);
          }
        else ze(e);
      }),
      (t.prototype.complete = function () {
        var e = this.partialObserver;
        if (e.complete)
          try {
            e.complete();
          } catch (n) {
            ze(n);
          }
      }),
      t
    );
  })(),
  je = (function (t) {
    X(e, t);
    function e(n, r, i) {
      var o = t.call(this) || this,
        s;
      return (
        C(n) || !n
          ? (s = { next: n ?? void 0, error: r ?? void 0, complete: i ?? void 0 })
          : (s = n),
        (o.destination = new Gn(s)),
        o
      );
    }
    return e;
  })(bt);
function ze(t) {
  zt(t);
}
function Bn(t) {
  throw t;
}
var Kn = { closed: !0, next: Tt, error: Bn, complete: Tt },
  yt = (function () {
    return (typeof Symbol == 'function' && Symbol.observable) || '@@observable';
  })();
function _t(t) {
  return t;
}
function Hn(t) {
  return t.length === 0
    ? _t
    : t.length === 1
      ? t[0]
      : function (n) {
          return t.reduce(function (r, i) {
            return i(r);
          }, n);
        };
}
var V = (function () {
  function t(e) {
    e && (this._subscribe = e);
  }
  return (
    (t.prototype.lift = function (e) {
      var n = new t();
      return ((n.source = this), (n.operator = e), n);
    }),
    (t.prototype.subscribe = function (e, n, r) {
      var i = this,
        o = qn(e) ? e : new je(e, n, r);
      return (
        Ze(function () {
          var s = i,
            u = s.operator,
            l = s.source;
          o.add(u ? u.call(o, l) : l ? i._subscribe(o) : i._trySubscribe(o));
        }),
        o
      );
    }),
    (t.prototype._trySubscribe = function (e) {
      try {
        return this._subscribe(e);
      } catch (n) {
        e.error(n);
      }
    }),
    (t.prototype.forEach = function (e, n) {
      var r = this;
      return (
        (n = Et(n)),
        new n(function (i, o) {
          var s = new je({
            next: function (u) {
              try {
                e(u);
              } catch (l) {
                (o(l), s.unsubscribe());
              }
            },
            error: o,
            complete: i,
          });
          r.subscribe(s);
        })
      );
    }),
    (t.prototype._subscribe = function (e) {
      var n;
      return (n = this.source) === null || n === void 0 ? void 0 : n.subscribe(e);
    }),
    (t.prototype[yt] = function () {
      return this;
    }),
    (t.prototype.pipe = function () {
      for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
      return Hn(e)(this);
    }),
    (t.prototype.toPromise = function (e) {
      var n = this;
      return (
        (e = Et(e)),
        new e(function (r, i) {
          var o;
          n.subscribe(
            function (s) {
              return (o = s);
            },
            function (s) {
              return i(s);
            },
            function () {
              return r(o);
            }
          );
        })
      );
    }),
    (t.create = function (e) {
      return new t(e);
    }),
    t
  );
})();
function Et(t) {
  var e;
  return (e = t ?? Un.Promise) !== null && e !== void 0 ? e : Promise;
}
function Vn(t) {
  return t && C(t.next) && C(t.error) && C(t.complete);
}
function qn(t) {
  return (t && t instanceof bt) || (Vn(t) && qt(t));
}
function zn(t) {
  return C(t == null ? void 0 : t.lift);
}
function le(t) {
  return function (e) {
    if (zn(e))
      return e.lift(function (n) {
        try {
          return t(n, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError('Unable to lift unknown Observable type');
  };
}
function fe(t, e, n, r, i) {
  return new Yn(t, e, n, r, i);
}
var Yn = (function (t) {
    X(e, t);
    function e(n, r, i, o, s, u) {
      var l = t.call(this, n) || this;
      return (
        (l.onFinalize = s),
        (l.shouldUnsubscribe = u),
        (l._next = r
          ? function (a) {
              try {
                r(a);
              } catch (c) {
                n.error(c);
              }
            }
          : t.prototype._next),
        (l._error = o
          ? function (a) {
              try {
                o(a);
              } catch (c) {
                n.error(c);
              } finally {
                this.unsubscribe();
              }
            }
          : t.prototype._error),
        (l._complete = i
          ? function () {
              try {
                i();
              } catch (a) {
                n.error(a);
              } finally {
                this.unsubscribe();
              }
            }
          : t.prototype._complete),
        l
      );
    }
    return (
      (e.prototype.unsubscribe = function () {
        var n;
        if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
          var r = this.closed;
          (t.prototype.unsubscribe.call(this),
            !r && ((n = this.onFinalize) === null || n === void 0 || n.call(this)));
        }
      }),
      e
    );
  })(bt),
  Zn = Ht(function (t) {
    return function () {
      (t(this), (this.name = 'ObjectUnsubscribedError'), (this.message = 'object unsubscribed'));
    };
  }),
  et = (function (t) {
    X(e, t);
    function e() {
      var n = t.call(this) || this;
      return (
        (n.closed = !1),
        (n.currentObservers = null),
        (n.observers = []),
        (n.isStopped = !1),
        (n.hasError = !1),
        (n.thrownError = null),
        n
      );
    }
    return (
      (e.prototype.lift = function (n) {
        var r = new kt(this, this);
        return ((r.operator = n), r);
      }),
      (e.prototype._throwIfClosed = function () {
        if (this.closed) throw new Zn();
      }),
      (e.prototype.next = function (n) {
        var r = this;
        Ze(function () {
          var i, o;
          if ((r._throwIfClosed(), !r.isStopped)) {
            r.currentObservers || (r.currentObservers = Array.from(r.observers));
            try {
              for (var s = Oe(r.currentObservers), u = s.next(); !u.done; u = s.next()) {
                var l = u.value;
                l.next(n);
              }
            } catch (a) {
              i = { error: a };
            } finally {
              try {
                u && !u.done && (o = s.return) && o.call(s);
              } finally {
                if (i) throw i.error;
              }
            }
          }
        });
      }),
      (e.prototype.error = function (n) {
        var r = this;
        Ze(function () {
          if ((r._throwIfClosed(), !r.isStopped)) {
            ((r.hasError = r.isStopped = !0), (r.thrownError = n));
            for (var i = r.observers; i.length; ) i.shift().error(n);
          }
        });
      }),
      (e.prototype.complete = function () {
        var n = this;
        Ze(function () {
          if ((n._throwIfClosed(), !n.isStopped)) {
            n.isStopped = !0;
            for (var r = n.observers; r.length; ) r.shift().complete();
          }
        });
      }),
      (e.prototype.unsubscribe = function () {
        ((this.isStopped = this.closed = !0), (this.observers = this.currentObservers = null));
      }),
      Object.defineProperty(e.prototype, 'observed', {
        get: function () {
          var n;
          return ((n = this.observers) === null || n === void 0 ? void 0 : n.length) > 0;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (e.prototype._trySubscribe = function (n) {
        return (this._throwIfClosed(), t.prototype._trySubscribe.call(this, n));
      }),
      (e.prototype._subscribe = function (n) {
        return (this._throwIfClosed(), this._checkFinalizedStatuses(n), this._innerSubscribe(n));
      }),
      (e.prototype._innerSubscribe = function (n) {
        var r = this,
          i = this,
          o = i.hasError,
          s = i.isStopped,
          u = i.observers;
        return o || s
          ? Vt
          : ((this.currentObservers = null),
            u.push(n),
            new Le(function () {
              ((r.currentObservers = null), Je(u, n));
            }));
      }),
      (e.prototype._checkFinalizedStatuses = function (n) {
        var r = this,
          i = r.hasError,
          o = r.thrownError,
          s = r.isStopped;
        i ? n.error(o) : s && n.complete();
      }),
      (e.prototype.asObservable = function () {
        var n = new V();
        return ((n.source = this), n);
      }),
      (e.create = function (n, r) {
        return new kt(n, r);
      }),
      e
    );
  })(V),
  kt = (function (t) {
    X(e, t);
    function e(n, r) {
      var i = t.call(this) || this;
      return ((i.destination = n), (i.source = r), i);
    }
    return (
      (e.prototype.next = function (n) {
        var r, i;
        (i = (r = this.destination) === null || r === void 0 ? void 0 : r.next) === null ||
          i === void 0 ||
          i.call(r, n);
      }),
      (e.prototype.error = function (n) {
        var r, i;
        (i = (r = this.destination) === null || r === void 0 ? void 0 : r.error) === null ||
          i === void 0 ||
          i.call(r, n);
      }),
      (e.prototype.complete = function () {
        var n, r;
        (r = (n = this.destination) === null || n === void 0 ? void 0 : n.complete) === null ||
          r === void 0 ||
          r.call(n);
      }),
      (e.prototype._subscribe = function (n) {
        var r, i;
        return (i = (r = this.source) === null || r === void 0 ? void 0 : r.subscribe(n)) !==
          null && i !== void 0
          ? i
          : Vt;
      }),
      e
    );
  })(et),
  Jn = (function (t) {
    X(e, t);
    function e(n) {
      var r = t.call(this) || this;
      return ((r._value = n), r);
    }
    return (
      Object.defineProperty(e.prototype, 'value', {
        get: function () {
          return this.getValue();
        },
        enumerable: !1,
        configurable: !0,
      }),
      (e.prototype._subscribe = function (n) {
        var r = t.prototype._subscribe.call(this, n);
        return (!r.closed && n.next(this._value), r);
      }),
      (e.prototype.getValue = function () {
        var n = this,
          r = n.hasError,
          i = n.thrownError,
          o = n._value;
        if (r) throw i;
        return (this._throwIfClosed(), o);
      }),
      (e.prototype.next = function (n) {
        t.prototype.next.call(this, (this._value = n));
      }),
      e
    );
  })(et),
  gt = {
    now: function () {
      return (gt.delegate || Date).now();
    },
    delegate: void 0,
  },
  Xn = (function (t) {
    X(e, t);
    function e(n, r, i) {
      (n === void 0 && (n = 1 / 0), r === void 0 && (r = 1 / 0), i === void 0 && (i = gt));
      var o = t.call(this) || this;
      return (
        (o._bufferSize = n),
        (o._windowTime = r),
        (o._timestampProvider = i),
        (o._buffer = []),
        (o._infiniteTimeWindow = !0),
        (o._infiniteTimeWindow = r === 1 / 0),
        (o._bufferSize = Math.max(1, n)),
        (o._windowTime = Math.max(1, r)),
        o
      );
    }
    return (
      (e.prototype.next = function (n) {
        var r = this,
          i = r.isStopped,
          o = r._buffer,
          s = r._infiniteTimeWindow,
          u = r._timestampProvider,
          l = r._windowTime;
        (i || (o.push(n), !s && o.push(u.now() + l)),
          this._trimBuffer(),
          t.prototype.next.call(this, n));
      }),
      (e.prototype._subscribe = function (n) {
        (this._throwIfClosed(), this._trimBuffer());
        for (
          var r = this._innerSubscribe(n),
            i = this,
            o = i._infiniteTimeWindow,
            s = i._buffer,
            u = s.slice(),
            l = 0;
          l < u.length && !n.closed;
          l += o ? 1 : 2
        )
          n.next(u[l]);
        return (this._checkFinalizedStatuses(n), r);
      }),
      (e.prototype._trimBuffer = function () {
        var n = this,
          r = n._bufferSize,
          i = n._timestampProvider,
          o = n._buffer,
          s = n._infiniteTimeWindow,
          u = (s ? 1 : 2) * r;
        if ((r < 1 / 0 && u < o.length && o.splice(0, o.length - u), !s)) {
          for (var l = i.now(), a = 0, c = 1; c < o.length && o[c] <= l; c += 2) a = c;
          a && o.splice(0, a + 1);
        }
      }),
      e
    );
  })(et),
  Qn = (function (t) {
    X(e, t);
    function e(n, r) {
      return t.call(this) || this;
    }
    return (
      (e.prototype.schedule = function (n, r) {
        return this;
      }),
      e
    );
  })(Le),
  Nt = {
    setInterval: function (t, e) {
      for (var n = [], r = 2; r < arguments.length; r++) n[r - 2] = arguments[r];
      return setInterval.apply(void 0, Ce([t, e], Pe(n)));
    },
    clearInterval: function (t) {
      return clearInterval(t);
    },
    delegate: void 0,
  },
  er = (function (t) {
    X(e, t);
    function e(n, r) {
      var i = t.call(this, n, r) || this;
      return ((i.scheduler = n), (i.work = r), (i.pending = !1), i);
    }
    return (
      (e.prototype.schedule = function (n, r) {
        var i;
        if ((r === void 0 && (r = 0), this.closed)) return this;
        this.state = n;
        var o = this.id,
          s = this.scheduler;
        return (
          o != null && (this.id = this.recycleAsyncId(s, o, r)),
          (this.pending = !0),
          (this.delay = r),
          (this.id =
            (i = this.id) !== null && i !== void 0 ? i : this.requestAsyncId(s, this.id, r)),
          this
        );
      }),
      (e.prototype.requestAsyncId = function (n, r, i) {
        return (i === void 0 && (i = 0), Nt.setInterval(n.flush.bind(n, this), i));
      }),
      (e.prototype.recycleAsyncId = function (n, r, i) {
        if ((i === void 0 && (i = 0), i != null && this.delay === i && this.pending === !1))
          return r;
        r != null && Nt.clearInterval(r);
      }),
      (e.prototype.execute = function (n, r) {
        if (this.closed) return new Error('executing a cancelled action');
        this.pending = !1;
        var i = this._execute(n, r);
        if (i) return i;
        this.pending === !1 &&
          this.id != null &&
          (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
      }),
      (e.prototype._execute = function (n, r) {
        var i = !1,
          o;
        try {
          this.work(n);
        } catch (s) {
          ((i = !0), (o = s || new Error('Scheduled action threw falsy error')));
        }
        if (i) return (this.unsubscribe(), o);
      }),
      (e.prototype.unsubscribe = function () {
        if (!this.closed) {
          var n = this,
            r = n.id,
            i = n.scheduler,
            o = i.actions;
          ((this.work = this.state = this.scheduler = null),
            (this.pending = !1),
            Je(o, this),
            r != null && (this.id = this.recycleAsyncId(i, r, null)),
            (this.delay = null),
            t.prototype.unsubscribe.call(this));
        }
      }),
      e
    );
  })(Qn),
  At = (function () {
    function t(e, n) {
      (n === void 0 && (n = t.now), (this.schedulerActionCtor = e), (this.now = n));
    }
    return (
      (t.prototype.schedule = function (e, n, r) {
        return (n === void 0 && (n = 0), new this.schedulerActionCtor(this, e).schedule(r, n));
      }),
      (t.now = gt.now),
      t
    );
  })(),
  tr = (function (t) {
    X(e, t);
    function e(n, r) {
      r === void 0 && (r = At.now);
      var i = t.call(this, n, r) || this;
      return ((i.actions = []), (i._active = !1), i);
    }
    return (
      (e.prototype.flush = function (n) {
        var r = this.actions;
        if (this._active) {
          r.push(n);
          return;
        }
        var i;
        this._active = !0;
        do if ((i = n.execute(n.state, n.delay))) break;
        while ((n = r.shift()));
        if (((this._active = !1), i)) {
          for (; (n = r.shift()); ) n.unsubscribe();
          throw i;
        }
      }),
      e
    );
  })(At),
  Yt = new tr(er),
  nr = Yt,
  xe = new V(function (t) {
    return t.complete();
  });
function Zt(t) {
  return t && C(t.schedule);
}
function rr(t) {
  return t[t.length - 1];
}
function Jt(t) {
  return Zt(rr(t)) ? t.pop() : void 0;
}
var Xt = function (t) {
  return t && typeof t.length == 'number' && typeof t != 'function';
};
function Qt(t) {
  return C(t == null ? void 0 : t.then);
}
function en(t) {
  return C(t[yt]);
}
function tn(t) {
  return Symbol.asyncIterator && C(t == null ? void 0 : t[Symbol.asyncIterator]);
}
function nn(t) {
  return new TypeError(
    'You provided ' +
      (t !== null && typeof t == 'object' ? 'an invalid object' : "'" + t + "'") +
      ' where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.'
  );
}
function ir() {
  return typeof Symbol != 'function' || !Symbol.iterator ? '@@iterator' : Symbol.iterator;
}
var rn = ir();
function on(t) {
  return C(t == null ? void 0 : t[rn]);
}
function sn(t) {
  return Ln(this, arguments, function () {
    var n, r, i, o;
    return Kt(this, function (s) {
      switch (s.label) {
        case 0:
          ((n = t.getReader()), (s.label = 1));
        case 1:
          (s.trys.push([1, , 9, 10]), (s.label = 2));
        case 2:
          return [4, Se(n.read())];
        case 3:
          return ((r = s.sent()), (i = r.value), (o = r.done), o ? [4, Se(void 0)] : [3, 5]);
        case 4:
          return [2, s.sent()];
        case 5:
          return [4, Se(i)];
        case 6:
          return [4, s.sent()];
        case 7:
          return (s.sent(), [3, 2]);
        case 8:
          return [3, 10];
        case 9:
          return (n.releaseLock(), [7]);
        case 10:
          return [2];
      }
    });
  });
}
function ln(t) {
  return C(t == null ? void 0 : t.getReader);
}
function ue(t) {
  if (t instanceof V) return t;
  if (t != null) {
    if (en(t)) return or(t);
    if (Xt(t)) return sr(t);
    if (Qt(t)) return lr(t);
    if (tn(t)) return un(t);
    if (on(t)) return ur(t);
    if (ln(t)) return ar(t);
  }
  throw nn(t);
}
function or(t) {
  return new V(function (e) {
    var n = t[yt]();
    if (C(n.subscribe)) return n.subscribe(e);
    throw new TypeError('Provided object does not correctly implement Symbol.observable');
  });
}
function sr(t) {
  return new V(function (e) {
    for (var n = 0; n < t.length && !e.closed; n++) e.next(t[n]);
    e.complete();
  });
}
function lr(t) {
  return new V(function (e) {
    t.then(
      function (n) {
        e.closed || (e.next(n), e.complete());
      },
      function (n) {
        return e.error(n);
      }
    ).then(null, zt);
  });
}
function ur(t) {
  return new V(function (e) {
    var n, r;
    try {
      for (var i = Oe(t), o = i.next(); !o.done; o = i.next()) {
        var s = o.value;
        if ((e.next(s), e.closed)) return;
      }
    } catch (u) {
      n = { error: u };
    } finally {
      try {
        o && !o.done && (r = i.return) && r.call(i);
      } finally {
        if (n) throw n.error;
      }
    }
    e.complete();
  });
}
function un(t) {
  return new V(function (e) {
    cr(t, e).catch(function (n) {
      return e.error(n);
    });
  });
}
function ar(t) {
  return un(sn(t));
}
function cr(t, e) {
  var n, r, i, o;
  return Fn(this, void 0, void 0, function () {
    var s, u;
    return Kt(this, function (l) {
      switch (l.label) {
        case 0:
          (l.trys.push([0, 5, 6, 11]), (n = xn(t)), (l.label = 1));
        case 1:
          return [4, n.next()];
        case 2:
          if (((r = l.sent()), !!r.done)) return [3, 4];
          if (((s = r.value), e.next(s), e.closed)) return [2];
          l.label = 3;
        case 3:
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          return ((u = l.sent()), (i = { error: u }), [3, 11]);
        case 6:
          return (
            l.trys.push([6, , 9, 10]),
            r && !r.done && (o = n.return) ? [4, o.call(n)] : [3, 8]
          );
        case 7:
          (l.sent(), (l.label = 8));
        case 8:
          return [3, 10];
        case 9:
          if (i) throw i.error;
          return [7];
        case 10:
          return [7];
        case 11:
          return (e.complete(), [2]);
      }
    });
  });
}
function ce(t, e, n, r, i) {
  (r === void 0 && (r = 0), i === void 0 && (i = !1));
  var o = e.schedule(function () {
    (n(), i ? t.add(this.schedule(null, r)) : this.unsubscribe());
  }, r);
  if ((t.add(o), !i)) return o;
}
function an(t, e) {
  return (
    e === void 0 && (e = 0),
    le(function (n, r) {
      n.subscribe(
        fe(
          r,
          function (i) {
            return ce(
              r,
              t,
              function () {
                return r.next(i);
              },
              e
            );
          },
          function () {
            return ce(
              r,
              t,
              function () {
                return r.complete();
              },
              e
            );
          },
          function (i) {
            return ce(
              r,
              t,
              function () {
                return r.error(i);
              },
              e
            );
          }
        )
      );
    })
  );
}
function cn(t, e) {
  return (
    e === void 0 && (e = 0),
    le(function (n, r) {
      r.add(
        t.schedule(function () {
          return n.subscribe(r);
        }, e)
      );
    })
  );
}
function fr(t, e) {
  return ue(t).pipe(cn(e), an(e));
}
function dr(t, e) {
  return ue(t).pipe(cn(e), an(e));
}
function pr(t, e) {
  return new V(function (n) {
    var r = 0;
    return e.schedule(function () {
      r === t.length ? n.complete() : (n.next(t[r++]), n.closed || this.schedule());
    });
  });
}
function hr(t, e) {
  return new V(function (n) {
    var r;
    return (
      ce(n, e, function () {
        ((r = t[rn]()),
          ce(
            n,
            e,
            function () {
              var i, o, s;
              try {
                ((i = r.next()), (o = i.value), (s = i.done));
              } catch (u) {
                n.error(u);
                return;
              }
              s ? n.complete() : n.next(o);
            },
            0,
            !0
          ));
      }),
      function () {
        return C(r == null ? void 0 : r.return) && r.return();
      }
    );
  });
}
function fn(t, e) {
  if (!t) throw new Error('Iterable cannot be null');
  return new V(function (n) {
    ce(n, e, function () {
      var r = t[Symbol.asyncIterator]();
      ce(
        n,
        e,
        function () {
          r.next().then(function (i) {
            i.done ? n.complete() : n.next(i.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function vr(t, e) {
  return fn(sn(t), e);
}
function mr(t, e) {
  if (t != null) {
    if (en(t)) return fr(t, e);
    if (Xt(t)) return pr(t, e);
    if (Qt(t)) return dr(t, e);
    if (tn(t)) return fn(t, e);
    if (on(t)) return hr(t, e);
    if (ln(t)) return vr(t, e);
  }
  throw nn(t);
}
function br(t, e) {
  return e ? mr(t, e) : ue(t);
}
function yr(t) {
  return t instanceof Date && !isNaN(t);
}
function _r(t, e) {
  return le(function (n, r) {
    var i = 0;
    n.subscribe(
      fe(r, function (o) {
        r.next(t.call(e, o, i++));
      })
    );
  });
}
function gr(t, e, n, r, i, o, s, u) {
  var l = [],
    a = 0,
    c = 0,
    f = !1,
    h = function () {
      f && !l.length && !a && e.complete();
    },
    v = function (b) {
      return a < r ? y(b) : l.push(b);
    },
    y = function (b) {
      a++;
      var g = !1;
      ue(n(b, c++)).subscribe(
        fe(
          e,
          function (S) {
            e.next(S);
          },
          function () {
            g = !0;
          },
          void 0,
          function () {
            if (g)
              try {
                a--;
                for (
                  var S = function () {
                    var P = l.shift();
                    s || y(P);
                  };
                  l.length && a < r;
                )
                  S();
                h();
              } catch (P) {
                e.error(P);
              }
          }
        )
      );
    };
  return (
    t.subscribe(
      fe(e, v, function () {
        ((f = !0), h());
      })
    ),
    function () {}
  );
}
function dn(t, e, n) {
  return (
    n === void 0 && (n = 1 / 0),
    C(e)
      ? dn(function (r, i) {
          return _r(function (o, s) {
            return e(r, o, i, s);
          })(ue(t(r, i)));
        }, n)
      : (typeof e == 'number' && (n = e),
        le(function (r, i) {
          return gr(r, i, t, n);
        }))
  );
}
function wr(t) {
  return dn(_t, t);
}
function Sr() {
  return wr(1);
}
function Pt() {
  for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
  return Sr()(br(t, Jt(t)));
}
function Or(t, e, n) {
  n === void 0 && (n = nr);
  var r = -1;
  return (
    Zt(e) ? (n = e) : (r = e),
    new V(function (i) {
      var o = yr(t) ? +t - n.now() : t;
      o < 0 && (o = 0);
      var s = 0;
      return n.schedule(function () {
        i.closed || (i.next(s++), 0 <= r ? this.schedule(void 0, r) : i.complete());
      }, o);
    })
  );
}
function Ie(t, e) {
  return (e === void 0 && (e = Yt), Or(t, t, e));
}
function $r(t, e) {
  return (
    e === void 0 && (e = _t),
    (t = t ?? Ir),
    le(function (n, r) {
      var i,
        o = !0;
      n.subscribe(
        fe(r, function (s) {
          var u = e(s);
          (o || !t(i, u)) && ((o = !1), (i = u), r.next(s));
        })
      );
    })
  );
}
function Ir(t, e) {
  return t === e;
}
function Tr(t) {
  t === void 0 && (t = {});
  var e = t.connector,
    n =
      e === void 0
        ? function () {
            return new et();
          }
        : e,
    r = t.resetOnError,
    i = r === void 0 ? !0 : r,
    o = t.resetOnComplete,
    s = o === void 0 ? !0 : o,
    u = t.resetOnRefCountZero,
    l = u === void 0 ? !0 : u;
  return function (a) {
    var c,
      f,
      h,
      v = 0,
      y = !1,
      b = !1,
      g = function () {
        (f == null || f.unsubscribe(), (f = void 0));
      },
      S = function () {
        (g(), (c = h = void 0), (y = b = !1));
      },
      P = function () {
        var k = c;
        (S(), k == null || k.unsubscribe());
      };
    return le(function (k, w) {
      (v++, !b && !y && g());
      var j = (h = h ?? n());
      (w.add(function () {
        (v--, v === 0 && !b && !y && (f = it(P, l)));
      }),
        j.subscribe(w),
        !c &&
          v > 0 &&
          ((c = new je({
            next: function (O) {
              return j.next(O);
            },
            error: function (O) {
              ((b = !0), g(), (f = it(S, i, O)), j.error(O));
            },
            complete: function () {
              ((y = !0), g(), (f = it(S, s)), j.complete());
            },
          })),
          ue(k).subscribe(c)));
    })(a);
  };
}
function it(t, e) {
  for (var n = [], r = 2; r < arguments.length; r++) n[r - 2] = arguments[r];
  if (e === !0) {
    t();
    return;
  }
  if (e !== !1) {
    var i = new je({
      next: function () {
        (i.unsubscribe(), t());
      },
    });
    return ue(e.apply(void 0, Ce([], Pe(n)))).subscribe(i);
  }
}
function de(t, e, n) {
  var r,
    i = !1;
  return (
    (r = t),
    Tr({
      connector: function () {
        return new Xn(r, e, n);
      },
      resetOnError: !0,
      resetOnComplete: !1,
      resetOnRefCountZero: i,
    })
  );
}
function Te() {
  for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
  var n = Jt(t);
  return le(function (r, i) {
    (n ? Pt(t, r, n) : Pt(t, r)).subscribe(i);
  });
}
function q(t, e) {
  return le(function (n, r) {
    var i = null,
      o = 0,
      s = !1,
      u = function () {
        return s && !i && r.complete();
      };
    n.subscribe(
      fe(
        r,
        function (l) {
          i == null || i.unsubscribe();
          var a = 0,
            c = o++;
          ue(t(l, c)).subscribe(
            (i = fe(
              r,
              function (f) {
                return r.next(e ? e(l, f, c, a++) : f);
              },
              function () {
                ((i = null), u());
              }
            ))
          );
        },
        function () {
          ((s = !0), u());
        }
      )
    );
  });
}
const K = '/api';
async function Er() {
  const t = await fetch(`${K}/power`),
    { error: e, data: n } = await t.json();
  if (e) throw new Error(e);
  return n;
}
async function kr(t) {
  const e = await fetch(`${K}/power`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ on: t }),
    }),
    { error: n } = await e.json();
  if (n) throw new Error(n);
}
async function Nr() {
  const t = await fetch(`${K}/temperature`),
    { error: e, data: n } = await t.json();
  if (e) throw new Error(e);
  return n;
}
async function Ar() {
  const t = await fetch(`${K}/fan`),
    { error: e, data: n } = await t.json();
  if (e) throw new Error(e);
  return n;
}
async function Pr() {
  const t = await fetch(`${K}/volume`),
    { error: e, data: n } = await t.json();
  if (e) throw new Error(e);
  return n;
}
async function pn() {
  const t = await fetch(`${K}/picture-mode`),
    { error: e, data: n } = await t.json();
  if (e) throw new Error(e);
  return n;
}
async function Cr(t) {
  const e = await fetch(`${K}/picture-mode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: t }),
    }),
    { error: n } = await e.json();
  if (n) throw new Error(n);
}
async function jr() {
  const t = await fetch(`${K}/brightness`),
    { error: e, data: n } = await t.json();
  if (e) throw new Error(e);
  return n;
}
async function Mr(t) {
  const e = await fetch(`${K}/brightness`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ direction: t }),
    }),
    { error: n } = await e.json();
  if (n) throw new Error(n);
}
async function Rr(t) {
  const e = await fetch(`${K}/brightness`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: t }),
    }),
    { error: n } = await e.json();
  if (n) throw new Error(n);
}
async function Wr() {
  const t = await fetch(`${K}/contrast`),
    { error: e, data: n } = await t.json();
  if (e) throw new Error(e);
  return n;
}
async function Ct(t) {
  const e = await fetch(`${K}/contrast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: t }),
    }),
    { error: n } = await e.json();
  if (n) throw new Error(n);
}
async function Fr() {
  const t = await fetch(`${K}/sharpness`),
    { error: e, data: n } = await t.json();
  if (e) throw new Error(e);
  return n;
}
async function jt(t) {
  const e = await fetch(`${K}/sharpness`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: t }),
    }),
    { error: n } = await e.json();
  if (n) throw new Error(n);
}
var A = (t => (
  (t.OFF = 'OFF'),
  (t.WARMING_UP = 'WARMING_UP'),
  (t.ON = 'ON'),
  (t.COOLING_DOWN = 'COOLING_DOWN'),
  (t.UNKNOWN = 'UNKNOWN'),
  t
))(A || {});
const hn = 30,
  vn = 90;
function ut(t) {
  switch (t) {
    case 'OFF':
      return { state: 'OFF', canTurnOn: !0, canTurnOff: !1, label: 'Off' };
    case 'WARMING_UP':
      return {
        state: 'WARMING_UP',
        canTurnOn: !1,
        canTurnOff: !1,
        label: 'Powering On',
        estimatedTransitionTime: hn,
      };
    case 'ON':
      return { state: 'ON', canTurnOn: !1, canTurnOff: !0, label: 'On' };
    case 'COOLING_DOWN':
      return {
        state: 'COOLING_DOWN',
        canTurnOn: !1,
        canTurnOff: !1,
        label: 'Powering Off',
        estimatedTransitionTime: vn,
      };
    case 'UNKNOWN':
    default:
      return { state: 'UNKNOWN', canTurnOn: !1, canTurnOff: !1, label: 'Unknown' };
  }
}
function Lr(t, e, n) {
  return e === 'WARMING_UP' && n < hn
    ? 'WARMING_UP'
    : e === 'COOLING_DOWN' && n < vn
      ? 'COOLING_DOWN'
      : t
        ? 'ON'
        : 'OFF';
}
function xr(t, e) {
  const n = ut(t);
  return e && n.canTurnOn ? 'WARMING_UP' : !e && n.canTurnOff ? 'COOLING_DOWN' : t;
}
const Ee = 2e3,
  _e = new Jn({ powerOn: null, state: A.UNKNOWN, transitionStartTime: null }),
  at = 'benq-power-transition-timestamp',
  ct = 'benq-power-state';
function Ur() {
  try {
    const t = sessionStorage.getItem(at),
      e = sessionStorage.getItem(ct);
    if (t && e) return { powerOn: null, state: e, transitionStartTime: parseInt(t) };
  } catch (t) {
    console.error('Failed to load persisted power state:', t);
  }
  return { powerOn: null, state: A.UNKNOWN, transitionStartTime: null };
}
const Mt = Ur();
Mt.transitionStartTime && _e.next(Mt);
function mn(t) {
  try {
    t.transitionStartTime
      ? (sessionStorage.setItem(at, t.transitionStartTime.toString()),
        sessionStorage.setItem(ct, t.state))
      : (sessionStorage.removeItem(at), sessionStorage.removeItem(ct));
  } catch (e) {
    console.error('Failed to persist power state:', e);
  }
}
const bn = Ie(Ee).pipe(
    Te(0),
    q(async () => {
      try {
        const t = await Er();
        if (t !== null) {
          const e = _e.value,
            n = e.transitionStartTime ? (Date.now() - e.transitionStartTime) / 1e3 : 1 / 0,
            r = Lr(t, e.state, n);
          let i = e.transitionStartTime;
          r !== e.state && (r === A.ON || r === A.OFF) && (i = null);
          const o = { powerOn: t, state: r, transitionStartTime: i };
          (_e.next(o), mn(o));
        }
        return _e.value;
      } catch (t) {
        return (console.error('Failed to fetch power status:', t), _e.value);
      }
    }),
    de(1)
  ),
  Dr = bn,
  Ue = bn.pipe(
    q(t => [t.powerOn === !0 && t.state === A.ON]),
    $r(),
    de(1)
  ),
  Gr = Ue.pipe(
    q(t =>
      t
        ? Ie(Ee).pipe(
            Te(0),
            q(async () => {
              try {
                return await Nr();
              } catch (e) {
                return (console.error('Failed to fetch temperature:', e), null);
              }
            })
          )
        : xe
    ),
    de(1)
  ),
  Br = Ue.pipe(
    q(t =>
      t
        ? Ie(Ee).pipe(
            Te(0),
            q(async () => {
              try {
                return await Ar();
              } catch (e) {
                return (console.error('Failed to fetch fan speed:', e), null);
              }
            })
          )
        : xe
    ),
    de(1)
  );
Ue.pipe(
  q(t =>
    t
      ? Ie(Ee).pipe(
          Te(0),
          q(async () => {
            try {
              return await Pr();
            } catch (e) {
              return (console.error('Failed to fetch volume:', e), null);
            }
          })
        )
      : xe
  ),
  de(1)
);
const Kr = Ue.pipe(
    q(t =>
      t
        ? Ie(Ee).pipe(
            Te(0),
            q(async () => {
              try {
                return await pn();
              } catch (e) {
                return (console.error('Failed to fetch picture mode:', e), null);
              }
            })
          )
        : xe
    ),
    de(1)
  ),
  Hr = Ue.pipe(
    q(t =>
      t
        ? Ie(Ee).pipe(
            Te(0),
            q(async () => {
              try {
                const [e, n, r] = await Promise.all([jr(), Wr(), Fr()]);
                return { brightness: e, contrast: n, sharpness: r };
              } catch (e) {
                return (
                  console.error('Failed to fetch picture settings:', e),
                  { brightness: null, contrast: null, sharpness: null }
                );
              }
            })
          )
        : xe
    ),
    de(1)
  );
function Vr(t, e) {
  const n = { powerOn: t, state: e, transitionStartTime: Date.now() };
  (_e.next(n), mn(n));
}
function qr(t) {
  let e, n, r, i, o, s, u, l;
  const a = t[2].default,
    c = $n(a, t, t[1], null);
  return {
    c() {
      ((e = m('div')),
        (n = m('header')),
        (r = m('p')),
        (i = re(t[0])),
        (o = N()),
        (s = m('div')),
        (u = m('div')),
        c && c.c(),
        d(r, 'class', 'card-header-title'),
        d(n, 'class', 'card-header'),
        d(u, 'class', 'content has-text-centered'),
        d(s, 'class', 'card-content'),
        d(e, 'class', 'card'));
    },
    m(f, h) {
      (x(f, e, h),
        p(e, n),
        p(n, r),
        p(r, i),
        p(e, o),
        p(e, s),
        p(s, u),
        c && c.m(u, null),
        (l = !0));
    },
    p(f, [h]) {
      ((!l || h & 1) && Qe(i, f[0]),
        c && c.p && (!l || h & 2) && Tn(c, a, f, f[1], l ? In(a, f[1], h, null) : En(f[1]), null));
    },
    i(f) {
      l || ($(c, f), (l = !0));
    },
    o(f) {
      (I(c, f), (l = !1));
    },
    d(f) {
      (f && M(e), c && c.d(f));
    },
  };
}
function zr(t, e, n) {
  let { $$slots: r = {}, $$scope: i } = e,
    { title: o } = e;
  return (
    (t.$$set = s => {
      ('title' in s && n(0, (o = s.title)), '$$scope' in s && n(1, (i = s.$$scope)));
    }),
    [o, i, r]
  );
}
class De extends se {
  constructor(e) {
    (super(), oe(this, e, zr, qr, ie, { title: 0 }));
  }
}
function Yr(t) {
  let e;
  return {
    c() {
      ((e = m('div')),
        (e.innerHTML = '<div class="tw-h-16 tw-bg-gray-200 tw-rounded tw-w-32 tw-mx-auto"></div>'),
        d(e, 'class', 'tw-animate-pulse'));
    },
    m(n, r) {
      x(n, e, r);
    },
    p: E,
    i: E,
    o: E,
    d(n) {
      n && M(e);
    },
  };
}
class Ge extends se {
  constructor(e) {
    (super(), oe(this, e, null, Yr, ie, {}));
  }
}
function Zr(t) {
  let e,
    n,
    r,
    i,
    o,
    s = (t[0] !== null ? t[0].toFixed(1) : '-') + '',
    u,
    l,
    a,
    c = t[0] !== null && Rt(t);
  return {
    c() {
      ((e = m('div')),
        (n = m('div')),
        (r = ke('svg')),
        (i = ke('circle')),
        c && c.c(),
        (o = ke('text')),
        (u = re(s)),
        (l = ke('text')),
        (a = re('°C')),
        d(i, 'cx', '100'),
        d(i, 'cy', '100'),
        d(i, 'r', '80'),
        d(i, 'fill', 'none'),
        d(i, 'stroke', '#e5e7eb'),
        d(i, 'stroke-width', '12'),
        d(o, 'x', '100'),
        d(o, 'y', '95'),
        d(o, 'text-anchor', 'middle'),
        d(o, 'class', 'dial-value svelte-16y3rj7'),
        d(o, 'fill', t[2]),
        d(l, 'x', '100'),
        d(l, 'y', '115'),
        d(l, 'text-anchor', 'middle'),
        d(l, 'class', 'dial-unit svelte-16y3rj7'),
        d(r, 'class', 'dial svelte-16y3rj7'),
        d(r, 'viewBox', '0 0 200 200'),
        d(n, 'class', 'dial-container svelte-16y3rj7'),
        d(e, 'class', 'widget-content'));
    },
    m(f, h) {
      (x(f, e, h),
        p(e, n),
        p(n, r),
        p(r, i),
        c && c.m(r, null),
        p(r, o),
        p(o, u),
        p(r, l),
        p(l, a));
    },
    p(f, h) {
      (f[0] !== null
        ? c
          ? c.p(f, h)
          : ((c = Rt(f)), c.c(), c.m(r, o))
        : c && (c.d(1), (c = null)),
        h & 1 && s !== (s = (f[0] !== null ? f[0].toFixed(1) : '-') + '') && Qe(u, s),
        h & 4 && d(o, 'fill', f[2]));
    },
    i: E,
    o: E,
    d(f) {
      (f && M(e), c && c.d());
    },
  };
}
function Jr(t) {
  let e, n;
  return (
    (e = new Ge({})),
    {
      c() {
        U(e.$$.fragment);
      },
      m(r, i) {
        (F(e, r, i), (n = !0));
      },
      p: E,
      i(r) {
        n || ($(e.$$.fragment, r), (n = !0));
      },
      o(r) {
        (I(e.$$.fragment, r), (n = !1));
      },
      d(r) {
        L(e, r);
      },
    }
  );
}
function Rt(t) {
  let e, n;
  return {
    c() {
      ((e = ke('circle')),
        d(e, 'cx', '100'),
        d(e, 'cy', '100'),
        d(e, 'r', '80'),
        d(e, 'fill', 'none'),
        d(e, 'stroke', t[2]),
        d(e, 'stroke-width', '12'),
        d(e, 'stroke-dasharray', (n = (t[0] / 50) * 502.65 + ' 502.65')),
        d(e, 'stroke-linecap', 'round'),
        d(e, 'transform', 'rotate(-90 100 100)'),
        An(e, 'transition', 'stroke 0.3s ease'));
    },
    m(r, i) {
      x(r, e, i);
    },
    p(r, i) {
      (i & 4 && d(e, 'stroke', r[2]),
        i & 1 && n !== (n = (r[0] / 50) * 502.65 + ' 502.65') && d(e, 'stroke-dasharray', n));
    },
    d(r) {
      r && M(e);
    },
  };
}
function Xr(t) {
  let e, n, r, i;
  const o = [Jr, Zr],
    s = [];
  function u(l, a) {
    return l[1] && l[0] === null ? 0 : 1;
  }
  return (
    (e = u(t)),
    (n = s[e] = o[e](t)),
    {
      c() {
        (n.c(), (r = Xe()));
      },
      m(l, a) {
        (s[e].m(l, a), x(l, r, a), (i = !0));
      },
      p(l, a) {
        let c = e;
        ((e = u(l)),
          e === c
            ? s[e].p(l, a)
            : (We(),
              I(s[c], 1, 1, () => {
                s[c] = null;
              }),
              Fe(),
              (n = s[e]),
              n ? n.p(l, a) : ((n = s[e] = o[e](l)), n.c()),
              $(n, 1),
              n.m(r.parentNode, r)));
      },
      i(l) {
        i || ($(n), (i = !0));
      },
      o(l) {
        (I(n), (i = !1));
      },
      d(l) {
        (l && M(r), s[e].d(l));
      },
    }
  );
}
function Qr(t) {
  let e, n;
  return (
    (e = new De({
      props: { title: 'Temperature', $$slots: { default: [Xr] }, $$scope: { ctx: t } },
    })),
    {
      c() {
        U(e.$$.fragment);
      },
      m(r, i) {
        (F(e, r, i), (n = !0));
      },
      p(r, [i]) {
        const o = {};
        (i & 23 && (o.$$scope = { dirty: i, ctx: r }), e.$set(o));
      },
      i(r) {
        n || ($(e.$$.fragment, r), (n = !0));
      },
      o(r) {
        (I(e.$$.fragment, r), (n = !1));
      },
      d(r) {
        L(e, r);
      },
    }
  );
}
function ei(t) {
  return t === null ? '#9ca3af' : t < 30 ? '#10b981' : t < 40 ? '#f59e0b' : '#ef4444';
}
function ti(t, e, n) {
  let r,
    i = null,
    o = !0,
    s;
  return (
    Me(() => {
      s = Gr.subscribe(u => {
        (u !== null && n(0, (i = u)), n(1, (o = !1)));
      });
    }),
    Re(() => {
      s && s.unsubscribe();
    }),
    (t.$$.update = () => {
      t.$$.dirty & 1 && n(2, (r = ei(i)));
    }),
    [i, o, r]
  );
}
class ni extends se {
  constructor(e) {
    (super(), oe(this, e, ti, Qr, ie, {}));
  }
}
const ri =
  "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20122.88%20122.07'%20fill='%23502e91'%3e%3cpath%20fill-rule='evenodd'%20d='M67.29,82.9c-.11,1.3-.26,2.6-.47,3.9-1.43,9-5.79,14.34-8.08,22.17C56,118.45,65.32,122.53,73.27,122A37.63,37.63,0,0,0,85,119a45,45,0,0,0,9.32-5.36c20.11-14.8,16-34.9-6.11-46.36a15,15,0,0,0-4.14-1.4,22,22,0,0,1-6,11.07l0,0A22.09,22.09,0,0,1,67.29,82.9ZM62.4,44.22a17.1,17.1,0,1,1-17.1,17.1,17.1,17.1,0,0,1,17.1-17.1ZM84.06,56.83c1.26.05,2.53.14,3.79.29,9.06,1,14.58,5.16,22.5,7.1,9.6,2.35,13.27-7.17,12.41-15.09a37.37,37.37,0,0,0-3.55-11.57,45.35,45.35,0,0,0-5.76-9.08C97.77,9,77.88,14,67.4,36.63a14.14,14.14,0,0,0-1,2.94A22,22,0,0,1,78,45.68l0,0a22.07,22.07,0,0,1,6,11.13Zm-26.9-17c0-1.6.13-3.21.31-4.81,1-9.07,5.12-14.6,7-22.52C66.86,2.89,57.32-.75,49.41.13A37.4,37.4,0,0,0,37.84,3.7a44.58,44.58,0,0,0-9.06,5.78C9.37,25.2,14.39,45.08,37,55.51a14.63,14.63,0,0,0,3.76,1.14A22.12,22.12,0,0,1,57.16,39.83ZM40.66,65.42a52.11,52.11,0,0,1-5.72-.24c-9.08-.88-14.67-4.92-22.62-6.73C2.68,56.25-.83,65.84.16,73.74A37.45,37.45,0,0,0,3.9,85.25a45.06,45.06,0,0,0,5.91,9c16,19.17,35.8,13.87,45.91-8.91a15.93,15.93,0,0,0,.88-2.66A22.15,22.15,0,0,1,40.66,65.42Z'/%3e%3c/svg%3e";
function ii(t) {
  let e,
    n,
    r,
    i,
    o,
    s,
    u,
    l = t[0] !== null ? `${t[0]} RPM` : '- RPM',
    a;
  return {
    c() {
      ((e = m('div')),
        (n = m('div')),
        (r = m('div')),
        (i = m('img')),
        (s = N()),
        (u = m('p')),
        (a = re(l)),
        Sn(i.src, (o = ri)) || d(i, 'src', o),
        d(i, 'alt', 'Fan'),
        d(i, 'class', 'fan-icon svelte-11rjp9u'),
        B(i, 'spinning', t[0] !== null && t[0] > 0),
        d(r, 'class', 'mb-4'),
        d(u, 'class', 'value svelte-11rjp9u'),
        B(u, 'null-value', t[0] === null),
        d(n, 'class', 'value-container'),
        d(e, 'class', 'widget-content'));
    },
    m(c, f) {
      (x(c, e, f), p(e, n), p(n, r), p(r, i), p(n, s), p(n, u), p(u, a));
    },
    p(c, f) {
      (f & 1 && B(i, 'spinning', c[0] !== null && c[0] > 0),
        f & 1 && l !== (l = c[0] !== null ? `${c[0]} RPM` : '- RPM') && Qe(a, l),
        f & 1 && B(u, 'null-value', c[0] === null));
    },
    i: E,
    o: E,
    d(c) {
      c && M(e);
    },
  };
}
function oi(t) {
  let e, n;
  return (
    (e = new Ge({})),
    {
      c() {
        U(e.$$.fragment);
      },
      m(r, i) {
        (F(e, r, i), (n = !0));
      },
      p: E,
      i(r) {
        n || ($(e.$$.fragment, r), (n = !0));
      },
      o(r) {
        (I(e.$$.fragment, r), (n = !1));
      },
      d(r) {
        L(e, r);
      },
    }
  );
}
function si(t) {
  let e, n, r, i;
  const o = [oi, ii],
    s = [];
  function u(l, a) {
    return l[1] && l[0] === null ? 0 : 1;
  }
  return (
    (e = u(t)),
    (n = s[e] = o[e](t)),
    {
      c() {
        (n.c(), (r = Xe()));
      },
      m(l, a) {
        (s[e].m(l, a), x(l, r, a), (i = !0));
      },
      p(l, a) {
        let c = e;
        ((e = u(l)),
          e === c
            ? s[e].p(l, a)
            : (We(),
              I(s[c], 1, 1, () => {
                s[c] = null;
              }),
              Fe(),
              (n = s[e]),
              n ? n.p(l, a) : ((n = s[e] = o[e](l)), n.c()),
              $(n, 1),
              n.m(r.parentNode, r)));
      },
      i(l) {
        i || ($(n), (i = !0));
      },
      o(l) {
        (I(n), (i = !1));
      },
      d(l) {
        (l && M(r), s[e].d(l));
      },
    }
  );
}
function li(t) {
  let e, n;
  return (
    (e = new De({
      props: { title: 'Fan Speed', $$slots: { default: [si] }, $$scope: { ctx: t } },
    })),
    {
      c() {
        U(e.$$.fragment);
      },
      m(r, i) {
        (F(e, r, i), (n = !0));
      },
      p(r, [i]) {
        const o = {};
        (i & 11 && (o.$$scope = { dirty: i, ctx: r }), e.$set(o));
      },
      i(r) {
        n || ($(e.$$.fragment, r), (n = !0));
      },
      o(r) {
        (I(e.$$.fragment, r), (n = !1));
      },
      d(r) {
        L(e, r);
      },
    }
  );
}
function ui(t, e, n) {
  let r = null,
    i = !0,
    o;
  return (
    Me(() => {
      o = Br.subscribe(s => {
        (s !== null && n(0, (r = s)), n(1, (i = !1)));
      });
    }),
    Re(() => {
      o && o.unsubscribe();
    }),
    [r, i]
  );
}
class ai extends se {
  constructor(e) {
    (super(), oe(this, e, ui, li, ie, {}));
  }
}
function ci(t) {
  let e,
    n,
    r,
    i,
    o,
    s,
    u,
    l,
    a,
    c = t[2] && Wt(t);
  return {
    c() {
      ((e = m('div')),
        (n = m('div')),
        (r = m('button')),
        (i = m('span')),
        (u = N()),
        c && c.c(),
        d(i, 'class', 'toggle-slider svelte-1s2sszp'),
        d(r, 'class', 'toggle-button svelte-1s2sszp'),
        (r.disabled = o = t[2] || (!t[1].canTurnOn && !t[1].canTurnOff)),
        d(r, 'title', (s = t[2] ? t[5] : '')),
        B(r, 'is-off', t[0] === A.OFF),
        B(r, 'is-on', t[0] === A.ON),
        B(r, 'is-warming', t[0] === A.WARMING_UP),
        B(r, 'is-cooling', t[0] === A.COOLING_DOWN),
        d(n, 'class', 'value-container svelte-1s2sszp'),
        d(e, 'class', 'widget-content'));
    },
    m(f, h) {
      (x(f, e, h),
        p(e, n),
        p(n, r),
        p(r, i),
        p(n, u),
        c && c.m(n, null),
        l || ((a = G(r, 'click', t[6])), (l = !0)));
    },
    p(f, h) {
      (h & 6 && o !== (o = f[2] || (!f[1].canTurnOn && !f[1].canTurnOff)) && (r.disabled = o),
        h & 36 && s !== (s = f[2] ? f[5] : '') && d(r, 'title', s),
        h & 1 && B(r, 'is-off', f[0] === A.OFF),
        h & 1 && B(r, 'is-on', f[0] === A.ON),
        h & 1 && B(r, 'is-warming', f[0] === A.WARMING_UP),
        h & 1 && B(r, 'is-cooling', f[0] === A.COOLING_DOWN),
        f[2] ? (c ? c.p(f, h) : ((c = Wt(f)), c.c(), c.m(n, null))) : c && (c.d(1), (c = null)));
    },
    i: E,
    o: E,
    d(f) {
      (f && M(e), c && c.d(), (l = !1), a());
    },
  };
}
function fi(t) {
  let e, n;
  return (
    (e = new Ge({})),
    {
      c() {
        U(e.$$.fragment);
      },
      m(r, i) {
        (F(e, r, i), (n = !0));
      },
      p: E,
      i(r) {
        n || ($(e.$$.fragment, r), (n = !0));
      },
      o(r) {
        (I(e.$$.fragment, r), (n = !1));
      },
      d(r) {
        L(e, r);
      },
    }
  );
}
function Wt(t) {
  let e, n;
  return {
    c() {
      ((e = m('p')), (n = re(t[5])), d(e, 'class', 'text-sm text-gray-500'));
    },
    m(r, i) {
      (x(r, e, i), p(e, n));
    },
    p(r, i) {
      i & 32 && Qe(n, r[5]);
    },
    d(r) {
      r && M(e);
    },
  };
}
function di(t) {
  let e, n, r, i;
  const o = [fi, ci],
    s = [];
  function u(l, a) {
    return l[4] && l[3] === null ? 0 : l[3] !== null ? 1 : -1;
  }
  return (
    ~(e = u(t)) && (n = s[e] = o[e](t)),
    {
      c() {
        (n && n.c(), (r = Xe()));
      },
      m(l, a) {
        (~e && s[e].m(l, a), x(l, r, a), (i = !0));
      },
      p(l, a) {
        let c = e;
        ((e = u(l)),
          e === c
            ? ~e && s[e].p(l, a)
            : (n &&
                (We(),
                I(s[c], 1, 1, () => {
                  s[c] = null;
                }),
                Fe()),
              ~e
                ? ((n = s[e]),
                  n ? n.p(l, a) : ((n = s[e] = o[e](l)), n.c()),
                  $(n, 1),
                  n.m(r.parentNode, r))
                : (n = null)));
      },
      i(l) {
        i || ($(n), (i = !0));
      },
      o(l) {
        (I(n), (i = !1));
      },
      d(l) {
        (l && M(r), ~e && s[e].d(l));
      },
    }
  );
}
function pi(t) {
  let e, n;
  return (
    (e = new De({
      props: { title: 'Power Control', $$slots: { default: [di] }, $$scope: { ctx: t } },
    })),
    {
      c() {
        U(e.$$.fragment);
      },
      m(r, i) {
        (F(e, r, i), (n = !0));
      },
      p(r, [i]) {
        const o = {};
        (i & 1087 && (o.$$scope = { dirty: i, ctx: r }), e.$set(o));
      },
      i(r) {
        n || ($(e.$$.fragment, r), (n = !0));
      },
      o(r) {
        (I(e.$$.fragment, r), (n = !1));
      },
      d(r) {
        L(e, r);
      },
    }
  );
}
function hi(t, e, n) {
  let r,
    i,
    o = null,
    s = A.UNKNOWN,
    u = ut(A.UNKNOWN),
    l = null,
    a = !0,
    c = 0,
    f;
  async function h() {
    if (o === null || (!u.canTurnOn && !u.canTurnOff)) return;
    const v = !o;
    if (v && !u.canTurnOn) {
      console.warn('Cannot turn on projector in current state:', s);
      return;
    }
    if (!v && !u.canTurnOff) {
      console.warn('Cannot turn off projector in current state:', s);
      return;
    }
    try {
      (await kr(v), Vr(v, xr(s, v)));
    } catch (y) {
      console.error('Failed to toggle power:', y);
    }
  }
  return (
    Me(() => {
      f = Dr.subscribe(y => {
        (n(3, (o = y.powerOn)),
          n(0, (s = y.state)),
          n(7, (l = y.transitionStartTime)),
          n(4, (a = !1)));
      });
      const v = setInterval(() => {
        if (r && l && u.estimatedTransitionTime) {
          const y = (Date.now() - l) / 1e3;
          n(8, (c = Math.max(0, Math.ceil(u.estimatedTransitionTime - y))));
        }
      }, 100);
      return () => {
        clearInterval(v);
      };
    }),
    Re(() => {
      f && f.unsubscribe();
    }),
    (t.$$.update = () => {
      if (
        (t.$$.dirty & 1 && n(1, (u = ut(s))),
        t.$$.dirty & 1 && n(2, (r = s === A.WARMING_UP || s === A.COOLING_DOWN)),
        t.$$.dirty & 134)
      )
        if (r && l && u.estimatedTransitionTime) {
          const v = (Date.now() - l) / 1e3;
          n(8, (c = Math.max(0, Math.ceil(u.estimatedTransitionTime - v))));
        } else n(8, (c = 0));
      t.$$.dirty & 257 &&
        n(
          5,
          (i =
            s === A.WARMING_UP
              ? `Warming up: ${c} s`
              : s === A.COOLING_DOWN
                ? `Cooling down: ${c} s`
                : '')
        );
    }),
    [s, u, r, o, a, i, h, l, c]
  );
}
class vi extends se {
  constructor(e) {
    (super(), oe(this, e, hi, pi, ie, {}));
  }
}
function Ft(t, e, n) {
  const r = t.slice();
  return ((r[7] = e[n]), r);
}
function mi(t) {
  let e,
    n,
    r = $t(t[3]),
    i = [];
  for (let o = 0; o < r.length; o += 1) i[o] = Lt(Ft(t, r, o));
  return {
    c() {
      ((e = m('div')), (n = m('div')));
      for (let o = 0; o < i.length; o += 1) i[o].c();
      (d(n, 'class', 'modes-grid svelte-1n9j84e'), d(e, 'class', 'widget-content svelte-1n9j84e'));
    },
    m(o, s) {
      (x(o, e, s), p(e, n));
      for (let u = 0; u < i.length; u += 1) i[u] && i[u].m(n, null);
    },
    p(o, s) {
      if (s & 29) {
        r = $t(o[3]);
        let u;
        for (u = 0; u < r.length; u += 1) {
          const l = Ft(o, r, u);
          i[u] ? i[u].p(l, s) : ((i[u] = Lt(l)), i[u].c(), i[u].m(n, null));
        }
        for (; u < i.length; u += 1) i[u].d(1);
        i.length = r.length;
      }
    },
    i: E,
    o: E,
    d(o) {
      (o && M(e), kn(i, o));
    },
  };
}
function bi(t) {
  let e, n;
  return (
    (e = new Ge({})),
    {
      c() {
        U(e.$$.fragment);
      },
      m(r, i) {
        (F(e, r, i), (n = !0));
      },
      p: E,
      i(r) {
        n || ($(e.$$.fragment, r), (n = !0));
      },
      o(r) {
        (I(e.$$.fragment, r), (n = !1));
      },
      d(r) {
        L(e, r);
      },
    }
  );
}
function Lt(t) {
  let e,
    n = t[7].label + '',
    r,
    i,
    o,
    s;
  function u() {
    return t[5](t[7]);
  }
  return {
    c() {
      ((e = m('button')),
        (r = re(n)),
        (i = N()),
        d(e, 'class', 'mode-button svelte-1n9j84e'),
        (e.disabled = t[2]),
        B(e, 'active', t[0] === t[7].id));
    },
    m(l, a) {
      (x(l, e, a), p(e, r), p(e, i), o || ((s = G(e, 'click', u)), (o = !0)));
    },
    p(l, a) {
      ((t = l), a & 4 && (e.disabled = t[2]), a & 9 && B(e, 'active', t[0] === t[7].id));
    },
    d(l) {
      (l && M(e), (o = !1), s());
    },
  };
}
function yi(t) {
  let e, n, r, i;
  const o = [bi, mi],
    s = [];
  function u(l, a) {
    return l[1] && l[0] === null ? 0 : l[0] !== null ? 1 : -1;
  }
  return (
    ~(e = u(t)) && (n = s[e] = o[e](t)),
    {
      c() {
        (n && n.c(), (r = Xe()));
      },
      m(l, a) {
        (~e && s[e].m(l, a), x(l, r, a), (i = !0));
      },
      p(l, a) {
        let c = e;
        ((e = u(l)),
          e === c
            ? ~e && s[e].p(l, a)
            : (n &&
                (We(),
                I(s[c], 1, 1, () => {
                  s[c] = null;
                }),
                Fe()),
              ~e
                ? ((n = s[e]),
                  n ? n.p(l, a) : ((n = s[e] = o[e](l)), n.c()),
                  $(n, 1),
                  n.m(r.parentNode, r))
                : (n = null)));
      },
      i(l) {
        i || ($(n), (i = !0));
      },
      o(l) {
        (I(n), (i = !1));
      },
      d(l) {
        (l && M(r), ~e && s[e].d(l));
      },
    }
  );
}
function _i(t) {
  let e, n;
  return (
    (e = new De({
      props: { title: 'Picture Mode', $$slots: { default: [yi] }, $$scope: { ctx: t } },
    })),
    {
      c() {
        U(e.$$.fragment);
      },
      m(r, i) {
        (F(e, r, i), (n = !0));
      },
      p(r, [i]) {
        const o = {};
        (i & 1031 && (o.$$scope = { dirty: i, ctx: r }), e.$set(o));
      },
      i(r) {
        n || ($(e.$$.fragment, r), (n = !0));
      },
      o(r) {
        (I(e.$$.fragment, r), (n = !1));
      },
      d(r) {
        L(e, r);
      },
    }
  );
}
function gi(t, e, n) {
  const r = [
    { id: 'bright', label: 'Bright' },
    { id: 'livingroom', label: 'Living Room' },
    { id: 'game', label: 'Game' },
    { id: 'cine', label: 'Cinema' },
    { id: 'user1', label: 'User 1' },
    { id: 'sport', label: 'Sport' },
  ];
  let i = null,
    o = !0,
    s = !1,
    u;
  async function l(c) {
    if (!(s || i === c)) {
      n(2, (s = !0));
      try {
        await Cr(c);
        const f = await pn();
        f !== null && n(0, (i = f));
      } catch (f) {
        console.error('Failed to set picture mode:', f);
      } finally {
        n(2, (s = !1));
      }
    }
  }
  return (
    Me(() => {
      u = Kr.subscribe(c => {
        (c !== null && n(0, (i = c)), n(1, (o = !1)));
      });
    }),
    Re(() => {
      u && u.unsubscribe();
    }),
    [i, o, s, r, l, c => l(c.id)]
  );
}
class wi extends se {
  constructor(e) {
    (super(), oe(this, e, gi, _i, ie, {}));
  }
}
function Si(t) {
  let e,
    n,
    r,
    i,
    o,
    s,
    u,
    l,
    a,
    c,
    f,
    h,
    v,
    y,
    b,
    g,
    S,
    P,
    k,
    w,
    j,
    O,
    Z,
    Be,
    Q,
    pe,
    Ke,
    J,
    ee,
    he,
    He,
    te,
    R,
    ve,
    Ve,
    _,
    H,
    D,
    z,
    Y,
    ne;
  return {
    c() {
      ((e = m('div')),
        (n = m('div')),
        (r = m('button')),
        (i = m('span')),
        (i.innerHTML = '<i class="fa-solid fa-plus"></i>'),
        (o = N()),
        (s = m('div')),
        (u = m('input')),
        (a = N()),
        (c = m('span')),
        (c.textContent = 'Brightness'),
        (f = N()),
        (h = m('button')),
        (v = m('span')),
        (v.innerHTML = '<i class="fa-solid fa-minus"></i>'),
        (y = N()),
        (b = m('div')),
        (g = m('button')),
        (S = m('span')),
        (S.innerHTML = '<i class="fa-solid fa-plus"></i>'),
        (P = N()),
        (k = m('div')),
        (w = m('input')),
        (O = N()),
        (Z = m('span')),
        (Z.textContent = 'Contrast'),
        (Be = N()),
        (Q = m('button')),
        (pe = m('span')),
        (pe.innerHTML = '<i class="fa-solid fa-minus"></i>'),
        (Ke = N()),
        (J = m('div')),
        (ee = m('button')),
        (he = m('span')),
        (he.innerHTML = '<i class="fa-solid fa-plus"></i>'),
        (He = N()),
        (te = m('div')),
        (R = m('input')),
        (Ve = N()),
        (_ = m('span')),
        (_.textContent = 'Sharpness'),
        (H = N()),
        (D = m('button')),
        (z = m('span')),
        (z.innerHTML = '<i class="fa-solid fa-minus"></i>'),
        d(i, 'class', 'icon is-small'),
        d(r, 'class', 'button is-primary is-rounded svelte-1psl7uo'),
        (r.disabled = t[13]),
        d(u, 'type', 'number'),
        d(u, 'class', 'value-input svelte-1psl7uo'),
        (u.disabled = l = t[3].brightness || t[0] === null),
        d(u, 'min', ft),
        d(u, 'max', dt),
        d(u, 'placeholder', '-'),
        d(c, 'class', 'label svelte-1psl7uo'),
        d(s, 'class', 'value-display svelte-1psl7uo'),
        d(v, 'class', 'icon is-small'),
        d(h, 'class', 'button is-primary is-rounded svelte-1psl7uo'),
        (h.disabled = t[12]),
        d(n, 'class', 'setting-control svelte-1psl7uo'),
        d(S, 'class', 'icon is-small'),
        d(g, 'class', 'button is-primary is-rounded svelte-1psl7uo'),
        (g.disabled = t[11]),
        d(w, 'type', 'number'),
        d(w, 'class', 'value-input svelte-1psl7uo'),
        (w.disabled = j = t[3].contrast || t[1] === null),
        d(w, 'min', pt),
        d(w, 'max', ht),
        d(w, 'placeholder', '-'),
        d(Z, 'class', 'label svelte-1psl7uo'),
        d(k, 'class', 'value-display svelte-1psl7uo'),
        d(pe, 'class', 'icon is-small'),
        d(Q, 'class', 'button is-primary is-rounded svelte-1psl7uo'),
        (Q.disabled = t[10]),
        d(b, 'class', 'setting-control svelte-1psl7uo'),
        d(he, 'class', 'icon is-small'),
        d(ee, 'class', 'button is-primary is-rounded svelte-1psl7uo'),
        (ee.disabled = t[9]),
        d(R, 'type', 'number'),
        d(R, 'class', 'value-input svelte-1psl7uo'),
        (R.disabled = ve = t[3].sharpness || t[2] === null),
        d(R, 'min', vt),
        d(R, 'max', mt),
        d(R, 'placeholder', '-'),
        d(_, 'class', 'label svelte-1psl7uo'),
        d(te, 'class', 'value-display svelte-1psl7uo'),
        d(z, 'class', 'icon is-small'),
        d(D, 'class', 'button is-primary is-rounded svelte-1psl7uo'),
        (D.disabled = t[8]),
        d(J, 'class', 'setting-control svelte-1psl7uo'),
        d(e, 'class', 'settings-grid svelte-1psl7uo'));
    },
    m(T, W) {
      (x(T, e, W),
        p(e, n),
        p(n, r),
        p(r, i),
        p(n, o),
        p(n, s),
        p(s, u),
        me(u, t[5]),
        p(s, a),
        p(s, c),
        p(n, f),
        p(n, h),
        p(h, v),
        p(e, y),
        p(e, b),
        p(b, g),
        p(g, S),
        p(b, P),
        p(b, k),
        p(k, w),
        me(w, t[6]),
        p(k, O),
        p(k, Z),
        p(b, Be),
        p(b, Q),
        p(Q, pe),
        p(e, Ke),
        p(e, J),
        p(J, ee),
        p(ee, he),
        p(J, He),
        p(J, te),
        p(te, R),
        me(R, t[7]),
        p(te, Ve),
        p(te, _),
        p(J, H),
        p(J, D),
        p(D, z),
        Y ||
          ((ne = [
            G(r, 'click', t[20]),
            G(u, 'input', t[21]),
            G(u, 'keydown', t[17]),
            G(h, 'click', t[22]),
            G(g, 'click', t[23]),
            G(w, 'input', t[24]),
            G(w, 'keydown', t[18]),
            G(Q, 'click', t[25]),
            G(ee, 'click', t[26]),
            G(R, 'input', t[27]),
            G(R, 'keydown', t[19]),
            G(D, 'click', t[28]),
          ]),
          (Y = !0)));
    },
    p(T, W) {
      (W[0] & 8192 && (r.disabled = T[13]),
        W[0] & 9 && l !== (l = T[3].brightness || T[0] === null) && (u.disabled = l),
        W[0] & 32 && ge(u.value) !== T[5] && me(u, T[5]),
        W[0] & 4096 && (h.disabled = T[12]),
        W[0] & 2048 && (g.disabled = T[11]),
        W[0] & 10 && j !== (j = T[3].contrast || T[1] === null) && (w.disabled = j),
        W[0] & 64 && ge(w.value) !== T[6] && me(w, T[6]),
        W[0] & 1024 && (Q.disabled = T[10]),
        W[0] & 512 && (ee.disabled = T[9]),
        W[0] & 12 && ve !== (ve = T[3].sharpness || T[2] === null) && (R.disabled = ve),
        W[0] & 128 && ge(R.value) !== T[7] && me(R, T[7]),
        W[0] & 256 && (D.disabled = T[8]));
    },
    i: E,
    o: E,
    d(T) {
      (T && M(e), (Y = !1), $e(ne));
    },
  };
}
function Oi(t) {
  let e, n;
  return (
    (e = new Ge({})),
    {
      c() {
        U(e.$$.fragment);
      },
      m(r, i) {
        (F(e, r, i), (n = !0));
      },
      p: E,
      i(r) {
        n || ($(e.$$.fragment, r), (n = !0));
      },
      o(r) {
        (I(e.$$.fragment, r), (n = !1));
      },
      d(r) {
        L(e, r);
      },
    }
  );
}
function $i(t) {
  let e, n, r, i;
  const o = [Oi, Si],
    s = [];
  function u(l, a) {
    return l[4] && l[0] === null && l[1] === null && l[2] === null ? 0 : 1;
  }
  return (
    (n = u(t)),
    (r = s[n] = o[n](t)),
    {
      c() {
        ((e = m('div')), r.c(), d(e, 'class', 'settings-wrapper'));
      },
      m(l, a) {
        (x(l, e, a), s[n].m(e, null), (i = !0));
      },
      p(l, a) {
        let c = n;
        ((n = u(l)),
          n === c
            ? s[n].p(l, a)
            : (We(),
              I(s[c], 1, 1, () => {
                s[c] = null;
              }),
              Fe(),
              (r = s[n]),
              r ? r.p(l, a) : ((r = s[n] = o[n](l)), r.c()),
              $(r, 1),
              r.m(e, null)));
      },
      i(l) {
        i || ($(r), (i = !0));
      },
      o(l) {
        (I(r), (i = !1));
      },
      d(l) {
        (l && M(e), s[n].d());
      },
    }
  );
}
function Ii(t) {
  let e, n;
  return (
    (e = new De({
      props: { title: 'Picture Settings', $$slots: { default: [$i] }, $$scope: { ctx: t } },
    })),
    {
      c() {
        U(e.$$.fragment);
      },
      m(r, i) {
        (F(e, r, i), (n = !0));
      },
      p(r, i) {
        const o = {};
        ((i[0] & 16383) | (i[1] & 4) && (o.$$scope = { dirty: i, ctx: r }), e.$set(o));
      },
      i(r) {
        n || ($(e.$$.fragment, r), (n = !0));
      },
      o(r) {
        (I(e.$$.fragment, r), (n = !1));
      },
      d(r) {
        L(e, r);
      },
    }
  );
}
const ft = 0,
  dt = 100,
  pt = 0,
  ht = 100,
  vt = 0,
  mt = 15;
function Ti(t, e, n) {
  let r,
    i,
    o,
    s,
    u,
    l,
    a = null,
    c = null,
    f = null,
    h = { brightness: !1, contrast: !1, sharpness: !1 },
    v = !0,
    y,
    b = '',
    g = '',
    S = '';
  function P(_, H, D) {
    if (h[_] || H === null) return !0;
    const z = {
        brightness: { min: ft, max: dt },
        contrast: { min: pt, max: ht },
        sharpness: { min: vt, max: mt },
      },
      { min: Y, max: ne } = z[_];
    return D === 'up' ? H >= ne : H <= Y;
  }
  function k(_, H, D, z) {
    return async Y => {
      if (!P(_, H, Y)) {
        n(3, (h = { ...h, [_]: !0 }));
        try {
          D ? await D(Y) : z && H !== null && (await z(Y === 'up' ? H + 1 : H - 1));
        } catch (ne) {
          console.error(`Failed to adjust ${_}:`, ne);
        } finally {
          n(3, (h = { ...h, [_]: !1 }));
        }
      }
    };
  }
  function w(_, H, D, z, Y) {
    return async ne => {
      if (ne.key !== 'Enter') return;
      const T = parseInt(H);
      if (isNaN(T)) return;
      const W = Math.max(D, Math.min(z, T));
      n(3, (h = { ...h, [_]: !0 }));
      try {
        await Y(W);
      } catch (yn) {
        console.error(`Failed to set ${_}:`, yn);
      } finally {
        n(3, (h = { ...h, [_]: !1 }));
      }
    };
  }
  async function j(_) {
    await k('brightness', a, Mr)(_);
  }
  async function O(_) {
    await k('contrast', c, async () => {}, Ct)(_);
  }
  async function Z(_) {
    await k('sharpness', f, async () => {}, jt)(_);
  }
  async function Be(_) {
    await w('brightness', b, ft, dt, Rr)(_);
  }
  async function Q(_) {
    await w('contrast', g, pt, ht, Ct)(_);
  }
  async function pe(_) {
    await w('sharpness', S, vt, mt, jt)(_);
  }
  (Me(() => {
    y = Hr.subscribe(_ => {
      (_.brightness !== null && n(0, (a = _.brightness)),
        _.contrast !== null && n(1, (c = _.contrast)),
        _.sharpness !== null && n(2, (f = _.sharpness)),
        n(4, (v = !1)));
    });
  }),
    Re(() => {
      y && y.unsubscribe();
    }));
  const Ke = () => j('up');
  function J() {
    ((b = ge(this.value)), n(5, b), n(0, a));
  }
  const ee = () => j('down'),
    he = () => O('up');
  function He() {
    ((g = ge(this.value)), n(6, g), n(1, c));
  }
  const te = () => O('down'),
    R = () => Z('up');
  function ve() {
    ((S = ge(this.value)), n(7, S), n(2, f));
  }
  const Ve = () => Z('down');
  return (
    (t.$$.update = () => {
      (t.$$.dirty[0] & 1 && a !== null && n(5, (b = a.toString())),
        t.$$.dirty[0] & 2 && c !== null && n(6, (g = c.toString())),
        t.$$.dirty[0] & 4 && f !== null && n(7, (S = f.toString())),
        t.$$.dirty[0] & 1 && n(13, (r = P('brightness', a, 'up'))),
        t.$$.dirty[0] & 1 && n(12, (i = P('brightness', a, 'down'))),
        t.$$.dirty[0] & 2 && n(11, (o = P('contrast', c, 'up'))),
        t.$$.dirty[0] & 2 && n(10, (s = P('contrast', c, 'down'))),
        t.$$.dirty[0] & 4 && n(9, (u = P('sharpness', f, 'up'))),
        t.$$.dirty[0] & 4 && n(8, (l = P('sharpness', f, 'down'))));
    }),
    [a, c, f, h, v, b, g, S, l, u, s, o, i, r, j, O, Z, Be, Q, pe, Ke, J, ee, he, He, te, R, ve, Ve]
  );
}
class Ei extends se {
  constructor(e) {
    (super(), oe(this, e, Ti, Ii, ie, {}, null, [-1, -1]));
  }
}
const ki = '/assets/projector-Ct7V1zCv.webp',
  Ni = '/assets/benq-logo-DrgvK_o3.svg';
function Ai(t) {
  let e, n, r, i, o, s, u, l, a, c, f, h, v, y, b, g, S, P, k, w, j;
  return (
    (u = new vi({})),
    (c = new ni({})),
    (v = new ai({})),
    (S = new wi({})),
    (w = new Ei({})),
    {
      c() {
        ((e = m('section')),
          (n = m('div')),
          (r = m('div')),
          (r.innerHTML = `<img src="${ki}" alt="BenQ TK700 Projector" class="projector-image svelte-10vix8n"/> <div class="header-text svelte-10vix8n"><img src="${Ni}" alt="BenQ Logo" class="benq-logo svelte-10vix8n"/> <h1 class="title is-4 dashboard-title svelte-10vix8n">TK700 Control Dashboard</h1></div>`),
          (i = N()),
          (o = m('div')),
          (s = m('div')),
          U(u.$$.fragment),
          (l = N()),
          (a = m('div')),
          U(c.$$.fragment),
          (f = N()),
          (h = m('div')),
          U(v.$$.fragment),
          (y = N()),
          (b = m('div')),
          (g = m('div')),
          U(S.$$.fragment),
          (P = N()),
          (k = m('div')),
          U(w.$$.fragment),
          d(r, 'class', 'header-section svelte-10vix8n'),
          d(s, 'class', 'column is-4 widget-column svelte-10vix8n'),
          d(a, 'class', 'column is-4 widget-column svelte-10vix8n'),
          d(h, 'class', 'column is-4 widget-column svelte-10vix8n'),
          d(o, 'class', 'columns is-multiline widget-row svelte-10vix8n'),
          d(g, 'class', 'column is-6 widget-column svelte-10vix8n'),
          d(k, 'class', 'column is-6 widget-column svelte-10vix8n'),
          d(b, 'class', 'columns is-multiline widget-row svelte-10vix8n'),
          d(n, 'class', 'container'),
          d(e, 'class', 'section'));
      },
      m(O, Z) {
        (x(O, e, Z),
          p(e, n),
          p(n, r),
          p(n, i),
          p(n, o),
          p(o, s),
          F(u, s, null),
          p(o, l),
          p(o, a),
          F(c, a, null),
          p(o, f),
          p(o, h),
          F(v, h, null),
          p(n, y),
          p(n, b),
          p(b, g),
          F(S, g, null),
          p(b, P),
          p(b, k),
          F(w, k, null),
          (j = !0));
      },
      p: E,
      i(O) {
        j ||
          ($(u.$$.fragment, O),
          $(c.$$.fragment, O),
          $(v.$$.fragment, O),
          $(S.$$.fragment, O),
          $(w.$$.fragment, O),
          (j = !0));
      },
      o(O) {
        (I(u.$$.fragment, O),
          I(c.$$.fragment, O),
          I(v.$$.fragment, O),
          I(S.$$.fragment, O),
          I(w.$$.fragment, O),
          (j = !1));
      },
      d(O) {
        (O && M(e), L(u), L(c), L(v), L(S), L(w));
      },
    }
  );
}
class Pi extends se {
  constructor(e) {
    (super(), oe(this, e, null, Ai, ie, {}));
  }
}
new Pi({ target: document.getElementById('app') });
