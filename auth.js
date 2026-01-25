const API = "https://todo-app-production-6cf0.up.railway.app/api/auth";
const message = document.getElementById("message");

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

document.getElementById("showLogin").addEventListener("click", () => {
    registerForm.style.display = "none";
    loginForm.style.display = "block";
});

document.getElementById("showRegister").addEventListener("click", () => {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
});

const regName = document.getElementById("regName");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");

document.getElementById("registerForm").addEventListener("submit", async (e)=>{
    e.preventDefault();

    const name = regName.value.trim();
    const email = regEmail.value.trim();
    const password = regPassword.value.trim();

    if(!name || !email || !password){
        return showMessage("All fields required. ❌");
    }

    try{
        const res = await fetch(`${API}/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name, email, password})
        });

        const data = await res.json();
        if(!res.ok){
            return showMessage(data.message);
        };

        localStorage.setItem("token", data.token);
        window.location.href="index.html";
    }catch{
        showMessage("Server error. ❌");
    };
});

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

document.getElementById("loginForm").addEventListener("submit", async (e)=>{
    e.preventDefault();

    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    if(!email || !password){
        return showMessage("All fields required. ❌");
    };

    try{
        const res = await fetch(`${API}/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password})
        });

        const data = await res.json();

        if(!res.ok){
            return showMessage(data.message);
        };

        localStorage.setItem("token", data.token);
        window.location.href = "index.html";
    }catch{
        showMessage("Server error. ❌");
    };
});

function showMessage(msg){
    message.textContent = msg;
    setTimeout(() => {
        message.textContent = ""
    }, 3000);
};