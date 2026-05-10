import { supabase } from "@/lib/supabase"; // puente de conexion con supabase como un todo 

// 1. paso crear un formulario para llenar datos a la db CREAR Producto

export async function crearProducto(nuevoProducto) {
    const {data, error} = await supabase 
    .from ("productos") //apuntando a la tabla de productos hecha en supabase
    .insert([nuevoProducto]); //llenar los datos de este producto

    if (error){
        throw new Error ("Error al guardar el producto: " + error.message);
    }
    return data; // enviamos los datos a la tabla
}

//2. para Leer "Productos (Read)"

export async function obtenerProducto(){

    const {data,error} = await supabase 
     .from("productos")
     .select("*") //traer todo las columnas del producto
     .order("created_at",{ascending:false}); //traer los mas nuevos organizador esta linea

     if(error){
      throw new Error("No se pudo traer los productos: " + error.message);
     }
     return data; //nos da los datos exitosamente
}

//3. Para Eliminar Producto por el UUDI Delete

export async function eliminarProducto(id){
    const {error} = await supabase
    .from("productos")
    .delete()
    .eq("id",id); // solo se elimina por el ID que coincida y sea unico igual
    if(error){
       throw new Error ("No se puede Borrar: " + error.message); 
    }
}

//4.Actualizar Producto

export async function actualizarProducto(id,actualizar){
   const {data, error} = await supabase
   .from ("productos")
   .update(actualizar) //mandamos los datos de lo que nos trae el sistema
   .eq("id",id); //Al que tenga el mismo id (identificador)

   if(error){
    throw new Error ("No se pudo actualizar el producto: " +error.message);
   }
   return data;

}