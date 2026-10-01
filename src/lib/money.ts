export function parsePrice(price: string): number {
  const digits = price.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

export function formatPrice(amount: number): string {
  return `${amount}\u00A0Kč`;
}
