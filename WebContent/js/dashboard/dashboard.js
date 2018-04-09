var url="http://localhost:8080/";
$(document).ready(function() {
	token=localStorage.getItem("token");
	if(token==null){
		console.log("Token no disponible");
		window.location.replace("login.html");
	}
	else{
		console.log(token);
	}
    $.ajax({
    	type:"get",
    	url:url+"usuarios/informacion_usuario/0",
    	headers: {"token":token},
    	dataType:"json",
    	contentType: "application/json; charset=utf-8"
    }).done(function(data){
    	$("#contenido").text("Hola " + data.nombre + " " + data.apellido + " (" + data.id_usuario + ")")
    }).fail(function(data, statusText, xhr){
    	console.log(data.status);
    	window.location.replace("login.html");
    });
});

$("#logout").click(function(evento){
	evento.preventDefault();
	localStorage.removeItem('token');
	window.location.replace("login.html");
});