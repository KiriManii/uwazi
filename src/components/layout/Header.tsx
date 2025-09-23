import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-900">Uwazi</span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link href="/create" className="text-gray-600 hover:text-primary-600 transition-colors">
              Create Poll
            </Link>
            <Link href="/create" className="btn-primary text-sm">
              Start Free Poll
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
