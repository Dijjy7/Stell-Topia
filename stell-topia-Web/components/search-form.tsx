'use client'

import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'

interface SearchFormProps {
  onSearch: (data: SearchData) => void
}

export interface SearchData {
  from: string
  to: string
  departure: string
  return?: string
  passengers: number
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [data, setData] = useState<SearchData>({
    from: 'JFK',
    to: 'LHR',
    departure: new Date().toISOString().split('T')[0],
    passengers: 1,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(data)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border bg-card p-6 shadow-sm"
    >
      <h2 className="mb-4 text-xl font-bold text-foreground">Search Flights</h2>

      <div className="grid gap-4 md:grid-cols-5">
        <div>
          <label className="block text-sm font-medium text-foreground">From</label>
          <input
            type="text"
            value={data.from}
            onChange={(e) => setData({ ...data, from: e.target.value.toUpperCase() })}
            placeholder="JFK"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">To</label>
          <input
            type="text"
            value={data.to}
            onChange={(e) => setData({ ...data, to: e.target.value.toUpperCase() })}
            placeholder="LHR"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">Departure</label>
          <input
            type="date"
            value={data.departure}
            onChange={(e) => setData({ ...data, departure: e.target.value })}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground">Passengers</label>
          <select
            value={data.passengers}
            onChange={(e) => setData({ ...data, passengers: parseInt(e.target.value) })}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/50"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'Passenger' : 'Passengers'}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <ArrowRight className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </form>
  )
}
