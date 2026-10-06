import { Pencil, Trash2 } from 'lucide-react'
import { getVariantLabel } from '../../data/categories'
import { formatPrice, hasPrice } from '../../utils/format'

const iconBtn =
  'flex h-11 w-11 items-center justify-center rounded-full text-ink-soft transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600'

export default function FoodTable({ foods, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
      <table className="w-full min-w-[640px] text-left">
        <caption className="sr-only">Menu items</caption>
        <thead className="bg-cream-100 text-sm text-ink-soft">
          <tr>
            <th scope="col" className="px-4 py-3 font-bold">Item</th>
            <th scope="col" className="px-4 py-3 font-bold">Category</th>
            <th scope="col" className="px-4 py-3 font-bold">Price</th>
            <th scope="col" className="px-4 py-3 font-bold">Status</th>
            <th scope="col" className="px-4 py-3 text-right font-bold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cream-200">
          {foods.map((f) => (
            <tr key={f.id}>
              <td className="px-4 py-3">
                <p className="font-bold text-ink">{f.name}</p>
                {f.nameTe && <p lang="te" className="font-telugu text-sm text-ink-soft">{f.nameTe}</p>}
              </td>
              <td className="px-4 py-3 text-ink-soft">
                {f.category}
                {f.variant && <span className="block text-sm text-ink-muted">{getVariantLabel(f.variant).en}</span>}
              </td>
              <td className={`px-4 py-3 font-bold ${hasPrice(f) ? 'text-ink' : 'text-saffron-700'}`}>{formatPrice(f.price)}</td>
              <td className="px-4 py-3 text-sm">
                <span className={`rounded-full px-2.5 py-1 font-bold ${f.available === false ? 'bg-cream-200 text-ink-soft' : 'bg-leaf-100 text-leaf-700'}`}>
                  {f.available === false ? 'Unavailable' : 'Available'}
                </span>
                {f.featured && <span className="ml-2 rounded-full bg-sun-100 px-2.5 py-1 font-bold text-ink">Featured</span>}
              </td>
              <td className="px-4 py-2">
                <div className="flex justify-end gap-1">
                  <button type="button" className={`${iconBtn} hover:bg-cream-200`} onClick={() => onEdit(f)} aria-label={`Edit ${f.name}${f.variant ? ` (${f.variant})` : ''}`}>
                    <Pencil className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button type="button" className={`${iconBtn} hover:bg-brand-50 hover:text-brand-700`} onClick={() => onDelete(f)} aria-label={`Delete ${f.name}${f.variant ? ` (${f.variant})` : ''}`}>
                    <Trash2 className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
