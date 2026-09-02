// Dashboard JS — Role Based + All 15 Features
let currentRole = new URLSearchParams(location.search).get('role') || (JSON.parse(localStorage.getItem('gympro_currentUser')||'{}').role) || 'admin';
let currentUser = JSON.parse(localStorage.getItem('gympro_currentUser')||'null');

function requireAuth(){
  if(!currentUser || !currentUser.role){
    const ls = localStorage.getItem('gympro_currentUser');
    if(!ls){ location.href='login.html'; return false; }
    currentUser = JSON.parse(ls); currentRole = currentUser.role;
  }
  // role mismatch -> update URL but allow
  if(currentUser.role !== currentRole && !location.search.includes(currentUser.role)){
    // sync to actual logged role
    currentRole = currentUser.role;
    history.replaceState(null,'','dashboard.html?role='+currentRole);
  }
  GymPro.init();
  return true;
}

// Sidebar configs
const SIDEBARS = {
  admin: [
    {label:'ANALYTICS', items:[
      {id:'admin-overview', icon:'fas fa-chart-line', text:'Analytics Dashboard'},
      {id:'admin-reports', icon:'fas fa-chart-pie', text:'Reports'},
    ]},
    {label:'MANAGEMENT', items:[
      {id:'admin-members', icon:'fas fa-users', text:'Members'},
      {id:'admin-trainers', icon:'fas fa-person-chalkboard', text:'Trainers'},
      {id:'admin-payments', icon:'fas fa-indian-rupee-sign', text:'Payments'},
      {id:'admin-attendance', icon:'fas fa-qrcode', text:'QR Attendance'},
      {id:'admin-equipment', icon:'fas fa-dumbbell', text:'Equipment'},
    ]},
    {label:'SYSTEM', items:[
      {id:'admin-settings', icon:'fas fa-gear', text:'Settings'},
    ]}
  ],
  trainer: [
    {label:'OVERVIEW', items:[
      {id:'trainer-overview', icon:'fas fa-table-columns', text:'Dashboard'},
    ]},
    {label:'COACHING', items:[
      {id:'trainer-members', icon:'fas fa-users', text:'My Members'},
      {id:'trainer-workouts', icon:'fas fa-dumbbell', text:'Workout Plans'},
      {id:'trainer-diets', icon:'fas fa-utensils', text:'Diet Plans'},
      {id:'trainer-appointments', icon:'fas fa-calendar-check', text:'Appointments'},
      {id:'trainer-progress', icon:'fas fa-chart-line', text:'Progress'},
    ]}
  ],
  member: [
    {label:'ME', items:[
      {id:'member-overview', icon:'fas fa-table-columns', text:'Dashboard'},
      {id:'member-profile', icon:'fas fa-user', text:'My Profile'},
    ]},
    {label:'FITNESS', items:[
      {id:'member-workout', icon:'fas fa-dumbbell', text:'Workout'},
      {id:'member-diet', icon:'fas fa-utensils', text:'Diet'},
      {id:'member-attendance', icon:'fas fa-qrcode', text:'Attendance'},
      {id:'member-progress', icon:'fas fa-chart-line', text:'Progress'},
      {id:'member-appointments', icon:'fas fa-calendar', text:'Appointments'},
    ]},
    {label:'ACCOUNT', items:[
      {id:'member-payments', icon:'fas fa-indian-rupee-sign', text:'Payments'},
    ]}
  ]
};

function renderSidebar(role){
  const nav = document.getElementById('sideNav');
  const cfg = SIDEBARS[role] || SIDEBARS.admin;
  nav.innerHTML='';
  cfg.forEach(sec=>{
    const lab=document.createElement('div'); lab.className='nav-section'; lab.textContent=sec.label; nav.appendChild(lab);
    sec.items.forEach(it=>{
      const btn=document.createElement('button'); btn.className='nav-item'; btn.dataset.page=it.id;
      btn.innerHTML=`<i class="${it.icon}"></i> ${it.text}`;
      btn.onclick=()=>switchPage(it.id);
      nav.appendChild(btn);
    });
  });
  // role badge
  const roleInfo = document.getElementById('sidebarRole');
  const footName = document.getElementById('footName');
  const icons={admin:'fa-shield-halved',trainer:'fa-person-chalkboard',member:'fa-user'};
  const names={admin:'Admin',trainer:'Trainer',member:'Member'};
  const emails={admin:'anuxoo001@gmail.com',trainer:currentUser?.email||'trainer@gympro.com',member:currentUser?.email||'member@gympro.com'};
  if(roleInfo) roleInfo.innerHTML=`<div class="role-badge"><i class="fas ${icons[role]}"></i></div><div class="role-info"><strong>${names[role]}${role==='admin'?' (Anu)':''}</strong><span>${emails[role]}</span></div>`;
  if(footName) footName.textContent = currentUser?.name || names[role];
  // activate first
  const first = cfg[0].items[0].id;
  switchPage(first);
}

function switchPage(id){
  document.querySelectorAll('.page-section').forEach(p=>p.classList.remove('active'));
  const el=document.getElementById('page-'+id);
  if(el) el.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active', b.dataset.page===id));
  const titleMap={
    'admin-overview':'Analytics Dashboard','admin-members':'Members','admin-trainers':'Trainers','admin-payments':'Payments','admin-attendance':'QR Attendance','admin-equipment':'Equipment','admin-reports':'Reports','admin-settings':'Settings',
    'trainer-overview':'Trainer Dashboard','trainer-members':'My Members','trainer-workouts':'Workout Plans','trainer-diets':'Diet Plans','trainer-appointments':'Appointments','trainer-progress':'Progress',
    'member-overview':'My Dashboard','member-profile':'My Profile','member-workout':'My Workout','member-diet':'My Diet','member-attendance':'My Attendance','member-progress':'My Progress','member-payments':'My Payments','member-appointments':'Appointments'
  };
  const t=document.getElementById('pageTitle'); if(t) t.textContent=titleMap[id]||id;
  // render on demand
  if(id.startsWith('admin')) renderAdmin(id);
  if(id.startsWith('trainer')) renderTrainer(id);
  if(id.startsWith('member')) renderMember(id);
  window.scrollTo({top:0,behavior:'smooth'});
}

// Helpers
function showToast(msg){
  const t=document.getElementById('toast'); if(!t) return;
  t.textContent=msg; t.style.opacity='1'; t.style.transform='translateX(-50%) translateY(0)';
  setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(80px)'; },3000);
}
function openModal(id){ document.getElementById(id)?.classList.add('show'); }
function closeModal(id){ document.getElementById(id)?.classList.remove('show'); }
function logout(){ localStorage.removeItem('gympro_currentUser'); location.href='login.html'; }

// Notifications
function renderNotifs(){
  const list=document.getElementById('notifList'); const count=document.getElementById('notifCount');
  const notifs = GymPro.get(GymPro.LS.notifications).filter(n=> !n.userId || n.userId===currentUser.id || n.userId==='admin001' || currentRole==='admin');
  // show all for admin, filtered for others
  let filtered = currentRole==='admin' ? GymPro.get(GymPro.LS.notifications) : GymPro.get(GymPro.LS.notifications).filter(n=> n.userId===currentUser.id || n.userId==='admin001');
  // if member, show member specific + general
  const toShow = filtered.slice(0,8);
  const unread = toShow.filter(n=>!n.read).length;
  if(count) count.textContent=unread||'0';
  if(count) count.style.display = unread?'flex':'none';
  if(list) list.innerHTML = toShow.length? toShow.map(n=>`<div class="notif-item"><strong>${n.title}</strong><p>${n.msg}</p><span class="muted" style="font-size:0.7rem">${GymPro.formatDT(n.time)}</span></div>`).join('') : '<div class="notif-item"><p class="muted">No notifications</p></div>';
}
function markAllRead(){
  let notifs=GymPro.get(GymPro.LS.notifications);
  notifs = notifs.map(n=>({...n, read:true}));
  GymPro.set(GymPro.LS.notifications, notifs);
  renderNotifs(); showToast('All notifications marked read');
}
function clearNotifs(){ GymPro.set(GymPro.LS.notifications, []); renderNotifs(); showToast('Notifications cleared'); }

// Charts holders
let chartRevenue, chartMember, chartReport1, chartReport2, chartTrainerProgress, chartMemberProgress;

function initCharts(){
  // Revenue chart (admin overview)
  const ctxR=document.getElementById('revenueChart');
  if(ctxR && !chartRevenue){
    chartRevenue=new Chart(ctxR,{type:'bar',data:{labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],datasets:[{label:'Revenue ₹',data:[12000,19000,8000,15000,22000,18000,25000],backgroundColor:'#ff4d00',borderRadius:6}]},options:{responsive:true,plugins:{legend:{display:false}}}});
  }
  const ctxM=document.getElementById('memberChart');
  if(ctxM && !chartMember){
    chartMember=new Chart(ctxM,{type:'line',data:{labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],datasets:[{label:'Members',data:[2,3,4,6,8,12,28,42],borderColor:'#00e5a0',backgroundColor:'rgba(0,229,160,0.1)',fill:true,tension:0.4}]},options:{responsive:true,plugins:{legend:{display:false}}}});
  }
  const ctxR1=document.getElementById('reportChart1');
  if(ctxR1 && !chartReport1){
    chartReport1=new Chart(ctxR1,{type:'line',data:{labels:['W1','W2','W3','W4'],datasets:[{label:'Revenue',data:[28000,32000,30000,34500],borderColor:'#ff4d00',backgroundColor:'rgba(255,77,0,0.1)',fill:true,tension:0.3},{label:'Attendance',data:[32,38,40,47],borderColor:'#00e5a0',backgroundColor:'rgba(0,229,160,0.1)',fill:true,tension:0.3}]},options:{responsive:true}});
  }
  const ctxR2=document.getElementById('reportChart2');
  if(ctxR2 && !chartReport2){
    chartReport2=new Chart(ctxR2,{type:'doughnut',data:{labels:['Starter','Pro','Elite'],datasets:[{data:[1,2,2],backgroundColor:['#00b8d4','#ff4d00','#00e5a0']}]},options:{responsive:true,plugins:{legend:{position:'bottom'}}}});
  }
}

