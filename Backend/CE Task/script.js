let products = [
    { id: 1, name: "Headphones", category: "Electronics", price: 1500 },
    { id: 2, name: "Smart Watch", category: "Electronics", price: 2200 },
    { id: 3, name: "T-Shirt", category: "Fashion", price: 600 },
    { id: 4, name: "Shoes", category: "Fashion", price: 1800 },
    { id: 5, name: "Sunglasses", category: "Accessories", price: 500 },
    { id: 6, name: "Backpack", category: "Accessories", price: 900 }
];

let cart = [];
let coupon = "";

function showProducts() {
    let category = document.getElementById("category").value;
    let sort = document.getElementById("sort").value;

    let list = products.filter(function(product) {
        return category === "All" || product.category === category;
    });

    if (sort === "low") {
        list.sort(function(a, b) {
            return a.price - b.price;
        });
    } else if (sort === "high") {
        list.sort(function(a, b) {
            return b.price - a.price;
        });
    }

    let output = "";

    for (let i = 0; i < list.length; i++) {
        output += `
            <div class="product">
                <h3>${list[i].name}</h3>
                <p>${list[i].category}</p>
                <p class="price">₹${list[i].price}</p>
                <button onclick="addToCart(${list[i].id})">Add to Cart</button>
            </div>
        `;
    }

    document.getElementById("productList").innerHTML = output;
}

function animateCartButton() {
    let button = document.getElementById("cartButton");

    button.classList.remove("added");
    void button.offsetWidth;
    button.classList.add("added");
}

function addToCart(id) {
    let found = false;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart[i].quantity++;
            found = true;
            break;
        }
    }

    if (!found) {
        let product = products.find(function(item) {
            return item.id === id;
        });

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    showCart();
    animateCartButton();
}

function removeItem(id) {
    cart = cart.filter(function(item) {
        return item.id !== id;
    });

    showCart();
}

function changeQuantity(id, amount) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart[i].quantity += amount;

            if (cart[i].quantity <= 0) {
                removeItem(id);
                return;
            }

            break;
        }
    }

    showCart();
}

function clearCart() {
    cart = [];
    coupon = "";

    document.getElementById("coupon").value = "";
    document.getElementById("message").innerText = "";
    document.getElementById("checkoutBox").hidden = true;
    document.getElementById("result").innerText = "";

    showCart();
}

function showCart() {
    let output = "";
    let subtotal = 0;
    let count = 0;

    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        let itemTotal = item.price * item.quantity;

        subtotal += itemTotal;
        count += item.quantity;

        output += `
            <div class="cartItem">
                <p><strong>${item.name}</strong></p>
                <p>₹${item.price} x ${item.quantity} = ₹${itemTotal}</p>
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                ${item.quantity}
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
                <button class="remove" onclick="removeItem(${item.id})">Remove</button>
            </div>
        `;
    }

    if (cart.length === 0) {
        output = "Your cart is empty.";
    }

    let discountAmount = 0;

    if (coupon === "SAVE10") {
        discountAmount = subtotal * 0.10;
    } else if (coupon === "SAVE20" && subtotal >= 2000) {
        discountAmount = subtotal * 0.20;
    }

    let total = subtotal - discountAmount;

    document.getElementById("cartItems").innerHTML = output;
    document.getElementById("cartCount").innerText = count;
    document.getElementById("itemCount").innerText = count;
    document.getElementById("subtotal").innerText = subtotal.toFixed(2);
    document.getElementById("discount").innerText = discountAmount.toFixed(2);
    document.getElementById("total").innerText = total.toFixed(2);

    document.getElementById("checkout").disabled = cart.length === 0;
    document.getElementById("clearCart").disabled = cart.length === 0;

    if (coupon === "SAVE20" && subtotal < 2000) {
        document.getElementById("message").innerText =
            "SAVE20 requires a minimum purchase of ₹2000.";
    }
}

document.getElementById("category").addEventListener("change", showProducts);
document.getElementById("sort").addEventListener("change", showProducts);

document.getElementById("cartButton").addEventListener("click", function() {
    document.getElementById("cartPopup").classList.add("open");
    document.getElementById("overlay").classList.add("open");
});

function closeCart() {
    document.getElementById("cartPopup").classList.remove("open");
    document.getElementById("overlay").classList.remove("open");
}

document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("overlay").addEventListener("click", closeCart);
document.getElementById("clearCart").addEventListener("click", clearCart);

document.getElementById("apply").addEventListener("click", function() {
    let code = document.getElementById("coupon").value.trim().toUpperCase();
    let subtotal = 0;

    for (let i = 0; i < cart.length; i++) {
        subtotal += cart[i].price * cart[i].quantity;
    }

    if (subtotal === 0) {
        coupon = "";
        document.getElementById("message").innerText =
            "Add products to the cart first.";
    } else if (code === "SAVE10") {
        coupon = code;
        document.getElementById("message").innerText =
            "10% discount applied.";
    } else if (code === "SAVE20" && subtotal >= 2000) {
        coupon = code;
        document.getElementById("message").innerText =
            "20% discount applied.";
    } else {
        coupon = "";

        if (code === "SAVE20") {
            document.getElementById("message").innerText =
                "Minimum purchase of ₹2000 required.";
        } else {
            document.getElementById("message").innerText =
                "Invalid coupon code.";
        }
    }

    showCart();
});

document.getElementById("checkout").addEventListener("click", function() {
    if (cart.length > 0) {
        document.getElementById("checkoutBox").hidden = false;
    }
});

document.getElementById("checkoutForm").addEventListener("submit", function(event) {
    event.preventDefault();

    if (cart.length === 0) {
        return;
    }

    document.getElementById("result").innerText =
        "Order placed successfully! (Demo only)";

    cart = [];
    coupon = "";

    document.getElementById("coupon").value = "";
    document.getElementById("message").innerText = "";

    showCart();
    document.getElementById("checkoutForm").reset();
});

showProducts();
showCart();