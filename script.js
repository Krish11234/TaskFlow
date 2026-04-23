//the ones not connected to each other are having space or two lines and others are connected to each other


//selecting different html elements to use them further
// selecting different html elements
const todo= document.querySelector("#todo");
const progress= document.querySelector("#progress");
const done= document.querySelector("#done");
let dragElement= null;
const addBtn= document.querySelector(".addBtn");
const modal= document.querySelector(".modal");
const modalBg= document.querySelector(".modal .bg");
const board= document.querySelector(".board");
let taskInp= document.querySelector("input");
let taskDesc= document.querySelector("textarea");
let taskBtn= document.querySelector("#add-new-task");

// GLOBAL STATE (localStorage)
let tasksData = JSON.parse(localStorage.getItem("tasks")) || [];


// update count
function updateCount(){
    [todo, progress, done].forEach(function(col){
        let tasks= col.querySelectorAll(".task");
        let count= col.querySelector(".right");
        count.textContent= tasks.length;
    })
}


// DRAG LOGIC
function dragEvent(column){
    column.addEventListener("dragenter", function(e){
        e.preventDefault();
        column.classList.add("hover-over");
    })
    column.addEventListener("dragleave", function(e){
        e.preventDefault();
        column.classList.remove("hover-over");
    })
    column.addEventListener("dragover", function(e){
        e.preventDefault();
    })
    column.addEventListener("drop", function(e){
        column.appendChild(dragElement);
        column.classList.remove("hover-over");

        //  update status in data
        let id = dragElement.dataset.id;

        tasksData = tasksData.map(task => {
            if(task.id == id){
                if(column.id === "todo") task.status = "todo";
                else if(column.id === "progress") task.status = "progress";
                else task.status = "done";
            }
            return task;
        });

        localStorage.setItem("tasks", JSON.stringify(tasksData));

        updateCount();
    })
}

dragEvent(todo);
dragEvent(progress);
dragEvent(done);


//  RENDER FUNCTION
function renderTask(taskObj){
    let div= document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");
    div.dataset.id = taskObj.id;

    let h2= document.createElement("h2");
    h2.className = "task-title";
    h2.textContent= taskObj.title;

    let p= document.createElement("p");
    p.className = "task-desc";
    p.textContent= taskObj.desc;

    let delBtn= document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.textContent= "Delete";

    div.append(h2, p, delBtn);

    // place based on status
    if(taskObj.status === "todo") todo.appendChild(div);
    else if(taskObj.status === "progress") progress.appendChild(div);
    else done.appendChild(div);

    // drag logic
    div.addEventListener("dragstart", function(){
        dragElement = div;
    });
}


//  CREATE NEW TASK
function newTask(){
    let id = Date.now();

    let taskObj = {
        id: id,
        title: taskInp.value,
        desc: taskDesc.value,
        status: "todo"
    };

    tasksData.push(taskObj);
    localStorage.setItem("tasks", JSON.stringify(tasksData));

    renderTask(taskObj);

    taskInp.value= "";
    taskDesc.value= "";
}


// LOAD TASKS ON START
function loadTasks(){
    tasksData.forEach(task => renderTask(task));
    updateCount();
}
loadTasks();


// modal open/close
addBtn.addEventListener("click", function(){
    modal.classList.toggle("active");
})

modalBg.addEventListener("click", function(){
    modal.classList.remove("active");
})


// validation
function validateInput(){
    return taskInp.value.trim() !== "";
}


// add task button
taskBtn.addEventListener("click", function(e){
    e.preventDefault();

    if(validateInput()){
        newTask();
        updateCount();

        taskBtn.disabled= false;
        taskInp.removeAttribute("id", "disabled-input-text");
    }
    else{
        taskBtn.disabled= true;
        taskInp.setAttribute("id", "disabled-input-text");
    }    
})


// input check
taskInp.addEventListener("input", function(){
    if(taskInp.value.trim()!== ""){
        taskBtn.disabled= false;
        taskInp.removeAttribute("id", "disabled-input-text");
    }
})


// delete logic
board.addEventListener("click",function(e){
    if(e.target.classList.contains("delete-btn")){
        let taskDiv = e.target.closest(".task");
        let id = taskDiv.dataset.id;

        taskDiv.remove();

        tasksData = tasksData.filter(task => task.id != id);
        localStorage.setItem("tasks", JSON.stringify(tasksData));

        updateCount();
    }
})