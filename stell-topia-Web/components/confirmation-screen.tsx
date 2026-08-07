'use client'

import { CheckCircle, Copy, Download } from 'lucide-react'
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
}

interface ConfirmationScreenProps {
  flight: Flight
  confirmationCode: string
  onReset: () => void
}

export function ConfirmationScreen({
  flight,
  confirmationCode,
  onReset,
}: ConfirmationScreenProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(confirmationCode)
    alert('Confirmation code copied!')
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <CheckCircle className="h-16 w-16 text-accent" />
        </div>
        <h2 className="mb-2 text-3xl font-bold text-foreground">
          Booking Confirmed!
        </h2>
        <p className="text-muted-foreground">
          Your flight is booked and secured on the Stellar ledger
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-6">
          <div className="mb-4">
            <p className="text-sm font-semibold text-accent">Confirmation Code</p>
            <p className="mt-2 flex items-center justify-between rounded-lg bg-background px-4 py-3 font-mono text-lg font-bold text-foreground">
              {confirmationCode}
              <button
                onClick={handleCopy}
                className="text-primary hover:text-primary/80"
              >
                <Copy className="h-5 w-5" />
              </button>
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4 font-bold text-foreground">Flight Details</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Airline</p>
                <p className="font-semibold text-foreground">{flight.airline}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Confirmation Code</p>
                <p className="font-mono text-sm font-bold text-foreground">
                  {flight.id.substring(0, 6).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
              <div>
                <p className="text-sm text-muted-foreground">Departure</p>
                <p className="text-lg font-bold text-foreground">
                  {flight.departureCode}
                </p>
                <p className="text-xs text-muted-foreground">{flight.departure}</p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {flight.departureTime}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Arrival</p>
                <p className="text-lg font-bold text-foreground">
                  {flight.arrivalCode}
                </p>
                <p className="text-xs text-muted-foreground">{flight.arrival}</p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {flight.arrivalTime}
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seat Assignment</span>
                <span className="font-semibold text-accent">12A</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="text-muted-foreground">Total Paid</span>
                <span>
                  <p className="font-bold text-primary">${flight.price}</p>
                  <p className="text-xs text-muted-foreground">
                    {flight.xlmPrice.toFixed(2)} XLM
                  </p>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-3 font-bold text-foreground">Next Steps</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Check your email for booking details</li>
            <li>✓ Your ticket is ready to download or print</li>
            <li>✓ Arrive at the airport 2 hours before departure</li>
            <li>✓ Your transaction is on the Stellar ledger forever</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            <Download className="h-4 w-4" />
            Download Ticket
          </Button>
          <Button
            onClick={onReset}
            className="w-full bg-muted text-foreground hover:bg-muted/80"
          >
            Book Another Flight
          </Button>
        </div>
      </div>
    </div>
  )
}
