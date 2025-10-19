import express from "express";
import { allowedTo, protectedRoutes } from "../services/authService.js";
import { checkoutSession, confirmCardPayment, createCashOrder, filterOrderForLoggedUser, findAllOrders, findSpecificOrder, updateOrderToDelivered, updateOrderToPaid } from "../services/orderService.js";

const orderRouter = express.Router();
// Public route for Stripe redirect (no token available on redirect)
orderRouter.get("/card/success", confirmCardPayment);
orderRouter.use(protectedRoutes)

orderRouter.route("/checkout-session/:cartId").get(allowedTo('user'), checkoutSession)

orderRouter.route("/:cartId").post(allowedTo('user'), createCashOrder);
orderRouter.route("/").get(allowedTo('user','admin','manager'), filterOrderForLoggedUser, findAllOrders);
orderRouter.route("/:id").get(findSpecificOrder);

orderRouter.route("/:id/pay").put(allowedTo('admin','manager'), updateOrderToPaid);
orderRouter.route("/:id/deliver").put(allowedTo('admin','manager'), updateOrderToDelivered);
export default orderRouter;

