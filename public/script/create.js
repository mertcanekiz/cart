const PRODUCT_TYPES = {
  generic: {
    name: 'Generic Product',
    properties: ['color', 'size'],
  },
  flight: {
    name: 'Flight',
    properties: ['date', 'class'],
  },
};

let colorCount = 0;
let encodedImage = '';

async function getBase64(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function() {
    encodedImage = reader.result;
    console.log(reader.result);
  };
  reader.onerror = function(err) {
    console.error(err);
  };
}

function toDataURL(src, callback, outputFormat) {
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function() {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var dataURL;
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL(outputFormat);
    callback(dataURL);
  };
  img.src = src;
  if (img.complete || img.complete === undefined) {
    img.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    img.src = src;
  }
}

function convertFormToJSON(form) {
  var array = jQuery(form).serializeArray();
  var json = {};

  array.forEach(item => {
    json[item.name] = item.value || '';
  });

  return json;
}

function invert(rgb) {
  rgb = Array.prototype.join.call(arguments).match(/(-?[0-9\.]+)/g);
  for (var i = 0; i < rgb.length; i++) {
    rgb[i] = (i === 3 ? 1 : 255) - rgb[i];
  }
  return 'rgb(' + rgb.join(',') + ')';
}

function colorForm(id) {
  return `
    <div id="${id}-color-form">
      <div class="form-group form-inline" id="${id}-color-select">
        <input id="${id}" type="text" class="form-control col-md-3" value="rgb(255, 128, 0)" />
        <input type="text" class="form-control col-md-5 name" placeholder="Color name"/>
        <input required type="number" step="0.01" class="form-control col-md-4 price" placeholder="Price"/>
      </div>
      <div id="${id}-sizes" data-size-count="0"></div>
      <div class="form-group form-inline" id="${id}-options">
        <input id="${id}-add-size" type="button" class="btn btn-outline-primary mr-3" value="Add size"/>
        <input id="${id}-remove-color" type="button" class="btn btn-outline-danger" value="Remove color"/>
      </div>
    </div>
  `;
}

function sizeForm(id) {
  return `
    <div class="form-group form-inline" id=size-${id}-group">
      <select class="form-control">
        <option value="clothes">Clothes</option>
        <option value="shoes">Shoes</option>
        <option value="custom">Custom</option>
      </select>
    </div>
  `;
}

function updateProps(type) {
  // Remove the checkboxes
  $('#product-form-properties').html('');
  // Remove the colors
  removeColors();
  // Add new checkboxes for that product type
  for (property of PRODUCT_TYPES[type].properties) {
    $('#product-form-properties').append(
      `<div class="form-check">
          <input class="form-check-input" type="checkbox" value="${property}" id="checkbox-${property}">
          <label class="form-check-label" for="checkbox-${property}">${property.toUpperCase()}</label>
        </div>
        `
    );
  }
}

function addColor(id) {
  if (colorCount == 0) {
    $('#colors').html('Colors');
  }
  $('#colors').append(colorForm(id));
  $(`#${id}`).colorpicker();
  $(`#${id}`).css('background-color', `rgb(255, 128, 0)`);
  $(`#${id}`).css('color', invert('rgb(255, 128, 0)'));
  $(`#${id}`).change(event => {
    $(`#${id}`).css('background-color', event.color.toString());
    $(`#${id}`).css('color', invert(event.color.toString()));
  });
  $(`#${id}-add-size`).click(() => addSize(id));
  $(`#${id}-remove-color`).click(() => removeColor(id));
  colorCount++;
}

function removeColors() {
  let colors = $('[id^="color-"]');
  colors.off();
  colors.remove();
  colorCount = 0;
  $('#colors').html('');
}

function removeColor(id) {
  let color = $(`#${id}-color-form`);
  color.off();
  color.remove();
  colorCount -= 1;
  if (colorCount == 0) {
    toggleAddColorButton(false);
    $('#colors').html('');
    $('#checkbox-color').prop('checked', false);
  }
}

function getColors() {
  result = [];
  let i = 0;
  while (true) {
    let current = $(`#color-${i}-group`);
    if (current.length == 0) {
      break;
    }
    let rgb = current.find('input.colorpicker-element').val();
    let name = current.find('input.name').val();
    let price = current.find('input.price').val();
    result.push({
      rgb,
      name,
      price,
    });
    i++;
  }
  return result;
}

function toggleAddColorButton(visible) {
  if (visible) {
    $('#add-new-color').removeClass('d-none');
  } else {
    $('#add-new-color').addClass('d-none');
  }
}

function addSize(id) {
  $(`#${id}-sizes`).html(sizeForm(id));
}

function toggleColor() {
  if (this.checked == true) {
    addColor('color-0');
    toggleAddColorButton(true);
  } else {
    removeColors();
    toggleAddColorButton(false);
  }
}

$(document).ready(function() {
  // Set the initial state to generic product
  updateProps('generic');
  toggleAddColorButton(false);

  // Toggle color form when checkbox is changed
  $('#checkbox-color').change(toggleColor);

  // Set the appropriate state when a product type is selected.
  $('#product-form-type').change(event => {
    let type = event.target.value;
    updateProps(type);
    $('#checkbox-color').change(toggleColor);
  });

  // Add new color
  $('#add-new-color').click(event => {
    addColor(`color-${colorCount}`);
  });

  $('#product-form-image').change(function(event) {
    getBase64(this.files[0]);
  });

  // Submit the form
  $('#product-form').submit(function(event) {
    event.preventDefault();
    let product = convertFormToJSON(this);
    product.colors = getColors();
    product.imageURL = encodedImage;
    const options = {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(product),
    };
    console.log(product);
    fetch('/products/add', options)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.success == true) {
          window.location.href = '/';
        }
      });
  });
});

$.validate({
  lang: 'en',
});
