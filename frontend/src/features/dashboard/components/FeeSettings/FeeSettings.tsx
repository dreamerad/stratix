import {useState} from 'react'
import {Toggle} from '@/shared/ui'

export function FeeSettings() {
    const [devFeeEnabled, setDevFeeEnabled] = useState(true)
    const [customFeeEnabled, setCustomFeeEnabled] = useState(false)
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dev fee return */}
            <div className="bg-[#222222] border border-border rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <Toggle
                            checked={devFeeEnabled}
                            onChange={setDevFeeEnabled}
                        />
                        <div>
                            <h4 className="text-text-primary font-semibold text-sm">Dev fee return</h4>
                        </div>
                    </div>
                    <span className="text-text-muted text-sm">2 %</span>
                </div>
                <p className="text-text-muted text-xs ">
                    You'll return hidden developer fee to your hotel.
                </p>
            </div>

            {/* My fee */}
            <div className="bg-[#222222] border border-border rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <Toggle
                            checked={customFeeEnabled}
                            onChange={setCustomFeeEnabled}
                        />
                        <div>
                            <h4 className="text-text-primary font-semibold text-sm">My fee</h4>
                        </div>
                    </div>
                    <span className="text-text-white text-sm bg-[#FFFFFF12] p-1">2 %</span>
                </div>
                <p className="text-text-muted text-xs">
                    Make custom fee for all your miners except for exceptions
                </p>
            </div>
        </div>
    )
}