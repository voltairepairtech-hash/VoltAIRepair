const ui={total:document.getElementById("totalRecords"),new24:document.getElementById("new24h"),
comp:document.getElementById("completion"),top:document.getElementById("topCodes"),log:document.getElementById("logBox")};

const demoStats={total:1263,new24:15,completion:"59%",
topCodes:[{code:"0x8000_002",count:5,models:["iPhone 12"],ios:["17.2"]},
{code:"0x6000_133",count:4,models:["13 Pro Max"],ios:["17.1"]},
{code:"0x5000_0A4",count:3,models:["SE 2nd"],ios:["16.5"]}]};

function render(){
  ui.total.textContent=demoStats.total;
  ui.new24.textContent="+"+demoStats.new24;
  ui.comp.textContent=demoStats.completion;
  ui.top.innerHTML=demoStats.topCodes.map(t=>`<div>• <b>${t.code}</b> – ${t.count} adet
    <span style="color:#94a3b8"> (Model: ${t.models.join("/")}, iOS: ${t.ios.join("/")})</span></div>`).join("");
  log("Panel yüklendi • demo verileri gösterildi");
}
function log(msg){const ts=new Date().toLocaleString();ui.log.textContent=`[${ts}] ${msg}\n`+ui.log.textContent;}
render();
