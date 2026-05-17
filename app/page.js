"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase.js";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  let isMounted = true;

  const consultarProductos = async () => {
    try {
      setLoading(true);
      console.log("🚀 Intentando conectar con Supabase...");

      // ⏱️ PARACAÍDAS: Si en 5 segundos no responde, rompe el ciclo
      const timeout = setTimeout(() => {
        if (isMounted) {
          console.error("⏰ Tiempo de espera agotado. Supabase no respondió.");
          setLoading(false);
        }
      }, 5000);

      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .limit(6);

      clearTimeout(timeout); // Cancelamos el temporizador si responde a tiempo

      if (error) {
        console.error("❌ Error de Supabase:", error.message);
        return;
      } 
      
      if (isMounted) {
        setProductos(data || []);
      }
    } catch (err) {
      console.error("💥 Error en el bloque catch:", err);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  consultarProductos();

  return () => {
    isMounted = false;
  };
}, []);

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#2B1B17] font-sans antialiased">

      {/* 1. NAVBAR NUEVO (Estilo "Brewery" minimalista y claro) */}
      <nav className="bg-white/80 backdrop-blur-md px-8 py-4 flex items-center justify-between border-b border-stone-100 sticky top-0 z-50 shadow-sm">
        {/* Logo a la izquierda */}
        <div className="flex items-center gap-2 font-serif font-bold tracking-wide text-[#1A1A1A] text-3xl">
          <span>☕</span> CoffeShop
        </div>

        {/* Menú central */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <Link href="/" className="text-[#6F4E37] font-semibold border-b-2 border-[#6F4E37] pb-1">Home</Link>
          <Link href="/tienda" className="hover:text-[#6F4E37] transition pb-1">Product</Link>
        </div>

        {/* Iconos y Botón Derecho */}
        <div className="flex items-center gap-6">
          <Link href="/tienda" className="text-stone-600 hover:text-stone-900 transition relative">
            🛒
          </Link>
          <Link href="/login" className="bg-[#6F4E37] hover:bg-[#533A29] text-white text-xs uppercase tracking-wider font-semibold px-5 py-2.5 rounded-full transition shadow-sm">
            Login
          </Link>
        </div>
      </nav>

      {/* 2. HERO SECTION NUEVO (Fondo claro, limpio y con estadísticas) */}
      <header className="w-full px-[80px]  xl:mx-auto  py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Columna Izquierda: Textos y estadísticas */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-sans font-bold tracking-tight text-[#1A1A1A] leading-[1.15]">
              Disfruta tus <br />
              <span className="text-[#1A1A1A]">Mañanas de un Cafe</span>
            </h1>
            <p className="text-stone-500 text-sm max-w-md leading-relaxed text-[17px]">
              Porque en el mundo los mejores momentos comienzan con el aroma y la frescura de una taza de café. Vívelo, disfrútalo y comparte la experiencia que estabas esperando.
              </p>
          </div>

          {/* Botón de acción con la flecha diagonal */}
          <div>
            <Link
              href="/tienda"
              className="bg-[#593E2A] hover:bg-[#432F20] text-white font-medium px-6 py-3.5 rounded-full inline-flex items-center gap-3 transition shadow-md group text-sm"
            >
              Ordena ahora
              <span className="bg-white text-[#593E2A] w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs group-hover:rotate-45 transition duration-300">
                ↗
              </span>
            </Link>
          </div>

          {/* Fila de Estadísticas */}
          <div className="pt-6 grid grid-cols-3 gap-6 border-t border-stone-200 max-w-sm">
            <div>
              <p className="text-3xl font-bold text-[#1A1A1A]">2K+</p>
              <p className="text-xs text-stone-400 font-medium">Reviews</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1A1A1A]">3K+</p>
              <p className="text-xs text-stone-400 font-medium">Best sales</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1A1A1A]">200+</p>
              <p className="text-xs text-stone-400 font-medium">Reviews</p>
            </div>
          </div>
        </div>

        {/* Columna Derecha: El splash/imagen del café */}
     {/* Columna Derecha: Composición 3D Centrada y Alineada sin cortes feos */}
