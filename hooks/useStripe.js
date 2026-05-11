import { useState } from 'react';

export const useStripe = () => {
    const [procesando, setProcesando] = useState(false);

    const iniciarPago = async (carrito) => {
        setProcesando(true);
        try {
            const itemsParaStripe = carrito.map(item => ({
                price_data: {
                    currency: 'cop',
                    product_data: {
                        name: item.nombre,
                        description: item.descripcion && item.descripcion.trim() !== ""
                            ? item.descripcion
                            : "Producto de la tienda",
                    },
                    unit_amount: Math.round(item.precio * 100),
                },
                quantity: item.cantidad,
            }));

            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: itemsParaStripe }),
            });

            const data = await res.json();

            if (data.url) {
                // Esto es lo que hace que la pantalla cambie sí o sí
                window.location.assign(data.url);
            } else {
                alert("El servidor no devolvió una URL válida de Stripe");
            }

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Error en el servidor");
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Error: " + error.message);
        } finally {
            setProcesando(false);
        }
    };

    return { iniciarPago, procesando };
};