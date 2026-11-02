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
    const paypalCandidate = String(s.paypal_url || s.paypal_link || s.paypal_me_url || "");
    const paypalUrl = paypalCandidate.startsWith("https://") || paypalCandidate.startsWith("http://") ? paypalCandidate : "";
    const hasBank = !!(s.bank_account || s.recipient_name || s.payment_purpose || s.reference_number);
    const row = (label, value) => value ? '<div class="donation-detail-row"><span>' + esc(label) + '</span><strong>' + esc(value) + '</strong><button type="button" class="donation-copy" data-copy="' + esc(value) + '">Копирај</button></div>' : "";
    const bankContent = hasBank
      ? '<div class="donation-payment-card">' + row("Прималац", s.recipient_name) + row("Број рачуна", s.bank_account) + row("Сврха уплате", s.payment_purpose) + row("Позив на број", s.reference_number) + (s.payment_instructions ? '<p class="donation-payment-note">' + esc(s.payment_instructions) + '</p>' : '') + '</div>'
      : '<div class="donation-empty">Подаци за банковни трансфер још нису унети.</div>';
    const slipContent = hasBank
      ? '<div class="donation-payment-card donation-slip"><div class="donation-slip-heading">НАЛОГ ЗА УПЛАТУ</div><div class="donation-slip-fields"><div><span>Уплатилац</span><strong>Уписује уплатилац</strong></div><div><span>Сврха уплате</span><strong>' + esc(s.payment_purpose || "Донација") + '</strong></div><div><span>Прималац</span><strong>' + esc(s.recipient_name || "—") + '</strong></div><div><span>Рачун примаоца</span><strong>' + esc(s.bank_account || "—") + '</strong></div><div><span>Позив на број</span><strong>' + esc(s.reference_number || "—") + '</strong></div></div><p class="donation-payment-note">Упиши износ који желиш да донираш и своје податке као уплатилац.</p><button type="button" class="donation-print-slip" onclick="window.print()">Одштампај / сачувај као PDF</button></div>'
      : '<div class="donation-empty">Подаци за попуњавање уплатнице још нису унети.</div>';
    const tabs = [
      { id: "bank", label: "Банковни трансфер", content: bankContent },
      { id: "slip", label: "Уплатница", content: slipContent }
    ];
    if (paypalUrl) tabs.push({ id: "paypal", label: "PayPal", content: '<div class="donation-payment-card"><a class="donation-paypal-button" href="' + esc(paypalUrl) + '" target="_blank" rel="noopener noreferrer"><i class="fab fa-paypal"></i> Донирај преко PayPal-а</a>' + (s.paypal_email ? '<div class="donation-paypal-email">PayPal налог: <strong>' + esc(s.paypal_email) + '</strong> <button type="button" class="donation-copy" data-copy="' + esc(s.paypal_email) + '">Копирај</button></div>' : '') + '</div>' });
    const wuFirst = String(s.western_union_first_name || "").trim();
    const wuLast = String(s.western_union_last_name || "").trim();
    const wuName = [wuFirst, wuLast].filter(Boolean).join(" ");
    const hasWesternUnion = s.show_western_union === true && !!wuFirst && !!wuLast;
    if (hasWesternUnion) {
      const wuRow = (label, value) => value ? '<div class="donation-detail-row"><span>' + esc(label) + '</span><strong>' + esc(value) + '</strong><button type="button" class="donation-copy" data-copy="' + esc(value) + '">Копирај</button></div>' : "";
      const wuContent = '<div class="donation-payment-card"><p class="donation-payment-note">Подаци примаоца за слање новца преко Western Union-а. Пре слања проверите да ли је овај начин пријема доступан за конкретног примаоца.</p>' +
        wuRow("Име и презиме", wuName) + wuRow("Држава", s.western_union_country || "Србија") +
        wuRow("Град", s.western_union_city) + wuRow("Телефон", s.western_union_phone) +
        (s.western_union_instructions ? '<p class="donation-payment-note">' + esc(s.western_union_instructions) + '</p>' : '') +
        '<p class="donation-payment-note">Након слања, пошиљалац треба да достави примаоцу контролни број трансфера (MTCN) без слања фотографије личног документа или података платне картице.</p></div>';
      tabs.push({ id: "western-union", label: "Western Union", content: wuContent });
    }
    return '<div class="donation-payment-tabs" data-donation-tabs><div class="donation-tab-list" role="tablist" aria-label="Начин новчане донације">' +
      tabs.map((tab, index) => '<button type="button" class="donation-tab' + (index === 0 ? ' is-active' : '') + '" role="tab" aria-selected="' + (index === 0 ? 'true' : 'false') + '" aria-controls="donation-panel-' + tab.id + '" data-donation-tab="' + tab.id + '">' + tab.label + '</button>').join('') +
      '</div>' + tabs.map((tab, index) => '<section class="donation-tab-panel' + (index === 0 ? ' is-active' : '') + '" id="donation-panel-' + tab.id + '" role="tabpanel" data-donation-panel="' + tab.id + '"' + (index === 0 ? '' : ' hidden') + '>' + tab.content + '</section>').join('') + '</div>';
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
  document.addEventListener("click", async event => {
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
      }
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