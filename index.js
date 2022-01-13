window.addEventListener('load', function() {
    console.log('All assets are loaded');

    let btnTop = document.getElementById("btnTop");

    window.onscroll = function() {
        scrollFunction()
    };

    function scrollFunction() {
        if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
            btnTop.style.display = "block";
        } else {
            btnTop.style.display = "none";
        }
    };
    btnTop.addEventListener('click', () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    });

    let list = [];
    let listAdded = [];

    
    const completeTask = (list) => {
        for(let i = 0; i < list.length; i++){
            
            document.getElementById(`item-complete-${i}`).addEventListener('click', () => {

                if(document.getElementById(`task-complete-${i}`).style.display == "block"){
                    listAdded.forEach(item => {
                        let findItem = list.find(list => list.id == item);
                        let indexItem = list.indexOf(findItem);
                        let indexListAdded = listAdded.indexOf(item);
                        if(findItem.id == list[i].id){
                            listAdded.splice(indexListAdded, 1);
                            localStorage.setItem("listAdded", JSON.stringify(listAdded));
                            
                            document.getElementById(`task-item-${indexItem}`).style.backgroundColor = "rgb(255, 255, 255)";
                            document.getElementById(`task-item-${indexItem}`).style.color = "rgb(31, 31, 36)";
                            document.getElementById(`task-item-${indexItem}`).style.padding = " 1rem 0.5rem";
                            document.getElementById(`item-complete-${indexItem}`).style.backgroundColor = "rgb(137, 206, 183)";
                            document.getElementById(`item-complete-${indexItem}`).style.color = "rgb(255, 255, 255)";
                            document.getElementById(`task-complete-${indexItem}`).style.display = "none";
                        }
                    });

                }else{
                    listAdded.push(list[i].id);
                    localStorage.setItem("listAdded", JSON.stringify(listAdded));
                    
                    document.getElementById(`task-item-${i}`).style.backgroundColor = "rgba(240, 240, 255, 0.4)";
                    document.getElementById(`task-item-${i}`).style.color = "rgb(255, 255, 255)";
                    document.getElementById(`task-item-${i}`).style.padding = "0.7rem 0.5rem";
                    document.getElementById(`item-complete-${i}`).style.backgroundColor = "rgb(31, 31, 36)";
                    document.getElementById(`item-complete-${i}`).style.color = "rgb(255, 255, 255)";
                    document.getElementById(`task-complete-${i}`).style.display = "block";
                }

                if(listAdded.length == list.length){
                    swal("Felicitaciones!", "No tienes tareas pendientes", "success");
                }
            });
        };
    
    };
    
    const deleteItem = (list) => {
        
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
                            itemDeleted.push(list[i])
                            for (let j = 0; j < listAdded.length; j++){
                                if(itemDeleted[0].id == listAdded[j]){
                                    listAdded.splice(j, 1);
                                    localStorage.setItem("listAdded", JSON.stringify(listAdded));
                                }
                            };

                            list.splice(i, 1);
                            localStorage.setItem("list", JSON.stringify(list));
                            showTasks();
                            swal("Listo!", "Tarea eliminada", "success");
                            break;
                    
                        case "cancel":
                            showTasks();
                    }
                });

            });
            
        }
        
    };
    
    const showTasks = () => {
        if(list.length > 0){
        document.getElementById("no-tasks").classList.add("hide");
            let acu = ``;
            for(let i = 0; i < list.length; i++){
                acu += `
                <div class="task-item" id="task-item-${i}">
                    <p class="btn task-item-complete-icon" id="item-complete-${i}"><i class="fas fa-check"></i></p>
                    <div class="task-item-text">
                        <p>${list[i].task}</p>
                        <p class="task-complete" id="task-complete-${i}">Tarea Completa!</p>
                    </div>
                    <p class="btn task-item-delete-icon" id="item-delete-${i}"><i class="fas fa-minus"></i></p>
                </div>
                `;
            
            }
            document.getElementById("delete-all").classList.add("show");
            document.getElementById("tasks").classList.remove("hide");
            document.getElementById("tasks").innerHTML = acu;
            
            completeTask(list);

            for(let i = 0; i < list.length; i++){
                listAdded.forEach(item => {
                    let findItem = list.find(list => list.id == item);
                    let indexItem = list.indexOf(findItem);                    
                    let idFoundItem = findItem.id;

                    if(idFoundItem == list[i].id){
                        
                        document.getElementById(`task-item-${indexItem}`).style.backgroundColor = "rgba(240, 240, 255, 0.4)";
                        document.getElementById(`task-item-${indexItem}`).style.color = "rgb(255, 255, 255)";
                        document.getElementById(`task-item-${indexItem}`).style.padding = "0.7rem 0.5rem";
                        document.getElementById(`item-complete-${indexItem}`).style.backgroundColor = "rgb(31, 31, 36)";
                        document.getElementById(`item-complete-${indexItem}`).style.color = "rgb(255, 255, 255)";
                        document.getElementById(`task-complete-${indexItem}`).style.display = "block";
                    }
                });
            };
            deleteItem(list);
        }else{
            document.getElementById("delete-all").classList.remove("show");
            document.getElementById("tasks").classList.add("hide");
            document.getElementById("no-tasks").classList.remove("hide");
        }

    };

    if (localStorage.getItem("list") != null) {
        list = JSON.parse(localStorage.getItem("list"));
        listAdded = JSON.parse(localStorage.getItem("listAdded"));
        
        showTasks();
    }


    document.getElementById("btn-add").addEventListener('click', () => {
        if (document.getElementById("input-text").value == ""){
            swal("Oops...", "Escribe tu tarea", "warning");
        }else{
            document.getElementById("no-tasks").classList.add("hide");
            let number = Math.floor(Math.random() * 100000);
            
            list.push({"task": document.getElementById("input-text").value, "id": number});
            localStorage.setItem("list", JSON.stringify(list));
            
            document.getElementById("input-text").value = "";
            showTasks();
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
                listAdded = [];
                localStorage.setItem("list", JSON.stringify(list));
                localStorage.setItem("listAdded", JSON.stringify(listAdded));
                showTasks();
                this.document.getElementById("delete-all").classList.remove("show");
                this.document.getElementById("no-tasks").classList.remove("hide");
                swal("Listo!", "No tienes tareas", "success");
                break;
           
              case "cancel":
                showTasks();
            }
        });
        
    });


});