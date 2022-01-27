window.addEventListener('load', function() {
    console.log('All assets are loaded');

    let btnTop = document.getElementById("btnTop");
    
    btnTop.addEventListener('click', () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    });


    let list = [];
    let listComplete = [];
    
    
    function notificationAnimation () {
        document.getElementById("notification").classList.add("animation-in");
        setTimeout(function(){
            document.getElementById("notification").classList.remove("animation-in");
            document.getElementById("notification").classList.add("animation-out");
        }, 2000);
        document.getElementById("notification").classList.remove("animation-out");
    }
    
    const completeTask = () => {
        for(let i = 0; i < list.length; i++){

            document.getElementById(`item-complete-${i}`).addEventListener('click', () => {
                if(list[i].status == "incomplete"){

                    list[i].status = "complete";
                    listComplete.push(list[i].id);

                    localStorage.setItem("listComplete", JSON.stringify(listComplete));
                    localStorage.setItem("list", JSON.stringify(list));
                    
                    document.getElementById(`task-item-${i}`).style.padding = "0.7rem 0.5rem";
                    document.getElementById(`item-complete-${i}`).style.backgroundColor = "rgb(31, 31, 36)";
                    document.getElementById(`item-complete-${i}`).style.color = "rgb(255, 255, 255)";
                    document.getElementById(`task-complete-${i}`).style.display = "block";
                    
                }else{
                    list[i].status = "incomplete";
                    localStorage.setItem("list", JSON.stringify(list));

                    listComplete.forEach(item => {
                        let findItem = list.find(list => list.id == item);
                        let indexListComplete = listComplete.indexOf(item);
                        
                        if(findItem.id == list[i].id){
                            listComplete.splice(indexListComplete, 1);
                            localStorage.setItem("listComplete", JSON.stringify(listComplete));
                        }
                    });

                    document.getElementById(`task-item-${i}`).style.padding = " 1.5rem 0.5rem";
                    document.getElementById(`item-complete-${i}`).style.backgroundColor = "rgb(137, 206, 183)";
                    document.getElementById(`item-complete-${i}`).style.color = "rgb(255, 255, 255)";
                    document.getElementById(`task-complete-${i}`).style.display = "none";
                    
                }
                if(listComplete.length == list.length){
                    let completeText = `
                    <p class="notification-text notification-complete-item">No tienes tareas pendientes <i class="far fa-thumbs-up"></i> </p>`;
                    $("#notification").html(completeText);
                    notificationAnimation();
                };
                
                showTasks();
            });
        };
    };


    const deleteItem = () => {
        
        for(let i = 0; i < list.length; i++){
            
            document.getElementById(`item-delete-${i}`).addEventListener('click', () => {
                swal("¿Estas seguro que deseas eliminar la tarea?", {
                    buttons: {
                      cancel: "Cancelar",
                      catch: {
                        text: "Continuar",
                        value: "catch",
                      }
                    },
                })
                .then((value) => {
                    switch (value) {
                        case "catch":
                            let itemDeleted = [];
                            itemDeleted.push(list[i]);
                            for (let j = 0; j < listComplete.length; j++){
                                if(itemDeleted[0].id == listComplete[j]){
                                    listComplete.splice(j, 1);
                                    localStorage.setItem("listComplete", JSON.stringify(listComplete));
                                }
                            };

                            list.splice(i, 1);
                            localStorage.setItem("list", JSON.stringify(list));
                            showTasks();
                            
                            let deleteItemText = `
                            <p class="notification-text notification-delete-item"><i class="far fa-calendar-check"></i> Tarea eliminada </p>`;
                            $("#notification").html(deleteItemText);
                            notificationAnimation();
                            break;
                    
                        case "cancel":
                        showTasks();
                    };
                });
            });
        };
    };
    
    const priorityTask = () => {
        
        for(let i = 0; i < list.length; i++){
            
            document.getElementById(`item-priority-${i}`).addEventListener('click', () => {
                if(list[i].priority == 0){
                    
                    list[i].priority = 1;
                    localStorage.setItem("list", JSON.stringify(list));
                    
                    let priorityItem = list.splice(i, 1);
                    list.unshift(priorityItem[0]);

                    localStorage.setItem("list", JSON.stringify(list));

                    let priorityText = `
                    <p class="notification-text notification-priority-item"><i class="fas fa-star"></i> Tarea de alta prioridad </p>`;
                    $("#notification").html(priorityText);
                    notificationAnimation();
                }else{
                    list[i].priority = 0;

                    let incompleteItem = list.splice(i, 1);
                    
                    list.push(incompleteItem[0]);
                    
                    localStorage.setItem("list", JSON.stringify(list));
                }
                
                showTasks();
            });
        };
    };


    const showTasks = () => {
        if(list.length > 0){
            document.getElementById("no-tasks").style.display = "none";
            let acu = ``;
            let acuComplete = ``;
            for(let i = 0; i < list.length; i++){
                let star;
                
                if(list[i].priority == 0){
                    star = `<i class="far fa-star"></i>`;
                } 
                else{
                    star = `<i class="fas fa-star"></i>`;
                }
                if(list[i].status == "complete"){
                    acuComplete += `
                    <div class="task-item task-item-complete-active animate__animated animate__flipInX animate__faster" id="task-item-${i}">
                        <p class="btn task-item-complete-icon" id="item-complete-${i}"><i class="fas fa-check"></i></p>
                        <div class="task-item-text">
                            <p id="task-item-text-complete-${i}" class="task-item-text-complete">${list[i].task}</p>
                            <p class="task-item-text-date" id="task-item-text-date-${i}">${list[i].date}</p>
                            <p class="task-complete" id="task-complete-${i}">Tarea Completa!</p>
                        </div>
                        <p class="btn task-item-priority-icon m-0" id="item-priority-${i}">${star}</p>
                        <p class="btn task-item-delete-icon" id="item-delete-${i}"><i class="fas fa-times-circle"></i></p>
                    </div>
                    `;
                }else{
                    acu += `
                    <div class="task-item animate__animated animate__flipInX animate__faster" id="task-item-${i}">
                        <p class="btn task-item-complete-icon" id="item-complete-${i}"><i class="fas fa-check"></i></p>
                        <div class="task-item-text">
                            <p>${list[i].task}</p>
                            <p class="task-item-text-date" id="task-item-text-date-${i}">${list[i].date}</p>
                            <p class="task-complete" id="task-complete-${i}">Tarea Completa!</p>
                        </div>
                        <p class="btn task-item-priority-icon m-0" id="item-priority-${i}">${star}</p>
                        <p class="btn task-item-delete-icon" id="item-delete-${i}"><i class="fas fa-times-circle"></i></p>
                    </div>
                    `;
                }
               
            }
            document.getElementById("delete-all").classList.add("show");
            document.getElementById("tasks").classList.remove("hide");
            
            document.getElementById("task-complete-list").innerHTML = acuComplete;
            
            document.getElementById("tasks").innerHTML = acu;
            
            for(let i = 0; i < list.length; i++){
                if(list[i].priority == 0){
                    document.getElementById(`task-item-${i}`).style.backgroundColor = "rgba(240, 240, 255, 0.1)";
                    document.getElementById(`task-item-text-date-${i}`).style.color = "rgb(124, 133, 141)";
                }else{
                    document.getElementById(`task-item-${i}`).style.backgroundColor = "rgba(240, 240, 255, 0.3)";
                    document.getElementById(`task-item-text-date-${i}`).style.color = "rgb(31, 31, 36)";
                }

                if(list[i].status == "complete"){
                    document.getElementById(`task-item-${i}`).style.padding = "0.7rem 0.5rem";
                    document.getElementById(`item-complete-${i}`).style.backgroundColor = "rgb(31, 31, 36)";
                    document.getElementById(`item-complete-${i}`).style.color = "rgb(255, 255, 255)";
                    document.getElementById(`task-complete-${i}`).style.display = "block";
                }else{
                    document.getElementById(`task-item-${i}`).style.padding = " 1.5rem 0.5rem";
                    document.getElementById(`item-complete-${i}`).style.backgroundColor = "rgb(137, 206, 183)";
                    document.getElementById(`item-complete-${i}`).style.color = "rgb(255, 255, 255)";
                    document.getElementById(`task-complete-${i}`).style.display = "none";
                }
                if(listComplete.length == 0){
                    document.getElementById("complete-title").innerHTML = ``;
                }else{
                    document.getElementById("complete-title").innerHTML = `<h5>Tareas Completas</h5>`;
                }
            };
            completeTask();

            deleteItem();

            priorityTask();
            
        }else{
            document.getElementById("delete-all").classList.remove("show");
            document.getElementById("tasks").classList.add("hide");
            document.getElementById("no-tasks").style.display = "block";
            document.getElementById("complete-title").innerHTML = ``;
            document.getElementById("task-complete-list").innerHTML = ``;
        };
    };
    showTasks();

    if (localStorage.getItem("list") != null) {
        list = JSON.parse(localStorage.getItem("list"));
        listComplete = JSON.parse(localStorage.getItem("listComplete"));
        showTasks();
    };

    document.getElementById("btn-add").addEventListener('click', () => {
        if (document.getElementById("input-text").value == ""){
            swal("Oops...", "Escribe tu tarea", "warning");
        }else{

            function create_UUID(){
                var dt = new Date().getTime();
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = (dt + Math.random()*16)%16 | 0;
                    dt = Math.floor(dt/16);
                    return (c=='x' ? r :(r&0x3|0x8)).toString(16);
                });
                return uuid;
            }

            let number = create_UUID();
            
            function pad(n) {
                return n < 10 ? '0' + n : n;
            }
            let currentDate = new Date();
            let currentDayOfMonth = currentDate.getDate();
            let currentMonth = currentDate.getMonth();
            let currentYear = currentDate.getFullYear();

            let date = `${pad(currentDayOfMonth)}/${pad(currentMonth + 1)}/${currentYear}`;

            list.push({"task": document.getElementById("input-text").value, "id": number, "priority": 0, "status": "incomplete", "date": date});
            localStorage.setItem("list", JSON.stringify(list));
            
            document.getElementById("input-text").value = "";
            document.getElementById("input-text").blur();
            showTasks();

        }
    });

    document.getElementById("input-text").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("btn-add").click();
        }
    });


    document.getElementById("delete-all").addEventListener('click', () => {
        swal("¿Deseas eliminar todas las tareas?", {
            buttons: {
              cancel: "Cancelar",
              catch: {
                text: "Continuar",
                value: "catch",
              }
            },
        })
        .then((value) => {
            switch (value) {
              case "catch":
                list = [];
                listComplete = [];
                localStorage.setItem("list", JSON.stringify(list));
                localStorage.setItem("listComplete", JSON.stringify(listComplete));

                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;

                showTasks();

                let deleteAllText = `
                <p class="notification-text notification-delete-all"><i class="far fa-calendar-check"></i> Listo! No tienes tareas </p>`;
                $("#notification").html(deleteAllText);
                notificationAnimation();
                break;
           
              case "cancel":
                showTasks();
            };
        });
    });


});