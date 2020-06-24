import { Product } from "../types.ts";

let products: Product[] = [
  {
    id: "1",
    name: "Product One",
    description: "This is product one",
    price: 1999,
  },
  {
    id: "2",
    name: "Product Two",
    description: "This is product two",
    price: 2999,
  },
  {
    id: "3",
    name: "Product Three",
    description: "This is product three",
    price: 3999,
  },
];

// Get all products
// GET api/v1/products

const getProducts = ({ response }: { response: any }) => {
  response.body = {
    success: true,
    data: products,
  };
};

// get single product
// GET /api/v1/products/:id
const getProduct = (
  { params, response }: { params: { id: string }; response: any },
) => {
  const product: Product | undefined = products.find((p) => p.id == params.id);

  if (product) {
    response.status = 200;
    response.body = {
      success: true,
      data: product,
    };
  } else {
    response.status = 404;
    response.body = {
      success: false,
      msg: "No product found",
    };
  }
};

// add single product
// POST /api/v1/products
const addProduct = ({ response }: { response: any }) => {
  response.body = "add";
};

// update single product
// PUT /api/v1/products/:id
const updateProduct = ({ response }: { response: any }) => {
  response.body = "update";
};

// delete single product
// DELETE /api/v1/products/;id
const deleteProduct = ({ response }: { response: any }) => {
  response.body = "delete";
};

export { getProducts, getProduct, updateProduct, deleteProduct, addProduct };
