(function(){
 const URL='https://hmfeizkmpmxcnzhwxgbn.supabase.co';
 const KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGciOiJIUzI1NiIsInJlZiI6ImhtZmVpemttcG14Y256aHd4Z2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzMjkyNzgsImV4cCI6MjEwODkwNTI3OH0.oTZopOJEGUnxKK69BOYPP11CQoGrLqUJowqpPU2uiY-4';
 const client=window.supabase.createClient(URL,KEY);
 window.odgovornaPlanaDB=client;
 window.ucitajAkcije=async function(){
  return await client.from('actions').select('*').eq('is_published',true).order('created_at',{ascending:false});
 };
})();