

import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        const { items } = await request.json();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: items,
            mode: "payment",
            success_url: `${request.headers.get("origin")}/tienda?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.headers.get("origin")}/tienda?canceled=true`,
        });

        // MANERA DIFERENTE: En lugar de JSON, devolvemos la URL para que el front la use
        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("ERROR:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}