// Admin renders
function renderAdmin(id){
  if(id==='admin-overview') renderAdminOverview();
  if(id==='admin-members') renderMembers();
  if(id==='admin-trainers') renderTrainers();
  if(id==='admin-payments') renderPayments();
  if(id==='admin-attendance') renderAttendance();
  if(id==='admin-equipment') renderEquipment();
  if(id==='admin-reports') setTimeout(initCharts,100);
}

function renderAdminOverview(){
  const members=GymPro.get(GymPro.LS.members);
  const trainers=GymPro.get(GymPro.LS.trainers);
  const payments=GymPro.get(GymPro.LS.payments);
  const attendance=GymPro.get(GymPro.LS.attendance).filter(a=>a.date===GymPro.todayISO());
  document.getElementById('kpiMembers').textContent=members.length;
  document.getElementById('kpiTrainers').textContent=trainers.length;
  document.getElementById('kpiRevenue').textContent=GymPro.formatINR(payments.filter(p=>p.status==='paid').reduce((s,p)=>s+p.amount,0));
  document.getElementById('kpiAttendance').textContent=attendance.length;
  // overview payments
  const tbody=document.getElementById('overviewPayments');
  if(tbody) tbody.innerHTML=payments.slice(0,4).map(p=>`<tr><td>${p.invoice}</td><td>${p.memberName}</td><td>${p.plan}</td><td>${GymPro.formatINR(p.amount)}</td><td><span class="status ${p.status}">${p.status}</span></td></tr>`).join('');
  // equipment
  const eqDiv=document.getElementById('overviewEquipment');
  if(eqDiv){
    const eq=GymPro.get(GymPro.LS.equipment);
    eqDiv.innerHTML=eq.slice(0,3).map(e=>`<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)"><div><strong style="font-size:0.85rem">${e.name}</strong><br><span class="muted">${e.category} • Qty ${e.qty}</span></div><span class="status ${e.condition}">${e.condition}</span></div>`).join('');
  }
  setTimeout(initCharts,100);
}

// Members
function renderMembers(){
  const members=GymPro.get(GymPro.LS.members);
  const trainers=GymPro.get(GymPro.LS.trainers);
  // populate trainer selects
  const sel=document.getElementById('mTrainerSel');
  if(sel){
    sel.innerHTML=trainers.map(t=>`<option value="${t.id}">${t.name} — ${t.specialty}</option>`).join('');
  }
  // also payments member selects
  const pSel=document.getElementById('pMember');
  if(pSel) pSel.innerHTML=members.map(m=>`<option value="${m.id}">${m.name} — ${m.id} (${m.plan} ${GymPro.formatINR(m.amount)})</option>`).join('');
  const wSel=document.getElementById('wMember');
  if(wSel) wSel.innerHTML=members.map(m=>`<option value="${m.id}">${m.name}</option>`).join('');
  const dSel=document.getElementById('dMember');
  if(dSel) dSel.innerHTML=members.map(m=>`<option value="${m.id}">${m.name}</option>`).join('');
  // payment plan auto fill
  if(pSel) pSel.onchange=(e)=>{
    const m=members.find(x=>x.id===e.target.value);
    if(m){ document.getElementById('pPlan').value=m.plan; document.getElementById('pAmount').value=m.amount; }
  };
  let filtered=[...members];
  const s=document.getElementById('memberSearch')?.value.toLowerCase()||'';
  const plan=document.getElementById('memberPlanFilter')?.value||'';
  const status=document.getElementById('memberStatusFilter')?.value||'';
  if(s) filtered=filtered.filter(m=> (m.name+m.phone+m.id+m.email).toLowerCase().includes(s));
  if(plan) filtered=filtered.filter(m=>m.plan===plan);
  if(status) filtered=filtered.filter(m=>m.status===status);
  const tbody=document.getElementById('membersTable');
  if(!tbody) return;
  if(filtered.length===0) tbody.innerHTML='<tr><td colspan="9" style="text-align:center;padding:20px" class="muted">No members found</td></tr>';
  else tbody.innerHTML=filtered.map(m=>`
    <tr>
      <td><strong>${m.id}</strong></td>
      <td><div style="display:flex;align-items:center;gap:8px"><div class="avatar" style="width:28px;height:28px;font-size:0.7rem">${m.name.charAt(0)}</div> ${m.name}<br><span class="muted" style="font-size:0.7rem">${m.email||''}</span></div></td>
      <td>${m.phone}</td>
      <td><span class="chip">${m.plan}</span></td>
      <td>${GymPro.formatINR(m.amount)}</td>
      <td>${trainers.find(t=>t.id===m.trainerId)?.name||'-'}</td>
      <td>${GymPro.formatDate(m.joined)}</td>
      <td><span class="status ${m.status}">${m.status}</span></td>
      <td><div class="actions"><button class="btn btn-outline btn-sm" onclick="editMember('${m.id}')"><i class="fas fa-pen"></i></button><button class="btn btn-outline btn-sm" onclick="deleteMember('${m.id}')"><i class="fas fa-trash"></i></button><button class="btn btn-ghost btn-sm" onclick="viewMemberQR('${m.id}')"><i class="fas fa-qrcode"></i></button></div></td>
    </tr>
  `).join('');
}
function openMemberModal(editId){
  const modal=document.getElementById('memberModal');
  const title=document.getElementById('memberModalTitle');
  const isEdit=!!editId;
  title.textContent=isEdit?'Edit Member':'Add Member';
  if(isEdit){
    const m=GymPro.get(GymPro.LS.members).find(x=>x.id===editId);
    if(m){
      document.getElementById('mId').value=m.id;
      document.getElementById('mName').value=m.name;
      document.getElementById('mPhone').value=m.phone;
      document.getElementById('mEmail').value=m.email||'';
      document.getElementById('mPlanSel').value=m.plan;
      document.getElementById('mTrainerSel').value=m.trainerId;
      document.getElementById('mGoalInp').value=m.goal||'';
    }
  } else {
    document.getElementById('memberForm').reset();
    document.getElementById('mId').value='';
  }
  // refresh trainer options
  const trainers=GymPro.get(GymPro.LS.trainers);
  const sel=document.getElementById('mTrainerSel');
  sel.innerHTML=trainers.map(t=>`<option value="${t.id}">${t.name}</option>`).join('');
  if(isEdit){
    const m=GymPro.get(GymPro.LS.members).find(x=>x.id===editId);
    if(m) sel.value=m.trainerId;
  }
  openModal('memberModal');
}
function editMember(id){ openMemberModal(id); }
function deleteMember(id){
  if(!confirm('Delete member '+id+' ?')) return;
  GymPro.remove(GymPro.LS.members,id);
  GymPro.notify('admin001','Member Deleted','Member '+id+' removed');
  renderMembers(); renderAdminOverview(); showToast('Member deleted');
}
function viewMemberQR(id){ generateQRFor(id); switchPage('admin-attendance'); document.getElementById('qrMemberId').value=id; generateQR(); }

document.getElementById('memberForm')?.addEventListener('submit',(e)=>{
  e.preventDefault();
  const id=document.getElementById('mId').value;
  const data={
    name:document.getElementById('mName').value.trim(),
    phone:document.getElementById('mPhone').value.trim(),
    email:document.getElementById('mEmail').value.trim(),
    plan:document.getElementById('mPlanSel').value,
    trainerId:document.getElementById('mTrainerSel').value,
    goal:document.getElementById('mGoalInp').value.trim()||'General Fitness',
  };
  const amounts={Starter:999,Pro:1999,Elite:3499};
  data.amount=amounts[data.plan]||1999;
  if(id){
    GymPro.update(GymPro.LS.members,id,data);
    GymPro.notify(id,'Profile Updated','Your profile was updated by Admin');
    showToast('Member updated — '+GymPro.formatINR(data.amount));
  } else {
    const newId=GymPro.genId('M');
    const member={id:newId, ...data, status:'active', joined:GymPro.todayISO(), weight:70};
    GymPro.add(GymPro.LS.members,member);
    GymPro.notify(newId,'Welcome to GymPro Bhubaneswar!','Your '+data.plan+' plan activated '+GymPro.formatINR(data.amount)+'/mo. Patia reception will help you.');
    GymPro.notify('admin001','New Member',' '+data.name+' joined '+data.plan);
    showToast('Member added — '+newId+' — '+GymPro.formatINR(data.amount));
  }
  closeModal('memberModal'); renderMembers(); renderAdminOverview();
});
['memberSearch','memberPlanFilter','memberStatusFilter'].forEach(id=>{
  document.getElementById(id)?.addEventListener('input', renderMembers);
  document.getElementById(id)?.addEventListener('change', renderMembers);
});

