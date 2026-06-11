import { clearSession, getSession, request } from './api.js';

const session = getSession();
const userName = document.querySelector('[data-user-name]');
const userRole = document.querySelector('[data-user-role]');
const logoutButton = document.querySelector('[data-logout]');
const productsGrid = document.querySelector('[data-products]');
const searchInput = document.querySelector('[data-search]');
const cartList = document.querySelector('[data-cart-list]');
const cartTotal = document.querySelector('[data-cart-total]');
const checkoutButton = document.querySelector('[data-checkout]');
const adminSection = document.querySelector('[data-admin-section]');
const adminLink = document.querySelector('[data-admin-link]');
const adminMessage = document.querySelector('[data-admin-message]');
const productForm = document.querySelector('[data-product-form]');
const adminProducts = document.querySelector('[data-admin-products]');
const adminOrders = document.querySelector('[data-admin-orders]');
const adminUsers = document.querySelector('[data-admin-users]');
const stats = {
  products: document.querySelector('[data-stat-products]'),
  orders: document.querySelector('[data-stat-orders]'),
  stock: document.querySelector('[data-stat-stock]'),
  users: document.querySelector('[data-stat-users]'),
};

const fallbackProducts = [
  {
    id: 1,
    name: 'Explosion Original',
    description: 'Energetico intenso com cafeina, taurina e sabor classico.',
    price: 8.9,
    stock: 42,
    category: 'Classico',
    image_url: '/assets/images/products/explosion-original.svg',
    active: true,
  },
  {
    id: 2,
    name: 'Explosion Tropical',
    description: 'Notas de manga, maracuja e citricos para um impulso refrescante.',
    price: 9.9,
    stock: 35,
    category: 'Frutado',
    image_url: '/assets/images/products/explosion-tropical.svg',
    active: true,
  },
  {
    id: 3,
    name: 'Explosion Zero Sugar',
    description: 'Energia sem acucar para treino, estudos e rotina corrida.',
    price: 10.5,
    stock: 28,
    category: 'Zero',
    image_url: '/assets/images/products/explosion-zero.svg',
    active: true,
  },
];

let products = [];
let productsFromDatabase = false;
let cart = JSON.parse(localStorage.getItem('explosion_cart') || '[]');

