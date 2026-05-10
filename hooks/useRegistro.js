// hooks/useRegistro.js "estado de registro Metadatos temporales Memoria Ram"

import { useState } from "react"; 
//coge los metadatos en temporales para usarlos  cajas con datos no mas
import { registroSupabase } from "@/services/auth/registroSupabase";   
// los envio a el registro par cargarlos a mi db de supabase
import { useRouter } from "next/navigation"; 
// paso al usuario para que pase a la pagina como rutas

export function useRegistro(){
   //1. coger cajitas con datos temporales (memoria de estos datos)
    
   //variable nombre como caja vacia se crea en todos
   const [nombre, setNombre] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(false);

   //variable de router para poder enviar al usuario al punto
   const router = useRouter();

   // 2. "con handle envio estos datos a mi db 
   // en registro "
   const handleRegistro = async (e) => {
    e.preventDefault(); 
    // e es detener la pagina para enviar datos
    setLoading(true); 
    // activa el estado de carga para enviarlos.
   
    try{
        //llamar el servicio para enviarle los estados de estas cajas
        // de registro en la db
        // aqui creamos una caja resultado
        const resultado = await registroSupabase (nombre, email, password);
        // luego vamos nuestro servicio con los datos que estan en ()

        if(resultado){
            //si el registro es exitoso lo enviamos a la pagina enrutandolo
            router.push("/home");
            console.log("El usuario ya esta registrado exitosamente");
        }


    }catch (error){ 
    
    }

};

}


  



