// بيانات التطبيق مع نظام الحفظ التلقائي
let data = JSON.parse(localStorage.getItem('gendarmeData')) || {
  violations: [], documents: [], personal: [], archive: []
};

function save() { localStorage.setItem('gendarmeData', JSON.stringify(data)); render(); }

function showSection(id) {
  document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
  document.getElementById(id + '-section').classList.add('active');
}

// إدارة المخالفات
function addViolation() {
  const name = document.getElementById('vName').value;
  const report = document.getElementById('vReport').value;
  const date = document.getElementById('vDate').value;
  if (name && report) {
    data.violations.push({ id: Date.now(), name, report, date, paid: false, h1: false, h2: false });
    save();
    document.getElementById('vName').value = ''; document.getElementById('vReport').value = '';
  }
}

function toggleV(id, field) {
  const v = data.violations.find(x => x.id === id);
  v[field] = !v[field];
  if (v.paid && v.h1 && v.h2) {
    data.archive.push({...v, type: 'مخالفة', archiveDate: new Date().toLocaleDateString()});
    data.violations = data.violations.filter(x => x.id !== id);
  }
  save();
}

// إدارة القطع
function addDocument() {
  const title = document.getElementById('docTitle').value;
  const rec = document.getElementById('docReceived').value;
  const sub = document.getElementById('docSub').value;
  if (title) {
    data.documents.push({ id: Date.now(), title, rec, sub, done: false });
    save();
    document.getElementById('docTitle').value = '';
  }
}

function addDocument() {
  const title = document.getElementById('docTitle').value;
  const rec = document.getElementById('docReceived').value;
  const sub = document.getElementById('docSub').value;
  const notes = document.getElementById('docNotes').value; // جلب الملاحظات
  if (title) {
    data.documents.push({ id: Date.now(), title, rec, sub, notes, done: false });
    save();
    document.getElementById('docTitle').value = '';
    document.getElementById('docNotes').value = ''; // تفريغ الخانة بعد الإضافة
  }
}

function updateP(id, val) {
  data.personal.find(x => x.id === id).text = val;
  localStorage.setItem('gendarmeData', JSON.stringify(data));
}

// التحديث والبحث
function render() {
  const search = document.getElementById('globalSearch').value.toLowerCase();
  
  // رندر المخالفات
  document.getElementById('vList').innerHTML = data.violations
    .filter(v => v.name.toLowerCase().includes(search) || v.report.includes(search))
    .map(v => `
    <div class="item-card">
      <div class="card-header">${v.name} <span>#${v.report}</span></div>
      <div class="card-details">التاريخ: ${v.date}</div>
      <div class="status-group">
        <button class="status-btn ${v.paid?'on':''}" onclick="toggleV(${v.id}, 'paid')">التسديد</button>
        <button class="status-btn ${v.h1?'on':''}" onclick="toggleV(${v.id}, 'h1')">الحجز 1</button>
        <button class="status-btn ${v.h2?'on':''}" onclick="toggleV(${v.id}, 'h2')">الحجز 2</button>
      </div>
    </div>`).join('');

// رندر القطع (داخل وظيفة render)
  document.getElementById('docList').innerHTML = data.documents.map(d => `
    <div class="item-card" style="border-right-color:#ff9800">
      <div class="card-header">${d.title}</div>
      <div class="card-details">استلام: ${d.rec} | تسليم: ${d.sub}</div>
      ${d.notes ? `<div style="font-size:12px; color:#666; background:#fff9c4; padding:5px; margin-top:5px; border-radius:3px;">📝 ${d.notes}</div>` : ''}
      <div class="doc-task">
        <input type="checkbox" onclick="toggleDoc(${d.id})"> تم إنهاء الإجراءات
      </div>
    </div>`).join('');

  // رندر الشخصية
  document.getElementById('pList').innerHTML = data.personal.map(p => `
    <div class="item-card" style="border-right-color:#2196f3">
      <div onclick="this.nextElementSibling.style.display='block'" style="cursor:pointer">${p.title} ▼</div>
      <div style="display:none; margin-top:10px;">
        <textarea style="width:100%" oninput="updateP(${p.id}, this.value)">${p.text}</textarea>
      </div>
    </div>`).join('');

  // رندر الأرشيف
  document.getElementById('aList').innerHTML = data.archive.map(a => `
    <div class="item-card complete">
      <div class="card-header">${a.name || a.title} <small>(${a.type})</small></div>
      <div class="card-details">تمت الأرشفة بنجاح ✅</div>
    </div>`).join('');
}

render();