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

return (
    <main className="min-h-screen bg-[#FFFDF9] flex items-center justify-center px-4 py-12 selection:bg-amber-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100/80">
        
        {/* Header del Formulario */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
            ☕
          </div>
          <h1 className="text-3xl font-extrabold text-[#2B1B17] tracking-tight">
            Registro de Usuario
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 font-medium">
            Ingresa tus datos para empezar tu experiencia
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleRegistro} className="space-y-5">
          
          {/* Campo: Nombre Completo */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
              Nombre Completo:
            </label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ingresa tu nombre"
                onChange={(e) => setNombre(e.target.value)} 
                required 
                className="w-full bg-[#FFFDF9] border border-gray-200/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder:text-gray-400 text-gray-800 font-medium"
              />
            </div>
          </div>

          {/* Campo: Correo Electrónico */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
              Correo Electrónico:
            </label>
            <input 
              type="email" 
              placeholder="correo@ejemplo.com"
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full bg-[#FFFDF9] border border-gray-200/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder:text-gray-400 text-gray-800 font-medium"
            />
          </div>

          {/* Campo: Contraseña */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
              Contraseña:
            </label>
            <input 
              type="password" 
              placeholder="Mínimo 6 caracteres"
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full bg-[#FFFDF9] border border-gray-200/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder:text-gray-400 text-gray-800 font-medium"
            />
          </div>

          {/* Botón de Submit */}
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide shadow-sm transition-all duration-200 text-gray-900
                ${loading 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                  : "bg-[#FFC554] hover:bg-[#e6b147] active:scale-[0.98]"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  {/* Spinner básico animado */}
                  <svg className="animate-spin h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Registrando...
                </span>
              ) : (
                "Crear Cuenta"
              )}
            </button>
          </div>

        </form>
      </div>
    </main>
  );

}