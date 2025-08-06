import express from 'express';
import cors from 'cors';
import path from 'path';
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from './paypal';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// PayPal Routes
app.get("/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
});

app.post("/paypal/order", async (req, res) => {
  // Request body should contain: { intent, amount, currency }
  await createPaypalOrder(req, res);
});

app.post("/paypal/order/:orderID/capture", async (req, res) => {
  await capturePaypalOrder(req, res);
});

// Bank Transfer Route
app.post("/bank-transfer", (req, res) => {
  const { amount, currency, orderDetails } = req.body;
  
  // In a real implementation, you would:
  // 1. Generate a unique order ID
  // 2. Store order details in database
  // 3. Send bank transfer instructions to customer
  
  const orderId = 'BT-' + Date.now();
  
  res.json({
    success: true,
    orderId: orderId,
    message: "Bank transfer order created successfully",
    bankDetails: {
      accountName: "Discobeak Ltd",
      accountNumber: "12345678",
      routingNumber: "987654321",
      bankName: "Disco Bank",
      reference: orderId,
      amount: amount,
      currency: currency
    }
  });
});

// Checkout confirmation
app.post("/checkout/confirm", (req, res) => {
  const { orderId, paymentMethod, items, total, customerInfo } = req.body;
  
  // In a real implementation, you would:
  // 1. Validate the order
  // 2. Store in database
  // 3. Send confirmation email
  // 4. Update inventory
  
  res.json({
    success: true,
    orderId: orderId,
    message: "Order confirmed successfully",
    estimatedDelivery: "5-7 business days"
  });
});

// Cart endpoints
app.post("/cart/add", (req, res) => {
  const { productId, quantity, size, color } = req.body;
  
  // In a real implementation, this would be stored in session/database
  res.json({
    success: true,
    message: "Item added to cart",
    cartTotal: 1 // This would be calculated from actual cart
  });
});

app.get("/cart", (req, res) => {
  // In a real implementation, this would fetch from session/database
  res.json({
    items: [],
    total: 0,
    currency: "USD"
  });
});

// Serve static files and handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🦆 Discobeak server running on port ${PORT}`);
  });
}

export default app;