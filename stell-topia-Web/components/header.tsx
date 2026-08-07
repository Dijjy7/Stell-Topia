import { Plane } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary p-2">
              <Plane className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Stell-Topia</h1>
              <p className="text-sm text-muted-foreground">Decentralized Flight Booking</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-semibold text-accent">Powered by</p>
              <p className="text-sm font-bold text-foreground">Stellar Network</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
