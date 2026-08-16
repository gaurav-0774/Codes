import { prisma } from '../config';

export interface SmartBuyScoreResult {
  score: number; // 0 - 100
  label: 'Excellent Deal' | 'Good Deal' | 'Fair Deal' | 'Consider Alternatives';
  color: string; // Tailored UI badge color
  breakdown: {
    priceScore: number;       // 30%
    ratingScore: number;      // 20%
    reviewScore: number;      // 15%
    specScore: number;        // 15%
    discountScore: number;    // 10%
    historyScore: number;     // 10%
  };
  explanation: string;
}

export interface BuyOrWaitRecommendation {
  recommendation: 'BUY NOW' | 'FAIR PRICE' | 'WAIT FOR PRICE DROP';
  badgeColor: string;
  currentPrice: number;
  thirtyDayAverage: number;
  historicalLowest: number;
  savingsVsAverage: number;
  savingsPercentage: number;
  reason: string;
}

export class SmartBuyScoreService {
  /**
   * PricePilot Smart Buy Score Algorithm (100% Weighted Total)
   * --------------------------------------------------------
   * Price Score (30%): Evaluates value based on current best price.
   * Rating Score (20%): Evaluates user satisfaction (0-5 stars normalized).
   * Review Score (15%): Volume confidence weight based on number of user reviews.
   * Spec Score (15%): Richness & density of product technical specifications.
   * Discount Score (10%): Discount percentage applied over original price.
   * Price History Score (10%): Trend check comparing current price against historical lowest.
   */
  static calculateScore(product: any, prices: any[], priceHistories: any[]): SmartBuyScoreResult {
    const bestPriceObj = prices.length > 0 ? prices[0] : null;
    const currentPrice = bestPriceObj ? bestPriceObj.price : 0;
    const discountPct = bestPriceObj ? bestPriceObj.discount : 0;

    // 1. Rating Score (20%)
    const ratingScore = Math.min(100, (product.rating / 5) * 100);

    // 2. Review Volume Score (15%) - Caps at 50 reviews
    const reviewScore = Math.min(100, (product.reviewCount / 50) * 100);

    // 3. Discount Score (10%) - Caps at 30% discount
    const discountScore = Math.min(100, (discountPct / 30) * 100);

    // 4. Specification Score (15%)
    let specKeysCount = 0;
    try {
      const specs = typeof product.specifications === 'string'
        ? JSON.parse(product.specifications)
        : product.specifications;
      specKeysCount = Object.keys(specs || {}).length;
    } catch (e) {
      specKeysCount = 4;
    }
    const specScore = Math.min(100, (specKeysCount / 6) * 100);

    // 5. Price History Score (10%)
    let historyScore = 75; // Default neutral
    if (priceHistories.length > 0) {
      const histPrices = priceHistories.map((h) => h.price);
      const lowestHist = Math.min(...histPrices);
      if (currentPrice <= lowestHist * 1.02) {
        historyScore = 100; // At or near historical lowest
      } else {
        const highestHist = Math.max(...histPrices);
        const range = highestHist - lowestHist || 1;
        const position = (highestHist - currentPrice) / range;
        historyScore = Math.max(20, Math.min(100, position * 100));
      }
    }

    // 6. Base Price Score (30%)
    // Normalized baseline price value relative to category standards
    const priceScore = Math.min(100, Math.max(40, 100 - (currentPrice / 4000)));

    // Calculate final weighted score
    const finalScore = Math.round(
      priceScore * 0.30 +
      ratingScore * 0.20 +
      reviewScore * 0.15 +
      specScore * 0.15 +
      discountScore * 0.10 +
      historyScore * 0.10
    );

    const clampedScore = Math.min(100, Math.max(10, finalScore));

    let label: 'Excellent Deal' | 'Good Deal' | 'Fair Deal' | 'Consider Alternatives' = 'Fair Deal';
    let color = 'text-amber-400 bg-amber-500/10 border-amber-500/30';

    if (clampedScore >= 90) {
      label = 'Excellent Deal';
      color = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    } else if (clampedScore >= 75) {
      label = 'Good Deal';
      color = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    } else if (clampedScore >= 60) {
      label = 'Fair Deal';
      color = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    } else {
      label = 'Consider Alternatives';
      color = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }

    return {
      score: clampedScore,
      label,
      color,
      breakdown: {
        priceScore: Math.round(priceScore),
        ratingScore: Math.round(ratingScore),
        reviewScore: Math.round(reviewScore),
        specScore: Math.round(specScore),
        discountScore: Math.round(discountScore),
        historyScore: Math.round(historyScore),
      },
      explanation: `Calculated from 6 key vectors: Price value (30%), Customer Rating ${product.rating}/5 (20%), User Review Volume (15%), Spec Richness (15%), Store Discount ${discountPct}% (10%), and 60-Day Price Trend (10%).`,
    };
  }

