let products = [];
window.onload = function () {
  const URL_DATA =
    "https://tiki.vn/api/personalish/v1/blocks/listings?limit=40&include=advertisement&aggregations=2&version=home-persionalized&trackity_id=a1093fef-ce2a-1aaa-34bd-71b1346662c9&category=1789&page=1&urlKey=dien-thoai-may-tinh-bang";

  fetch(URL_DATA)
    .then((response) => response.json())
    .then((data) => {
      products = data.data;
      let productList = document.querySelector(".product-list");
      if (!productList) {
        console.error(
          'The element with the selector ".product-list" was not found.'
        );
        return;
      }
      products.forEach((product) => {
        console.log(product);
        productList.innerHTML += `
        <div class="product">
          <div class="product-img">
            <img src="${product.thumbnail_url}" alt="">
          </div>
          <div class="product-body">
            <h3 class="product-name"><a href="#">${product.name}</a></h3>
            <h4 class="product-price">${product?.price?.toLocaleString(
              "vi-VN"
            )} đ</h4>
            <div class="product-rating">
              ${"★".repeat(product.rating_average)}
            </div>
            <div class="product-btns">
              <button class="add-to-wishlist"><i class="fa fa-heart-o"></i><span class="tooltipp">add to wishlist</span></button>
              <button class="add-to-compare"><i class="fa fa-exchange"></i><span class="tooltipp">add to compare</span></button>
              <button class="quick-view"><i class="fa fa-eye"></i><span class="tooltipp">quick view</span></button>
            </div>
          </div>
          <div class="add-to-cart">
            <button class="add-to-cart-btn" onclick="addToCart(${
              product.id
            })"><i class="fa fa-shopping-cart"></i> add to cart</button>
          </div>
        </div>
      `;
      });
    });
  window.addToCart = function (productId) {
    const product = products.find((item) => item.id === productId);
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (product) {
      const cartItem = {
        id: product.id,
        name: product.name,
        image: product.thumbnail_url,
        price: product.price,
      };

      cart.push(cartItem);

      localStorage.setItem("cart", JSON.stringify(cart));
      loadCart();
    }
  };

  function loadCart() {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const cartDropdown = document.querySelector(".cart-dropdown .cart-list");

    let cartListHTML = "";
    let totalQty = 0;
    let subtotal = 0;

    cartItems.forEach((product) => {
      totalQty += 1;
      subtotal += product.price;
      cartListHTML += `
          <div class="product-widget">
            <div class="product-img">
              <img src="${product.image}" alt="">
            </div>
            <div class="product-body">
              <h3 class="product-name"><a href="#">${product.name}</a></h3>
              <h4 class="product-price"><span class="qty">1x</span>${product?.price?.toLocaleString(
                "vi-VN"
              )} đ</h4>
            </div>
            <button class="delete" onclick="removeFromCart(${
              product.id
            })"><i class="fa fa-close"></i></button>
          </div>
        `;
    });

    cartDropdown.innerHTML = cartListHTML;

    const deleteButtons = document.querySelectorAll(
      ".cart-dropdown .product-widget .delete"
    );
    deleteButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        cartItems.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cartItems));
        loadCart();
      });
    });
    const cartSummarySmall = document.querySelector(
      ".cart-dropdown .cart-summary"
    );
    const cartSummaryH5 = document.querySelector(
      ".cart-dropdown .cart-summary"
    );

    if (cartSummarySmall) {
      cartSummarySmall.textContent = `${totalQty} Item(s) selected`;
    }

    if (cartSummaryH5) {
      cartSummaryH5.textContent = `SUBTOTAL: ${subtotal.toLocaleString(
        "vi-VN"
      )} đ`;
    }
  }
};
