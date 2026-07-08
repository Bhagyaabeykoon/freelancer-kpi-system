let tasks=JSON.parse(localStorage.getItem('tasks'))||[];

function importExcel(){
const file=document.getElementById('excelFile').files[0];
if(!file){alert('Select Excel file');return;}
const reader=new FileReader();
reader.onload=e=>{
const data=new Uint8Array(e.target.result);
const wb=XLSX.read(data,{type:'array'});
const sheet=wb.Sheets[wb.SheetNames[0]];
const rows=XLSX.utils.sheet_to_json(sheet,{defval:''});

rows.forEach(r=>{
tasks.push({
id:Date.now()+Math.random(),
projectId:r['Project ID']||r['Project_ID']||'',
projectName:r['Project Name']||r['Project_Name']||'',
freelancer:r['Freelancer Name']||r['Freelancer']||'',
task:r['Task']||'',
expectedDate:r['Expected Date']||'',
actualDate:r['Actual Date']||'',
status:(r['Actual Date'])?'Completed':'Pending'
});
});
save();
alert('Excel Imported Successfully');
};
reader.readAsArrayBuffer(file);
}

function save(){
localStorage.setItem('tasks',JSON.stringify(tasks));
render();
}

function changeStatus(id){
let t=tasks.find(x=>x.id==id);
t.status=document.getElementById('status_'+id).value;
if(t.status==='Completed' && !t.actualDate){
t.actualDate=new Date().toISOString().split('T')[0];
}
save();
}

function removeTask(id){
tasks=tasks.filter(t=>t.id!=id);
save();
}

let chart;
function render(){
const body=document.getElementById('tbody');
body.innerHTML='';
tasks.forEach(t=>{
body.innerHTML+=`<tr>
<td>${t.projectId}</td>
<td>${t.projectName}</td>
<td>${t.freelancer}</td>
<td>${t.task}</td>
<td>${t.expectedDate}</td>
<td>${t.actualDate||'-'}</td>
<td>
<select id='status_${t.id}' onchange='changeStatus(${t.id})'>
${['Pending','Completed','Repeat','Rejected','Cancelled'].map(s=>`<option ${t.status===s?'selected':''}>${s}</option>`).join('')}
</select>
</td>
<td><button onclick='removeTask(${t.id})'>Delete</button></td>
</tr>`;
});

document.getElementById('total').innerText=tasks.length;
const comp=tasks.filter(t=>t.status==='Completed').length;
document.getElementById('completed').innerText=comp;
document.getElementById('pending').innerText=tasks.filter(t=>t.status==='Pending').length;
document.getElementById('achievement').innerText=tasks.length?Math.round(comp/tasks.length*100)+'%':'0%';

const counts={Completed:0,Pending:0,Repeat:0,Rejected:0,Cancelled:0};
tasks.forEach(t=>counts[t.status]=(counts[t.status]||0)+1);

if(chart)chart.destroy();
chart=new Chart(document.getElementById('chart'),{
type:'bar',
data:{labels:Object.keys(counts),datasets:[{label:'Tasks',data:Object.values(counts)}]}
});
}

function exportCSV(){
let csv='Project ID,Project Name,Freelancer,Task,Expected Date,Completed Date,Status\n';
tasks.forEach(t=>csv+=`${t.projectId},${t.projectName},${t.freelancer},${t.task},${t.expectedDate},${t.actualDate},${t.status}\n`);
const a=document.createElement('a');
a.href=URL.createObjectURL(new Blob([csv]));
a.download='kpi-report.csv';a.click();
}
render();
