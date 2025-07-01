import { Router } from "express"
import Stripe from "stripe"
const payRouter = Router()
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
payRouter.post("/create-checkout-session", async (req, res) => {
    const { amount, bookingDetails, bookingType } = req.body;
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'Your Booking Title Here',
                            description: 'Details about the booking...',
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/payment-cancelled`,
            metadata: {
                amount,
                bookingType,
                bookingDetails: JSON.stringify(bookingDetails),
            },
        });
        res.json({ id: session.id });
    } catch (err) {
        console.error('Stripe session error:', err);
        res.status(500).json({ error: 'Stripe error' });
    }
})

payRouter.get("/get-booking-type", async (req, res) => {
    try {
        const { session_id } = req.query;
        const session = await stripe.checkout.sessions.retrieve(session_id);
        const bookingType = session?.metadata?.bookingType;
        if (!bookingType) return res.status(400).json({ error: "Booking type not found in session metadata" });
        res.json({ bookingType });
    } catch (err) {
        console.error("Error retrieving session:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
})

export default payRouter