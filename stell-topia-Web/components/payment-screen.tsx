'use client'

import { Wallet, Zap } from 'lucide-react'
import { useState } from 'react'
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

interface PaymentScreenProps {
  flight: Flight
  onBack: () => void
  onComplete: () => void
}

export function PaymentScreen({
  flight,
  onBack,
  onComplete,
}: PaymentScreenProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')

  const handlePay = async () => {
    if (!walletAddress.trim()) {
      alert('Please enter your Stellar wallet address')
      return
    }

    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    onComplete()
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={onBack}
        className="mb-6 text-sm text-primary hover:text-primary/80"
      >
        ← Back to Results
      </button>

      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-bold text-foreground">Payment Summary</h2>

          <div className="space-y-3 border-b border-border pb-4">
            <div className="flex justify-between">
              <span className="text-foreground">
                {flight.departureCode} → {flight.arrivalCode}
              </span>
              <span className="font-semibold text-foreground">${flight.price}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{flight.airline} • Direct</span>
              <span>
                {flight.departureTime} - {flight.arrivalTime}
              </span>
            </div>
          </div>

          <div className="space-y-2 py-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base Fare</span>
              <span className="font-semibold text-foreground">${flight.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stellar Network Fee</span>
              <span className="font-semibold text-foreground">$0.01</span>
            </div>
            <div className="border-t border-border pt-2">
              <div className="flex justify-between">
                <span className="font-bold text-foreground">Total</span>
                <div>
                  <p className="text-lg font-bold text-primary">${flight.price}</p>
                  <p className="text-sm text-muted-foreground">
                    ≈ {flight.xlmPrice.toFixed(2)} XLM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4 font-bold text-foreground">Stellar Wallet</h3>

          <div className="mb-4 space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Wallet Address
            </label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="G..."
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
            <p className="text-xs text-muted-foreground">
              Your 56-character Stellar account address (public key)
            </p>
          </div>

          <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-accent">Fast Settlement</p>
                <p className="mt-1 text-xs text-foreground">
                  Your payment will settle on the Stellar network in under 5 seconds.
                  No intermediary, no waiting, no surprises.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handlePay}
            disabled={isProcessing || !walletAddress.trim()}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Wallet className="h-4 w-4" />
            {isProcessing ? 'Processing Payment...' : 'Pay with Stellar Wallet'}
          </Button>
          <Button
            onClick={onBack}
            className="w-full bg-muted text-foreground hover:bg-muted/80"
          >
            Cancel Payment
          </Button>
        </div>
      </div>
    </div>
  )
}