  /**
   * Rule-Based PricePilot Buy or Wait Recommendation Engine
   */
  static getBuyOrWaitRecommendation(prices: any[], priceHistories: any[]): BuyOrWaitRecommendation {
    const bestPriceObj = prices.length > 0 ? prices[0] : null;
    const currentPrice = bestPriceObj ? bestPriceObj.price : 0;

    if (priceHistories.length === 0 || currentPrice === 0) {
      return {
        recommendation: 'FAIR PRICE',
        badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        currentPrice,
        thirtyDayAverage: currentPrice,
        historicalLowest: currentPrice,
        savingsVsAverage: 0,
        savingsPercentage: 0,
        reason: 'Current price is aligned with market standard.',
      };
    }

    const pricesList = priceHistories.map((h) => h.price);
    const thirtyDayAverage = Math.round(
      pricesList.reduce((acc, curr) => acc + curr, 0) / pricesList.length
    );
    const historicalLowest = Math.min(...pricesList);

    const savingsVsAverage = thirtyDayAverage - currentPrice;
    const savingsPercentage = Math.round((savingsVsAverage / thirtyDayAverage) * 100);

    let recommendation: 'BUY NOW' | 'FAIR PRICE' | 'WAIT FOR PRICE DROP' = 'FAIR PRICE';
    let badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    let reason = 'Price is close to the 30-day average. Buy if urgently required.';

    if (currentPrice <= historicalLowest * 1.02 || currentPrice <= thirtyDayAverage * 0.95) {
      recommendation = 'BUY NOW';
      badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      reason = `Current price ₹${currentPrice.toLocaleString('en-IN')} is near its lowest recorded price of ₹${historicalLowest.toLocaleString('en-IN')}. Great time to buy!`;
    } else if (currentPrice > thirtyDayAverage * 1.04) {
      recommendation = 'WAIT FOR PRICE DROP';
      badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      reason = `Current price is ₹${(currentPrice - thirtyDayAverage).toLocaleString('en-IN')} higher than the 30-day average of ₹${thirtyDayAverage.toLocaleString('en-IN')}. Consider waiting for a sale.`;
    }

    return {
      recommendation,
      badgeColor,
      currentPrice,
      thirtyDayAverage,
      historicalLowest,
      savingsVsAverage,
      savingsPercentage,
      reason,
    };
  }

  /**
   * Better Alternatives Recommendation Engine
   */
  static async getBetterAlternatives(productId: string) {
    const currentProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        prices: { orderBy: { price: 'asc' } },
        priceHistories: true,
      },
    });

    if (!currentProduct) {
      throw new Error('Product not found.');
    }

    const currentBestPrice = currentProduct.prices.length > 0 ? currentProduct.prices[0].price : 0;
    const currentScoreObj = this.calculateScore(currentProduct, currentProduct.prices, currentProduct.priceHistories);

    // Find candidates in same category, excluding current product
    const candidates = await prisma.product.findMany({
      where: {
        categoryId: currentProduct.categoryId,
        id: { not: currentProduct.id },
      },
      include: {
        brand: true,
        category: true,
        prices: { include: { store: true }, orderBy: { price: 'asc' } },
        priceHistories: true,
      },
      take: 10,
    });

    const evaluatedCandidates = candidates.map((cand) => {
      const candBestPrice = cand.prices.length > 0 ? cand.prices[0].price : 0;
      const scoreObj = this.calculateScore(cand, cand.prices, cand.priceHistories);

      // Determine key highlight differentiator
      let keyAdvantage = 'Similar specs & competitive price';
      if (candBestPrice < currentBestPrice) {
        const diff = currentBestPrice - candBestPrice;
        keyAdvantage = `Save ₹${diff.toLocaleString('en-IN')} with lower price`;
      } else if (cand.rating > currentProduct.rating) {
        keyAdvantage = `Higher user rating (${cand.rating}★ vs ${currentProduct.rating}★)`;
      } else if (scoreObj.score > currentScoreObj.score) {
        keyAdvantage = `Higher Smart Buy Score (${scoreObj.score}/100)`;
      }

      let parsedSpecs = {};
      try {
        parsedSpecs = typeof cand.specifications === 'string' ? JSON.parse(cand.specifications) : cand.specifications;
      } catch (e) {
        parsedSpecs = {};
      }

      return {
        ...cand,
        specifications: parsedSpecs,
        bestPrice: candBestPrice,
        originalPrice: cand.prices.length > 0 ? cand.prices[0].originalPrice : 0,
        discount: cand.prices.length > 0 ? cand.prices[0].discount : 0,
        smartBuyScore: scoreObj.score,
        smartBuyLabel: scoreObj.label,
        keyAdvantage,
      };
    });

    // Sort by Smart Buy Score descending and return top 3 alternatives
    evaluatedCandidates.sort((a, b) => b.smartBuyScore - a.smartBuyScore);

    return evaluatedCandidates.slice(0, 3);
  }
}