// Trainers
function renderTrainers(){
  const trainers=GymPro.get(GymPro.LS.trainers);
  const tbody=document.getElementById('trainersTable');
  if(!tbody) return;
  tbody.innerHTML=trainers.map(t=>`
    <tr>
      <td><strong>${t.id}</strong></td>
      <td>${t.name}<br><span class="muted" style="font-size:0.7rem">${t.cert||''}</span></td>
      <td>${t.specialty}</td>
      <td>${t.phone}</td>
      <td>${t.exp}</td>
      <td>${t.members||0}</td>
      <td><span class="status ${t.status}">${t.status}</span></td>
      <td><div class="actions"><button class="btn btn-outline btn-sm" onclick="editTrainer('${t.id}')"><i class="fas fa-pen"></i></button><button class="btn btn-outline btn-sm" onclick="deleteTrainer('${t.id}')"><i class="fas fa-trash"></i></button></div></td>
    </tr>
  `).join('');
}
function openTrainerModal(editId){
  const title=document.getElementById('trainerModalTitle');
  const isEdit=!!editId;
  title.textContent=isEdit?'Edit Trainer':'Add Trainer';
  if(isEdit){
    const t=GymPro.get(GymPro.LS.trainers).find(x=>x.id===editId);
    if(t){
      document.getElementById('tId').value=t.id;
      document.getElementById('tName').value=t.name;
      document.getElementById('tSpecialty').value=t.specialty;
      document.getElementById('tPhone').value=t.phone;
      document.getElementById('tExp').value=t.exp;
      document.getElementById('tCert').value=t.cert||'';
    }
  } else {
    document.getElementById('trainerForm').reset(); document.getElementById('tId').value='';
  }
  openModal('trainerModal');
}
function editTrainer(id){ openTrainerModal(id); }
function deleteTrainer(id){ if(!confirm('Delete trainer '+id+'?')) return; GymPro.remove(GymPro.LS.trainers,id); renderTrainers(); showToast('Trainer deleted'); }
document.getElementById('trainerForm')?.addEventListener('submit',(e)=>{
  e.preventDefault();
  const id=document.getElementById('tId').value;
  const data={
    name:document.getElementById('tName').value.trim(),
    specialty:document.getElementById('tSpecialty').value.trim(),
    phone:document.getElementById('tPhone').value.trim(),
    exp:document.getElementById('tExp').value.trim()||'5+ Yrs',
    cert:document.getElementById('tCert').value.trim(),
  };
  if(id){ GymPro.update(GymPro.LS.trainers,id,data); showToast('Trainer updated'); }
  else { const newId=GymPro.genId('T'); GymPro.add(GymPro.LS.trainers,{id:newId,...data,status:'active',members:0}); showToast('Trainer added — '+newId); }
  closeModal('trainerModal'); renderTrainers();
});

// Payments
function renderPayments(){
  const pays=GymPro.get(GymPro.LS.payments);
  let filtered=[...pays];
  const s=document.getElementById('paySearch')?.value.toLowerCase()||'';
  const st=document.getElementById('payStatusFilter')?.value||'';
  if(s) filtered=filtered.filter(p=> (p.memberName+p.invoice+p.memberId).toLowerCase().includes(s));
  if(st) filtered=filtered.filter(p=>p.status===st);
  const tbody=document.getElementById('paymentsTable');
  if(!tbody) return;
  tbody.innerHTML=filtered.map(p=>`
    <tr>
      <td><strong>${p.invoice}</strong></td>
      <td>${p.memberName}<br><span class="muted" style="font-size:0.7rem">${p.memberId}</span></td>
      <td>${p.plan}</td>
      <td><strong>${GymPro.formatINR(p.amount)}</strong></td>
      <td>${p.method}</td>
      <td>${GymPro.formatDate(p.date)}</td>
      <td><span class="status ${p.status}">${p.status}</span></td>
      <td><button class="btn btn-outline btn-sm" onclick="showInvoice('${p.id}')"><i class="fas fa-file-invoice"></i> View</button></td>
    </tr>
  `).join('');
}
function openPaymentModal(){
  // refresh member list
  const members=GymPro.get(GymPro.LS.members);
  const sel=document.getElementById('pMember');
  if(sel) sel.innerHTML=members.map(m=>`<option value="${m.id}">${m.name} — ${m.id}</option>`).join('');
  // auto fill first
  if(members[0]){ document.getElementById('pPlan').value=members[0].plan; document.getElementById('pAmount').value=members[0].amount; }
  openModal('paymentModal');
}
document.getElementById('paymentForm')?.addEventListener('submit',(e)=>{
  e.preventDefault();
  const memberId=document.getElementById('pMember').value;
  const member=GymPro.get(GymPro.LS.members).find(m=>m.id===memberId);
  const data={
    id:GymPro.genId('PAY'), memberId, memberName: member?member.name:'Unknown', plan:document.getElementById('pPlan').value,
    amount: parseInt(document.getElementById('pAmount').value), method:document.getElementById('pMethod').value,
    date:GymPro.todayISO(), status:document.getElementById('pStatus').value, invoice:'INV-'+new Date().getFullYear()+'-'+String(GymPro.get(GymPro.LS.payments).length+1).padStart(3,'0')
  };
  GymPro.add(GymPro.LS.payments,data);
  GymPro.notify(memberId,'Payment '+data.status,'Your '+data.plan+' payment '+GymPro.formatINR(data.amount)+' is '+data.status+' — Invoice '+data.invoice);
  GymPro.notify('admin001','Payment '+data.status, data.memberName+' — '+GymPro.formatINR(data.amount)+' — '+data.invoice);
  closeModal('paymentModal'); renderPayments(); renderAdminOverview(); showToast('Payment recorded — '+data.invoice+' — '+GymPro.formatINR(data.amount));
  setTimeout(()=> showInvoice(data.id), 400);
});
document.getElementById('paySearch')?.addEventListener('input', renderPayments);
document.getElementById('payStatusFilter')?.addEventListener('change', renderPayments);

function showInvoice(paymentId){
  const p=GymPro.get(GymPro.LS.payments).find(x=>x.id===paymentId);
  if(!p) return;
  const html=`
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #111;padding-bottom:12px">
      <div style="display:flex;gap:12px;align-items:center"><img src="images/suusri-ai-icon.svg" alt="Suusri AI" style="height:42px;width:auto" onerror="this.style.display='none'"><div><h2 style="color:#ff4d00;margin:0;display:flex;align-items:center;gap:8px">GymPro <span style="font-size:0.55rem;background:#0a0a0f;color:#FFD700;padding:2px 6px;border-radius:4px;letter-spacing:1px">POWERED BY SUUSRI AI</span></h2><small>Bhubaneswar • Patia, Near KIIT, 751024</small><br><small>+91 81446 85376 • anuxoo001@gmail.com</small><br><small>GSTIN: 21ABCDE1234F1Z5</small></div></div>
      <div style="text-align:right"><img src="images/suusri-ai-logo.svg" alt="Suusri AI" style="height:28px;width:auto;max-width:160px;object-fit:contain;margin-bottom:6px;display:block;margin-left:auto" onerror="this.style.display='none'"><h3 style="margin:0">INVOICE</h3><strong>${p.invoice}</strong><br><small>${GymPro.formatDate(p.date)}</small><br><span class="status ${p.status}" style="display:inline-block;margin-top:6px">${p.status.toUpperCase()}</span></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:16px 0">
      <div><strong>Bill To:</strong><br>${p.memberName}<br>${p.memberId}<br>Patia, Bhubaneswar</div>
      <div style="text-align:right"><strong>Plan:</strong> ${p.plan}<br><strong>Method:</strong> ${p.method}<br><strong>Amount:</strong> <span style="font-size:1.2rem;font-weight:800;color:#ff4d00">${GymPro.formatINR(p.amount)}</span></div>
    </div>
    <table style="width:100%;border-collapse:collapse;margin:12px 0">
      <tr style="background:#f5f5f5"><th style="padding:8px;text-align:left;border:1px solid #ddd">Description</th><th style="padding:8px;text-align:right;border:1px solid #ddd">Amount</th></tr>
      <tr><td style="padding:8px;border:1px solid #ddd">Gym Membership — ${p.plan} (Monthly)</td><td style="padding:8px;text-align:right;border:1px solid #ddd">${GymPro.formatINR(p.amount)}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd">GST (18% Inclusive)</td><td style="padding:8px;text-align:right;border:1px solid #ddd">Included</td></tr>
      <tr style="background:#fff7f0"><td style="padding:8px;border:1px solid #ddd"><strong>Total Paid</strong></td><td style="padding:8px;text-align:right;border:1px solid #ddd"><strong>${GymPro.formatINR(p.amount)}</strong></td></tr>
    </table>
    <p style="font-size:0.8rem;color:#555;margin-top:12px">Thank you for choosing GymPro Bhubaneswar! This is computer generated invoice. For queries call 81446 85376 or mail anuxoo001@gmail.com</p>
    <p style="font-size:0.7rem;color:#888;text-align:center;margin-top:16px;display:flex;align-items:center;justify-content:center;gap:6px"><img src="images/suusri-ai-icon.svg" alt="" style="height:14px;width:auto" onerror="this.style.display='none'"> Invoice generated automatically — GymPro Management System • Powered by Suusri AI • Patia, Bhubaneswar</p>
  `;
  document.getElementById('invoiceContent').innerHTML=html;
  openModal('invoiceModal');
}
function printInvoice(){ const content=document.getElementById('invoiceContent').innerHTML; const w=window.open('','_blank'); w.document.write('<html><head><title>Invoice</title><style>body{font-family:Arial;padding:20px}</style></head><body>'+content+'<script>window.print()</script></body></html>'); w.document.close(); }
function exportPayments(){
  const pays=GymPro.get(GymPro.LS.payments);
  let csv='Invoice,Member,Plan,Amount,Method,Date,Status\n';
  pays.forEach(p=> csv+=`${p.invoice},${p.memberName},${p.plan},${p.amount},${p.method},${p.date},${p.status}\n`);
  const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='gympro_payments_'+GymPro.todayISO()+'.csv'; a.click();
  showToast('Payments exported as CSV');
}

