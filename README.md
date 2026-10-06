# Sri Balaji Fastfoods: ordering website (frontend)

React + Vite + React Router + Tailwind CSS. Talks to your existing **Spring Boot** backend
(`http://localhost:8080`). No new backend, database, Firebase or Supabase is included.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in /dist
```

## Settings (`.env`)

| Variable | Default | Meaning |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080` | Your Spring Boot URL |
| `VITE_USE_MOCK` | `true` | `true` = sample menu from `src/data/menu.mock.js`; `false` = real `/api/foods` |
| `VITE_USE_MOCK_ORDERS` | `true` | `true` = fake order submission; `false` = `POST /api/orders` |
| `VITE_DELIVERY_FEE` | `0` | Delivery fee in ₹ (applies to Delivery orders only) |

Restart `npm run dev` after editing `.env`.

## Switching to your Spring Boot Food API

1. Set `VITE_USE_MOCK=false` in `.env`.
2. Allow the frontend origin in Spring Boot (CORS):

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
    }
}
```

3. If your `Food` entity uses different field names, edit **only** `normalizeFood()` and `toApiFood()`
   at the top of `src/services/foodService.js`. The UI expects:

| UI field | Meaning | Notes |
|---|---|---|
| `id` | id | |
| `name` | English name | |
| `nameTe` | Telugu name | also accepts `name_te` / `teluguName` |
| `category` | `Fried Rice`, `Manchurian`, `Noodles` | must match text in `src/data/categories.js` |
| `variant` | `Basmati` / `Masoor` or empty | fried rice only |
| `price` | number, or `null` | `null` shows "Price to be confirmed" and blocks ordering |
| `description` | text | |
| `imageUrl` (or `image`) | image URL | empty = "Photo coming soon" placeholder |
| `available`, `featured` | booleans | optional; default `true` / `false` |

The list endpoint can return a plain array or a Spring `Page` (`content`).

## Orders

`src/services/orderService.js` is kept separate from the food API. With `VITE_USE_MOCK_ORDERS=true` an order
number is generated in the browser and nothing is sent. When your order endpoint is ready, set it to `false`.
The assumed contract is `POST /api/orders` with
`{ customerName, mobile, fulfillment: "DELIVERY"|"PICKUP", address, notes, items: [{ foodId, quantity }] }`.
Adjust `toApiOrder()` / `normalizeOrder()` to match your DTO. Let the server calculate prices from the database.

## Things to fill in

* **Contact details**: `src/data/config.js` → `CONTACT` (phone, WhatsApp, address, hours, map link). Empty fields show "Coming soon".
* **Food photos**: put images in `public/images/` and set `image: '/images/veg-noodles.jpg'` on the item
  (in `menu.mock.js` or on the Admin page). Until then a placeholder is shown.
* **Prices to confirm**: Kaju Fried Rice (Basmati) has `price: null` in `src/data/menu.mock.js`.
* **Featured items** on the home page are items with `featured: true`.
* **Juices & drinks / other categories**: none are on the confirmed menu, so none are shown. To add one later,
  add the items and add the category to `src/data/categories.js`.
* **Admin page** is at `/admin/menu` and has **no login yet**. Protect it before going live.

## Structure

```
src/
  components/   layout/ food/ cart/ checkout/ admin/ ui/
  pages/        Home, Menu, FoodDetails, Cart, Checkout, OrderSuccess, About, Admin, NotFound
  services/     apiClient.js, foodService.js, orderService.js   (all API calls live here)
  hooks/        useFoods, useFoodDetails, useCart
  context/      CartContext (cart saved in localStorage)
  data/         config.js, categories.js, menu.mock.js
  types/        JSDoc type definitions
  utils/        price formatting, menu helpers
```

Telugu text uses the Noto Sans Telugu font (loaded from Google Fonts) and is marked with `lang="te"`.