if (!session?.user || !session?.token) {
  window.location.href = '/auth/login.html';
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatCurrency(value) {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function showAdminMessage(text, type = 'success') {
  adminMessage.textContent = text;
  adminMessage.className = `message show admin-note ${type}`;
}

function saveCart() {
  localStorage.setItem('explosion_cart', JSON.stringify(cart));
}

function renderProductMedia(product) {
  if (product.image_url) {
    return `<img src="${escapeHtml(product.image_url)}" alt="${escapeHtml(product.name)}" loading="lazy">`;
  }

  return escapeHtml(product.name.charAt(0));
}

function renderProducts(items) {
  productsGrid.innerHTML = items
    .map((product) => `
      <article class="product-card">
        <div class="product-media">${renderProductMedia(product)}</div>
        <div class="product-body">
          <h3>${escapeHtml(product.name)}</h3>
          <p>${escapeHtml(product.description || 'Energetico EXPLOSION pronto para venda.')}</p>
          <div class="product-meta">
            <span>${formatCurrency(product.price)}</span>
            <span class="tag">${Number(product.stock)} em estoque</span>
          </div>
          <button class="btn full" type="button" data-add-product="${Number(product.id)}" ${Number(product.stock) === 0 ? 'disabled' : ''}>Adicionar ao carrinho</button>
        </div>
      </article>
    `)
    .join('');
}

function renderCart() {
  if (cart.length === 0) {
    cartList.innerHTML = '<li><span>Carrinho vazio</span><strong>R$ 0,00</strong></li>';
    cartTotal.textContent = formatCurrency(0);
    return;
  }

  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  cartList.innerHTML = cart
    .map((item) => `
      <li>
        <span>${item.quantity}x ${escapeHtml(item.name)}</span>
        <strong>${formatCurrency(Number(item.price) * item.quantity)}</strong>
      </li>
    `)
    .join('');

  cartTotal.textContent = formatCurrency(total);
}

function renderAdminProducts() {
  adminProducts.innerHTML = products
    .map((product) => `
      <tr>
        <td>${escapeHtml(product.name)}</td>
        <td>${escapeHtml(product.category || '-')}</td>
        <td>${formatCurrency(product.price)}</td>
        <td>${Number(product.stock)}</td>
        <td><button class="icon-button" type="button" title="Excluir produto" aria-label="Excluir ${escapeHtml(product.name)}" data-delete-product="${Number(product.id)}">X</button></td>
      </tr>
    `)
    .join('');
}

function renderAdminOrders(orders) {
  adminOrders.innerHTML = orders.length
    ? orders.map((order) => `
        <tr>
          <td>#${Number(order.id)}</td>
          <td>${escapeHtml(order.customer_name || session.user.nome)}</td>
          <td>${formatCurrency(order.total)}</td>
          <td>
            <select class="order-status" data-order-status="${Number(order.id)}">
              ${['pendente', 'pago', 'enviado', 'entregue', 'cancelado']
                .map((status) => `<option value="${status}" ${order.status === status ? 'selected' : ''}>${status}</option>`)
                .join('')}
            </select>
          </td>
        </tr>
      `).join('')
    : '<tr><td colspan="4">Nenhum pedido cadastrado.</td></tr>';
}

function renderAdminUsers(users) {
  adminUsers.innerHTML = users.length
    ? users.map((user) => `
        <tr>
          <td>${escapeHtml(user.nome)}</td>
          <td>${escapeHtml(user.email)}</td>
          <td>${escapeHtml(user.perfil)}</td>
        </tr>
      `).join('')
    : '<tr><td colspan="3">Nenhum cliente cadastrado.</td></tr>';
}

function addToCart(productId) {
  const product = products.find((item) => Number(item.id) === Number(productId));

  if (!product) {
    return;
  }

  const current = cart.find((item) => Number(item.id) === Number(product.id));
  const currentQuantity = current?.quantity || 0;

  if (currentQuantity >= Number(product.stock)) {
    alert('Quantidade maxima disponivel em estoque atingida.');
    return;
  }

  if (current) {
    current.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }

  saveCart();
  renderCart();
}

async function loadProducts() {
  try {
    const response = await request('/products?active=true');
    products = response.data;
    productsFromDatabase = true;
  } catch (error) {
    products = fallbackProducts;
    productsFromDatabase = false;
  }

  renderProducts(products);

  if (session.user.perfil === 'admin') {
    renderAdminProducts();
    stats.products.textContent = products.length;
    stats.stock.textContent = products.reduce((sum, product) => sum + Number(product.stock || 0), 0);
  }
}

async function loadAdminData() {
  if (session.user.perfil !== 'admin') {
    adminSection.classList.add('hidden');
    adminLink.classList.add('hidden');
    return;
  }

  try {
    const [ordersResponse, usersResponse] = await Promise.all([
      request('/orders'),
      request('/users'),
    ]);

    renderAdminOrders(ordersResponse.data);
    renderAdminUsers(usersResponse.data);
    stats.orders.textContent = ordersResponse.data.length;
    stats.users.textContent = usersResponse.data.filter((user) => user.perfil === 'cliente').length;
  } catch (error) {
    showAdminMessage(error.message, 'error');
  }
}

userName.textContent = session.user.nome;
userRole.textContent = session.user.perfil === 'admin' ? 'Administrador' : 'Cliente';

logoutButton.addEventListener('click', () => {
  clearSession();
  window.location.href = '/auth/login.html';
});

searchInput.addEventListener('input', (event) => {
  const term = event.target.value.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    return `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(term);
  });

  renderProducts(filteredProducts);
});

productsGrid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-add-product]');

  if (button) {
    addToCart(button.dataset.addProduct);
  }
});

checkoutButton.addEventListener('click', async () => {
  if (cart.length === 0) {
    alert('Adicione produtos antes de finalizar.');
    return;
  }

  if (!productsFromDatabase) {
    alert('Cadastre produtos no banco para concluir um pedido real.');
    return;
  }

  checkoutButton.disabled = true;
  checkoutButton.textContent = 'Finalizando...';

  try {
    await request('/orders', {
      method: 'POST',
      body: JSON.stringify({
        items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
      }),
    });

    cart = [];
    saveCart();
    renderCart();
    await loadProducts();
    await loadAdminData();
    alert('Pedido criado com sucesso.');
  } catch (error) {
    alert(error.message);
  } finally {
    checkoutButton.disabled = false;
    checkoutButton.textContent = 'Realizar compra';
  }
});

productForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = Object.fromEntries(new FormData(productForm).entries());

  try {
    await request('/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    productForm.reset();
    showAdminMessage('Produto cadastrado com sucesso.');
    await loadProducts();
  } catch (error) {
    showAdminMessage(error.message, 'error');
  }
});

adminProducts.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-delete-product]');

  if (!button) {
    return;
  }

  try {
    await request(`/products/${button.dataset.deleteProduct}`, { method: 'DELETE' });
    showAdminMessage('Produto removido com sucesso.');
    await loadProducts();
  } catch (error) {
    showAdminMessage(error.message, 'error');
  }
});

adminOrders.addEventListener('change', async (event) => {
  const select = event.target.closest('[data-order-status]');

  if (!select) {
    return;
  }

  try {
    await request(`/orders/${select.dataset.orderStatus}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: select.value }),
    });
    showAdminMessage('Status do pedido atualizado.');
  } catch (error) {
    showAdminMessage(error.message, 'error');
  }
});

renderCart();
await loadProducts();
await loadAdminData();
