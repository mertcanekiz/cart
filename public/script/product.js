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
      $('.product-title').html(product.title);
      $('.product-image').attr('src', product.imageURL);
      $('.product-price').html(product.price);
      $('.product-description').html(product.description);
      console.log(product);
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
