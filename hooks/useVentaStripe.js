import { supabase } from "@/lib/supabase";

export const useVentaStripe = ( vaciarCarrito) => {
    const registrarPedidoCompleto = async (carritoReal, estadoFinal,totalCalculado) => {
        
    console.group("🚀 MOTOR DE VENTAS: DIAGNÓSTICO");
    console.log("📦 Carrito recibido:", carritoReal);
    console.log("💰 Total recibido:", totalCalculado);
    console.log("🏁 Estado Stripe:", estadoFinal);
        
        // Diagnóstico inicial
        if (!carritoReal || carritoReal.length === 0) {
            console.error("Error: El carrito llegó vacío al motor de ventas.");
            return;
        }

        try {
            //USUARIO AUTENTICADO CON SUPABASE
            const { data: { user }, error: authError } = await supabase.auth.getUser();
           
            //VALIDACION DE USUARIO
            if (authError || !user) {
                console.error("👤 ERROR AUTH:", authError?.message || "Sin sesión");
                throw new Error("Usuario no autenticado")
            };
            console.log("👤 Usuario detectado:", user.email);
            //--------------------------------------------------------------
            
            console.log("⏳ Intentando insertar en tabla 'pedido'...");
            // 1. INSERTAR PEDIDO en tabla pedidos
            const { data: pedido, error: errorPedido } = await supabase
                .from('pedido')
                .insert([{
                    usuario_id: user.id,
                    estado: estadoFinal,
                    total: totalCalculado
                }])
                .select().single();

            if (errorPedido) {
                console.error("❌ Error en tabla 'pedido':", errorPedido.message);
                throw errorPedido;
            }
            console.log("✅ Pedido creado con ID:", pedido.id);

            //---------------------------------------------------------------
            
            //REGISTRAR EN COMPRAS
            if(pedido && estadoFinal === "pagado"){
               const query = new URLSearchParams(window.location.search); 
               // para consultar antes de que se cierre la ventana
               const sesionId = query.get('session_id'); 
               // saber que usuario hizo la compra
               await supabase.from ('compras').insert ([
                {
                    pedido_id: pedido.id,
                    metodo_pago: 'Card',
                    estado_pago: 'pagado',
                    referencia_pago: sesionId || 'pago_stripe_manual',
                }
            ]);
             console.log("Ya quedo resgitrado la compra ");
            }

            //--------------------------------------------------------------
            // 2. SOLO SI ESTÁ PAGADO -> FACTURA Y STOCK
            if (estadoFinal === 'pagado') {
                console.log("💳 Pago confirmado. Procesando Factura y Stock...");
                // Mapeo de datos para la tabla 'factura'
                const itemsFactura = carritoReal.map(item => ({
                    pedido_id: pedido.id,
                    producto_id: item.id,
                    cantidad: item.cantidad,
                    subtotal: item.precio * item.cantidad
                }));

                console.table(itemsFactura);
                console.log("⏳ Enviando a tabla 'factura'...");           

                // Inserción en Factura
                const { error: errorFactura } = await supabase
                    .from('factura')
                    .insert(itemsFactura);

                if (errorFactura) {
                    console.error("❌ Error en tabla 'factura':", errorFactura.message);
                    throw errorFactura;
                }

                console.log("✅ Factura guardada correctamente.");
             //--------------------------------------------------------------------------------------------
                // 3. ACTUALIZAR STOCK (Uno por uno)
                console.log("🔄 Actualizando inventario...");
                for (const item of carritoReal) {
                    const { data: prod } = await supabase
                        .from('productos')
                        .select('stock')
                        .eq('id', item.id)
                        .single();

                    if (prod) {
                        const { error: errorStock } = await supabase
                            .from('productos')
                            .update({ stock: prod.stock - item.cantidad })
                            .eq('id', item.id);
                        
                        if (errorStock) console.error("Error stock producto:", item.id, errorStock.message);
                    }
                }
            //--------------------------------------------------------------------------------------------------
                // LIMPIEZA FINAL
                vaciarCarrito();
                localStorage.removeItem("carrito");
                alert("✅ ¡Éxito! Venta guardada y stock actualizado.");

            } else {
                alert("⚠️ El pago fue registrado como cancelado.");
            }

        //---------------------------------------------------------------

        } catch (error) {
            console.error("🔥 FALLO CRÍTICO:", error.message);
            alert("Error: " + error.message);
        }
    };

    return { registrarPedidoCompleto };
};