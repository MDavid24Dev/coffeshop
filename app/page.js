"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase.js"; //trayendo variables de entorno


// Creamos el cliente pasando las variables
//const supabase = createClient();

export default function Home() {

  // 2. Función de prueba para la base de datos
  const checkSupabase = async () => {
    try {
      const { data, error } = await supabase.from('productos').select('*');
      
      if (error) {
        console.log("❌ Error de Supabase:", error.message);
      } else {
        console.log("✅ ¡Conexión exitosa! Usuarios:", data);
      }
    } catch (err) {
      console.log("💥 Error inesperado:", err);
    }
  };

  // 3. Efecto para ejecutar la prueba al cargar
  useEffect(() => {
    checkSupabase();

  }, []);

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#3e2723' }}>CoffeShop ☕</h1>
      <p>El error 500 debería haber desaparecido.</p>
      <p>Mira la <b>consola del navegador (F12)</b> para confirmar la conexión.</p>
    </div>
  );
}