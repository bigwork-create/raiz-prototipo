/* Raiz — almacén local del prototipo (sin backend).
   En producción: Firestore/Auth, contraseñas con argon2id/bcrypt, nunca en claro. */
(function (global) {
  const KEY = "raiz.prototipo.v4";
  const SALT = "raiz-proto-salt";

  const now = () => Date.now();
  const uid = (p) => p + "-" + Math.random().toString(36).slice(2, 8) + now().toString(36);

  function bytesToHex(buf) {
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  async function hashPassword(plain) {
    const data = new TextEncoder().encode(SALT + ":" + plain);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return "sha256$" + bytesToHex(buf);
  }
  async function verifyPassword(plain, hashed) {
    if (!hashed) return false;
    const h = await hashPassword(plain);
    return h === hashed;
  }

  function normalizePhone(input, defaultCc) {
    defaultCc = defaultCc || "+51";
    if (!input) return "";
    let s = String(input).trim();
    s = s.replace(/[^\d+]/g, "");
    if (s.startsWith("00")) s = "+" + s.slice(2);
    if (s.startsWith("+")) {
      /* already E.164-ish */
    } else if (s.startsWith("51") && s.length >= 11) {
      s = "+" + s;
    } else {
      s = s.replace(/^0+/, "");
      s = defaultCc + s;
    }
    s = "+" + s.replace(/[^\d]/g, "");
    return s;
  }

  function formatPhone(e164) {
    const d = String(e164 || "").replace(/[^\d]/g, "");
    if (d.startsWith("51") && d.length === 11) {
      return "+51 " + d.slice(2, 5) + " " + d.slice(5, 8) + " " + d.slice(8);
    }
    if (d.startsWith("51") && d.length > 2) {
      const rest = d.slice(2);
      return "+51 " + rest.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
    }
    return e164 || "";
  }

  function maskPhone(e164) {
    const d = String(e164 || "").replace(/[^\d]/g, "");
    if (d.startsWith("51") && d.length >= 11) {
      return "+51 " + d.slice(2, 3) + "*** **" + d.slice(-2);
    }
    return formatPhone(e164);
  }

  function emptyState() {
    return {
      users: [],
      identity_verifications: [],
      chat_profiles: [],
      subscriptions: [],
      payments: [],
      connections: [],
      conversations: [],
      messages: [],
      groups: [],
      blocks: [],
      reports: [],
      invites_qr: [],
      otp_requests: [],
      sessions: [],
      admin_audit: [],
      recovery_requests: [],
      appeals: [],
      notifications: [],
      session: null,
      installBannerDismissed: false,
      soundEnabled: true,
      adminSettings: { autoActionThreshold: 3 },
    };
  }

  let db = emptyState();

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(db));
    } catch (e) {
      console.warn("localStorage", e);
    }
  }
  function loadRaw() {
    try {
      const t = localStorage.getItem(KEY);
      if (t) db = Object.assign(emptyState(), JSON.parse(t));
    } catch (e) {
      db = emptyState();
    }
  }

  function userById(id) {
    return db.users.find((u) => u.id === id) || null;
  }
  function profileOf(userId) {
    return db.chat_profiles.find((p) => p.userId === userId) || null;
  }
  function userByPhone(phone) {
    const n = normalizePhone(phone);
    return db.users.find((u) => u.phone === n) || null;
  }
  function tag(p) {
    return p ? p.nickname + "#" + p.discriminator : "";
  }
  function publicName(viewer, target) {
    const u = typeof target === "string" ? userById(target) : target;
    if (!u) return "";
    const p = profileOf(u.id);
    const hide = u.plan === "plus" && u.hideRealName;
    if (!hide && u.realName && viewer && viewer.id === u.id) return u.realName;
    /* otros ven nombre real solo si no está oculto y no es premium hide */
    if (!hide && u.realName && viewer && viewer.id !== u.id) {
      /* nombre real visible para conexiones? especificación: premium puede ocultarlo.
         Por defecto el nombre real no se muestra en chat; en comunidad se puede mostrar
         si no está oculto. En prototipo: visible en perfil real propio; en cards solo apodo. */
    }
    return tag(p);
  }

  const SEED_USERS = [
    {
      id: "u-maria",
      phone: "+51999111222",
      realName: "María López",
      facePhoto: "img/cover-maria.png",
      avatar: "img/cover-maria.png",
      status: "verificado",
      role: "usuario",
      plan: "plus",
      hideRealName: true,
      bio: "Exploradora de ideas, amante del café y las buenas conversaciones ☕✨",
      nickname: "María",
      discriminator: "4821",
      interests: ["Café", "Ideas", "Conversar"],
    },
    {
      id: "u-admin",
      phone: "+51999000001",
      realName: "Hubert",
      facePhoto: "img/avatar-hubert.png",
      avatar: "img/avatar-hubert.png",
      status: "verificado",
      role: "admin",
      plan: "plus",
      hideRealName: false,
      bio: "Titular único de Raiz. Única cuenta de administración.",
      nickname: "Hubert",
      discriminator: "0001",
      interests: ["Comunidad"],
    },
    {
      id: "u-juan",
      phone: "+51999123001",
      realName: "Juan Rivera",
      facePhoto: "img/cover-juan.png",
      avatar: "img/cover-juan.png",
      cover: "img/cover-juan.png",
      status: "verificado",
      role: "usuario",
      plan: "gratis",
      hideRealName: false,
      bio: "Le gusta viajar y la fotografía",
      nickname: "Juan",
      discriminator: "1234",
      interests: ["Viajes", "Fotografía", "Aventura"],
    },
    {
      id: "u-ana",
      phone: "+51999123002",
      realName: "Ana Torres",
      facePhoto: "img/cover-ana.png",
      avatar: "img/cover-ana.png",
      cover: "img/cover-ana.png",
      status: "verificado",
      role: "usuario",
      plan: "basic",
      hideRealName: false,
      bio: "Ama el café, los libros y las charlas profundas.",
      nickname: "Ana",
      discriminator: "5678",
      interests: ["Lectura", "Café", "Mindfulness"],
    },
    {
      id: "u-mateo",
      phone: "+51999123003",
      realName: "Mateo Quispe",
      facePhoto: "img/cover-mateo.png",
      avatar: "img/cover-mateo.png",
      cover: "img/cover-mateo.png",
      status: "verificado",
      role: "usuario",
      plan: "gratis",
      hideRealName: false,
      bio: "Desarrollador, gamer y fan de la ciencia ficción.",
      nickname: "Mateo",
      discriminator: "9101",
      interests: ["Tecnología", "Videojuegos", "Ciencia ficción"],
    },
    {
      id: "u-lau",
      phone: "+51999123004",
      realName: "Laura Vega",
      facePhoto: "img/cover-lau.png",
      avatar: "img/cover-lau.png",
      cover: "img/cover-lau.png",
      status: "verificado",
      role: "usuario",
      plan: "gratis",
      hideRealName: false,
      bio: "Artista en proceso y amante de la música.",
      nickname: "Lau",
      discriminator: "3344",
      interests: ["Arte", "Música", "Creatividad"],
    },
    {
      id: "u-nico",
      phone: "+51999123005",
      realName: "Nico Salas",
      facePhoto: "img/cover-nico.png",
      avatar: "img/cover-nico.png",
      cover: "img/cover-nico.png",
      status: "verificado",
      role: "usuario",
      plan: "gratis",
      hideRealName: false,
      bio: "Senderismo, naturaleza y buena música.",
      nickname: "Nico",
      discriminator: "5566",
      interests: ["Senderismo", "Naturaleza", "Música"],
    },
    {
      id: "u-vale",
      phone: "+51999123006",
      realName: "Valentina Ruiz",
      facePhoto: "img/cover-vale.png",
      avatar: "img/cover-vale.png",
      cover: "img/cover-vale.png",
      status: "verificado",
      role: "usuario",
      plan: "plus",
      hideRealName: true,
      bio: "Psicóloga, fan de los perros y el yoga.",
      nickname: "Vale",
      discriminator: "7788",
      interests: ["Psicología", "Perros", "Yoga"],
    },
    {
      id: "u-carlos",
      phone: "+51999123007",
      realName: "Carlos Díaz",
      facePhoto: "img/cover-carlos.png",
      avatar: "img/cover-carlos.png",
      cover: "img/cover-carlos.png",
      status: "verificado",
      role: "usuario",
      plan: "gratis",
      hideRealName: false,
      bio: "Intereses en común: café y viajes.",
      nickname: "Carlos",
      discriminator: "4422",
      interests: ["Café", "Viajes"],
    },
    {
      id: "u-sofia",
      phone: "+51999123008",
      realName: "Sofía Castro",
      facePhoto: "img/cover-sofia.png",
      avatar: "img/cover-sofia.png",
      cover: "img/cover-sofia.png",
      status: "verificado",
      role: "usuario",
      plan: "basic",
      hideRealName: false,
      bio: "Diseño, música y charlas nocturnas.",
      nickname: "Sofía",
      discriminator: "0912",
      interests: ["Diseño", "Música"],
    },
    {
      id: "u-diego",
      phone: "+51999123009",
      realName: "Diego Ramos",
      facePhoto: "img/cover-diego.png",
      avatar: "img/cover-diego.png",
      cover: "img/cover-diego.png",
      status: "verificado",
      role: "usuario",
      plan: "gratis",
      hideRealName: false,
      bio: "Cine, trekking y buena cocina.",
      nickname: "Diego",
      discriminator: "7711",
      interests: ["Cine", "Trekking"],
    },
    {
      id: "u-lucas",
      phone: "+51999123010",
      realName: "Lucas Mendoza",
      facePhoto: "img/cover-lucas.png",
      avatar: "img/cover-lucas.png",
      cover: "img/cover-lucas.png",
      status: "verificado",
      role: "usuario",
      plan: "gratis",
      hideRealName: false,
      bio: "Organizo el círculo de los jueves.",
      nickname: "Lucas",
      discriminator: "2041",
      interests: ["Comunidad", "Café"],
    },
    {
      id: "u-rafael",
      phone: "+51999123011",
      realName: "Rafael Almeida",
      facePhoto: "img/cover-rafael.png",
      avatar: "img/cover-rafael.png",
      cover: "img/cover-rafael.png",
      status: "verificado",
      role: "usuario",
      plan: "gratis",
      hideRealName: false,
      bio: "Siempre con un libro bajo el brazo.",
      nickname: "Rafael",
      discriminator: "3302",
      interests: ["Lectura"],
    },
    {
      id: "u-pendiente",
      phone: "+51999888777",
      realName: "Juan Pérez García",
      facePhoto: "img/avatar-face.png",
      avatar: "img/avatar-pending.png",
      status: "pendiente_verificacion",
      role: "usuario",
      plan: "gratis",
      hideRealName: false,
      bio: "",
      nickname: "JuanP",
      discriminator: "6190",
      interests: [],
      dniNumber: "10886721",
    },
    {
      id: "u-dup",
      phone: "+51999888666",
      realName: "María López",
      facePhoto: "img/cover-maria.png",
      avatar: "img/cover-maria.png",
      status: "pendiente_verificacion",
      role: "usuario",
      plan: "gratis",
      hideRealName: false,
      bio: "",
      nickname: "MariaL",
      discriminator: "9901",
      interests: [],
      dniNumber: "45678912",
    },
    {
      id: "u-rechazado",
      phone: "+51999888555",
      realName: "Pedro Salas Ruiz",
      facePhoto: "img/avatar-face.png",
      avatar: "img/avatar-pending.png",
      status: "rechazado",
      role: "usuario",
      plan: "gratis",
      hideRealName: false,
      bio: "",
      nickname: "PedroS",
      discriminator: "4410",
      interests: [],
      dniNumber: "70651234",
    },
  ];

  async function seed(force) {
    if (!force && db.users && db.users.length) return;
    const pass = await hashPassword("Raiz2026!");
    const t = now();
    db = emptyState();
    db.users = SEED_USERS.map((s) => ({
      id: s.id,
      phone: s.phone,
      passwordHash: pass,
      realName: s.realName,
      facePhoto: s.facePhoto,
      dniNumber: s.dniNumber || (s.id === "u-maria" ? "45678912" : s.id === "u-admin" ? "00000001" : null),
      dniFront: (s.id === "u-pendiente" || s.id === "u-dup" || s.id === "u-rechazado" || s.id === "u-maria") ? "img/dni-muestra.png" : null,
      dniBack: (s.id === "u-pendiente" || s.id === "u-dup" || s.id === "u-rechazado" || s.id === "u-maria") ? "img/dni-muestra.png" : null,
      status: s.status,
      role: s.role,
      plan: s.plan,
      hideRealName: !!s.hideRealName,
      sanction: null,
      createdAt: t - 86400000 * 20,
      verifiedAt: s.status === "verificado" ? t - 86400000 * 10 : null,
    }));
    db.chat_profiles = SEED_USERS.map((s) => ({
      id: "p-" + s.id,
      userId: s.id,
      nickname: s.nickname,
      discriminator: s.discriminator,
      avatar: s.avatar,
      bio: s.bio,
      interests: s.interests || [],
      cover: s.cover || s.avatar,
      updatedAt: t,
    }));
    db.subscriptions = db.users
      .filter((u) => u.plan !== "gratis")
      .map((u) => ({
        id: "sub-" + u.id,
        userId: u.id,
        plan: u.plan,
        status: "activa",
        cycle: "mensual",
        method: "transferencia",
        startedAt: t - 86400000 * 8,
        autoRenew: false,
      }));
    db.connections = [
      { id: "c1", fromId: "u-carlos", toId: "u-maria", status: "pendiente", createdAt: t - 7200000 },
      { id: "c2", fromId: "u-sofia", toId: "u-maria", status: "pendiente", createdAt: t - 18000000 },
      { id: "c3", fromId: "u-diego", toId: "u-maria", status: "pendiente", createdAt: t - 86400000 },
      { id: "c4", fromId: "u-maria", toId: "u-lucas", status: "aceptada", createdAt: t - 86400000 * 6 },
      { id: "c5", fromId: "u-maria", toId: "u-ana", status: "aceptada", createdAt: t - 86400000 * 5 },
      { id: "c6", fromId: "u-maria", toId: "u-vale", status: "aceptada", createdAt: t - 86400000 * 4 },
      { id: "c7", fromId: "u-maria", toId: "u-rafael", status: "aceptada", createdAt: t - 86400000 * 3 },
      { id: "c8", fromId: "u-maria", toId: "u-juan", status: "enviada", createdAt: t - 3600000 },
    ];
    /* enviada from maria to juan: status pending from maria side */
    db.connections[7].status = "pendiente";

    const day = new Date();
    day.setHours(10, 21, 0, 0);
    const t0 = day.getTime();
    db.conversations = [
      { id: "cv-lucas", type: "direct", memberIds: ["u-maria", "u-lucas"], lastAt: t0 + 5 * 60000, lastText: "Nota de voz" },
      { id: "cv-sofia", type: "direct", memberIds: ["u-maria", "u-sofia"], lastAt: t0 - 3600000, lastText: "Perfecto, vamos así." },
      { id: "cv-rafael", type: "direct", memberIds: ["u-maria", "u-rafael"], lastAt: t0 - 86400000, lastText: "Entendido, te aviso después." },
      { id: "cv-lima", type: "group", groupId: "g-lima", memberIds: ["u-maria", "u-lucas", "u-ana", "u-vale"], lastAt: t0 - 540000, lastText: "Ana: ¿Alguien se apunta al café de mañana?" },
      { id: "cv-lectura", type: "group", groupId: "g-lectura", memberIds: ["u-maria", "u-rafael", "u-ana"], lastAt: t0 - 86400000, lastText: "Rafael: Subí la lista de lecturas." },
    ];
    db.messages = [
      { id: "m1", conversationId: "cv-lucas", fromId: "u-lucas", type: "text", text: "¡Hola! ¿Viste la convocatoria del círculo de esta semana?", at: t0, reactions: [{ emoji: "👍", userIds: ["u-maria"] }] },
      { id: "m2", conversationId: "cv-lucas", fromId: "u-maria", type: "text", text: "Sí, me anoté. ¿Nos vemos en el café de siempre?", at: t0 + 60000, read: true },
      { id: "m3", conversationId: "cv-lucas", fromId: "u-lucas", type: "text", text: "De acuerdo. Podemos llegar un poco antes para reservar mesa.", at: t0 + 120000, reactions: [{ emoji: "❤️", userIds: ["u-maria"] }] },
      { id: "m4", conversationId: "cv-lucas", fromId: "u-maria", type: "text", text: "Perfecto. Ahí nos vemos.", at: t0 + 180000, read: true, replyTo: "m3" },
      { id: "m8", conversationId: "cv-lucas", fromId: "u-lucas", type: "image", text: "", mediaUrl: "img/cover-lucas.png", at: t0 + 240000 },
      { id: "m9", conversationId: "cv-lucas", fromId: "u-maria", type: "voice", text: "", duration: 14, at: t0 + 300000, read: true },
      { id: "m5", conversationId: "cv-sofia", fromId: "u-sofia", type: "text", text: "Perfecto, vamos así.", at: t0 - 3600000 },
      { id: "m6", conversationId: "cv-rafael", fromId: "u-rafael", type: "text", text: "Entendido, te aviso después.", at: t0 - 86400000 },
      { id: "m7", conversationId: "cv-lima", fromId: "u-ana", type: "text", text: "¿Alguien se apunta al café de mañana?", at: t0 - 540000, reactions: [{ emoji: "☕", userIds: ["u-maria", "u-vale"] }] },
      { id: "m-rep-a", conversationId: "cv-lima", fromId: "u-vale", type: "text", text: "Yo me apunto. ¿A qué hora?", at: t0 - 500000 },
      { id: "m-rep", conversationId: "cv-lima", fromId: "u-diego", type: "text", text: "Te escribo por aquí aunque no estemos conectados…", at: t0 - 480000 },
      { id: "m-rep-b", conversationId: "cv-lima", fromId: "u-ana", type: "text", text: "Diego, este es un grupo de quedadas. Por favor respeta.", at: t0 - 460000 },
    ];
    db.groups = [
      { id: "g-lima", name: "Círculo Lima", description: "Quedadas y conversaciones en la ciudad.", ownerId: "u-lucas", adminIds: ["u-maria"], memberIds: ["u-maria", "u-lucas", "u-ana", "u-vale"], createdAt: t - 86400000 * 12 },
      { id: "g-lectura", name: "Café y lecturas", description: "Libros, reseñas y recomendaciones.", ownerId: "u-rafael", adminIds: ["u-rafael"], memberIds: ["u-maria", "u-rafael", "u-ana"], createdAt: t - 86400000 * 9 },
    ];
    db.invites_qr = [
      { id: "inv-1", code: "RAIZ-7K2M", createdBy: "u-maria", url: "https://raiz.app/i/RAIZ-7K2M", uses: 3, maxUses: 50, createdAt: t - 86400000 },
    ];
    db.identity_verifications = [
      {
        id: "iv-pend",
        userId: "u-pendiente",
        realName: "Juan Pérez García",
        dniNumber: "10886721",
        facePhoto: "img/avatar-face.png",
        dniFront: "img/dni-muestra.png",
        dniBack: "img/dni-muestra.png",
        status: "pendiente",
        reason: null,
        submittedAt: t - 3600000,
      },
      {
        id: "iv-dup",
        userId: "u-dup",
        realName: "María López",
        dniNumber: "45678912",
        facePhoto: "img/cover-maria.png",
        dniFront: "img/dni-muestra.png",
        dniBack: "img/dni-muestra.png",
        status: "pendiente",
        reason: null,
        submittedAt: t - 1800000,
      },
      {
        id: "iv-rech",
        userId: "u-rechazado",
        realName: "Pedro Salas Ruiz",
        dniNumber: "70651234",
        facePhoto: "img/avatar-face.png",
        dniFront: "img/dni-muestra.png",
        dniBack: "img/dni-muestra.png",
        status: "rechazada",
        reason: "El DNI se ve borroso y no se lee el número. Vuelve a tomarlo con buena luz, sin reflejos.",
        submittedAt: t - 86400000 * 2,
        reviewedAt: t - 80000000,
      },
    ];
    db.payments = [
      {
        id: "pay-0",
        userId: "u-maria",
        plan: "plus",
        amount: "9.99",
        currency: "USD",
        method: "transferencia",
        voucher: "img/voucher-muestra.png",
        status: "confirmado",
        createdAt: t - 86400000 * 12,
        reviewedAt: t - 86400000 * 11,
        note: "Plus mensual de María (ya confirmado).",
      },
      {
        id: "pay-1",
        userId: "u-sofia",
        plan: "plus",
        amount: "9.99",
        currency: "USD",
        method: "transferencia",
        voucher: "img/voucher-muestra.png",
        status: "pendiente",
        createdAt: t - 5400000,
        note: "Yape / transferencia mensual (comprobante de prototipo).",
      },
    ];
    db.reports = [
      {
        id: "rep-1",
        type: "user",
        fromId: "u-ana",
        targetId: "u-diego",
        conversationId: null,
        messageId: null,
        reason: "acoso",
        comment: "Mensajes incómodos tras rechazar una solicitud.",
        status: "abierto",
        action: null,
        createdAt: t - 7200000,
      },
      {
        id: "rep-2",
        type: "message",
        fromId: "u-vale",
        targetId: "u-diego",
        conversationId: "cv-lima",
        messageId: "m-rep",
        messageExcerpt: "Te escribo por aquí aunque no estemos conectados…",
        reason: "acoso",
        comment: "Entró al grupo a escribir aunque no estamos conectados.",
        status: "abierto",
        action: null,
        createdAt: t - 3600000,
      },
      {
        id: "rep-3",
        type: "user",
        fromId: "u-sofia",
        targetId: "u-diego",
        conversationId: null,
        messageId: null,
        reason: "spam",
        comment: "Varias solicitudes y mensajes repetidos.",
        status: "abierto",
        action: null,
        createdAt: t - 1800000,
      },
    ];
    const diego = db.users.find(function (u) { return u.id === "u-diego"; });
    if (diego) {
      diego.status = "silenciado";
      diego.sanction = {
        type: "silenciado",
        days: null,
        until: null,
        reason: "Oculto automáticamente al alcanzar 3 reportes de personas distintas. Pendiente de revisión.",
        auto: true,
        at: t - 1700000,
      };
    }
    db.appeals = [
      {
        id: "ap-1",
        userId: "u-diego",
        sanctionType: "silenciado",
        text: "No era mi intención molestar. Puedo explicarlo. Pido que revisen el caso.",
        status: "pendiente",
        createdAt: t - 1200000,
      },
    ];
    db.notifications = [
      {
        id: "nt-1",
        userId: "u-diego",
        title: "Tu cuenta fue silenciada",
        body: "Oculto automáticamente al alcanzar 3 reportes de personas distintas. Puedes apelar.",
        type: "sancion",
        read: false,
        at: t - 1700000,
      },
      {
        id: "nt-2",
        userId: "u-rechazado",
        title: "No pudimos verificar tu identidad",
        body: "El DNI se ve borroso y no se lee el número. Vuelve a tomarlo con buena luz, sin reflejos.",
        type: "verificacion",
        read: false,
        at: t - 80000000,
      },
    ];
    db.adminSettings = { autoActionThreshold: 3 };
    db.recovery_requests = [
      {
        id: "rec-1",
        userId: "u-pendiente",
        claimedName: "Juan Pérez García",
        oldPhone: "+51999888777",
        newPhone: "+51999777666",
        note: "Perdí el chip. Puedo verificar con mi DNI y la foto de rostro.",
        status: "pendiente",
        createdAt: t - 4000000,
      },
    ];
    db.admin_audit = [
      { id: "au-1", adminId: "u-admin", action: "verificacion_aprobada", targetId: "u-maria", at: t - 86400000 * 18, detail: "Identidad de María López aprobada." },
      { id: "au-2", adminId: "u-admin", action: "pago_aprobado", targetId: "u-maria", at: t - 86400000 * 10, detail: "Comprobante Plus de María López confirmado (USD 9.99)." },
      { id: "au-3", adminId: "u-admin", action: "auto_silencio", targetId: "u-diego", at: t - 1700000, detail: "Diego Ramos silenciado al alcanzar 3 denunciantes distintos." },
    ];
    persist();
  }

  function currentUser() {
    if (!db.session) return null;
    const s = db.sessions.find((x) => x.id === db.session.sessionId && x.active);
    if (!s) return null;
    if (s.expiresAt && s.expiresAt < now()) return null;
    return userById(s.userId);
  }

  function audit(action, targetId, detail) {
    const u = currentUser();
    db.admin_audit.push({
      id: uid("au"),
      adminId: u ? u.id : null,
      action,
      targetId: targetId || null,
      detail: detail || "",
      at: now(),
    });
  }

  function createSession(userId) {
    const s = {
      id: uid("ses"),
      userId,
      active: true,
      createdAt: now(),
      expiresAt: now() + 1000 * 60 * 60 * 24 * 30,
    };
    db.sessions.push(s);
    db.session = { userId, sessionId: s.id };
    persist();
    return s;
  }

  function invalidateSessions(userId) {
    db.sessions.forEach((s) => {
      if (s.userId === userId) s.active = false;
    });
    if (db.session && db.session.userId === userId) db.session = null;
    persist();
  }

  /* OTP rules (mock): 6 dígitos, 5 min, máx 5 intentos, rate limit */
  const OTP_TTL = 5 * 60 * 1000;
  const OTP_MAX_ATTEMPTS = 5;
  const OTP_RATE_NUMBER = 3;
  const OTP_RATE_WINDOW = 15 * 60 * 1000;
  const OTP_RATE_IP = 5;

  function mockIp() {
    return "local-prototype";
  }

  function canSendOtp(phone) {
    const n = normalizePhone(phone);
    const since = now() - OTP_RATE_WINDOW;
    const byNum = db.otp_requests.filter((o) => o.phone === n && o.createdAt >= since).length;
    const byIp = db.otp_requests.filter((o) => o.ip === mockIp() && o.createdAt >= since).length;
    if (byNum >= OTP_RATE_NUMBER) return { ok: false, error: "Demasiados envíos a este número. Espera 15 minutos." };
    if (byIp >= OTP_RATE_IP) return { ok: false, error: "Demasiados envíos desde este dispositivo. Espera 15 minutos." };
    return { ok: true };
  }

  function issueOtp(phone, purpose, codeOverride) {
    const gate = canSendOtp(phone);
    if (!gate.ok) return gate;
    const n = normalizePhone(phone);
    const code = codeOverride || String(Math.floor(100000 + Math.random() * 900000));
    const rec = {
      id: uid("otp"),
      phone: n,
      purpose, /* register | reset */
      code,
      createdAt: now(),
      expiresAt: now() + OTP_TTL,
      attempts: 0,
      maxAttempts: OTP_MAX_ATTEMPTS,
      consumed: false,
      ip: mockIp(),
    };
    db.otp_requests.push(rec);
    persist();
    return { ok: true, otp: rec, demoCode: code };
  }

  function verifyOtp(otpId, code) {
    const rec = db.otp_requests.find((o) => o.id === otpId);
    if (!rec) return { ok: false, error: "Código no válido." };
    if (rec.consumed) return { ok: false, error: "Ese código ya fue usado." };
    if (rec.expiresAt < now()) return { ok: false, error: "El código expiró. Solicita uno nuevo." };
    rec.attempts += 1;
    if (rec.attempts > rec.maxAttempts) {
      persist();
      return { ok: false, error: "Superaste el máximo de intentos. Solicita un código nuevo." };
    }
    if (String(code) !== String(rec.code)) {
      persist();
      const left = rec.maxAttempts - rec.attempts;
      return { ok: false, error: "Código incorrecto. Te quedan " + left + " intento" + (left === 1 ? "" : "s") + "." };
    }
    rec.consumed = true;
    persist();
    return { ok: true, otp: rec };
  }

  async function registerWithPassword(phone, password) {
    const n = normalizePhone(phone);
    if (userByPhone(n)) return { ok: false, error: "Este número ya tiene una cuenta. Inicia sesión." };
    const disc = String(1000 + Math.floor(Math.random() * 9000));
    const u = {
      id: uid("u"),
      phone: n,
      passwordHash: await hashPassword(password),
      realName: "",
      facePhoto: null,
      dniFront: null,
      dniBack: null,
      status: "registrado",
      role: "usuario",
      plan: "gratis",
      hideRealName: false,
      createdAt: now(),
      verifiedAt: null,
    };
    db.users.push(u);
    db.chat_profiles.push({
      id: uid("p"),
      userId: u.id,
      nickname: "usuario",
      discriminator: disc,
      avatar: "img/avatar-pending.png",
      bio: "",
      interests: [],
      updatedAt: now(),
    });
    persist();
    createSession(u.id);
    return { ok: true, user: u };
  }

  async function login(phone, password) {
    const u = userByPhone(phone);
    if (!u) return { ok: false, error: "Número o contraseña incorrectos." };
    if (u.status === "expulsado") return { ok: false, error: "Esta cuenta fue expulsada de Raiz." };
    if (u.status === "suspendido") {
      if (!u.sanction || !u.sanction.until || u.sanction.until > now()) {
        return { ok: false, error: "Esta cuenta está suspendida. Escribe a la administración o apela desde el aviso que te enviamos." };
      }
      u.status = "verificado";
      u.sanction = null;
    }
    const ok = await verifyPassword(password, u.passwordHash);
    if (!ok) return { ok: false, error: "Número o contraseña incorrectos." };
    createSession(u.id);
    return { ok: true, user: u };
  }

  async function setPassword(userId, password) {
    const u = userById(userId);
    if (!u) return { ok: false, error: "Usuario no encontrado." };
    u.passwordHash = await hashPassword(password);
    invalidateSessions(userId);
    persist();
    return { ok: true };
  }

  function logout() {
    if (db.session) {
      const s = db.sessions.find((x) => x.id === db.session.sessionId);
      if (s) s.active = false;
    }
    db.session = null;
    persist();
  }

  function postLoginRoute(u) {
    if (!u) return "bienvenida";
    if (u.status === "expulsado") return "expulsado";
    if (u.status === "suspendido") return "suspendido";
    if (u.status === "registrado") return "verificacion";
    if (u.status === "rechazado") return "rechazado";
    if (u.status === "pendiente_verificacion") return "pendiente";
    return "mensajes";
  }


  function identity(userId) {
    const u = userById(userId);
    const p = profileOf(userId);
    if (!u || !p) return { nick: "", real: null, showReal: false, avatar: "", plan: "gratis" };
    const showReal = !(u.plan === "plus" && u.hideRealName) && !!u.realName;
    return {
      nick: tag(p),
      real: showReal ? u.realName : null,
      showReal: showReal,
      avatar: p.avatar,
      plan: u.plan,
      hideRealName: !!u.hideRealName
    };
  }
  function canCall(user) { return !!(user && user.plan === "plus"); }
  function canAttachFile(user) { return !!(user && user.plan === "plus"); }
  function isConnected(a, b) {
    return db.connections.some(function (c) {
      return c.status === "aceptada" && ((c.fromId === a && c.toId === b) || (c.fromId === b && c.toId === a));
    });
  }
  var GROUP_MEMBER_CAP = 256;
  function groupCreateLimit(user) {
    return (user && user.plan && user.plan !== "gratis") ? 10 : 2;
  }
  function groupsCreatedBy(uid) {
    return db.groups.filter(function (g) { return g.ownerId === uid; }).length;
  }
  function canCreateGroup(user) {
    if (!user) return false;
    return groupsCreatedBy(user.id) < groupCreateLimit(user);
  }
  function groupRole(g, uid) {
    if (!g || !uid) return "miembro";
    if (g.ownerId === uid) return "creador";
    if ((g.adminIds || []).indexOf(uid) >= 0) return "admin";
    return "miembro";
  }
  function roleLabel(role) {
    return role === "creador" ? "Creador" : (role === "admin" ? "Admin" : "Miembro");
  }
  function isGroupCreator(g, uid) { return !!(g && g.ownerId === uid); }
  function isGroupStaff(g, uid) {
    const r = groupRole(g, uid);
    return r === "creador" || r === "admin";
  }
  function isGroupAdmin(g, uid) { return isGroupStaff(g, uid); }
  function isBlocked(a, b) {
    return db.blocks.some(function (x) { return x.fromId === a && x.toId === b; });
  }
  function hideConversationAfterBlock(userId, otherId) {
    db.conversations = db.conversations.filter(function (c) {
      if (c.type === "group") return true;
      return !(c.memberIds.indexOf(userId) >= 0 && c.memberIds.indexOf(otherId) >= 0);
    });
  }
  var REPORT_REASONS = [
    { id: "acoso", label: "Acoso" },
    { id: "spam", label: "Spam" },
    { id: "contenido_sexual", label: "Contenido sexual" },
    { id: "suplantacion", label: "Suplantación" },
    { id: "estafa", label: "Estafa" },
    { id: "otro", label: "Otro" },
  ];
  var REJECT_TEMPLATES = [
    "El DNI se ve borroso o con reflejos. Vuelve a tomarlo con buena luz.",
    "La selfie no coincide con la foto del documento.",
    "El documento aparece vencido, cubierto o recortado.",
    "El nombre escrito no coincide con el del DNI.",
    "No se lee el número de DNI. Toma de nuevo frente y reverso.",
  ];
  function isPlatformAdmin(user) {
    return !!(user && user.role === "admin");
  }
  function canUseCommunity(user) {
    if (!user) return false;
    if (user.status === "verificado" || user.status === "silenciado") return true;
    return false;
  }
  function normalizeName(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
  }
  function findVerificationDuplicates(v) {
    const flags = [];
    if (!v) return flags;
    const name = normalizeName(v.realName);
    const dni = String(v.dniNumber || "").replace(/\D/g, "");
    db.users.forEach(function (u) {
      if (u.id === v.userId) return;
      if (dni && u.dniNumber && String(u.dniNumber).replace(/\D/g, "") === dni) {
        flags.push({ type: "dni", userId: u.id, label: "Mismo número de DNI (" + u.dniNumber + ") que " + (u.realName || u.id) + (u.status === "verificado" ? ", ya verificada" : "") });
      }
      if (name && normalizeName(u.realName) === name) {
        flags.push({ type: "nombre_rostro", userId: u.id, label: "Mismo nombre real que " + u.realName + " (revisar foto de rostro)" });
      }
    });
    return flags;
  }
  function distinctReporters(userId) {
    const ids = {};
    db.reports.forEach(function (r) {
      if (r.targetId === userId && r.status === "abierto") ids[r.fromId] = true;
    });
    return Object.keys(ids);
  }
  function autoActionThreshold() {
    const n = db.adminSettings && db.adminSettings.autoActionThreshold;
    return Math.min(5, Math.max(3, n || 3));
  }
  function notify(userId, title, body, type) {
    db.notifications.push({
      id: uid("nt"),
      userId: userId,
      title: title,
      body: body || "",
      type: type || "aviso",
      read: false,
      at: now(),
    });
  }
  function applyAutoAction(userId) {
    const u = userById(userId);
    if (!u || u.role === "admin") return false;
    const n = distinctReporters(userId).length;
    if (n < autoActionThreshold()) return false;
    if (u.status === "expulsado" || u.status === "suspendido") return false;
    u.status = "silenciado";
    u.sanction = {
      type: "silenciado",
      days: null,
      until: null,
      reason: "Oculto automáticamente al alcanzar " + n + " reportes de personas distintas. Pendiente de revisión.",
      auto: true,
      at: now(),
    };
    notify(u.id, "Tu cuenta fue silenciada", u.sanction.reason + " Puedes apelar.", "sancion");
    audit("auto_silencio", u.id, n + " reportes");
    return true;
  }

  /* init */
  loadRaw();

  global.RaizStore = {
    KEY,
    db,
    loadRaw,
    persist,
    seed,
    reset: async function () {
      localStorage.removeItem(KEY);
      db = emptyState();
      await seed(true);
    },
    now,
    uid,
    hashPassword,
    verifyPassword,
    normalizePhone,
    formatPhone,
    maskPhone,
    userById,
    userByPhone,
    profileOf,
    tag,
    currentUser,
    createSession,
    invalidateSessions,
    logout,
    issueOtp,
    verifyOtp,
    canSendOtp,
    registerWithPassword,
    login,
    setPassword,
    postLoginRoute,
    audit,
    publicName,
    identity,
    canCall,
    canAttachFile,
    isConnected,
    GROUP_MEMBER_CAP,
    groupCreateLimit,
    groupsCreatedBy,
    canCreateGroup,
    groupRole,
    roleLabel,
    isGroupCreator,
    isGroupStaff,
    isGroupAdmin,
    isBlocked,
    hideConversationAfterBlock,
    REPORT_REASONS,
    REJECT_TEMPLATES,
    isPlatformAdmin,
    canUseCommunity,
    findVerificationDuplicates,
    distinctReporters,
    autoActionThreshold,
    notify,
    applyAutoAction,
    OTP_TTL,
    OTP_MAX_ATTEMPTS,
    refresh() {
      loadRaw();
      this.db = db;
    },
    get: function () {
      return db;
    },
  };
})(window);
