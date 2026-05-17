"use client" // Se ejecuta en el navegador porque el usuario va a interactuar (clics, teclado)

import { useLogin } from "@/hooks/useLogin" // Traemos el "cerebro" que se acaba de programar

export default function LoginPage() {

    // Extraemos las herramientas de nuestro cerebro (Hook)
    // Sacamos las funciones para llenar las cajas y la función de enviar
    const { setEmail, setPassword, handleLogin, loading } = useLogin();

   return (
  <main className="min-h-screen w-full flex items-center justify-center bg-[#FFFDF9] py-12 px-4 sm:px-6 lg:px-8 selection:bg-amber-200">
    <div className="w-full max-w-5xl bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
      
      <div className="grid grid-cols-1 md:grid-cols-2">

        {/* Columna Izquierda: Formulario de Login */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-sm">
              ☕
            </div>
            <h1 className="font-extrabold text-[#2B1B17] text-3xl tracking-tight">
              Bienvenido de nuevo
            </h1>
            <p className="mt-2 text-sm font-medium text-gray-500">
              Ingresa tus credenciales para acceder al sistema
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 w-full">
            {/* Campo: Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                Correo Electrónico:
              </label>
              <input 
                className="w-full bg-[#FFFDF9] border border-gray-200/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder:text-gray-400 text-gray-800 font-medium"
                type="email"
                placeholder="tu@correo.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Campo: Contraseña */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                Contraseña:
              </label>
              <input 
                className="w-full bg-[#FFFDF9] border border-gray-200/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder:text-gray-400 text-gray-800 font-medium"
                type="password"
                placeholder="******"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Botón de Ingresar */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide shadow-sm transition-all duration-200 text-gray-900 active:scale-[0.98]
                  ${loading 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : "bg-[#FFC554] hover:bg-[#e6b147]"
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Validando credenciales...
                  </span>
                ) : (
                  "Ingresar al Panel"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Columna Derecha: Panel Inspirador de Bienvenida */}
        <div className="hidden md:flex flex-col justify-between bg-[#2B1B17] p-12 text-white relative overflow-hidden">
          {/* Un toque de luz de fondo sutil */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-2">
            <span className="text-xl">☕</span>
            <span className="font-black tracking-wider text-xs uppercase text-amber-400/90">Coffee Shop System</span>
          </div>

          <div className="space-y-4 my-auto">
            <blockquote className="text-3xl font-light leading-tight tracking-tight">
              "El buen café no solo se sirve, se gestiona con <span className="text-[#FFC554] font-medium italic">precisión</span>."
            </blockquote>
            <p className="text-sm text-amber-100/60 font-medium">
              Controla tu inventario, productos y ventas desde un solo lugar con una experiencia fluida.
            </p>
          </div>

          <div className="text-xs text-gray-400/80 font-medium">
            © {new Date().getFullYear()} MDavid24Dev. Todos los derechos reservados.
          </div>
        </div>

      </div>
    </div>
  </main>
);
}

/**

* onChange={(e) => setNombre(e.target.value)}: Se usa este "cable" para ver en tiempo real la carga de este como RAM los datos de forma veloz
 
* onSubmit={handleLogin}: //para envio de este formulario con boton o enter acepte ambas condiciones
 
* disabled={loading} // para evitar que si se caiga la red no sobre sature el limite de carga en el ingreso

*/