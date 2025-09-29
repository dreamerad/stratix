interface User {
  id: number
  name: string
  role: string
  status: string
  lastLogin: string
  created: string
}

interface UsersTableProps {
  searchQuery: string
  roleFilter: string
}

export function UsersTable({ searchQuery, roleFilter }: UsersTableProps) {
  const mockUsers: User[] = [
    {id: 1, name: 'admin1', role: 'admin', status: 'active', lastLogin: '2024-01-15', created: '2023-06-10'},
    {id: 2, name: 'user1', role: 'user', status: 'active', lastLogin: '2024-01-14', created: '2023-08-22'},
    {id: 3, name: 'user2', role: 'user', status: 'inactive', lastLogin: '2023-12-01', created: '2023-05-15'},
    {id: 4, name: 'manager1', role: 'admin', status: 'active', lastLogin: '2024-01-16', created: '2023-07-30'},
    {id: 5, name: 'test_user', role: 'user', status: 'inactive', lastLogin: '2023-11-20', created: '2023-09-05'},
  ]

  // Фильтрация пользователей
  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === '' || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  return (
    <div className="bg-dark-card rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-primary-bg">
            <tr>
              <th className="px-3 sm:px-6 py-4 text-sm font-medium text-text-secondary uppercase tracking-wider">
                Username
              </th>
              <th className="px-3 sm:px-6 py-4 text-sm font-medium text-text-secondary uppercase tracking-wider">
                Role
              </th>
              <th className="px-3 sm:px-6 py-4 text-sm font-medium text-text-secondary uppercase tracking-wider">
                Status
              </th>
              <th className="hidden md:table-cell px-3 sm:px-6 py-4 text-sm font-medium text-text-secondary uppercase tracking-wider">
                Last Login
              </th>
              <th className="hidden lg:table-cell px-3 sm:px-6 py-4 text-sm font-medium text-text-secondary uppercase tracking-wider">
                Created
              </th>
              <th className="px-3 sm:px-6 py-4 text-sm font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#282828]">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-primary-bg-secondary transition-colors">
                  <td className="px-3 sm:px-6 py-4 text-white font-medium">{user.name}</td>
                  <td className="px-3 sm:px-6 py-4">
                    <span className="text-white">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active'
                        ? 'bg-[#FFFFFF12] text-[#00FF26]'
                        : 'bg-[#FFFFFF12] text-red-600'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-3 sm:px-6 py-4 text-white">{user.lastLogin}</td>
                  <td className="hidden lg:table-cell px-3 sm:px-6 py-4 text-white">{user.created}</td>
                  <td className="px-3 sm:px-6 py-4">
                      <div className="flex items-center gap-1">

                          <button
                              className="relative flex items-center justify-center w-10 h-10 bg-black rounded-lg hover:opacity-90 transition-opacity">
                              <div
                                  className="absolute top-0 left-0 w-4 h-4 bg-red-500 opacity-30 rounded-full blur-sm"></div>
                              <div
                                  className="absolute bottom-0 right-0 w-4 h-4 bg-red-500 opacity-30 rounded-full blur-sm"></div>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                   xmlns="http://www.w3.org/2000/svg">
                                  <g clip-path="url(#clip0_636_140)">
                                      <path
                                          d="M6.10734 6.10783L17.8915 17.8928M20.3332 12.0003C20.3332 16.6027 16.6022 20.3337 11.9998 20.3337C7.39746 20.3337 3.6665 16.6027 3.6665 12.0003C3.6665 7.39795 7.39746 3.66699 11.9998 3.66699C16.6022 3.66699 20.3332 7.39795 20.3332 12.0003Z"
                                          stroke="#ef4444"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                  </g>
                                  <defs>
                                      <clipPath id="clip0_636_140">
                                          <rect width="20" height="20" fill="white" transform="translate(2 2)"/>
                                      </clipPath>
                                  </defs>
                              </svg>

                          </button>
                          {/* Delete Button */}
                          <button
                              className="relative flex items-center justify-center w-10 h-10 bg-black rounded-lg hover:opacity-90 transition-opacity">
                              <div
                                  className="absolute top-0 left-0 w-4 h-4 bg-red-500 opacity-30 rounded-full blur-sm"></div>
                              <div
                                  className="absolute bottom-0 right-0 w-4 h-4 bg-red-500 opacity-30 rounded-full blur-sm"></div>
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                   xmlns="http://www.w3.org/2000/svg">
                                  <path
                                      d="M7.83333 11.167V7.83366C7.83333 6.72859 8.27232 5.66878 9.05372 4.88738C9.83512 4.10598 10.8949 3.66699 12 3.66699C13.1051 3.66699 14.1649 4.10598 14.9463 4.88738C15.7277 5.66878 16.1667 6.72859 16.1667 7.83366V11.167M6.16667 11.167H17.8333C18.7538 11.167 19.5 11.9132 19.5 12.8337V18.667C19.5 19.5875 18.7538 20.3337 17.8333 20.3337H6.16667C5.24619 20.3337 4.5 19.5875 4.5 18.667V12.8337C4.5 11.9132 5.24619 11.167 6.16667 11.167Z"
                                         stroke="#ef4444"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"/>
                              </svg>

                          </button>

                          {/* Edit Button */}
                          <button
                              className="relative flex items-center justify-center w-10 h-10 bg-black rounded-lg hover:opacity-90 transition-opacity">
                              <div
                                  className="absolute top-0 left-0 w-4 h-4 bg-accent-green opacity-30 rounded-full blur-sm"></div>
                              <div
                                  className="absolute bottom-0 right-0 w-4 h-4 bg-accent-green opacity-30 rounded-full blur-sm"></div>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                   xmlns="http://www.w3.org/2000/svg">
                                  <path
                                      d="M14.4998 6.16633L17.8331 9.49967M19.6448 7.67633C20.0854 7.23585 20.3329 6.63839 20.333 6.01538C20.3331 5.39237 20.0857 4.79484 19.6452 4.35425C19.2047 3.91366 18.6073 3.66609 17.9842 3.66602C17.3612 3.66594 16.7637 3.91335 16.3231 4.35383L5.20145 15.478C5.00797 15.6709 4.86488 15.9084 4.78478 16.1697L3.68395 19.7963C3.66241 19.8684 3.66079 19.945 3.67924 20.0179C3.6977 20.0908 3.73555 20.1574 3.78878 20.2105C3.84201 20.2636 3.90863 20.3014 3.98158 20.3197C4.05453 20.3381 4.13108 20.3363 4.20312 20.3147L7.83062 19.2147C8.09159 19.1353 8.32909 18.9931 8.52228 18.8005L19.6448 7.67633Z"
                                      stroke="#00FF26"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"/>
                              </svg>

                          </button>
                      </div>
                  </td>
                </tr>
              ))
            ) : (
                <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-text-secondary">
                        No users found
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}