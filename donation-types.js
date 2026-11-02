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
    if (!settings || (!settings.bank_account && !settings.paypal_email && !settings.payment_instructions)) {
      return '<div class="donation-empty">Подаци за уплату још нису објављени. Пре уплате се јави контакт особи.</div>';
    }
    let html = '<div class="donation-payment-card"><div class="donation-contact-title">Подаци за уплату</div>';
    if (settings.recipient_name) html += '<div class="donation-detail-row"><span>Прималац</span><strong>' + esc(settings.recipient_name) + '</strong></div>';
    if (settings.bank_account) html += '<div class="donation-detail-row"><span>Динарски рачун</span><strong>' + esc(settings.bank_account) + '</strong><button type="button" class="donation-copy" data-copy="' + esc(settings.bank_account) + '">Копирај</button></div>';
    if (settings.payment_purpose) html += '<div class="donation-detail-row"><span>Сврха уплате</span><strong>' + esc(settings.payment_purpose) + '</strong></div>';
    if (settings.reference_number) html += '<div class="donation-detail-row"><span>Позив на број</span><strong>' + esc(settings.reference_number) + '</strong></div>';
    if (settings.paypal_email) html += '<div class="donation-detail-row"><span>PayPal</span><strong>' + esc(settings.paypal_email) + '</strong><button type="button" class="donation-copy" data-copy="' + esc(settings.paypal_email) + '">Копирај</button></div>';
    if (settings.payment_instructions) html += '<p class="donation-payment-note">' + esc(settings.payment_instructions) + '</p>';
    html += '</div>';
    return html;
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