"use client" //aqui el usuario navegara con el cerebro "validando los datos"

import { useState } from "react" //este nos sirve como cajas vacias 
import { loginSupabase } from "@/services/auth/loginSupabase" // traemos esa conexion de servicio que nos valida
import { useRouter } from "next/navigation" // enviamos al usuario al punto despues del ingreso

export function useLogin(){

  const [email, setEmail] = useState(""); // paso datos de estos en vacio
  const [password, setPassword] = useState(""); // paso datos en vacio
  const [loading, setLoading] = useState(false); //caja de carga en falso sin carga aun

  const router = useRouter(); // creamos nuestro estado de carga la variable router a un punto 

  const handleLogin = async (e) => {
  
    e.preventDefault();  //evitamos que la pagina se cargue
    setLoading(true); //ya empezamos a pasar los datos en estado de carga

    try{
     //llamamos a la funcion de supabase para poder validar los datos en LoginSupabase
     //almacenando en una variable en data
     const data = await loginSupabase(email,password);

     if(data){
        console.log("¡Acceso concedido!"); //vemos que ya tiene acceso
        router.push("/"); // lo enviamos a la ruta del home
     }

    }catch (error){
       
      alert(error.message);  //aqui valida que tanto correo o contraseña frikis

    }finally{
      setLoading(false); // pasamos para decir que ya no estamos cargando
    }

  }

  //pasamos al apartado de vista estos datos para usarlos
  return {
   setEmail,
   setPassword,
   handleLogin,
   loading
  };

}//salida de la funcion de Login