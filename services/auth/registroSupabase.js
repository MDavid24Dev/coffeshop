import { supabase } from "@/lib/supabase"; // conexion puente cable supabase

export async function registroSupabase (nombre, email, password) { 
  //datos que vamos a exportar de registro 
  
  // 1. Crear usuario en la tabla de Autenticación (Sistema de Supabase) Auth.user
  const { data, error } = await supabase.auth.signUp({ email, password });
  
  if (error) { 
    console.error("Error en Auth:", error.message);
    throw new Error(error.message); // no permite crear el registro en Auth
  }

  // 2. Guardar los datos del perfil en tabla de usuarios
  // se usa el mismo id del auth a usuarios
  const { error: dbError } = await supabase.from("usuarios").insert({ 
    id: data.user.id,
    nombre: nombre,
    correo: email,
    rol: "cliente"
  });

  if (dbError) {
    console.error("Error al insertar en tabla usuarios:", dbError.message);
    throw new Error("Usuario creado, pero no se pudo guardar el perfil.");
  }

  return data;
 } 


