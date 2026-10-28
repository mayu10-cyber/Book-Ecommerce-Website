/**
 * BookNook - Published Books Display Engine (publish.js)
 * Guarantees that books added via the "Sell Your Book / Publish" feature
 * match 100% of the UI, dimensions, layout, styling, and interactivity
 * of existing bookstore catalog cards (Fiction, Deals, Trending).
 */

function displayPublishedBooks() {
  const bookGrid = document.getElementById('published-books-grid');
  if (!bookGrid) return;

  // 1. Get published books from localStorage
  const localBooks = JSON.parse(localStorage.getItem('books') || '[]');

  // 2. Also attempt to pull books from backend API if available
  fetch('/api/books')
    .then(res => res.ok ? res.json() : [])
    .then(serverBooks => {
      // Merge unique books (by title + author or id)
      const combined = [...localBooks];
      if (Array.isArray(serverBooks)) {
        serverBooks.forEach(sb => {
          const exists = combined.some(b => 
            (b.title && sb.title && b.title.trim().toLowerCase() === sb.title.trim().toLowerCase()) &&
            (b.author && sb.author && b.author.trim().toLowerCase() === sb.author.trim().toLowerCase())
          );
          if (!exists) combined.push(sb);
        });
      }

      if (combined.length === 0) {
        showEmptyState(bookGrid);
      } else {
        renderPublishedCards(combined, bookGrid);
      }
    })
    .catch(() => {
      if (localBooks.length === 0) {
        showEmptyState(bookGrid);
      } else {
        renderPublishedCards(localBooks, bookGrid);
      }
    });
}

function showEmptyState(container) {
  container.innerHTML = `
    <div style="width: 100%; text-align: center; padding: 2.5rem 1.5rem; background: #ffffff; border-radius: 20px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); margin: 0.5rem 0;">
      <i class="fas fa-book-reader" style="font-size: 2.2rem; color: #7e92df; margin-bottom: 0.8rem; display: block;"></i>
      <h3 style="font-family: 'Montserrat', sans-serif; font-size: 1.2rem; font-weight: 600; color: #3a2e26; margin-bottom: 0.4rem;">No Books Added Yet</h3>
      <p style="font-family: 'Crimson Pro', serif; font-size: 1rem; color: #7a6b62; margin-bottom: 1.2rem;">Be the first author to publish a title to the BookNook community catalog!</p>
      <a href="/html/publish.html" style="display: inline-block; padding: 10px 22px; background: #7e92df; color: #ffffff; border-radius: 8px; text-decoration: none; font-weight: 600; font-family: 'Montserrat', sans-serif; font-size: 0.95rem; transition: background 0.2s;">
        <i class="fas fa-plus me-1"></i> Publish a Book Now
      </a>
    </div>
  `;
}

function renderPublishedCards(books, container) {
  container.innerHTML = '';
  const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

  books.forEach((book, idx) => {
    const card = document.createElement('div');
    card.className = 'book-card';

    const bookId = book.id || `pub-${idx + 1}`;
    const safeTitle = (book.title || 'Untitled Book').replace(/"/g, '&quot;');
    const rawAuthor = book.author ? book.author.replace(/^By\s+/i, '') : 'Independent Author';
    const safeAuthor = rawAuthor.replace(/"/g, '&quot;');
    const price = parseFloat(book.price) || 299;
    const coverImage = book.image_url || '/assets/img/rafa.png';

    const isWishlisted = wishlist.some(b => 
      b.bookId == bookId || 
      (b.title && b.title === book.title) || 
      (b.bookName && b.bookName === book.title)
    );

    card.setAttribute('data-book-id', bookId);
    card.setAttribute('data-book-name', book.title);
    card.setAttribute('data-author', rawAuthor);
    card.setAttribute('data-price', price);
    card.setAttribute('data-stock', '15');

    // Identical HTML structure matching existing catalog cards
    card.innerHTML = `
      <div class="book-image">
        <img src="${coverImage}" alt="${safeTitle}" onerror="this.onerror=null;this.src='/assets/img/rafa.png';">
      </div>
      <div class="book-details">
        <div class="book-header">
          <h3 class="book-title" title="${safeTitle}">${book.title}</h3>
          <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" type="button" title="Add to Wishlist">
            <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
          </button>
        </div>
        <p class="book-author">By ${rawAuthor}</p>
        <div class="book-meta">
          <div class="quantity-selector">
            <button class="quantity-minus" type="button">-</button>
            <input type="number" class="quantity-input" value="1" min="1" max="15">
            <button class="quantity-plus" type="button">+</button>
          </div>
          <span class="price">₹${price}</span>
        </div>
        <button class="add-to-cart" type="button">Add to Cart</button>
      </div>
    `;

    // 1. Quantity Plus & Minus Listeners
    const minusBtn = card.querySelector('.quantity-minus');
    const plusBtn = card.querySelector('.quantity-plus');
    const qtyInput = card.querySelector('.quantity-input');

    minusBtn.addEventListener('click', (e) => {
      e.preventDefault();
      let current = parseInt(qtyInput.value) || 1;
      if (current > 1) qtyInput.value = current - 1;
    });

    plusBtn.addEventListener('click', (e) => {
      e.preventDefault();
      let current = parseInt(qtyInput.value) || 1;
      if (current < 15) qtyInput.value = current + 1;
    });

    // 2. Add to Cart Listener
    const addBtn = card.querySelector('.add-to-cart');
    addBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const quantity = parseInt(qtyInput.value) || 1;
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');

      const existing = cart.find(item => 
        item.title === book.title && 
        (item.author === rawAuthor || item.author === `By ${rawAuthor}`)
      );

      if (existing) {
        existing.quantity = (existing.quantity || 1) + quantity;
      } else {
        cart.push({
          title: book.title,
          author: `By ${rawAuthor}`,
          price: price,
          quantity: quantity
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${book.title} added to cart! 🛒 (${quantity})`);

      const cartCounter = document.querySelector('.cart-count');
      if (cartCounter) cartCounter.textContent = cart.length;
    });

    // 3. Wishlist Heart Toggle Listener
    const wishBtn = card.querySelector('.wishlist-btn');
    wishBtn.addEventListener('click', (e) => {
      e.preventDefault();
      let currentWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const icon = wishBtn.querySelector('i');
      const foundIdx = currentWishlist.findIndex(b => 
        b.bookId == bookId || 
        b.title === book.title || 
        b.bookName === book.title
      );

      if (foundIdx === -1) {
        // Add to wishlist
        currentWishlist.push({
          bookId: bookId,
          bookName: book.title,
          title: book.title,
          author: `By ${rawAuthor}`,
          price: price
        });
        wishBtn.classList.add('active');
        icon.className = 'fas fa-heart';
      } else {
        // Remove from wishlist
        currentWishlist.splice(foundIdx, 1);
        wishBtn.classList.remove('active');
        icon.className = 'far fa-heart';
      }

      localStorage.setItem('wishlist', JSON.stringify(currentWishlist));
      const wishCounter = document.querySelector('.wishlist-count');
      if (wishCounter) wishCounter.textContent = currentWishlist.length;
    });

    container.appendChild(card);
  });
}

// Auto-run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', displayPublishedBooks);
} else {
  displayPublishedBooks();
}