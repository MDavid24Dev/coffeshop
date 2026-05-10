"use client"
import { useProducto } from "@/hooks/useProductos";
import { useCarrito } from "@/hooks/useCarrito";

export default function TiendaPage() {
    const { productos, loading } = useProducto();
    const { carrito, agregaAlCarrito, totalCompra, vaciaCarrito, eliminaDelCarrito } = useCarrito();

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
           
            {/* 1. SECCIÓN DE PRODUCTOS (3 columnas) */}
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? <p>Cargando menú...</p> : productos.map((prod) => (
                    <div key={prod.id} className="border p-4 rounded-lg shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-lg">{prod.nombre}</h3>
                            <p className="text-gray-500 text-sm mb-2">{prod.descripcion}</p>
                            <p className="text-xl font-bold text-orange-900">${prod.precio.toLocaleString()}</p>
                        </div>
                        <button
                            onClick={() => agregaAlCarrito(prod)}
                            className="mt-4 bg-orange-800 text-white py-2 rounded hover:bg-orange-900"
                        >
                            Agregar al Carrito
                        </button>
                    </div>
                ))}
            </div>

            {/* 2. RESUMEN DEL CARRITO (1 columna) */}
            <aside className="border p-4 rounded-lg bg-gray-50 h-fit sticky top-4">
                <h2 className="font-bold text-xl mb-4">🛒 Carrito ({carrito.length})</h2>
                <div className="space-y-2 mb-4">
                    {carrito.map(item => (
                        <div key={item.id} className="flex justify-between text-sm border-b pb-1">
                            <span>{item.cantidad}x {item.nombre}</span>
                            <span className="font-semibold">${(item.precio * item.cantidad).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>${totalCompra.toLocaleString()}</span>
                </div>
                <button
                    disabled={carrito.length === 0}
                    className="w-full mt-4 bg-green-700 text-white py-3 rounded-lg font-bold disabled:bg-gray-300"
                >
                    Pagar Ahora
                </button>
            </aside>

            {/*3. PEDIDO*/}
            <aside className="border p-4 rounded-lg bg-gray-50 h-fit sticky top-4">
                <h2 className="font-bold text-xl mb-4">🛒 Tu Pedido ({carrito.length})</h2>

                <div className="space-y-3 mb-4">
                    {carrito.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm border-b pb-2">
                            <div className="flex flex-col">
                                <span className="font-medium">{item.nombre}</span>
                                <span className="text-gray-500 text-xs">Cant: {item.cantidad}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="font-semibold">${(item.precio * item.cantidad).toLocaleString()}</span>

                                {/* BOTÓN PARA QUITAR: Aquí conectamos tu función */}
                                <button
                                    onClick={() => eliminaDelCarrito(item.id)}
                                    className="text-red-500 hover:text-red-700 font-bold text-lg p-1"
                                    title="Quitar producto"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {carrito.length > 0 && (
                    <div className="border-t pt-2">
                        <div className="flex justify-between font-bold text-lg mb-4">
                            <span>Total:</span>
                            <span>${totalCompra.toLocaleString()}</span>
                        </div>

                        <button
                            className="w-full bg-green-700 text-white py-3 rounded-lg font-bold hover:bg-green-800 transition"
                        >
                            Pagar Ahora
                        </button>

                        {/* BOTÓN PARA VACIAR TODO */}
                        <button
                            onClick={vaciaCarrito}
                            className="w-full mt-2 text-gray-400 text-xs hover:underline"
                        >
                            Vaciar carrito
                        </button>
                    </div>
                )}
            </aside>

        </div>
    );
}