const API = "https://todo-app-production-6cf0.up.railway.app:8080/api/auth";
const message = document.getElementById("message");

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