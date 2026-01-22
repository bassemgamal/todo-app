let tasklist = document.getElementById("taskList");
let taskInput = document.getElementById("taskInput");
let addBtn = document.getElementById("addBtn");
let allBtn = document.getElementById("allBtn");
let completedBtn = document.getElementById("completedBtn");
let activeBtn = document.getElementById("activeBtn");

let tasks = JSON.parse(localStorage.getItem("tasks"))||[{text:"wash my teeth",isCompleted:false}];
let filter = "all";

allBtn.addEventListener("click",()=>{
filter = "all";
  RerenderList();
});
completedBtn.addEventListener("click",()=>{
filter = "completed";
  RerenderList();
});
activeBtn.addEventListener("click",()=>{
filter = "active";
  RerenderList();
});

addBtn.addEventListener("click",()=>{
  let taskText = taskInput.value;
  if(taskText == ""){
    alert("Write a task first.");
    return;
  };
  tasks.push({text: taskText, isCompleted:false});
  taskInput.value = "";
  saveTasks();
  RerenderList();
});
function RerenderList(){
  tasklist.innerHTML = "";
  let filtered_tasks = tasks;
  if(filter === "active"){
   filtered_tasks = tasks.filter(t => !t.isCompleted); 
  };
  if(filter === "completed"){
   filtered_tasks = tasks.filter(t => t.isCompleted); 
  };
  for(let i = 0; i < filtered_tasks.length; i++){
    let li = document.createElement("li");
    let p = document.createElement("p");
    p.innerText = filtered_tasks[i].text;
    if(filtered_tasks[i].isCompleted){
      li.setAttribute("class", "completed");
    };
    p.addEventListener("click",()=>{
      filtered_tasks[i].isCompleted = !filtered_tasks[i].isCompleted;
      saveTasks();
      RerenderList();
    });
    let removeBtn = document.createElement("button");
    removeBtn.textContent = "Delete";
    removeBtn.setAttribute("class", "deleteBtn");
    removeBtn.addEventListener("click",(e)=>{
      e.stopPropagation();
      tasks.splice(i, 1);
      saveTasks();
      RerenderList();
    });
    li.appendChild(p);
    li.appendChild(removeBtn);
    tasklist.appendChild(li);
  };
};

function saveTasks(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
};