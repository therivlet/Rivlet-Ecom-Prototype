import type { Colorway } from './data/products'
import { getProduct } from './data/products'

export interface WishLine {
  key: string
  productId: string
  color: Colorway
  savedAt: number
}

const STORAGE_KEY = 'rivlet-wishlist-v1'

type Listener = () => void
const listeners = new Set<Listener>()

function read(): WishLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as WishLine[]
  } catch {
    return []
  }
}

function write(lines: WishLine[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  listeners.forEach((l) => l())
}

function lineKey(productId: string, color: Colorway): string {
  return `${productId}__${color}`
}

export function subscribeWishlist(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getWishlist(): WishLine[] {
  return read().slice().sort((a, b) => b.savedAt - a.savedAt)
}

export function wishlistCount(): number {
  return read().length
}

export function isWishlisted(productId: string, color?: Colorway): boolean {
  const lines = read()
  if (color) return lines.some((l) => l.productId === productId && l.color === color)
  return lines.some((l) => l.productId === productId)
}

export function toggleWishlist(productId: string, color: Colorway): boolean {
  const product = getProduct(productId)
  if (!product) return false
  const key = lineKey(productId, color)
  const lines = read()
  const existing = lines.find((l) => l.key === key)
  if (existing) {
    write(lines.filter((l) => l.key !== key))
    return false
  }
  lines.push({ key, productId, color, savedAt: Date.now() })
  write(lines)
  return true
}

export function removeWishlist(key: string): void {
  write(read().filter((l) => l.key !== key))
}

export function clearWishlist(): void {
  write([])
}
