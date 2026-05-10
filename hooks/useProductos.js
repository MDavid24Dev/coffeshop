"use client" //este corre en el navegador el adminitrador que maneja todo cuando esta en frontend con el

import { useState, useEffect } from "react";

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

    //AgregarProductos crear
    const agregarProducto = async (datos) => {
      setLoading(true);
      try{
        await crearProducto(datos);
        await cargaTodo(); // reactulizo y cargo todos los productos
      }catch (error){
        alert(error.message);
      }finally{
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

    const editarProducto = async (id, nuevosDatos) =>{
        setLoading(true);
        try{
         await actualizarProducto(id,nuevosDatos);
         setProductosSeleccionado(null); // se cierra para que no puedan actualizar una vez se cargaron datos
         await cargaTodo(); //Aqui actualiza todo ya
        }catch(error){
           alert(error.message);
        }finally{
            setLoading(false);
        }
    }

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