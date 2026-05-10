"use client" // Se ejecuta en el navegador porque el usuario va a interactuar (clics, teclado)

import { useLogin } from "@/hooks/useLogin" // Traemos el "cerebro" que se acaba de programar

export default function LoginPage() {
    
    // Extraemos las herramientas de nuestro cerebro (Hook)
    // Sacamos las funciones para llenar las cajas y la función de enviar
    const { setEmail, setPassword, handleLogin, loading } = useLogin();

    return (
        <main style={{ padding: "40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1>☕ Bienvenido de nuevo</h1>
            <p>Ingresa tus datos para entrar al CoffeeShop</p>

            {/* El formulario captura el evento de "Enter" o clic en el botón */}
            <form onSubmit={handleLogin} style={{ width: "300px", display: "flex", flexDirection: "column", gap: "15px" }}>
                
                {/* CAJA DE EMAIL: Cada vez que el usuario escribe (onChange), 
                   mandamos ese dato a la caja vacía 'email' del Hook */}
                <div>
                    <label>Correo Electrónico:</label>
                    <input 
                        type="email" 
                        placeholder="tu@correo.com"
                        onChange={(e) => setEmail(e.target.value)} // El "puente" que llena la caja
                        required 
                        style={{ width: "100%", padding: "10px" }}
                    />
                </div>

                {/* CAJA DE CONTRASEÑA: Hacemos lo mismo para la clave */}
                <div>
                    <label>Contraseña:</label>
                    <input 
                        type="password" 
                        placeholder="******"
                        onChange={(e) => setPassword(e.target.value)} // Llenamos la caja de seguridad
                        required 
                        style={{ width: "100%", padding: "10px" }}
                    />
                </div>

                {/* BOTÓN DE ACCIÓN: Solo se activa si no estamos cargando datos */}
                <button 
                    type="submit" 
                    disabled={loading} // Si loading es true, el botón se bloquea (evita doble envío)
                    style={{ 
                        padding: "12px", 
                        backgroundColor: loading ? "#ccc" : "#6F4E37", 
                        color: "white",
                        cursor: loading ? "not-allowed" : "pointer",
                        border: "none",
                        borderRadius: "5px"
                    }}
                >
                    {/* Cambiamos el texto según el estado de la carga */}
                    {loading ? "Validando credenciales..." : "Entrar al Local"}
                </button>
            </form>
        </main>
    )
}

/**

* onChange={(e) => setNombre(e.target.value)}: Se usa este "cable" para ver en tiempo real la carga de este como RAM los datos de forma veloz
 
* onSubmit={handleLogin}: //para envio de este formulario con boton o enter acepte ambas condiciones
 
* disabled={loading} // para evitar que si se caiga la red no sobre sature el limite de carga en el ingreso

*/