<div className="relative w-full h-[350px] sm:h-[450px] md:h-[500px] flex items-center justify-center overflow-visible">
  
  {/* Sombra o mancha decorativa difuminada bien al fondo */}
  <div className="absolute w-72 h-72 bg-[#6F4E37]/5 rounded-full -z-10 blur-3xl"></div>

  {/* ========================================================
      CAPA 1: SPLASH DE FONDO ATRÁS (z-10)
      ======================================================== */}
  <div 
    className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[95%] sm:w-[85%] md:w-[80%] h-[85%] md:h-[90%] z-10 anim-atras opacity-90"
    style={{
      maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)'
    }}
  >
    <img
      src="/coffee splash.png"
      alt="Splash de café base"
      
      className="w-full h-full object-cover object-bottom drop-shadow-md select-none"
    />
  </div>

  {/* ========================================================
      CAPA 2: EN EL FRENTE Y CENTRADO (z-30)
      ======================================================== */}
  {/* Ajustamos los anchos en móvil (w-[55%]) para que no tape por completo el splash */}
 <div 
    /* SOLUCIÓN: 
      - En móviles (por defecto): Se centra usando left-1/2 y -translate-x-1/2 con un ancho controlado (w-[65%]).
      - En escritorio (md:): Quitamos el translate (-translate-x-0) y restablecemos el ancho original (md:w-[50%]) para que se acomode sola a la derecha.
    */
    className="absolute left-1/2 -translate-x-1/2 md:-translate-x-0 bottom-1 w-[65%] md:w-[50%] z-30 anim-frente"
  >
    <img
      src="/pngegg.png"
      alt="Pastel horneado flotando al frente"
      className="w-full h-auto object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.35)] select-none transition duration-300"
    />
  </div>

</div>
      </header>

      {/* 3. SECCIÓN: OUR POPULAR PRODUCTS (Tu catálogo dinámico de Supabase) */}
      <section className="bg-white py-20 border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-8">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#6F4E37] block mb-2 font-mono">
                Tienda especial
              </span>
              <h2 className="text-3xl font-serif font-bold text-[#1A1A1A]">
                Nuestros productos populares
              </h2>
            </div>
            <div>
              <Link href="/tienda" className="bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-md transition shadow-sm inline-block">
                nuestros productos
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block w-8 h-8 border-4 border-[#6F4E37] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-sm italic text-stone-400">Consultando la bodega...</p>
            </div>
          ) : productos.length === 0 ? (
            <p className="text-center py-12 text-stone-400 italic text-sm">No hay productos actualmente para ofrecer.</p>
          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {productos.map((prod) => (
                <div key={prod.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-300 border border-stone-100 flex flex-col justify-between">
                  <div>
                    {/* Tarjeta Gris para la imagen */}
                    <div className="bg-[#EAEAEA] rounded-xl h-56 w-full flex items-center justify-center overflow-hidden  mb-4">
                      {prod.imagen_url ? (
                        <img
                          src={prod.imagen_url}
                          alt={prod.nombre}
                          className="w-full h-full object-cover hover:scale-101 transition duration-300"
                        />
                      ) : (
                        <span className="text-6xl select-none">☕</span>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-xl text-[#1A1A1A] mb-1">
                      {prod.nombre}
                    </h3>
                    <p className="text-stone-500 text-xs leading-relaxed line-clamp-2 mb-4">
                      {prod.descripcion || 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod.'}
                    </p>
                  </div>

                  {/* Precios y botón */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-50">
                    <div className="flex items-baseline gap-2">
                      <span className="font-sans font-bold text-xl text-[#1A1A1A]">
                        ${prod.precio?.toLocaleString()}
                      </span>
                      <span className="text-xs text-stone-400 line-through font-medium">
                        ${((prod.precio || 0) * 1.15).toFixed(0)}
                      </span>
                    </div>

                    <Link
                      href="/tienda"
                      className="bg-[#D2B48C] hover:bg-[#C1A47E] text-[#1C110E] font-medium text-xs px-4 py-2.5 rounded-md transition shadow-sm border border-[#A27B5C]/10"
                    >
                      añadir al carrito
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          )}
        </div>
      </section>

    </div>
  );
}