import { prisma } from '../config';

export class CategoryService {
  static async getAllCategories() {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image,
      productCount: c._count.products,
      createdAt: c.createdAt,
    }));
  }

  static async getCategoryBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      throw new Error('Category not found.');
    }

    return {
      ...category,
      productCount: category._count.products,
    };
  }
}
