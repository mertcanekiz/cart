$(document).ready(function() {
  $('#products').html(`Loading...`);
  fetch('/products')
    .then(response => {
      return response.json();
    })
    .then(data => {
      $('#products').html('');
      data.forEach((product, i) => {
        $('#products').append(`
        <div class="card my-2">
        <a href="/product.html?id=${product._id}">
          <img class="card-img-top" src="${
            product.imageURL
          }" alt="Card image cap">
          </a>
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description}</p>
            <a href="/product.html?id=${
              product._id
            }" class="btn btn-primary">$${product.price}</a>
          </div>
        </div>
        `);
      });
    });
});