// Attendance
function generateQR(){
  const id=document.getElementById('qrMemberId')?.value.trim()||'M001';
  const box=document.getElementById('qrPreview');
  if(!box) return;
  // Use QR API
  const data=encodeURIComponent('GymPro BBSR | Member:'+id+' | Patia | '+Date.now());
  box.innerHTML=`<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}" alt="QR" style="width:150px;height:150px">`;
  // also update hiddens?
}
function generateQRFor(id){ document.getElementById('qrMemberId').value=id; generateQR(); }
function markAttendance(){
  const memberId=document.getElementById('attMemberId')?.value.trim();
  if(!memberId){ showToast('Enter Member ID (e.g. M001)'); return; }
  const member=GymPro.get(GymPro.LS.members).find(m=>m.id===memberId);
  if(!member){ showToast('Member not found — check ID'); return; }
  const exists=GymPro.get(GymPro.LS.attendance).find(a=>a.memberId===memberId && a.date===GymPro.todayISO());
  if(exists){ showToast(member.name+' already marked present today at '+exists.time); return; }
  const rec={ id:GymPro.genId('A'), memberId, memberName:member.name, date:GymPro.todayISO(), time:GymPro.nowTime(), status:'present' };
  GymPro.add(GymPro.LS.attendance, rec);
  GymPro.notify(memberId,'Attendance Marked','You are marked present at '+rec.time+' — Keep streak! 🔥');
  renderAttendance(); showToast('✅ '+member.name+' — Present at '+rec.time+' (Patia)');
  document.getElementById('attMemberId').value='';
}
function renderAttendance(){
  const today=GymPro.todayISO();
  document.getElementById('attDate').textContent=GymPro.formatDate(today);
  const all=GymPro.get(GymPro.LS.attendance);
  const todayList=all.filter(a=>a.date===today);
  document.getElementById('todayAttCount').textContent=todayList.length;
  const tbody=document.getElementById('attendanceTable');
  if(tbody) tbody.innerHTML=todayList.length? todayList.map(a=>`<tr><td>${a.time}</td><td>${a.memberName}</td><td>${a.memberId}</td><td><span class="status active">present</span></td></tr>`).join('') : '<tr><td colspan="4" style="text-align:center" class="muted">No check-ins yet today — scan QR to start</td></tr>';
  const hist=document.getElementById('attendanceHistory');
  if(hist) hist.innerHTML=all.slice(0,10).map(a=>`<tr><td>${GymPro.formatDate(a.date)}</td><td>${a.memberName} (${a.memberId})</td><td>${a.time}</td></tr>`).join('');
  // also initialize QR preview if empty
  const qrBox=document.getElementById('qrPreview');
  if(qrBox && qrBox.textContent.includes('QR Preview')) generateQR();
}

// Equipment
function renderEquipment(){
  const eq=GymPro.get(GymPro.LS.equipment);
  const tbody=document.getElementById('equipmentTable');
  if(!tbody) return;
  tbody.innerHTML=eq.map(e=>`
    <tr>
      <td><strong>${e.id}</strong></td>
      <td>${e.name}</td>
      <td>${e.category}</td>
      <td>${e.qty}</td>
      <td><span class="status ${e.condition}">${e.condition}</span></td>
      <td>${GymPro.formatDate(e.last)}</td>
      <td><div class="actions"><button class="btn btn-outline btn-sm" onclick="editEquipment('${e.id}')"><i class="fas fa-pen"></i></button><button class="btn btn-outline btn-sm" onclick="deleteEquipment('${e.id}')"><i class="fas fa-trash"></i></button><button class="btn btn-ghost btn-sm" onclick="toggleEquipment('${e.id}')"><i class="fas fa-arrows-rotate"></i></button></div></td>
    </tr>
  `).join('');
}
function openEquipmentModal(editId){
  const isEdit=!!editId;
  if(isEdit){
    const e=GymPro.get(GymPro.LS.equipment).find(x=>x.id===editId);
    if(e){ document.getElementById('eId').value=e.id; document.getElementById('eName').value=e.name; document.getElementById('eCat').value=e.category; document.getElementById('eQty').value=e.qty; document.getElementById('eCond').value=e.condition; document.getElementById('eLast').value=e.last; }
  } else { document.getElementById('equipmentForm').reset(); document.getElementById('eId').value=''; document.getElementById('eLast').value=GymPro.todayISO(); }
  openModal('equipmentModal');
}
function editEquipment(id){ openEquipmentModal(id); }
function deleteEquipment(id){ if(!confirm('Delete '+id+'?')) return; GymPro.remove(GymPro.LS.equipment,id); renderEquipment(); showToast('Equipment deleted'); }
function toggleEquipment(id){
  const e=GymPro.get(GymPro.LS.equipment).find(x=>x.id===id);
  if(e){ const next=e.condition==='working'?'maintenance':'working'; GymPro.update(GymPro.LS.equipment,id,{condition:next, last:GymPro.todayISO()}); renderEquipment(); showToast(e.name+' — '+next); }
}
document.getElementById('equipmentForm')?.addEventListener('submit',(e)=>{
  e.preventDefault();
  const id=document.getElementById('eId').value;
  const data={ name:document.getElementById('eName').value.trim(), category:document.getElementById('eCat').value, qty:parseInt(document.getElementById('eQty').value), condition:document.getElementById('eCond').value, last:document.getElementById('eLast').value||GymPro.todayISO() };
  if(id){ GymPro.update(GymPro.LS.equipment,id,data); showToast('Equipment updated'); }
  else { const nid=GymPro.genId('EQ'); GymPro.add(GymPro.LS.equipment,{id:nid,...data}); showToast('Equipment added — '+nid); }
  closeModal('equipmentModal'); renderEquipment();
});
function printReport(){ window.print(); showToast('Report printed — Patia, Bhubaneswar'); }

// Trainer renders
function renderTrainer(id){
  if(id==='trainer-overview') renderTrainerOverview();
  if(id==='trainer-members') renderTrainerMembers();
  if(id==='trainer-workouts') renderWorkouts();
  if(id==='trainer-diets') renderDiets();
  if(id==='trainer-appointments') renderTrainerAppointments();
  if(id==='trainer-progress') renderTrainerProgressSetup();
}
function renderTrainerOverview(){
  const trainerId=currentUser.id;
  // find trainer or use first
  const members=GymPro.get(GymPro.LS.members).filter(m=>m.trainerId===trainerId);
  // if demo trainer not matched, show all
  const toShow = members.length? members : GymPro.get(GymPro.LS.members).slice(0,3);
  document.getElementById('tKpiMembers').textContent=toShow.length;
  document.getElementById('tKpiAppt').textContent=GymPro.get(GymPro.LS.appointments).filter(a=> a.trainerId===trainerId && a.status==='pending').length;
  document.getElementById('tKpiWorkouts').textContent=GymPro.get(GymPro.LS.workouts).filter(w=>w.trainerId===trainerId).length;
  document.getElementById('tKpiDiets').textContent=GymPro.get(GymPro.LS.diets).filter(d=>d.trainerId===trainerId).length;
  const mini=document.getElementById('trainerMembersMini');
  if(mini) mini.innerHTML=toShow.map(m=>`<tr><td>${m.name}</td><td>${m.goal}</td><td>${m.plan}</td><td>${m.weight}kg</td></tr>`).join('');
  const apptMini=document.getElementById('trainerApptMini');
  if(apptMini){
    const appts=GymPro.get(GymPro.LS.appointments).filter(a=>a.trainerId===trainerId).slice(0,3);
    apptMini.innerHTML=appts.length? appts.map(a=>`<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)"><div><strong>${a.memberName}</strong><br><span class="muted">${a.date} • ${a.time} • ${a.type}</span></div><span class="status ${a.status}">${a.status}</span></div>`).join('') : '<p class="muted">No appointments today</p>';
  }
}
function renderTrainerMembers(){
  const trainerId=currentUser.id;
  let members=GymPro.get(GymPro.LS.members).filter(m=>m.trainerId===trainerId);
  if(members.length===0) members=GymPro.get(GymPro.LS.members);
  document.getElementById('trainerNameLabel').textContent='Trainer: '+(currentUser.name||trainerId)+' — '+GymPro.get(GymPro.LS.trainers).find(t=>t.id===trainerId)?.specialty||'';
  const tbody=document.getElementById('trainerMembersTable');
  if(!tbody) return;
  tbody.innerHTML=members.map(m=>`
    <tr>
      <td>${m.id}</td><td>${m.name}</td><td>${m.phone}</td><td>${m.goal}</td><td>${m.plan}</td>
      <td><div class="progress-bar" style="width:80px"><div class="progress-fill" style="width:${Math.min(100, Math.random()*90+10)}%"></div></div></td>
      <td><div class="actions"><button class="btn btn-outline btn-sm" onclick="viewMemberProgress('${m.id}')"><i class="fas fa-chart-line"></i></button><button class="btn btn-ghost btn-sm" onclick="openWorkoutFor('${m.id}')"><i class="fas fa-dumbbell"></i></button></div></td>
    </tr>
  `).join('');
}
function viewMemberProgress(memberId){
  document.getElementById('progressMemberSelect').value=memberId;
  switchPage('trainer-progress'); renderTrainerProgress();
}
function openWorkoutFor(memberId){
  document.getElementById('wMember').value=memberId;
  openWorkoutModal();
}

