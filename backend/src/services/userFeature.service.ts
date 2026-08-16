import { prisma } from '../config';

export class UserFeatureService {
  // Wishlist Functions
  static async getWishlist(userId: string) {
    const items = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            brand: true,
            category: true,
            prices: { orderBy: { price: 'asc' } },
            priceHistories: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return items.map((w) => {
      const p = w.product;
      const best = p.prices.length > 0 ? p.prices[0] : null;
      let parsedSpecs = {};
      try {
        parsedSpecs = typeof p.specifications === 'string' ? JSON.parse(p.specifications) : p.specifications;
      } catch (e) {
        parsedSpecs = {};
      }

      return {
        wishlistId: w.id,
        addedAt: w.createdAt,
        product: {
          ...p,
          specifications: parsedSpecs,
          bestPrice: best ? best.price : 0,
          originalPrice: best ? best.originalPrice : 0,
          discount: best ? best.discount : 0,
        },
      };
    });
  }

  static async addToWishlist(userId: string, productId: string) {
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      return existing;
    }

    return prisma.wishlist.create({
      data: { userId, productId },
    });
  }

  static async removeFromWishlist(userId: string, productId: string) {
    return prisma.wishlist.deleteMany({
      where: { userId, productId },
    });
  }

  // Recently Viewed Functions
  static async getRecentlyViewed(userId: string) {
    const items = await prisma.recentlyViewed.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            brand: true,
            category: true,
            prices: { orderBy: { price: 'asc' } },
          },
        },
      },
      orderBy: { viewedAt: 'desc' },
      take: 10,
    });

    return items.map((rv) => {
      const p = rv.product;
      const best = p.prices.length > 0 ? p.prices[0] : null;
      let parsedSpecs = {};
      try {
        parsedSpecs = typeof p.specifications === 'string' ? JSON.parse(p.specifications) : p.specifications;
      } catch (e) {
        parsedSpecs = {};
      }

      return {
        viewedAt: rv.viewedAt,
        product: {
          ...p,
          specifications: parsedSpecs,
          bestPrice: best ? best.price : 0,
          originalPrice: best ? best.originalPrice : 0,
          discount: best ? best.discount : 0,
        },
      };
    });
  }

  static async addRecentlyViewed(userId: string, productId: string) {
    // Delete existing entry if present to update timestamp
    await prisma.recentlyViewed.deleteMany({
      where: { userId, productId },
    });

    return prisma.recentlyViewed.create({
      data: { userId, productId },
    });
  }
}
