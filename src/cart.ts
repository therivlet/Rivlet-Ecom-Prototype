import type { Colorway, Size } from './data/products'
import { getProduct } from './data/products'

export interface CartLine {
  key: string
  productId: string
  color: Colorway
  size: Size
  qty: number
}

const STORAGE_KEY = 'rivlet-cart-v1'

type Listener = () => void

const listeners = new Set<Listener>()

function read(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as CartLine[]
  } catch {
    return []
  }
}

function write(lines: CartLine[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  listeners.forEach((l) => l())
}

export function subscribeCart(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getCart(): CartLine[] {
  return read()
}

export function cartCount(): number {
  return read().reduce((n, l) => n + l.qty, 0)
}

export function cartSubtotal(): number {
  return read().reduce((sum, line) => {
    const p = getProduct(line.productId)
    return sum + (p?.mrp ?? 0) * line.qty
  }, 0)
}

function lineKey(productId: string, color: Colorway, size: Size): string {
  return `${productId}__${color}__${size}`
}

export function addToCart(productId: string, color: Colorway, size: Size, qty = 1): void {
  const lines = read()
  const key = lineKey(productId, color, size)
  const existing = lines.find((l) => l.key === key)
  if (existing) existing.qty += qty
  else lines.push({ key, productId, color, size, qty })
  write(lines)
}

export function setQty(key: string, qty: number): void {
  let lines = read()
  if (qty <= 0) {
    lines = lines.filter((l) => l.key !== key)
  } else {
    const line = lines.find((l) => l.key === key)
    if (line) line.qty = qty
  }
  write(lines)
}

export function removeLine(key: string): void {
  write(read().filter((l) => l.key !== key))
}

export function clearCart(): void {
  write([])
}

export function addCoordSet(color: Colorway, size: Size): void {
  addToCart('RVL-TNK-003-C', color, size, 1)
  addToCart('RVL-SHT-004', color, size, 1)
}
