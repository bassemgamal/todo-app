const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

token = localStorage.getItem("token");

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
    const res = await fetch(
      "https://todo-app-production-6cf0.up.railway.app/api/todos",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
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
    const res = await fetch(
      "https://todo-app-production-6cf0.up.railway.app/api/todos",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text }),
      },
    );

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
  console.log(localStorage.getItem("token"));

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
        
        const res = await fetch(
          `https://todo-app-production-6cf0.up.railway.app/api/todos/${task._id}`,
          {
            method: "PUT",
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              text: task.text,
              completed: !task.completed,
            }),
          },
        );
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
        setTimeout(async () => {
          await fetch(
            `https://todo-app-production-6cf0.up.railway.app/api/todos/${task._id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
              },
            },
          );

          tasks = tasks.filter((t) => t._id !== task._id);
          showMessage("Task deleted successfully! ✅", true);
          renderTasks();
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
  window.location.href = "auth.html";
}

async function checkAuth() {
  token = localStorage.getItem("token");
  if (!token) {
    return (window.location.href = "auth.html");
  }

  const res = await fetch("https://todo-app-production-6cf0.up.railway.app/api/auth/me", {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json"
    },
  });

  if (!res.ok) {
    localStorage.removeItem("token");
    window.location.href = "auth.html";
  }
}

checkAuth();
