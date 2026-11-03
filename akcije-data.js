/* Заједничко учитавање јавних акција.
   Видљивост контролише RLS политика према статусу акције;
   не филтрирамо по is_published јер старије акције немају тај флаг укључен. */
(function () {
  const client = window.odgovornaPlanaDB;
  if (!client) throw new Error('Supabase конекција није иницијализована.');

  window.ucitajAkcije = async function () {
    return await client
      .from('actions')
      .select('*')
      .order('created_at', { ascending: false });
  };
})();
