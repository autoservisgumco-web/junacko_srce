/* Заједничко учитавање активне, објављене акције. */
(function () {
  const client = window.odgovornaPlanaDB;
  if (!client) throw new Error('Supabase конекција није иницијализована.');

  window.ucitajAkcije = async function () {
    return await client
      .from('actions')
      .select('*')
      .eq('status', 'in_progress')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
  };
})();