// Workouts
function renderWorkouts(){
  const workouts=GymPro.get(GymPro.LS.workouts);
  const trainerId=currentUser.id;
  let filtered= currentRole==='trainer' && trainerId ? workouts.filter(w=>w.trainerId===trainerId) : workouts;
  const s=document.getElementById('workoutSearch')?.value.toLowerCase()||'';
  if(s) filtered=filtered.filter(w=> (w.memberName+w.title).toLowerCase().includes(s));
  const tbody=document.getElementById('workoutsTable');
  if(!tbody) return;
  tbody.innerHTML=filtered.length? filtered.map(w=>`
    <tr>
      <td><strong>${w.title}</strong><br><span class="muted" style="font-size:0.7rem">${w.id}</span></td>
      <td>${w.memberName}<br><span class="muted" style="font-size:0.7rem">${w.memberId}</span></td>
      <td>${(w.exercises||[]).map(e=>e.name||e).join(', ').slice(0,60)}</td>
      <td>${GymPro.formatDate(w.date)}</td>
      <td><span class="status active">${w.status}</span></td>
      <td><div class="actions"><button class="btn btn-outline btn-sm" onclick="deleteWorkout('${w.id}')"><i class="fas fa-trash"></i></button><button class="btn btn-ghost btn-sm" onclick="shareWorkout('${w.id}')"><i class="fas fa-share"></i></button></div></td>
    </tr>
  `).join('') : '<tr><td colspan="6" style="text-align:center" class="muted">No workout plans — create one or use AI 🤖</td></tr>';
}
function openWorkoutModal(){ // refresh member list
  const members=GymPro.get(GymPro.LS.members);
  const sel=document.getElementById('wMember');
  if(sel) sel.innerHTML=members.map(m=>`<option value="${m.id}">${m.name} — ${m.goal}</option>`).join('');
  openModal('workoutModal');
}
document.getElementById('workoutForm')?.addEventListener('submit',(e)=>{
  e.preventDefault();
  const memberId=document.getElementById('wMember').value;
  const member=GymPro.get(GymPro.LS.members).find(m=>m.id===memberId);
  const title=document.getElementById('wTitle').value.trim();
  const exRaw=document.getElementById('wExercises').value.trim();
  const exercises=exRaw? exRaw.split(',').map(s=>{
    const [name,rep]=s.split('-'); const [sets,reps]= (rep||'3x12').split('x');
    return {name: name.trim(), sets: parseInt(sets)||3, reps: (reps||'12').trim()};
  }) : [{name:'Pushups',sets:3,reps:15}];
  const data={ id:GymPro.genId('W'), memberId, memberName: member?member.name:'Unknown', trainerId: currentUser.id||'T001', title, exercises, date:GymPro.todayISO(), status:'active' };
  GymPro.add(GymPro.LS.workouts,data);
  GymPro.notify(memberId,'New Workout Plan','Trainer '+ (currentUser.name||'Coach') +' assigned: '+title);
  closeModal('workoutModal'); renderWorkouts(); renderTrainerOverview(); showToast('Workout assigned to '+data.memberName+' 🏋️');
});
document.getElementById('workoutSearch')?.addEventListener('input', renderWorkouts);
function deleteWorkout(id){ if(!confirm('Delete workout '+id+'?')) return; GymPro.remove(GymPro.LS.workouts,id); renderWorkouts(); showToast('Workout deleted'); }
function shareWorkout(id){ showToast('Workout '+id+' link copied — share with member'); }
function aiWorkout(){
  const members=GymPro.get(GymPro.LS.members);
  if(members.length===0) return;
  const m=members[0];
  const goal=m.goal||'Weight Loss';
  let title='', ex='';
  if(goal.includes('Weight')){ title='AI Fat Burn Circuit'; ex='Burpees - 4x15, Mountain Climbers - 4x20, Jump Squats - 3x12, Plank - 3x60s'; }
  else if(goal.includes('Muscle')){ title='AI Muscle Builder'; ex='Bench Press - 4x10, Deadlift - 3x8, Pullups - 3x10, Shoulder Press - 3x12'; }
  else { title='AI Balanced Fitness'; ex='Squats - 3x15, Pushups - 3x15, Lunges - 3x12, Bicycle Crunches - 3x20'; }
  document.getElementById('wTitle').value=title; document.getElementById('wExercises').value=ex; document.getElementById('wMember').value=m.id;
  showToast('🤖 AI generated workout for '+m.name+' — '+title+' — click Assign');
  openModal('workoutModal');
}

// Diets
function renderDiets(){
  const diets=GymPro.get(GymPro.LS.diets);
  const trainerId=currentUser.id;
  let filtered= currentRole==='trainer' ? diets.filter(d=>d.trainerId===trainerId) : diets;
  if(filtered.length===0 && currentRole==='trainer') filtered=diets;
  const s=document.getElementById('dietSearch')?.value.toLowerCase()||'';
  if(s) filtered=filtered.filter(d=> (d.title+d.memberName).toLowerCase().includes(s));
  const tbody=document.getElementById('dietsTable');
  if(!tbody) return;
  tbody.innerHTML=filtered.length? filtered.map(d=>`
    <tr>
      <td><strong>${d.title}</strong><br><span class="muted" style="font-size:0.7rem">${d.id}</span></td>
      <td>${d.memberName||d.memberId}</td>
      <td>${d.calories||'-'} kcal</td>
      <td>${(d.meals||[]).map(m=> (m.time||'')+':'+(m.food||m)).join(' • ').slice(0,80)}</td>
      <td><div class="actions"><button class="btn btn-outline btn-sm" onclick="deleteDiet('${d.id}')"><i class="fas fa-trash"></i></button></div></td>
    </tr>
  `).join('') : '<tr><td colspan="5" style="text-align:center" class="muted">No diet plans — use AI 🥗</td></tr>';
}
function openDietModal(){
  const members=GymPro.get(GymPro.LS.members);
  const sel=document.getElementById('dMember');
  if(sel) sel.innerHTML=members.map(m=>`<option value="${m.id}">${m.name} — ${m.goal}</option>`).join('');
  openModal('dietModal');
}
document.getElementById('dietForm')?.addEventListener('submit',(e)=>{
  e.preventDefault();
  const memberId=document.getElementById('dMember').value;
  const member=GymPro.get(GymPro.LS.members).find(m=>m.id===memberId);
  const title=document.getElementById('dTitle').value.trim();
  const calories=parseInt(document.getElementById('dCalories').value)||1800;
  const mealsRaw=document.getElementById('dMeals').value.trim();
  const meals=mealsRaw? mealsRaw.split('\n').map(l=>{
    const [time,food]=l.split('-'); return {time:(time||'').trim(), food:(food||l).trim()};
  }) : [];
  const data={ id:GymPro.genId('D'), memberId, memberName: member?member.name:'Unknown', trainerId: currentUser.id||'T004', title, calories, meals, date:GymPro.todayISO() };
  GymPro.add(GymPro.LS.diets,data);
  GymPro.notify(memberId,'New Diet Plan','🥗 '+title+' ('+calories+' kcal) assigned by '+(currentUser.name||'Nutritionist'));
  closeModal('dietModal'); renderDiets(); showToast('Diet assigned to '+data.memberName);
});
document.getElementById('dietSearch')?.addEventListener('input', renderDiets);
function deleteDiet(id){ if(!confirm('Delete diet '+id+'?')) return; GymPro.remove(GymPro.LS.diets,id); renderDiets(); showToast('Diet deleted'); }
function aiDiet(){
  const members=GymPro.get(GymPro.LS.members);
  if(members.length===0) return;
  const m=members[0];
  document.getElementById('dMember').value=m.id;
  document.getElementById('dTitle').value='AI Odia Balanced 1800kcal';
  document.getElementById('dCalories').value=1800;
  document.getElementById('dMeals').value='8AM - Oats + Boiled Eggs + Papaya\n1PM - Brown Rice + Dalma + Dahi + Salad\n4PM - Roasted Chana + Coconut Water\n8PM - Chapati 2 + Chicken/Fish + Veg Curry';
  showToast('🤖 AI diet for '+m.name+' — Odia mix 1800kcal — click Assign');
  openModal('dietModal');
}

// Trainer appointments
function renderTrainerAppointments(){
  const trainerId=currentUser.id;
  let appts=GymPro.get(GymPro.LS.appointments);
  // if trainer, filter
  if(currentRole==='trainer') appts=appts.filter(a=>a.trainerId===trainerId);
  if(appts.length===0 && currentRole==='trainer'){
    // show all as demo
    appts=GymPro.get(GymPro.LS.appointments);
  }
  const tbody=document.getElementById('trainerApptTable');
  if(!tbody) return;
  tbody.innerHTML=appts.length? appts.map(a=>`
    <tr>
      <td>${GymPro.formatDate(a.date)}</td><td>${a.time}</td><td>${a.memberName}</td><td>${a.type}</td>
      <td><span class="status ${a.status}">${a.status}</span></td>
      <td><div class="actions">${a.status==='pending'?`<button class="btn btn-sm" onclick="confirmAppt('${a.id}')"><i class="fas fa-check"></i> Confirm</button>`:''}<button class="btn btn-outline btn-sm" onclick="deleteAppt('${a.id}')"><i class="fas fa-times"></i></button></div></td>
    </tr>
  `).join('') : '<tr><td colspan="6" style="text-align:center" class="muted">No appointments</td></tr>';
}
function confirmAppt(id){ GymPro.update(GymPro.LS.appointments,id,{status:'confirmed'}); const a=GymPro.get(GymPro.LS.appointments).find(x=>x.id===id); if(a) GymPro.notify(a.memberId,'Appointment Confirmed','Your '+a.type+' on '+a.date+' at '+a.time+' confirmed by '+ (currentUser.name||'Trainer')); renderTrainerAppointments(); showToast('Appointment confirmed'); }
function deleteAppt(id){ if(!confirm('Cancel appointment?')) return; GymPro.remove(GymPro.LS.appointments,id); renderTrainerAppointments(); showToast('Appointment cancelled'); }

// Trainer progress
function renderTrainerProgressSetup(){
  const sel=document.getElementById('progressMemberSelect');
  if(sel){
    const members=GymPro.get(GymPro.LS.members);
    sel.innerHTML=members.map(m=>`<option value="${m.id}">${m.name} — ${m.id}</option>`).join('');
    if(members[0]) sel.value=members[0].id;
  }
  renderTrainerProgress();
}
function renderTrainerProgress(){
  const memberId=document.getElementById('progressMemberSelect')?.value;
  if(!memberId) return;
  const progress=GymPro.get(GymPro.LS.progress).filter(p=>p.memberId===memberId).sort((a,b)=> new Date(a.date)-new Date(b.date));
  const logDiv=document.getElementById('trainerProgressLog');
  if(logDiv) logDiv.innerHTML=progress.length? progress.map(p=>`<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)"><span>${GymPro.formatDate(p.date)} — ${p.weight}kg, ${p.bodyFat||'-'}% fat</span><span class="muted">${p.notes||''}</span></div>`).join('') : '<p class="muted">No progress yet</p>';
  const ctx=document.getElementById('trainerProgressChart');
  if(ctx){
    if(chartTrainerProgress) chartTrainerProgress.destroy();
    chartTrainerProgress=new Chart(ctx,{type:'line',data:{labels:progress.map(p=>p.date),datasets:[{label:'Weight kg',data:progress.map(p=>p.weight),borderColor:'#ff4d00',backgroundColor:'rgba(255,77,0,0.1)',fill:true,tension:0.3},{label:'Body Fat %',data:progress.map(p=>p.bodyFat),borderColor:'#00e5a0',backgroundColor:'rgba(0,229,160,0.1)',fill:true,tension:0.3}]},options:{responsive:true}});
  }
}

