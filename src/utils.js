export var formatRut = function(rut) {
	rut = rut.replace("k", "K");
	rut = rut.replace(/[^0-9K]/g,''); //Solo dejamos números y K
	if(rut.length > 1) rut = rut.slice(0, -1) +"-"+rut.slice(-1); //si hay más de 1 caracter le añadimos el guión
	return rut;
}
export var checkRut = function(rut) {
    var valor = rut.replace('.','');
    valor = valor.replace('-','');
    var cuerpo = valor.slice(0,-1);
    var dv = valor.slice(-1).toUpperCase();
    // Si no cumple con el mínimo ej. (n.nnn.nnn)
    //if(cuerpo.length < 7) { return false;}  //SE COMENTA PARA QUE NO FALLE CON 3-5
    
    // Calcular Dígito Verificador
    var suma = 0;
    var multiplo = 2;
    for(var i=1;i<=cuerpo.length;i++) {
        // Obtener su Producto con el Múltiplo Correspondiente
        var index = multiplo * valor.charAt(cuerpo.length - i);
        suma = suma + index;
        // Consolidar Múltiplo dentro del rango [2,7]
        if(multiplo < 7) { multiplo = multiplo + 1; } else { multiplo = 2; }
  
    }
    // Calcular Dígito Verificador en base al Módulo 11
    var dvEsperado = 11 - (suma % 11);
    // Casos Especiales (0 y K)
    dv = (dv === 'K')?10:dv;
    dv = (dv === 0 || dv === '0')?11:dv;
    
    // Validar que el Cuerpo coincide con su Dígito Verificador
    if(""+dvEsperado !== ""+dv) { return false; }
    
    // Si todo sale bien, eliminar errores (decretar que es válido)
	return true;
}
export var monthNumberToShortName = function(number) {
    if(parseInt(number) === 1) return "Ene";
    if(parseInt(number) === 2) return "Feb";
    if(parseInt(number) === 3) return "Mar";
    if(parseInt(number) === 4) return "Abr";
    if(parseInt(number) === 5) return "May";
    if(parseInt(number) === 6) return "Jun";
    if(parseInt(number) === 7) return "Jul";
    if(parseInt(number) === 8) return "Ago";
    if(parseInt(number) === 9) return "Sept";
    if(parseInt(number) === 10) return "Oct";
    if(parseInt(number) === 11) return "Nov";
    if(parseInt(number) === 12) return "Dic";
    return "otro";
}

export var sectionHasPath = function(section, path) {
    var result = false;
    section.to.forEach((to) => {
        if(comparePaths(to, path)) result = true;
    });
    return result;
}
export var pathIsInArray = function(section, path) {
    var result = false;
    if(typeof section === "string") return comparePaths(section, path);
    section.forEach((to) => {
        if(comparePaths(to, path)) result = true;
    });
    return result;
}
export var comparePaths = function(path1, path2) {
    var split1 = path1.split("/");
    var split2 = path2.split("/");
    if(split1[split1.length-1] === "") split1.pop();
    if(split2[split2.length-1] === "") split2.pop();
    if(split1.length !== split2.length) return false;
    var result = true;
    split1.forEach((split, i) => {
        if(split !== split2[i] && split !== "*" && split2[i] !== "*") result = false;
    });
    return result;
}
export var getServiceAddressString = function(service) {
    if(!service) return "";
    var client_address = service.client_address ? service.client_address : service.client_address_street + " " + service.client_address_num + " " + service.client_address_block + " " + service.client_address_dept;
    if((service.client_street && service.client_street !== "") 
        || (service.client_number && service.client_number !== "")
        || (service.client_block && service.client_block !== "")
        || (service.client_dept && service.client_dept !== "")
        || (service.client_location && service.client_location !== "")) client_address = "";
    if(service.client_street && service.client_street !== "") {
        if(client_address.trim() !== "") client_address += ", ";
            client_address += service.client_street;
    }
    if(service.client_number && service.client_number !== "") {
            if(client_address.trim() !== "") client_address += " ";
            client_address += service.client_number;
    }
    if(service.client_block && service.client_block !== "") {
        if(client_address.trim() !== "") client_address += ", ";
            client_address += "block " + service.client_block;
    }
    if(service.client_dept && service.client_dept !== "") {
        if(client_address.trim() !== "") client_address += ", ";
            client_address += "depto. " + service.client_dept;
    }
    if(service.client_location && service.client_location !== "") {
        if(client_address.trim() !== "") client_address += ", ";
            client_address += "piso/local/oficina " + service.client_location;
    }
    return client_address;
}