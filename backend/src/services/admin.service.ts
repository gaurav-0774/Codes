import { prisma } from '../config';

export class AdminService {
  static async getDashboardStats() {
    const [
      totalUsers,
      totalProducts,
      totalStores,
      totalReviews,
      totalWishlists,
      recentProducts,
      recentPrices,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.store.count(),
      prisma.review.count(),
      prisma.wishlist.count(),
      prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { brand: true, category: true },
      }),
      prisma.price.findMany({
        take: 5,
        orderBy: { lastUpdated: 'desc' },
        include: { product: true, store: true },
      }),
    ]);

    return {
      counts: {
        totalUsers,
        totalProducts,
        totalStores,
        totalReviews,
        totalWishlists,
      },
      recentProducts,
      recentPrices,
    };
  }

  static async createProduct(data: {
    name: string;
    slug: string;
    description: string;
    brandId: string;
    categoryId: string;
    image: string;
    specifications: any;
  }) {
    const specsStr = typeof data.specifications === 'string'
      ? data.specifications
      : JSON.stringify(data.specifications || {});

    return prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        brandId: data.brandId,
        categoryId: data.categoryId,
        image: data.image,
        specifications: specsStr,
      },
    });
  }

  static async updateProduct(
    id: string,
    data: {
      name?: string;
      description?: string;
      brandId?: string;
      categoryId?: string;
      image?: string;
      specifications?: any;
    }
  ) {
    const updateData: any = { ...data };
    if (data.specifications !== undefined) {
      updateData.specifications = typeof data.specifications === 'string'
        ? data.specifications
        : JSON.stringify(data.specifications);
    }

    return prisma.product.update({
      where: { id },
      data: updateData,
    });
  }

  static async deleteProduct(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }

  static async upsertPrice(data: {
    productId: string;
    storeId: string;
    price: number;
    originalPrice: number;
    discount?: number;
    availability?: string;
    deliveryText?: string;
    productUrl?: string;
  }) {
    const discount = data.discount || Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100);

    // 1. Upsert Price entry
    const priceRecord = await prisma.price.upsert({
      where: {
        productId_storeId: {
          productId: data.productId,
          storeId: data.storeId,
        },
      },
      update: {
        price: data.price,
        originalPrice: data.originalPrice,
        discount,
        availability: data.availability || 'In Stock',
        deliveryText: data.deliveryText || 'Standard Delivery',
        productUrl: data.productUrl || 'https://example.com',
        lastUpdated: new Date(),
      },
      create: {
        productId: data.productId,
        storeId: data.storeId,
        price: data.price,
        originalPrice: data.originalPrice,
        discount,
        availability: data.availability || 'In Stock',
        deliveryText: data.deliveryText || 'Standard Delivery',
        productUrl: data.productUrl || 'https://example.com',
      },
    });

    // 2. AUTOMATIC PRICE HISTORY LOGGING (Section 28)
    await prisma.priceHistory.create({
      data: {
        productId: data.productId,
        storeId: data.storeId,
        price: data.price,
        recordedAt: new Date(),
      },
    });

    return priceRecord;
  }

  static async deletePrice(id: string) {
    return prisma.price.delete({
      where: { id },
    });
  }
}
