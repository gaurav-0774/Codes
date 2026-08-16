import { prisma } from '../config';

export class BrandService {
  static async getAllBrands() {
    const brands = await prisma.brand.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return brands.map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      logo: b.logo,
      productCount: b._count.products,
      createdAt: b.createdAt,
    }));
  }

  static async getBrandBySlug(slug: string) {
    const brand = await prisma.brand.findUnique({
      where: { slug },
      include: {
        _count: { select: { products: true } },
      },
    });

    if (!brand) {
      throw new Error('Brand not found.');
    }

    return {
      ...brand,
      productCount: brand._count.products,
    };
  }
}
