import { prisma } from '../config';

export class StoreService {
  static async getAllStores() {
    const stores = await prisma.store.findMany({
      include: {
        _count: {
          select: { prices: true },
        },
      },
      orderBy: { rating: 'desc' },
    });

    return stores.map((s) => ({
      ...s,
      listedPricesCount: s._count.prices,
    }));
  }

  static async getStoreById(id: string) {
    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        prices: {
          include: {
            product: {
              include: { brand: true, category: true },
            },
          },
          take: 20,
        },
      },
    });

    if (!store) {
      throw new Error('Store not found.');
    }

    return store;
  }
}
