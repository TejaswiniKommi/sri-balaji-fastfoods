// JSDoc type definitions (kept as plain JS so the project stays JavaScript-only).
// Editors such as VS Code use these for autocomplete.

/**
 * @typedef {Object} Food
 * @property {number|string} id
 * @property {string} name          English name
 * @property {string} [nameTe]      Telugu name (as printed on the menu board)
 * @property {string} category      e.g. 'Fried Rice', 'Noodles', 'Manchurian'
 * @property {string} [variant]     e.g. 'Basmati' | 'Masoor' (fried rice only)
 * @property {number|null} price    Rupees. null = "Price to be confirmed"
 * @property {string} [description]
 * @property {string} [image]       Image URL. Empty = placeholder
 * @property {boolean} [available]
 * @property {boolean} [featured]   Shown in "Featured Items" on the home page
 */

/**
 * @typedef {Object} CartItem
 * @property {number|string} id
 * @property {string} name
 * @property {string} [nameTe]
 * @property {string} [variant]
 * @property {string} category
 * @property {number} price
 * @property {string} [image]
 * @property {number} quantity
 */

/**
 * @typedef {Object} Order
 * @property {string} orderNumber
 * @property {string} customerName
 * @property {string} mobile
 * @property {'delivery'|'pickup'} fulfillment
 * @property {string} [address]
 * @property {string} [notes]
 * @property {CartItem[]} items
 * @property {number} subtotal
 * @property {number} deliveryFee
 * @property {number} total
 * @property {string} createdAt
 * @property {boolean} [isMock]
 */

export {}
