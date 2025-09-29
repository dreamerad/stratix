interface UsersFiltersProps {
  searchQuery: string
  roleFilter: string
  onSearchChange: (query: string) => void
  onRoleChange: (role: string) => void
}

export function UsersFilters({
  searchQuery,
  roleFilter,
  onSearchChange,
  onRoleChange
}: UsersFiltersProps) {
  return (
      <div className="flex items-center gap-4 mb-6">
          <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex-1 px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-accent-green"
          />

          <select
              value={roleFilter}
              onChange={(e) => onRoleChange(e.target.value)}
              className="px-2 py-3 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-accent-green"
          >
              <option value="">All</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
          </select>

          <button
              className="relative flex items-center gap-2 px-4 py-2 bg-black text-white font-medium rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap overflow-hidden">
              {/* Зеленые акценты в углах */}
              <div className="absolute top-0 left-0 w-6 h-7 bg-accent-green opacity-30 rounded-full blur"></div>
              <div className="absolute bottom-0 right-0 w-6 h-7 bg-accent-green opacity-30 rounded-full blur"></div>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.1665 10.0003H15.8332M9.99984 4.16699V15.8337" stroke="#00FF26" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round"/>
              </svg>

              <span className="relative z-10">Add user</span>
          </button>
      </div>
  )
}