"use client"
import { useProducto } from "@/hooks/useProductos";
import { useCarrito } from "@/hooks/useCarrito";
import { useStripe } from "@/hooks/useStripe";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function TiendaPage() {
    const { productos, loading } = useProducto();
    // hook del carrito
    const { carrito, agregaAlCarrito, totalCompra, vaciaCarrito, eliminaDelCarrito } = useCarrito();
    // Aquí usamos tu hook de Stripe
    const { iniciarPago, procesando } = useStripe();

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);

        if (query.get('success')) {
            registrarPedido();
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const registrarPedido = async () => {
     const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        alert("Debes estar logueado para registrar el pedido");
        return;
    }

        // Aquí mandas la info a Supabase
        const { data, error } = await supabase
            .from('pedido')
            .insert([
                {
                usuario_id: user.id, // Usamos el UUID del usuario
                estado: 'pagado',
                total: totalCompra  // Asegúrate que use totalCompra del hook
                }
            ]);

        if (!error) alert("¡Pedido guardado en CoffeShop!");
    };

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 bg-gray-50 min-h-screen">

            {/* 1. SECCIÓN DE PRODUCTOS */}
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-10">
                        <p className="text-orange-800 animate-pulse font-medium">Preparando el menú...</p>
                    </div>
                ) : (
                    productos.map((prod) => (
                        <div key={prod.id} className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">{prod.nombre}</h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{prod.descripcion}</p>
                                <p className="text-2xl font-bold text-orange-900">${prod.precio.toLocaleString()}</p>
                            </div>
                            <button
                                onClick={() => agregaAlCarrito(prod)}
                                className="mt-5 bg-orange-800 text-white py-2.5 rounded-lg font-semibold hover:bg-orange-900 transition-colors"
                            >
                                Agregar al Carrito
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* 2. RESUMEN DEL PEDIDO ÚNICO */}
            <aside className="md:col-span-1">
                <div className="border border-orange-100 p-6 rounded-2xl bg-white shadow-xl h-fit sticky top-6">
                    <h2 className="font-bold text-xl mb-6 text-orange-950 flex items-center justify-between">
                        🛒 Tu Pedido
                        <span className="bg-orange-100 text-orange-800 text-xs py-1 px-3 rounded-full">
                            {carrito.length}
                        </span>
                    </h2>

                    <div className="space-y-4 mb-6 max-h-[50vh] overflow-y-auto pr-2">
                        {carrito.length === 0 ? (
                            <p className="text-gray-400 text-center py-4 italic">El carrito está vacío</p>
                        ) : (
                            carrito.map(item => (
                                <div key={item.id} className="flex justify-between items-start border-b border-gray-50 pb-3">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-700 text-sm">{item.nombre}</span>
                                        <span className="text-gray-400 text-xs">Cant: {item.cantidad}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-gray-800 text-sm">
                                            ${(item.precio * item.cantidad).toLocaleString()}
                                        </span>
                                        <button
                                            onClick={() => eliminaDelCarrito(item.id)}
                                            className="text-red-400 hover:text-red-600 transition"
                                            title="Eliminar"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {carrito.length > 0 && (
                        <div className="pt-4 border-t border-gray-100 space-y-4">
                            <div className="flex justify-between items-center font-bold text-xl text-orange-950">
                                <span>Total:</span>
                                <span>${totalCompra.toLocaleString()}</span>
                            </div>

                            {/* BOTÓN CONECTADO A STRIPE */}
                            <button
                                onClick={() => iniciarPago(carrito)}
                                disabled={procesando}
                                className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all ${procesando
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                                    }`}

                            >
                                {procesando ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Cargando...
                                    </span>
                                ) : 'Pagar con Stripe'}
                            </button>

                            <button
                                onClick={vaciaCarrito}
                                className="w-full text-gray-400 text-xs hover:text-red-500 transition hover:underline"
                            >
                                Vaciar carrito completo
                            </button>
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
}
