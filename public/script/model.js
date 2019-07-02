const product = {
  _id: ObjectId('5d160b6f5d42377df78446c7'),
  title: 'Test Product',
  product_type: 'generic',
  props: [
    {
      prop_type: 'color',
      values: [
        {
          name: 'Magenta',
          price: 1.0,
          hex: '#ff00ff',
          props: [
            {
              prop_type: 'size',
              values: [
                {
                  name: 'M',
                  price: 1.99,
                  props: [],
                },
                {
                  name: 'L',
                  price: 1.49,
                  props: [],
                },
              ],
            },
          ],
        },
        {
          name: 'Yellow',
          price: 1.29,
          hex: '#00ffff',
          props: [],
        },
      ],
    },
  ],
};
