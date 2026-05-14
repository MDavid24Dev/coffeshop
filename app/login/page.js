"use client" // Se ejecuta en el navegador porque el usuario va a interactuar (clics, teclado)

import { useLogin } from "@/hooks/useLogin" // Traemos el "cerebro" que se acaba de programar

export default function LoginPage() {

    // Extraemos las herramientas de nuestro cerebro (Hook)
    // Sacamos las funciones para llenar las cajas y la función de enviar
    const { setEmail, setPassword, handleLogin, loading } = useLogin();

    return (
        <main className="min-h-screen w-full flex items-center bg-amber-500">
            <div className="mx-auto px-4 w-full max-w-6xl">
                {/* CORRECCIÓN: Agregada la clase grid y removido el fondo azul de prueba */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">

                    {/* Columna Izquierda: Formulario */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h1 className="font-black text-green-700 text-2xl mb-4">☕ Bienvenido de nuevo</h1>
                        <p className="mb-4 text-gray-600">Ingresa tus datos</p>

                        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
                            <div>
                                <label className="block mb-1 font-medium">Correo Electrónico:</label>
                                <input className="w-full border p-2 rounded"
                                    type="email"
                                    placeholder="tu@correo.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Contraseña:</label>
                                <input className="w-full border p-2 rounded"
                                    type="password"
                                    placeholder="******"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: "12px",
                                    backgroundColor: loading ? "#ccc" : "#6F4E37",
                                    color: "white",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    border: "none",
                                    borderRadius: "5px"
                                }}
                            >
                                {loading ? "Validando credenciales..." : "Ingresar"}
                            </button>
                        </form>
                    </div>

                    {/* Columna Derecha: Contenido extra */}
                    <div className="bg-green-700 p-6 rounded-lg text-white h-full justify-center items-center">
                        <h2 className=" flex  justify-center font-bold text-xl mb-2">Columna 2</h2>
                        <p>Contenido del lado derecho</p>
                    </div>

                </div>
            </div>
        </main>
    )
}

/**

* onChange={(e) => setNombre(e.target.value)}: Se usa este "cable" para ver en tiempo real la carga de este como RAM los datos de forma veloz
 
* onSubmit={handleLogin}: //para envio de este formulario con boton o enter acepte ambas condiciones
 
* disabled={loading} // para evitar que si se caiga la red no sobre sature el limite de carga en el ingreso

*/