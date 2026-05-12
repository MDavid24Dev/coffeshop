import { 
    getUsuarioActual, 
    insertarPedido, 
    registrarCompra, 
    Factura, 
    descontarStock 
} from "@/services/ventas/ventas.js";

export const useVentaStripe = (vaciarCarrito) => {

    const registrarPedidoCompleto = async (carritoReal, estadoFinal, totalCalculado) => {
        if (!carritoReal?.length) return;

        try {
            // Pasos lógicos separados y digeribles
            const user = await getUsuarioActual();
            const pedido = await insertarPedido(user.id, estadoFinal, totalCalculado);

            if (estadoFinal === 'pagado') {
                const query = new URLSearchParams(window.location.search);
                const sesionId = query.get('session_id');

                // Ejecución de subtareas
                await registrarCompra(pedido.id, sesionId);
                await Factura(pedido.id, carritoReal);
                await descontarStock(carritoReal);

                // Finalización
                finalizarVenta();
            }
        } catch (error) {
            manejarError(error);
        }
    };

    // Funciones de soporte internas para no ensuciar el flujo principal
    const finalizarVenta = () => {
        vaciarCarrito();
        localStorage.removeItem("carrito");
        alert("✅ Venta procesada correctamente.");
    };

    const manejarError = (error) => {
        console.error("❌ Error en el motor de ventas:", error.message);
        alert("Hubo un problema: " + error.message);
    };

    return { registrarPedidoCompleto };
};