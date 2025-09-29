export function AdminLogsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Logs</h1>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search logs..."
          className="flex-1 px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-accent-green"
        />

        <select className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-accent-green">
          <option value="">All types</option>
          <option value="error">Error</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>
      </div>

      <div className="text-white">Logs table will be here</div>
    </div>
  )
}