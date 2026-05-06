import { useState, useEffect } from 'react';
import api from '../api/axios';
import Loader from '../components/common/Loader';

const StatCard = ({ label, value, color }) => (
  <div className="card p-6">
    <p className="text-sm text-gray-500 font-medium">{label}</p>
    <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [allEvents, upcomingEvents, attendees, venues, organizers] = await Promise.all([
          api.get('/events?limit=1'),
          api.get('/events?status=upcoming&limit=1'),
          api.get('/attendees'),
          api.get('/venues'),
          api.get('/organizers'),
        ]);

        setStats({
          totalEvents: allEvents.data.data.pagination.total,
          upcomingEvents: upcomingEvents.data.data.pagination.total,
          totalAttendees: attendees.data.data.length,
          totalVenues: venues.data.data.length,
          totalOrganizers: organizers.data.data.length,
        });
      } catch {
        // Stats will remain null
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Dashboard</h2>
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label="Total Events" value={stats.totalEvents} color="text-blue-600" />
          <StatCard label="Upcoming Events" value={stats.upcomingEvents} color="text-green-600" />
          <StatCard label="Total Attendees" value={stats.totalAttendees} color="text-purple-600" />
          <StatCard label="Venues" value={stats.totalVenues} color="text-orange-600" />
          <StatCard label="Organizers" value={stats.totalOrganizers} color="text-red-600" />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
