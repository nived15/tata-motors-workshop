export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-8 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Money Manager</h1>
        <div className="flex items-center gap-4">
          {/* User menu will go here */}
          <span className="text-sm text-gray-600">User</span>
        </div>
      </div>
    </header>
  )
}
