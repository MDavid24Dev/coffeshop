"use client"
import { useProducto } from "@/hooks/useProductos";
import { useCarrito } from "@/hooks/useCarrito";
import { useStripe } from "@/hooks/useStripe";
import { useState, useEffect } from "react";
import { useVentaStripe } from "@/hooks/useVentaStripe";


export default function TiendaPage() {
    const { productos, loading } = useProducto();
    // hook del carrito
    const { carrito, agregaAlCarrito, totalCompra, vaciaCarrito, eliminaDelCarrito } = useCarrito();
    // Aquí usamos tu hook de Stripe
    const { iniciarPago, procesando } = useStripe();
    const [montado, setMontado] = useState(false);
    const { registrarPedidoCompleto } = useVentaStripe(vaciaCarrito); // aqui le decimos aqui esta registrar pedido dentro de este importado

    useEffect(() => {
        setMontado(true);
        const query = new URLSearchParams(window.location.search);
        const data = localStorage.getItem("carrito");
        const carritoReal = data ? JSON.parse(data) : [];

        const totalReal = carritoReal.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

        // CASO: PAGO EXITOSO
        if (query.get('success') && carritoReal.length > 0) {
            console.log("💰 Detectado éxito en Stripe. Procesando...");
            registrarPedidoCompleto(carritoReal, 'pagado', totalReal);
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        if (query.get('canceled')) {
            console.log("❌ Detectado pago cancelado.");
            registrarPedidoCompleto(carritoReal, 'cancelado', totalReal);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        // se monta solo para que no me traiga mas productos
    }, []);

    if (!montado) return null;

    return (
        <div className="min-h-screen bg-[#FFFDF9] py-8 px-4 sm:px-6 lg:px-8 selection:bg-amber-200">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* 1. SECCIÓN DE PRODUCTOS (Ocupa 8 columnas en pantallas grandes) */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex flex-col border-b border-gray-100 pb-4">
                            <h1 className="text-3xl font-extrabold text-[#2B1B17] tracking-tight">
                                Nuestro Menú
                            </h1>
                            <p className="text-sm font-medium text-gray-400 mt-1">
                                Selecciona tus productos favoritos para armar la orden
                            </p>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
                                <span className="text-4xl animate-bounce mb-3">☕</span>
                                <p className="text-amber-800 font-bold tracking-wide text-sm uppercase animate-pulse">
                                    Preparando el menú...
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {productos.map((prod) => (
                                    <div
                                        key={prod.id}
                                        className="bg-white border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col overflow-hidden group"
                                    >
                                        {/* 🖼️ IMAGEN DEL PRODUCTO (AQUÍ ESTÁ LA CORRECCIÓN CLAVE) */}
                                        <div className="relative aspect-video w-full bg-gray-50 overflow-hidden border-b border-gray-50">
                                            {prod.imagen_url ? (
                                                <img
                                                    // Optimizamos la entrega inyectando de Cloudinary
                                                    src={prod.imagen_url.includes('/upload/')
                                                        ? prod.imagen_url.replace('/upload/', '/upload/w_400,h_250,c_fill,g_auto/')
                                                        : prod.imagen_url
                                                    }
                                                    alt={prod.nombre}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-amber-50/50 text-gray-400">
                                                    <span className="text-2xl opacity-60">🍰</span>
                                                    <span className="text-[10px] uppercase font-bold tracking-wider mt-1 text-gray-400">Sin Imagen</span>
                                                </div>
                                            )}

                                            {/* Badge de precio flotante estético */}
                                            <div className="absolute bottom-3 right-3 bg-[#2B1B17] text-[#FFC554] text-sm font-black px-3 py-1.5 rounded-xl shadow-md">
                                                ${prod.precio.toLocaleString()}
                                            </div>
                                        </div>

                                        {/* Contenido de la Tarjeta */}
                                        <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                                            <div className="space-y-1">
                                                <h3 className="font-bold text-gray-900 text-base group-hover:text-amber-800 transition-colors">
                                                    {prod.nombre}
                                                </h3>
                                                <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 font-medium">
                                                    {prod.descripcion || "Sin descripción disponible de momento."}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => agregaAlCarrito(prod)}
                                                className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.98]"
                                            >
                                                + Agregar al Carrito
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 2. RESUMEN DEL PEDIDO FIJO (Ocupa 4 columnas en pantallas grandes) */}
                    <aside className="lg:col-span-4 lg:sticky lg:top-8">
                        <div className="border border-gray-100 p-6 rounded-[28px] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col">
                            <h2 className="font-extrabold text-lg text-[#2B1B17] tracking-tight mb-5 flex items-center justify-between">
                                <span className="flex items-center gap-2">🛒 Tu Pedido</span>
                                <span className="bg-[#FFC554] text-gray-900 text-xs font-black py-1 px-2.5 rounded-xl min-w-6 text-center">
                                    {/* Sumamos las cantidades reales usando un fallback por seguridad */}
                                    {carrito && carrito.length > 0
                                        ? carrito.reduce((acc, item) => acc + (item.cantidad || 1), 0)
                                        : 0
                                    }
                                </span>
                            </h2>

                            {/* Listado de Items con scroll interno fino */}
                            <div className="space-y-3 mb-5 max-h-[40vh] overflow-y-auto pr-1 divide-y divide-gray-50">
                                {!carrito || carrito.length === 0 ? (
                                    <div className="text-center py-10 space-y-2">
                                        <span className="text-2xl block opacity-40">🛍️</span>
                                        <p className="text-gray-400 text-xs font-medium italic">El carrito está vacío</p>
                                    </div>
                                ) : (
                                    carrito.map((item) => {
                                        // 💡 CONTROL DE SEGURIDAD: Si por algún motivo las propiedades vienen dentro de un objeto anidado
                                        const id = item.id;
                                        const nombre = item.nombre || "Producto sin nombre";
                                        const precio = item.precio || 0;
                                        const cantidad = item.cantidad || 1;

                                        return (
                                            <div key={id} className="flex justify-between items-center pt-3 first:border-none first:pt-0">
                                                <div className="flex flex-col gap-0.5 max-w-[60%]">
                                                    <span className="font-bold text-gray-800 text-sm truncate">{nombre}</span>
                                                    <span className="text-gray-400 text-xs font-semibold">
                                                        Cantidad: <span className="text-gray-600">{cantidad}</span>
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-black text-gray-800 text-sm">
                                                        ${(precio * cantidad).toLocaleString()}
                                                    </span>
                                                    <button
                                                        onClick={() => eliminaDelCarrito(id)}
                                                        className="w-6 h-6 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 font-bold flex items-center justify-center text-xs transition"
                                                        title="Eliminar ítem"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Totales y Botón de Pago */}
                            {carrito && carrito.length > 0 && (
                                <div className="pt-4 border-t border-gray-100 space-y-4">
                                    <div className="flex justify-between items-center text-[#2B1B17]">
                                        <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Cuenta:</span>
                                        <span className="text-2xl font-black">
                                            ${(typeof totalCompra !== 'undefined' ? totalCompra : 0).toLocaleString()}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => iniciarPago(carrito)}
                                        disabled={procesando}
                                        className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider text-white shadow-md shadow-amber-900/5 transition-all active:scale-[0.98]
                                         ${procesando
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                                : 'bg-[#2B1B17] hover:bg-[#422a24]'
                                            }`}
                                    >
                                        {procesando ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Procesando...
                                            </span>
                                        ) : (
                                            '🚀 Validar Pedido y Pagar'
                                        )}
                                    </button>

                                    <button
                                        onClick={vaciaCarrito}
                                        className="w-full text-center text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-red-500 transition hover:underline"
                                    >
                                        Vaciar carrito completo
                                    </button>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

{/**  // Ahora recibe 'carritoParaDescontar' como parámetro
const registrarPedidoEstado = async (carritoParaDescontar, estadoFinal) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Insertamos el pedido en la base de datos
    const { data: pedido, error } = await supabase
        .from('pedido')
        .insert([{
            usuario_id: user.id,
            estado: estadoFinal,
            total: totalCompra
        }])
        .select()
        .single();

    if (error) return console.error("Error en Supabase:", error);

    // 2. Lógica condicional según el estado
    if (estadoFinal === 'pagado') {
        // Solo descontamos si el pago fue exitoso
        for (const item of carritoParaDescontar) {
            // Traemos el stock actual para evitar errores
            const { data: producto } = await supabase
                .from('productos')
                .select('stock')
                .eq('id', item.id)
                .single();

            if (producto) {
                await supabase
                    .from('productos')
                    .update({ stock: producto.stock - item.cantidad })
                    .eq('id', item.id);
            }
        }
        
        vaciaCarrito();
        localStorage.removeItem("carrito"); // Limpieza total
        alert("✅ ¡Venta confirmada! El stock ha sido actualizado en CoffeShop.");
    } else {
        // Si fue cancelado, solo avisamos al usuario
        alert("❌ El pago fue cancelado. El pedido se registró como NO PAGADO.");
    }
}; */}