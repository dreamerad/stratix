import {useState} from 'react'
import {AnimatedModal, Button} from '@/shared/ui'
import {useAuth} from '@/entities/auth/hooks/useAuth'
import {proxiesApi} from '@/features/proxies/api/proxies'

interface ContactModalProps {
    isOpen: boolean
    onClose: () => void
}

export function ContactModal({isOpen, onClose}: ContactModalProps) {
    const {userData} = useAuth()
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!message.trim()) {
            return
        }

        setIsSubmitting(true)

        try {
            const contactData = {
                username: userData?.name || 'Anonymous',
                message: message.trim()
            }

            console.log('Sending contact data:', contactData)

            const response = await proxiesApi.sendSupportMessage(contactData)

            if (response.status === 'success') {
                setMessage('')
                onClose()

                console.log('Message sent successfully:', response.message)
            } else {
                throw new Error(response.message || 'Failed to send message')
            }
            setMessage('')
            onClose()

        } catch (error) {
            console.error('Error sending message:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        setMessage('')
        onClose()
    }

    return (
        <AnimatedModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Contact Support"
            className="!w-[90vw] !max-w-[500px]"
        >
            <div className="space-y-8 p-2">
                {/* Header Info */}
                <div className="text-center px-4">
                    <div
                        className="w-20 h-20 bg-[#00FF26]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                                stroke="#00FF26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <polyline points="22,6 12,13 2,6" stroke="#00FF26" strokeWidth="2" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h3 className="text-text-primary text-xl font-semibold mb-3">Get in Touch</h3>
                    <p className="text-text-muted text-base leading-relaxed mb-4">
                        First, add the pool details, then write your message below
                    </p>

                </div>

                {/* Form */}
                <div className="space-y-6 px-4">
                    {/* Username (hidden/readonly) */}
                    <div className="space-y-3">
                        <label className="block text-text-muted text-base font-medium">From</label>
                        <input
                            type="text"
                            value={userData?.name || 'Anonymous'}
                            disabled
                            className="w-full p-4 bg-gray-700/50 border border-border rounded-lg text-text-muted text-base cursor-not-allowed"
                        />
                    </div>

                    {/* Message */}
                    <div className="space-y-3">
                        <label className="block text-text-muted text-base font-medium">
                            Message <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            onChange={(e) => setMessage(e.target.value)}
                            value="Hello! I would like to request a new mining pool..."
                            rows={6}
                            className="w-full p-4 bg-primary-card border border-border rounded-lg text-text-primary text-base focus:outline-none focus:border-accent-green transition-colors resize-none leading-relaxed"
                        />
                        <div className="text-right text-text-muted text-sm mt-2">
                            {message.length}/500
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-4 pt-6 border-t border-border px-4">
                    <Button
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <button
                        onClick={handleSubmit}
                        disabled={!message.trim() || isSubmitting}
                        className="flex-1 inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-bg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden bg-accent-green text-primary-bg hover:bg-accent-green-hover hover:shadow-lg hover:shadow-accent-green/25 focus:ring-accent-green/50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-500 hover:before:translate-x-[100%] px-6 py-3 text-base"
                    >
                        {isSubmitting ? (
                            <>
                                <div
                                    className="animate-spin rounded-full h-4 w-4 border-2 border-primary-bg border-t-transparent"></div>
                                <span className="transition-all duration-200">Sending...</span>
                            </>
                        ) : (
                            <span className="transition-all duration-200">Send Message</span>
                        )}
                    </button>
                </div>
            </div>
        </AnimatedModal>
    )
}