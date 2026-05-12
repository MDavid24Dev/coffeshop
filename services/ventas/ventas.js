// Servicio Atomicos que se usan en todo el Inicio use client

import { supabase } from "@/lib/supabase"; // conexion a supabase db

//funcion que valida si hay usuario actual en sesion
export const getUsuarioActual = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        console.error("👤 ERROR AUTH:", authError?.message || "Sin sesión");
        throw new Error("Usuario no autenticado")
    };
    console.log("👤 Usuario detectado:", user.email);
    return user;
};

// funcion de insertarPedido
export const insertarPedido = async (usuarioId, estado, total) => {
    const { data, error } = await supabase.from('pedido')
        .insert([{ usuario_id: usuarioId, estado, total }])
        .select().single();
    if (error) throw error;
    return data;
}

// funcion de registrar compra
export const registrarCompra = async (pedidoId, referencia) => {
    const { error } = await supabase.from('compras').insert([{
        pedido_id: pedidoId,
        metodo_pago: 'Card',
        estado_pago: 'pagado',
        referencia_pago: referencia || 'pago_stripe_manual',
    }]);
    if (error) throw error;
};

//funcion de Factura
export const Factura = async (pedidoId, carrito) => {
    const items = carrito.map(item => ({
        pedido_id: pedidoId,
        producto_id: item.id,
        cantidad: item.cantidad,
        subtotal: item.precio * item.cantidad
    }));
    const { error } = await supabase.from('factura').insert(items);
    if (error) throw error;
};

// funcion de descontar STOCK productos por carrito 🛒
export const descontarStock = async (carrito) => {
    // Usamos Promise.all para que sea ultra veloz
    const promesas = carrito.map(async (item) => {
        const { data: prod } = await supabase.from('productos')
            .select('stock').eq('id', item.id).single();
        if (prod) {
            return supabase.from('productos')
                .update({ stock: prod.stock - item.cantidad })
                .eq('id', item.id);
        }
    });
    return Promise.all(promesas);
};