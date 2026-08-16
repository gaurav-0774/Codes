import { prisma } from '../config';

export class PriceService {
  static async getProductPrices(productId: string) {
    const prices = await prisma.price.findMany({
      where: { productId },
      include: {
        store: true,
      },
      orderBy: { price: 'asc' },
    });

    if (prices.length === 0) {
      return [];
    }

    // Determine highlight badges: BEST PRICE, FASTEST DELIVERY, BEST RATED STORE
    const minPriceVal = Math.min(...prices.map((p) => p.price));
    const maxStoreRating = Math.max(...prices.map((p) => p.store.rating));

    return prices.map((p) => {
      const isBestPrice = p.price === minPriceVal;
      const isBestRatedStore = p.store.rating === maxStoreRating;
      const deliveryLower = p.deliveryText.toLowerCase();
      const isFastestDelivery =
        deliveryLower.includes('tomorrow') ||
        deliveryLower.includes('today') ||
        deliveryLower.includes('24 hours');

      const formattedLastUpdated = new Date(p.lastUpdated).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

      return {
        ...p,
        lastUpdatedFormatted: `Last updated: ${formattedLastUpdated}`,
        badges: {
          isBestPrice,
          isFastestDelivery,
          isBestRatedStore,
        },
      };
    });
  }

  static async getPriceHistory(productId: string) {
    const history = await prisma.priceHistory.findMany({
      where: { productId },
      include: {
        store: { select: { id: true, name: true } },
      },
      orderBy: { recordedAt: 'asc' },
    });

    // Format recordedAt dates for timeline charting
    return history.map((h) => ({
      id: h.id,
      storeId: h.storeId,
      storeName: h.store.name,
      price: h.price,
      recordedAt: h.recordedAt,
      dateFormatted: new Date(h.recordedAt).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
      }),
    }));
  }
}
