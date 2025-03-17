const backendURL = "http://localhost:5000"; // Update this after deploying backend

// 🔹 Function to place an order (User Page)
function placeOrder() {
    const quantity = document.getElementById("quantity").value;
    const phone = document.getElementById("phone").value;

    if (quantity <= 0 || phone.trim() === "") {
        alert("Please enter a valid quantity and phone number!");
        return;
    }

    const order = {
        item: "Pizza",
        quantity: parseInt(quantity),
        phone: phone
    };

    fetch(`${backendURL}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        console.log("✅ Order Submitted:", order);
    })
    .catch(error => console.error("❌ Error placing order:", error));
}

// 🔹 Function to fetch orders (Admin Page)
function fetchOrders() {
    fetch(`${backendURL}/orders`)
    .then(response => response.json())
    .then(data => {
        let ordersHTML = "<h2>Orders List</h2>";
        if (data.length === 0) {
            ordersHTML += "<p>No orders yet.</p>";
        } else {
            data.forEach((order, index) => {
                ordersHTML += `
                    <div class="order">
                        <input type="checkbox" id="order-${index}" onchange="handleOrderSelection(${index})">
                        <label for="order-${index}"><strong>Order ${index + 1}</strong></label>
                        <p>Item: ${order.item}</p>
                        <p>Quantity: ${order.quantity}</p>
                        <p>Phone: ${order.phone}</p>
                    </div>
                `;
            });
        }
        document.getElementById("orders").innerHTML = ordersHTML;
    })
    .catch(error => console.error("❌ Error fetching orders:", error));
}

// 🔹 Function to handle checkbox selection (Admin Page)
function handleOrderSelection(orderIndex) {
    const checkbox = document.getElementById(`order-${orderIndex}`);
    if (checkbox.checked) {
        markAsCompleted(orderIndex);
    }
}

// 🔹 Function to mark an order as completed (Moves to History Page)
function markAsCompleted(orderIndex) {
    fetch(`${backendURL}/complete-order/${orderIndex}`, {
        method: "POST"
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        console.log("✅ Order marked as completed:", data);
        fetchOrders(); // Refresh order list after marking completed
    })
    .catch(error => console.error("❌ Error marking order as completed:", error));
}

// 🔹 Function to fetch order history (History Page)
function fetchHistory() {
    fetch(`${backendURL}/history`)
    .then(response => response.json())
    .then(data => {
        let historyHTML = "<h2>Completed Orders</h2>";
        if (data.length === 0) {
            historyHTML += "<p>No completed orders.</p>";
        } else {
            data.forEach((order, index) => {
                historyHTML += `
                    <div class="order">
                        <p><strong>Completed Order ${index + 1}</strong></p>
                        <p>Item: ${order.item}</p>
                        <p>Quantity: ${order.quantity}</p>
                        <p>Phone: ${order.phone}</p>
                    </div>
                `;
            });
        }
        document.getElementById("history").innerHTML = historyHTML;
    })
    .catch(error => console.error("❌ Error fetching history:", error));
}
