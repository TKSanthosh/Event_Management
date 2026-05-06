import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/events', label: 'Events' },
  { to: '/attendees', label: 'Attendees' },
  { to: '/venues', label: 'Venues' },
  { to: '/organizers', label: 'Organizers' },
];

const Sidebar = () => (
  <aside className="w-56 bg-white border-r border-gray-200 min-h-screen pt-6">
    <nav className="flex flex-col gap-1 px-3">
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
