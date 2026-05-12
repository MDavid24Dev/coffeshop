"use client" //este corre en el navegador el adminitrador que maneja todo cuando esta en frontend con el

import { useState, useEffect } from "react";
import { subirImagen } from "@/services/cloudinary"

//llamar mis funciones del crudProductos

import {
    crearProducto,
    obtenerProducto,
    eliminarProducto,
    actualizarProducto
} from "@/services/productos/crudProductos"
import { supabase } from "@/lib/supabase";
import { refresh } from "next/cache";

export function useProducto(){
    //1. donde vamos almacenar productos al sistema
    const [productos, setProductos] =useState([]);

    //2. caja donde el sistema sabe si esta cargando los datos
    const [loading, setLoading] = useState(false);

    //3. caja de editar para modificar el que se seleccione por el ID
    const [productoSeleccionado, setProductosSeleccionado] = useState (null);

    // Aqui para traer los productos que hay
    const cargaTodo = async () => {
        setLoading(true);
        try{
          const data = await obtenerProducto();
          setProductos(data); //se llenan los datos
        }catch(error){
           alert(error.message);
        }finally{
            setLoading(false);
        }
    };
 
    //hace que cargue al usuario los datos de los productos
    useEffect(() => {
        cargaTodo();
    }, []);

    //AgregarProducto + cloudinary
    const agregarProducto = async (datos, archivo) => {
  setLoading(true);
  try {
    let urlImagen = "";

    // Si el administrador seleccionó una foto, la subimos primero
    if (archivo) {
      const { subirImagen } = await import("@/services/cloudinary"); 
      urlImagen = await subirImagen(archivo);
    }

    // Guardamos en Supabase con el link (o vacío si no hubo foto)
    await crearProducto({ ...datos, imagen_url: urlImagen });
    await cargaTodo();
  } catch (error) {
    alert("Error al crear: " + error.message);
  } finally {
    setLoading(false);
  }
};

    //borrar producto Delete
    const borrarProducto = async (id) =>{
        if(!confirm("Esta usted seguro de borrar el producto?")) return;
     
        setLoading(true);
        try{
          await eliminarProducto(id);
          await cargaTodo(); //se recarga todo y se borra por el anterior linea
        }catch(error){ 
          alert(error.message); 
        }finally{
          setLoading(false); // ya deja de cargar los datos
        }
    };

    // modificar Actulizar update productos

   const editarProducto = async (id, nuevosDatos, archivo) => {
  setLoading(true);
  try {
    let urlImagen = productoSeleccionado.imagen_url; // Mantenemos la foto actual

    // Si se eligió una foto NUEVA, la reemplazamos en Cloudinary
    if (archivo) {
      const { subirImagen } = await import("@/services/cloudinary");
      urlImagen = await subirImagen(archivo);
    }

    await actualizarProducto(id, { ...nuevosDatos, imagen_url: urlImagen });
    setProductosSeleccionado(null);
    await cargaTodo();
  } catch (error) {
    alert("Error al actualizar: " + error.message);
  } finally {
    setLoading(false);
  }
};

    //se pasa todas estas herramientas a el Frontend para usarlas
    return{
      productos,
      loading,
      productoSeleccionado,
      setProductosSeleccionado,
      agregarProducto,
      borrarProducto,
      editarProducto,
      refrescar: cargaTodo
    };

}