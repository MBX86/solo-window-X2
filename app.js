// عناصر وأدوات مشتركة
const fields = ['level','rank','health','strength','stamina','speed','agility','intelligence','sense'];
const $ = (id) => document.getElementById(id);

function defaultData(){
  return { level:0, rank:'E', health:0, strength:0, stamina:0, speed:0, agility:0, intelligence:0, sense:0 };
}

function showMsg(t){
  const el = $('msg');
  if(!el) return;
  el.textContent = t;
  setTimeout(()=>{ if(el.textContent === t) el.textContent=''; }, 3000);
}

// 🟢 حفظ
function save(){
  const data = {};
  fields.forEach(f => {
    const el = $(f);
    data[f] = el ? (el.type === 'number' ? Number(el.value) : el.value) : null;
  });
  localStorage.setItem('solo_stats', JSON.stringify(data));
  showMsg('تم الحفظ محلياً ✅');
}
$('saveBtn').addEventListener('click', save);

// 🟢 تحميل
function load(){
  const raw = localStorage.getItem('solo_stats');
  const data = raw ? JSON.parse(raw) : defaultData();
  fields.forEach(f => {
    const el = $(f);
    if(el) el.value = (data[f] ?? defaultData()[f]);
  });
  showMsg('تم تحميل البيانات.');
}
$('loadBtn').addEventListener('click', load);
window.addEventListener('DOMContentLoaded', load);

// 🟢 إعادة ضبط
function resetStats(){
  if(!confirm('هل تريد مسح الإحصائيات وإعادة الضبط؟')) return;
  const def = defaultData();
  fields.forEach(f => { const el = $(f); if(el) el.value = def[f]; });
  localStorage.removeItem('solo_stats');
  showMsg('تمت إعادة الضبط.');
}
$('resetBtn').addEventListener('click', resetStats);

// 🟢 تصدير
function exportJSON(){
  const raw = localStorage.getItem('solo_stats') || JSON.stringify(defaultData());
  const blob = new Blob([raw], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'solo_stats.json';
  a.click();
  URL.revokeObjectURL(url);
  showMsg('تم تنزيل ملف JSON.');
}
$('exportBtn').addEventListener('click', exportJSON);

// 🟢 استيراد
function importJSON(){
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    try{
      const text = await file.text();
      const data = JSON.parse(text);
      fields.forEach(f => { const el = $(f); if(el && data[f] !== undefined) el.value = data[f]; });
      localStorage.setItem('solo_stats', JSON.stringify(data));
      showMsg('تم استيراد البيانات من JSON ✅');
    } catch(err){
      showMsg('⚠️ ملف JSON غير صالح');
    }
  };
  input.click();
}
$('importBtn').addEventListener('click', importJSON);
