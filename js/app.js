// GymPro — Data Layer & Helpers
const GymPro = (()=>{

const LS = {
  members: 'gympro_members',
  trainers: 'gympro_trainers',
  payments: 'gympro_payments',
  attendance: 'gympro_attendance',
  workouts: 'gympro_workouts',
  diets: 'gympro_diets',
  appointments: 'gympro_appointments',
  progress: 'gympro_progress',
  goals: 'gympro_goals',
  equipment: 'gympro_equipment',
  notifications: 'gympro_notifications',
  currentUser: 'gympro_currentUser'
};

function genId(prefix){ return prefix + Math.random().toString(36).slice(2,7).toUpperCase() + Date.now().toString().slice(-3) }

function get(key){ try{ return JSON.parse(localStorage.getItem(key)||'[]')}catch(e){ return [] } }
function set(key,val){ localStorage.setItem(key, JSON.stringify(val)) }
function add(key, item){ const a=get(key); a.unshift(item); set(key,a); return item; }
function update(key,id, patch){ const a=get(key); const i=a.findIndex(x=>x.id===id); if(i>-1){ a[i]={...a[i],...patch}; set(key,a); } return a[i]; }
function remove(key,id){ const a=get(key).filter(x=>x.id!==id); set(key,a); }

function formatINR(n){ return '₹'+ Number(n).toLocaleString('en-IN') }
function formatDate(d){ const dt=new Date(d); return dt.toLocaleDateString('en-IN'); }
function formatDT(d){ const dt=new Date(d); return dt.toLocaleString('en-IN'); }
function todayISO(){ return new Date().toISOString().slice(0,10) }
function nowTime(){ return new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) }

function notify(userId,title,msg){
  add(LS.notifications,{ id:genId('N'), userId, title, msg, time:new Date().toISOString(), read:false });
}

function seed(){
  if(localStorage.getItem('gympro_seeded')) return;
  // Members
  const members=[
    {id:'M001',name:'Subham Sahoo',phone:'8144685376',email:'subham@kiit.ac.in',plan:'Elite',amount:3499,status:'active',joined:'2024-02-10',trainerId:'T001',weight:78,goal:'Weight Loss'},
    {id:'M002',name:'Ananya Mishra',phone:'9876543210',email:'ananya@infocity.com',plan:'Pro',amount:1999,status:'active',joined:'2024-04-15',trainerId:'T002',weight:62,goal:'Yoga & Flexibility'},
    {id:'M003',name:'Rakesh Behera',phone:'9123456780',email:'rakesh@patia.com',plan:'Pro',amount:1999,status:'active',joined:'2024-06-01',trainerId:'T001',weight:85,goal:'Muscle Gain'},
    {id:'M004',name:'Sasmita Patnaik',phone:'9988776655',email:'sasmita@gmail.com',plan:'Starter',amount:999,status:'pending',joined:'2024-08-20',trainerId:'T004',weight:70,goal:'General Fitness'},
    {id:'M005',name:'Karan Das',phone:'9012345678',email:'karan@gympro.com',plan:'Elite',amount:3499,status:'active',joined:'2023-11-05',trainerId:'T003',weight:90,goal:'Strength Training'},
  ];
  set(LS.members, members);
  // Trainers
  const trainers=[
    {id:'T001',name:'Ranjan Mohanty',phone:'9876543201',email:'ranjan@gympro.com',specialty:'Strength & Bodybuilding',exp:'12+ Yrs',members:3,status:'active',cert:'NSCA-CPT, Mr. Odisha'},
    {id:'T002',name:'Priya Sharma',phone:'9876543202',email:'priya@gympro.com',specialty:'Yoga & Wellness',exp:'8+ Yrs',members:2,status:'active',cert:'RYT-500'},
    {id:'T003',name:'Amit Patel',phone:'9876543203',email:'amit@gympro.com',specialty:'HIIT & CrossFit',exp:'10+ Yrs',members:2,status:'active',cert:'CrossFit L2'},
    {id:'T004',name:'Dr. Sneha Das',phone:'9876543204',email:'sneha@gympro.com',specialty:'Nutrition & Diet',exp:'9+ Yrs',members:4,status:'active',cert:'M.Sc Dietetics'},
  ];
  set(LS.trainers, trainers);
  // Payments
  const pays=[
    {id:'PAY001',memberId:'M001',memberName:'Subham Sahoo',plan:'Elite',amount:3499,method:'UPI',date:'2025-08-01',status:'paid',invoice:'INV-2025-001'},
    {id:'PAY002',memberId:'M002',memberName:'Ananya Mishra',plan:'Pro',amount:1999,method:'Cash',date:'2025-08-02',status:'paid',invoice:'INV-2025-002'},
    {id:'PAY003',memberId:'M003',memberName:'Rakesh Behera',plan:'Pro',amount:1999,method:'Card',date:'2025-08-05',status:'pending',invoice:'INV-2025-003'},
    {id:'PAY004',memberId:'M004',memberName:'Sasmita Patnaik',plan:'Starter',amount:999,method:'UPI',date:'2025-07-20',status:'overdue',invoice:'INV-2025-004'},
  ];
  set(LS.payments, pays);
  // Attendance
  const att=[];
  for(let i=0;i<12;i++){
    const d=new Date(); d.setDate(d.getDate()-i);
    att.push({id:genId('A'),memberId:'M001',memberName:'Subham Sahoo',date:d.toISOString().slice(0,10),time:'07:30 AM',status:'present'});
    if(i%2===0) att.push({id:genId('A'),memberId:'M002',memberName:'Ananya Mishra',date:d.toISOString().slice(0,10),time:'06:00 AM',status:'present'});
  }
  set(LS.attendance, att);
  // Workouts
  set(LS.workouts,[
    {id:'W001',memberId:'M001',memberName:'Subham Sahoo',trainerId:'T001',title:'Fat Burn HIIT',exercises:[{name:'Burpees',sets:4,reps:15},{name:'Mountain Climbers',sets:4,reps:20},{name:'Jump Squats',sets:3,reps:12}],date:'2025-08-25',status:'active'},
    {id:'W002',memberId:'M003',memberName:'Rakesh Behera',trainerId:'T001',title:'Chest & Triceps',exercises:[{name:'Bench Press',sets:4,reps:10},{name:'Incline DB',sets:3,reps:12},{name:'Tricep Pushdown',sets:3,reps:15}],date:'2025-08-24',status:'active'},
  ]);
  // Diets
  set(LS.diets,[
    {id:'D001',memberId:'M001',trainerId:'T004',title:'Weight Loss 1800kcal',calories:1800,meals:[{time:'8AM',food:'Oats + Papaya + Green Tea'},{time:'1PM',food:'Brown Rice + Dalma + Curd'},{time:'4PM',food:'Sprouts + Coconut Water'},{time:'8PM',food:'Chapati 2 + Chicken Curry + Salad'}],date:'2025-08-20'},
    {id:'D002',memberId:'M002',trainerId:'T004',title:'Yoga Wellness 1600kcal',calories:1600,meals:[{time:'7AM',food:'Warm Water + Almonds'},{time:'12PM',food:'Pakhala + Saga + Chhena'},{time:'7PM',food:'Vegetable Soup + Chapati'}],date:'2025-08-22'},
  ]);
  // Appointments
  set(LS.appointments,[
    {id:'AP001',memberId:'M001',memberName:'Subham Sahoo',trainerId:'T001',trainerName:'Ranjan Mohanty',date:'2025-09-05',time:'07:00 AM',type:'PT Session',status:'confirmed'},
    {id:'AP002',memberId:'M002',memberName:'Ananya Mishra',trainerId:'T002',trainerName:'Priya Sharma',date:'2025-09-06',time:'06:00 AM',type:'Yoga',status:'pending'},
  ]);
  // Progress
  set(LS.progress,[
    {id:'PR001',memberId:'M001',date:'2025-07-01',weight:82,bodyFat:22,notes:'Started'},
    {id:'PR002',memberId:'M001',date:'2025-08-01',weight:78,bodyFat:19,notes:'4kg down!'},
    {id:'PR003',memberId:'M001',date:'2025-09-01',weight:75,bodyFat:17,notes:'On track'},
  ]);
  // Goals
  set(LS.goals,[
    {id:'G001',memberId:'M001',title:'Lose 10kg in 90 days',target:10,current:7,deadline:'2025-10-01',status:'in-progress'},
    {id:'G002',memberId:'M001',title:'Achieve 15% Body Fat',target:15,current:17,deadline:'2025-12-01',status:'in-progress'},
  ]);
  // Equipment
  set(LS.equipment,[
    {id:'EQ001',name:'Treadmill Life Fitness',category:'Cardio',qty:10,condition:'working',last:'2025-08-10'},
    {id:'EQ002',name:'Hammer Strength Bench',category:'Strength',qty:6,condition:'working',last:'2025-08-12'},
    {id:'EQ003',name:'CrossFit Rig',category:'Functional',qty:1,condition:'maintenance',last:'2025-08-01'},
    {id:'EQ004',name:'Spin Bikes',category:'Cardio',qty:20,condition:'working',last:'2025-07-20'},
  ]);
  // Notifications
  set(LS.notifications,[
    {id:'N001',userId:'admin001',title:'New Member Joined',msg:'Sasmita Patnaik joined Starter plan',time:new Date().toISOString(),read:false},
    {id:'N002',userId:'admin001',title:'Payment Overdue',msg:'M004 — ₹999 overdue since 20 July',time:new Date().toISOString(),read:false},
    {id:'N003',userId:'M001',title:'Workout Updated',msg:'Ranjan assigned Fat Burn HIIT plan',time:new Date().toISOString(),read:false},
  ]);
  localStorage.setItem('gympro_seeded','1');
}

function init(){ seed(); }

return { LS, get, set, add, update, remove, genId, formatINR, formatDate, formatDT, todayISO, nowTime, notify, init };

})();