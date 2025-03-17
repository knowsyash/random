document.getElementById('orderForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    let selectedItems = [];
    document.querySelectorAll('.menu-item input[type="checkbox"]:checked').forEach(item => {
        let quantity = item.nextElementSibling.value;
        selectedItems.push({ name: item.value, quantity: quantity, price: item.dataset.price });
    });

    let phone = document.getElementById('phone').value;

    if (selectedItems.length === 0) {
        alert("Please select at least one item!");
        return;
    }

    let orderDetails = {
        items: selectedItems,
        phone: phone
    };

    let response = await fetch('http://localhost:5000/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails)
    });

    let result = await response.json();
    if (result.success) {
        alert("Order placed successfully!");
    } else {
        alert("Something went wrong!");
    }
});
