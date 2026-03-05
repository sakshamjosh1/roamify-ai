"use client";
import React from "react";
import Link from "next/link";
import { Zap, Star, ArrowUpRight, Lock } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "$2.99",
    period: "/month",
    trips: "20 trips/day",
    features: ["20 trips per day", "Full itinerary generation", "Hotel recommendations", "Interactive map"],
    icon: <Zap className="h-4 w-4" />,
    accent: "border-blue-200 hover:border-blue-400",
    badge: "bg-blue-50 text-blue-600",
    cta: "bg-gray-900 hover:bg-blue-600",
  },
  {
    name: "Pro",
    price: "$6.99",
    period: "/month",
    trips: "Unlimited trips",
    features: ["Unlimited trips", "Priority AI responses", "PDF export", "Advanced map features"],
    icon: <Star className="h-4 w-4" />,
    accent: "border-orange-200 hover:border-orange-400",
    badge: "bg-orange-50 text-orange-600",
    cta: "bg-orange-500 hover:bg-orange-600",
    popular: true,
  },
];

function LimitReachedUI() {
  return (
    <div className="mt-2">

      {/* Warning bubble */}
      <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-3">
        <Lock className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-red-700">Daily limit reached</p>
          <p className="text-xs text-red-400 mt-0.5">
            Free users can generate 2 trips per day. Upgrade to keep planning.
          </p>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-2 gap-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white border rounded-xl p-4 transition-all duration-150 ${plan.accent}`}
          >
            {/* Popular badge */}
            {plan.popular && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                <span className="bg-orange-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  Popular
                </span>
              </div>
            )}

            {/* Plan header */}
            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium mb-3 ${plan.badge}`}>
              {plan.icon}
              {plan.name}
            </div>

            {/* Price */}
            <div className="mb-3">
              <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
              <span className="text-xs text-gray-400">{plan.period}</span>
              <p className="text-xs text-gray-500 mt-0.5">{plan.trips}</p>
            </div>

            {/* Features */}
            <ul className="space-y-1 mb-4">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <div className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link href="/pricing">
              <button className={`w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-white rounded-lg transition-colors duration-150 ${plan.cta}`}>
                Upgrade <ArrowUpRight className="h-3 w-3" />
              </button>
            </Link>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-[11px] text-gray-400 text-center mt-2">
        Your limit resets at midnight. <Link href="/pricing" className="text-gray-600 underline underline-offset-2">View all plans →</Link>
      </p>

    </div>
  );
}

export default LimitReachedUI;