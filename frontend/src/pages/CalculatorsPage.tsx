import React, { useState } from 'react';
import { Calculator, Percent, Calendar } from 'lucide-react';

export const CalculatorsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'emi' | 'discount'>('emi');

  // EMI State
  const [productPrice, setProductPrice] = useState<number>(75000);
  const [downPayment, setDownPayment] = useState<number>(15000);
  const [interestRate, setInterestRate] = useState<number>(12); // % per annum
  const [loanMonths, setLoanMonths] = useState<number>(12);

  // Discount State
  const [originalPrice, setOriginalPrice] = useState<number>(89900);
  const [discountPercent, setDiscountPercent] = useState<number>(15);

  // EMI Calculations: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
  const principal = Math.max(0, productPrice - downPayment);
  const monthlyRate = interestRate / 12 / 100;
  const emi =
    monthlyRate > 0 && principal > 0
      ? (principal * monthlyRate * Math.pow(1 + monthlyRate, loanMonths)) /
        (Math.pow(1 + monthlyRate, loanMonths) - 1)
      : principal / (loanMonths || 1);

  const totalPayment = emi * loanMonths + downPayment;
  const totalInterest = Math.max(0, totalPayment - productPrice);

  // Discount Calculations
  const discountAmount = (originalPrice * discountPercent) / 100;
  const finalPrice = Math.max(0, originalPrice - discountAmount);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
              <Calculator className="w-3.5 h-3.5" />
              <span>Financial Utilities (100% Offline)</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">PricePilot Shopping Calculators</h1>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('emi')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'emi'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>EMI Calculator</span>
            </button>
            <button
              onClick={() => setActiveTab('discount')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'discount'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
              <span>Discount & Savings</span>
            </button>
          </div>
        </div>

        {/* 1. EMI CALCULATOR */}
        {activeTab === 'emi' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-brand-400" />
                Monthly EMI Calculation
              </h2>

              <div className="space-y-4 text-xs">
                {/* Product Price */}
                <div>
                  <div className="flex justify-between font-semibold text-slate-300 mb-1.5">
                    <span>Product Price (₹)</span>
                    <span className="text-brand-400 font-bold">₹{productPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min={5000}
                    max={350000}
                    step={1000}
                    value={productPrice}
                    onChange={(e) => setProductPrice(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                </div>

                {/* Down Payment */}
                <div>
                  <div className="flex justify-between font-semibold text-slate-300 mb-1.5">
                    <span>Down Payment (₹)</span>
                    <span className="text-emerald-400 font-bold">₹{downPayment.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={productPrice * 0.8}
                    step={1000}
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Interest Rate */}
                <div>
                  <div className="flex justify-between font-semibold text-slate-300 mb-1.5">
                    <span>Interest Rate (% per annum)</span>
                    <span className="text-cyan-400 font-bold">{interestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={24}
                    step={0.5}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-2">Loan Tenure (Months)</label>
                  <div className="grid grid-cols-6 gap-2">
                    {[3, 6, 9, 12, 18, 24].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setLoanMonths(m)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                          loanMonths === m
                            ? 'bg-brand-600 text-white border-brand-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {m} Mo
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Output Summary Card */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
                  Monthly Installment Output
                </div>
                <div className="text-4xl font-black text-brand-400 mb-1">
                  ₹{Math.round(emi).toLocaleString('en-IN')}
                  <span className="text-sm font-semibold text-slate-400"> / month</span>
                </div>
                <p className="text-xs text-slate-400">
                  Calculated for <span className="text-white font-bold">{loanMonths} months</span> at {interestRate}% p.a. interest.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Principal Loan Amount</span>
                  <span className="text-white font-bold">₹{principal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Total Interest Payable</span>
                  <span className="text-rose-400 font-bold">₹{Math.round(totalInterest).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Down Payment Paid</span>
                  <span className="text-emerald-400 font-bold">₹{downPayment.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-2 text-sm font-bold pt-2">
                  <span className="text-white">Total Outflow Cost</span>
                  <span className="text-brand-400">₹{Math.round(totalPayment).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. DISCOUNT CALCULATOR */}
        {activeTab === 'discount' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Percent className="w-5 h-5 text-emerald-400" />
                Discount & Savings Calculation
              </h2>

              <div className="space-y-4 text-xs">
                {/* Original Price */}
                <div>
                  <div className="flex justify-between font-semibold text-slate-300 mb-1.5">
                    <span>Original List Price (₹)</span>
                    <span className="text-white font-bold">₹{originalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min={1000}
                    max={300000}
                    step={500}
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                </div>

                {/* Discount Percentage */}
                <div>
                  <div className="flex justify-between font-semibold text-slate-300 mb-1.5">
                    <span>Discount Percentage (%)</span>
                    <span className="text-emerald-400 font-bold">{discountPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={80}
                    step={1}
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Output Summary Card */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
                  Final Deal Price
                </div>
                <div className="text-4xl font-black text-emerald-400 mb-1">
                  ₹{Math.round(finalPrice).toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-slate-400">
                  Calculated after applying <span className="text-white font-bold">{discountPercent}% discount</span>.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">Original Price</span>
                  <span className="text-slate-300 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-2 text-sm font-bold">
                  <span className="text-emerald-400">Total Money Saved</span>
                  <span className="text-emerald-400">₹{Math.round(discountAmount).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
