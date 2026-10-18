import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type CartItem = { id: string; name: string; price: number };
type Ctx = { items: CartItem[]; add: (i: CartItem) => void; remove: (id: string) => void; clear: () => void; has: (id: string) => boolean };

const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem("dmd_cart") || "[]")); } catch { /* ignore */ }
  }, []);
  const save = (next: CartItem[]) => { setItems(next); localStorage.setItem("dmd_cart", JSON.stringify(next)); };
  return (
    <CartCtx.Provider value={{
      items,
      add: (i) => !items.some((x) => x.id === i.id) && save([...items, i]),
      remove: (id) => save(items.filter((x) => x.id !== id)),
      clear: () => save([]),
      has: (id) => items.some((x) => x.id === id),
    }}>{children}</CartCtx.Provider>
  );
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside provider");
  return c;
}
