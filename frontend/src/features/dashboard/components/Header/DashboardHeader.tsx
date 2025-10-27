import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {clsx} from 'clsx'
import {useAuth} from '@/entities/auth/hooks/useAuth'
import {useCurrency} from '@/shared/providers/CurrencyProvider'
import {ChangeUsernameModal} from '@/features/auth/components/ChangeUsernameModal'
import {ChangePasswordModal} from '@/features/auth/components/ChangePasswordModal'

type CoinType = 'BTC' | 'LTC'

export function DashboardHeader() {
    const {userData, logout} = useAuth()
    const {currency, setCurrency} = useCurrency()
    const navigate = useNavigate()
    const [selectedPanel, setSelectedPanel] = useState<'Dashboard' | 'Admin'>('Dashboard')
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const currentUsername = userData?.name || 'User'

    const coins: CoinType[] = ['BTC', 'LTC']

    const handleLogout = () => {
        logout()
        setIsUserMenuOpen(false)
    }

    const handlePanelSwitch = (panel: 'Dashboard' | 'Admin') => {
        setSelectedPanel(panel)
        if (panel === 'Admin') {
            navigate('/admin/users')
        }
    }

    return (
        <>
            <header className="bg-[#191919] border-b border-border px-6 h-[50px] max-md:px-4 max-sm:px-2">
                <div className="flex items-center justify-between h-full">
                    {/* Левая часть - Логотип */}
                    <div className="flex items-center">
                        <svg width="148" height="24" viewBox="0 0 148 24" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M30.3344 20.5988C28.3863 20.5988 26.8277 20.1232 25.6588 19.1719C24.49 18.2207 23.8081 16.8629 23.6133 15.0986H25.9286C26.0635 16.2492 26.513 17.1237 27.2773 17.7221C28.0416 18.3204 29.0756 18.6196 30.3794 18.6196C31.4733 18.6196 32.2975 18.4125 32.852 17.9982C33.4215 17.584 33.7062 16.9933 33.7062 16.2262C33.7062 15.5358 33.5189 14.9912 33.1442 14.5923C32.7696 14.178 32.1777 13.8405 31.3684 13.5797L28.5586 12.6591C27.12 12.1835 26.0635 11.5852 25.3891 10.8641C24.7147 10.143 24.3776 9.23014 24.3776 8.1255C24.3776 7.18962 24.6023 6.38415 25.0519 5.70909C25.5165 5.03403 26.1609 4.5124 26.9851 4.14418C27.8243 3.76063 28.7984 3.56885 29.9073 3.56885C31.6157 3.56885 32.9794 4.01377 33.9984 4.90362C35.0325 5.77813 35.6244 6.99784 35.7743 8.56276H33.4589C33.2791 7.51948 32.8895 6.76004 32.2901 6.28443C31.6906 5.79348 30.8664 5.548 29.8174 5.548C28.8283 5.548 28.0566 5.74745 27.5021 6.14635C26.9476 6.54525 26.6704 7.10524 26.6704 7.82633C26.6704 8.40933 26.8502 8.90028 27.2099 9.29918C27.5845 9.68274 28.1989 10.0126 29.0531 10.2888L31.9978 11.2553C33.3615 11.7002 34.3656 12.3063 35.01 13.0734C35.6694 13.8405 35.999 14.8071 35.999 15.9731C35.999 17.4459 35.5045 18.5889 34.5154 19.4021C33.5264 20.1999 32.1327 20.5988 30.3344 20.5988Z"
                                fill="white"/>
                            <path d="M42.4861 20.3916V5.82416H37.0238V3.82199H50.3311V5.82416H44.8688V20.3916H42.4861Z"
                                  fill="white"/>
                            <path
                                d="M52.3458 20.3916V3.82199H58.7297C59.8986 3.82199 60.8952 4.02144 61.7194 4.42034C62.5436 4.8039 63.1805 5.34855 63.6301 6.05429C64.0797 6.7447 64.3045 7.56551 64.3045 8.51673C64.3045 9.46795 64.0797 10.2964 63.6301 11.0022C63.1805 11.7079 62.5436 12.2602 61.7194 12.6591C60.8952 13.058 59.8986 13.2575 58.7297 13.2575H54.1441V11.2783H58.6623C59.7413 11.2783 60.558 11.0405 61.1125 10.5649C61.6819 10.074 61.9667 9.39891 61.9667 8.53974C61.9667 7.68057 61.6894 7.01319 61.135 6.53757C60.5805 6.06197 59.7563 5.82416 58.6623 5.82416H54.7285V20.3916H52.3458ZM61.6969 20.3916L53.8069 12.0378H56.7067L65.1137 20.3916H61.6969Z"
                                fill="white"/>
                            <path
                                d="M66.2636 20.3916L72.3553 3.82199H74.4234L68.6014 20.3916H66.2636ZM78.7843 20.3916L72.9623 3.82199H75.1427L81.2569 20.3916H78.7843ZM69.3432 13.7868H78.02V15.812H69.3432V13.7868Z"
                                fill="white"/>
                            <path d="M85.4458 20.3916V5.82416H79.9835V3.82199H93.2909V5.82416H87.8286V20.3916H85.4458Z"
                                  fill="white"/>
                            <path d="M95.6793 20.3916V3.82199H98.062V20.3916H95.6793Z" fill="white"/>
                            <path
                                d="M111.862 20.3916L106.872 12.7972L100.802 3.82199H103.59L108.31 11.0022L114.649 20.3916H111.862ZM107.186 11.0252L112.087 3.82199H114.649L108.243 13.0274L107.186 11.0252ZM107.928 13.1194L103.005 20.3916H100.443L106.894 11.1172L107.928 13.1194Z"
                                fill="white"/>
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                  d="M6.58594 3.40137C7.8897 3.40137 9.02927 3.76175 10.0033 4.48284C10.9923 5.18854 11.7636 6.17834 12.3181 7.45159C12.8726 8.70966 13.1496 10.1755 13.1496 11.8478C13.1495 13.5352 12.8725 15.0235 12.3181 16.3121C11.7636 17.6007 10.9923 18.6136 10.0033 19.35C9.01429 20.0711 7.87472 20.4315 6.58594 20.4315C5.28247 20.4314 4.13622 20.0709 3.14732 19.35C2.15828 18.6136 1.38595 17.6008 0.831473 16.3121C0.277055 15.0081 5.64287e-05 13.5199 0 11.8478C0 10.1755 0.276999 8.70966 0.831473 7.45159C1.38595 6.17819 2.15827 5.18858 3.14732 4.48284C4.13624 3.76195 5.28243 3.40143 6.58594 3.40137ZM4.61733 16.6748C4.36421 17.0452 4.3936 17.557 4.76613 17.807C5.26311 18.1405 5.86345 18.3366 6.58594 18.3366C7.44006 18.3366 8.16734 18.0688 8.76674 17.5319C9.36617 16.9796 9.81524 16.2195 10.115 15.2529C10.4296 14.2711 10.587 13.1283 10.5871 11.8244C10.5871 11.4168 10.5668 10.9809 10.5203 10.5355C10.4372 9.73974 9.47126 9.57143 9.01985 10.232L4.61733 16.6748ZM6.58594 5.49512C5.70192 5.49518 4.95985 5.75702 4.36049 6.2786C3.77629 6.8002 3.32689 7.53638 3.01228 8.4873C2.71256 9.42318 2.5625 10.5356 2.5625 11.8244C2.5625 12.3838 2.59965 13.0033 2.68976 13.6313C2.8011 14.4073 3.74878 14.5535 4.19098 13.9062L8.72294 7.27198C8.96577 6.9165 8.95068 6.42939 8.61149 6.16428C8.07743 5.74687 7.41145 5.49512 6.58594 5.49512Z"
                                  fill="#00FF26"/>
                            <path
                                d="M17.3826 5.95744C17.759 6.51931 18.5834 6.52445 18.9668 5.96733L19.4607 5.24958C19.6006 5.04626 19.8316 4.9248 20.0784 4.9248C20.6953 4.9248 21.0482 5.62817 20.6796 6.12275L19.4427 7.782C19.1915 8.11898 19.1894 8.58037 19.4376 8.91957L20.7709 10.7418C21.1433 11.2508 20.7797 11.9672 20.1491 11.9672C19.8926 11.9672 19.653 11.8396 19.5098 11.6269L18.8616 10.6635C18.4872 10.1071 17.6716 10.098 17.2849 10.646L16.5746 11.6527C16.4354 11.8499 16.2091 11.9672 15.9678 11.9672C15.3551 11.9672 15.006 11.2672 15.3746 10.7778L16.8117 8.86952C17.0659 8.53198 17.0688 8.06772 16.8188 7.72706L15.6605 6.14871C15.2878 5.64083 15.6504 4.9248 16.2804 4.9248C16.5369 4.9248 16.7765 5.0527 16.9193 5.2658L17.3826 5.95744Z"
                                fill="#00FF26"/>
                            <path
                                d="M125.505 20.4001C125.451 20.1955 125.413 19.9693 125.392 19.7216C125.381 19.4739 125.375 19.1724 125.375 18.817H125.295V14.8916C125.295 14.3639 125.16 13.9708 124.891 13.7123C124.632 13.4431 124.218 13.3085 123.647 13.3085C123.098 13.3085 122.656 13.4162 122.322 13.6316C121.999 13.8469 121.811 14.1539 121.757 14.5523H120.158C120.233 13.7769 120.583 13.1577 121.208 12.6946C121.832 12.2315 122.667 12 123.711 12C124.788 12 125.596 12.2531 126.135 12.7592C126.673 13.2546 126.942 13.9869 126.942 14.9562V18.817C126.942 19.0647 126.958 19.3178 126.991 19.5762C127.023 19.8347 127.072 20.1093 127.136 20.4001H125.505ZM122.661 20.5616C121.821 20.5616 121.154 20.357 120.658 19.9478C120.163 19.5278 119.915 18.9624 119.915 18.2516C119.915 17.5193 120.174 16.9431 120.691 16.5231C121.218 16.0924 121.972 15.8016 122.952 15.6508L125.666 15.2147V16.3939L123.211 16.7816C122.661 16.8678 122.247 17.0131 121.967 17.2178C121.698 17.4224 121.563 17.7185 121.563 18.1062C121.563 18.4832 121.687 18.7685 121.935 18.9624C122.193 19.1455 122.565 19.237 123.049 19.237C123.695 19.237 124.228 19.0809 124.648 18.7685C125.079 18.4562 125.295 18.0632 125.295 17.5893L125.505 18.7847C125.311 19.3555 124.966 19.797 124.471 20.1093C123.975 20.4109 123.372 20.5616 122.661 20.5616Z"
                                fill="#00FF26"/>
                            <path
                                d="M133.612 20.5455C132.837 20.5455 132.191 20.3624 131.674 19.9963C131.168 19.6193 130.834 19.097 130.672 18.4293L130.898 18.397V23.7117H129.218V12.1615H130.818V14.0516L130.656 14.0031C130.828 13.3785 131.195 12.8885 131.755 12.5331C132.315 12.1777 132.971 12 133.725 12C134.468 12 135.109 12.1777 135.648 12.5331C136.197 12.8885 136.617 13.3839 136.908 14.0193C137.209 14.6546 137.36 15.3977 137.36 16.2485C137.36 17.1101 137.204 17.8639 136.892 18.5101C136.579 19.1562 136.143 19.657 135.583 20.0124C135.023 20.3678 134.366 20.5455 133.612 20.5455ZM133.257 19.1562C133.989 19.1562 134.571 18.8978 135.002 18.3808C135.432 17.8639 135.648 17.1531 135.648 16.2485C135.648 15.3547 135.432 14.66 135.002 14.1646C134.571 13.6585 133.984 13.4054 133.241 13.4054C132.508 13.4054 131.921 13.6639 131.48 14.1808C131.049 14.687 130.834 15.3924 130.834 16.297C130.834 17.1801 131.049 17.8801 131.48 18.397C131.921 18.9032 132.514 19.1562 133.257 19.1562Z"
                                fill="#00FF26"/>
                            <path
                                d="M143.519 20.5455C142.744 20.5455 142.098 20.3624 141.581 19.9963C141.075 19.6193 140.741 19.097 140.579 18.4293L140.805 18.397V23.7117H139.125V12.1615H140.725V14.0516L140.563 14.0031C140.735 13.3785 141.102 12.8885 141.662 12.5331C142.222 12.1777 142.878 12 143.632 12C144.375 12 145.016 12.1777 145.555 12.5331C146.104 12.8885 146.524 13.3839 146.815 14.0193C147.116 14.6546 147.267 15.3977 147.267 16.2485C147.267 17.1101 147.111 17.8639 146.799 18.5101C146.486 19.1562 146.05 19.657 145.49 20.0124C144.93 20.3678 144.273 20.5455 143.519 20.5455ZM143.164 19.1562C143.896 19.1562 144.478 18.8978 144.909 18.3808C145.339 17.8639 145.555 17.1531 145.555 16.2485C145.555 15.3547 145.339 14.66 144.909 14.1646C144.478 13.6585 143.891 13.4054 143.148 13.4054C142.415 13.4054 141.828 13.6639 141.387 14.1808C140.956 14.687 140.741 15.3924 140.741 16.297C140.741 17.1801 140.956 17.8801 141.387 18.397C141.828 18.9032 142.421 19.1562 143.164 19.1562Z"
                                fill="#00FF26"/>
                            <text x="120" y="8" fill="#ffffff" font-family="Arial, sans-serif" font-size="10"
                                  font-weight="300">alpha
                            </text>
                        </svg>
                    </div>

                    {/* Правая часть - Support текст + Кнопки монет + профиль */}
                    <div className="flex items-center gap-6 max-md:gap-3">
                        {/* Support Text */}
                        <div className="hidden sm:block text-text-muted text-sm">
                            If you need any help,{' '}
                            <a
                                href="https://t.me/xstratix"
                                className="text-[#00FF26] hover:text-accent-green-hover transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                contact support
                            </a>
                        </div>

                        {/* Support Icon for mobile */}
                        <div className="sm:hidden">
                            <a
                                href="https://t.me/xstratix"
                                className="text-[#00FF26] hover:text-accent-green-hover transition-colors"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 20.25c4.97 0 9-3.806 9-8.5S16.97 3.25 12 3.25 3 7.056 3 11.75c0 1.762.635 3.393 1.688 4.7L3 21l5.15-1.8A9.43 9.43 0 0 0 12 20.25Z"
                                    />
                                </svg>
                            </a>
                        </div>

                        {/* Переключатель монет */}
                        <div
                            className="flex items-center rounded-lg p-2 w-[101px] h-[40px] bg-[#222222] max-sm:w-[80px] max-sm:p-1">
                            {coins.map((coin) => (
                                <button
                                    key={coin}
                                    onClick={() => setCurrency(coin)}
                                    className={clsx(
                                        'text-sm font-medium rounded-md transition-all duration-200 flex-1 h-[32px] flex items-center justify-center',
                                        currency === coin
                                            ? 'text-[#00FF26] bg-[radial-gradient(circle_at_center,rgba(0,255,38,0.1)_100%,transparent_100%)] shadow-[inset_0_0_10px_rgba(0,255,38,0.5)]'
                                            : 'text-text-secondary hover:text-text-primary'
                                    )}
                                >
                                    {coin}
                                </button>
                            ))}
                        </div>

                        {/* Переключатель панелей - показываем только для админов */}
                        {userData?.isAdmin && (
                            <div className="flex items-center rounded-lg p-1 bg-[#2A2A2A] gap-1">
                                {['Hotel', 'Admin'].map((panel) => (
                                    <button
                                        key={panel}
                                        onClick={() => handlePanelSwitch(panel === 'Hotel' ? 'Dashboard' : 'Admin')}
                                        className={clsx(
                                            'text-sm font-medium rounded-md transition-all duration-200 px-2 py-2',
                                            selectedPanel === (panel === 'Hotel' ? 'Dashboard' : 'Admin')
                                                ? 'text-[#DB3DFF] bg-[#DB3DFF]/10'
                                                : 'text-[#7A7A7A]'
                                        )}
                                    >
                                        {panel}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Профиль пользователя */}
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center h-[45px] gap-2 p-2 rounded-lg hover:bg-primary-card transition-colors duration-200"
                            >
                                {/* Иконка пользователя */}
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z"
                                        fill="#222222"/>
                                    <path
                                        d="M25.8332 27.5V25.8333C25.8332 24.9493 25.482 24.1014 24.8569 23.4763C24.2317 22.8512 23.3839 22.5 22.4998 22.5H17.4998C16.6158 22.5 15.7679 22.8512 15.1428 23.4763C14.5177 24.1014 14.1665 24.9493 14.1665 25.8333V27.5M23.3332 15.8333C23.3332 17.6743 21.8408 19.1667 19.9998 19.1667C18.1589 19.1667 16.6665 17.6743 16.6665 15.8333C16.6665 13.9924 18.1589 12.5 19.9998 12.5C21.8408 12.5 23.3332 13.9924 23.3332 15.8333Z"
                                        stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>

                                {/* Ник пользователя */}
                                <span className="text-text-primary font-medium max-sm:text-sm truncate">
    {userData?.name || 'User'}
</span>

                                {/* Стрелка вниз */}
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={clsx(
                                        'transition-transform duration-200',
                                        isUserMenuOpen && 'rotate-180'
                                    )}
                                >
                                    <path d="M5 7.5L10 12.5L15 7.5" stroke="#7A7A7A" strokeWidth="1.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                </svg>
                            </button>

                            {/* Выпадающее меню */}
                            {isUserMenuOpen && (
                                <div
                                    className="absolute w-[280px] right-0 top-full mt-2 bg-primary-card rounded-lg shadow-xl z-50 animate-scaleIn">
                                    <div className="py-2 w-[280px] bg-[#0000003B]">
                                        {/* Change nickname */}
                                        <button
                                            onClick={() => {
                                                setIsUsernameModalOpen(true)
                                                setIsUserMenuOpen(false)
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-text-primary hover:bg-primary-bg-secondary transition-colors"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path
                                                    d="M14.166 2.5C14.3849 2.28113 14.6447 2.10752 14.9307 1.98906C15.2167 1.87061 15.5232 1.80957 15.8327 1.80957C16.1422 1.80957 16.4487 1.87061 16.7347 1.98906C17.0206 2.10752 17.2805 2.28113 17.4993 2.5C17.7182 2.71887 17.8918 2.97869 18.0103 3.26466C18.1287 3.55063 18.1898 3.85705 18.1898 4.16667C18.1898 4.47628 18.1287 4.78271 18.0103 5.06868C17.8918 5.35465 17.7182 5.61447 17.4993 5.83333L6.24935 17.0833L1.66602 18.3333L2.91602 13.75L14.166 2.5Z"
                                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                                    strokeLinejoin="round"/>
                                            </svg>
                                            <span>Change nickname</span>
                                            <svg className="ml-auto" width="16" height="16" viewBox="0 0 16 16"
                                                 fill="none">
                                                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5"
                                                      strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>

                                        {/* Change password */}
                                        <button
                                            onClick={() => {
                                                setIsPasswordModalOpen(true)
                                                setIsUserMenuOpen(false)
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-text-primary hover:bg-primary-bg-secondary transition-colors"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path
                                                    d="M15.833 9.16667H4.16634C3.24587 9.16667 2.49967 9.91286 2.49967 10.8333V16.6667C2.49967 17.5871 3.24587 18.3333 4.16634 18.3333H15.833C16.7535 18.3333 17.4997 17.5871 17.4997 16.6667V10.8333C17.4997 9.91286 16.7535 9.16667 15.833 9.16667Z"
                                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                                    strokeLinejoin="round"/>
                                                <path
                                                    d="M5.83366 9.16667V5.83333C5.83366 4.72826 6.27265 3.66846 7.05405 2.88705C7.83546 2.10565 8.89526 1.66667 10.0003 1.66667C11.1054 1.66667 12.1652 2.10565 12.9466 2.88705C13.728 3.66846 14.167 4.72826 14.167 5.83333V9.16667"
                                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                                    strokeLinejoin="round"/>
                                            </svg>
                                            <span>Change password</span>
                                            <svg className="ml-auto" width="16" height="16" viewBox="0 0 16 16"
                                                 fill="none">
                                                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5"
                                                      strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>

                                        {/* Logout */}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-text-primary hover:bg-primary-bg-secondary transition-colors"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path
                                                    d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5M13.3333 14.1667L17.5 10M17.5 10L13.3333 5.83333M17.5 10H7.5"
                                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                                    strokeLinejoin="round"/>
                                            </svg>
                                            <span>Logout</span>
                                            <svg className="ml-auto" width="16" height="16" viewBox="0 0 16 16"
                                                 fill="none">
                                                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5"
                                                      strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Закрытие меню при клике вне области */}
                {isUserMenuOpen && (
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsUserMenuOpen(false)}
                    />
                )}
            </header>

                {/* Модальные окна */}
            <ChangeUsernameModal
                isOpen={isUsernameModalOpen}
                onClose={() => setIsUsernameModalOpen(false)}
                currentUsername={currentUsername}
            />
            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </>
    )
}