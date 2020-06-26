import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts";
import { Product } from "../types.ts";
import { dbCreds } from "../config.ts";

const client = new Client(dbCreds);

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

const getProducts = async ({ response }: { response: any }) => {
  try {
    await client.connect();

    const result = await client.query("SELECT * FROM products");

    const products = new Array();

    result.rows.map((p) => {
      let obj: any = new Object();

      result.rowDescription.columns.map((el, i) => {
        obj[el.name] = p[i];
      });

      products.push(obj);

      response.body = {
        success: true,
        data: products,
      };
    });
  } catch (error) {
    response.status = 500;
    response.body = {
      success: false,
      message: error.toString(),
    };
  } finally {
    await client.end();
  }
};

// get single product
// GET /api/v1/products/:id
const getProduct = async (
  { params, response }: { params: { id: string }; response: any },
) => {
  try {
    await client.connect();

    const result = await client.query(
      "SELECT * FROM products WHERE id=$1",
      params.id,
    );

    if (result.rows.toString() === "") {
      response.status = 404;
      response.body = {
        success: false,
        message: `No product with id : ${params.id}`,
      };
      return;
    } else {
      const product: any = new Object();

      result.rows.map((p) => {
        result.rowDescription.columns.map((el, i) => {
          product[el.name] = p[i];
        });
      });

      response.body = {
        success: true,
        data: product,
      };
    }
  } catch (error) {
    response.status = 500;
    response.body = {
      success: false,
      meassage: error.toString(),
    };
  } finally {
    await client.end();
  }
};

// add single product
// POST /api/v1/products
const addProduct = async (
  { request, response }: { request: any; response: any },
) => {
  const body = await request.body();
  const product = body.value;

  if (!request.hasBody) {
    response.status = 400;
    response.body = {
      success: false,
      msg: "No data",
    };
  } else {
    try {
      await client.connect();
      const result = await client.query(
        "INSERT INTO products(name,description,price)VALUES($1,$2,$3)",
        product.name,
        product.description,
        product.price,
      );

      response.status = 201;
      response.body = {
        success: true,
        data: product,
      };
    } catch (err) {
      response.status = 500;
      response.body = {
        success: false,
        message: err.toString(),
      };
    } finally {
      await client.end();
    }
  }
};

// update single product
// PUT /api/v1/products/:id
const updateProduct = async (
  { params, request, response }: {
    request: any;
    params: { id: string };
    response: any;
  },
) => {
  await getProduct({ params: { "id": params.id }, response });
  if (response.status === 404) {
    response.body = {
      success: false,
      message: response.body.message,
    };
  } else {
    const body = await request.body();
    const product = body.value;
    if (!request.hasBody) {
      response.status = 400;
      response.body = {
        success: false,
        msg: "No data",
      };
    } else {
      try {
        await client.connect();
        const result = await client.query(
          "UPDATE products SET name=$1,description=$2,price=$3 WHERE id=$4",
          product.name,
          product.description,
          product.price,
          params.id,
        );

        response.status = 200;
        response.body = {
          success: true,
          data: product,
        };
      } catch (err) {
        response.status = 500;
        response.body = {
          success: false,
          message: err.toString(),
        };
      } finally {
        await client.end();
      }
    }
  }
  response.status = 404;
  return;
};

// delete single product
// DELETE /api/v1/products/;id
const deleteProduct = (
  { params, response }: { params: { id: string }; response: any },
) => {
  products = products.filter((p) => p.id !== params.id);
  response.status = 200;
  response.body = {
    success: true,
    msg: "Product Removed",
  };
};

export { getProducts, getProduct, updateProduct, deleteProduct, addProduct };
