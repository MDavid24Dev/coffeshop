"use client"; 
// para que el usuario la use se usa este comando si es frontend

import { useRegistro } from "@/hooks/useRegistro"; // aqui para que pueda enviar los datos temporalmente "Metadatos"

export default function RegistroUsuario(){
    //extraemos las herramientas del instructivo controlador "Hook" que retornamos antes
    const{
        setNombre,
        setEmail,
        setPassword,
        handleRegistro,
        loading
    } = useRegistro();

  return(

   <main style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem" }}>
      <h1>Registro de Usuario</h1>
      <p>Ingresa tus datos para empezar</p>

      <form onSubmit={handleRegistro}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Nombre Completo:</label>
          <input 
            type="text" 
            placeholder="ingresa tu nombre"
            onChange={(e) => setNombre(e.target.value)} 
            required 
            style={{ width: "100%", display: "block" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Correo Electrónico:</label>
          <input 
            type="email" 
            placeholder="correo@ejemplo.com"
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: "100%", display: "block" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Contraseña:</label>
          <input 
            type="password" 
            placeholder="Mínimo 6 caracteres"
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: "100%", display: "block" }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ width: "100%", padding: "0.5rem", cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Registrando..." : "Crear Cuenta"}
        </button>
      </form>
    </main>

  );

}