const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const ordersFile = "orders.json";
const historyFile = "history.json";

// Read orders from file
const readOrders = () => {
    try {
        return JSON.parse(fs.readFileSync(ordersFile, "utf8"));
    } catch (error) {
        return [];
    }
};

// Save orders to file
const saveOrders = (orders) => {
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
};

// Read order history
const readHistory = () => {
    try {
        return JSON.parse(fs.readFileSync(historyFile, "utf8"));
    } catch (error) {
        return [];
    }
};

// Save order history
const saveHistory = (history) => {
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
};

// Get all orders
app.get("/orders", (req, res) => {
    res.json(readOrders());
});

// Place a new order
app.post("/order", (req, res) => {
    const newOrder = req.body;
    if (!newOrder || !newOrder.name || !newOrder.items) {
        return res.status(400).json({ error: "Invalid order format" });
    }

    let orders = readOrders();
    orders.push(newOrder);
    saveOrders(orders);

    console.log("✅ New Order Received:", newOrder);
    res.json({ message: "Order placed successfully!" });
});

// Move order to history
app.post("/complete-order/:index", (req, res) => {
    let orders = readOrders();
    const index = parseInt(req.params.index);

    if (isNaN(index) || index < 0 || index >= orders.length) {
        return res.status(400).json({ error: "Invalid order index" });
    }

    const completedOrder = orders.splice(index, 1)[0];

    let history = readHistory();
    history.push(completedOrder);

    saveHistory(history);
    saveOrders(orders);

    console.log("✅ Order moved to history:", completedOrder);
    res.json({ message: "Order moved to history!" });
});

// Get order history
app.get("/history", (req, res) => {
    res.json(readHistory());
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
