function addToWishlist(bookName, author, price) {
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  const exists = wishlist.find(
    (item) => item.bookName === bookName && item.author === author
  );
  if (!exists) {
    wishlist.push({ bookName, author, price });
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert(`${bookName} added to wishlist!`);
  } else {
    alert(`${bookName} is already in your wishlist.`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const card = btn.closest(".book-card");
      const bookName =
        card.getAttribute("data-book-name") ||
        card.querySelector(".book-title")?.textContent.trim() ||
        "Untitled";
      const author =
        card.getAttribute("data-author") ||
        card
          .querySelector(".book-author")
          ?.textContent.replace(/^By\s+/i, "")
          .trim() ||
        "Unknown";
      const priceText =
        card.getAttribute("data-price") ||
        card.querySelector(".price")?.textContent.replace(/[^\d]/g, "") ||
        "0";
      const price = parseInt(priceText) || 0;

      addToWishlist(bookName, author, price);
    });
  });
});
