import { useState, useEffect } from 'react';
import api from '../api/axios';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const emptyForm = {
  title: '', description: '', date: '', startTime: '', endTime: '',
  venue: '', organizer: '', maxAttendees: '', status: 'upcoming',
};

const statusColors = {
  upcoming: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [eRes, vRes, oRes] = await Promise.all([
        api.get('/events?limit=100'),
        api.get('/venues'),
        api.get('/organizers'),
      ]);
      setEvents(eRes.data.data.events);
      setVenues(vRes.data.data);
      setOrganizers(oRes.data.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditTarget(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (event) => {
    setEditTarget(event);
    setForm({
      title: event.title,
      description: event.description || '',
      date: event.date?.substring(0, 10),
      startTime: event.startTime,
      endTime: event.endTime,
      venue: event.venue?._id || '',
      organizer: event.organizer?._id || '',
      maxAttendees: event.maxAttendees,
      status: event.status,
    });
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, maxAttendees: Number(form.maxAttendees) };
      if (editTarget) {
        await api.put(`/events/${editTarget._id}`, payload);
        toast.success('Event updated');
      } else {
        await api.post('/events', payload);
        toast.success('Event created');
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted');
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Events</h2>
        <button onClick={openCreate} className="btn-primary">Add Event</button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Title', 'Date', 'Venue', 'Organizer', 'Attendees', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-gray-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No events found</td></tr>
            ) : events.map((ev) => (
              <tr key={ev._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium max-w-xs truncate">{ev.title}</td>
                <td className="px-4 py-3 text-gray-600">{new Date(ev.date).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-gray-600">{ev.venue?.name}</td>
                <td className="px-4 py-3 text-gray-600">{ev.organizer?.name}</td>
                <td className="px-4 py-3">{ev.attendeesCount}/{ev.maxAttendees}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[ev.status]}`}>
                    {ev.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => openEdit(ev)} className="btn-secondary text-xs">Edit</button>
                  <button onClick={() => handleDelete(ev._id)} className="btn-danger text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Event' : 'Add Event'}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="label">Title</label>
            <input name="title" value={form.title} onChange={handleChange} className="input" required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="input" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} className="input" required />
            </div>
            <div>
              <label className="label">Max Attendees</label>
              <input type="number" name="maxAttendees" min="1" value={form.maxAttendees} onChange={handleChange} className="input" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Start Time</label>
              <input type="time" name="startTime" value={form.startTime} onChange={handleChange} className="input" required />
            </div>
            <div>
              <label className="label">End Time</label>
              <input type="time" name="endTime" value={form.endTime} onChange={handleChange} className="input" required />
            </div>
          </div>
          <div>
            <label className="label">Venue</label>
            <select name="venue" value={form.venue} onChange={handleChange} className="input" required>
              <option value="">Select venue...</option>
              {venues.map((v) => <option key={v._id} value={v._id}>{v.name} — {v.city}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Organizer</label>
            <select name="organizer" value={form.organizer} onChange={handleChange} className="input" required>
              <option value="">Select organizer...</option>
              {organizers.map((o) => <option key={o._id} value={o._id}>{o.name} ({o.organizationName})</option>)}
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="input">
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? 'Saving...' : editTarget ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Events;
