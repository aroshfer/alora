// Stand-in for a real payment processor call (e.g. Stripe PaymentIntents).
// It only ever receives a payment method's opaque token — never a card
// number or CVV, which by this point in the flow have never existed
// anywhere outside the customer's browser for even a moment.
//
// To go live: replace the body of this function with a real call, e.g.
//   const intent = await stripe.paymentIntents.create({
//     amount: amountInCents, currency: "lkr", payment_method: token,
//     confirm: true,
//   });
// and surface intent.status / decline reasons instead of always succeeding.

export async function authorizeCharge({ token, amount }) {
  if (!token) {
    return { success: false, reason: "Missing payment token." };
  }
  if (amount <= 0) {
    return { success: false, reason: "Invalid charge amount." };
  }

  // Simulate network latency of a real processor call.
  await new Promise((resolve) => setTimeout(resolve, 400));

  return { success: true, authorizationId: `mock_auth_${Date.now()}` };
}
