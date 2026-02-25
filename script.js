// 1. Variáveis e Seletores
let cart = [];
const cartCount = document.getElementById('cart-count');
const cartTotalHeader = document.getElementById('cart-total-header');
const cartTotalFooter = document.getElementById('cart-total-footer');
const cartItemsList = document.getElementById('cart-items-list');
const checkoutBtn = document.getElementById('checkout-btn');
const neighborhoodSelect = document.getElementById('client-neighborhood');

// 2. Eventos
neighborhoodSelect.addEventListener('change', updateCart);

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, quantity: 1 });
        }
        updateCart();
    });
});

// 3. Função para mudar quantidade (+ ou -)
window.changeQuantity = (index, delta) => {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1); // Remove se chegar a zero
    }
    updateCart();
};

// 4. Atualizar interface do carrinho
function updateCart() {
    cartItemsList.innerHTML = '';
    let totalProdutos = 0;

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        totalProdutos += subtotal;

        const li = document.createElement('li');
        li.className = 'cart-item-container';
        li.innerHTML = `
            <div style="flex: 1; color: white;">
                <strong>${item.name}</strong><br>
                <small>R$ ${item.price.toFixed(2)} un.</small>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
                <span style="color: white; font-weight: bold;">${item.quantity}</span>
                <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
                <span style="color: #ffd700; margin-left: 10px; min-width: 80px; text-align: right;">
                    R$ ${subtotal.toFixed(2)}
                </span>
            </div>
        `;
        cartItemsList.appendChild(li);
    });

    const selectedOption = neighborhoodSelect.options[neighborhoodSelect.selectedIndex];
    const deliveryFee = parseFloat(selectedOption.getAttribute('data-fee') || 0);
    const totalGeral = totalProdutos + deliveryFee;

    cartCount.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartTotalHeader.innerText = totalProdutos.toFixed(2);
    cartTotalFooter.innerText = totalGeral.toFixed(2);
}

// 5. Finalizar Pedido
checkoutBtn.addEventListener('click', () => {
    const name = document.getElementById('client-name').value;
    const neighborhood = neighborhoodSelect.value;
    const street = document.getElementById('client-street').value;
    const payment = document.getElementById('payment-method').value;

    if (cart.length === 0 || !name || !neighborhood || !street || !payment) {
        alert("Preencha todos os dados e adicione itens ao carrinho!");
        return;
    }

    let message = "🤖 *PEDIDO REALIZADO - PELÉ BURGUER* 🤖\n\n";
    message += `👤 *Cliente:* ${name}\n📍 *Bairro:* ${neighborhood}\n🏠 *Rua:* ${street}\n💳 *Pagamento:* ${payment}\n`;
    message += "\n--------------------------------------\n🍟 *RESUMO:*\n";

    let totalProdutos = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        message += `• ${item.quantity}x ${item.name} (R$ ${subtotal.toFixed(2)})\n`;
        totalProdutos += subtotal;
    });

    const deliveryFee = parseFloat(neighborhoodSelect.options[neighborhoodSelect.selectedIndex].getAttribute('data-fee'));
    message += `\n🚚 *Taxa:* R$ ${deliveryFee.toFixed(2)}\n`;
    message += `💰 *TOTAL: R$ ${(totalProdutos + deliveryFee).toFixed(2)}*`;

    const phone = "5561993677819"; 
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
   // ... (depois do window.open)

    // 1. Limpar os campos do formulário PRIMEIRO
    document.getElementById('client-name').value = "";
    document.getElementById('client-street').value = "";
    document.getElementById('payment-method').selectedIndex = 0;
    document.getElementById('client-neighborhood').selectedIndex = 0; // Volta para "Selecione seu Bairro"

    // 2. Zerar a lista do carrinho DEPOIS
    cart = []; 

    // 3. Agora sim, atualizar a tela
    // Como o bairro voltou a ser o index 0 (sem taxa), o total vai zerar de verdade!
    updateCart(); 

    alert("Pedido enviado! Seu carrinho foi limpo para uma nova compra.");
}); // <--- Verifique se essa chave e parêntese fecham a função do botão
