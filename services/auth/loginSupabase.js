import { supabase } from "@/lib/supabase"; // conexion puente cable supabase db

//validar entradas LOGIN

export async function loginSupabase(email,password) {
    
    //1.se valida si le estan dando datos a las cajas con los datos anteriormente registrados
    if(!email || !password){
       throw new Error("Por favor, ingresa email o contraseña no pueden quedar vacios");
    }

    //2. Intentamnos cargar datos de Supabase
    const {data, error} = await supabase.auth.signInWithPassword({
      email: email.trim(), //con trim, hacemos que los espacio caracteres no se cuenten ej. junx@gmail.com
      password: password, //traemos la misma para comparar
    });

    //3. validamos la respuesta es con el error
    if(error){

        if (error.message == "Invalid login credentials"){
           throw new Error("El correo o contraseña no son validos");
        }
        // otros errores de (servidor, conexion, etc.)
        throw new Error(error.message);
    }
    
    // si todo esta Okey se envia los datos del usuario
    return data;
}