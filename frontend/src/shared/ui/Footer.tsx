export function Footer() {
  return (
    <footer className="bg-[#191919] border-t border-[#3A3A3A] px-6 py-4">
      <div className="flex items-center justify-between text-sm">
        {/* Левая часть - помощь */}
        <div className="text-text-muted">
          If you need any help,{' '}
          <button className="text-[#00FF26] hover:text-accent-green-hover transition-colors">
            contact support
          </button>
        </div>

        {/* Правая часть - копирайт */}
        <div className="text-text-muted">
          ©0xStratix 2025
        </div>
      </div>
    </footer>
  )
}