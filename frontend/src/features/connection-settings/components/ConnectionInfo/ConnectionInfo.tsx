export function ConnectionInfo() {
    const stratumAddresses = [
        'stratum+tcp://btc.demo.0xstratix.com:3333',
        'stratum+tcp://btc.demo.0xstratix.com:443',
        'stratum+tcp://btc.demo.0xstratix.com:25',
    ]

    return (
        <div className="max-w-2xl">
            {/* Single Connection Settings Block */}
            <div className="bg-[#222222] border border-border rounded-xl p-6 h-full flex flex-col">
                {/* Title with DNS */}
                <div className="mb-6">
                    <h3 className="text-text-white text-sm mb-1 font-semibold">Connection Settings</h3>
                    <div className="text-text-muted text-sm mb-3">Available mining pool endpoints and DNS
                        configuration
                    </div>

                    {/* DNS Info */}
                    <div className="flex items-center gap-2 text-text-muted text-sm bg-[#1A1A1A] p-3 rounded-lg">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                            <path d="M10 2L2 7L10 12L18 7L10 2Z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M2 12L10 17L18 12" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span className="text-text-white font-medium">DNS: 5.187.3.197</span>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border my-6"></div>

                {/* Stratum List */}
                <div className="space-y-3 flex-1">
                    <h4 className="text-text-white text-sm font-semibold mb-3">Stratum Addresses</h4>
                    {stratumAddresses.map((address, index) => (
                        <div key={index} className="flex items-center justify-between bg-[#1A1A1A] p-3 rounded-lg">
                            <span className="text-text-primary text-sm font-mono">{address}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}