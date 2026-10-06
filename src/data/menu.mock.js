// ---------------------------------------------------------------------------
// Sample menu data. Source of truth: photos of the Sri Balaji Fastfoods menu board.
//
//  - Prices are exactly the ones on the board (handwritten slips) plus the price
//    the owner confirmed in chat (Kaju Noodles ₹140).
//  - price: null  means "Price to be confirmed". Those items cannot be ordered
//    until a price is set (use the Admin page, or edit this file).
//  - image: ''    means no real photo yet; a clean placeholder is shown.
//    Put a real photo URL (e.g. '/images/veg-fried-rice.jpg' from /public/images)
//    to replace it.
//  - description is only a plain-language description of the item name.
// ---------------------------------------------------------------------------
export const MOCK_FOODS = [
  // ---- Fried Rice (Basmati Rice / బాస్మతి రైస్) ----
  { id: 1, name: 'Veg Fried Rice', nameTe: 'వెజ్ ఫ్రైడ్‌రైస్', category: 'Fried Rice', variant: 'Basmati', price: 80, description: 'Basmati fried rice with vegetables.', image: '', available: true, featured: true },
  { id: 2, name: 'Egg Fried Rice', nameTe: 'ఎగ్ ఫ్రైడ్‌రైస్', category: 'Fried Rice', variant: 'Basmati', price: 90, description: 'Basmati fried rice with egg.', image: '', available: true, featured: false },
  { id: 3, name: 'Gobi Fried Rice', nameTe: 'గోబి ఫ్రైడ్‌రైస్', category: 'Fried Rice', variant: 'Basmati', price: 100, description: 'Basmati fried rice with gobi (cauliflower).', image: '', available: true, featured: false },
  { id: 4, name: 'Chicken Fried Rice', nameTe: 'చికెన్ ఫ్రైడ్‌రైస్', category: 'Fried Rice', variant: 'Basmati', price: 120, description: 'Basmati fried rice with chicken.', image: '', available: true, featured: true },
  { id: 5, name: 'Paneer Fried Rice', nameTe: 'పన్నీర్ ఫ్రైడ్‌రైస్', category: 'Fried Rice', variant: 'Basmati', price: 140, description: 'Basmati fried rice with paneer.', image: '', available: true, featured: false },
  { id: 6, name: 'Kaju Fried Rice', nameTe: 'కాజు ఫ్రైడ్‌రైస్', category: 'Fried Rice', variant: 'Basmati', price: null, description: 'Basmati fried rice with kaju (cashew).', image: '', available: true, featured: false },

  // ---- Fried Rice (Masoor Rice / మసూర రైస్) ----
  { id: 7, name: 'Veg Fried Rice', nameTe: 'వెజ్ ఫ్రైడ్‌రైస్', category: 'Fried Rice', variant: 'Masoor', price: 70, description: 'Masoor rice fried rice with vegetables.', image: '', available: true, featured: false },
  { id: 8, name: 'Egg Fried Rice', nameTe: 'ఎగ్ ఫ్రైడ్‌రైస్', category: 'Fried Rice', variant: 'Masoor', price: 80, description: 'Masoor rice fried rice with egg.', image: '', available: true, featured: false },
  { id: 9, name: 'Gobi Fried Rice', nameTe: 'గోబి ఫ్రైడ్‌రైస్', category: 'Fried Rice', variant: 'Masoor', price: 90, description: 'Masoor rice fried rice with gobi (cauliflower).', image: '', available: true, featured: false },
  { id: 10, name: 'Chicken Fried Rice', nameTe: 'చికెన్ ఫ్రైడ్‌రైస్', category: 'Fried Rice', variant: 'Masoor', price: 100, description: 'Masoor rice fried rice with chicken.', image: '', available: true, featured: false },

  // ---- Manchurian ----
  { id: 11, name: 'Gobi Manchurian', nameTe: 'గోబి మంచూరియా', category: 'Manchurian', variant: '', price: 100, description: 'Gobi (cauliflower) Manchurian.', image: '', available: true, featured: true },
  { id: 12, name: 'Chicken Manchurian', nameTe: 'చికెన్ మంచూరియా', category: 'Manchurian', variant: '', price: 200, description: 'Chicken Manchurian.', image: '', available: true, featured: true },

  // ---- Noodles ----
  { id: 13, name: 'Veg Noodles', nameTe: 'వెజ్ నూడిల్స్', category: 'Noodles', variant: '', price: 70, description: 'Noodles with vegetables.', image: '', available: true, featured: false },
  { id: 14, name: 'Egg Noodles', nameTe: 'ఎగ్ నూడిల్స్', category: 'Noodles', variant: '', price: 80, description: 'Noodles with egg.', image: '', available: true, featured: true },
  { id: 15, name: 'Gobi Noodles', nameTe: 'గోబి నూడిల్స్', category: 'Noodles', variant: '', price: 90, description: 'Noodles with gobi (cauliflower).', image: '', available: true, featured: false },
  { id: 16, name: 'Chicken Noodles', nameTe: 'చికెన్ నూడిల్స్', category: 'Noodles', variant: '', price: 100, description: 'Noodles with chicken.', image: '', available: true, featured: true },
  { id: 17, name: 'Paneer Noodles', nameTe: 'పన్నీర్ నూడిల్స్', category: 'Noodles', variant: '', price: 140, description: 'Noodles with paneer.', image: '', available: true, featured: false },
  { id: 18, name: 'Kaju Noodles', nameTe: 'కాజు నూడిల్స్', category: 'Noodles', variant: '', price: 140, description: 'Noodles with kaju (cashew).', image: '', available: true, featured: false },
]
