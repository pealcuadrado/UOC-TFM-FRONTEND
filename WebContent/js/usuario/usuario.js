var url="http://localhost:8080/";
$(document).ready(function() {
	token=localStorage.getItem("token");
	if(token==null){
		console.log("Token no disponible");
	}
	else{
		console.log(token);
		window.location.replace('dashboard.html');
		
	}
});

//Control login
$( "#login" ).click(function(evento) {
	evento.preventDefault();
    var email=$("#email_login").val();
    var contrasena=$("#password_login").val();
    var datosLogin=JSON.stringify({"email":email,"contrasena":contrasena});
    $.ajax({
    	type:"post",
    	url:url+"login",
    	data:datosLogin,
    	dataType:"json",
    	contentType: "application/json; charset=utf-8"
    }).done(function(data){
    	localStorage.setItem("token", data.token);
    	window.location.replace('dashboard.html');
    }).fail(function(data, statusText, xhr){
    	console.log(data.status);
    	$('#error_login').text("El usuario y/o la contraseña son incorrectos");
    	$('#error_login').show();
    });
});

//Control nuevo usuario
$("#nuevo_usuario").click(function(evento){
	$('#error_registro').hide();
	evento.preventDefault();
	//Validacion1: Password debe tener 5 o mas caracteres
	if($("#password").val().length < 5){
		$("#error_registro").text("El password debe tener 5 o más carácteres");
		$('#error_registro').show();
		return;
	}
	//Validacion2: El password y el password de confirmacion deben ser iguales
	if($("#password").val() != $("#password_confirm").val()){
		$("#error_registro").text("El password y la confirmación del password deben coincidir");
		$('#error_registro').show();
		return;
	}
	//Validacion3: No debe haber campos vacios
	if($("#nombre").val().length==0 || $("#apellido").val().length==0 || $("#email").val().length==0){
		$("#error_registro").text("No deben haber campos vacíos");
		$('#error_registro').show();
		return;
	}
	//Request nuevo usuario
	var email=$("#email").val();
	var nombre=$("#nombre").val();
	var apellido=$("#apellido").val();
	var contrasena=$("#password").val();
	var datosUsuario=JSON.stringify({"email":email,"nombre":nombre, "apellido":apellido, "contrasena":contrasena});
    $.ajax({
    	type:"post",
    	url:url+"usuarios/nuevo_usuario",
    	data:datosUsuario,
    	dataType:"json",
    	contentType: "application/json; charset=utf-8"
    }).done(function(data){
    	alert("Usuario creado correctamente. Introduce los datos en la pantalla de login para iniciar sesión.");
    	localStorage.removeItem('token');
    	$('#modal_nuevo_usuario').modal('toggle');
    }).fail(function(data, statusText, xhr){
    	console.log(data.status);
    	$('#error_registro').text(JSON.parse(data.responseText).status);
    	$('#error_registro').show();
    });
	
});
