'use client'

import { X } from 'lucide-react'
import { Button } from './ui/button'

interface Flight {
  id: string
  departure: string
  arrival: string
  departureCode: string
  arrivalCode: string
  departureTime: string
  arrivalTime: string
  airline: string
  price: number
  xlmPrice: number
  seats: number
}

interface BookingModalProps {
  flight: Flight | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (flight: Flight) => void
}

export function BookingModal({
  flight,
  isOpen,
  onClose,
  onConfirm,
}: BookingModalProps) {
  if (!isOpen || !flight) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-card">
        <div className="flex items-center justify-between border-b border-border p-6">
          <h3 className="text-lg font-bold text-foreground">Confirm Booking</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 space-y-4">
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm font-semibold text-accent">{flight.airline}</p>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {flight.departureCode}
                  </p>
                  <p className="text-xs text-muted-foreground">{flight.departure}</p>
                </div>
                <div className="h-px flex-1 bg-border" />
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">
                    {flight.arrivalCode}
                  </p>
                  <p className="text-xs text-muted-foreground">{flight.arrival}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Departure: {flight.departureTime}</span>
                <span className="text-muted-foreground">Arrival: {flight.arrivalTime}</span>
              </div>
            </div>

            <div className="space-y-2 border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Fare</span>
                <span className="font-semibold text-foreground">${flight.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxes & Fees</span>
                <span className="font-semibold text-foreground">$0</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="font-bold text-foreground">Total</span>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">${flight.price}</p>
                  <p className="text-sm text-muted-foreground">{flight.xlmPrice.toFixed(2)} XLM</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-accent/30 bg-accent/5 p-3">
              <p className="text-xs font-semibold text-accent">Stellar Advantage</p>
              <p className="mt-1 text-xs text-foreground">
                ✓ Sub-5-second settlement <br />
                ✓ No hidden fees <br />✓ Cross-border ready
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => onConfirm(flight)}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Proceed to Payment
            </Button>
            <Button
              onClick={onClose}
              className="w-full bg-muted text-foreground hover:bg-muted/80"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
