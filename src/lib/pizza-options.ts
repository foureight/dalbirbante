export type PizzaExtra = {
  id: string;
  name: string;
  price: number;
};

export const GLUTEN_FREE_PIZZA_SURCHARGE = 99;
export const GLUTEN_FREE_PASTA_SURCHARGE = 29;

/** Přísady navíc podle menu Dal Birbante */
export const PIZZA_EXTRAS: PizzaExtra[] = [
  { id: "oregano", name: "oregano", price: 15 },
  { id: "olivovy-olej", name: "olivový olej", price: 15 },
  { id: "bazalka", name: "bazalka", price: 15 },
  { id: "chilli", name: "chilli", price: 15 },
  { id: "cesnek", name: "česnek", price: 15 },
  { id: "pistacie", name: "pistácie", price: 15 },
  { id: "rukola", name: "rukola", price: 20 },
  { id: "cibule", name: "cibule", price: 20 },
  { id: "kapary", name: "kapary", price: 25 },
  { id: "grana-padano", name: "Grana Padano", price: 25 },
  { id: "pecorino", name: "pecorino romano", price: 25 },
  { id: "drcena-rajcata", name: "drcená rajčata", price: 30 },
  { id: "gorgonzola", name: "gorgonzola", price: 30 },
  { id: "scamorza", name: "uzená scamorza", price: 30 },
  { id: "ricotta", name: "ricotta", price: 30 },
  { id: "zampiony", name: "žampiony", price: 35 },
  { id: "artycoky", name: "artyčoky", price: 35 },
  { id: "sunka", name: "dušená šunka", price: 35 },
  { id: "olivy", name: "olivy taggiasche", price: 40 },
  { id: "lilek", name: "lilek", price: 40 },
  { id: "cuketa", name: "cuketa", price: 40 },
  { id: "mozzarella", name: "mozzarella fior di latte", price: 40 },
  { id: "stracchino", name: "stracchino", price: 40 },
  { id: "stracciatella", name: "stracciatella", price: 40 },
  { id: "spianata", name: "pikantní salám spianata romana", price: 40 },
  { id: "ancovicky", name: "ančovičky", price: 40 },
  { id: "tunak", name: "tuňák", price: 40 },
  { id: "mortadella", name: "mortadella", price: 40 },
  { id: "salsiccia", name: "salsiccia", price: 50 },
  { id: "parmska", name: "parmská šunka", price: 70 },
];

export function slugExtra(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
