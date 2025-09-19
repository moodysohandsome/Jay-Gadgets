const products = [
    { id:"iphone-15-pro", title:"iPhone 15 Pro", desc:"6.1-inch • A17 Pro chip • 256GB", price: 74900, img:"https://via.placeholder.com/400x300/000000/facc15?text=iPhone+15+Pro" },
    { id:"iphone-15-pro-max", title:"iPhone 15 Pro Max", desc:"6.7-inch • A17 Pro chip • 512GB", price: 99900, img:"https://via.placeholder.com/400x300/000000/facc15?text=iPhone+15+Pro+Max" },
    { id:"iphone-15", title:"iPhone 15", desc:"6.1-inch • A16 chip • 128GB", price: 54900, img:"https://via.placeholder.com/400x300/000000/facc15?text=iPhone+15" },
    { id:"iphone-15-plus", title:"iPhone 15 Plus", desc:"6.7-inch • A16 chip • 128GB", price: 59900, img:"https://via.placeholder.com/400x300/000000/facc15?text=iPhone+15+Plus" },
    { id:"iphone-14-pro", title:"iPhone 14 Pro", desc:"6.1-inch • A16 chip • 128GB", price: 62900, img:"https://via.placeholder.com/400x300/000000/facc15?text=iPhone+14+Pro" },
    { id:"iphone-14", title:"iPhone 14", desc:"6.1-inch • A15 chip • 128GB", price: 47900, img:"https://via.placeholder.com/400x300/000000/facc15?text=iPhone+14" },
    { id:"iphone-13", title:"iPhone 13", desc:"6.1-inch • A15 chip • 128GB", price: 41900, img:"https://via.placeholder.com/400x300/000000/facc15?text=iPhone+13" },
    { id:"iphone-13-mini", title:"iPhone 13 Mini", desc:"5.4-inch • A15 chip • 128GB", price: 37900, img:"https://via.placeholder.com/400x300/000000/facc15?text=iPhone+13+Mini" },
    { id:"iphone-se", title:"iPhone SE (2022)", desc:"4.7-inch • A15 chip • 64GB", price: 23900, img:"https://via.placeholder.com/400x300/000000/facc15?text=iPhone+SE" },
    { id:"iphone-12", title:"iPhone 12", desc:"6.1-inch • A14 chip • 64GB", price: 29900, img:"https://via.placeholder.com/400x300/000000/facc15?text=iPhone+12" }
  ];
  
  const pesoFmt = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' });
  
  const productsGrid = document.getElementById('products-grid');
  const cartBtn = document.getElementById('cartBtn');
  const cartCountEl = document.getElementById('cart-count');
  const cartModal = document.getElementById('cartModal');
  const closeCart = document.getElementById('closeCart');
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const clearCartBtn = document.getElementById('clearCart');
  const checkoutBtn = document.getElementById('checkout');
  const searchInput = document.getElementById('search');
  const yearEl = document.getElementById('year');
  
  let cart = {};
  
  // Render product cards
  function renderProducts(list) {
    productsGrid.innerHTML = '';
    list.forEach(p => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img src="${p.img}" alt="${escapeHtml(p.title)}"/>
        <div class="title">${escapeHtml(p.title)}</div>
        <div class="desc">${escapeHtml(p.desc)}</div>
        <div class="price">${pesoFmt.format(p.price)}</div>
        <div class="actions">
          <button class="btn-add" data-id="${p.id}">Add to cart</button>
          <button class="btn-buy" data-id="${p.id}">Buy now</button>
        </div>
      `;
      productsGrid.appendChild(card);
    });
    attachProductButtons();
  }
  
  function attachProductButtons() {
    document.querySelectorAll('.btn-add').forEach(btn => btn.addEventListener('click', () => addToCart(btn.dataset.id, 1)));
    document.querySelectorAll('.btn-buy').forEach(btn => btn.addEventListener('click', () => { addToCart(btn.dataset.id, 1); openCart(); }));
  }
  
  function addToCart(id, qty=1) { cart[id] = (cart[id]||0) + qty; updateCartUi(); }
  function removeFromCart(id) { delete cart[id]; updateCartUi(); }
  
  function updateCartUi() {
    const totalItems = Object.values(cart).reduce((s,q)=>s+q,0);
    cartCountEl.textContent = totalItems;
    renderCartItems();
  }
  
  function renderCartItems() {
    cartItemsEl.innerHTML = '';
    const entries = Object.entries(cart);
    let total = 0;
  
    if (!entries.length) {
      cartItemsEl.innerHTML = '<p>Your cart is empty.</p>';
    } else {
      entries.forEach(([id, qty]) => {
        const prod = products.find(p=>p.id===id);
        const lineTotal = prod.price * qty;
        total += lineTotal;
  
        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `
          <img src="${prod.img}" alt="${escapeHtml(prod.title)}"/>
          <div class="meta">
            <div style="font-weight:700;color:#facc15">${escapeHtml(prod.title)}</div>
            <div style="font-size:0.9rem;color:#bbb">${pesoFmt.format(prod.price)} × ${qty} = ${pesoFmt.format(lineTotal)}</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;">
            <button class="inc" data-id="${id}">＋</button>
            <button class="dec" data-id="${id}">－</button>
            <button class="rm" data-id="${id}">Remove</button>
          </div>
        `;
        cartItemsEl.appendChild(item);
      });
  
      cartItemsEl.querySelectorAll('.inc').forEach(b=>b.addEventListener('click',()=>{ cart[b.dataset.id]++; updateCartUi(); }));
      cartItemsEl.querySelectorAll('.dec').forEach(b=>b.addEventListener('click',()=>{ if(cart[b.dataset.id]>1){ cart[b.dataset.id]--; } else { removeFromCart(b.dataset.id);} updateCartUi(); }));
      cartItemsEl.querySelectorAll('.rm').forEach(b=>b.addEventListener('click',()=> removeFromCart(b.dataset.id)));
    }
  
    cartTotalEl.textContent = pesoFmt.format(total);
  }
  
  function openCart(){ cartModal.classList.remove('hidden'); }
  function closeCartModal(){ cartModal.classList.add('hidden'); }
  
  searchInput.addEventListener('input',(e)=>{
    const q=e.target.value.toLowerCase();
    renderProducts(products.filter(p=>(p.title+" "+p.desc).toLowerCase().includes(q)));
  });
  
  cartBtn.addEventListener('click', openCart);
  closeCart.addEventListener('click', closeCartModal);
  clearCartBtn.addEventListener('click', ()=>{ cart={}; updateCartUi(); });
  checkoutBtn.addEventListener('click', ()=>{
    if(!Object.keys(cart).length){ alert("Your cart is empty."); return; }
    alert("Thank you! (Demo) Order placed successfully.");
    cart={}; updateCartUi(); closeCartModal();
  });
  
  function escapeHtml(str){ return str.replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])); }
  
  document.addEventListener('DOMContentLoaded',()=>{ renderProducts(products); updateCartUi(); yearEl.textContent=new Date().getFullYear(); });
  