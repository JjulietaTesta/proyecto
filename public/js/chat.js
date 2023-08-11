const socket = io()


socket.emit("connection","Nuevo cliente")

let user;

Swal.fire({
    title: 'Ingresa tu nombre de usuario',
    text: 'Inicia sesión',
    input: "text",
    confirmButtonText: "Cool",
    allowOutsideClick: "false",
    confirmButtonText: 'Ingresar',
    inputValidator: (value)=> {
        if (!value) {
            return "Debe ingresar un nombre de usuario"
        }
    },
    }).then((result) => {
    if (result.value) {
     user = result.value
     socket.emit("new-user", {user: user, id:socket.id})
    }
    })


let chatBox = document.getElementById('chatBox')

chatBox.addEventListener('keyup',(e)=>{
    if(e.key === "Enter"){
        let mensaje = chatBox.value
        let contenedorMensajes = document.getElementById('contenedorMensajes')
        let newDiv = document.createElement('div')
        newDiv.innerHTML = ` 
        <div>
        <p><b>${user}</b></p>
        <p>${mensaje}</p>
        </div>
        `
        socket.emit("guardar-mensaje",{user: user, message: mensaje})
        contenedorMensajes.append(newDiv)
        chatBox.value = ""
    }
})

socket.on("enviar-mensajes",(data)=>{
    let contenedorMensajes = document.getElementById('contenedorMensajes')
    contenedorMensajes.innerHTML = ""
    data.forEach((mensaje)=>{
        let newDiv = document.createElement('div')
        newDiv.innerHTML =  ` 
        <div>
        <p><b>${mensaje.user}</b></p>
        <p>${mensaje.message}</p>
        </div>
        `
        contenedorMensajes.append(newDiv)
    })
    socket.emit("Nuevos-mensajes",data.length)
})