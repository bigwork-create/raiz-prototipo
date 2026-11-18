/* Raiz — prototipo PWA clicable (es-PE). Sin backend; OTP de prueba en pantalla. */
(function () {
  const S = () => window.RaizStore;
  const app = document.getElementById("app");
  const toastEl = document.getElementById("toast");

  let route = { name: "bienvenida", params: {} };
  let flow = {}; /* phone, otpId, purpose, demoCode, expiresAt, passwordMode */
  let draft = { realName: "", dniFront: null, dniBack: null, selfie: null, step: 1 };
  let ui = { perfilTab: "real", inicioTab: "descubrir", chatMenu: false, search: "", installHint: true, pass1: "", pass2: "", show1: false, show2: false, recording: false, recAt: 0, calling: false, membersOpen: false, playingVoice: null, replyTo: null, msgMenu: null, lastChatId: null, forwardFrom: null, memberMenu: null, groupEdit: false, rejectVerif: null, rejectDraft: "", sanctionFor: null, sanctionType: "advertencia", sanctionDays: 7, sanctionNote: "", reportDraft: null };

  const I = {
    sprout: '<svg class="sprout sprout--sm" viewBox="0 0 48 48" fill="currentColor" aria-hidden="true"><use href="#i-sprout"></use></svg>',
    sproutLg: '<svg class="sprout" viewBox="0 0 48 48" fill="currentColor" aria-hidden="true"><use href="#i-sprout"></use></svg>',
  };

  function ico(name, sz) {
    sz = sz || 22;
    const d = {
      back: '<path d="M15 18H3M3 18l6-6M3 18l6 6"/>',
      phone: '<path d="M6 3h5l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v5a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z"/>',
      lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
      unlock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0"/>',
      eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
      eyeoff: '<path d="M3 3l18 18M10.6 10.6A3 3 0 0 0 13.4 13.4M6.7 6.8C4.2 8.3 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1M17.3 15.2C19.8 13.7 22 12 22 12s-3.5-7-10-7c-.6 0-1.1 0-1.7.1"/>',
      info: '<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/>',
      shield: '<path d="M12 3l8 3v6c0 5-3.4 8.4-8 9-4.6-.6-8-4-8-9V6l8-3z"/>',
      check: '<path d="M5 12l4 4 10-10"/>',
      checkc: '<circle cx="12" cy="12" r="9"/><path d="M8 12l2.5 2.5L16 9"/>',
      x: '<path d="M6 6l12 12M18 6L6 18"/>',
      search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
      home: '<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z"/>',
      community: '<path d="M16 11a3 3 0 1 0-2-5.8"/><circle cx="9" cy="8" r="3"/><path d="M3 19c0-2.8 2.7-5 6-5s6 2.2 6 5"/><path d="M16 14c3 0 5.5 2 5.5 4.5"/>',
      msg: '<path d="M4 6h16v10H7l-3 3V6z"/>',
      roots: '<path d="M12 3c2 4 6 7 8 12-4-1-6-1-8 1-2-2-4-2-8-1 2-5 6-8 8-12z"/><path d="M12 16v5"/>',
      user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 19c1.5-3 4-4.5 7-4.5S17.5 16 19 19"/>',
      gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M5 5l1.5 1.5M17.5 17.5 19 19M3 12h2M19 12h2M5 19l1.5-1.5M17.5 6.5 19 5"/>',
      cam: '<path d="M4 8h3l2-2h6l2 2h3v12H4z"/><circle cx="12" cy="13" r="4"/>',
      plus: '<path d="M12 5v14M5 12h14"/>',
      send: '<path d="M4 12l16-8-6 16-2-6-8-2z"/>',
      clip: '<path d="M21 12.5V8a5 5 0 0 0-10 0v10a3.5 3.5 0 0 0 7 0V9"/>',
      mic: '<path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
      play: '<path d="M8 5l12 7-12 7V5z" fill="currentColor" stroke="none"/>',
      pause: '<path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor" stroke="none"/>',
      call: '<path d="M6 3h5l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v5a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z"/>',
      hang: '<path d="M4 10c4-3 12-3 16 0l-2 3c-3-2-9-2-12 0L4 10z"/>',
      file: '<path d="M8 4h6l4 4v12H8z"/><path d="M14 4v4h4"/>',
      dots: '<circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none"/>',
      crown: '<path d="M4 16l2-8 6 5 6-5 2 8H4z"/><path d="M4 16h16v2H4z"/>',
      pencil: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13 7l4 4"/>',
      chev: '<path d="M9 6l6 6-6 6"/>',
      chevL: '<path d="M15 6l-6 6 6 6"/>',
      refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v5h-5"/>',
      qr: '<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h3v3h-3zM20 20h-3v-3"/>',
      block: '<circle cx="12" cy="12" r="9"/><path d="M6 6l12 12"/>',
      flag: '<path d="M5 21V4h9l-1 4h6l-2 5H5"/>',
      gift: '<rect x="3" y="10" width="18" height="10" rx="1"/><path d="M12 10v10M3 10h18M12 10C10 7 7 7 6 9c2 0 4 1 6 1M12 10c2-3 5-3 6-1-2 0-4 1-6 1"/>',
      plane: '<path d="M4 12l16-8-6 16-2-6-8-2z"/>',
      fileplus: '<path d="M8 4h6l4 4v12H8z"/><path d="M14 4v4h4"/><path d="M12 11v6M9 14h6"/>',
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      video: '<path d="M14 8v8H3V8h11z"/><path d="M16 10l5-3v10l-5-3z"/>',
      bell: '<path d="M6 16v-5a6 6 0 1 1 12 0v5l2 2H4l2-2z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
      volume: '<path d="M4 10v4h4l5 4V6L8 10H4z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M18.5 7a7 7 0 0 1 0 10"/>',
      volumeoff: '<path d="M4 10v4h4l5 4V6L8 10H4z"/><path d="M20 8l-6 8M14 8l6 8"/>',
      reply: '<path d="M9 17l-5-5 5-5"/><path d="M4 12h10a6 6 0 0 1 6 6"/>',
      smile: '<circle cx="12" cy="12" r="9"/><path d="M8 10h.01M16 10h.01M8.5 14.5a4.5 4.5 0 0 0 7 0"/>',
    };
    return '<svg width="' + sz + '" height="' + sz + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (d[name] || "") + "</svg>";
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => { toastEl.hidden = true; }, 2600);
  }

  function wave() {
    return '<div class="wave" aria-hidden="true"><svg viewBox="0 0 390 160" preserveAspectRatio="none"><path d="M0 80C70 130 130 40 200 80C270 120 330 90 390 50V160H0Z" fill="#E8F3FE"/><path d="M0 110C80 70 140 140 220 100C300 60 350 100 390 90V160H0Z" fill="#F0F7FF"/></svg></div>';
  }

  function me() { return S().currentUser(); }
  function prof(uid) { return S().profileOf(uid || (me() && me().id)); }
  function tag(p) { return p ? p.nickname + "#" + p.discriminator : ""; }

  function go(name, params, opts) {
    params = params || {};
    const who = me();
    if (String(name).indexOf("admin") === 0 && !S().isPlatformAdmin(who)) {
      name = who ? S().postLoginRoute(who) : "login";
    }
    const community = { inicio:1, comunidad:1, mensajes:1, raices:1, chat:1, "crear-grupo":1, qr:1, escanear:1, planes:1, pago:1, instalar:1 };
    if (who && !S().canUseCommunity(who) && community[name]) {
      name = S().postLoginRoute(who);
    }
    route = { name: name, params: params };
    const q = params.tab ? "?tab=" + encodeURIComponent(params.tab) : "";
    const id = params.id ? "/" + params.id : "";
    const hash = "#/" + name + id + q;
    if (opts && opts.replace) history.replaceState(route, "", hash);
    else if (location.hash !== hash) history.pushState(route, "", hash);
    render();
    window.scrollTo(0, 0);
  }

  function authFallback() {
    return '<div class="auth"><div class="auth-inner"><p class="center">Necesitas iniciar sesión.</p></div></div>';
  }

  function parseHash() {
    const h = (location.hash || "#/bienvenida").replace(/^#/, "");
    const [path, qs] = h.split("?");
    const parts = path.replace(/^\//, "").split("/").filter(Boolean);
    const name = parts[0] || "bienvenida";
    const params = {};
    if (parts[1]) params.id = parts[1];
    if (qs) new URLSearchParams(qs).forEach((v, k) => { params[k] = v; });
    route = { name: name, params: params };
  }

  /* ---------- auth UI pieces ---------- */
  function logoStack(navy) {
    return '<div class="logo-stack">' + I.sproutLg + '<div class="wordmark' + (navy ? " wordmark--navy" : "") + '">Raiz</div></div>';
  }
  function logoRow() {
    return '<div class="logo-row">' + I.sproutLg + '<div class="wordmark">Raiz</div></div>';
  }
  function backBtn(to) {
    return '<button class="back-fab" type="button" data-go="' + (to || "bienvenida") + '" aria-label="Volver">' + ico("back", 20) + "</button>";
  }
  function phoneBox(val, ph, id) {
    id = id || "phone";
    return '<div class="phone-box"><div class="prefix">+51 <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></div><input id="' + id + '" type="tel" inputmode="numeric" autocomplete="tel" maxlength="11" placeholder="' + esc(ph || "9XX XXX XXX") + '" value="' + esc(val || "") + '"></div>';
  }

  function authShell(inner, opts) {
    opts = opts || {};
    const cls = "auth" + (opts.white ? " auth--white" : "");
    return '<div class="' + cls + '">' + (opts.wave !== false ? wave() : "") + '<div class="auth-inner">' + inner + "</div></div>";
  }

  /* ---------- views ---------- */
  const views = {};

  views.bienvenida = function () {
    return authShell(
      logoStack() +
        '<h1 class="h1 auth-title">Tu comunidad,<br>con raíces reales.</h1>' +
        '<p class="lead auth-lead">Entra con tu número de celular. La verificación de identidad mantiene la red segura.</p>' +
        '<button class="btn btn-primary" data-go="registro">Crear cuenta</button>' +
        '<button class="btn btn-ghost mt-12" data-go="login">Ya tengo cuenta</button>' +
        '<div class="link-row"><a href="#/qr-entrada">Tengo un código QR de invitación</a></div>' +
        '<div class="link-row"><button type="button" data-act="explorar" style="color:var(--blue);font-weight:700;font-size:14px">Explorar el prototipo</button></div>' +
        '<div class="lock-note">' + ico("lock", 16) + '<span>Si perdiste tu número, <a href="#/perdi-numero">contacta a la administración</a>.</span></div>'
    );
  };

  views["qr-entrada"] = function () {
    return authShell(
      '<div class="auth-top">' + backBtn("bienvenida") + "</div>" +
        logoRow() +
        '<h1 class="h1 auth-title">Entrar con invitación</h1>' +
        '<p class="lead auth-lead">Escanea el QR o escribe el código que te compartieron.</p>' +
        '<div class="scanner" data-act="noop"><div class="view"></div><div class="hint">Cámara (prototipo)</div></div>' +
        '<div class="field"><label>Código de invitación</label><div class="box"><input id="invcode" placeholder="RAIZ-XXXX" style="text-transform:uppercase;letter-spacing:.08em;font-weight:700"></div></div>' +
        '<button class="btn btn-primary" data-act="usar-invite">Continuar</button>' +
        '<p class="small center mt-16">El acceso a Raiz es por invitación.</p>'
    );
  };

  function stepperReg(step) {
    return '<div class="step-meta">Paso ' + step + ' de 3</div>' +
      '<div class="stepper" aria-hidden="true">' +
      '<span class="dot' + (step >= 1 ? " on" : "") + '"></span><span class="bar' + (step >= 2 ? " on" : "") + '"></span>' +
      '<span class="dot' + (step >= 2 ? " on" : "") + '"></span><span class="bar' + (step >= 3 ? " on" : "") + '"></span>' +
      '<span class="dot' + (step >= 3 ? " on" : "") + '"></span></div>';
  }

  views.registro = function () {
    const local = (flow.phone && flow.phone.replace("+51", "")) || "";
    return authShell(
      logoStack() +
        '<h1 class="h1 auth-title">Regístrate</h1>' +
        stepperReg(1) +
        '<p class="label">Ingresa tu número de celular</p>' +
        '<p class="small mb-8" style="margin-top:-4px;margin-bottom:14px">Te enviaremos un código de verificación.</p>' +
        phoneBox(local, "9XX XXX XXX", "phone") +
        '<button class="btn btn-primary mt-16" data-act="enviar-otp-registro">Enviar código</button>' +
        '<p class="auth-switch">¿Ya tienes cuenta? <a href="#/login">Inicia sesión</a></p>' +
        '<div class="lock-note">' + ico("lock", 16) + "<span>Tu número está seguro y solo se usa para verificar tu cuenta.</span></div>"
    );
  };

  function otpView(title, lead) {
    const left = Math.max(0, (flow.expiresAt || 0) - Date.now());
    const mm = String(Math.floor(left / 60000)).padStart(2, "0");
    const ss = String(Math.floor((left % 60000) / 1000)).padStart(2, "0");
    const digits = (flow.otpInput || "").padEnd(6, " ").slice(0, 6).split("");
    return authShell(
      '<div class="auth-top">' + backBtn(flow.purpose === "reset" ? "olvide" : "registro") + "</div>" +
        '<div class="logo-stack" style="margin-top:0"><div class="wordmark">Raiz</div></div>' +
        '<p class="center" style="color:var(--muted);margin-top:-8px">Crea tu cuenta</p>' +
        '<div style="width:36px;height:3px;background:var(--blue);border-radius:2px;margin:8px auto 22px"></div>' +
        '<p class="lead auth-lead">' + (lead || "Ingresa el código de verificación enviado a tu celular.") + "</p>" +
        '<div class="otp-phone">' + ico("phone", 18) + "<span>" + esc(S().maskPhone(flow.phone)) + "</span></div>" +
        (flow.demoCode ? '<div class="demo-code">Prototipo · código de prueba: <b>' + esc(flow.demoCode) + "</b></div>" : "") +
        '<div class="otp-lab">Código de verificación</div>' +
        '<div class="otp-row" id="otp-row">' +
        [0, 1, 2, 3, 4, 5].map(function (i) {
          const v = (flow.otpInput || "")[i] || "";
          return '<input data-otp="' + i + '" maxlength="1" inputmode="numeric" value="' + esc(v) + '">';
        }).join("") +
        "</div>" +
        '<div class="otp-timer">El código expira en <b id="otp-cd">' + mm + ":" + ss + "</b></div>" +
        '<button class="resend" type="button" data-act="reenviar-otp" ' + (left > 0 && (flow.resendWait || 0) > Date.now() ? "disabled" : "") + ">" + ico("refresh", 18) + " Reenviar código</button>",
      { white: true }
    );
  }

  views.otp = function () {
    return otpView();
  };

  function strength(p) {
    const c8 = p.length >= 8;
    const cu = /[A-ZÁÉÍÓÚÑ]/.test(p);
    const cn = /[0-9]/.test(p) || /[^A-Za-zÁÉÍÓÚáéíóúÑñ0-9]/.test(p);
    const n = (c8 ? 1 : 0) + (cu ? 1 : 0) + (cn ? 1 : 0);
    let lvl = "", label = "—";
    if (p && n <= 1) { lvl = "weak"; label = "Baja"; }
    else if (n === 2) { lvl = "media"; label = "Media"; }
    else if (n === 3 && p.length >= 8) { lvl = "strong"; label = p.length >= 12 ? "Alta" : "Media"; if (p.length >= 10 && cu && c8 && cn) { lvl = "strong"; label = "Alta"; } }
    if (n === 3 && p.length >= 8 && p.length < 10) { lvl = "media"; label = "Media"; }
    return { c8: c8, cu: cu, cn: cn, lvl: lvl, label: label, ok: c8 && cu && cn };
  }

  function passView(mode) {
    /* mode: register | reset */
    const p1 = ui.pass1 || "";
    const p2 = ui.pass2 || "";
    const st = strength(p1);
    const title = mode === "reset" ? "Nueva contraseña" : "Configura tu contraseña";
    const lead = mode === "reset" ? "Elige una contraseña segura para tu cuenta." : "Crea una contraseña segura para proteger tu cuenta.";
    const cta = mode === "reset" ? "Guardar contraseña" : "Crear cuenta";
    function box(id, label, val, show) {
      return '<div class="pass-box" style="margin-bottom:12px">' +
        '<span class="icon-l">' + ico("lock", 20) + "</span>" +
        '<div class="float-lab"><span>' + label + '</span><input id="' + id + '" type="' + (show ? "text" : "password") + '" value="' + esc(val) + '" autocomplete="new-password"></div>' +
        '<button class="icon-btn" type="button" data-act="toggle-pass" data-which="' + id + '" aria-label="Mostrar u ocultar">' + ico(show ? "eyeoff" : "eye", 20) + "</button></div>";
    }
    return authShell(
      logoStack(true) +
        '<h1 class="h1 auth-title">' + title + "</h1>" +
        '<p class="lead auth-lead">' + lead + "</p>" +
        box("pass1", "Nueva contraseña", p1, ui.show1) +
        box("pass2", "Confirmar contraseña", p2, ui.show2) +
        '<div class="strength"><div class="strength-top"><span>Fortaleza de la contraseña</span><b class="' + st.lvl + '">' + st.label + "</b></div>" +
        '<div class="bar-track"><div class="bar-fill ' + st.lvl + '"></div></div></div>' +
        '<div class="checks">' +
        '<div class="check' + (st.c8 ? " on" : "") + '"><span class="ci">' + ico("check", 12) + "</span> Al menos 8 caracteres</div>" +
        '<div class="check' + (st.cu ? " on" : "") + '"><span class="ci">' + ico("check", 12) + "</span> Una letra mayúscula</div>" +
        '<div class="check' + (st.cn ? " on" : "") + '"><span class="ci">' + ico("check", 12) + "</span> Un número o carácter especial</div>" +
        "</div>" +
        '<button class="btn btn-primary" data-act="crear-cuenta" ' + (st.ok && p1 === p2 ? "" : "disabled") + ">" + cta + "</button>" +
        '<div class="lock-note">' + ico("shield", 16) + "<span>Tus datos están seguros con Raiz</span></div>"
    );
  }

  views.contrasena = function () { return passView("register"); };
  views["nueva-contrasena"] = function () { return passView("reset"); };

  views.login = function () {
    const local = (flow.phone && flow.phone.replace("+51", "")) || "";
    return authShell(
      logoRow() +
        '<h1 class="h1 auth-title">Ingresa a Raiz</h1>' +
        '<p class="lead auth-lead">Bienvenido de nuevo</p>' +
        '<div class="field"><label>Número de teléfono</label>' + phoneBox(local, "Ingresa tu número", "phone") + "</div>" +
        '<div class="field"><label>Contraseña</label><div class="pass-box"><input id="pass" type="' + (ui.show1 ? "text" : "password") + '" placeholder="Ingresa tu contraseña" autocomplete="current-password"><button class="icon-btn" type="button" data-act="toggle-pass" data-which="pass">' + ico(ui.show1 ? "eyeoff" : "eye", 20) + "</button></div></div>" +
        '<button class="btn btn-primary mt-8" data-act="ingresar">Ingresar</button>' +
        '<div class="link-row"><a href="#/olvide">¿Olvidaste tu contraseña?</a></div>' +
        '<p class="auth-switch">¿No tienes cuenta? <a href="#/registro">Regístrate</a></p>'
    );
  };

  views.olvide = function () {
    const shown = flow.phone ? S().formatPhone(flow.phone).replace("+51 ", "") : "";
    return authShell(
      '<div class="auth-top">' + backBtn("login") + "</div>" +
        logoStack(true) +
        '<h1 class="h1 auth-title">¿Olvidaste tu contraseña?</h1>' +
        '<p class="lead auth-lead">Te enviaremos un código para cambiar tu contraseña.</p>' +
        '<div class="pass-box" style="margin-bottom:16px"><span class="icon-l">' + ico("phone", 20) + '</span><div class="float-lab"><span>Número de teléfono</span><input id="phone" type="tel" inputmode="numeric" placeholder="9XX XXX XXX" value="' + esc(shown) + '"></div><span class="icon-r">' + ico("info", 18) + "</span></div>" +
        '<button class="btn btn-primary" data-act="enviar-otp-reset">Enviar código</button>' +
        '<div class="shield-note">' + ico("shield", 22) + "<span>Asegúrate de ingresar el número asociado a tu cuenta Raiz.</span></div>" +
        '<div class="link-row mt-24"><a href="#/perdi-numero">Perdí mi número de celular</a></div>'
    );
  };

  views["olvide-otp"] = function () {
    return otpView("Verifica tu número", "Ingresa el código de verificación enviado a tu celular.");
  };

  views["perdi-numero"] = function () {
    return authShell(
      '<div class="auth-top">' + backBtn("login") + "</div>" +
        logoRow() +
        '<h1 class="h1 auth-title">Perdí mi número</h1>' +
        '<p class="lead auth-lead">Sin el celular registrado no se puede recuperar la cuenta por SMS. Un administrador verificará tu identidad con tu foto y DNI.</p>' +
        '<div class="card"><p class="small">Escríbenos por el canal de soporte de la comunidad o pide a un miembro que avise a la administración. Ten a la mano:</p><ul class="small mt-12" style="padding-left:18px;line-height:1.6"><li>Tu nombre completo</li><li>El número que perdiste</li><li>El número nuevo</li><li>Una selfie reciente y foto de tu DNI</li></ul></div>' +
        '<div class="field"><label>Nombre completo</label><div class="box"><input id="rn" placeholder="Como aparece en tu DNI"></div></div>' +
        '<div class="field"><label>Número que perdiste</label>' + phoneBox("", "9XX XXX XXX", "oldp") + "</div>" +
        '<div class="field"><label>Número nuevo</label>' + phoneBox("", "9XX XXX XXX", "newp") + "</div>" +
        '<button class="btn btn-primary" data-act="enviar-recuperacion">Enviar solicitud</button>' +
        '<p class="tiny center mt-16">No hay códigos de recuperación ni correo. Solo revisión manual.</p>'
    );
  };

  /* verificación */
  function verifShell(step, body) {
    const labs = [
      { t: "Datos personales", s: ["Pendiente", "En progreso", "Completado", "Completado"] },
      { t: "Verificar identidad", s: ["Pendiente", "Pendiente", "En progreso", "Completado"] },
      { t: "Confirmación", s: ["Pendiente", "Pendiente", "Pendiente", "En progreso"] },
    ];
    const st = function (i) {
      if (i < step) return "done";
      if (i === step) return "on";
      return "";
    };
    const stLabel = function (i) {
      if (i < step) return "Completado";
      if (i === step) return "En progreso";
      return "Pendiente";
    };
    return '<div class="verif">' +
      '<div class="verif-brand">' + I.sprout + '<div class="wordmark" style="font-size:22px">Raiz</div></div>' +
      '<div class="verif-head">' + backBtn(step === 1 ? (me() ? "ajustes" : "bienvenida") : "verificacion") +
      "<h1>Verificación de identidad</h1><span></span></div>" +
      '<div class="verif-stepn">Paso ' + step + " de 3</div>" +
      '<div class="lstep"><div class="progress s' + step + '"></div>' +
      [1, 2, 3].map(function (i) {
        const lab = labs[i - 1].t;
        const cls = st(i);
        const inner = cls === "done" ? ico("check", 16) : String(i);
        return '<div class="ls ' + cls + '"><div class="bubble">' + inner + "</div><div class=\"lab\">" + lab + "</div><div class=\"st\">" + stLabel(i) + "</div></div>";
      }).join("") +
      "</div>" + body + "</div>";
  }

  views.verificacion = function () {
    const step = Number(route.params.step || draft.step || 1);
    draft.step = step;
    if (step === 2) return verifStep2();
    if (step === 3) return verifStep3();
    const name = draft.realName || (me() && me().realName) || "";
    return verifShell(1,
      '<h2 class="block">Datos personales</h2>' +
      '<p class="hint">Escribe tu nombre completo tal como aparece en tu DNI o carnet. Quedará bloqueado al continuar.</p>' +
      '<div class="field"><label>Nombre completo</label><div class="box">' + ico("user", 18) + '<input id="realname" placeholder="Nombre y apellidos" value="' + esc(name) + '"></div></div>' +
      '<button class="btn btn-primary mt-16" data-act="verif-paso1">Continuar</button>' +
      '<div class="lock-note">' + ico("shield", 16) + "<span>Tus datos están cifrados y seguros</span></div>"
    );
  };

  function verifStep2() {
    const name = draft.realName || (me() && me().realName) || "";
    return verifShell(2,
      '<h2 class="block">Sube tu DNI</h2>' +
      '<p class="hint">Sube una foto clara de tu DNI o carnet (frente y reverso). Solo visible para la administración.</p>' +
      '<div class="dni-slots">' +
        '<label class="dni-slot' + (draft.dniFront ? " on" : "") + '">' + (draft.dniFront ? '<img src="' + esc(draft.dniFront) + '" alt="Frente">' : (ico("fileplus", 22) + "<span>Frente</span>")) + '<input id="dniF" type="file" accept="image/*,.pdf" hidden></label>' +
        '<label class="dni-slot' + (draft.dniBack ? " on" : "") + '">' + (draft.dniBack ? '<img src="' + esc(draft.dniBack) + '" alt="Reverso">' : (ico("fileplus", 22) + "<span>Reverso</span>")) + '<input id="dniB" type="file" accept="image/*,.pdf" hidden></label>' +
      "</div>" +
      '<p class="tiny" style="margin-top:-8px;margin-bottom:16px">JPG, PNG o PDF hasta 10 MB.</p>' +
      '<h2 class="block">Tómate una selfie</h2>' +
      '<p class="hint">Coloca tu rostro en el recuadro y asegúrate de que se vean tus ojos.</p>' +
      '<div class="selfie-frame">' +
        (draft.selfie ? '<img src="' + esc(draft.selfie) + '" alt="Selfie">' : '<div style="position:absolute;inset:0;background:linear-gradient(180deg,#9aa8b6,#c5ced6)"></div>') +
        '<div class="corners"><i></i></div><div class="oval-guide"></div>' +
        '<button class="shutter" type="button" data-act="selfie" aria-label="Capturar selfie"></button>' +
        '<input id="selfieFile" type="file" accept="image/*" capture="user" hidden>' +
      "</div>" +
      '<div class="locked-name">' + ico("lock", 18) + '<div class="grow"><div class="lab">Nombre completo (verificado)</div><div class="val">' + esc(name || "—") + "</div></div>" + ico("lock", 18) + "</div>" +
      '<button class="btn btn-primary" data-act="verif-paso2">Continuar</button>' +
      '<div class="lock-note">' + ico("shield", 16) + "<span>Tus datos están cifrados y seguros</span></div>"
    );
  }

  function verifStep3() {
    const name = draft.realName || "";
    return verifShell(3,
      '<h2 class="block">Confirmación</h2>' +
      '<p class="hint">Revisa que todo se vea nítido. Al enviar, el nombre y la foto de rostro quedan permanentes.</p>' +
      '<div class="confirm-list">' +
        '<div class="rowish"><div class="grow"><div class="tiny">Nombre real</div><b>' + esc(name) + "</b></div>" + ico("lock", 18) + "</div>" +
        '<div class="rowish">' + (draft.dniFront ? '<img src="' + esc(draft.dniFront) + '" alt="DNI frente">' : "") + (draft.dniBack ? '<img src="' + esc(draft.dniBack) + '" alt="DNI reverso">' : "") + '<div class="grow"><div class="tiny">DNI / carnet</div><b>Frente y reverso</b><div class="tiny">Solo visible para Hubert</div></div></div>' +
        '<div class="rowish">' + (draft.selfie ? '<img class="face" src="' + esc(draft.selfie) + '" alt="Selfie">' : "") + '<div class="grow"><div class="tiny">Foto de rostro</div><b>Selfie</b><div class="tiny">Permanente y para verificación</div></div></div>' +
      "</div>" +
      '<button class="btn btn-primary" data-act="enviar-verificacion">' + ico("plane", 18) + " Enviar para verificación</button>" +
      '<div class="lock-note">' + ico("shield", 16) + "<span>Tus datos están cifrados y seguros</span></div>"
    );
  }

  function limitedShell(body) {
    app.classList.remove("wide");
    return '<div class="limited-shell">' + topbar() + '<div class="page">' + body + "</div></div>";
  }
  function latestVerif(userId) {
    return S().get().identity_verifications.filter(function (v) { return v.userId === userId; }).pop() || null;
  }
  function reasonLabel(id) {
    const r = (S().REPORT_REASONS || []).find(function (x) { return x.id === id; });
    return r ? r.label : (id || "—");
  }

  views.pendiente = function () {
    const u = me();
    if (!u) return authFallback();
    const v = latestVerif(u.id);
    return limitedShell(
      '<div class="limited-banner"><h2>Estamos revisando tu identidad</h2>' +
      '<p class="s">Solo Hubert, titular de Raiz, verifica las cuentas. Mientras tanto únicamente puedes ver tu propio perfil. No hay chat ni descubrimiento.</p></div>' +
      '<div class="card"><div class="card-h"><h3>Tu perfil (solo tú)</h3></div>' +
      '<div class="iden"><img src="' + esc((v && v.facePhoto) || u.facePhoto || "img/avatar-face.png") + '" alt="Tu foto">' +
      '<div class="meta"><div class="name">' + esc(u.realName || "—") + "</div>" +
      '<div class="hint">' + esc(tag(prof(u.id))) + " · " + esc(S().formatPhone(u.phone)) + "</div></div></div>" +
      (v && v.dniNumber ? '<p class="small mt-8">DNI (se conserva cifrado, solo lo ve Hubert): ' + esc(v.dniNumber) + "</p>" : "") +
      (v && v.dniFront ? '<div class="ev-photos"><img src="' + esc(v.dniFront) + '" alt="DNI frente">' +
        (v.dniBack ? '<img src="' + esc(v.dniBack) + '" alt="DNI reverso">' : "") + "</div>" : "") +
      '<p class="tiny">El nombre real y la foto de rostro serán permanentes cuando se apruebe.</p></div>' +
      '<button class="btn btn-ghost mt-12" data-act="simular-aprobacion">Simular aprobación (prototipo)</button>' +
      '<div class="link-row"><button type="button" data-act="salir" style="color:var(--muted);font-weight:600">Cerrar sesión</button></div>'
    );
  };

  views.rechazado = function () {
    const u = me();
    const v = u ? latestVerif(u.id) : null;
    const reason = (v && v.reason) || "Revisa que las fotos se vean nítidas y que el nombre coincida con tu documento.";
    return limitedShell(
      '<div class="limited-banner"><h2>No pudimos verificar tu identidad</h2>' +
      '<p class="s">Te avisamos con el motivo. Puedes volver a enviar tu DNI y tu selfie.</p></div>' +
      '<div class="card"><b>Motivo</b><p class="small mt-8">' + esc(reason) + "</p></div>" +
      '<button class="btn btn-primary mt-16" data-go="verificacion">Volver a enviar</button>' +
      '<div class="link-row"><button type="button" data-act="salir">Cerrar sesión</button></div>'
    );
  };

  function sanctionScreen(title, lead) {
    const u = me();
    const s = u && u.sanction;
    const until = s && s.until ? " Hasta el " + new Date(s.until).toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" }) + "." : "";
    return authShell(
      logoRow() +
        '<h1 class="h1 auth-title">' + esc(title) + "</h1>" +
        '<p class="lead auth-lead">' + esc(lead) + until + "</p>" +
        (s && s.reason ? '<div class="card"><b>Motivo</b><p class="small mt-8">' + esc(s.reason) + "</p></div>" : "") +
        '<div class="field mt-16"><label>Apelar (texto libre)</label><div class="box"><textarea id="apelatext" rows="3" placeholder="Cuéntale a Hubert por qué debería revisarse esta medida."></textarea></div></div>' +
        '<button class="btn btn-primary" data-act="enviar-apelacion">Enviar apelación</button>' +
        '<button class="btn btn-ghost mt-12" data-act="salir">Cerrar sesión</button>'
    );
  }
  views.suspendido = function () {
    return sanctionScreen("Cuenta suspendida", "Esta cuenta no puede usar Raiz por ahora.");
  };
  views.expulsado = function () {
    return sanctionScreen("Cuenta expulsada", "Esta cuenta fue expulsada de Raiz.");
  };
  views.silenciado = function () {
    return sanctionScreen("Cuenta silenciada", "Tu perfil está oculto hasta que Hubert revise el caso. No puedes escribir en los chats.");
  };


  function unreadTotal() {
    const u = me();
    if (!u) return 0;
    const db = S().get();
    let n = 0;
    db.conversations.forEach(function (c) {
      if (c.memberIds.indexOf(u.id) === -1) return;
      n += db.messages.filter(function (m) {
        return m.conversationId === c.id && m.fromId !== u.id && !m.read;
      }).length;
    });
    return n;
  }

  function tabbar(active) {
    const n = unreadTotal();
    const tabs = [
      ["inicio", "home", "Inicio"],
      ["comunidad", "community", "Comunidad"],
      ["mensajes", "msg", "Mensajes"],
      ["raices", "roots", "Raíces"],
      ["perfil", "user", "Perfil"]
    ];
    return '<nav class="tabbar" role="navigation" aria-label="Principal">' +
      tabs.map(function (t) {
        const on = t[0] === active ? " on" : "";
        const badge = t[0] === "mensajes" && n ? '<span class="badge">' + n + "</span>" : "";
        return '<button class="tab' + on + '" type="button" data-go="' + t[0] + '">' +
          ico(t[1], 22) + badge + "<span>" + t[2] + "</span></button>";
      }).join("") + "</nav>";
  }

  function topbar(extraRight) {
    return '<header class="topbar"><div class="brand">' + I.sprout +
      '<div class="wordmark">Raiz</div></div><div class="top-actions">' +
      (extraRight || "") +
      '<button class="icon-round" type="button" data-go="ajustes" aria-label="Ajustes">' +
      ico("gear", 20) + "</button></div></header>";
  }

  function installBanner() {
    if (S().get().installBannerDismissed || !ui.installHint) return "";
    return '<div class="install-banner"><div class="grow"><p>Instala Raiz en tu celular</p>' +
      "<span>Funciona como una app, sin tienda.</span></div>" +
      '<button class="btn btn-primary btn-sm" data-go="instalar">Ver cómo</button>' +
      '<button class="icon-round" type="button" data-act="dismiss-install" aria-label="Cerrar">' +
      ico("x", 16) + "</button></div>";
  }

  function shell(active, body, opts) {
    opts = opts || {};
    app.classList.add("wide");
    const meNow = me();
    const silBan = (meNow && meNow.status === "silenciado")
      ? '<div class="limited-banner"><h2>Tu cuenta está silenciada</h2><p class="s">Estás oculto en Descubre y no puedes escribir hasta que Hubert revise el caso. <button type="button" class="btn btn-ghost btn-sm" data-go="silenciado">Apelar</button></p></div>'
      : "";
    return '<div class="shell">' + (opts.top === false ? "" : topbar(opts.topRight)) +
      '<div class="page' + (opts.wide ? " page--wide" : "") + (opts.chat ? " page--chat" : "") + '">' + silBan + body + "</div>" +
      tabbar(active) + reportSheetHtml() + "</div>";
  }

  function reportSheetHtml() {
    if (!ui.reportDraft) return "";
    const d = ui.reportDraft;
    const chips = (S().REPORT_REASONS || []).map(function (r) {
      return '<button type="button" class="tpl-chip' + (d.reason === r.id ? " on" : "") + '" data-act="report-razon" data-id="' + r.id + '">' + esc(r.label) + "</button>";
    }).join("");
    return '<div class="sheet-backdrop" data-act="cerrar-reporte-ui"><div class="sheet" data-act="stop">' +
      '<div class="grab"></div><h3 style="margin:0 0 8px">Reportar ' + (d.type === "message" ? "mensaje" : "usuario") + "</h3>" +
      '<div class="reason-chips">' + chips + "</div>" +
      '<div class="field"><label>' + (d.reason === "otro" ? "Cuéntanos qué pasó" : "Comentario (opcional)") + "</label>" +
      '<div class="box"><textarea id="reportcomment" rows="3" placeholder="Detalle para Hubert…">' + esc(d.comment || "") + "</textarea></div></div>" +
      '<button class="btn btn-primary" data-act="enviar-reporte">Enviar reporte</button>' +
      '<button class="item" type="button" data-act="cerrar-reporte-ui">Cancelar</button></div></div>';
  }

  function initials(p) {
    if (!p) return "?";
    return (p.nickname || "?").trim().slice(0, 2).toUpperCase();
  }
  function avColor(id) {
    const colors = ["#5B7CFA", "#693BB7", "#0C77ED", "#1F9D57", "#D97706", "#DB2777", "#0F766E", "#4F46E5"];
    let h = 0;
    String(id || "").split("").forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) >>> 0; });
    return colors[h % colors.length];
  }
  function avatarImg(p, cls) {
    if (p && p.avatar) return '<img class="' + (cls || "avatar-sm") + '" src="' + esc(p.avatar) + '" alt="">';
    return '<div class="av-letters" style="background:' + avColor(p && p.userId) + '">' + esc(initials(p)) + "</div>";
  }
  function fmtTime(ts) {
    const d = new Date(ts);
    const today = new Date();
    const yest = new Date(today);
    yest.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) {
      return d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: false });
    }
    if (d.toDateString() === yest.toDateString()) return "Ayer";
    return d.toLocaleDateString("es-PE", { day: "2-digit", month: "short" });
  }
  function dayLabel(ts) {
    const d = new Date(ts);
    const today = new Date();
    const yest = new Date(today);
    yest.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return "Hoy";
    if (d.toDateString() === yest.toDateString()) return "Ayer";
    return d.toLocaleDateString("es-PE", { day: "numeric", month: "long" });
  }
  function connectedIds(uid) {
    const ids = [];
    S().get().connections.forEach(function (c) {
      if (c.status !== "aceptada") return;
      if (c.fromId === uid) ids.push(c.toId);
      else if (c.toId === uid) ids.push(c.fromId);
    });
    return ids;
  }
  function relStatus(a, b) {
    return S().get().connections.find(function (x) {
      return (x.fromId === a && x.toId === b) || (x.fromId === b && x.toId === a);
    }) || null;
  }

  views.inicio = function () {
    const u = me();
    const q = (ui.search || "").trim().toLowerCase();
    const tab = route.params.tab || ui.inicioTab || "descubrir";
    ui.inicioTab = tab;
    const db = S().get();
    const blocked = db.blocks.filter(function (b) { return b.fromId === u.id; }).map(function (b) { return b.toId; });
    const mine = db.chat_profiles.filter(function (p) {
      if (p.userId === u.id) return false;
      const ou = S().userById(p.userId);
      if (!ou || ou.status !== "verificado") return false;
      if (blocked.indexOf(p.userId) >= 0) return false;
      if (!q) return true;
      const blob = (tag(p) + " " + (p.bio || "") + " " + (p.interests || []).join(" ")).toLowerCase();
      return blob.indexOf(q) >= 0;
    });
    const incoming = db.connections.filter(function (c) { return c.toId === u.id && c.status === "pendiente"; });
    const connected = connectedIds(u.id);
    const suggIds = ["u-mateo", "u-lau", "u-nico"];
    const suggestions = mine.filter(function (p) { return suggIds.indexOf(p.userId) >= 0; });
    const listed = mine.filter(function (p) { return suggIds.indexOf(p.userId) < 0; });
    function connectBtn(p) {
      const rel = relStatus(u.id, p.userId);
      let btn = '<button class="btn btn-primary" data-act="conectar" data-id="' + p.userId + '">Conectar</button>';
      if (rel && rel.status === "aceptada") btn = '<button class="btn btn-primary" data-act="abrir-chat" data-id="' + p.userId + '">Chat</button>';
      else if (rel && rel.status === "pendiente" && rel.fromId === u.id) btn = '<button class="btn sent" disabled>Solicitud enviada</button>';
      else if (rel && rel.status === "pendiente") btn = '<button class="btn btn-primary btn-sm" data-act="aceptar" data-id="' + rel.id + '">Aceptar</button>';
      return btn;
    }
    function userCard(p) {
      return '<article class="ucard"><img class="cover" src="' + esc(p.cover || p.avatar) + '" alt="">' +
        '<div class="body"><div class="nick">' + esc(tag(p)) + "</div>" +
        '<div class="bio">' + esc(p.bio || "") + "</div>" +
        '<div class="chips">' + (p.interests || []).map(function (i) { return '<span class="chip">' + esc(i) + "</span>"; }).join("") + "</div>" +
        connectBtn(p) + "</div></article>";
    }
    const cards = listed.map(userCard).join("") || '<div class="empty">No encontramos a nadie con esa búsqueda.</div>';
    const sugg = suggestions.map(function (p) {
      return '<article class="sugg-card"><img class="cover" src="' + esc(p.cover || p.avatar) + '" alt="">' +
        '<div class="body"><span class="chip-sugg">Sugerido</span><div class="nick">' + esc(tag(p)) + "</div>" +
        '<div class="bio">' + esc((p.bio || "").slice(0, 48)) + "</div>" + connectBtn(p) + "</div></article>";
    }).join("");
    const reqs = incoming.map(function (c) {
      const p = prof(c.fromId);
      return '<div class="req"><div class="req-h">' + avatarImg(p) +
        '<div class="grow"><div class="nick">' + esc(tag(p)) + '</div><div class="s">Intereses en común · ' +
        esc(fmtTime(c.createdAt)) + "</div></div></div>" +
        '<div class="req-actions"><button class="btn btn-primary btn-sm" data-act="aceptar" data-id="' + c.id + '">Aceptar</button>' +
        '<button class="btn btn-ghost btn-sm" data-act="ignorar" data-id="' + c.id + '">Ignorar</button></div></div>';
    }).join("") || '<div class="empty" style="padding:16px">No tienes solicitudes pendientes.</div>';
    const ways = '<div class="discover-ways">' +
      '<button class="way" type="button" data-act="focus-search"><span class="way-ico">' + ico("search", 16) + "</span>Búsqueda por apodo</button>" +
      '<button class="way" type="button" data-act="scroll-sugg"><span class="way-ico">' + ico("gift", 16) + "</span>Sugerencias</button>" +
      '<button class="way" type="button" data-go="qr"><span class="way-ico">' + ico("qr", 16) + "</span>QR / invitación</button>" +
      '<button class="way" type="button" data-act="scroll-lista"><span class="way-ico">' + ico("community", 16) + "</span>Lista de usuarios</button>" +
      "</div>";
    const invite = '<div class="invite-mini">' + ico("qr", 28) +
      '<div class="grow"><div class="nick">Invita con tu QR</div><div class="s">Comparte el código o escanéalo.</div></div>' +
      '<div class="actions"><button class="btn btn-primary btn-sm" data-go="qr">Mostrar</button>' +
      '<button class="btn btn-ghost btn-sm" data-go="escanear">Escanear</button></div></div>';
    return shell("inicio",
      installBanner() +
      '<p class="page-sub">Descubre personas. Encuentra con quién conversar.</p>' +
      '<div class="search">' + ico("search", 18) +
      '<input id="q" placeholder="Buscar por nickname, intereses o afinidades..." value="' + esc(ui.search) + '"></div>' +
      '<div class="seg seg--blue">' +
      '<button type="button" class="' + (tab === "descubrir" ? "on" : "") + '" data-act="inicio-tab" data-tab="descubrir">Descubrir</button>' +
      '<button type="button" class="' + (tab === "solicitudes" ? "on" : "") + '" data-act="inicio-tab" data-tab="solicitudes">Solicitudes' +
      (incoming.length ? " (" + incoming.length + ")" : "") + "</button></div>" +
      '<div class="desk-grid"><div>' +
      (tab === "solicitudes" ? '<div class="card">' + reqs + "</div>" :
        ways + invite +
        '<div class="sec-h" id="sugg"><h2>Sugerencias</h2></div><div class="sugg-row">' + (sugg || '<div class="empty">No hay sugerencias ahora.</div>') + "</div>" +
        '<div class="sec-h" id="lista"><h2>Lista de usuarios</h2></div><div class="user-grid">' + cards + "</div>") +
      "</div><aside class=\"side-panel hidden-sm\"><div class=\"sec-h\"><h2>Solicitudes pendientes</h2>" +
      '<span class="pill pill-blue">' + incoming.length + "</span></div>" + reqs + "</aside></div>"
    );
  };

  views.comunidad = function () {
    const u = me();
    const db = S().get();
    const q = (ui.search || "").trim().toLowerCase();
    const accepted = db.connections.filter(function (c) {
      return c.status === "aceptada" && (c.fromId === u.id || c.toId === u.id);
    });
    const sent = db.connections.filter(function (c) { return c.status === "pendiente" && c.fromId === u.id; });
    const recv = db.connections.filter(function (c) { return c.status === "pendiente" && c.toId === u.id; });
    function row(id, extra) {
      const p = prof(id);
      if (q && tag(p).toLowerCase().indexOf(q) < 0 && (p.bio || "").toLowerCase().indexOf(q) < 0) return "";
      return '<div class="person">' + avatarImg(p) + '<div class="grow"><div class="nick">' + esc(tag(p)) +
        '</div><div class="s">' + esc(p.bio || "") + "</div></div>" + (extra || "") + "</div>";
    }
    const list = accepted.map(function (c) {
      const other = c.fromId === u.id ? c.toId : c.fromId;
      return row(other, '<button class="btn btn-primary btn-sm" data-act="abrir-chat" data-id="' + other + '">Chat</button>');
    }).join("") || '<div class="empty">Aún no tienes conexiones. Ve a Inicio para descubrir personas.</div>';
    return shell("comunidad",
      '<h1 class="page-title">Comunidad</h1><p class="page-sub">Tus conexiones y solicitudes. Desde aquí abres un chat.</p>' +
      '<div class="search">' + ico("search", 18) +
      '<input id="q" placeholder="Buscar por apodo#1234" value="' + esc(ui.search) + '"></div>' +
      (recv.length ? '<div class="card"><div class="sec-h"><h2>Recibidas</h2></div>' + recv.map(function (c) {
        const p = prof(c.fromId);
        return '<div class="req"><div class="req-h">' + avatarImg(p) + '<div class="grow"><div class="nick">' +
          esc(tag(p)) + "</div></div></div><div class=\"req-actions\">" +
          '<button class="btn btn-primary btn-sm" data-act="aceptar" data-id="' + c.id + '">Aceptar</button>' +
          '<button class="btn btn-ghost btn-sm" data-act="ignorar" data-id="' + c.id + '">Ignorar</button></div></div>';
      }).join("") + "</div>" : "") +
      (sent.length ? '<div class="card"><div class="sec-h"><h2>Enviadas</h2></div>' +
        sent.map(function (c) { return row(c.toId, '<span class="pill pill-wait">Pendiente</span>'); }).join("") + "</div>" : "") +
      '<div class="card"><div class="sec-h"><h2>Conexiones</h2><span class="tiny">' + accepted.length +
      "</span></div>" + list + "</div>"
    );
  };

  function conversationTitle(c, u) {
    if (c.type === "group") {
      const g = S().get().groups.find(function (x) { return x.id === c.groupId; });
      return g ? g.name : "Grupo";
    }
    const oid = c.memberIds.find(function (id) { return id !== u.id; });
    return tag(prof(oid));
  }
  function otherId(c, u) {
    return c.memberIds.find(function (id) { return id !== u.id; });
  }


  function fmtDur(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    return Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0");
  }
  function previewOf(m, fallback) {
    if (!m && fallback) return fallback;
    const typ = (m && m.type) || "text";
    if (typ === "image") return "Foto";
    if (typ === "voice") return "Nota de voz";
    if (typ === "file") return "Archivo" + (m.fileName ? ": " + m.fileName : "");
    return (m && m.text) || fallback || "";
  }
  function plusBtn(act, icon, label, allowed) {
    if (allowed) {
      return '<button class="icon-round" type="button" data-act="' + act + '" aria-label="' + label + '">' + ico(icon, 20) + "</button>";
    }
    return '<button class="icon-round plus-lock" type="button" data-act="plus-gate" data-feat="' + act + '" aria-label="' + label + ' (Plus)">' +
      ico(icon, 20) + '<span class="plus-badge">Plus</span></button>';
  }
  function identTexts(userId) {
    return S().identity(userId);
  }
  function isWide() {
    return window.matchMedia && window.matchMedia("(min-width: 900px)").matches;
  }
  function ticksHtml(m, mine) {
    if (!mine) return "";
    if (m.read) return '<span class="ticks read" title="Visto">✓✓</span>';
    return '<span class="ticks" title="Enviado">✓</span>';
  }
  function ding() {
    if (S().get().soundEnabled === false) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.06, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      o.start(); o.stop(ctx.currentTime + 0.22);
    } catch (e) {}
  }
  function showNotice(title, body, avatar) {
    const el = document.getElementById("notice");
    if (!el) return;
    el.innerHTML = (avatar || "") + '<div class="grow"><div class="ttl">' + esc(title) + '</div><div class="bd">' +
      esc(body || "") + '</div></div><button class="icon-round x" type="button" data-act="cerrar-aviso" aria-label="Cerrar">' +
      ico("x", 16) + "</button>";
    el.hidden = false;
    ding();
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.hidden = true; }, 4200);
  }

  function visibleConversations(u, q) {
    const db = S().get();
    q = (q || "").trim().toLowerCase();
    return db.conversations
      .filter(function (c) { return c.memberIds.indexOf(u.id) >= 0; })
      .filter(function (c) {
        if (c.type === "group") return true;
        const oid = otherId(c, u);
        return !S().isBlocked(u.id, oid);
      })
      .sort(function (a, b) { return (b.lastAt || 0) - (a.lastAt || 0); })
      .filter(function (c) { return !q || conversationTitle(c, u).toLowerCase().indexOf(q) >= 0; });
  }

  function chatItemHtml(c, u, selectedId) {
    const db = S().get();
    const unread = db.messages.filter(function (m) {
      return m.conversationId === c.id && m.fromId !== u.id && !m.read;
    }).length;
    let av, titleBlock;
    if (c.type === "group") {
      const g = db.groups.find(function (x) { return x.id === c.groupId; });
      titleBlock = '<div class="nick">' + esc(g ? g.name : "Grupo") + "</div>";
      av = '<div class="av-letters" style="background:#0C77ED">' + ico("community", 20) + "</div>";
    } else {
      const idn = identTexts(otherId(c, u));
      const p = prof(otherId(c, u));
      av = avatarImg(p);
      titleBlock = '<div class="ident"><div class="nick">' + esc(idn.nick) + "</div>" +
        (idn.real ? '<div class="realname">' + esc(idn.real) + "</div>" : "") + "</div>";
    }
    return '<button class="chat-item' + (c.id === selectedId ? " on" : "") + '" type="button" data-go="chat" data-id="' + c.id + '">' + av +
      '<div class="grow"><div class="top">' + titleBlock +
      '<div class="time">' + esc(fmtTime(c.lastAt)) + "</div></div>" +
      '<div class="prev">' + esc(previewOf(null, c.lastText)) + "</div></div>" +
      (unread ? '<span class="unread">' + unread + "</span>" : "") + "</button>";
  }

  function listPageHtml(u, selectedId, opts) {
    opts = opts || {};
    const q = (ui.search || "").trim().toLowerCase();
    const list = visibleConversations(u, q);
    const directs = list.filter(function (c) { return c.type !== "group"; });
    const groups = list.filter(function (c) { return c.type === "group"; });
    return (opts.banner ? installBanner() : "") +
      '<h1 class="page-title">Mensajes</h1><p class="page-sub">Tus conversaciones. Aquí empieza Raiz.</p>' +
      '<div class="search">' + ico("search", 18) +
      '<input id="q" placeholder="Buscar un chat o grupo" value="' + esc(ui.search) + '"></div>' +
      '<div class="card" style="padding:8px 12px 4px"><div class="sec-h"><h2>Conversaciones</h2>' +
      '<span class="pill pill-blue">' + directs.length + "</span></div>" +
      (directs.map(function (c) { return chatItemHtml(c, u, selectedId); }).join("") || '<div class="empty">Aún no tienes chats. Conecta con alguien en Inicio.</div>') +
      "</div>" +
      '<div class="card" style="padding:8px 12px 4px"><div class="sec-h"><h2>Grupos</h2>' +
      '<span class="pill pill-blue">' + groups.length + "</span></div>" +
      (groups.map(function (c) { return chatItemHtml(c, u, selectedId); }).join("") || '<div class="empty">Crea un grupo en Raíces.</div>') +
      "</div>";
  }

  function msgById(id) {
    return S().get().messages.find(function (x) { return x.id === id; });
  }

  function bubblesHtml(c, u) {
    const db = S().get();
    const msgs = db.messages.filter(function (m) { return m.conversationId === c.id; })
      .sort(function (a, b) { return a.at - b.at; });
    let lastDay = "", bubbles = "";
    msgs.forEach(function (m) {
      const dl = dayLabel(m.at);
      if (dl !== lastDay) { bubbles += '<div class="day-chip">' + esc(dl) + "</div>"; lastDay = dl; }
      const mine = m.fromId === u.id;
      if (m.deleted) {
        bubbles += '<div class="msg' + (mine ? " mine" : "") + '"><div class="bubble"><i>Mensaje eliminado</i></div></div>';
        return;
      }
      const typ = m.type || "text";
      let body = "";
      if (typ === "image") {
        body = '<img class="chat-pic" src="' + esc(m.mediaUrl) + '" alt="Foto">';
      } else if (typ === "voice") {
        const on = ui.playingVoice === m.id ? " playing" : "";
        body = '<div class="voice' + on + '"><button class="play" type="button" data-act="play-voice" data-id="' + m.id + '" aria-label="Reproducir">' +
          ico(on ? "pause" : "play", 14) + '</button><div class="wavebar"><i></i></div><span class="dur">' + fmtDur(m.duration || 8) + "</span></div>";
      } else if (typ === "file") {
        body = '<div class="file-chip"><span class="ico-wrap">' + ico("file", 18) + "</span><span>" + esc(m.fileName || "Archivo") + "</span></div>";
      } else {
        body = esc(m.text || "");
      }
      let quote = "";
      if (m.replyTo) {
        const orig = msgById(m.replyTo);
        if (orig) {
          quote = '<div class="quote"><b>' + esc(identTexts(orig.fromId).nick) + "</b>" +
            esc(((orig.text || previewOf(orig, "")).slice(0, 90))) + "</div>";
        }
      }
      const rx = (m.reactions || []).map(function (r) {
        const mineRx = (r.userIds || []).indexOf(u.id) >= 0;
        return '<button class="rx' + (mineRx ? " mine" : "") + '" type="button" data-act="toggle-rx" data-id="' + m.id + '" data-emoji="' + r.emoji + '">' +
          r.emoji + ((r.userIds || []).length > 1 ? " " + r.userIds.length : "") + "</button>";
      }).join("");
      bubbles += '<div class="msg' + (mine ? " mine" : "") + '" data-mid="' + m.id + '">' +
        (mine ? "" : avatarImg(prof(m.fromId), "avatar-sm")) +
        '<div class="bubble" data-mid="' + m.id + '">' + quote + body +
        '<div class="meta">' + esc(fmtTime(m.at)) + ticksHtml(m, mine) + "</div>" +
        (rx ? '<div class="reactions">' + rx + "</div>" : "") +
        "</div></div>";
    });
    return bubbles;
  }

  function membersSheetHtml(g, u) {
    if (!ui.membersOpen || !g) return "";
    const myRole = S().groupRole(g, u.id);
    const staff = S().isGroupStaff(g, u.id);
    const creator = S().isGroupCreator(g, u.id);
    const rows = g.memberIds.map(function (id) {
      const idn = identTexts(id);
      const role = S().groupRole(g, id);
      const badge = '<span class="role-badge ' + role + '">' + S().roleLabel(role) + "</span>";
      const hasMenu = (creator && (role === "miembro" || role === "admin")) ||
        (staff && id !== g.ownerId && id !== u.id) ||
        (creator && id !== u.id) ||
        (id === u.id && myRole === "miembro") ||
        (creator && id === u.id);
      const dots = hasMenu
        ? '<button class="icon-round" type="button" data-act="menu-miembro" data-id="' + id + '" aria-label="Opciones del miembro">' + ico("dots", 18) + "</button>"
        : "";
      let menu = "";
      if (ui.memberMenu === id) {
        const items = [];
        if (creator && role === "miembro") items.push('<button class="item" type="button" data-act="promover-admin" data-id="' + id + '">Hacer admin</button>');
        if (creator && role === "admin") items.push('<button class="item" type="button" data-act="quitar-admin" data-id="' + id + '">Quitar admin</button>');
        if (staff && id !== g.ownerId && id !== u.id) items.push('<button class="item danger" type="button" data-act="quitar-miembro" data-id="' + id + '">Quitar del grupo</button>');
        if (creator && id !== u.id) items.push('<button class="item" type="button" data-act="transferir-grupo" data-id="' + id + '">Transferir grupo</button>');
        if (id === u.id && myRole === "miembro") items.push('<button class="item danger" type="button" data-act="salir-grupo">Salir del grupo</button>');
        if (creator && id === u.id) items.push('<button class="item danger" type="button" data-act="eliminar-grupo">Eliminar grupo</button>');
        menu = '<div class="member-menu">' + items.join("") + "</div>";
      }
      return '<div class="member-row">' + avatarImg(prof(id)) + '<div class="grow"><div class="nick">' + esc(idn.nick) + " " + badge + "</div>" +
        (idn.real ? '<div class="realname">' + esc(idn.real) + "</div>" : '<div class="tiny">Nombre real oculto</div>') +
        "</div>" + dots + menu + "</div>";
    }).join("");
    let add = "";
    if (staff) {
      const already = g.memberIds;
      const cand = connectedIds(u.id).filter(function (id) { return already.indexOf(id) < 0; });
      const atCap = g.memberIds.length >= S().GROUP_MEMBER_CAP;
      add = '<div class="add-member"><h3 style="margin:12px 0 6px">Agregar miembros</h3>' +
        '<p class="limit-note">Solo conexiones. No hay tope por plan; el máximo técnico es ' + S().GROUP_MEMBER_CAP + " (ajustable)." +
        (atCap ? " Este grupo ya llegó al máximo." : "") + "</p>" +
        (atCap ? "" : (cand.map(function (id) {
          return '<div class="person">' + avatarImg(prof(id)) + '<div class="grow"><div class="nick">' + esc(tag(prof(id))) +
            '</div></div><button class="btn btn-primary btn-sm" data-act="agregar-miembro" data-id="' + id + '">Agregar</button></div>';
        }).join("") || '<div class="empty">No hay más conexiones para invitar.</div>')) + "</div>";
    }
    let tools = '<div class="group-tools">';
    if (staff) {
      tools += '<button class="item" type="button" data-act="editar-grupo">' + ico("pencil", 18) + " Cambiar nombre o foto</button>";
    }
    if (creator) {
      tools += '<button class="item danger" type="button" data-act="eliminar-grupo">' + ico("block", 18) + " Eliminar grupo</button>";
    }
    if (myRole === "miembro") {
      tools += '<button class="item danger" type="button" data-act="salir-grupo">Salir del grupo</button>';
    }
    tools += "</div>";
    let edit = "";
    if (ui.groupEdit) {
      edit = '<div class="card" style="margin:8px 0;padding:12px"><div class="field"><label>Nombre del grupo</label><div class="box"><input id="geditname" value="' + esc(g.name) + '"></div></div>' +
        '<button class="btn btn-primary btn-sm" data-act="guardar-grupo">Guardar nombre</button> ' +
        '<button class="btn btn-ghost btn-sm" data-act="foto-grupo">Cambiar foto (prototipo)</button></div>';
    }
    return '<div class="sheet-backdrop" data-act="cerrar-miembros"><div class="sheet sheet--members" data-act="stop">' +
      '<div class="grab"></div><h3 style="margin:0 0 8px">Miembros</h3>' +
      '<p class="limit-note">' + g.memberIds.length + " miembros · tu rol: " + S().roleLabel(myRole) + "</p>" +
      edit + rows + add + tools +
      '<button class="item" type="button" data-act="cerrar-miembros">Cerrar</button></div></div>';
  }

  function msgMenuHtml(c, u) {
    if (!ui.msgMenu) return "";
    const m = msgById(ui.msgMenu);
    if (!m) return "";
    const mine = m.fromId === u.id;
    return '<div class="sheet-backdrop" data-act="cerrar-msg-menu"><div class="sheet" data-act="stop">' +
      '<div class="grab"></div>' +
      '<div class="emoji-row">' +
      ["❤️","👍","😂","😮","🙏"].map(function (e) {
        return '<button type="button" data-act="reaccionar" data-id="' + m.id + '" data-emoji="' + e + '">' + e + "</button>";
      }).join("") + "</div>" +
      '<button class="item" type="button" data-act="responder" data-id="' + m.id + '">' + ico("reply", 18) + " Responder</button>" +
      '<button class="item" type="button" data-act="reenviar" data-id="' + m.id + '">' + ico("plane", 18) + " Reenviar</button>" +
      ((mine || (c.type === "group" && (function () {
        const g = S().get().groups.find(function (x) { return x.id === c.groupId; });
        return S().isGroupStaff(g, u.id) && m.fromId !== u.id;
      })())) ? '<button class="item danger" type="button" data-act="eliminar-msg" data-id="' + m.id + '">' + ico("x", 18) + " Eliminar</button>" : "") +
      (!mine ? '<button class="item danger" type="button" data-act="reportar-msg" data-id="' + m.id + '">' + ico("flag", 18) + " Reportar mensaje</button>" : "") +
      '<button class="item" type="button" data-act="cerrar-msg-menu">Cancelar</button></div></div>';
  }

  function callUIHtml(c, u, oid, g) {
    if (!ui.calling) return "";
    const plus = S().canCall(u);
    if (ui.calling.pick) {
      return '<div class="sheet-backdrop call-pick" data-act="cerrar-llamada"><div class="sheet" data-act="stop">' +
        '<div class="grab"></div><h3 style="margin:0 0 8px">Llamada Plus</h3>' +
        '<button class="item" type="button" data-act="iniciar-llamada" data-mode="voice">' + ico("call", 18) + " Llamada de voz</button>" +
        '<button class="item" type="button" data-act="iniciar-llamada" data-mode="video">' + ico("video", 18) + " Videollamada</button>" +
        '<button class="item" type="button" data-act="cerrar-llamada">Cancelar</button></div></div>';
    }
    const mode = ui.calling.mode || "voice";
    const isGroup = c.type === "group";
    const title = isGroup ? (g ? g.name : "Grupo") : identTexts(oid).nick;
    const subReal = (!isGroup && identTexts(oid).real) ? '<div class="sub">' + esc(identTexts(oid).real) + "</div>" : "";
    const label = (mode === "video" ? "Videollamada" : "Llamada de voz") + (isGroup ? " de grupo" : "") + "…";
    if (mode === "video") {
      let stage;
      if (isGroup) {
        const cells = (g.memberIds || []).slice(0, 4).map(function (id) {
          const idn = identTexts(id);
          return '<div class="cell">' + avatarImg(prof(id)).replace("avatar-sm", "") + "<div>" + esc(idn.nick) + "</div></div>";
        }).join("");
        stage = '<div class="call-stage"><div class="grid">' + cells + "</div></div>";
      } else {
        const cover = (prof(oid) && (prof(oid).cover || prof(oid).avatar)) || "";
        const self = (prof(u.id) && prof(u.id).avatar) || "";
        stage = '<div class="call-stage"><img class="remote" src="' + esc(cover) + '" alt="">' +
          (self ? '<img class="self" src="' + esc(self) + '" alt="">' : "") + "</div>";
      }
      return '<div class="call-overlay video"><div style="width:100%;flex:1;display:flex;flex-direction:column">' +
        '<div style="opacity:.8;margin-bottom:12px">Raiz · Plus</div><h2>' + esc(title) + "</h2>" + subReal +
        '<div class="sub" style="margin:8px 0 12px">' + label + "</div>" + stage + "</div>" +
        '<div class="call-actions">' +
        '<button type="button" aria-label="Micrófono">' + ico("mic", 22) + "</button>" +
        '<button class="call-hang" type="button" data-act="colgar" aria-label="Colgar">' + ico("hang", 28) + "</button>" +
        '<button type="button" aria-label="Cámara">' + ico("video", 22) + "</button></div></div>";
    }
    const av = isGroup
      ? '<div class="av-letters" style="background:#0C77ED;width:112px;height:112px;border-radius:50%;display:grid;place-items:center;margin:0 auto 16px">' + ico("community", 40) + "</div>"
      : avatarImg(prof(oid)).replace("avatar-sm", "");
    return '<div class="call-overlay"><div><div style="opacity:.8;margin-bottom:24px">Raiz · Plus</div>' + av +
      "<h2>" + esc(title) + "</h2>" + subReal +
      '<div class="sub" style="margin-top:12px">' + label + "</div></div>" +
      '<button class="call-hang" type="button" data-act="colgar" aria-label="Colgar">' + ico("hang", 28) + "</button></div>";
  }

  function forwardSheetHtml(u) {
    if (!ui.forwardFrom) return "";
    const list = visibleConversations(u, "");
    const rows = list.map(function (c) {
      return '<button class="item" type="button" data-act="confirmar-reenvio" data-id="' + c.id + '">' +
        esc(conversationTitle(c, u)) + "</button>";
    }).join("");
    return '<div class="sheet-backdrop" data-act="cerrar-reenvio"><div class="sheet" data-act="stop">' +
      '<div class="grab"></div><h3 style="margin:0 0 8px">Reenviar a…</h3>' + rows +
      '<button class="item" type="button" data-act="cerrar-reenvio">Cancelar</button></div></div>';
  }

  function threadInnerHtml(u, c) {
    const db = S().get();
    if (c.type === "direct") {
      const oid0 = otherId(c, u);
      if (!S().isConnected(u.id, oid0)) {
        return '<div class="thread"><div class="thread-top"><button class="icon-round" data-go="mensajes">' + ico("chevL", 20) +
          '</button></div><div class="empty">Solo puedes chatear cuando hay una conexión aceptada.</div></div>';
      }
    }
    db.messages.forEach(function (m) {
      if (m.conversationId === c.id && m.fromId !== u.id) m.read = true;
    });
    S().persist();
    const blocked = c.type === "direct" && S().isBlocked(u.id, otherId(c, u));
    const plus = S().canCall(u);
    let whoHtml, av, oid = null, g = null;
    if (c.type === "group") {
      g = db.groups.find(function (x) { return x.id === c.groupId; });
      av = '<div class="av-letters" style="background:#0C77ED;width:36px;height:36px">' + ico("community", 16) + "</div>";
      whoHtml = '<div class="who"><span class="nick">' + esc(g ? g.name : "Grupo") + '</span><span class="presence">' +
        (g ? g.memberIds.length : 0) + " miembros</span></div>";
    } else {
      oid = otherId(c, u);
      const idn = identTexts(oid);
      av = avatarImg(prof(oid));
      whoHtml = '<div class="who"><span class="nick">' + esc(idn.nick) + "</span>" +
        (idn.real ? '<span class="realname">' + esc(idn.real) + "</span>" : "") +
        '<span class="presence">en línea</span></div>';
    }
    const menu = ui.chatMenu ? '<div class="sheet-backdrop" data-act="cerrar-menu"><div class="sheet" data-act="stop">' +
      '<div class="grab"></div>' +
      (oid ? '<button class="item" type="button" data-act="ver-perfil-chat" data-id="' + oid + '">' + ico("user", 18) + " Ver perfil de chat</button>" : "") +
      (c.type === "group" ? '<button class="item" type="button" data-act="miembros">' + ico("community", 18) + " Ver miembros</button>" : "") +
      (oid ? '<button class="item danger" type="button" data-act="bloquear" data-id="' + oid + '">' + ico("block", 18) + " Bloquear y eliminar chat</button>" : "") +
      '<button class="item danger" type="button" data-act="reportar" data-id="' + (oid || c.id) + '">' + ico("flag", 18) + " Reportar usuario</button>" +
      '<button class="item" type="button" data-act="cerrar-menu">Cancelar</button></div></div>' : "";

    const recBar = ui.recording
      ? '<div class="rec-bar"><span class="dot"></span><span>Grabando nota de voz · sin límite de duración</span><span class="time" id="rectime">0:00</span>' +
        '<button class="stop" type="button" data-act="stop-rec">Detener y enviar</button></div>'
      : "";

    const replyBar = (ui.replyTo && !ui.recording) ? (function () {
      const orig = msgById(ui.replyTo);
      if (!orig) return "";
      return '<div class="reply-bar"><div class="q"><b>Respondiendo a ' + esc(identTexts(orig.fromId).nick) + "</b>" +
        esc((orig.text || previewOf(orig, "")).slice(0, 80)) + '</div>' +
        '<button class="icon-round" type="button" data-act="cancelar-respuesta">' + ico("x", 16) + "</button></div>";
    })() : "";

    const composer = (u.status === "silenciado")
      ? '<div class="center small" style="padding:12px;background:#fff">Tu cuenta está silenciada. No puedes escribir hasta que se revise tu caso.</div>'
      : blocked
      ? '<div class="center small" style="padding:12px;background:#fff">Bloqueaste a esta persona. No puedes enviarle mensajes.</div>'
      : (ui.recording ? recBar : replyBar + '<form class="composer" data-act="enviar-msg">' +
        '<div class="tools">' +
        '<button type="button" class="icon-round" data-act="chat-foto" aria-label="Enviar foto">' + ico("cam", 20) + "</button>" +
        '<button type="button" class="icon-round" data-act="chat-voz" aria-label="Grabar nota de voz">' + ico("mic", 20) + "</button>" +
        plusBtn("chat-archivo", "clip", "Adjuntar archivo", plus) +
        "</div>" +
        '<input id="msgtext" placeholder="Escribe un mensaje..." autocomplete="off">' +
        '<button class="send-btn" type="submit" aria-label="Enviar">' + ico("send", 18) + "</button>" +
        '<input id="chatPhoto" type="file" accept="image/*" hidden>' +
        '<input id="chatFile" type="file" hidden>' +
        "</form>");

    const headerActions = plusBtn("llamar", c.type === "group" ? "video" : "call", "Llamar", plus) +
      (c.type === "group" ? '<button class="icon-round" type="button" data-act="miembros" aria-label="Miembros">' + ico("community", 20) + "</button>" : "") +
      '<button class="icon-round" data-act="abrir-menu" aria-label="Opciones">' + ico("dots", 20) + "</button>";

    return '<div class="thread">' +
      '<div class="thread-top"><button class="icon-round" data-go="mensajes" aria-label="Volver">' + ico("chevL", 20) + "</button>" + av +
      whoHtml + headerActions + "</div>" +
      '<div class="msgs" id="msglist">' + (bubblesHtml(c, u) || '<div class="empty">Escribe el primer mensaje.</div>') + "</div>" +
      composer + menu + membersSheetHtml(g, u) + msgMenuHtml(c, u) + forwardSheetHtml(u) + callUIHtml(c, u, oid, g) + "</div>";
  }

  function chatWorkspace(selectedId) {
    const u = me();
    const db = S().get();
    let thread = '<div class="chat-placeholder"><div>' + ico("msg", 36) +
      "<h2 class=\"page-title\" style=\"font-size:22px\">Selecciona una conversación</h2>" +
      '<p class="page-sub">La lista queda a la izquierda. En el celular, primero ves los chats y luego el hilo.</p></div></div>';
    if (selectedId) {
      const c = db.conversations.find(function (x) { return x.id === selectedId; });
      if (c) thread = threadInnerHtml(u, c);
    }
    return shell("mensajes",
      '<div class="chat-split mode-list"><div class="chat-list-col">' + listPageHtml(u, selectedId, { banner: false }) +
      '</div><div class="chat-thread-col">' + thread + "</div></div>",
      { wide: true, chat: true }
    );
  }

  views.mensajes = function () {
    const u = me();
    if (!u) return authFallback();
    if (isWide()) return chatWorkspace(ui.lastChatId || "cv-lucas");
    return shell("mensajes", listPageHtml(u, null, { banner: true }));
  };

  views.chat = function () {
    const u = me();
    if (!u) return authFallback();
    const db = S().get();
    const c = db.conversations.find(function (x) { return x.id === route.params.id; });
    if (!c) return shell("mensajes", '<div class="empty">No encontramos esta conversación.</div>');
    if (c.type === "direct") {
      const oid0 = otherId(c, u);
      if (!S().isConnected(u.id, oid0)) {
        return shell("mensajes", '<div class="empty">Solo puedes chatear cuando hay una conexión aceptada.</div><button class="btn btn-primary" data-go="inicio">Ir a Inicio</button>');
      }
    }
    ui.lastChatId = c.id;
    if (isWide()) return chatWorkspace(c.id);
    return threadInnerHtml(u, c);
  };


  views.raices = function () {
    const u = me();
    const db = S().get();
    const groups = db.groups.filter(function (g) { return g.memberIds.indexOf(u.id) >= 0; });
    const inv = db.invites_qr.find(function (i) { return i.createdBy === u.id; }) || db.invites_qr[0];
    const list = groups.map(function (g) {
      const cv = db.conversations.find(function (c) { return c.groupId === g.id; });
      return '<button class="chat-item" type="button" ' + (cv ? 'data-go="chat" data-id="' + cv.id + '"' : "") + ">" +
        '<div class="av-letters" style="background:#693BB7">' + ico("community", 20) + "</div>" +
        '<div class="grow"><div class="nick">' + esc(g.name) + '</div><div class="s">' +
        esc(g.description || "") + " · " + g.memberIds.length + " miembros</div></div></button>";
    }).join("") || '<div class="empty">Todavía no tienes grupos. Crea el primero.</div>';
    const created = S().groupsCreatedBy(u.id);
    const cap = S().groupCreateLimit(u);
    const canNew = S().canCreateGroup(u);
    return shell("raices",
      '<h1 class="page-title">Raíces</h1><p class="page-sub">Grupos con roles Creador, Admin y Miembro. Invita con tu QR.</p>' +
      '<div class="card"><div class="sec-h"><h2>Tus grupos</h2>' +
      (canNew
        ? '<button class="btn btn-primary btn-sm" data-go="crear-grupo">Crear grupo</button>'
        : '<button class="btn btn-ghost btn-sm" disabled>Límite alcanzado</button>') +
      '</div><p class="group-quota">' + created + " de " + cap + " grupos</p>" +
      '<p class="limit-note">Gratis: hasta 2 · Premium Basic y Plus: hasta 10. Sin tope de miembros por plan (máximo técnico ~256, ajustable).</p>' +
      list + "</div>" +
      '<div class="card"><div class="sec-h"><h2>Invitación QR</h2></div>' +
      '<p class="small">Comparte tu código para que otras personas pidan entrar a Raiz.</p>' +
      '<div class="invite-code mt-12">' + esc(inv ? inv.code : "RAIZ-7K2M") + "</div>" +
      '<button class="btn btn-primary mt-12" data-go="qr">Mostrar mi QR</button>' +
      '<button class="btn btn-ghost mt-12" data-go="escanear">Escanear un código</button></div>'
    );
  };

  views["crear-grupo"] = function () {
    const u = me();
    const created = S().groupsCreatedBy(u.id);
    const cap = S().groupCreateLimit(u);
    const canNew = S().canCreateGroup(u);
    const people = connectedIds(u.id).map(function (id) {
      const p = prof(id);
      return '<label class="person"><input type="checkbox" data-member="' + id +
        '" style="width:18px;height:18px">' + avatarImg(p) +
        '<div class="grow"><div class="nick">' + esc(tag(p)) + "</div></div></label>";
    }).join("") || '<div class="empty">Necesitas conexiones para armar un grupo. Encuéntralas en Inicio.</div>';
    return shell("raices",
      '<div class="row mb-8"><button class="icon-round" data-go="raices">' + ico("chevL", 20) +
      '</button><h1 class="page-title" style="margin:0">Crear grupo</h1></div>' +
      '<div class="group-quota-card"><div class="group-quota">' + created + " de " + cap + " grupos</div>" +
      '<p class="limit-note">Gratis: hasta 2 · Premium Basic y Plus: hasta 10. Al crear, eres el Creador. No hay tope de miembros por plan (máximo técnico ~256, ajustable).</p></div>' +
      (canNew ? "" : '<div class="empty">Llegaste al límite de grupos de tu plan.</div>') +
      '<div class="field"><label>Nombre del grupo</label><div class="box"><input id="gname" placeholder="Ej. Círculo Lima" ' + (canNew ? "" : "disabled") + "></div></div>" +
      '<div class="field"><label>Descripción</label><div class="box"><input id="gdesc" placeholder="De qué trata" ' + (canNew ? "" : "disabled") + "></div></div>" +
      '<div class="card"><div class="sec-h"><h2>Agregar miembros</h2></div><p class="limit-note">Solo conexiones, y tú entras como Creador.</p>' + people + "</div>" +
      '<button class="btn btn-primary" data-act="crear-grupo"' + (canNew ? "" : " disabled") + ">Crear grupo</button>"
    );
  };

  views.qr = function () {
    const inv = S().get().invites_qr[0];
    return shell("raices",
      '<div class="row mb-8"><button class="icon-round" data-go="raices">' + ico("chevL", 20) +
      '</button><h1 class="page-title" style="margin:0">Tu QR de invitación</h1></div>' +
      '<div class="qr-card"><img src="img/qr-invite.png" alt="Código QR de invitación">' +
      '<div class="invite-code">' + esc(inv ? inv.code : "RAIZ-7K2M") + "</div>" +
      '<p class="small">Muéstralo o compártelo. Quien lo use podrá crear su cuenta en Raiz.</p>' +
      '<button class="btn btn-ghost mt-16" data-act="copiar-codigo">Copiar código</button></div>'
    );
  };

  views.escanear = function () {
    return shell("raices",
      '<div class="row mb-8"><button class="icon-round" data-go="raices">' + ico("chevL", 20) +
      '</button><h1 class="page-title" style="margin:0">Escanear QR</h1></div>' +
      '<p class="page-sub">Apunta la cámara al código de invitación, o escríbelo.</p>' +
      '<div class="scanner"><div class="view"></div><div class="hint">Cámara (prototipo)</div></div>' +
      '<div class="field"><label>Código</label><div class="box"><input id="invcode" placeholder="RAIZ-XXXX" style="text-transform:uppercase;letter-spacing:.08em;font-weight:700"></div></div>' +
      '<button class="btn btn-primary" data-act="usar-invite">Unirme</button>'
    );
  };

  views.perfil = function () {
    const u = me();
    const p = prof(u.id);
    const tab = route.params.tab || ui.perfilTab || "real";
    ui.perfilTab = tab;
    const hide = !!u.hideRealName;
    const canHide = u.plan === "plus";
    const real = '<div class="card"><div class="card-h"><div><h3>' + ico("lock", 16) + " Perfil Real</h3>" +
      "<p>Tu identidad verificada. Solo visible para ti y para verificaciones de seguridad.</p></div>" +
      (u.status === "verificado" ? '<span class="pill pill-ok">' + ico("checkc", 12) + " Verificado</span>" :
        '<span class="pill pill-wait">Pendiente</span>') + "</div>" +
      '<div class="iden"><img src="' + esc(u.facePhoto || "img/avatar-face.png") + '" alt="Foto de rostro">' +
      '<div class="meta"><div class="lock-lab">' + ico("lock", 14) + " Nombre real</div>" +
      '<div class="name">' + esc(u.realName || "—") + '</div><div class="hint">Permanente y verificado</div></div></div>' +
      '<div class="secure-line">' + ico("shield", 16) + "<span>Este perfil está verificado y no puede editarse.</span></div>" +
      '<div class="info-line">' + ico("info", 16) + "<span>Tu foto real se usa únicamente para verificación de identidad y seguridad.</span></div></div>" +
      '<div class="card"><div class="premium-row"><div class="txt"><div class="k">' + ico("crown", 16) + " Modo Premium</div>" +
      '<div class="s">' + (canHide
        ? ("Oculta tu nombre real (" + esc(u.realName) + ") para mayor privacidad.")
        : "Disponible en plan Plus. Oculta tu nombre real en la comunidad.") +
      "</div></div>" +
      '<button class="toggle' + (hide ? " on" : "") + (canHide ? "" : " locked") +
      '" type="button" data-act="toggle-hide" aria-label="Ocultar nombre real"><i></i></button></div>' +
      (canHide ? "" : '<button class="btn btn-ghost mt-12" data-go="planes">Ver plan Plus</button>') + "</div>";
    const bio = p.bio || "";
    const chat = '<div class="card"><div class="card-h"><div><h3 style="color:var(--purple)">' + ico("msg", 16) +
      " Perfil Chat</h3><p>Así te ven los demás en la comunidad.</p></div></div>" +
      '<div class="edit-row"><div><div class="k">Nickname</div><div class="s">Editable y único</div></div>' +
      '<div class="nick-chip"><input id="nick" value="' + esc(p.nickname) + '" style="width:90px;font-weight:700">#' +
      esc(p.discriminator) + '<span style="color:var(--purple)">' + ico("pencil", 16) + "</span></div></div>" +
      '<div class="edit-row"><div><div class="k">Foto de perfil</div><div class="s">Visible en chat y comunidad</div></div>' +
      '<label style="display:flex;align-items:center;gap:8px;color:var(--purple);font-weight:700;cursor:pointer">' +
      avatarImg(p) + ico("pencil", 16) + '<input id="avat" type="file" accept="image/*" hidden></label></div>' +
      '<div class="edit-row" style="align-items:stretch"><div style="min-width:90px"><div class="k">Bio</div>' +
      '<div class="s">Cuéntales algo sobre ti</div></div>' +
      '<div class="bio-box"><textarea id="bio" maxlength="120">' + esc(bio) +
      '</textarea><div class="counter"><span id="bioc">' + bio.length + "</span>/120</div></div></div>" +
      '<button class="btn btn-primary mt-12" data-act="guardar-chat">Guardar perfil de chat</button></div>';
    return shell("perfil",
      '<h1 class="page-title">Perfil</h1><p class="page-sub">Gestiona tu identidad real y tu presencia en el chat.</p>' +
      '<div class="seg"><button type="button" class="' + (tab === "real" ? "on" : "") +
      '" data-act="perfil-tab" data-tab="real">' + ico("lock", 16) + " Perfil Real</button>" +
      '<button type="button" class="' + (tab === "chat" ? "on" : "") +
      '" data-act="perfil-tab" data-tab="chat">' + ico("msg", 16) + " Perfil Chat</button></div>" +
      (tab === "chat" ? chat : real),
      { topRight: '<button class="icon-round" data-go="planes" aria-label="Planes">' + ico("crown", 18) + "</button>" }
    );
  };

  views.planes = function () {
    const u = me();
    const cur = (u && u.plan) || "gratis";
    function plan(key, title, price, desc, feats, hi) {
      const mine = cur === key;
      return '<article class="plan' + (hi ? " hi" : "") + '"><h3>' + title + "</h3>" +
        '<p class="small">' + desc + '</p><div class="price">' + price + " <em>/ mes</em></div><ul>" +
        feats.map(function (f) { return "<li>" + ico("check", 16) + "<span>" + f + "</span></li>"; }).join("") +
        "</ul>" + (mine ? '<button class="btn btn-ghost" disabled>Plan actual</button>' :
          '<button class="btn ' + (hi ? "btn-primary" : "btn-ghost") + '" data-act="elegir-plan" data-plan="' + key + '">Suscribirse</button>') +
        "</article>";
    }
    return shell("perfil",
      '<h1 class="page-title">Planes</h1><p class="lead" style="margin-bottom:8px">Planes simples, valor real</p>' +
      '<p class="page-sub">Precios de prototipo (marcadores, en USD). El pago es mensual por transferencia; un admin confirma el comprobante. No hay renovación automática ni cobro con tarjeta.</p>' +
      '<div class="plans">' +
      plan("gratis", "Gratis", "$0", "Para empezar a conversar en Raiz.",
        ["Chats 1 a 1 y grupos", "Texto, fotos y notas de voz", "Nombre real visible en el chat", "Búsquedas básicas", "Acceso a la comunidad"], false) +
      plan("basic", "Premium Basic", "$4.99", "Más herramientas para encontrar gente y organizar charlas. Las funciones de chat propias de Basic aún no están definidas.",
        ["Todo lo de Gratis", "Búsquedas avanzadas", "Filtros prioritarios", "Insignia Basic", "Soporte prioritario", "Extras de chat: por definir"], true) +
      plan("plus", "Premium Plus", "$9.99", "La experiencia completa, con más privacidad y comunicación.",
        ["Todo lo de Gratis", "Ocultar tu nombre real", "Llamadas", "Archivos adjuntos", "Insignia Plus", "Prioridad en novedades"], false) +
      "</div>" +
      '<div class="note-box">' + ico("info", 18) +
      "<span><b>Pago por transferencia, cada mes.</b> Subes el comprobante (Yape, Plin o transferencia bancaria) y la administración lo confirma a mano. Los precios son placeholders; el cobro en soles está pendiente de definir. No se renueva ni se cobra de forma automática.</span></div>"
    );
  };

  views.pago = function () {
    const plan = route.params.plan || flow.plan || "plus";
    const price = plan === "basic" ? "$4.99" : "$9.99";
    const title = plan === "basic" ? "Premium Basic" : "Premium Plus";
    return shell("perfil",
      '<div class="row mb-8"><button class="icon-round" data-go="planes">' + ico("chevL", 20) +
      '</button><h1 class="page-title" style="margin:0">Pago por transferencia</h1></div>' +
      '<p class="page-sub">Plan ' + title + " · " + price +
      " / mes (precio de prototipo). Envía el monto y sube tu comprobante. Un admin lo confirmará. No hay cargo automático.</p>" +
      '<div class="card"><div style="font-weight:700;margin-bottom:8px">Datos para transferir (prototipo)</div>' +
      '<p class="small">Titular: RAIZ COMUNIDAD<br>Banco: BCP · CCI 002-1-00000000000<br>Yape / Plin: 999 000 001</p></div>' +
      '<div class="field"><label>Comprobante (foto o captura)</label>' +
      '<label class="dni-drop">' + (flow.voucher
        ? '<img class="preview" src="' + esc(flow.voucher) + '" alt="Comprobante">'
        : (ico("fileplus", 36) + "<h4>Sube tu comprobante</h4><p>JPG o PNG</p>")) +
      '<input id="voucher" type="file" accept="image/*" hidden></label></div>' +
      '<button class="btn btn-primary" data-act="enviar-pago">Enviar comprobante</button>'
    );
  };

  views.instalar = function () {
    return shell("perfil",
      '<h1 class="page-title">Instalar la app</h1>' +
      '<p class="page-sub">Raiz es una PWA: la abres como una aplicación, sin pasar por una tienda.</p>' +
      '<div class="card"><h3>En Android (Chrome)</h3><ol class="small mt-12" style="padding-left:18px;line-height:1.7">' +
      "<li>Abre Raiz en Chrome.</li><li>Toca el menú de la esquina.</li>" +
      "<li>Elige <b>Instalar aplicación</b> o <b>Añadir a la pantalla de inicio</b>.</li></ol></div>" +
      '<div class="card"><h3>En iPhone (Safari)</h3><ol class="small mt-12" style="padding-left:18px;line-height:1.7">' +
      "<li>Abre Raiz en Safari (no en Chrome).</li><li>Toca el botón Compartir.</li>" +
      "<li>Elige <b>Añadir a pantalla de inicio</b> y confirma.</li></ol></div>" +
      '<div class="note-box">' + ico("info", 18) +
      "<span>Si tu navegador muestra el aviso de instalación, también puedes aceptar ese banner.</span></div>"
    );
  };

  views.ajustes = function () {
    const u = me();
    return shell("perfil",
      '<h1 class="page-title">Ajustes</h1><div class="menu-list">' +
      '<button type="button" data-go="planes">' + ico("crown", 18) + " Planes y suscripción</button>" +
      '<button type="button" data-go="instalar">' + ico("plus", 18) + " Instalar la app</button>" +
      '<button type="button" data-go="perdi-numero">' + ico("phone", 18) + " Perdí mi número</button>" +
      (u && u.role === "admin" ? '<button type="button" data-go="admin">' + ico("shield", 18) + " Panel de administración</button>" : "") +
      '</div><div class="menu-list" style="margin-top:12px">' +
      '<div class="switch-row"><div class="grow"><div class="nick">Sonido de notificaciones</div>' +
      '<div class="s">Avisos dentro de la app. En producción se usará Web Push (FCM).</div></div>' +
      '<button class="toggle' + (S().get().soundEnabled !== false ? " on" : "") +
      '" type="button" data-act="toggle-sonido" aria-label="Sonido de notificaciones"><i></i></button></div>' +
      '<button type="button" data-act="probar-aviso">' + ico("bell", 18) + " Probar aviso</button>" +
      '</div><div class="menu-list" style="margin-top:12px">' +
      '<button type="button" class="danger" data-act="salir">' + ico("x", 18) + " Cerrar sesión</button>" +
      '</div><p class="tiny center mt-16">Prototipo Raiz · cuenta ' +
      esc(u ? S().formatPhone(u.phone) : "") + (u && u.role === "admin" ? " · admin" : "") + "</p>"
    );
  };

  function adminTabs(on) {
    const t = [
      ["admin", "Resumen"],
      ["admin-verificaciones", "Verificaciones"],
      ["admin-reportes", "Reportes"],
      ["admin-apelaciones", "Apelaciones"],
      ["admin-pagos", "Pagos"],
      ["admin-recuperacion", "Recuperación"],
      ["admin-historial", "Historial"],
      ["admin-ajustes", "Ajustes"]
    ];
    return '<div class="admin-tabs">' + t.map(function (x) {
      return '<button type="button" class="' + (x[0] === on ? "on" : "") + '" data-go="' + x[0] + '">' + x[1] + "</button>";
    }).join("") + "</div>";
  }
  function adminOnly(viewFn) {
    const u = me();
    if (!S().isPlatformAdmin(u)) {
      return shell("perfil", '<div class="empty">Este panel es solo de Hubert, titular único de Raiz.</div>');
    }
    return viewFn();
  }

  views.admin = function () {
    return adminOnly(function () {
      const db = S().get();
      const users = db.users.length;
      const ver = db.users.filter(function (u) { return u.status === "verificado" || u.status === "silenciado"; }).length;
      const pend = db.identity_verifications.filter(function (v) { return v.status === "pendiente"; }).length;
      const reps = db.reports.filter(function (v) { return v.status === "abierto"; }).length;
      const aps = db.appeals.filter(function (v) { return v.status === "pendiente"; }).length;
      const ingresos = db.payments.filter(function (p) { return p.status === "confirmado"; }).reduce(function (s, p) { return s + parseFloat(p.amount || 0); }, 0);
      const pendPay = db.payments.filter(function (p) { return p.status === "pendiente"; }).length;
      const sil = db.users.filter(function (u) { return u.status === "silenciado"; }).length;
      return shell("perfil",
        '<h1 class="page-title">Administración</h1>' +
        '<p class="page-sub">Panel de Hubert, titular único de Raiz. No hay otros administradores ni moderadores.</p>' +
        adminTabs("admin") +
        '<div class="stats-grid">' +
        '<div class="stat-card"><div class="n">' + users + '</div><div class="l">Usuarios</div></div>' +
        '<div class="stat-card ok"><div class="n">' + ver + '</div><div class="l">Verificados</div></div>' +
        '<div class="stat-card warn"><div class="n">' + pend + '</div><div class="l">Pendientes de verificación</div></div>' +
        '<div class="stat-card danger"><div class="n">' + reps + '</div><div class="l">Reportes abiertos</div></div>' +
        '<div class="stat-card"><div class="n">USD ' + ingresos.toFixed(2) + '</div><div class="l">Ingresos confirmados</div></div>' +
        '<div class="stat-card warn"><div class="n">' + pendPay + '</div><div class="l">Comprobantes por revisar</div></div>' +
        '<div class="stat-card"><div class="n">' + aps + '</div><div class="l">Apelaciones pendientes</div></div>' +
        '<div class="stat-card"><div class="n">' + sil + '</div><div class="l">Cuentas silenciadas</div></div>' +
        "</div>"
      );
    });
  };

  views["admin-verificaciones"] = function () {
    return adminOnly(function () {
      const db = S().get();
      const rejectModal = ui.rejectVerif ? (function () {
        const v = db.identity_verifications.find(function (x) { return x.id === ui.rejectVerif; });
        if (!v) return "";
        const tpls = (S().REJECT_TEMPLATES || []).map(function (s, i) {
          return '<button type="button" class="tpl-chip" data-act="tpl-rechazo" data-i="' + i + '">' + esc(s) + "</button>";
        }).join("");
        return '<div class="sheet-backdrop" data-act="cerrar-rechazo"><div class="sheet" data-act="stop">' +
          '<div class="grab"></div><h3 style="margin:0 0 8px">Rechazar verificación</h3>' +
          "<p class=\"small\">Se notificará a " + esc(v.realName) + " con el motivo y podrá volver a enviar.</p>" +
          '<div class="reason-chips">' + tpls + "</div>" +
          '<div class="field"><label>Motivo (texto libre)</label><div class="box"><textarea id="rejreason" rows="4" placeholder="Escribe el motivo…">' +
          esc(ui.rejectDraft || "") + "</textarea></div></div>" +
          '<button class="btn btn-primary" data-act="confirmar-rechazo" data-id="' + v.id + '">Rechazar y notificar</button>' +
          '<button class="item" type="button" data-act="cerrar-rechazo">Cancelar</button></div></div>';
      })() : "";
      const items = db.identity_verifications.slice().sort(function (a, b) { return (b.submittedAt || 0) - (a.submittedAt || 0); }).map(function (v) {
        const u = S().userById(v.userId);
        const flags = v.status === "pendiente" ? S().findVerificationDuplicates(v) : [];
        const flagHtml = flags.map(function (f) { return '<div class="dup-flag"><b>Posible duplicado</b>' + esc(f.label) + "</div>"; }).join("");
        return '<div class="card"><div class="row"><b>' + esc(v.realName) + '</b><span class="pill ' +
          (v.status === "pendiente" ? "pill-wait" : v.status === "aprobada" ? "pill-ok" : "pill-no") + '">' +
          esc(v.status) + "</span></div>" +
          '<p class="tiny">' + esc(u ? S().formatPhone(u.phone) : "") + (v.dniNumber ? " · DNI " + esc(v.dniNumber) : "") + "</p>" +
          flagHtml +
          '<div class="ev-photos"><img src="' + esc(v.facePhoto) + '" alt="Rostro"><img src="' +
          esc(v.dniFront) + '" alt="DNI frente">' +
          (v.dniBack ? '<img src="' + esc(v.dniBack) + '" alt="DNI reverso">' : "") + "</div>" +
          (v.reason ? '<p class="small">Motivo: ' + esc(v.reason) + "</p>" : "") +
          (v.status === "pendiente"
            ? '<div class="req-actions"><button class="btn btn-primary btn-sm" data-act="aprobar-verif" data-id="' + v.id + '">Aprobar</button>' +
              '<button class="btn btn-ghost btn-sm" data-act="abrir-rechazo" data-id="' + v.id + '">Rechazar</button></div>'
            : "") + "</div>";
      }).join("") || '<div class="empty">No hay solicitudes.</div>';
      return shell("perfil",
        '<h1 class="page-title">Verificaciones</h1>' +
        '<p class="page-sub">Solo tú revisas identidad. Las fotos de DNI se conservan.</p>' +
        '<div class="dni-keep">Almacenamiento: bucket privado, reglas solo-admin y cifrado en reposo. Opción de respaldo o archivo en tu PC Zorin.</div>' +
        adminTabs("admin-verificaciones") + items + rejectModal
      );
    });
  };

  views["admin-pagos"] = function () {
    return adminOnly(function () {
      const db = S().get();
      const items = db.payments.slice().reverse().map(function (p) {
        const pr = S().profileOf(p.userId);
        return '<div class="card"><div class="row"><b>' + esc(tag(pr)) + " · " + esc(p.plan) +
          '</b><span class="pill ' + (p.status === "pendiente" ? "pill-wait" : p.status === "confirmado" ? "pill-ok" : "pill-no") +
          '">' + esc(p.status) + "</span></div><p class=\"small\">" + esc(p.amount) + " " + esc(p.currency) +
          " · " + esc(p.method) + "</p>" +
          (p.voucher ? '<img src="' + esc(p.voucher) + '" alt="Comprobante" style="width:100%;border-radius:12px;margin:8px 0;max-height:220px;object-fit:contain;background:#f7f7f7">' : "") +
          (p.status === "pendiente"
            ? '<div class="req-actions"><button class="btn btn-primary btn-sm" data-act="confirmar-pago" data-id="' + p.id + '">Aprobar comprobante</button>' +
              '<button class="btn btn-ghost btn-sm" data-act="rechazar-pago" data-id="' + p.id + '">Rechazar</button></div>'
            : "") + "</div>";
      }).join("") || '<div class="empty">No hay pagos.</div>';
      return shell("perfil", '<h1 class="page-title">Pagos</h1><p class="page-sub">Aprobar o rechazar comprobantes de transferencia.</p>' + adminTabs("admin-pagos") + items);
    });
  };

  function contextHtml(r) {
    if (!r.messageId || !r.conversationId) return r.messageExcerpt ? '<div class="excerpt">«' + esc(r.messageExcerpt) + "»</div>" : "";
    const db = S().get();
    const all = db.messages.filter(function (m) { return m.conversationId === r.conversationId; }).sort(function (a, b) { return a.at - b.at; });
    const idx = all.findIndex(function (m) { return m.id === r.messageId; });
    const slice = idx >= 0 ? all.slice(Math.max(0, idx - 2), idx + 3) : all.slice(-3);
    if (!slice.length) return r.messageExcerpt ? '<div class="excerpt">«' + esc(r.messageExcerpt) + "»</div>" : "";
    return '<div class="ctx-thread"><div class="tiny" style="margin-bottom:6px">Contexto del mensaje reportado</div>' + slice.map(function (m) {
      const on = m.id === r.messageId ? " target" : "";
      return '<div class="ctx-msg' + on + '"><div class="who">' + esc(identTexts(m.fromId).nick) + " · " + esc(fmtTime(m.at)) + "</div>" +
        esc(m.deleted ? "Mensaje eliminado" : (m.text || previewOf(m, ""))) + "</div>";
    }).join("") + "</div>";
  }

  views["admin-reportes"] = function () {
    return adminOnly(function () {
      const db = S().get();
      const th = S().autoActionThreshold();
      const items = db.reports.slice().sort(function (a, b) {
        if (ui.sanctionFor === a.id) return -1;
        if (ui.sanctionFor === b.id) return 1;
        const ac = a.messageId ? 1 : 0, bc = b.messageId ? 1 : 0;
        if (ac !== bc) return bc - ac;
        return (b.createdAt || 0) - (a.createdAt || 0);
      }).map(function (r) {
        const typ = r.type === "message" ? "Reporte de mensaje" : "Reporte de usuario";
        const tu = S().userById(r.targetId);
        const nrep = S().distinctReporters(r.targetId).length;
        const auto = tu && tu.sanction && tu.sanction.auto ? '<span class="auto-flag">Auto-silencio</span>' : "";
        const action = r.action ? '<span class="pill pill-ok">' + esc(r.action) + "</span>" : "";
        const acts = r.status === "abierto"
          ? '<div class="req-actions mt-12"><button class="btn btn-primary btn-sm" data-act="abrir-sancion" data-id="' + r.id + '">Sancionar</button>' +
            '<button class="btn btn-ghost btn-sm" data-act="descartar-reporte" data-id="' + r.id + '">Descartar</button></div>'
          : "";
        return '<div class="card"><div class="report-type">' + typ + " · " + esc(reasonLabel(r.reason)) + "</div><div class=\"row\"><b>" +
          esc(tag(prof(r.fromId))) + " → " + esc(tag(prof(r.targetId))) +
          '</b><span class="pill ' + (r.status === "abierto" ? "pill-no" : "pill-ok") + '">' + esc(r.status) +
          "</span>" + action + auto + "</div>" +
          '<p class="tiny mt-8">' + nrep + " denunciantes distintos (umbral automático: " + th + ")</p>" +
          (r.comment ? '<p class="small mt-8">' + esc(r.comment) + "</p>" : "") +
          contextHtml(r) + acts + "</div>";
      }).join("") || '<div class="empty">No hay reportes.</div>';
      const sr = ui.sanctionFor ? db.reports.find(function (x) { return x.id === ui.sanctionFor; }) : null;
      const tu = sr ? S().userById(sr.targetId) : null;
      const sanctionModal = sr && sr.status === "abierto" ? (
        '<div class="sheet-backdrop" data-act="cerrar-sancion"><div class="sheet" data-act="stop">' +
        '<div class="grab"></div><h3 style="margin:0 0 8px">Aplicar sanción</h3>' +
        "<p class=\"small\">Se notificará a " + esc(tu ? (tu.realName || tag(prof(tu.id))) : "la persona") + " con el motivo y podrá apelar.</p>" +
        '<div class="reason-chips">' +
        [["advertencia","Advertencia"],["silenciar","Silenciar"],["suspension","Suspensión"],["expulsion","Expulsión"]].map(function (x) {
          return '<button type="button" class="tpl-chip' + (ui.sanctionType === x[0] ? " on" : "") + '" data-act="sancion-tipo" data-tipo="' + x[0] + '">' + x[1] + "</button>";
        }).join("") + "</div>" +
        ((ui.sanctionType === "silenciar" || ui.sanctionType === "suspension")
          ? '<div class="field"><label>Días</label><div class="box"><input id="sanciondias" type="number" min="1" max="365" value="' + (ui.sanctionDays || 7) + '"></div></div>' : "") +
        '<div class="field"><label>Motivo que verá la persona</label><div class="box"><textarea id="sancionmotivo" rows="3" placeholder="Motivo de la sanción…">' + esc(ui.sanctionNote || "") + "</textarea></div></div>" +
        '<button class="btn btn-primary" data-act="aplicar-sancion" data-id="' + sr.id + '">Aplicar y notificar</button>' +
        '<button class="item" type="button" data-act="cerrar-sancion">Cancelar</button></div></div>'
      ) : "";
      return shell("perfil",
        '<h1 class="page-title">Reportes</h1>' +
        '<p class="page-sub">Motivos fijos. Puedes leer el contexto y aplicar advertencia, silencio, suspensión o expulsión. La persona es notificada y puede apelar.</p>' +
        adminTabs("admin-reportes") + items + sanctionModal
      );
    });
  };

  views["admin-apelaciones"] = function () {
    return adminOnly(function () {
      const db = S().get();
      const items = db.appeals.slice().reverse().map(function (a) {
        const u = S().userById(a.userId);
        const s = u && u.sanction;
        return '<div class="card"><div class="row"><b>' + esc(u ? (u.realName || tag(prof(u.id))) : a.userId) +
          '</b><span class="pill ' + (a.status === "pendiente" ? "pill-wait" : a.status === "aceptada" ? "pill-ok" : "pill-no") + '">' +
          esc(a.status) + "</span></div>" +
          '<p class="tiny">Contra: ' + esc(a.sanctionType || (s && s.type) || "sanción") + "</p>" +
          (s && s.reason ? '<p class="small mt-8">Sanción: ' + esc(s.reason) + "</p>" : "") +
          '<p class="small mt-8">Apelación: ' + esc(a.text) + "</p>" +
          (a.status === "pendiente"
            ? '<div class="req-actions mt-12"><button class="btn btn-primary btn-sm" data-act="apelacion-resolver" data-id="' + a.id + '" data-ok="1">Levantar sanción</button>' +
              '<button class="btn btn-ghost btn-sm" data-act="apelacion-resolver" data-id="' + a.id + '" data-ok="0">Rechazar apelación</button></div>'
            : "") + "</div>";
      }).join("") || '<div class="empty">No hay apelaciones.</div>';
      return shell("perfil", '<h1 class="page-title">Apelaciones</h1><p class="page-sub">La persona sancionada puede pedir que revises la medida.</p>' + adminTabs("admin-apelaciones") + items);
    });
  };

  views["admin-recuperacion"] = function () {
    return adminOnly(function () {
      const db = S().get();
      const items = db.recovery_requests.slice().reverse().map(function (r) {
        const u = S().userById(r.userId);
        return '<div class="card"><div class="row"><b>' + esc(r.claimedName) + '</b><span class="pill ' +
          (r.status === "pendiente" ? "pill-wait" : r.status === "aprobada" ? "pill-ok" : "pill-no") + '">' + esc(r.status) + "</span></div>" +
          '<p class="small mt-8">Número anterior: ' + esc(S().formatPhone(r.oldPhone)) +
          "<br>Número nuevo: " + esc(S().formatPhone(r.newPhone)) + "</p>" +
          '<p class="small">' + esc(r.note || "") + "</p>" +
          (u && u.facePhoto ? '<div class="ev-photos mt-8"><img src="' + esc(u.facePhoto) + '" alt="Rostro"><img src="' +
            esc(u.dniFront || "img/dni-muestra.png") + '" alt="DNI"></div>' : "") +
          (r.status === "pendiente"
            ? '<div class="req-actions"><button class="btn btn-primary btn-sm" data-act="aprobar-recup" data-id="' + r.id + '">Asignar número nuevo</button>' +
              '<button class="btn btn-ghost btn-sm" data-act="rechazar-recup" data-id="' + r.id + '">Rechazar</button></div>'
            : "") + "</div>";
      }).join("") || '<div class="empty">No hay solicitudes.</div>';
      return shell("perfil",
        '<h1 class="page-title">Recuperación</h1><p class="page-sub">Pérdida de número: contrasta foto y DNI antes de cambiar el celular.</p>' +
        adminTabs("admin-recuperacion") + items
      );
    });
  };

  views["admin-historial"] = function () {
    return adminOnly(function () {
      const db = S().get();
      const labels = { seed: "Prototipo", verificacion_aprobada: "Verificación aprobada", verificacion_rechazada: "Verificación rechazada", pago_aprobado: "Pago aprobado", pago_rechazado: "Pago rechazado", auto_silencio: "Auto-silencio", advertencia: "Advertencia", silenciar: "Silencio", suspension: "Suspensión", expulsion: "Expulsión", apelacion_aceptada: "Apelación aceptada", apelacion_rechazada: "Apelación rechazada", recuperacion_numero: "Recuperación de número" };
      const items = (db.admin_audit || []).slice().reverse().map(function (a) {
        const who = a.targetId ? S().userById(a.targetId) : null;
        const whoLabel = who ? (who.realName || tag(prof(who.id))) : "";
        return '<div class="hist-item"><div class="nick">' + esc(labels[a.action] || a.action) + '</div><div class="s">' +
          esc(a.detail || "") + (whoLabel ? " · " + esc(whoLabel) : "") +
          " · " + esc(fmtTime(a.at)) + "</div></div>";
      }).join("") || '<div class="empty">Aún no hay acciones.</div>';
      return shell("perfil",
        '<h1 class="page-title">Historial</h1><p class="page-sub">Bitácora simple de tus acciones. Es opcional; no hay otros administradores.</p>' +
        adminTabs("admin-historial") + '<div class="card">' + items + "</div>"
      );
    });
  };

  views["admin-ajustes"] = function () {
    return adminOnly(function () {
      const n = S().autoActionThreshold();
      return shell("perfil",
        '<h1 class="page-title">Ajustes del panel</h1>' +
        '<p class="page-sub">Umbral de acción automática. Configurable entre 3 y 5 denunciantes distintos.</p>' +
        adminTabs("admin-ajustes") +
        '<div class="card"><div class="k">Auto-silencio</div>' +
        '<p class="small mt-8">Cuando una cuenta acumula N reportes de personas distintas, queda silenciada y oculta hasta que la revises.</p>' +
        '<div class="threshold-row mt-16">' +
        '<button class="btn btn-ghost btn-sm" data-act="umbral" data-delta="-1">−</button>' +
        '<div class="n">' + n + "</div>" +
        '<button class="btn btn-ghost btn-sm" data-act="umbral" data-delta="1">+</button>' +
        "<span class=\"s\">denunciantes (3–5)</span></div></div>"
      );
    });
  };


  const AUTH = {
    bienvenida: 1, registro: 1, otp: 1, contrasena: 1, login: 1, olvide: 1,
    "olvide-otp": 1, "nueva-contrasena": 1, "perdi-numero": 1, "qr-entrada": 1,
    verificacion: 1, pendiente: 1, suspendido: 1, rechazado: 1, expulsado: 1, silenciado: 1
  };

  function render() {
    const name = route.name || "bienvenida";
    if (AUTH[name]) app.classList.remove("wide");
    const view = views[name] || views.bienvenida;
    try { app.innerHTML = view(); }
    catch (err) {
      console.error(err);
      app.innerHTML = '<div class="page"><p>Error al dibujar la pantalla.</p></div>';
    }
    bind();
    const list = document.getElementById("msglist");
    if (list) list.scrollTop = list.scrollHeight;
    startOtpClock();
    const rt = document.getElementById("rectime");
    if (rt && ui.recording) {
      rt.textContent = fmtDur(Math.max(0, Math.floor((Date.now() - (ui.recAt || Date.now())) / 1000)));
    }
  }

  let otpTimer = null;
  function startOtpClock() {
    if (otpTimer) clearInterval(otpTimer);
    if (route.name !== "otp" && route.name !== "olvide-otp") return;
    otpTimer = setInterval(function () {
      const el = document.getElementById("otp-cd");
      if (!el) { clearInterval(otpTimer); return; }
      const left = Math.max(0, (flow.expiresAt || 0) - Date.now());
      const mm = String(Math.floor(left / 60000)).padStart(2, "0");
      const ss = String(Math.floor((left % 60000) / 1000)).padStart(2, "0");
      el.textContent = mm + ":" + ss;
      if (left <= 0) clearInterval(otpTimer);
    }, 500);
  }

  function readFile(input, cb) {
    const f = input.files && input.files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { toast("El archivo supera 10 MB."); return; }
    const r = new FileReader();
    r.onload = function () { cb(r.result); };
    r.readAsDataURL(f);
  }

  function bind() {
    ["pass1", "pass2"].forEach(function (id) {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("input", function () {
        if (id === "pass1") ui.pass1 = el.value;
        else ui.pass2 = el.value;
        render();
        const again = document.getElementById(id);
        if (again) {
          again.focus();
          again.setSelectionRange(el.value.length, el.value.length);
        }
      });
    });
    const q = document.getElementById("q");
    if (q) {
      q.addEventListener("change", function () { ui.search = q.value; render(); });
      q.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { ui.search = q.value; render(); }
      });
    }
    const bio = document.getElementById("bio");
    if (bio) bio.addEventListener("input", function () {
      const c = document.getElementById("bioc");
      if (c) c.textContent = bio.value.length;
    });
    const otpRow = document.getElementById("otp-row");
    if (otpRow) {
      const inputs = [].slice.call(otpRow.querySelectorAll("input"));
      inputs.forEach(function (inp, i) {
        inp.addEventListener("input", function () {
          inp.value = inp.value.replace(/\D/g, "").slice(0, 1);
          flow.otpInput = inputs.map(function (x) { return x.value; }).join("");
          if (inp.value && i < 5) inputs[i + 1].focus();
          if (flow.otpInput.length === 6) submitOtp();
        });
        inp.addEventListener("keydown", function (e) {
          if (e.key === "Backspace" && !inp.value && i > 0) inputs[i - 1].focus();
        });
        inp.addEventListener("paste", function (e) {
          const t = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "").slice(0, 6);
          if (!t) return;
          e.preventDefault();
          t.split("").forEach(function (ch, j) { if (inputs[j]) inputs[j].value = ch; });
          flow.otpInput = t;
          if (t.length === 6) submitOtp();
        });
      });
      const firstEmpty = inputs.find(function (x) { return !x.value; }) || inputs[0];
      if (firstEmpty) firstEmpty.focus();
    }
    ["dniF", "dniB", "selfieFile", "voucher", "avat", "chatPhoto", "chatFile"].forEach(function (id) {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("change", function () {
        readFile(el, function (url) {
          if (id === "dniF") draft.dniFront = url;
          else if (id === "dniB") draft.dniBack = url;
          else if (id === "selfieFile") draft.selfie = url;
          else if (id === "voucher") flow.voucher = url;
          else if (id === "avat") {
            const p = prof();
            if (p) { p.avatar = url; p.cover = p.cover || url; S().persist(); }
          } else if (id === "chatPhoto" || id === "chatFile") {
            const dbx = S().get();
            const cv = dbx.conversations.find(function (c) { return c.id === route.params.id; });
            const usr = me();
            if (cv && usr) {
              if (id === "chatFile" && !S().canAttachFile(usr)) { toast("Los archivos adjuntos son de plan Plus."); go("planes"); return; }
              const f = el.files && el.files[0];
              const typ = id === "chatPhoto" ? "image" : "file";
              if (typ === "image") toast("Foto ajustada a un tamaño estándar (máx. ~1600 px).");
              dbx.messages.push({
                id: S().uid("m"), conversationId: cv.id, fromId: usr.id, type: typ,
                mediaUrl: url, fileName: typ === "file" ? (f && f.name) || "archivo.pdf" : null,
                at: Date.now(), read: false
              });
              cv.lastAt = Date.now();
              cv.lastText = typ === "image" ? "Foto" : ("Archivo: " + ((f && f.name) || "archivo"));
              S().persist();
            }
          }
          render();
        });
      });
    });
  }

  let holdT = null;
  document.addEventListener("pointerdown", function (e) {
    const b = e.target.closest(".bubble[data-mid]");
    if (!b || e.target.closest("button")) return;
    holdT = setTimeout(function () {
      ui.msgMenu = b.getAttribute("data-mid");
      render();
    }, 450);
  });
  document.addEventListener("pointerup", function () { clearTimeout(holdT); });
  document.addEventListener("pointercancel", function () { clearTimeout(holdT); });
  document.addEventListener("contextmenu", function (e) {
    const b = e.target.closest(".bubble[data-mid]");
    if (!b) return;
    e.preventDefault();
    ui.msgMenu = b.getAttribute("data-mid");
    render();
  });
  if (window.matchMedia) {
    window.matchMedia("(min-width: 900px)").addEventListener("change", function () { render(); });
  }

  document.addEventListener("click", function (e) {
    const stop = e.target.closest("[data-act=stop]");
    if (e.target.closest("[data-act=cerrar-menu]") && !stop) {
      ui.chatMenu = false; render(); return;
    }
    const g = e.target.closest("[data-go]");
    if (g) {
      e.preventDefault();
      const params = {};
      if (g.dataset.id) params.id = g.dataset.id;
      if (g.dataset.tab) params.tab = g.dataset.tab;
      if (g.dataset.plan) params.plan = g.dataset.plan;
      ui.search = "";
      go(g.dataset.go, params);
      return;
    }
    const a = e.target.closest("[data-act]");
    if (a) { e.preventDefault(); handle(a.dataset.act, a); }
  });

  document.addEventListener("submit", function (e) {
    const f = e.target.closest("form[data-act]");
    if (!f) return;
    e.preventDefault();
    handle(f.dataset.act, f);
  });

  async function handle(act, el) {
    const db = S().get();
    const u = me();
    switch (act) {
      case "explorar":
        await S().seed();
        S().createSession("u-maria");
        go("mensajes");
        toast("Entraste como María#4821 (prototipo)");
        break;
      case "enviar-otp-registro":
      case "enviar-otp-reset": {
        const inp = document.getElementById("phone");
        const phone = S().normalizePhone((inp && inp.value) || "");
        if (!/^(\+51)9\d{8}$/.test(phone)) {
          toast("Ingresa un celular peruano de 9 dígitos, empezando en 9.");
          return;
        }
        if (act === "enviar-otp-reset" && !S().userByPhone(phone)) {
          toast("Ese número no tiene una cuenta en Raiz.");
          return;
        }
        if (act === "enviar-otp-registro" && S().userByPhone(phone)) {
          toast("Este número ya tiene cuenta. Inicia sesión.");
          return;
        }
        const res = S().issueOtp(phone, act === "enviar-otp-reset" ? "reset" : "register");
        if (!res.ok) { toast(res.error); return; }
        flow.phone = phone;
        flow.otpId = res.otp.id;
        flow.purpose = res.otp.purpose;
        flow.demoCode = res.demoCode;
        flow.expiresAt = res.otp.expiresAt;
        flow.otpInput = "";
        go(act === "enviar-otp-reset" ? "olvide-otp" : "otp");
        break;
      }
      case "reenviar-otp": {
        const res = S().issueOtp(flow.phone, flow.purpose);
        if (!res.ok) { toast(res.error); return; }
        flow.otpId = res.otp.id;
        flow.demoCode = res.demoCode;
        flow.expiresAt = res.otp.expiresAt;
        flow.otpInput = "";
        toast("Te enviamos un nuevo código de prueba.");
        render();
        break;
      }
      case "toggle-pass": {
        const which = el.dataset.which;
        if (which === "pass1") ui.show1 = !ui.show1;
        else if (which === "pass2") ui.show2 = !ui.show2;
        else ui.show1 = !ui.show1;
        const p1 = document.getElementById("pass1");
        const p2 = document.getElementById("pass2");
        if (p1) ui.pass1 = p1.value;
        if (p2) ui.pass2 = p2.value;
        render();
        break;
      }
      case "crear-cuenta": {
        const p1 = ui.pass1 || "";
        const p2 = ui.pass2 || "";
        const st = strength(p1);
        if (!st.ok) { toast("La contraseña no cumple los requisitos."); return; }
        if (p1 !== p2) { toast("Las contraseñas no coinciden."); return; }
        if (flow.purpose === "reset") {
          const user = S().userByPhone(flow.phone);
          if (!user) { toast("No encontramos la cuenta."); return; }
          const r = await S().setPassword(user.id, p1);
          if (!r.ok) { toast(r.error); return; }
          toast("Contraseña actualizada. Inicia sesión.");
          ui.pass1 = ui.pass2 = "";
          go("login");
          return;
        }
        const r = await S().registerWithPassword(flow.phone, p1);
        if (!r.ok) { toast(r.error); return; }
        ui.pass1 = ui.pass2 = "";
        draft = { realName: "", dniFront: null, dniBack: null, selfie: null, step: 1 };
        go("verificacion", { step: "1" });
        break;
      }
      case "ingresar": {
        const phone = S().normalizePhone((document.getElementById("phone") || {}).value || "");
        const pass = (document.getElementById("pass") || {}).value || "";
        const r = await S().login(phone, pass);
        if (!r.ok) { toast(r.error); return; }
        go(S().postLoginRoute(r.user));
        break;
      }
      case "salir":
        S().logout();
        flow = {};
        go("bienvenida");
        break;
      case "verif-paso1": {
        const name = ((document.getElementById("realname") || {}).value || "").trim();
        if (name.length < 5) { toast("Escribe tu nombre completo."); return; }
        draft.realName = name;
        draft.step = 2;
        go("verificacion", { step: "2" });
        break;
      }
      case "verif-paso2":
        if (!draft.dniFront || !draft.dniBack) { toast("Sube el frente y el reverso del DNI."); return; }
        if (!draft.selfie) { toast("Tómate una selfie para continuar."); return; }
        draft.step = 3;
        go("verificacion", { step: "3" });
        break;
      case "selfie":
        document.getElementById("selfieFile").click();
        break;
      case "enviar-verificacion": {
        if (!u) { toast("Inicia sesión."); return; }
        u.realName = draft.realName;
        u.facePhoto = draft.selfie;
        u.dniFront = draft.dniFront;
        u.dniBack = draft.dniBack;
        u.status = "pendiente_verificacion";
        db.identity_verifications.push({
          id: S().uid("iv"), userId: u.id, realName: draft.realName,
          facePhoto: draft.selfie, dniFront: draft.dniFront, dniBack: draft.dniBack,
          status: "pendiente", submittedAt: Date.now()
        });
        S().persist();
        go("pendiente");
        break;
      }
      case "simular-aprobacion": {
        if (!u) return;
        const v = db.identity_verifications.filter(function (x) { return x.userId === u.id; }).pop();
        if (v) v.status = "aprobada";
        u.status = "verificado";
        u.verifiedAt = Date.now();
        const p = prof(u.id);
        if (p && p.nickname === "usuario") p.nickname = (u.realName || "usuario").split(" ")[0];
        S().persist();
        go("mensajes");
        toast("Identidad verificada. Bienvenida a los chats.");
        break;
      }
      case "abrir-admin":
        if (S().isPlatformAdmin(u)) go("admin");
        else toast("El panel es solo de Hubert.");
        break;
      case "enviar-recuperacion": {
        const name = ((document.getElementById("rn") || {}).value || "").trim();
        const oldp = S().normalizePhone((document.getElementById("oldp") || {}).value || "");
        const newp = S().normalizePhone((document.getElementById("newp") || {}).value || "");
        if (!name || !oldp || !newp) { toast("Completa nombre y ambos números."); return; }
        const known = S().userByPhone(oldp);
        db.recovery_requests.push({
          id: S().uid("rec"), userId: known ? known.id : null, claimedName: name,
          oldPhone: oldp, newPhone: newp, note: "Solicitud desde la app (prototipo).",
          status: "pendiente", createdAt: Date.now()
        });
        S().persist();
        toast("Solicitud enviada. La administración la revisará a mano.");
        go("login");
        break;
      }
      default:
        return handleMore(act, el, db, u);
    }
  }

  function handleMore(act, el, db, u) {
    switch (act) {
      case "dismiss-install":
        S().get().installBannerDismissed = true;
        S().persist();
        ui.installHint = false;
        render();
        break;
      case "inicio-tab":
        ui.inicioTab = el.dataset.tab;
        go("inicio", { tab: el.dataset.tab });
        break;
      case "perfil-tab":
        ui.perfilTab = el.dataset.tab;
        go("perfil", { tab: el.dataset.tab });
        break;
      case "conectar": {
        const to = el.dataset.id;
        if (relStatus(u.id, to)) { toast("Ya hay una solicitud o conexión."); return; }
        db.connections.push({ id: S().uid("c"), fromId: u.id, toId: to, status: "pendiente", createdAt: Date.now() });
        S().persist();
        toast("Solicitud enviada.");
        render();
        break;
      }
      case "aceptar": {
        const c = db.connections.find(function (x) { return x.id === el.dataset.id; });
        if (c) c.status = "aceptada";
        S().persist();
        toast("Ahora están conectados. Ya pueden chatear.");
        render();
        break;
      }
      case "ignorar":
        db.connections = db.connections.filter(function (x) { return x.id !== el.dataset.id; });
        S().persist();
        render();
        break;
      case "abrir-chat": {
        const other = el.dataset.id;
        if (!S().isConnected(u.id, other)) {
          toast("Primero tienen que aceptar la solicitud de conexión.");
          return;
        }
        let cv = db.conversations.find(function (c) {
          return c.type === "direct" && c.memberIds.indexOf(u.id) >= 0 && c.memberIds.indexOf(other) >= 0;
        });
        if (!cv) {
          cv = { id: S().uid("cv"), type: "direct", memberIds: [u.id, other], lastAt: Date.now(), lastText: "" };
          db.conversations.push(cv);
          S().persist();
        }
        go("chat", { id: cv.id });
        break;
      }
      case "enviar-msg": {
        if (u && u.status === "silenciado") { toast("Tu cuenta está silenciada."); return; }
        const input = document.getElementById("msgtext");
        const text = ((input && input.value) || "").trim();
        if (!text) return;
        const cv = db.conversations.find(function (c) { return c.id === route.params.id; });
        if (!cv) return;
        db.messages.push({ id: S().uid("m"), conversationId: cv.id, fromId: u.id, type: "text", text: text, at: Date.now(), read: false, replyTo: ui.replyTo || null });
        ui.replyTo = null;
        cv.lastAt = Date.now();
        cv.lastText = text;
        S().persist();
        render();
        break;
      }
      case "chat-foto": {
        const inp = document.getElementById("chatPhoto");
        if (inp) inp.click();
        break;
      }
      case "chat-archivo": {
        if (!S().canAttachFile(u)) { go("planes"); toast("Los archivos adjuntos son de plan Plus."); return; }
        const inp = document.getElementById("chatFile");
        if (inp) inp.click();
        break;
      }
      case "chat-voz":
        ui.recording = true;
        ui.recAt = Date.now();
        render();
        break;
      case "stop-rec": {
        const dur = Math.max(2, Math.round((Date.now() - (ui.recAt || Date.now())) / 1000));
        ui.recording = false;
        const cv = db.conversations.find(function (c) { return c.id === route.params.id; });
        if (cv) {
          db.messages.push({ id: S().uid("m"), conversationId: cv.id, fromId: u.id, type: "voice", duration: dur, at: Date.now(), read: false });
          cv.lastAt = Date.now();
          cv.lastText = "Nota de voz";
          S().persist();
        }
        render();
        break;
      }
      case "play-voice":
        ui.playingVoice = ui.playingVoice === el.dataset.id ? null : el.dataset.id;
        render();
        break;
      case "plus-gate":
        toast("Esta función es de plan Plus.");
        go("planes");
        break;
      case "llamar":
        if (!S().canCall(u)) { go("planes"); toast("Las llamadas de voz y video son de plan Plus."); return; }
        ui.calling = { pick: true, convId: route.params.id || ui.lastChatId };
        render();
        break;
      case "iniciar-llamada":
        if (!S().canCall(u)) { go("planes"); return; }
        ui.calling = { mode: el.dataset.mode || "voice", convId: (ui.calling && ui.calling.convId) || route.params.id };
        render();
        break;
      case "cerrar-llamada":
        ui.calling = false;
        render();
        break;
      case "colgar":
        ui.calling = false;
        toast("Llamada finalizada (prototipo).");
        render();
        break;
      case "miembros":
        ui.membersOpen = true;
        ui.chatMenu = false;
        render();
        break;
      case "cerrar-miembros":
        ui.membersOpen = false;
        render();
        break;
      case "abrir-menu":
        ui.chatMenu = true;
        render();
        break;
      case "cerrar-menu":
        ui.chatMenu = false;
        render();
        break;
      case "bloquear": {
        const id = el.dataset.id;
        if (!db.blocks.some(function (b) { return b.fromId === u.id && b.toId === id; })) {
          db.blocks.push({ id: S().uid("b"), fromId: u.id, toId: id, at: Date.now() });
        }
        S().hideConversationAfterBlock(u.id, id);
        S().persist();
        ui.chatMenu = false;
        ui.lastChatId = null;
        toast("Persona bloqueada. El chat se eliminó.");
        go("mensajes");
        break;
      }
      case "reportar":
        ui.chatMenu = false;
        ui.reportDraft = { type: "user", targetId: el.dataset.id, conversationId: route.params.id || ui.lastChatId, messageId: null, reason: "acoso", comment: "" };
        render();
        break;
      case "ver-perfil-chat":
        ui.chatMenu = false;
        toast("Perfil de chat: " + tag(prof(el.dataset.id)));
        break;
      case "toggle-hide":
        if (!u) return;
        if (u.plan !== "plus") { toast("Ocultar el nombre real está en el plan Plus."); go("planes"); return; }
        u.hideRealName = !u.hideRealName;
        S().persist();
        render();
        break;
      case "guardar-chat": {
        const p = prof(u.id);
        const nick = ((document.getElementById("nick") || {}).value || "").trim();
        const bio = ((document.getElementById("bio") || {}).value || "").slice(0, 120);
        if (nick.length < 2) { toast("El apodo es muy corto."); return; }
        p.nickname = nick;
        p.bio = bio;
        p.updatedAt = Date.now();
        S().persist();
        toast("Perfil de chat guardado.");
        render();
        break;
      }
      case "elegir-plan":
        if (el.dataset.plan === "gratis") { toast("Ya puedes usar el plan gratis."); return; }
        flow.plan = el.dataset.plan;
        flow.voucher = null;
        go("pago", { plan: el.dataset.plan });
        break;
      case "enviar-pago":
        if (!flow.voucher) { toast("Sube una foto del comprobante."); return; }
        db.payments.push({
          id: S().uid("pay"), userId: u.id, plan: flow.plan || "plus",
          amount: flow.plan === "basic" ? "4.99" : "9.99", currency: "USD",
          method: "transferencia", voucher: flow.voucher, status: "pendiente",
          createdAt: Date.now(), note: "Comprobante de prototipo."
        });
        S().persist();
        toast("Comprobante enviado. Queda pendiente de confirmación.");
        go("planes");
        break;
      case "crear-grupo": {
        if (!S().canCreateGroup(u)) {
          toast("Llegaste al límite de grupos de tu plan (" + S().groupCreateLimit(u) + ").");
          return;
        }
        const name = ((document.getElementById("gname") || {}).value || "").trim();
        const desc = ((document.getElementById("gdesc") || {}).value || "").trim();
        if (name.length < 3) { toast("Ponle un nombre al grupo."); return; }
        const members = [u.id];
        document.querySelectorAll("[data-member]:checked").forEach(function (x) {
          members.push(x.getAttribute("data-member"));
        });
        if (members.length > S().GROUP_MEMBER_CAP) {
          toast("El máximo técnico es " + S().GROUP_MEMBER_CAP + " miembros.");
          return;
        }
        const g = { id: S().uid("g"), name: name, description: desc, ownerId: u.id, adminIds: [], memberIds: members, createdAt: Date.now() };
        db.groups.push(g);
        const cv = { id: S().uid("cv"), type: "group", groupId: g.id, memberIds: members.slice(), lastAt: Date.now(), lastText: "Grupo creado" };
        db.conversations.push(cv);
        S().persist();
        go("chat", { id: cv.id });
        break;
      }
      case "usar-invite": {
        const code = ((document.getElementById("invcode") || {}).value || "").trim().toUpperCase();
        const inv = db.invites_qr.find(function (i) { return i.code.toUpperCase() === code; });
        if (!code) { toast("Escribe o escanea un código."); return; }
        if (!inv) { toast("Código no válido. Prueba RAIZ-7K2M en el prototipo."); return; }
        toast("Invitación válida. Crea tu cuenta.");
        go("registro");
        break;
      }
      case "copiar-codigo": {
        const inv = db.invites_qr[0];
        if (inv && navigator.clipboard) navigator.clipboard.writeText(inv.code).catch(function () {});
        toast("Código copiado.");
        break;
      }
      case "aprobar-verif": {
        const v = db.identity_verifications.find(function (x) { return x.id === el.dataset.id; });
        if (!v) return;
        v.status = "aprobada";
        const tu = S().userById(v.userId);
        if (tu) { tu.status = "verificado"; tu.verifiedAt = Date.now(); tu.realName = v.realName; tu.facePhoto = v.facePhoto; }
        S().notify(v.userId, "Identidad verificada", "Ya puedes entrar a los chats de Raiz.", "verificacion");
        S().audit("aprobar_verificacion", v.userId, "");
        S().persist();
        toast("Identidad aprobada.");
        render();
        break;
      }
      case "abrir-rechazo":
        ui.rejectVerif = el.dataset.id;
        ui.rejectDraft = "";
        render();
        break;
      case "cerrar-rechazo":
        ui.rejectVerif = null;
        render();
        break;
      case "tpl-rechazo": {
        const list = S().REJECT_TEMPLATES || [];
        ui.rejectDraft = list[Number(el.dataset.i)] || ui.rejectDraft;
        const ta = document.getElementById("rejreason");
        if (ta) { ta.value = ui.rejectDraft; }
        else render();
        break;
      }
      case "confirmar-rechazo":
      case "rechazar-verif": {
        const v = db.identity_verifications.find(function (x) { return x.id === el.dataset.id; });
        if (!v) return;
        const reason = ((document.getElementById("rejreason") || {}).value || ui.rejectDraft || "").trim();
        if (!reason) { toast("Escribe un motivo para el rechazo."); return; }
        v.status = "rechazada";
        v.reason = reason;
        v.reviewedAt = Date.now();
        const tu = S().userById(v.userId);
        if (tu) tu.status = "rechazado";
        S().notify(v.userId, "No pudimos verificar tu identidad", reason + " Puedes volver a enviar tu DNI y tu selfie.", "verificacion");
        S().audit("rechazar_verificacion", v.userId, reason);
        S().persist();
        ui.rejectVerif = null;
        ui.rejectDraft = "";
        toast("Rechazo enviado. La persona fue notificada y puede volver a intentarlo.");
        render();
        break;
      }
      case "confirmar-pago": {
        const p = db.payments.find(function (x) { return x.id === el.dataset.id; });
        if (!p) return;
        p.status = "confirmado";
        const tu = S().userById(p.userId);
        if (tu) tu.plan = p.plan;
        S().audit("confirmar_pago", p.userId, p.plan);
        S().persist();
        toast("Pago confirmado. Plan activado.");
        render();
        break;
      }
      case "rechazar-pago": {
        const p = db.payments.find(function (x) { return x.id === el.dataset.id; });
        if (!p) return;
        p.status = "rechazado";
        S().persist();
        toast("Pago rechazado.");
        render();
        break;
      }
      case "toggle-sonido":
        db.soundEnabled = db.soundEnabled === false;
        S().persist();
        toast(db.soundEnabled ? "Sonido activado." : "Sonido desactivado.");
        render();
        break;
      case "probar-aviso": {
        const p = prof("u-lucas");
        showNotice(tag(p) + " te escribió", "Nota de voz", avatarImg(p));
        break;
      }
      case "cerrar-aviso": {
        const n = document.getElementById("notice");
        if (n) n.hidden = true;
        break;
      }
      case "focus-search": {
        const qel = document.getElementById("q");
        if (qel) qel.focus();
        break;
      }
      case "scroll-sugg": {
        const elS = document.getElementById("sugg");
        if (elS) elS.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      }
      case "scroll-lista": {
        const elL = document.getElementById("lista");
        if (elL) elL.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      }
      case "msg-menu":
        ui.msgMenu = el.dataset.id || el.dataset.mid;
        render();
        break;
      case "cerrar-msg-menu":
        ui.msgMenu = null;
        render();
        break;
      case "responder":
        ui.replyTo = el.dataset.id;
        ui.msgMenu = null;
        render();
        setTimeout(function () { const i = document.getElementById("msgtext"); if (i) i.focus(); }, 30);
        break;
      case "cancelar-respuesta":
        ui.replyTo = null;
        render();
        break;
      case "reaccionar":
      case "toggle-rx": {
        const mid = el.dataset.id;
        const emoji = el.dataset.emoji;
        const msg = db.messages.find(function (x) { return x.id === mid; });
        if (msg && emoji) {
          msg.reactions = msg.reactions || [];
          let rec = msg.reactions.find(function (r) { return r.emoji === emoji; });
          if (!rec) { rec = { emoji: emoji, userIds: [] }; msg.reactions.push(rec); }
          const ix = rec.userIds.indexOf(u.id);
          if (ix >= 0) rec.userIds.splice(ix, 1);
          else rec.userIds.push(u.id);
          msg.reactions = msg.reactions.filter(function (r) { return r.userIds.length; });
          S().persist();
        }
        ui.msgMenu = null;
        render();
        break;
      }
      case "reenviar":
        ui.forwardFrom = el.dataset.id;
        ui.msgMenu = null;
        render();
        break;
      case "cerrar-reenvio":
        ui.forwardFrom = null;
        render();
        break;
      case "confirmar-reenvio": {
        const src = db.messages.find(function (x) { return x.id === ui.forwardFrom; });
        const dest = db.conversations.find(function (c) { return c.id === el.dataset.id; });
        if (src && dest) {
          const copy = { id: S().uid("m"), conversationId: dest.id, fromId: u.id, type: src.type || "text", text: src.text || "", mediaUrl: src.mediaUrl, fileName: src.fileName, duration: src.duration, at: Date.now(), read: false };
          db.messages.push(copy);
          dest.lastAt = Date.now();
          dest.lastText = previewOf(copy, src.text || "Mensaje reenviado");
          S().persist();
          ui.forwardFrom = null;
          toast("Mensaje reenviado.");
          go("chat", { id: dest.id });
        }
        break;
      }
      case "eliminar-msg": {
        const msg = db.messages.find(function (x) { return x.id === el.dataset.id; });
        if (msg) {
          const cv = db.conversations.find(function (c) { return c.id === msg.conversationId; });
          const g = cv && cv.groupId && db.groups.find(function (x) { return x.id === cv.groupId; });
          const ok = msg.fromId === u.id || (g && S().isGroupStaff(g, u.id));
          if (ok) { msg.deleted = true; msg.text = ""; S().persist(); }
        }
        ui.msgMenu = null;
        render();
        break;
      }
      case "reportar-msg": {
        const msg = db.messages.find(function (x) { return x.id === el.dataset.id; });
        ui.msgMenu = null;
        if (msg) {
          ui.reportDraft = {
            type: "message", targetId: msg.fromId, conversationId: msg.conversationId, messageId: msg.id,
            excerpt: (msg.text || previewOf(msg, "")).slice(0, 140), reason: "acoso", comment: ""
          };
        }
        render();
        break;
      }
      case "menu-miembro":
        ui.memberMenu = ui.memberMenu === el.dataset.id ? null : el.dataset.id;
        render();
        break;
      case "agregar-miembro": {
        const cv = db.conversations.find(function (c) { return c.id === (route.params.id || ui.lastChatId); });
        const g = cv && db.groups.find(function (x) { return x.id === cv.groupId; });
        const nid = el.dataset.id;
        if (g && S().isGroupStaff(g, u.id) && S().isConnected(u.id, nid) && g.memberIds.indexOf(nid) < 0) {
          if (g.memberIds.length >= S().GROUP_MEMBER_CAP) { toast("Máximo técnico de " + S().GROUP_MEMBER_CAP + " miembros."); return; }
          g.memberIds.push(nid);
          cv.memberIds = g.memberIds.slice();
          S().persist();
          toast("Miembro agregado.");
        }
        render();
        break;
      }
      case "quitar-miembro": {
        const cv = db.conversations.find(function (c) { return c.id === (route.params.id || ui.lastChatId); });
        const g = cv && db.groups.find(function (x) { return x.id === cv.groupId; });
        const nid = el.dataset.id;
        if (g && S().isGroupStaff(g, u.id) && nid !== g.ownerId) {
          g.memberIds = g.memberIds.filter(function (id) { return id !== nid; });
          g.adminIds = (g.adminIds || []).filter(function (id) { return id !== nid; });
          cv.memberIds = g.memberIds.slice();
          S().persist();
          ui.memberMenu = null;
          toast("Miembro quitado.");
        }
        render();
        break;
      }
      case "promover-admin": {
        const cv = db.conversations.find(function (c) { return c.id === (route.params.id || ui.lastChatId); });
        const g = cv && db.groups.find(function (x) { return x.id === cv.groupId; });
        const nid = el.dataset.id;
        if (g && S().isGroupCreator(g, u.id) && nid !== g.ownerId) {
          g.adminIds = g.adminIds || [];
          if (g.adminIds.indexOf(nid) < 0) g.adminIds.push(nid);
          S().persist();
          ui.memberMenu = null;
          toast("Ahora es admin del grupo.");
        }
        render();
        break;
      }
      case "quitar-admin": {
        const cv = db.conversations.find(function (c) { return c.id === (route.params.id || ui.lastChatId); });
        const g = cv && db.groups.find(function (x) { return x.id === cv.groupId; });
        const nid = el.dataset.id;
        if (g && S().isGroupCreator(g, u.id)) {
          g.adminIds = (g.adminIds || []).filter(function (id) { return id !== nid; });
          S().persist();
          ui.memberMenu = null;
          toast("Ya no es admin.");
        }
        render();
        break;
      }
      case "transferir-grupo": {
        const cv = db.conversations.find(function (c) { return c.id === (route.params.id || ui.lastChatId); });
        const g = cv && db.groups.find(function (x) { return x.id === cv.groupId; });
        const nid = el.dataset.id;
        if (g && S().isGroupCreator(g, u.id) && g.memberIds.indexOf(nid) >= 0 && nid !== u.id) {
          const prev = g.ownerId;
          g.ownerId = nid;
          g.adminIds = (g.adminIds || []).filter(function (id) { return id !== nid; });
          if (g.adminIds.indexOf(prev) < 0) g.adminIds.push(prev);
          S().persist();
          ui.memberMenu = null;
          toast("Transferiste el grupo. Ahora eres admin.");
        }
        render();
        break;
      }
      case "eliminar-grupo": {
        const cv = db.conversations.find(function (c) { return c.id === (route.params.id || ui.lastChatId); });
        const g = cv && db.groups.find(function (x) { return x.id === cv.groupId; });
        if (g && S().isGroupCreator(g, u.id)) {
          db.groups = db.groups.filter(function (x) { return x.id !== g.id; });
          db.conversations = db.conversations.filter(function (c) { return c.id !== cv.id; });
          S().persist();
          ui.membersOpen = false;
          ui.memberMenu = null;
          ui.lastChatId = null;
          toast("Grupo eliminado.");
          go("raices");
        }
        break;
      }
      case "salir-grupo": {
        const cv = db.conversations.find(function (c) { return c.id === (route.params.id || ui.lastChatId); });
        const g = cv && db.groups.find(function (x) { return x.id === cv.groupId; });
        if (g && !S().isGroupCreator(g, u.id)) {
          g.memberIds = g.memberIds.filter(function (id) { return id !== u.id; });
          g.adminIds = (g.adminIds || []).filter(function (id) { return id !== u.id; });
          cv.memberIds = g.memberIds.slice();
          S().persist();
          ui.membersOpen = false;
          toast("Saliste del grupo.");
          go("mensajes");
        } else if (g) {
          toast("El Creador debe transferir el grupo antes de salir.");
        }
        break;
      }
      case "editar-grupo":
        ui.groupEdit = !ui.groupEdit;
        render();
        break;
      case "guardar-grupo": {
        const cv = db.conversations.find(function (c) { return c.id === (route.params.id || ui.lastChatId); });
        const g = cv && db.groups.find(function (x) { return x.id === cv.groupId; });
        const name = ((document.getElementById("geditname") || {}).value || "").trim();
        if (g && S().isGroupStaff(g, u.id) && name.length >= 2) {
          g.name = name;
          S().persist();
          ui.groupEdit = false;
          toast("Nombre actualizado.");
        }
        render();
        break;
      }
      case "foto-grupo": {
        const cv = db.conversations.find(function (c) { return c.id === (route.params.id || ui.lastChatId); });
        const g = cv && db.groups.find(function (x) { return x.id === cv.groupId; });
        if (g && S().isGroupStaff(g, u.id)) {
          g.photo = "img/cover-lucas.png";
          S().persist();
          toast("Foto de grupo actualizada (prototipo).");
        }
        render();
        break;
      }
      case "abrir-sancion":
        ui.sanctionFor = el.dataset.id;
        ui.sanctionType = "advertencia";
        ui.sanctionDays = 7;
        ui.sanctionNote = "";
        render();
        break;
      case "cerrar-sancion":
        ui.sanctionFor = null;
        render();
        break;
      case "sancion-tipo":
        ui.sanctionType = el.dataset.tipo;
        render();
        break;
      case "aplicar-sancion": {
        if (!S().isPlatformAdmin(u)) return;
        const r = db.reports.find(function (x) { return x.id === el.dataset.id; });
        if (!r) break;
        const tu = S().userById(r.targetId);
        const typ = ui.sanctionType || "advertencia";
        const days = Number(((document.getElementById("sanciondias") || {}).value || ui.sanctionDays || 7));
        const note = ((document.getElementById("sancionmotivo") || {}).value || "").trim() || ("Sanción: " + typ);
        r.status = "cerrado";
        r.action = typ;
        if (tu && typ !== "advertencia") {
          const until = (typ === "silenciar" || typ === "suspension") ? Date.now() + days * 86400000 : null;
          tu.sanction = { type: typ === "silenciar" ? "silenciado" : typ === "suspension" ? "suspendido" : "expulsado", days: until ? days : null, until: until, reason: note, auto: false, at: Date.now() };
          if (typ === "silenciar") tu.status = "silenciado";
          else if (typ === "suspension") { tu.status = "suspendido"; S().invalidateSessions(tu.id); }
          else { tu.status = "expulsado"; S().invalidateSessions(tu.id); }
        } else if (tu && typ === "advertencia") {
          tu.sanction = { type: "advertencia", reason: note, auto: false, at: Date.now() };
        }
        const titles = { advertencia: "Recibiste una advertencia", silenciar: "Tu cuenta fue silenciada", suspension: "Tu cuenta fue suspendida", expulsion: "Tu cuenta fue expulsada" };
        if (tu) S().notify(tu.id, titles[typ] || "Aviso de moderación", note + " Puedes apelar esta medida.", "sancion");
        S().audit(typ, r.targetId, note);
        S().persist();
        ui.sanctionFor = null;
        toast("Sanción aplicada. La persona fue notificada.");
        render();
        break;
      }
      case "descartar-reporte": {
        const r = db.reports.find(function (x) { return x.id === el.dataset.id; });
        if (r) { r.status = "cerrado"; r.action = "descartar"; S().audit("descartar_reporte", r.targetId, r.id); S().persist(); }
        ui.sanctionFor = null;
        toast("Reporte descartado.");
        render();
        break;
      }
      case "moderar":
        ui.sanctionFor = el.dataset.id;
        ui.sanctionType = el.dataset.accion === "advertir" ? "advertencia" : el.dataset.accion === "suspender" ? "suspension" : el.dataset.accion === "banear" ? "expulsion" : "advertencia";
        render();
        break;
      case "report-razon":
        if (ui.reportDraft) ui.reportDraft.reason = el.dataset.id;
        render();
        break;
      case "cerrar-reporte-ui":
        ui.reportDraft = null;
        render();
        break;
      case "enviar-reporte": {
        const d = ui.reportDraft;
        if (!d || !d.reason) { toast("Elige un motivo."); return; }
        const comment = ((document.getElementById("reportcomment") || {}).value || d.comment || "").trim();
        if (d.reason === "otro" && !comment) { toast("En «Otro» hace falta un comentario."); return; }
        db.reports.push({
          id: S().uid("rep"), type: d.type, fromId: u.id, targetId: d.targetId,
          conversationId: d.conversationId || null, messageId: d.messageId || null,
          messageExcerpt: d.excerpt || null, reason: d.reason, comment: comment,
          status: "abierto", action: null, createdAt: Date.now()
        });
        const auto = S().applyAutoAction(d.targetId);
        S().persist();
        ui.reportDraft = null;
        ui.chatMenu = false;
        toast(auto ? "Reporte enviado. La cuenta quedó silenciada hasta revisión." : "Reporte enviado a Hubert.");
        render();
        break;
      }
      case "umbral": {
        if (!S().isPlatformAdmin(u)) return;
        const cur = S().autoActionThreshold();
        const next = Math.min(5, Math.max(3, cur + Number(el.dataset.delta || 0)));
        db.adminSettings = db.adminSettings || {};
        db.adminSettings.autoActionThreshold = next;
        S().audit("umbral_auto", null, String(next));
        S().persist();
        render();
        break;
      }
      case "enviar-apelacion": {
        if (!u) return;
        const text = ((document.getElementById("apelatext") || {}).value || "").trim();
        if (text.length < 8) { toast("Escribe un poco más para que Hubert pueda revisar tu caso."); return; }
        db.appeals.push({
          id: S().uid("ap"), userId: u.id, sanctionType: (u.sanction && u.sanction.type) || u.status,
          text: text, status: "pendiente", createdAt: Date.now()
        });
        S().persist();
        toast("Apelación enviada. Hubert la revisará.");
        render();
        break;
      }
      case "apelacion-resolver": {
        if (!S().isPlatformAdmin(u)) return;
        const a = db.appeals.find(function (x) { return x.id === el.dataset.id; });
        if (!a) break;
        const ok = el.dataset.ok === "1";
        a.status = ok ? "aceptada" : "rechazada";
        a.reviewedAt = Date.now();
        const tu = S().userById(a.userId);
        if (ok && tu) {
          tu.status = "verificado";
          tu.sanction = null;
          S().notify(tu.id, "Apelación aceptada", "Se levantó la sanción. Ya puedes volver a usar Raiz.", "sancion");
        } else if (tu) {
          S().notify(tu.id, "Apelación rechazada", "Se mantiene la medida. Si tienes más información, espera una nueva revisión.", "sancion");
        }
        S().audit(ok ? "apelacion_aceptada" : "apelacion_rechazada", a.userId, a.id);
        S().persist();
        toast(ok ? "Sanción levantada. La persona fue notificada." : "Apelación rechazada.");
        render();
        break;
      }
      case "cerrar-reporte": {
        const r = db.reports.find(function (x) { return x.id === el.dataset.id; });
        if (r) { r.status = "cerrado"; r.action = r.action || "descartar"; }
        S().persist();
        render();
        break;
      }
      case "suspender": {
        const tu = S().userById(el.dataset.id);
        if (tu) tu.status = "suspendido";
        S().audit("suspender", el.dataset.id, "");
        S().persist();
        toast("Cuenta suspendida.");
        render();
        break;
      }
      case "aprobar-recup": {
        const r = db.recovery_requests.find(function (x) { return x.id === el.dataset.id; });
        if (!r) return;
        const tu = S().userById(r.userId);
        if (tu) { tu.phone = r.newPhone; S().invalidateSessions(tu.id); }
        r.status = "aprobada";
        S().audit("recuperacion_numero", r.userId, r.newPhone);
        S().persist();
        toast("Número actualizado. Las sesiones anteriores se cerraron.");
        render();
        break;
      }
      case "rechazar-recup": {
        const r = db.recovery_requests.find(function (x) { return x.id === el.dataset.id; });
        if (r) r.status = "rechazada";
        S().persist();
        render();
        break;
      }
      default:
        break;
    }
  }

  async function submitOtp() {
    const res = S().verifyOtp(flow.otpId, flow.otpInput);
    if (!res.ok) { toast(res.error); flow.otpInput = ""; render(); return; }
    if (flow.purpose === "reset") go("nueva-contrasena");
    else go("contrasena");
  }

  async function ensureSeed() { await S().seed(); }
  async function loginAs(id) { await ensureSeed(); S().createSession(id); }

  async function prepareShot(id) {
    ui = { perfilTab: "real", inicioTab: "descubrir", chatMenu: false, search: "", installHint: true, pass1: "", pass2: "", show1: false, show2: false, recording: false, recAt: 0, calling: false, membersOpen: false, playingVoice: null, replyTo: null, msgMenu: null, lastChatId: null, forwardFrom: null, memberMenu: null, groupEdit: false, rejectVerif: null, rejectDraft: "", sanctionFor: null, sanctionType: "advertencia", sanctionDays: 7, sanctionNote: "", reportDraft: null };
    flow = {};
    draft = { realName: "", dniFront: null, dniBack: null, selfie: null, step: 1 };
    await S().reset();
    S().get().installBannerDismissed = false;
    const notice = document.getElementById("notice");
    if (notice) { notice.hidden = true; notice.innerHTML = ""; clearTimeout(notice._t); }
    const toastEl = document.getElementById("toast");
    if (toastEl) { toastEl.hidden = true; }
    const shots = {
      "bienvenida": function () { S().logout(); go("bienvenida", {}, { replace: true }); },
      "registro": function () { S().logout(); go("registro", {}, { replace: true }); },
      "otp": function () {
        S().logout();
        const res = S().issueOtp("+51999888700", "register", "124793");
        flow.phone = "+51999888700"; flow.otpId = res.otp.id; flow.purpose = "register";
        flow.demoCode = "124793"; flow.expiresAt = Date.now() + 165000; flow.otpInput = "124793";
        go("otp", {}, { replace: true });
      },
      "contrasena": function () {
        S().logout(); flow.purpose = "register"; flow.phone = "+51999888700";
        ui.pass1 = "Raiz2026!"; ui.pass2 = "Raiz2026!";
        go("contrasena", {}, { replace: true });
      },
      "login": function () { S().logout(); go("login", {}, { replace: true }); },
      "olvide": function () { S().logout(); go("olvide", {}, { replace: true }); },
      "olvide-otp": function () {
        S().logout();
        const res = S().issueOtp("+51999111222", "reset", "124793");
        flow.phone = "+51999111222"; flow.otpId = res.otp.id; flow.purpose = "reset";
        flow.demoCode = "124793"; flow.expiresAt = Date.now() + 165000; flow.otpInput = "";
        go("olvide-otp", {}, { replace: true });
      },
      "nueva-contrasena": function () {
        S().logout(); flow.purpose = "reset"; flow.phone = "+51999111222";
        go("nueva-contrasena", {}, { replace: true });
      },
      "perdi-numero": function () { S().logout(); go("perdi-numero", {}, { replace: true }); },
      "qr-entrada": function () { S().logout(); go("qr-entrada", {}, { replace: true }); },
      "verificacion-1": async function () { await loginAs("u-pendiente"); draft.step = 1; go("verificacion", { step: "1" }, { replace: true }); },
      "verificacion-2": async function () {
        await loginAs("u-pendiente");
        draft.realName = "María González López";
        draft.dniFront = "img/dni-muestra.png";
        draft.dniBack = "img/dni-muestra.png";
        draft.selfie = "img/cover-maria.png";
        draft.step = 2;
        go("verificacion", { step: "2" }, { replace: true });
      },
      "verificacion-3": async function () {
        await loginAs("u-pendiente");
        draft.realName = "María González López";
        draft.dniFront = "img/dni-muestra.png";
        draft.dniBack = "img/dni-muestra.png";
        draft.selfie = "img/cover-maria.png";
        draft.step = 3;
        go("verificacion", { step: "3" }, { replace: true });
      },
      "pendiente": async function () { await loginAs("u-pendiente"); go("pendiente", {}, { replace: true }); },
      "mensajes": async function () { await loginAs("u-maria"); S().get().installBannerDismissed = true; go("mensajes", {}, { replace: true }); },
      "mensajes-banner": async function () { await loginAs("u-maria"); S().get().installBannerDismissed = false; ui.installHint = true; go("mensajes", {}, { replace: true }); },
      "chat": async function () { await loginAs("u-maria"); ui.chatMenu = false; go("chat", { id: "cv-lucas" }, { replace: true }); },
      "chat-menu": async function () { await loginAs("u-maria"); ui.chatMenu = true; go("chat", { id: "cv-lucas" }, { replace: true }); },
      "inicio": async function () { await loginAs("u-maria"); S().get().installBannerDismissed = true; ui.inicioTab = "descubrir"; go("inicio", { tab: "descubrir" }, { replace: true }); },
      "solicitudes": async function () { await loginAs("u-maria"); ui.inicioTab = "solicitudes"; go("inicio", { tab: "solicitudes" }, { replace: true }); },
      "comunidad": async function () { await loginAs("u-maria"); go("comunidad", {}, { replace: true }); },
      "perfil-real": async function () { await loginAs("u-maria"); ui.perfilTab = "real"; go("perfil", { tab: "real" }, { replace: true }); },
      "perfil-chat": async function () { await loginAs("u-maria"); ui.perfilTab = "chat"; go("perfil", { tab: "chat" }, { replace: true }); },
      "raices": async function () { await loginAs("u-maria"); go("raices", {}, { replace: true }); },
      "crear-grupo": async function () { await loginAs("u-maria"); go("crear-grupo", {}, { replace: true }); },
      "qr": async function () { await loginAs("u-maria"); go("qr", {}, { replace: true }); },
      "escanear": async function () { await loginAs("u-maria"); go("escanear", {}, { replace: true }); },
      "planes": async function () { await loginAs("u-maria"); go("planes", {}, { replace: true }); },
      "pago": async function () { await loginAs("u-maria"); flow.plan = "plus"; go("pago", { plan: "plus" }, { replace: true }); },
      "instalar": async function () { await loginAs("u-maria"); go("instalar", {}, { replace: true }); },
      "ajustes": async function () { await loginAs("u-maria"); go("ajustes", {}, { replace: true }); },
      "admin": async function () { await loginAs("u-admin"); go("admin", {}, { replace: true }); },
      "admin-verificaciones": async function () { await loginAs("u-admin"); go("admin-verificaciones", {}, { replace: true }); },
      "admin-pagos": async function () { await loginAs("u-admin"); go("admin-pagos", {}, { replace: true }); },
      "admin-reportes": async function () { await loginAs("u-admin"); go("admin-reportes", {}, { replace: true }); },
      "admin-recuperacion": async function () { await loginAs("u-admin"); go("admin-recuperacion", {}, { replace: true }); },
      "admin-rechazar": async function () { await loginAs("u-admin"); ui.rejectVerif = "iv-dup"; ui.rejectDraft = ""; go("admin-verificaciones", {}, { replace: true }); },
      "admin-sancion": async function () { await loginAs("u-admin"); ui.sanctionFor = "rep-2"; ui.sanctionType = "silenciar"; ui.sanctionDays = 7; go("admin-reportes", {}, { replace: true }); },
      "admin-apelaciones": async function () { await loginAs("u-admin"); go("admin-apelaciones", {}, { replace: true }); },
      "admin-ajustes": async function () { await loginAs("u-admin"); go("admin-ajustes", {}, { replace: true }); },
      "admin-historial": async function () { await loginAs("u-admin"); go("admin-historial", {}, { replace: true }); },
      "rechazado": async function () { await loginAs("u-rechazado"); go("rechazado", {}, { replace: true }); },
      "chat-grabar": async function () { await loginAs("u-maria"); ui.recording = true; ui.recAt = Date.now() - 7000; go("chat", { id: "cv-lucas" }, { replace: true }); },
      "chat-llamada": async function () { await loginAs("u-maria"); ui.calling = true; go("chat", { id: "cv-lucas" }, { replace: true }); },
      "chat-gratis": async function () { await loginAs("u-lucas"); ui.chatMenu = false; go("chat", { id: "cv-lucas" }, { replace: true }); },
      "grupo-miembros": async function () { await loginAs("u-maria"); ui.membersOpen = true; ui.memberMenu = "u-ana"; go("chat", { id: "cv-lima" }, { replace: true }); },
      "escritorio": async function () { await loginAs("u-maria"); ui.lastChatId = "cv-lucas"; go("chat", { id: "cv-lucas" }, { replace: true }); },
      "aviso": async function () {
        await loginAs("u-maria");
        S().get().installBannerDismissed = true;
        go("mensajes", {}, { replace: true });
        setTimeout(function () {
          const pr = S().profileOf("u-lucas");
          const nick = S().tag(pr);
          const av = pr && pr.avatar ? '<img class="avatar-sm" src="' + pr.avatar + '" alt="">' : "";
          showNotice(nick + " te escribió", "Nota de voz", av);
        }, 50);
      },
      "chat-acciones": async function () { await loginAs("u-maria"); ui.msgMenu = "m3"; go("chat", { id: "cv-lucas" }, { replace: true }); },
      "videollamada": async function () { await loginAs("u-maria"); ui.calling = { mode: "video", convId: "cv-lucas" }; go("chat", { id: "cv-lucas" }, { replace: true }); },
      "videollamada-grupo": async function () { await loginAs("u-maria"); ui.calling = { mode: "video", convId: "cv-lima" }; go("chat", { id: "cv-lima" }, { replace: true }); }
    };
    const fn = shots[id];
    if (!fn) throw new Error("Shot desconocido: " + id);
    await fn();
    return id;
  }

  async function boot() {
    try { await S().seed(); } catch (e) { console.warn(e); }
    parseHash();
    if (!location.hash || location.hash === "#" || location.hash === "#/") {
      const u = me();
      go(u ? S().postLoginRoute(u) : "bienvenida", {}, { replace: true });
    } else {
      render();
    }
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js", { scope: "./" }).catch(function () {});
    }
  }

  window.addEventListener("popstate", function () { parseHash(); render(); });
  window.addEventListener("hashchange", function () { parseHash(); render(); });

  window.Raiz = {
    go: go,
    render: render,
    prepareShot: prepareShot,
    loginAs: loginAs,
    loginDemo: function () { return loginAs("u-maria").then(function () { go("mensajes"); }); },
    loginAdmin: function () { return loginAs("u-admin").then(function () { go("admin"); }); },
    reset: function () { return S().reset().then(function () { S().logout(); go("bienvenida"); }); },
    get route() { return route; },
    get flow() { return flow; },
    store: S
  };

  boot();
})();
