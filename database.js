/* Једна Supabase конекција за цео сајт. */
(function () {
  if (!window.supabase || !window.APP_CONFIG?.supabase) {
    throw new Error('Недостаје Supabase библиотека или централна конфигурација.');
  }

  const { url, key } = window.APP_CONFIG.supabase;
  const client = window.supabase.createClient(url, key);

  window.odgovornaPlanaDB = client;
  window.db = client;
})();
