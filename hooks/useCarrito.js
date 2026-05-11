"use client" // para usar con el cliente servidor supabase y navegador mesero

import { useState, useEffect } from "react" // para manejar los datos temporalmente RAM herramientas (datos que cambian, ejecutar algo automaticamente)

export const useCarrito = () =>{
 
  const [carrito, setCarrito] = useState ([]); //aqui almaceno los productos dandolo vacio porque el usuario aun no ha escogido nada

  //1. cargar el carrito para guardar al iniciar
  useEffect (()  =>{
 
    const guardado = localStorage.getItem("carrito");
    if (guardado) setCarrito(JSON.parse(guardado));

  }, [] ); //aqui ya empiezo almacenar

  //2. Guardar en el localStore cuando este va cambiando
  useEffect (() => {
    // evitamos que nos borre el localStore del carrito los items de este
    if(carrito.length > 0){
      localStorage.setItem("carrito",JSON.stringify(carrito)); //aqui estoy actualizando el carrito nuevamente
    }
  }, [carrito] );

  //3. funcion de añadir productos Agrega
  const agregaAlCarrito = (producto) =>{
   setCarrito((prev) => {
      //Se revisa si ya esta colocado anteriormente al carrito
      const existe = prev.find((item) => item.id === producto.id);

      if(existe){
       //si existe le sumamos uno a la cantidad
       return prev.map((item) =>
        item.id === producto.id ? { ...item, cantidad:item.cantidad +1} : item
     );
    }
    // si es nuevo le sumamos 1 a la cantidad
    return [...prev, {...producto,cantidad: 1}];
   })
  };

  // Función que resta uno o quita si llega a cero
  const eliminaDelCarrito = (id) => {
    setCarrito((prev) => {
      // 1. Buscamos el producto en la lista
      const productoExistente = prev.find((item) => item.id === id);

      // 2. Si la cantidad es mayor a 1, solo restamos una unidad
      if (productoExistente && productoExistente.cantidad > 1) {
        return prev.map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
        );
      }

      // 3. Si solo queda 1 (o por seguridad), lo borramos por completo
      return prev.filter((item) => item.id !== id);
    });
  };
 
  //calcular total de la compra del carrito
  const totalCompra = carrito.reduce( ( acc, item ) => acc + (item.precio * item.cantidad ), 0 );

  //vaciamos el carro
  const vaciaCarrito = () => setCarrito ( [] );

  return {
   carrito,
   agregaAlCarrito,
   eliminaDelCarrito,
   totalCompra,
   vaciaCarrito
  };

};