// Member renders
function renderMember(id){
  if(id==='member-overview') renderMemberOverview();
  if(id==='member-profile') renderMemberProfile();
  if(id==='member-workout') renderMemberWorkout();
  if(id==='member-diet') renderMemberDiet();
  if(id==='member-attendance') renderMemberAttendance();
  if(id==='member-payments') renderMemberPayments();
  if(id==='member-progress') renderMemberProgress();
  if(id==='member-appointments') renderMemberAppointments();
}

function getMemberId(){
  // currentUser.id for member is memberId, else pick first member for demo if admin/trainer viewing? But member role should have correct id
  if(currentRole==='member' && currentUser.id && currentUser.id.startsWith('M')) return currentUser.id;
  // if trainer/admin previewing member pages, use first member
  const members=GymPro.get(GymPro.LS.members);
  return members[0]?.id || 'M001';
}

function renderMemberOverview(){
  const memberId=getMemberId();
  const member=GymPro.get(GymPro.LS.members).find(m=>m.id===memberId);
  if(!member) return;
  document.getElementById('mPlan').textContent=member.plan;
  document.getElementById('mPlanPrice').textContent=GymPro.formatINR(member.amount)+'/mo';
  const att=GymPro.get(GymPro.LS.attendance).filter(a=>a.memberId===memberId);
  const thisMonth=att.filter(a=> new Date(a.date).getMonth()===new Date().getMonth()).length;
  document.getElementById('mAtt').textContent=thisMonth;
  document.getElementById('mAttPct').textContent=thisMonth+'/30 days this month';
  const prog=GymPro.get(GymPro.LS.progress).filter(p=>p.memberId===memberId).sort((a,b)=> new Date(b.date)-new Date(a.date));
  const latest=prog[0];
  document.getElementById('mWeight').textContent=(latest?latest.weight:member.weight||'70')+' kg';
  document.getElementById('mWeightChange').textContent=prog.length>1? (latest.weight - prog[prog.length-1].weight>0? '+'+(latest.weight - prog[prog.length-1].weight).toFixed(1)+'kg' : (latest.weight - prog[prog.length-1].weight).toFixed(1)+'kg') : 'Log progress to track';
  const goals=GymPro.get(GymPro.LS.goals).filter(g=>g.memberId===memberId);
  const activeGoal=goals[0];
  if(activeGoal){
    const pct=Math.min(100, Math.round((activeGoal.current/activeGoal.target)*100));
    document.getElementById('mGoalPct').textContent=pct+'%';
    document.getElementById('mGoalTitle').textContent=activeGoal.title;
  } else {
    document.getElementById('mGoalPct').textContent='0%';
    document.getElementById('mGoalTitle').textContent='Set your first goal';
  }
  // mini workout/diet
  const workout=GymPro.get(GymPro.LS.workouts).find(w=>w.memberId===memberId);
  const diet=GymPro.get(GymPro.LS.diets).find(d=>d.memberId===memberId);
  const wMini=document.getElementById('memberWorkoutMini');
  if(wMini) wMini.innerHTML=workout? `<strong>${workout.title}</strong><p class="muted" style="font-size:0.8rem">${(workout.exercises||[]).map(e=>e.name).join(', ').slice(0,80)}</p><span class="muted" style="font-size:0.7rem">Trainer: ${GymPro.get(GymPro.LS.trainers).find(t=>t.id===workout.trainerId)?.name||'-'} • ${GymPro.formatDate(workout.date)}</span>` : '<p class="muted">No workout assigned yet — ask trainer or use AI 🤖</p>';
  const dMini=document.getElementById('memberDietMini');
  if(dMini) dMini.innerHTML=diet? `<strong>${diet.title}</strong> — ${diet.calories} kcal<p class="muted" style="font-size:0.8rem">${(diet.meals||[]).slice(0,2).map(m=>m.food).join(' • ')}</p>` : '<p class="muted">No diet plan yet</p>';
  const nextAppt=GymPro.get(GymPro.LS.appointments).find(a=>a.memberId===memberId && a.status==='confirmed');
  const apptDiv=document.getElementById('memberNextAppt');
  if(apptDiv) apptDiv.innerHTML= nextAppt? `${nextAppt.date} at ${nextAppt.time} — ${nextAppt.trainerName||nextAppt.trainerId} (${nextAppt.type})` : 'No appointment — <a href="#" onclick="switchPage(\'member-appointments\')" style="color:var(--primary)">Book Now</a>';
  // goals list
  const goalsDiv=document.getElementById('memberGoals');
  if(goalsDiv) goalsDiv.innerHTML=goals.length? goals.map(g=>{
    const pct=Math.min(100, Math.round((g.current/g.target)*100));
    return `<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:0.85rem"><strong>${g.title}</strong><span>${g.current}/${g.target} (${pct}%)</span></div><div class="progress-bar" style="margin-top:6px"><div class="progress-fill" style="width:${pct}%"></div></div><span class="muted" style="font-size:0.7rem">Deadline: ${GymPro.formatDate(g.deadline)} • ${g.status}</span></div>`;
  }).join('') : '<p class="muted">No goals yet — add one to stay motivated 🏆</p>';
}

