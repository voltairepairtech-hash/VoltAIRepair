const ADMIN_EMAIL = "hknngnr36@gmail.com";
const PASSWORD_HASH = "b0b2f1c1b6f35e7a"; // DEMO: "voltai"

function fakeHash(s){let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h.toString(16);}

const form=document.getElementById("loginForm");
const statusEl=document.getElementById("status").querySelector("span");
const dash=document.getElementById("dash");
const loginBox=document.getElementById("loginBox");

form.addEventListener("submit",(e)=>{
  e.preventDefault();
  const email=document.getElementById("email").value.trim().toLowerCase();
  const pass=document.getElementById("password").value;
  if(email===ADMIN_EMAIL && fakeHash(pass)===PASSWORD_HASH){
    localStorage.setItem("voltai_admin","1");
    statusEl.textContent="Bağlandı"; statusEl.style.color="#10b981";
    loginBox.hidden=true; dash.hidden=false;
  }else{
    statusEl.textContent="Yetkisiz"; statusEl.style.color="#ef4444";
    alert("Giriş başarısız. E-posta ya da parola hatalı.");
  }
});

if(localStorage.getItem("voltai_admin")==="1"){
  statusEl.textContent="Bağlandı"; statusEl.style.color="#10b981";
  loginBox.hidden=true; dash.hidden=false;
}
