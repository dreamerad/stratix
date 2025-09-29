import { useState } from 'react'
import { UsersFilters } from '@/features/admin/components/Users/UsersFilters'
import { UsersTable } from '@/features/admin/components/Users/UsersTable'

export function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Users</h1>

      <UsersFilters
        searchQuery={searchQuery}
        roleFilter={roleFilter}
        onSearchChange={setSearchQuery}
        onRoleChange={setRoleFilter}
      />

      <UsersTable
        searchQuery={searchQuery}
        roleFilter={roleFilter}
      />
    </div>
  )
}