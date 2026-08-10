'use client'

import { useState } from 'react'
import { BookingModal } from '@/components/booking-modal'
import { ConfirmationScreen } from '@/components/confirmation-screen'
import { FlightCard } from '@/components/flight-card'
import { Header } from '@/components/header'
import { PaymentScreen } from '@/components/payment-screen'
import { SearchForm, SearchData } from '@/components/search-form'

type Screen = 'search' | 'results' | 'payment' | 'confirmation'

interface Flight {
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
}

const mockFlights: Flight[] = [
  {
    id: 'SQ001',
    departure: 'New York',
    arrival: 'London',
    departureCode: 'JFK',
    arrivalCode: 'LHR',
    departureTime: '10:00 AM',
    arrivalTime: '10:15 PM',
    duration: '7h 15m',
    airline: 'Stellar Airways',
    price: 450,
    xlmPrice: 1125,
    seats: 12,
  },
  {
    id: 'BA002',
    departure: 'New York',
    arrival: 'London',
    departureCode: 'JFK',
    arrivalCode: 'LHR',
    departureTime: '2:30 PM',
    arrivalTime: '2:45 AM+1',
    duration: '7h 15m',
    airline: 'British Airways',
    price: 520,
    xlmPrice: 1300,
    seats: 8,
  },
  {
    id: 'AA003',
    departure: 'New York',
    arrival: 'London',
    departureCode: 'JFK',
    arrivalCode: 'LHR',
    departureTime: '6:00 PM',
    arrivalTime: '6:20 AM+1',
    duration: '7h 20m',
    airline: 'American Airlines',
    price: 385,
    xlmPrice: 962.5,
    seats: 5,
  },
  {
    id: 'VS004',
    departure: 'New York',
    arrival: 'London',
    departureCode: 'JFK',
    arrivalCode: 'LHR',
    departureTime: '8:45 PM',
    arrivalTime: '9:00 AM+1',
    duration: '7h 15m',
    airline: 'Virgin Atlantic',
    price: 495,
    xlmPrice: 1237.5,
    seats: 15,
  },
]

export default function Page() {
  const [screen, setScreen] = useState<Screen>('search')
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState('')

  const handleSearch = (data: SearchData) => {
    setScreen('results')
  }

  const handleSelectFlight = (id: string) => {
    const flight = mockFlights.find((f) => f.id === id)
    if (flight) {
      setSelectedFlight(flight)
      setShowBookingModal(true)
    }
  }

  const handleConfirmBooking = (flight: Flight) => {
    setSelectedFlight(flight)
    setShowBookingModal(false)
    setScreen('payment')
  }

  const handlePaymentComplete = () => {
    const code = `STT${Date.now().toString().slice(-8).toUpperCase()}`
    setConfirmationCode(code)
    setScreen('confirmation')
  }

  const handleReset = () => {
    setScreen('search')
    setSelectedFlight(null)
    setConfirmationCode('')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {screen === 'search' && (
          <div className="space-y-8">
            <SearchForm onSearch={handleSearch} />
          </div>
        )}

        {screen === 'results' && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-2 text-2xl font-bold text-foreground">
                Available Flights
              </h2>
              <p className="text-muted-foreground">
                JFK → LHR • 4 direct flights found
              </p>
            </div>

            <div className="space-y-4">
              {mockFlights.map((flight) => (
                <FlightCard
                  key={flight.id}
                  {...flight}
                  onSelect={handleSelectFlight}
                />
              ))}
            </div>
          </div>
        )}

        {screen === 'payment' && selectedFlight && (
          <PaymentScreen
            flight={selectedFlight}
            onBack={() => setScreen('results')}
            onComplete={handlePaymentComplete}
          />
        )}

        {screen === 'confirmation' && selectedFlight && (
          <ConfirmationScreen
            flight={selectedFlight}
            confirmationCode={confirmationCode}
            onReset={handleReset}
          />
        )}
      </main>

      <BookingModal
        flight={selectedFlight}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onConfirm={handleConfirmBooking}
      />
    </div>
  )
}
