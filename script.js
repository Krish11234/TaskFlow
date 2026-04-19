//the ones not connected to each other are having space or two lines and others are connected to each other


//selecting different html elements to use them further
const todo= document.querySelector("#todo");
const progress= document.querySelector("#progress");
const done= document.querySelector("#done");
const taskCol= document.querySelector(".task-column")
let dragElement= null;
const addBtn= document.querySelector(".addBtn");
const modal= document.querySelector(".modal");
const modalBg= document.querySelector(".modal .bg");
const board= document.querySelector(".board");
let taskInp= document.querySelector("input");
let taskDesc= document.querySelector("textarea");


// pure logic for updating count on some activity
function updateCount(){
    [todo, progress, done].forEach(function(col){
        let tasks= col.querySelectorAll(".task");
        let count= col.querySelector(".right");
        count.textContent= tasks.length;
        // console.log(count);
    })
}


// initials for making the task draggable (unseparable with draggable logic)
const tasks= document.querySelectorAll(".task");
tasks.forEach(function(task){
    task.addEventListener("dragstart", function(e){
        dragElement= task;
    })
})
// pure logic for making the task draggable and also droppable
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
        
        updateCount();
    })
}

//invoking the function for all columns
dragEvent(todo);
dragEvent(progress);
dragEvent(done);


//logic for creating a new task
function newTask(){
    let div= document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");

    //creating h2
    let h2= document.createElement("h2");
    h2.setAttribute("class", "task-title");
    h2.textContent= taskInp.value;

    //creating p tag
    let p= document.createElement("p");
    p.setAttribute("class", "task-desc");
    p.textContent= taskDesc.value;

    //creating delete button
    let delBtn= document.createElement("button");
    delBtn.setAttribute("class", "delete-btn");
    delBtn.textContent= "Delete";

    //appending element into div
    div.append(h2);
    div.append(p);
    div.append(delBtn);

    //appending div to todo (main screen)
    todo.appendChild(div);

    //input removed when previous one is added
    taskInp.value= "";
    taskDesc.value= "";

    //making new task draggable
    div.addEventListener("dragstart", function(e){
        dragElement= div;
    })
}


// logic for showing add new task screen
addBtn.addEventListener("click", function(){
    modal.classList.toggle("active");

})
// logic for removing add new task screen
modalBg.addEventListener("click", function(e){
modal.classList.remove("active");
})



let taskBtn= document.querySelector("#add-new-task");
// logic for blocking empty tasks
function validateInput(){
    let isValid= true;
    if(taskInp.value.trim()== ""){
        isValid= false;
    }else{
        isValid= true;
    }

    return isValid;
}


// creating a new task by event listener of clicking add new task button
taskBtn.addEventListener("click", function(e){
    e.preventDefault();

    if(validateInput()){

        //invoking for creating new task
        newTask();

        //invoking for count updation on creation
        updateCount();

        //when inputs are filled
        taskBtn.disabled= false;
        taskInp.removeAttribute("id", "disabled-input-text");
    }
    else{
        //when inputs arent filled
        taskBtn.disabled= true;
        taskInp.setAttribute("id", "disabled-input-text");
    }    
})


// checking again if input filled or not
taskInp.addEventListener("input", function(e){
    if(taskInp.value.trim()!== ""){
        taskBtn .disabled= false;
        taskInp.removeAttribute("id", "disabled-input-text");
    }
})


// delete button event listener + logic
board.addEventListener("click",function(e){
    if(e.target.classList.contains("delete-btn")){
        // console.log(e.target);
        todo.removeChild(e.target.closest(".task"));
        updateCount();
    }
})