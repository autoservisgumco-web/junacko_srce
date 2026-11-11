/* Заједничко учитавање објављених акција. Статус не ограничава приказ. */
(function () {
  const client = window.odgovornaPlanaDB;
  if (!client) throw new Error('Supabase конекција није иницијализована.');

  window.ucitajAkcije = async function () {
    return await client
      .from('actions')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
  };
})();
