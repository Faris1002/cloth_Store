import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export const CartSummary = () => {
  const { summary, totalItems, clearCart, loading } = useCart();
  const { showToast } = useToast();
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const subtotal = summary.subtotal || 0;
  const freeShippingThreshold = 75.0;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingCost = isFreeShipping || subtotal === 0 ? 0 : 7.99;
  const estimatedTax = Number((subtotal * 0.06).toFixed(2));
  const grandTotal = Number((subtotal + shippingCost + estimatedTax).toFixed(2));

  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleCheckout = async () => {
    setCheckingOut(true);
    // Simulate real order processing delay
    setTimeout(async () => {
      await clearCart();
      setCheckingOut(false);
      setCheckoutComplete(true);
      showToast('Thank you! Your order has been placed successfully.', 'success', 6000);
    }, 1500);
  };

  if (checkoutComplete) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-4">
        <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-emerald-950">Order Confirmed!</h3>
        <p className="text-sm text-emerald-800 leading-relaxed">
          Your payment was processed securely. An invoice and tracking link will be sent to your email.
        </p>
        <button
          onClick={() => setCheckoutComplete(false)}
          className="text-xs font-semibold text-emerald-700 underline hover:text-emerald-900"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle space-y-6">
      <h3 className="text-lg font-bold text-slate-900">Order Summary</h3>

      {/* Free Shipping Progress Indicator */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span>
            {isFreeShipping ? (
              <span className="text-emerald-600 flex items-center gap-1">
                🎉 Free Standard Shipping Unlocked!
              </span>
            ) : (
              `Add $${amountToFreeShipping.toFixed(2)} more for Free Shipping`
            )}
          </span>
          <span className="text-slate-500">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
          <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Estimated Shipping</span>
          <span className="font-semibold text-slate-900">
            {isFreeShipping ? (
              <span className="text-emerald-600 font-bold uppercase text-xs">Free</span>
            ) : (
              `$${shippingCost.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Estimated Tax (6%)</span>
          <span className="font-semibold text-slate-900">${estimatedTax.toFixed(2)}</span>
        </div>

        <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
          <span className="text-base font-bold text-slate-900">Total</span>
          <span className="text-2xl font-black text-slate-900">${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout button */}
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading || checkingOut || totalItems === 0}
        className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {checkingOut ? (
          'Processing Secure Payment...'
        ) : (
          <>
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Clear Cart Button */}
      {totalItems > 0 && (
        <button
          type="button"
          onClick={clearCart}
          disabled={loading}
          className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-rose-600 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear entire shopping bag
        </button>
      )}

      {/* Security guarantee */}
      <div className="border-t border-slate-100 pt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>256-Bit SSL Encrypted Checkout</span>
      </div>
    </div>
  );
};

export default CartSummary;