function renderMemberProfile(){
  const memberId=getMemberId();
  const member=GymPro.get(GymPro.LS.members).find(m=>m.id===memberId);
  if(!member) return;
  const card=document.getElementById('profileCard');
  if(card) card.innerHTML=`
    <div style="display:flex;gap:14px;align-items:center"><div class="avatar" style="width:60px;height:60px;font-size:1.4rem">${member.name.charAt(0)}</div><div><strong>${member.name}</strong><br><span class="muted">${member.id} • ${member.plan} • ${GymPro.formatINR(member.amount)}/mo</span><br><span class="muted">${member.phone} • ${member.email||'no email'}</span></div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px">
      <div class="card" style="padding:12px;background:var(--dark3)"><strong>Goal</strong><br><span class="muted">${member.goal}</span></div>
      <div class="card" style="padding:12px;background:var(--dark3)"><strong>Trainer</strong><br><span class="muted">${GymPro.get(GymPro.LS.trainers).find(t=>t.id===member.trainerId)?.name||'-'}</span></div>
      <div class="card" style="padding:12px;background:var(--dark3)"><strong>Joined</strong><br><span class="muted">${GymPro.formatDate(member.joined)}</span></div>
      <div class="card" style="padding:12px;background:var(--dark3)"><strong>Status</strong><br><span class="status ${member.status}">${member.status}</span></div>
    </div>
  `;
  document.getElementById('editName').value=member.name;
  document.getElementById('editPhone').value=member.phone;
  document.getElementById('editEmail').value=member.email||'';
  document.getElementById('editGoal').value=member.goal||'General Fitness';
  // QR
  const qrData=encodeURIComponent('GymPro|'+member.id+'|'+member.name+'|Patia Bhubaneswar|'+Date.now());
  const qrUrl='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data='+qrData;
  const qr1=document.getElementById('memberQR');
  const qr2=document.getElementById('memberQR2');
  const qid=document.getElementById('memberQRId');
  const qid2=document.getElementById('memberQRId2');
  if(qr1) qr1.innerHTML=`<img src="${qrUrl}" alt="QR" style="width:150px;height:150px">`;
  if(qr2) qr2.innerHTML=`<img src="${qrUrl}" alt="QR" style="width:150px;height:150px">`;
  if(qid) qid.textContent=member.id+' • '+member.name;
  if(qid2) qid2.textContent=member.id+' • '+member.name;
}
function saveProfile(){
  const memberId=getMemberId();
  const data={ name:document.getElementById('editName').value.trim(), phone:document.getElementById('editPhone').value.trim(), email:document.getElementById('editEmail').value.trim(), goal:document.getElementById('editGoal').value };
  GymPro.update(GymPro.LS.members,memberId,data);
  // also update currentUser name if member
  if(currentUser && currentUser.id===memberId){ currentUser.name=data.name; localStorage.setItem('gympro_currentUser', JSON.stringify(currentUser)); }
  showToast('Profile updated ✅'); renderMemberProfile(); renderMemberOverview();
}
function memberCheckIn(){
  const memberId=getMemberId();
  const member=GymPro.get(GymPro.LS.members).find(m=>m.id===memberId);
  const exists=GymPro.get(GymPro.LS.attendance).find(a=>a.memberId===memberId && a.date===GymPro.todayISO());
  if(exists){ showToast('Already checked in today at '+exists.time); return; }
  GymPro.add(GymPro.LS.attendance,{id:GymPro.genId('A'), memberId, memberName: member?member.name:'Member', date:GymPro.todayISO(), time:GymPro.nowTime(), status:'present'});
  GymPro.notify('admin001','Check-in',' '+ (member?member.name:memberId)+' checked in via QR');
  renderMemberAttendance(); renderMemberOverview(); showToast('✅ Checked in at '+GymPro.nowTime()+' — Patia');
}
function renderMemberWorkout(){
  const memberId=getMemberId();
  const workouts=GymPro.get(GymPro.LS.workouts).filter(w=>w.memberId===memberId);
  const tbody=document.getElementById('memberWorkoutTable');
  if(!tbody) return;
  tbody.innerHTML=workouts.length? workouts.map(w=>`<tr><td><strong>${w.title}</strong><br><span class="muted" style="font-size:0.7rem">${w.id}</span></td><td>${GymPro.get(GymPro.LS.trainers).find(t=>t.id===w.trainerId)?.name||w.trainerId}</td><td>${(w.exercises||[]).map(e=>e.name+' '+e.sets+'x'+e.reps).join(', ').slice(0,80)}</td><td>${GymPro.formatDate(w.date)}</td></tr>`).join('') : '<tr><td colspan="4" style="text-align:center" class="muted">No workouts yet — use AI to generate 🤖</td></tr>';
}
function renderMemberDiet(){
  const memberId=getMemberId();
  const diets=GymPro.get(GymPro.LS.diets).filter(d=>d.memberId===memberId);
  const tbody=document.getElementById('memberDietTable');
  if(!tbody) return;
  tbody.innerHTML=diets.length? diets.map(d=>`<tr><td><strong>${d.title}</strong></td><td>${GymPro.get(GymPro.LS.trainers).find(t=>t.id===d.trainerId)?.name||d.trainerId}</td><td>${d.calories} kcal</td><td>${(d.meals||[]).map(m=>m.time+': '+m.food).join(' | ').slice(0,100)}</td></tr>`).join('') : '<tr><td colspan="4" style="text-align:center" class="muted">No diet plans</td></tr>';
}
function renderMemberAttendance(){
  const memberId=getMemberId();
  const all=GymPro.get(GymPro.LS.attendance).filter(a=>a.memberId===memberId).sort((a,b)=> new Date(b.date)-new Date(a.date));
  document.getElementById('memberAttStats').textContent=all.length+' days • '+ all.filter(a=> new Date(a.date).getMonth()===new Date().getMonth()).length +' this month';
  const tbody=document.getElementById('memberAttTable');
  if(tbody) tbody.innerHTML=all.length? all.map(a=>`<tr><td>${GymPro.formatDate(a.date)}</td><td>${a.time}</td><td><span class="status active">present</span></td></tr>`).join('') : '<tr><td colspan="3" style="text-align:center" class="muted">No attendance yet</td></tr>';
  renderMemberProfile(); // refresh QR
}
function renderMemberPayments(){
  const memberId=getMemberId();
  const pays=GymPro.get(GymPro.LS.payments).filter(p=>p.memberId===memberId);
  const tbody=document.getElementById('memberPaymentsTable');
  if(!tbody) return;
  tbody.innerHTML=pays.length? pays.map(p=>`<tr><td>${p.invoice}</td><td>${p.plan}</td><td>${GymPro.formatINR(p.amount)}</td><td>${p.method}</td><td>${GymPro.formatDate(p.date)}</td><td><span class="status ${p.status}">${p.status}</span></td><td><button class="btn btn-outline btn-sm" onclick="showInvoice('${p.id}')"><i class="fas fa-download"></i> PDF</button></td></tr>`).join('') : '<tr><td colspan="7" style="text-align:center" class="muted">No payments</td></tr>';
}
function requestInvoice(){ showToast('Invoice request sent to admin — anuxoo001@gmail.com will email you'); GymPro.notify('admin001','Invoice Request','Member '+getMemberId()+' requested invoice'); }
function renderMemberProgress(){
  const memberId=getMemberId();
  const prog=GymPro.get(GymPro.LS.progress).filter(p=>p.memberId===memberId).sort((a,b)=> new Date(a.date)-new Date(b.date));
  const tbody=document.getElementById('memberProgressTable');
  if(tbody) tbody.innerHTML=prog.length? prog.map(p=>`<tr><td>${GymPro.formatDate(p.date)}</td><td>${p.weight}kg</td><td>${p.bodyFat||'-'}%</td><td>${p.notes||''}</td></tr>`).join('') : '<tr><td colspan="4" style="text-align:center" class="muted">No logs yet — add one</td></tr>';
  const goals=GymPro.get(GymPro.LS.goals).filter(g=>g.memberId===memberId);
  const goalsDiv=document.getElementById('memberGoals2');
  if(goalsDiv) goalsDiv.innerHTML=goals.length? goals.map(g=>{
    const pct=Math.min(100, Math.round((g.current/g.target)*100));
    const achieved = pct>=100;
    return `<div style="padding:10px;border:1px solid var(--border);border-radius:10px;margin-bottom:8px;background:${achieved?'rgba(0,229,160,0.08)':'var(--dark3)'}"><div style="display:flex;justify-content:space-between"><strong>${g.title} ${achieved?'🏆':''}</strong><span>${g.current}/${g.target} (${pct}%)</span></div><div class="progress-bar" style="margin-top:6px"><div class="progress-fill" style="width:${pct}%"></div></div><span class="muted" style="font-size:0.7rem">Deadline: ${GymPro.formatDate(g.deadline)} • ${achieved?'Achieved! 🎉':g.status}</span><button class="btn btn-ghost btn-sm" style="float:right;margin-top:6px" onclick="updateGoal('${g.id}')"><i class="fas fa-plus"></i> +1 Progress</button><div style="clear:both"></div></div>`;
  }).join('') : '<p class="muted">No goals — add one 🏆</p>';
  const ctx=document.getElementById('memberProgressChart');
  if(ctx){
    if(chartMemberProgress) chartMemberProgress.destroy();
    chartMemberProgress=new Chart(ctx,{type:'line',data:{labels:prog.map(p=>p.date),datasets:[{label:'Weight',data:prog.map(p=>p.weight),borderColor:'#ff4d00',backgroundColor:'rgba(255,77,0,0.1)',fill:true,tension:0.3},{label:'Body Fat',data:prog.map(p=>p.bodyFat),borderColor:'#00e5a0',backgroundColor:'rgba(0,229,160,0.1)',fill:true,tension:0.3}]},options:{responsive:true}});
  }
}
function openProgressModal(){ document.getElementById('prDate').value=GymPro.todayISO(); openModal('progressModal'); }
document.getElementById('progressForm')?.addEventListener('submit',(e)=>{
  e.preventDefault();
  const memberId=getMemberId();
  const data={ id:GymPro.genId('PR'), memberId, date:document.getElementById('prDate').value, weight:parseFloat(document.getElementById('prWeight').value), bodyFat:parseFloat(document.getElementById('prFat').value)||null, notes:document.getElementById('prNotes').value.trim() };
  GymPro.add(GymPro.LS.progress,data);
  // update member weight
  GymPro.update(GymPro.LS.members,memberId,{weight:data.weight});
  // check goal progress
  const goals=GymPro.get(GymPro.LS.goals).filter(g=>g.memberId===memberId);
  // simple: if weight loss goal, increment current by diff
  closeModal('progressModal'); renderMemberProgress(); renderMemberOverview(); showToast('Progress logged — '+data.weight+'kg');
  GymPro.notify(memberId,'Progress Updated','Weight logged: '+data.weight+'kg on '+data.date);
});
function openGoalModal(){ openModal('goalModal'); }
document.getElementById('goalForm')?.addEventListener('submit',(e)=>{
  e.preventDefault();
  const memberId=getMemberId();
  const data={ id:GymPro.genId('G'), memberId, title:document.getElementById('gTitle').value.trim(), target:parseFloat(document.getElementById('gTarget').value), current:parseFloat(document.getElementById('gCurrent').value)||0, deadline:document.getElementById('gDeadline').value||GymPro.todayISO(), status:'in-progress' };
  GymPro.add(GymPro.LS.goals,data);
  closeModal('goalModal'); renderMemberProgress(); renderMemberOverview(); showToast('Goal added 🏆 — '+data.title);
});
function updateGoal(id){
  const g=GymPro.get(GymPro.LS.goals).find(x=>x.id===id);
  if(!g) return;
  const next=g.current+1;
  const achieved = next>=g.target;
  GymPro.update(GymPro.LS.goals,id,{current:next, status: achieved?'achieved':'in-progress'});
  if(achieved) GymPro.notify(g.memberId,'🏆 Goal Achieved!','Congratulations! You achieved: '+g.title);
  renderMemberProgress(); renderMemberOverview(); showToast(achieved?'🏆 Goal Achieved!':'Progress +1 — '+next+'/'+g.target);
}
function generateProgressReport(){
  const memberId=getMemberId();
  const member=GymPro.get(GymPro.LS.members).find(m=>m.id===memberId);
  const prog=GymPro.get(GymPro.LS.progress).filter(p=>p.memberId===memberId);
  const goals=GymPro.get(GymPro.LS.goals).filter(g=>g.memberId===memberId);
  let html=`
    <div style="text-align:center;border-bottom:2px solid #ff4d00;padding-bottom:12px">
      <h2 style="color:#ff4d00;margin:0">GymPro Bhubaneswar</h2>
      <small>Patia, Near KIIT, Infocity Road, Bhubaneswar 751024 • +91 81446 85376 • anuxoo001@gmail.com</small>
      <h3 style="margin-top:10px">Fitness Progress Report</h3>
      <small>${GymPro.formatDate(new Date().toISOString())}</small>
    </div>
    <div style="margin:14px 0"><strong>Member:</strong> ${member?member.name:memberId} (${memberId})<br><strong>Plan:</strong> ${member?member.plan:''} • ${member?GymPro.formatINR(member.amount):''}<br><strong>Trainer:</strong> ${member?GymPro.get(GymPro.LS.trainers).find(t=>t.id===member.trainerId)?.name:'-'}</div>
    <h4>Progress Log</h4>
    <table style="width:100%;border-collapse:collapse;font-size:0.85rem"><tr style="background:#f5f5f5"><th style="border:1px solid #ddd;padding:6px">Date</th><th style="border:1px solid #ddd;padding:6px">Weight</th><th style="border:1px solid #ddd;padding:6px">Body Fat</th><th style="border:1px solid #ddd;padding:6px">Notes</th></tr>
    ${prog.map(p=>`<tr><td style="border:1px solid #ddd;padding:6px">${GymPro.formatDate(p.date)}</td><td style="border:1px solid #ddd;padding:6px">${p.weight}kg</td><td style="border:1px solid #ddd;padding:6px">${p.bodyFat||'-'}%</td><td style="border:1px solid #ddd;padding:6px">${p.notes||''}</td></tr>`).join('')}
    </table>
    <h4 style="margin-top:14px">Goals & Achievements</h4>
    ${goals.map(g=>{
      const pct=Math.min(100, Math.round((g.current/g.target)*100));
      return `<div style="margin-bottom:8px"><strong>${g.title}</strong> — ${g.current}/${g.target} (${pct}%) ${pct>=100?'🏆 Achieved':''}<br><small>Deadline: ${GymPro.formatDate(g.deadline)}</small></div>`;
    }).join('') || '<p>No goals</p>'}
    <p style="margin-top:16px;font-size:0.8rem;color:#555">Trainer Remark: Keep consistent! Visit Patia centre for next assessment. — GymPro Team</p>
    <p style="font-size:0.7rem;color:#888;text-align:center;margin-top:12px">Auto-generated by GymPro Management System • Patia, Bhubaneswar</p>
  `;
  const w=window.open('','_blank'); w.document.write('<html><head><title>Progress Report — '+memberId+'</title><style>body{font-family:Arial;padding:20px}</style></head><body>'+html+'<script>window.print()</script></body></html>'); w.document.close();
  showToast('📄 Progress Report generated — Print/PDF ready');
}
function renderMemberAppointments(){
  const memberId=getMemberId();
  const appts=GymPro.get(GymPro.LS.appointments).filter(a=>a.memberId===memberId);
  const tbody=document.getElementById('memberApptTable');
  if(!tbody) return;
  tbody.innerHTML=appts.length? appts.map(a=>`<tr><td>${GymPro.formatDate(a.date)}</td><td>${a.time}</td><td>${a.trainerName||a.trainerId}</td><td>${a.type}</td><td><span class="status ${a.status}">${a.status}</span></td></tr>`).join('') : '<tr><td colspan="5" style="text-align:center" class="muted">No appointments — book one</td></tr>';
}
function openAppointmentModal(){
  const trainers=GymPro.get(GymPro.LS.trainers);
  const sel=document.getElementById('apTrainer');
  if(sel) sel.innerHTML=trainers.map(t=>`<option value="${t.id}">${t.name} — ${t.specialty}</option>`).join('');
  document.getElementById('apDate').value=new Date(Date.now()+86400000).toISOString().slice(0,10);
  openModal('appointmentModal');
}
document.getElementById('appointmentForm')?.addEventListener('submit',(e)=>{
  e.preventDefault();
  const memberId=getMemberId();
  const member=GymPro.get(GymPro.LS.members).find(m=>m.id===memberId);
  const trainerId=document.getElementById('apTrainer').value;
  const trainer=GymPro.get(GymPro.LS.trainers).find(t=>t.id===trainerId);
  const data={ id:GymPro.genId('AP'), memberId, memberName: member?member.name:'Member', trainerId, trainerName: trainer?trainer.name:trainerId, date:document.getElementById('apDate').value, time:document.getElementById('apTime').value, type:document.getElementById('apType').value, status:'pending' };
  GymPro.add(GymPro.LS.appointments,data);
  GymPro.notify(trainerId,'New Appointment',' '+data.memberName+' booked '+data.type+' on '+data.date+' at '+data.time);
  GymPro.notify(memberId,'Appointment Requested','Your '+data.type+' on '+data.date+' with '+data.trainerName+' is pending confirmation');
  closeModal('appointmentModal'); renderMemberAppointments(); renderTrainerAppointments(); showToast('Appointment booked — pending confirmation');
});
function memberAI(){
  const memberId=getMemberId();
  const member=GymPro.get(GymPro.LS.members).find(m=>m.id===memberId);
  const goal=document.getElementById('aiGoal').value;
  const w=member?member.weight:75;
  let workout='', diet='';
  if(goal==='Weight Loss'){
    workout='<strong>AI Workout — Fat Burn 4 Weeks:</strong><br>• Day 1: HIIT (Burpees 4x15, Mountain Climbers 4x20, Jump Squats 3x12)<br>• Day 2: Cardio + Core (Treadmill 20min, Plank 3x60s, Bicycle Crunch 3x20)<br>• Day 3: Rest + Walk 8k steps<br><em>Based on weight '+w+'kg — 500kcal deficit recommended</em>';
    diet='<strong>AI Diet — 1600 kcal Odia Mix:</strong><br>8AM Oats + Papaya, 1PM Brown Rice + Dalma + Curd, 4PM Sprouts, 8PM Chapati 2 + Grilled Chicken + Veg. <br><em>High protein, low oil — Patia nutritionist approved</em>';
  } else if(goal==='Muscle Gain'){
    workout='<strong>AI Workout — Muscle Builder:</strong><br>• Push: Bench 4x10, Shoulder Press 3x12, Tricep 3x15<br>• Pull: Deadlift 3x8, Pullup 3x10, Rows 3x12<br>• Legs: Squat 4x10, Lunges 3x12, Calf 3x20<br><em>Progressive overload — protein 1.8g/kg</em>';
    diet='<strong>AI Diet — 2500 kcal High Protein:</strong><br>7AM Eggs 4 + Oats, 11AM Whey + Banana, 2PM Rice + Chicken 200g + Dal, 5PM Peanut Butter + Bread, 9PM Paneer + Chapati<br><em>For '+w+'kg — 180g protein</em>';
  } else {
    workout='<strong>AI Workout — Balanced 3 Days:</strong><br>Full body circuits, Yoga 2x/week, Cardio 150min/week';
    diet='<strong>AI Diet — 2000 kcal Maintenance:</strong><br>Balanced thali with millets, dal, veg, curd, seasonal fruits';
  }
  const res=document.getElementById('aiResult');
  if(res) res.innerHTML=`
    <div style="background:var(--dark3);border:1px solid var(--border);border-radius:10px;padding:12px;margin-top:8px">
      ${workout}<br><br>${diet}<br><br>
      <button class="btn btn-sm" onclick="applyAI()"><i class="fas fa-check"></i> Apply to My Plans</button>
      <span class="muted" style="font-size:0.7rem;margin-left:8px">🤖 AI generated — review with trainer at Patia</span>
    </div>
  `;
  // store for apply
  window._aiWorkout=workout; window._aiGoal=goal;
  showToast('🤖 AI recommendations generated for '+goal);
}
function applyAI(){
  const memberId=getMemberId();
  const goal=document.getElementById('aiGoal').value;
  // create workout and diet from AI
  const wTitle='AI '+goal+' Plan — '+GymPro.todayISO();
  GymPro.add(GymPro.LS.workouts,{id:GymPro.genId('W'), memberId, memberName: GymPro.get(GymPro.LS.members).find(m=>m.id===memberId)?.name||'Member', trainerId:'T004', title:wTitle, exercises:[{name:goal+' AI Circuit',sets:4,reps:15}], date:GymPro.todayISO(), status:'active'});
  GymPro.add(GymPro.LS.diets,{id:GymPro.genId('D'), memberId, memberName: GymPro.get(GymPro.LS.members).find(m=>m.id===memberId)?.name||'Member', trainerId:'T004', title:'AI '+goal+' Diet', calories: goal==='Weight Loss'?1600: goal==='Muscle Gain'?2500:2000, meals:[{time:'AI',food: goal+' personalized plan'}], date:GymPro.todayISO()});
  showToast('AI plans applied to your account ✅'); renderMemberOverview(); renderMemberWorkout(); renderMemberDiet();
}

