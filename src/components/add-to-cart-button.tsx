"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { PizzaCustomizeDialog } from "@/components/pizza-customize-dialog";
import { parsePrice } from "@/lib/money";

type Props = {
  name: string;
  price: string;
  image?: string;
  categoryId?: string;
  className?: string;
};

export function AddToCartButton({
  name,
  price,
  image,
  categoryId,
  className = "",
}: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const unitPrice = parsePrice(price);
  const isPizza = categoryId === "pizza";

  return (
    <>
      <button
        type="button"
        className={`btn-order ${added ? "is-ordered" : ""} ${className}`}
        onClick={() => {
          if (isPizza) {
            setCustomizeOpen(true);
            return;
          }
          addItem({ name, unitPrice, image });
          setAdded(true);
          window.setTimeout(() => setAdded(false), 1200);
        }}
      >
        {added ? "V košíku" : "Do košíku"}
      </button>

      {isPizza ? (
        <PizzaCustomizeDialog
          open={customizeOpen}
          onClose={() => setCustomizeOpen(false)}
          name={name}
          basePrice={unitPrice}
          image={image}
        />
      ) : null}
    </>
  );
}
