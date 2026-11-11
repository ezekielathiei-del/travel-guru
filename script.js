const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
}));
document.getElementById('year').textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll('.section-heading, .intro-grid, .experience-card, .values-grid, .vision-inner, .mission-grid, .cta-box');
revealItems.forEach(el => el.classList.add('reveal'));
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});
revealItems.forEach(el => observer.observe(el));

document.querySelectorAll('.experience-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelector('#contact')?.scrollIntoView({behavior:'smooth'});
  });
});
const ps=document.getElementById("packageSearch"),pt=document.getElementById("packageType"),cards=[...document.querySelectorAll(".package-card")],nr=document.getElementById("noResults");function filterP(){let q=(ps.value||"").toLowerCase(),t=pt.value,n=0;cards.forEach(c=>{let s=(c.dataset.search||"").includes(q)&&(t==="all"||c.dataset.type===t);c.style.display=s?"":"none";if(s)n++});nr.style.display=n?"none":"block"}ps?.addEventListener("input",filterP);pt?.addEventListener("change",filterP);document.querySelectorAll(".package-btn").forEach(b=>b.onclick=()=>{document.getElementById("destination").value=b.dataset.destination;document.getElementById("booking").scrollIntoView({behavior:"smooth"})});
const TG_WHATSAPP = '254700000000'; // Replace with Travel Guru's real WhatsApp number.
function tgWhatsApp(message){
  return `https://wa.me/${TG_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
const navWA=document.getElementById('navWhatsApp');
if(navWA) navWA.href=tgWhatsApp('Hi Travel Guru, I would like help planning a trip.');
const formWA=document.getElementById('formWhatsApp');
if(formWA) formWA.href=tgWhatsApp('Hi Travel Guru, I would like help planning a trip.');

const lb=document.getElementById("lightbox"),li=document.getElementById("lightboxImage"),lt=document.getElementById("lightboxTitle");const gd={Safari:"https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1400&q=90",Dubai:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=90",Beach:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=90",Adventure:"https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1400&q=90",Culture:"https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=90"};document.querySelectorAll(".gallery-item").forEach(x=>x.onclick=()=>{li.style.backgroundImage=`url("${gd[x.dataset.gallery]}")`;lt.textContent=x.dataset.gallery;lb.classList.add("show")});document.getElementById("closeLightbox")?.addEventListener("click",()=>lb.classList.remove("show"));
const articles={
 safari:{cat:"SAFARI GUIDE",title:"How to plan your first African safari",body:`<p>A great safari starts with choosing the right experience for the people travelling with you. Think about wildlife interests, preferred pace, accommodation style and how much time you want to spend on the road.</p><h4>Choose the destination</h4><p>Kenya and Tanzania offer a wide range of safari experiences, from classic game drives to longer journeys combining wildlife with beaches or cultural experiences.</p><h4>Choose your travel style</h4><p>Decide whether you want a comfortable lodge, a more intimate camp, a private itinerary or a group experience. Your choice affects the pace and overall character of the journey.</p><h4>Leave room for the unexpected</h4><p>Wildlife is unpredictable. A good itinerary gives you time to enjoy the experience rather than trying to fit too many activities into every day.</p>`},
 dubai:{cat:"DUBAI GUIDE",title:"How to build the perfect Dubai getaway",body:`<p>Dubai can be as relaxed or as energetic as you want it to be. A balanced itinerary combines a few major experiences with time to enjoy the city at your own pace.</p><h4>Mix city and desert</h4><p>Pair iconic city attractions and shopping with a desert experience for a different side of Dubai.</p><h4>Plan around your priorities</h4><p>Families, couples and groups often want very different experiences. Tell Travel Guru what matters most and your itinerary can be built around it.</p><h4>Keep some free time</h4><p>Don't fill every hour. Leave space for restaurants, shopping, relaxation and spontaneous discoveries.</p>`},
 zanzibar:{cat:"BEACH GUIDE",title:"Planning a Zanzibar escape",body:`<p>Zanzibar is a natural fit for travellers looking for a combination of beach time, culture and a slower pace.</p><h4>Think beyond the beach</h4><p>Include time to explore local culture, historic areas and the island's food and scenery alongside your beach stay.</p><h4>Choose your pace</h4><p>A short break can focus on relaxation, while a longer trip can combine the coast with more activities and exploration.</p><h4>Make it yours</h4><p>Tell Travel Guru whether you want romance, family time, adventure, relaxation or a mixture of experiences and the itinerary can be tailored around you.</p>`}
};
const articleModal=document.getElementById("articleModal"),articleTitle=document.getElementById("articleTitle"),articleCategory=document.getElementById("articleCategory"),articleContent=document.getElementById("articleContent");
document.querySelectorAll(".read-article").forEach(b=>b.addEventListener("click",()=>{const a=articles[b.dataset.article];articleCategory.textContent=a.cat;articleTitle.textContent=a.title;articleContent.innerHTML=a.body;articleModal.classList.add("show");articleModal.setAttribute("aria-hidden","false")}));
document.getElementById("closeArticle")?.addEventListener("click",()=>{articleModal.classList.remove("show");articleModal.setAttribute("aria-hidden","true")});
articleModal?.addEventListener("click",e=>{if(e.target===articleModal){articleModal.classList.remove("show");articleModal.setAttribute("aria-hidden","true")}});
document.querySelectorAll(".nav-links a").forEach(x=>x.addEventListener("click",()=>document.querySelector(".nav-links")?.classList.remove("open")));
// Header "Build a Trip" opens the custom trip builder in the booking section.
const headerBuildTrip = document.getElementById('headerBuildTrip');
headerBuildTrip?.addEventListener('click', () => {
  const bookingSection = document.getElementById('booking');
  const packagePanel = document.getElementById('packagePanel');
  const customPanel = document.getElementById('customTripPanel');
  const packageTab = document.getElementById('packageTab');
  const customTab = document.getElementById('customTab');
  if (packagePanel) packagePanel.hidden = true;
  if (customPanel) customPanel.hidden = false;
  packageTab?.classList.remove('active');
  packageTab?.setAttribute('aria-selected', 'false');
  customTab?.classList.add('active');
  customTab?.setAttribute('aria-selected', 'true');
  bookingSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
