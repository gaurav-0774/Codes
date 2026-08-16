import { prisma } from '../config';
import { ProductQueryInput } from '../validators/product.validator';

export class ProductService {
  static async getProducts(query: ProductQueryInput) {
    const { search, category, brand, minPrice, maxPrice, minRating, sortBy, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { brand: { name: { contains: search } } },
        { category: { name: { contains: search } } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (brand) {
      where.brand = { slug: brand };
    }

    if (minRating) {
      where.rating = { gte: minRating };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.prices = {
        some: {
          price: {
            ...(minPrice !== undefined ? { gte: minPrice } : {}),
            ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
          },
        },
      };
    }

    const [total, rawProducts] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          brand: true,
          category: true,
          prices: {
            include: { store: true },
            orderBy: { price: 'asc' },
          },
        },
        orderBy: sortBy === 'rating' ? { rating: 'desc' } : { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    const products = rawProducts.map((p) => {
      const bestPriceObj = p.prices.length > 0 ? p.prices[0] : null;
      let parsedSpecs = {};
      try {
        parsedSpecs = typeof p.specifications === 'string' ? JSON.parse(p.specifications) : p.specifications;
      } catch (e) {
        parsedSpecs = {};
      }

      return {
        ...p,
        specifications: parsedSpecs,
        bestPrice: bestPriceObj ? bestPriceObj.price : 0,
        originalPrice: bestPriceObj ? bestPriceObj.originalPrice : 0,
        discount: bestPriceObj ? bestPriceObj.discount : 0,
        storeCount: p.prices.length,
      };
    });

    if (sortBy === 'price_asc') {
      products.sort((a, b) => a.bestPrice - b.bestPrice);
    } else if (sortBy === 'price_desc') {
      products.sort((a, b) => b.bestPrice - a.bestPrice);
    }

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getProductBySlug(slugOrId: string) {
    let product = await prisma.product.findUnique({
      where: { slug: slugOrId },
      include: {
        brand: true,
        category: true,
        prices: {
          include: { store: true },
          orderBy: { price: 'asc' },
        },
        priceHistories: {
          include: { store: true },
          orderBy: { recordedAt: 'asc' },
        },
        reviews: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      product = await prisma.product.findUnique({
        where: { id: slugOrId },
        include: {
          brand: true,
          category: true,
          prices: {
            include: { store: true },
            orderBy: { price: 'asc' },
          },
          priceHistories: {
            include: { store: true },
            orderBy: { recordedAt: 'asc' },
          },
          reviews: {
            include: {
              user: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }

    if (!product) {
      throw new Error('Product not found.');
    }

    let parsedSpecs = {};
    try {
      parsedSpecs = typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications;
    } catch (e) {
      parsedSpecs = {};
    }

    const bestPriceObj = product.prices.length > 0 ? product.prices[0] : null;

    return {
      ...product,
      specifications: parsedSpecs,
      bestPrice: bestPriceObj ? bestPriceObj.price : 0,
      originalPrice: bestPriceObj ? bestPriceObj.originalPrice : 0,
      discount: bestPriceObj ? bestPriceObj.discount : 0,
    };
  }

  static async getFeaturedProducts() {
    const [trending, bestDeals, topRated] = await Promise.all([
      prisma.product.findMany({
        take: 6,
        orderBy: { reviewCount: 'desc' },
        include: {
          brand: true,
          category: true,
          prices: { include: { store: true }, orderBy: { price: 'asc' } },
        },
      }),
      prisma.product.findMany({
        take: 6,
        orderBy: { rating: 'desc' },
        include: {
          brand: true,
          category: true,
          prices: { include: { store: true }, orderBy: { price: 'asc' } },
        },
      }),
      prisma.product.findMany({
        take: 6,
        where: { rating: { gte: 4.5 } },
        orderBy: { rating: 'desc' },
        include: {
          brand: true,
          category: true,
          prices: { include: { store: true }, orderBy: { price: 'asc' } },
        },
      }),
    ]);

    const format = (items: any[]) =>
      items.map((p) => {
        const best = p.prices.length > 0 ? p.prices[0] : null;
        let parsedSpecs = {};
        try {
          parsedSpecs = typeof p.specifications === 'string' ? JSON.parse(p.specifications) : p.specifications;
        } catch (e) {
          parsedSpecs = {};
        }
        return {
          ...p,
          specifications: parsedSpecs,
          bestPrice: best ? best.price : 0,
          originalPrice: best ? best.originalPrice : 0,
          discount: best ? best.discount : 0,
        };
      });

    return {
      trending: format(trending),
      bestDeals: format(bestDeals),
      topRated: format(topRated),
    };
  }

  static async addReview(productId: string, userId: string, rating: number, title: string, content: string) {
    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        rating,
        title,
        content,
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    // Update product average rating & review count
    const allReviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: allReviews.length,
      },
    });

    return review;
  }
}
