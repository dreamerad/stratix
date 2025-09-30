import {BrowserRouter} from 'react-router-dom'
import {QueryClient, QueryClientProvider} from 'react-query'
import {AppRouter} from '@/app/router/AppRouter'
import {AuthProvider} from '@/entities/auth/providers/AuthProvider'
import {ToastProvider} from '@/shared/ui'
import {CurrencyProvider} from '@/shared/providers/CurrencyProvider'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
})

export function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <CurrencyProvider>
                        <ToastProvider>
                            <AppRouter/>
                        </ToastProvider>
                    </CurrencyProvider>
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    )
}