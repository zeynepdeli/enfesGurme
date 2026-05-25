import { Request, Response } from "express";
import { OrderStatus } from "@prisma/client";
import Iyzipay, { iyzipay } from "../config/iyzico";
import prisma from "../config/prisma";

export const initCheckoutForm = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const userId = (req as any).user.id;

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: { include: { product: true } },
        address: true,
        user: true,
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı" });
    }

    if (order.status !== OrderStatus.PENDING) {
      return res
        .status(400)
        .json({ message: "Bu sipariş zaten işleme alındı" });
    }

    const basketItems = order.items.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      category1: "Genel",
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: (Number(item.price) * item.quantity).toFixed(2),
    }));

    const totalPrice = Number(order.total).toFixed(2);
    const nameParts = order.address.fullName.split(" ");

    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: orderId,
      price: totalPrice,
      paidPrice: totalPrice,
      currency: Iyzipay.CURRENCY.TRY,
      basketId: orderId,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.BACKEND_URL}/api/payment/iyzico/callback`,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: userId,
        name: nameParts[0],
        surname: nameParts.slice(1).join(" ") || "-",
        email: order.user.email,
        identityNumber: "11111111111",
        registrationAddress: order.address.address,
        city: order.address.city,
        country: "Turkey",
        gsmNumber: order.address.phone,
      },
      shippingAddress: {
        contactName: order.address.fullName,
        city: order.address.city,
        country: "Turkey",
        address: order.address.address,
      },
      billingAddress: {
        contactName: order.address.fullName,
        city: order.address.city,
        country: "Turkey",
        address: order.address.address,
      },
      basketItems,
    };

    iyzipay.checkoutFormInitialize.create(
      request as any,

      (err: any, result: any) => {
        if (err || result.status !== "success") {
          return res
            .status(500)
            .json({ message: "İyzico başlatılamadı", error: err || result });
        }

        res.json({
          status: "success",
          data: {
            checkoutFormContent: result.checkoutFormContent,
            token: result.token,
            tokenExpireTime: result.tokenExpireTime,
          },
        });
      },
    );
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};

export const handleCallback = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    iyzipay.checkoutForm.retrieve(
      { locale: Iyzipay.LOCALE.TR, token } as any,
      async (err: any, result: any) => {
        if (
          err ||
          result.status !== "success" ||
          result.paymentStatus !== "SUCCESS"
        ) {
          return res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
        }

        const orderId = result.basketId;

        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: OrderStatus.PAID,
            paymentToken: token,
            paidAt: new Date(),
          },
        });

        res.redirect(`${process.env.FRONTEND_URL}/orders/${orderId}/success`);
      },
    );
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
  }
};
