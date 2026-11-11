/* Centralni registar tipova donacija za Odgovorna Plana. */
(function () {
  const TYPES = [
    { value: "money", label: "Новчана донација", icon: "fa-wallet", hint: "Уплата новца на рачун или путем PayPal-а." },
    { value: "food", label: "Храна", icon: "fa-bowl-food", hint: "Храна за псе, мачке и друге животиње." },
    { value: "clothing", label: "Одећа и обућа", icon: "fa-shirt", hint: "Одећа, обућа и текстил." },
    { value: "equipment", label: "Опрема", icon: "fa-toolbox", hint: "Опрема, алати и потребни уређаји." },
    { value: "materials", label: "Материјал", icon: "fa-boxes-stacked", hint: "Грађевински и потрошни материјал." },
    { value: "medicine", label: "Лекови и медицински материјал", icon: "fa-kit-medical", hint: "Лекови и медицински материјал." },
    { value: "service", label: "Услуге и стручна помоћ", icon: "fa-handshake-angle", hint: "Превоз, поправке и стручна помоћ." },
    { value: "transport", label: "Превоз", icon: "fa-truck", hint: "Превоз људи, животиња и ствари." },
    { value: "other", label: "Друго", icon: "fa-gift", hint: "Други облик помоћи." }
  ];

  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  function getType(value) {
    return TYPES.find(type => type.value === String(value || "")) || TYPES[TYPES.length - 1];
  }

  function formatMoney(value, currency = "RSD") {
    if (value === null || value === undefined || value === "") return "";
    return new Intl.NumberFormat("sr-RS", { maximumFractionDigits: 2 }).format(Number(value) || 0) + " " + currency;
  }

  function renderItems(items) {
    if (!items.length) return '<div class="donation-empty">За ову кампању још нису унете конкретне ставке донација.</div>';
    return '<div class="donation-items-grid">' + items.map(item => {
      const type = getType(item.type);
      const quantity = item.suggested_amount !== null && item.suggested_amount !== "" && item.suggested_amount !== undefined
        ? '<span class="donation-item-quantity">' + esc(formatMoney(item.suggested_amount, item.type === "money" ? "RSD" : (item.unit || "ком"))) + '</span>' : "";
      return '<article class="donation-item-card">' +
        '<span class="donation-item-icon"><i class="fas ' + esc(type.icon) + '"></i></span>' +
        '<div class="donation-item-copy"><strong>' + esc(item.title) + '</strong>' +
        '<small class="donation-item-type">' + esc(type.label) + '</small>' +
        (item.description ? '<p>' + esc(item.description) + '</p>' : '') + quantity + '</div></article>';
    }).join("") + '</div>';
  }

  function renderContact(settings) {
    if (!settings) return '<div class="donation-empty">Контакт особа још није унета. Информације ће бити објављене чим буду потврђене.</div>';
    const links = [];
    if (settings.contact_phone) {
      const phone = String(settings.contact_phone).replace(/[^+\d]/g, "");
      links.push('<a class="donation-contact-link" href="tel:' + esc(phone) + '"><i class="fas fa-phone"></i> Позови ' + esc(settings.contact_name || "контакт особу") + '</a>');
      links.push('<a class="donation-contact-link secondary" href="https://wa.me/' + esc(phone.replace(/^\+/, "")) + '" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> WhatsApp</a>');
    }
    if (settings.contact_email) links.push('<a class="donation-contact-link secondary" href="mailto:' + esc(settings.contact_email) + '"><i class="fas fa-envelope"></i> Пошаљи имејл</a>');
    return '<div class="donation-contact-card"><div class="donation-contact-title">Коме да се јавиш?</div>' +
      '<strong>' + esc(settings.contact_name || "Контакт особа за кампању") + '</strong>' +
      (settings.contact_phone ? '<p>' + esc(settings.contact_phone) + '</p>' : '') +
      (settings.contact_email ? '<p>' + esc(settings.contact_email) + '</p>' : '') +
      (settings.contact_note ? '<p class="donation-contact-note">' + esc(settings.contact_note) + '</p>' : '') +
      (links.length ? '<div class="donation-contact-actions">' + links.join("") + '</div>' : '<p class="donation-empty">Контакт телефон или имејл још није подешен.</p>') +
      '</div>';
  }

  function renderPayment(settings) {
    const s = settings || {};
    const configuredMethods = Array.isArray(s.payment_methods)
      ? s.payment_methods.filter(method => method && method.is_active !== false)
      : null;
    if (configuredMethods) {
      const activeTypes = configuredMethods.map(method => method.type);
      s.show_bank_payment = activeTypes.includes("bank_transfer");
      s.show_ips = activeTypes.includes("ips_qr");
      s.show_paypal = activeTypes.includes("paypal");
      const paypalMethod = configuredMethods.find(method => method.type === "paypal");
      if (paypalMethod && paypalMethod.config) {
        s.paypal_url = paypalMethod.config.url || s.paypal_url || "";
        s.paypal_email = paypalMethod.config.email || s.paypal_email || "";
      }
    }
    const paypalCandidate = String(s.paypal_url || s.paypal_link || s.paypal_me_url || "");
    const paypalUrl = /^https?:\/\//i.test(paypalCandidate) ? paypalCandidate : "";
    const accountDigits = String(s.bank_account || "").replace(/\D/g, "");
    const hasIps = accountDigits.length > 0 && !!String(s.recipient_name || "").trim();
    const hasBank = !!(s.bank_account || s.recipient_name || s.payment_purpose || s.reference_number);
    const row = (label, value) => value ? '<div class="donation-detail-row"><span>' + esc(label) + '</span><strong>' + esc(value) + '</strong><button type="button" class="donation-copy" data-copy="' + esc(value) + '">Копирај</button></div>' : "";
    const bankContent = hasBank ? '<div class="donation-payment-card"><p class="donation-payment-note">Износ донације: <strong data-donation-amount>—</strong></p>' + row("Прималац", s.recipient_name) + row("Банка", s.bank_name) + row("Број рачуна", s.bank_account) + row("Сврха уплате", s.payment_purpose) + row("Позив на број", s.reference_number) + (s.payment_instructions ? '<p class="donation-payment-note">' + esc(s.payment_instructions) + '</p>' : "") + '</div>' : '<div class="donation-empty">Подаци за банковни трансфер још нису унети.</div>';
    const slipContent = hasBank ? '<div class="donation-payment-card donation-slip"><div class="donation-slip-heading">НАЛОГ ЗА УПЛАТУ</div><div class="donation-slip-fields"><div><span>Уплатилац</span><strong class="donation-slip-blank">Име, презиме и адреса уплатиоца</strong></div><div><span>Шифра плаћања</span><strong>' + esc(s.payment_code || "") + '</strong></div><div><span>Валута</span><strong>RSD</strong></div><div><span>Износ</span><strong data-donation-amount>—</strong></div><div><span>Прималац</span><strong>' + esc(s.recipient_name || "—") + '</strong></div><div><span>Рачун примаоца</span><strong>' + esc(s.bank_account || "—") + '</strong></div><div><span>Модел</span><strong>' + esc(s.payment_model || "—") + '</strong></div><div><span>Позив на број</span><strong>' + esc(s.reference_number || "—") + '</strong></div><div><span>Сврха уплате</span><strong>' + esc(s.payment_purpose || "Донација") + '</strong></div></div><p class="donation-slip-footnote">Пре уплате проверите податке и износ. Поља која нису попуњена потребно је допунити ако их банка захтева.</p><button type="button" class="donation-print-slip" onclick="window.print()">Преузми PDF уплатнице</button></div>' : '<div class="donation-empty">Подаци за уплатницу још нису унети.</div>';
    const tabs = [];
    if (s.show_bank_payment !== false && hasBank) tabs.push({ id: "bank", label: "Банковни трансфер", content: bankContent });
    if (s.show_payment_slip !== false && hasBank) tabs.push({ id: "slip", label: "Уплатница", content: slipContent });
    if (s.show_paypal !== false && paypalUrl) tabs.push({ id: "paypal", label: "PayPal", content: '<div class="donation-payment-card"><p>Износ донације: <strong data-donation-amount>—</strong></p><a class="donation-paypal-button" data-paypal-donate data-base-url="' + esc(paypalUrl) + '" href="' + esc(paypalUrl) + '" target="_blank" rel="noopener noreferrer">Донирај преко PayPal-а</a>' + (s.paypal_email ? row("PayPal адреса", s.paypal_email) : '') + '<p class="donation-payment-note">Пре потврде плаћања проверите име примаоца и износ.</p></div>' });
    else if (s.show_paypal !== false && s.paypal_email) tabs.push({ id: "paypal", label: "PayPal", content: '<div class="donation-payment-card"><p><strong>PayPal адреса за донацију</strong></p><div class="donation-paypal-address">' + esc(s.paypal_email) + '</div>' + row("PayPal налог", s.paypal_email) + '<p class="donation-payment-note">Отвори PayPal, изабери слање новца (Send), унеси ову адресу и износ донације. Пре слања провери име примаоца.</p></div>' });
    if (s.show_ips !== false && hasIps) tabs.push({ id: "ips", label: "IPS QR код", content: '<div class="donation-payment-card donation-ips-card"><p>Скенирај QR код у апликацији своје банке и провери податке пре потврде уплате.</p><div class="donation-ips-qr" data-ips-qr aria-live="polite">Изабери износ да би се направио IPS QR код.</div><p class="donation-payment-note">Износ: <strong data-donation-amount>—</strong></p><button type="button" class="donation-ips-download" data-ips-download disabled>Преузми QR код</button><p class="donation-ips-status" data-ips-status></p></div>' });
    if (configuredMethods) {
      configuredMethods
        .filter(method => ["sms", "online", "other"].includes(method.type))
        .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
        .forEach((method, index) => {
          const config = method.config || {};
          const title = esc(method.title || method.type);
          const description = method.description ? '<p>' + esc(method.description) + '</p>' : '';
          let content = '<div class="donation-payment-card">' + description;
          if (method.type === "sms") {
            const number = String(config.number || config.target || "").replace(/[^+\\d]/g, "");
            const message = String(config.message || "1");
            const price = config.price ? ' (' + esc(config.price) + ')' : '';
            const smsHref = number ? 'sms:' + encodeURIComponent(number) + '?body=' + encodeURIComponent(message) : '';
            content += number
              ? '<a class="donation-paypal-button" href="' + esc(smsHref) + '">Пошаљи SMS на ' + esc(number) + price + '</a><p class="donation-payment-note">Текст поруке: <strong>' + esc(message) + '</strong>. Порука се шаље тек када је потврдиш у SMS апликацији.</p>'
              : '<p>SMS број још није унет.</p>';
          } else {
            const url = String(config.url || config.target || "");
            const safeUrl = /^https?:\\/\\//i.test(url) ? url : "";
            content += safeUrl
              ? '<a class="donation-paypal-button" href="' + esc(safeUrl) + '" target="_blank" rel="noopener noreferrer">' + title + '</a>'
              : '<p>Линк за овај начин донирања још није унет.</p>';
          }
          content += '</div>';
          tabs.push({ id: 'custom-' + index, label: title, content });
        });
    }
    if (!tabs.length) tabs.push({ id: "info", label: "Информације", content: '<div class="donation-empty">Начини уплате тренутно нису доступни.</div>' });
    const first = String(s.western_union_first_name || "").trim(), last = String(s.western_union_last_name || "").trim();
    if (s.show_western_union === true && first && last) {
      const name = first + " " + last;
      tabs.push({ id: "western-union", label: "Western Union", content: '<div class="donation-payment-card"><p>Износ донације: <strong data-donation-amount>—</strong></p>' + row("Име и презиме", name) + row("Држава", s.western_union_country || "Србија") + row("Град", s.western_union_city) + row("Телефон", s.western_union_phone) + (s.western_union_instructions ? '<p>' + esc(s.western_union_instructions) + '</p>' : "") + '<p class="donation-payment-note">Пре слања проверите доступност услуге за конкретног примаоца.</p></div>' });
    }
    return '<div class="donation-amount-step" data-donation-checkout data-donation-settings="' + esc(JSON.stringify(s)) + '"><h4>Изабери износ донације</h4><div class="donation-amount-options">' + [200,500,1000,2000].map(v => '<button type="button" class="donation-amount-choice" data-amount-choice="' + v + '">' + v.toLocaleString("sr-RS") + ' дин.</button>').join("") + '</div><label class="donation-amount-custom-label">Други износ (РСД)<input type="number" min="1" step="1" inputmode="numeric" data-donation-amount-input placeholder="Унеси износ"></label><p data-amount-error hidden>Унеси цео износ већи од нуле.</p><div data-donation-methods hidden><h4>Изабери начин уплате</h4><div class="donation-payment-tabs"><div class="donation-tab-list" role="tablist" data-donation-tabs>' + tabs.map((t,i) => '<button type="button" class="donation-tab' + (i===0 ? " is-active" : "") + '" role="tab" aria-selected="' + (i===0 ? "true" : "false") + '" data-donation-tab="' + t.id + '">' + t.label + '</button>').join("") + '</div>' + tabs.map((t,i) => '<section class="donation-tab-panel' + (i===0 ? " is-active" : "") + '" data-donation-panel="' + t.id + '"' + (i===0 ? "" : " hidden") + '>' + t.content + '</section>').join("") + '</div></div></div>';
  }
  function renderPanel(settings, items) {
    const moneyItems = items.filter(item => item.type === "money");
    const materialItems = items.filter(item => item.type !== "money");
    let html = '<div class="donation-panel-intro">Свака помоћ има значај. Изабери шта можеш да подржиш и јави се контакт особи како бисмо договорили следећи корак.</div>';
    if (moneyItems.length || !items.length) {
      html += '<section class="donation-panel-section"><h3><i class="fas fa-wallet"></i> Новчане донације</h3>' + renderItems(moneyItems) + renderPayment(settings) + '</section>';
    }
    if (materialItems.length) {
      html += '<section class="donation-panel-section"><h3><i class="fas fa-box-open"></i> Донације у стварима и услугама</h3>' + renderItems(materialItems) + '</section>';
    }
    html += '<section class="donation-panel-section">' + renderContact(settings) + '</section>';
    return html;
  }

  window.DonationTypes = Object.freeze({ list: TYPES, getType, renderItems, renderPanel });
  function buildIpsPayload(s, amount) {
    const account = String(s.bank_account || "").replace(/\D/g, "");
    const clean = (v, n) => String(v || "").replace(/[|\r\n]/g, " ").replace(/\s+/g, " ").trim().slice(0, n || 70);
    const recipient = clean(s.recipient_name, 70);
    if (account.length !== 18 || !recipient || !Number.isInteger(Number(amount)) || Number(amount) <= 0) return "";
    const code = /^\d{3}$/.test(String(s.payment_code || "")) ? String(s.payment_code) : "289";
    const parts = ["K:PR", "V:01", "C:1", "R:" + account, "N:" + recipient, "I:RSD," + Number(amount).toFixed(2), "SF:" + code, "S:" + clean(s.payment_purpose || "Донација", 70)];
    const reference = clean(s.reference_number, 25);
    if (reference) parts.push("RO:" + reference);
    return parts.join("|");
  }
  let ipsLibraryPromise;
  function loadIpsQrLibrary() {
    if (window.QRCode) return Promise.resolve();
    if (ipsLibraryPromise) return ipsLibraryPromise;
    ipsLibraryPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js";
      script.async = true;
      script.onload = () => window.QRCode ? resolve() : reject(new Error("QR библиотека није доступна."));
      script.onerror = () => reject(new Error("Неуспешно учитавање QR библиотеке."));
      document.head.appendChild(script);
    });
    return ipsLibraryPromise;
  }
  async function renderIpsQr(root, amount) {
    const target = root.querySelector("[data-ips-qr]");
    const download = root.querySelector("[data-ips-download]");
    const status = root.querySelector("[data-ips-status]");
    if (!target) return;
    let settings = {};
    try { settings = JSON.parse(root.dataset.donationSettings || "{}"); } catch (_) {}
    const payload = buildIpsPayload(settings, amount);
    target.innerHTML = "";
    if (!payload) { target.textContent = "Подаци за IPS QR нису исправни. Провери број рачуна и износ."; if (download) download.disabled = true; return; }
    try {
      await loadIpsQrLibrary();
      if (!root.isConnected) return;
      new window.QRCode(target, { text: payload, width: 240, height: 240, correctLevel: window.QRCode.CorrectLevel.M });
      if (download) download.disabled = false;
      if (status) status.textContent = "IPS QR код је направљен.";
    } catch (error) {
      target.textContent = "QR код тренутно није могуће направити.";
      if (download) download.disabled = true;
      if (status) status.textContent = error.message;
    }
  }
  function updateDonationAmount(root, raw) {
    const amount = Number(String(raw).replace(",", "."));
    const valid = Number.isFinite(amount) && amount > 0 && Number.isInteger(amount);
    const methods = root.querySelector("[data-donation-methods]");
    const error = root.querySelector("[data-amount-error]");
    if (methods) methods.hidden = false;
    if (error) error.hidden = valid || !raw;
    root.querySelectorAll("[data-donation-amount]").forEach(el => el.textContent = valid ? amount.toLocaleString("sr-RS") + " RSD" : "—");
    if (valid) renderIpsQr(root, amount); else { const qr = root.querySelector("[data-ips-qr]"); if (qr) qr.textContent = "Изабери износ да би се направио IPS QR код."; const dl = root.querySelector("[data-ips-download]"); if (dl) dl.disabled = true; }
    const paypal = root.querySelector("[data-paypal-donate]");
    if (paypal && valid) {
      const base = paypal.dataset.baseUrl || paypal.href;
      try { const url = new URL(base); if (url.hostname.toLowerCase() === "paypal.me") { const handle = url.pathname.split("/").filter(Boolean)[0] || ""; url.pathname = "/" + handle + "/" + amount + "/RSD"; paypal.href = url.toString(); } } catch (_) {}
    }
  }
  document.addEventListener("input", event => {
    if (!event.target.matches("[data-donation-amount-input]")) return;
    const root = event.target.closest("[data-donation-checkout]");
    if (root) { root.querySelectorAll("[data-amount-choice]").forEach(x => x.classList.remove("is-active")); updateDonationAmount(root, event.target.value); }
  });
    document.addEventListener("click", async event => {
    const amountChoice = event.target.closest("[data-amount-choice]");
    if (amountChoice) {
      const root = amountChoice.closest("[data-donation-checkout]");
      if (root) { root.querySelectorAll("[data-amount-choice]").forEach(x => x.classList.toggle("is-active", x === amountChoice)); const input = root.querySelector("[data-donation-amount-input]"); if (input) input.value = amountChoice.dataset.amountChoice; updateDonationAmount(root, amountChoice.dataset.amountChoice); }
      return;
    }
    const tab = event.target.closest("[data-donation-tab]");
    if (tab) {
      const root = tab.closest("[data-donation-tabs]");
      if (root) {
        const selected = tab.dataset.donationTab;
        root.querySelectorAll("[data-donation-tab]").forEach(button => {
          const active = button === tab;
          button.classList.toggle("is-active", active);
          button.setAttribute("aria-selected", active ? "true" : "false");
        });
        root.querySelectorAll("[data-donation-panel]").forEach(panel => {
          const active = panel.dataset.donationPanel === selected;
          panel.classList.toggle("is-active", active);
          panel.hidden = !active;
        });
        if (selected === "ips") {
          const checkout = root.closest("[data-donation-checkout]");
          const amountInput = checkout && checkout.querySelector("[data-donation-amount-input]");
          const amount = Number(amountInput && amountInput.value);
          if (checkout && Number.isInteger(amount) && amount > 0) renderIpsQr(checkout, amount);
        }
      }
      return;
    }

    const ipsDownload = event.target.closest("[data-ips-download]");
    if (ipsDownload) {
      const root = ipsDownload.closest("[data-donation-checkout]");
      const canvas = root && root.querySelector("[data-ips-qr] canvas");
      const image = root && root.querySelector("[data-ips-qr] img");
      const url = canvas ? canvas.toDataURL("image/png") : (image ? image.src : "");
      if (url) { const a = document.createElement("a"); a.href = url; a.download = "ips-uplata.png"; a.click(); }
      return;
    }
    const button = event.target.closest("[data-copy]");
    if (!button) return;
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      const old = button.textContent;
      button.textContent = "Копирано";
      setTimeout(() => button.textContent = old, 1400);
    } catch (_) {
      window.prompt("Копирај податак:", button.dataset.copy);
    }
  });
})();