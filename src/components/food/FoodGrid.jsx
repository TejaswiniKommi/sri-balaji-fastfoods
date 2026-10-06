import FoodCard from './FoodCard'

const gridClasses = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

export default function FoodGrid({ foods }) {
  return (
    <div className={gridClasses}>
      {foods.map((food) => (
        <FoodCard key={food.id} food={food} />
      ))}
    </div>
  )
}

/** Skeleton cards shown while the menu loads. */
export function FoodGridSkeleton({ count = 8 }) {
  return (
    <div className={gridClasses} role="status" aria-label="Loading menu">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-44 animate-pulse rounded-2xl bg-cream-200 sm:h-80" />
      ))}
    </div>
  )
}
