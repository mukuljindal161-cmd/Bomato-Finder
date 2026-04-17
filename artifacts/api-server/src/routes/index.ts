import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import restaurantsRouter from "./restaurants";
import cartRouter from "./cart";
import addressesRouter from "./addresses";
import ordersRouter from "./orders";
import reviewsRouter from "./reviews";
import favoritesRouter from "./favorites";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/restaurants", restaurantsRouter);
router.use("/cart", cartRouter);
router.use("/addresses", addressesRouter);
router.use("/orders", ordersRouter);
router.use("/reviews", reviewsRouter);
router.use("/favorites", favoritesRouter);

export default router;
