'use client'

import { Clock, MapPin, Users } from 'lucide-react'
import { Button } from './ui/button'

interface FlightCardProps {
  id: string
  departure: string
  arrival: string
  departureCode: string
  arrivalCode: string
  departureTime: string
  arrivalTime: string
  duration: string
  airline: string
  price: number
  xlmPrice: number
  seats: number
  onSelect: (id: string) => void
}

export function FlightCard({
  id,
  departure,
  arrival,
  departureCode,
  arrivalCode,
  departureTime,
  arrivalTime,
  duration,
  airline,
  price,
  xlmPrice,
  seats,
  onSelect,
}: FlightCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 transition-all hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-accent">{airline}</p>
          <p className="text-xs text-muted-foreground">Direct Flight</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">${price}</p>
          <p className="text-sm text-muted-foreground">{xlmPrice.toFixed(2)} XLM</p>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex flex-col items-center">
          <p className="text-lg font-bold text-foreground">{departureTime}</p>
          <p className="text-sm font-semibold text-foreground">{departureCode}</p>
          <p className="text-xs text-muted-foreground">{departure}</p>
        </div>

        <div className="flex flex-1 flex-col items-center gap-2 px-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">{duration}</span>
          </div>
          <div className="h-px w-full bg-border" />
        </div>

        <div className="flex flex-col items-center">
          <p className="text-lg font-bold text-foreground">{arrivalTime}</p>
          <p className="text-sm font-semibold text-foreground">{arrivalCode}</p>
          <p className="text-xs text-muted-foreground">{arrival}</p>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4 border-t border-border pt-4">
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{seats} seats left</span>
        </div>
      </div>

      <Button
        onClick={() => onSelect(id)}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Select Flight
      </Button>
    </div>
  )
}
