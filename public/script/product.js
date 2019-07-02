var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined
        ? true
        : decodeURIComponent(sParameterName[1]);
    }
  }
};

$(document).ready(function() {
  let id = getUrlParameter('id');
  fetch(`/products/${id}`)
    .then(response => response.json())
    .then(product => {
      $('#product').html(`
        <div class="card">
          <img class="card-img-top" src="${
            product.imageURL
          }" alt="Card image cap">
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description}</p>
            <a href="/product.html?id=${
              product._id
            }" class="btn btn-primary">$${product.price}</a>
      <button class="btn btn-danger" id="delete-btn">Delete</button>
          </div>
        </div>
        `);
      $('#delete-btn').click(function() {
        fetch(`/products/delete/${product._id}`, {
          method: 'post',
          headers: {
            'content-type': 'application/json',
          },
        }).then(response => {
          window.location.href = '/';
        });
      });
    });
});
