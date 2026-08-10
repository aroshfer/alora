import { Router } from "express";
import { v4 as uuid } from "uuid";
import { db, findUserById, toSafeUser } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { CATALOG } from "../catalog.js";
import { authorizeCharge } from "../utils/paymentGateway.js";

const router = Router();
router.use(requireAuth);

const SHIPPING_FLAT_RATE = 450; // LKR — flat rate for this demo

router.post("/", async (req, res) => {
  const { items, addressId, paymentMethodId } = req.body ?? {};
  const user = findUserById(req.user.id);

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Your cart is empty." });
  }

  const address = user.addresses.find((a) => a.id === addressId);
  if (!address) return res.status(400).json({ error: "Select a valid shipping address." });

  const paymentMethod = user.paymentMethods.find((m) => m.id === paymentMethodId);
  if (!paymentMethod) return res.status(400).json({ error: "Select a valid payment method." });

  // Rebuild the order line-by-line from the server's own catalog. The
  // client's product name/price/qty in `items` is only used for the
  // product id and quantity — price and name always come from CATALOG,
  // so a tampered request can't change what's actually charged.
  const orderItems = [];
  for (const raw of items) {
    const productId = Number(raw?.id);
    const qty = Number(raw?.qty);
    const product = CATALOG[productId];

    if (!product) return res.status(400).json({ error: `Unknown product in cart (id ${productId}).` });
    if (product.soldOut) return res.status(409).json({ error: `"${product.name}" is sold out.` });
    if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
      return res.status(400).json({ error: `Invalid quantity for "${product.name}".` });
    }

    orderItems.push({ productId, name: product.name, price: product.price, qty });
  }

  const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const total = subtotal + SHIPPING_FLAT_RATE;

  const authResult = await authorizeCharge({ token: paymentMethod.token, amount: total });
  if (!authResult.success) {
    return res.status(402).json({ error: `Payment declined: ${authResult.reason}` });
  }

  const order = {
    id: uuid(),
    userId: user.id,
    items: orderItems,
    subtotal,
    shipping: SHIPPING_FLAT_RATE,
    total,
    shippingAddress: { ...address },
    paymentSummary: { brand: paymentMethod.brand, last4: paymentMethod.last4 },
    authorizationId: authResult.authorizationId,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  db.data.orders.push(order);
  await db.write();

  res.status(201).json({ order });
});

router.get("/", (req, res) => {
  const orders = db.data.orders
    .filter((o) => o.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ orders });
});

router.get("/:id", (req, res) => {
  const order = db.data.orders.find((o) => o.id === req.params.id && o.userId === req.user.id);
  if (!order) return res.status(404).json({ error: "Order not found." });
  res.json({ order });
});

export default router;
