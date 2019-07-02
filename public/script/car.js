const car = {
  _id: ObjectId('5d160b6f5d42377df78446c7'),
  title: 'Honda Civic',
  product_type: 'car',
  props: [
    {
      prop_type: 'model',
      values: [
        {
          name: '2019',
          price: 1.0,
          props: [
            {
              prop_type: 'color',
              values: [
                {
                  name: 'Blue',
                  price: 1.99,
                  props: [
                    {
                      prop_type: 'extra',
                      values: [
                        {
                          name: 'Extra features',
                          price: 2.99,
                          props: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'Black',
                  price: 1.49,
                  props: [
                    {
                      prop_type: 'extra',
                      values: [
                        {
                          name: 'Extra features',
                          price: 2.99,
                          props: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: '2018',
          price: 1.29,
          props: [],
        },
      ],
    },
  ],
};
