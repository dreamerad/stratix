export function AdminUsersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Users</h1>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name        ..."
          className="flex-1 px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-accent-green"
        />

        <select className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-accent-green">
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <button className="px-6 py-2 bg-accent-green text-dark-bg rounded-lg hover:bg-accent-green/80 transition-colors font-medium">
          Add User
        </button>
      </div>

      <div className="text-white">Users table will be here</div>
    </div>
  )
}