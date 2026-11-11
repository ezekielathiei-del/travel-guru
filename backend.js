import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';
const configured=/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(SUPABASE_URL)&&typeof SUPABASE_ANON_KEY==='string'&&SUPABASE_ANON_KEY.length>20;
const db=configured?createClient(SUPABASE_URL,SUPABASE_ANON_KEY):null;
function notice(form,text,bad=false){let el=form.querySelector('.backend-notice');if(!el){el=document.createElement('p');el.className='backend-notice';el.setAttribute('role','status');el.setAttribute('aria-live','polite');form.append(el);}el.textContent=text;el.style.cssText=`margin:16px 0;padding:14px 16px;border-radius:10px;background:${bad?'#fff0ef':'#eaf8ef'};color:${bad?'#9b1c16':'#087b3d'};font-weight:600`;}
const vals=f=>Object.fromEntries(new FormData(f).entries());
async function sendTravelNotification(type,recordId){if(!db||!recordId)return;const {data,error}=await db.functions.invoke('travel-notifications',{body:{type,recordId}});if(error)throw error;if(data?.error)throw new Error(data.error);return data;}
const today=()=>{const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,10);};
const checkout=document.getElementById('checkoutForm');
if(checkout){
 const start=checkout.querySelector('[name="date"]'),end=checkout.querySelector('[name="returnDate"]'); if(start)start.min=today();
 start?.addEventListener('change',()=>{if(end)end.min=start.value||today();if(end?.value&&start.value&&end.value<start.value)end.value='';});
 checkout.addEventListener('submit',async e=>{
  e.preventDefault();if(!checkout.reportValidity())return;if(!db){notice(checkout,'Online booking requests are not activated yet. Please contact Travel Guru directly.',true);return;}
  const v=vals(checkout),opt=document.getElementById('bookPackage').selectedOptions[0],count=Number(v.travellers),total=Number(opt?.dataset.price||0)*count,ref=`TG-${new Date().getFullYear()}-${crypto.randomUUID().slice(0,6).toUpperCase()}`,btn=checkout.querySelector('button[type="submit"]'),original=btn.textContent;
  btn.disabled=true;btn.textContent='Sending…';
  try{
   const {data:saved,error}=await db.from('bookings').insert({reference:ref,full_name:v.name.trim(),email:v.email.trim(),phone:v.phone.trim(),package_name:v.package,travel_date:v.date,return_date:v.returnDate,travellers:count,room_preference:v.room||'Standard',special_requests:v.notes||'',estimated_total:total,status:'new'}).select('id').single();
   if(error)throw error;let emailWarning='';try{await sendTravelNotification('booking',saved.id);}catch(mailErr){console.warn('Booking saved but email notification failed:',mailErr);emailWarning=' Your request is saved, but email notifications are not configured yet.';}
   document.getElementById('bookingReference').textContent=ref;document.getElementById('bookingConfirmation').classList.add('show');
   const msg=`Hi Travel Guru, my booking request reference is ${ref}. Package: ${v.package}. Travellers: ${count}. Dates: ${v.date} to ${v.returnDate}. Estimated total: $${total.toLocaleString()}.`;
   const wa=document.getElementById('bookingWhatsApp');if(wa)wa.href=`https://wa.me/254700000000?text=${encodeURIComponent(msg)}`;
   const email=document.getElementById('emailBooking');if(email)email.onclick=()=>{location.href=`mailto:hello@travelguru.com?subject=${encodeURIComponent(`Travel Guru booking ${ref}`)}&body=${encodeURIComponent(msg)}`;};
   notice(checkout,'Your booking request has been received. This is a request, not a confirmed reservation or payment.'+emailWarning);checkout.reset();if(start)start.min=today();if(end)end.min=today();
  }catch(err){console.error(err);notice(checkout,`We couldn't submit your booking request: ${err.message||'Please try again.'}`,true);}
  finally{btn.disabled=false;btn.textContent=original;}
 });
}
const trip=document.getElementById('tripBuilderForm');
if(trip){
 trip.addEventListener('submit',e=>{
  e.preventDefault();if(!trip.reportValidity())return;
  const dest=document.getElementById('tbDestination').value,dur=trip.querySelector('input[name="duration"]:checked')?.value||'',group=document.getElementById('tbGroup').value,count=Number(document.getElementById('tbTravellers').value),budget=document.getElementById('tbBudget').value,exp=[...trip.querySelectorAll('input[type="checkbox"]:checked')].map(x=>x.value);
  document.getElementById('previewTitle').textContent=dest==="I'm open to ideas"?'Your personalised travel idea':`${dest} adventure`;
  document.getElementById('previewText').textContent=`${dur}, for ${count} traveller(s), travelling as ${group.toLowerCase()}. Budget: ${budget}.`;
  document.getElementById('previewTags').textContent=exp.join(' · ');
  document.getElementById('previewTotal').innerHTML='<div class="trip-ready">Your trip brief is ready. <button class="btn btn-primary" type="button" id="sendTripIdea">Send This Trip Idea →</button></div>';
  document.getElementById('sendTripIdea').addEventListener('click',async ev=>{
   const b=ev.currentTarget;if(!db){notice(trip,'Online trip requests are not activated yet. Please contact Travel Guru directly.',true);return;}
   const v=vals(trip);b.disabled=true;b.textContent='Sending…';
   try{const {data:saved,error}=await db.from('inquiries').insert({full_name:String(v.contactName||'').trim(),email:String(v.contactEmail||'').trim(),phone:String(v.contactPhone||'').trim(),destination:dest,travellers:count,message:`Custom trip request\nDuration: ${dur}\nGroup: ${group}\nBudget: ${budget}\nExperiences: ${exp.join(', ')||'Not specified'}`,status:'new'}).select('id').single();if(error)throw error;let emailWarning='';try{await sendTravelNotification('inquiry',saved.id);}catch(mailErr){console.warn('Enquiry saved but email notification failed:',mailErr);emailWarning=' Your request is saved, but email notifications are not configured yet.';}notice(trip,'Your custom trip request has been sent. Travel Guru will be in touch.'+emailWarning);b.textContent='Request sent ✓';}
   catch(err){console.error(err);notice(trip,`We couldn't send your trip request: ${err.message||'Please try again.'}`,true);b.disabled=false;b.textContent='Send This Trip Idea →';}
  },{once:true});
 });
}
const tabs=[...document.querySelectorAll('[data-journey]')];
function setMode(mode){const custom=mode==='custom',pkg=document.getElementById('packagePanel'),tripPanel=document.getElementById('customTripPanel');if(!pkg||!tripPanel)return;pkg.hidden=custom;tripPanel.hidden=!custom;tabs.forEach(b=>{const active=b.dataset.journey===mode;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));});}
tabs.forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.journey)));
document.querySelectorAll('a[href="#trip-builder"]').forEach(a=>{
 a.addEventListener('click',()=>{
  setMode('custom');
  const panel=document.getElementById('customTripPanel');
  if(panel){panel.hidden=false;requestAnimationFrame(()=>panel.scrollIntoView({behavior:'smooth',block:'start'}));}
 });
});
document.querySelectorAll('a[href="#booking"]').forEach(a=>{
 if(/custom trip|plan this trip/i.test(a.textContent.trim()))a.addEventListener('click',()=>setMode('custom'));
});
setMode('package');
if(!db)console.warn('Travel Guru Supabase is not configured; live form submissions are disabled.');
