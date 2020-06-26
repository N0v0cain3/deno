import { Router } from "https://deno.land/x/oak/mod.ts";
import {
  getProducts,
  getProduct,
  addProduct,
  deleteProduct,
  updateProduct,
} from "./controllers/product.ts";
const router = new Router();

router.get("/api/v1/products", getProducts);
router.get("/api/v1/product/:id", getProduct);
router.put("/api/v1/products/:id", updateProduct);
router.post("/api/v1/products", addProduct);
router.delete("/api/v1/products/:id", deleteProduct);

export default router;
