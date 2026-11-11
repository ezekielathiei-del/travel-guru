import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';
const $ = id => document.getElementById(id);
const loginPanel = $('loginPanel'), dashboard = $('dashboard'), loginMessage = $('loginMessage');
const ready = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(SUPABASE_URL) && typeof SUPABASE_ANON_KEY === 'string' && SUPABASE_ANON_KEY.length > 20;
if (!ready) { loginMessage.textContent = 'Supabase is not configured. Check supabase-config.js.'; loginMessage.className = 'notice error'; $('loginForm').querySelector('button[type="submit"]').disabled = true; }
const supabase = ready ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession:true, autoRefreshToken:true, detectSessionInUrl:true } }) : null;
let kind = 'inquiries', busy = false;
function showLoggedIn(on) { loginPanel.classList.toggle('hidden',on); dashboard.classList.toggle('hidden',!on); }
function message(el,text,bad=false) { el.textContent=text; el.className=`notice${bad?' error':''}`; }
async function verifyAdmin() {
  const {data,error}=await supabase.rpc('is_travel_guru_admin');
  if(error){ console.error(error); message(loginMessage,`Admin verification failed: ${error.message}. Check the SQL setup and administrator UUID.`,true); return false; }
  return data===true;
}
async function enterDashboard() {
  if(!(await verifyAdmin())) { await supabase.auth.signOut(); showLoggedIn(false); if(!loginMessage.textContent) message(loginMessage,'This account is not authorised for the Travel Guru dashboard.',true); return; }
  showLoggedIn(true); await loadRows();
}
$('loginForm').addEventListener('submit',async e=>{
  e.preventDefault(); if(!supabase||busy)return; busy=true;
  const btn=$('loginForm').querySelector('button[type="submit"]'); btn.disabled=true; btn.textContent='Signing in…'; message(loginMessage,'Checking your account…');
  const f=new FormData(e.currentTarget);
  try {
    const {error}=await supabase.auth.signInWithPassword({email:String(f.get('email')||'').trim(),password:String(f.get('password')||'')});
    if(error){console.error(error);message(loginMessage,`Sign-in failed: ${error.message}`,true);return;}
    await enterDashboard();
  } catch(err) { console.error(err); message(loginMessage,'Could not reach Supabase. Check your internet connection and project settings.',true); }
  finally { busy=false; btn.disabled=false; btn.textContent='Sign in securely'; }
});
$('logout').addEventListener('click',async()=>{if(supabase)await supabase.auth.signOut();showLoggedIn(false);message(loginMessage,'You have signed out.');});
$('refresh').addEventListener('click',loadRows);
document.querySelectorAll('[data-kind]').forEach(b=>b.addEventListener('click',()=>{kind=b.dataset.kind;document.querySelectorAll('[data-kind]').forEach(x=>x.classList.toggle('active',x===b));loadRows();}));
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function loadRows(){
 if(!supabase)return; $('tableTitle').textContent=kind==='inquiries'?'Customer enquiries':'Booking requests'; $('tableMessage').textContent='Loading records…'; $('tbody').innerHTML='';
 const {data,error}=await supabase.from(kind).select('*').order('created_at',{ascending:false}).limit(200);
 if(error){console.error(error);$('tableMessage').textContent=`Could not load records: ${error.message}`;return;}
 const cols=kind==='inquiries'?['created_at','full_name','email','phone','destination','travel_date','travellers','message','status']:['created_at','reference','full_name','email','phone','package_name','travel_date','return_date','travellers','estimated_total','status'];
 $('thead').innerHTML='<tr>'+cols.map(c=>`<th>${esc(c.replaceAll('_',' '))}</th>`).join('')+'<th>Update</th></tr>';
 $('tbody').innerHTML=(data||[]).map(row=>'<tr>'+cols.map(c=>`<td>${esc(c==='created_at'&&row[c]?new Date(row[c]).toLocaleString():row[c])}</td>`).join('')+`<td><select class="status" data-id="${esc(row.id)}" aria-label="Update status">${['new','contacted','pending','confirmed','cancelled'].map(s=>`<option value="${s}" ${row.status===s?'selected':''}>${s}</option>`).join('')}</select></td></tr>`).join('');
 $('tableMessage').textContent=`${(data||[]).length} record(s) shown.`;
 document.querySelectorAll('.status').forEach(sel=>sel.addEventListener('change',async()=>{const {error:e}=await supabase.from(kind).update({status:sel.value}).eq('id',sel.dataset.id);if(e){console.error(e);$('tableMessage').textContent=`Status update failed: ${e.message}`;await loadRows();}else $('tableMessage').textContent='Status updated successfully.';}));
}
if(supabase){
 supabase.auth.onAuthStateChange((_event,session)=>{if(!session)showLoggedIn(false);});
 (async()=>{const {data,error}=await supabase.auth.getSession();if(error)message(loginMessage,`Session check failed: ${error.message}`,true);else if(data.session)await enterDashboard();})();
}
