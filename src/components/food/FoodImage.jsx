import { useEffect, useState } from 'react'
import { getCategoryMeta } from '../../data/categories'

// Noodles
import vegNoodlesImage from '../../assets/foods/veg-noodles.jpg'
import eggNoodlesImage from '../../assets/foods/egg-noodles.jpg'
import gobiNoodlesImage from '../../assets/foods/gobi-noodles.jpg'
import chickenNoodlesImage from '../../assets/foods/chicken-noodles.jpg'
import paneerNoodlesImage from '../../assets/foods/paneer-noodles.jpg'
import kajuNoodlesImage from '../../assets/foods/kaju-noodles.jpg'

// Fried Rice
import vegFriedRiceImage from '../../assets/foods/veg-fried-rice.jpg'
import eggFriedRiceImage from '../../assets/foods/egg-fried-rice.jpg'
import gobiFriedRiceImage from '../../assets/foods/gobi-fried-rice.jpg'
import chickenFriedRiceImage from '../../assets/foods/chicken-fried-rice.jpg'
import paneerFriedRiceImage from '../../assets/foods/paneer-fried-rice.jpg'
import kajuFriedRiceImage from '../../assets/foods/kaju-fried-rice.jpg'

// Manchurian
import gobiManchurianImage from '../../assets/foods/gobi-manchurian.jpg'
import chickenManchurianImage from '../../assets/foods/chicken-manchurian.jpg'

// Normal Rice
import chickenRiceImage from '../../assets/foods/chicken-rice.jpg'
import eggRiceImage from '../../assets/foods/egg-rice.jpg'
import gobiRiceImage from '../../assets/foods/gobi-rice.jpg'
import vegRiceImage from '../../assets/foods/veg-rice.jpg'

const foodImages = {
  // Noodles
  'veg noodles': vegNoodlesImage,
  'egg noodles': eggNoodlesImage,
  'gobi noodles': gobiNoodlesImage,
  'chicken noodles': chickenNoodlesImage,
  'paneer noodles': paneerNoodlesImage,
  'kaju noodles': kajuNoodlesImage,

  // Fried Rice
  'veg fried rice': vegFriedRiceImage,
  'egg fried rice': eggFriedRiceImage,
  'gobi fried rice': gobiFriedRiceImage,
  'chicken fried rice': chickenFriedRiceImage,
  'paneer fried rice': paneerFriedRiceImage,
  'kaju fried rice': kajuFriedRiceImage,

  // Manchurian
  'gobi manchurian': gobiManchurianImage,
  'chicken manchurian': chickenManchurianImage,

  // Normal Rice
  'chicken rice': chickenRiceImage,
  'egg rice': eggRiceImage,
  'gobi rice': gobiRiceImage,
  'veg rice': vegRiceImage,
}

export default function FoodImage({
  food,
  className = '',
  showCaption = true,
}) {
  const [failed, setFailed] = useState(false)

  const foodName = food.name?.trim().toLowerCase() || ''

  const image = foodImages[foodName] || food.image

  useEffect(() => {
    setFailed(false)
  }, [image])

  const meta = getCategoryMeta(food.category)

  if (image && !failed) {
    return (
      <img
        src={image}
        alt={food.name}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`object-cover ${className}`}
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={`${food.name}: photo coming soon`}
      className={`flex flex-col items-center justify-center ${meta.tint} ${className}`}
    >
      <span
        className="text-5xl sm:text-6xl"
        aria-hidden="true"
      >
        {meta.emoji}
      </span>

      {showCaption && (
        <span className="mt-1 text-xs font-semibold text-ink-muted">
          Photo coming soon
        </span>
      )}
    </div>
  )
}