// Global search
document.getElementById('globalSearch')?.addEventListener('input',(e)=>{
  const q=e.target.value.toLowerCase();
  if(!q) return;
  const members=GymPro.get(GymPro.LS.members).filter(m=> (m.name+m.id+m.phone).toLowerCase().includes(q));
  if(members.length) { switchPage('admin-members'); renderMembers(); }
});

// Init
document.addEventListener('DOMContentLoaded',()=>{
  if(!requireAuth()) return;
  renderSidebar(currentRole);
  renderNotifs();
  initCharts();
  // ham2
  const ham2=document.getElementById('ham2');
  const sidebar=document.getElementById('sidebar');
  if(ham2 && sidebar) ham2.addEventListener('click',()=> sidebar.classList.toggle('open'));
  document.getElementById('notifBtn')?.addEventListener('click',()=>{
    document.getElementById('notifPanel').classList.toggle('show');
  });
  document.addEventListener('click',(e)=>{
    const panel=document.getElementById('notifPanel');
    const btn=document.getElementById('notifBtn');
    if(panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) panel.classList.remove('show');
  });
  // close modal on outside click
  document.querySelectorAll('.modal').forEach(m=>{
    m.addEventListener('click',(e)=>{ if(e.target===m) m.classList.remove('show'); });
  });
  // search enter listener etc
  console.log('GymPro Dashboard loaded — Role:',currentRole,' User:',currentUser);
});

// Expose for inline handlers
window.switchPage=switchPage;
window.openMemberModal=openMemberModal;
window.editMember=editMember;
window.deleteMember=deleteMember;
window.viewMemberQR=viewMemberQR;
window.openTrainerModal=openTrainerModal;
window.editTrainer=editTrainer;
window.deleteTrainer=deleteTrainer;
window.openPaymentModal=openPaymentModal;
window.showInvoice=showInvoice;
window.printInvoice=printInvoice;
window.exportPayments=exportPayments;
window.generateQR=generateQR;
window.markAttendance=markAttendance;
window.openEquipmentModal=openEquipmentModal;
window.editEquipment=editEquipment;
window.deleteEquipment=deleteEquipment;
window.toggleEquipment=toggleEquipment;
window.printReport=printReport;
window.openWorkoutModal=openWorkoutModal;
window.deleteWorkout=deleteWorkout;
window.shareWorkout=shareWorkout;
window.aiWorkout=aiWorkout;
window.openDietModal=openDietModal;
window.deleteDiet=deleteDiet;
window.aiDiet=aiDiet;
window.confirmAppt=confirmAppt;
window.deleteAppt=deleteAppt;
window.viewMemberProgress=viewMemberProgress;
window.openWorkoutFor=openWorkoutFor;
window.memberCheckIn=memberCheckIn;
window.saveProfile=saveProfile;
window.openProgressModal=openProgressModal;
window.openGoalModal=openGoalModal;
window.updateGoal=updateGoal;
window.generateProgressReport=generateProgressReport;
window.openAppointmentModal=openAppointmentModal;
window.memberAI=memberAI;
window.applyAI=applyAI;
window.markAllRead=markAllRead;
window.clearNotifs=clearNotifs;
window.logout=logout;
window.closeModal=closeModal;
window.showToast=showToast;
