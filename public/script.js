const Public_URL = "https://todo-app-production-6cf0.up.railway.app";
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const userBtn = document.getElementById("userBtn");
const changeLangBtn = document.getElementById("changeLangBtn");

token = localStorage.getItem("token");
// localStorage.getItem("lang");
// checkLang();

const allBtn = document.getElementById("allBtn");
const activeBtn = document.getElementById("activeBtn");
const completedBtn = document.getElementById("completedBtn");

// تبديل الوضع الليلي
const themeToggle = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️ Light";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "☀️ Light";
  } else {
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "🌙 Dark";
  }
});

let tasks = [];
let filter = "all";

// 🔹 جلب المهام من API
async function fetchTasks() {
  try {
    showLoader(true);
    const res = await authFetch(`${Public_URL}/api/todos`);
    showLoader(false);
    tasks = await res.json();
    if (!res.ok) {
      showMessage(tasks.message || "Something went wrong.");
      return;
    }

    renderTasks();
  } catch (err) {
    console.error("Error fetching tasks:", err);
  }
}

function showLoader(show) {
  document.getElementById("loader").style.display = show ? "block" : "none";
}
// استدعاء عند تحميل الصفحة
fetchTasks();

// إضافة مهمة جديدة عبر API
addBtn.addEventListener("click", async () => {
  const text = taskInput.value.trim();
  if (!text) {
    showMessage("Task connot be empty. ❌");
    return;
  }

  try {
    showLoader(true);
    const res = await authFetch(`${Public_URL}/api/todos`, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
    showLoader(false);
    const newTask = await res.json();
    if (!res.ok) {
      showMessage(newTask.message || "Something went wrong.");
      return;
    }
    tasks.push(newTask);
    showMessage("Task added successfully! ✅", true);
    taskInput.value = "";
    renderTasks();
  } catch (err) {
    console.error("Error adding task:", err);
  }
});

// الفلترة
allBtn.onclick = () => {
  filter = "all";
  renderTasks();
};
activeBtn.onclick = () => {
  filter = "active";
  renderTasks();
};
completedBtn.onclick = () => {
  filter = "completed";
  renderTasks();
};

// عرض المهام
function renderTasks() {
  taskList.innerHTML = "";
  let filteredTasks = tasks;
  if (filter === "active") filteredTasks = tasks.filter((t) => !t.completed);
  if (filter === "completed") filteredTasks = tasks.filter((t) => t.completed);

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    const p = document.createElement("p");
    p.innerText = task.text;
    li.appendChild(p);
    if (task.completed) li.classList.add("completed");

    // ✅ تعليم كمكتمل
    li.onclick = async () => {
      try {
        showLoader(true);
        const res = await authFetch(`${Public_URL}/api/todos/${task._id}`, {
          method: "PUT",
          body: JSON.stringify({
            text: task.text,
            completed: !task.completed,
          }),
        });
        showLoader(false);
        const updatedTask = await res.json();
        if (!res.ok) {
          showMessage(updatedTask.message || "Something went wrong.");
          return;
        }
        tasks = tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t));
        showMessage("Task updated successfully! ✅", true);
        renderTasks();
      } catch (err) {
        console.error(err);
      }
    };

    // ❌ حذف
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "❌";
    deleteBtn.onclick = async (e) => {
      e.stopPropagation();
      li.style.animation = "fadeOut 0.3s ease";
      try {
        showLoader(true);
        setTimeout(async () => {
          await authFetch(`${Public_URL}/api/todos/${task._id}`, {
            method: "DELETE",
          })
            .finally(() => showLoader(false))
            .then((res) => {
              if (!res.ok) {
                throw new Error("Deleted failed.");
              }
            })
            .then(() => {
              tasks = tasks.filter((t) => t._id !== task._id);
              showMessage("Task deleted successfully! ✅", true);
              renderTasks();
            })
            .catch((err) => {
              showMessage(err.message || "Failed to delete todo. ❌");
            });
        }, 300);
      } catch (err) {
        console.error(err);
      }
    };

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

function showMessage(msg, success = false) {
  const el = document.getElementById("message");
  el.textContent = msg;
  el.style.color = success ? "green" : "red";
  setTimeout(() => {
    el.textContent = "";
  }, 3000);
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "auth.html";
  userBtn.textContent = "Guest";
}

async function checkAuth() {
  token = localStorage.getItem("token");
  if (!token) {
    return (window.location.href = "auth.html");
  }

  const res = await authFetch(`${Public_URL}/api/auth/me`);

  if (!res.ok) {
    localStorage.removeItem("token");
    window.location.href = "auth.html";
  } else {
    const storedName = localStorage.getItem("username");
    userBtn.textContent = `Hi ${storedName || "Guest"}, Welcome Back!`;
  }
}

// function checkLang() {
//   if (localStorage.getItem("lang") === "ar") {
//     changeLangBtn.textContent = "English";
//     document.body.style.direction = "rtl";
//     themeToggle.textContent = "لايت ☀️";
//     logoutBtn.textContent = "تسجيل الخروج ⬅️";
//     userBtn.textContent = "مرحبا " + localStorage.getItem("username") + " نورت";
//     addBtn.textContent = "أضافة";
//     taskInput.placeholder = "اكتب مهمة...";
//     allBtn.textContent = "الكل";
//     activeBtn.textContent = "النشطة";
//     completedBtn.textContent = "المكتملة";
//     message.textContent = "";
//     auther.textContent = "أنشئ بواسطة باسم جمال";
//   } else {
//     changeLangBtn.textContent = "العربية";
//     document.body.style.direction = "ltr";
//     themeToggle.textContent = "Light 🌙";
//     logoutBtn.textContent = "Logout ⬅️";
//     userBtn.textContent =
//       "Hi " + localStorage.getItem("username") + " Welcome Back!";
//     addBtn.textContent = "Add";
//     taskInput.placeholder = "Write a task...";
//     allBtn.textContent = "All";
//     activeBtn.textContent = "Active";
//     completedBtn.textContent = "Completed";
//     message.textContent = "";
//     auther.textContent = "Created by Bassem Gamal";
//   }
// }

// function changeLang() {
//   if (localStorage.getItem("lang") === "en") {
//     localStorage.setItem("lang", "ar");
//     checkLang();
//     window.location.reload();
//   } else {
//     localStorage.setItem("lang", "en");
//     checkLang();
//     window.location.reload();
//   }
// }

async function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    alert("Session expired. Please log in again.");
    window.location.href = "auth.html";
    throw new Error("Unauthorized");
  }
  return res;
}

checkAuth();
