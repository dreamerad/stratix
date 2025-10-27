import { useState } from 'react'
import { useWorkers } from '@/features/workers/hooks/useWorkers'

export function WorkerStats() {
    const [isCopied, setIsCopied] = useState<string | null>(null)
    const { totalWorkers, activeWorkers, inactiveWorkers, loading } = useWorkers()

    const copyToClipboard = async (text: string) => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text)
            } else {
                const textArea = document.createElement('textarea')
                textArea.value = text
                textArea.style.position = 'fixed'
                textArea.style.left = '-999999px'
                textArea.style.top = '-999999px'
                document.body.appendChild(textArea)
                textArea.focus()
                textArea.select()
                document.execCommand('copy')
                textArea.remove()
            }

            setIsCopied(text)
            setTimeout(() => setIsCopied(null), 2000)
        } catch (err) {
            console.error('Failed to copy text:', err)
            setIsCopied(text)
            setTimeout(() => setIsCopied(null), 2000)
        }
    }

    if (loading) {
        return (
            <div className="bg-[#222222] border border-border rounded-xl p-6 h-full flex flex-col">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-700 rounded mb-1"></div>
                    <div className="h-8 bg-gray-700 rounded mb-6"></div>
                    <div className="border-t border-border my-6"></div>
                    <div className="space-y-3 mb-6">
                        <div className="h-4 bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    const demoAddresses = ['stratum+tcp://btc.demo.0xstratix.com:3333', 'stratum+tcp://btc.demo.0xstratix.com:443', 'stratum+tcp://btc.demo.0xstratix.com:25']

    return (
        <div className="bg-[#222222] border border-border rounded-xl p-6 h-full flex flex-col">
            {/* Total workers */}
            <div className="mb-6">
                <h3 className="text-text-white text-sm mb-1 font-semibold">Total workers</h3>
                <div className="text-text-primary text-3xl">{totalWorkers}</div>
            </div>

            {/* Divider */}
            <div className="border-t border-border my-6"></div>

            {/* Workers status */}
            <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                    <span className="text-text-muted text-sm">{activeWorkers} active</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-text-muted text-sm">{inactiveWorkers} inactive</span>
                </div>
            </div>

            {/* Live DEMO Info */}
            <div className="mt-auto">
                <div className="text-text-white text-sm font-semibold mb-2">Live DEMO:</div>
                <div className="text-text-muted text-sm mb-3">
                    To try it out, connect your miner to one of these addresses:
                </div>

                <div className="flex flex-col gap-2">
                    {demoAddresses.map((address) => (
                        <div
                            key={address}
                            className="flex items-center gap-2 p-2 bg-[#2A2A2A] rounded-md"
                        >
                            <svg width="16" height="16" viewBox="0 0 271.64 277.95" className="flex-shrink-0">
                                <path fill="#52cbca"
                                      d="M215.67,62l-.86,1.06-.94-1a107.68,107.68,0,0,0-65-32.89l-1.06-.13V0l1.33.14A136.72,136.72,0,0,1,239.68,47.8l1.52,1.79-2.34.19A33.19,33.19,0,0,0,215.67,62Z"/>
                                <path fill="#52cbca"
                                      d="M266.1,104.53l1.53-1.73.54,2.25a127.73,127.73,0,0,1,3.47,30.37,135.72,135.72,0,0,1-14.38,60.46l-.63,1.24-23.88-16.69.43-.92a103.84,103.84,0,0,0,9.65-44.09,105.69,105.69,0,0,0-1.56-18.27l-.24-1.34,1.36-.07A33.77,33.77,0,0,0,266.1,104.53Z"/>
                                <path fill="#52cbca"
                                      d="M28.8,135.42a103.7,103.7,0,0,0,9.66,44.09l.43.92L15,197.11l-.63-1.22A131.4,131.4,0,0,1,0,135.42a138.42,138.42,0,0,1,2.93-28l.43-2.07,1.56,1.43a34.06,34.06,0,0,0,22.68,8.92h3l-.25,1.41A105.7,105.7,0,0,0,28.8,135.42Z"/>
                                <path fill="#52cbca"
                                      d="M56.47,63.64l-1,1.12-.87-1.22A34.22,34.22,0,0,0,32.68,49.77l-2.07-.35L32,47.81A135,135,0,0,1,122.51.14L123.83,0V29.06l-1.07.13A106.75,106.75,0,0,0,56.47,63.64Z"/>
                                <path fill="#52cbca"
                                      d="M51.33,201.1l.7.87a107.52,107.52,0,0,0,53.25,36l1.34.4-.59,1.27a34.56,34.56,0,0,0-3.32,14.53,33.92,33.92,0,0,0,2,11.47l.76,2.11-2.18-.54a135.19,135.19,0,0,1-74.84-48.73l-.77-1Z"/>
                                <path fill="#52cbca"
                                      d="M165.61,239.67l-.6-1.27,1.35-.4a107.54,107.54,0,0,0,53.24-36l.71-.87,23.61,16.41-.78,1a136.55,136.55,0,0,1-74.83,48.73l-2.18.54.76-2.11a33.92,33.92,0,0,0,2-11.47A34.72,34.72,0,0,0,165.61,239.67Z"/>
                                <path fill="#52cbca"
                                      d="M241.4,106.39a23.76,23.76,0,1,1,23.75-23.76A23.76,23.76,0,0,1,241.4,106.39Zm-213.8,0A23.76,23.76,0,1,1,51.36,82.63,23.76,23.76,0,0,1,27.6,106.39ZM135.82,278a23.76,23.76,0,1,1,23.75-23.75A23.75,23.75,0,0,1,135.82,278Z"/>
                                <path fill="#ffb900"
                                      d="M169.08,112.72c-4.23,17.16-30.62,8.45-39.33,6.34L137.4,89c8.45,1.84,35.9,6.07,31.68,23.75Zm-4.76,48.83c-4.75,19-36.42,8.71-46.71,6.07l8.44-33.26c10,2.64,43,7.66,38.27,27.19Zm4.23-83.41,6.07-24.81-15.05-4L153.5,73.66c-4-1.06-7.92-1.85-12.14-2.91l6.07-24.28-15-3.69-6.34,24.81c-3.17-.8-6.6-1.59-9.76-2.12L95.43,60.2l-4,16.1,11.08,2.64c6.07,1.58,7.13,5.54,7.13,8.71l-7.13,28.24c.53.26,1.06.26,1.58.53-.52-.27-1-.27-1.58-.53l-9.77,39.85c-.79,1.85-2.63,4.76-6.86,3.7.27.26-11.08-2.64-11.08-2.64l-7.66,17.42L86.72,179c3.7,1.06,7.13,1.85,10.83,2.91L91.21,207l15.05,3.7,6.33-24.82c4,1.06,8.18,2.12,12.14,3.17l-6.33,24.55,15,3.69,6.34-25.07c25.86,4.75,45.13,2.9,53.31-20.32,6.6-18.74-.26-29.83-14-36.69,10.29-2.11,17.68-8.71,19.79-22.17C201.54,94.51,187.55,84.74,168.55,78.14Z"/>
                            </svg>
                            {/* Здесь вставь SVG */}

                            {/* Address */}
                            <span className="text-text-white text-sm flex-1 truncate">
                                {address}
                            </span>

                            {/* Copy button */}
                            <button
                                onClick={() => copyToClipboard(address)}
                                className="text-xs bg-[#00FF26]/10 text-[#00FF26] px-2 py-1 rounded-md hover:bg-[#00FF26]/20 transition-colors flex items-center gap-1"
                                title="Copy address"
                            >
                                {isCopied === address ? (
                                    <>
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M16.6667 5L7.50004 14.1667L3.33337 10"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span className="text-xs text-[#00FF26]">Copied</span>
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M16.6667 7.5H9.16667C8.24619 7.5 7.5 8.24619 7.5 9.16667V16.6667C7.5 17.5871 8.24619 18.3333 9.16667 18.3333H16.6667C17.5871 18.3333 18.3333 17.5871 18.3333 16.6667V9.16667C18.3333 8.24619 17.5871 7.5 16.6667 7.5Z"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M4.16663 12.5H3.33329C2.89127 12.5 2.46734 12.3244 2.15478 12.0118C1.84222 11.6993 1.66663 11.2754 1.66663 10.8333V3.33333C1.66663 2.89131 1.84222 2.46738 2.15478 2.15482C2.46734 1.84226 2.89127 1.66667 3.33329 1.66667H10.8333C11.2753 1.66667 11.6992 1.84226 12.0118 2.15482C12.3244 2.46738 12.5 2.89131 12.5 3.33333V4.16667"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
