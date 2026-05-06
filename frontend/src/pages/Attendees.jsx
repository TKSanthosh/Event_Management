import { useState, useEffect } from 'react';
import api from '../api/axios';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const emptyForm = { name: '', email: '', phone: '' };

const Attendees = () => {
  const [attendees, setAttendees] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [aRes, eRes] = await Promise.all([
        api.get('/attendees'),
        api.get('/events?status=upcoming&limit=100'),
      ]);
      setAttendees(aRes.data.data);
      setEvents(eRes.data.data.events);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditTarget(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (a) => {
    setEditTarget(a);
    setForm({ name: a.name, email: a.email, phone: a.phone });
    setModalOpen(true);
  };

  const openRegister = (a) => { setSelectedAttendee(a); setSelectedEventId(''); setRegisterModal(true); };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editTarget) {
        await api.put(`/attendees/${editTarget._id}`, form);
        toast.success('Attendee updated');
      } else {
        await api.post('/attendees', form);
        toast.success('Attendee created');
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
    if (!confirm('Delete this attendee?')) return;
    try {
      await api.delete(`/attendees/${id}`);
      toast.success('Attendee deleted');
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!selectedEventId) return;
    setSubmitting(true);
    try {
      await api.post(`/attendees/${selectedAttendee._id}/register/${selectedEventId}`);
      toast.success('Registered for event');
      setRegisterModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelReg = async (attendeeId, eventId) => {
    if (!confirm('Cancel this registration?')) return;
    try {
      await api.delete(`/attendees/${attendeeId}/cancel/${eventId}`);
      toast.success('Registration cancelled');
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Attendees</h2>
        <button onClick={openCreate} className="btn-primary">Add Attendee</button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Name', 'Email', 'Phone', 'Registered Events', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-gray-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {attendees.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No attendees found</td></tr>
            ) : attendees.map((a) => (
              <tr key={a._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{a.name}</td>
                <td className="px-4 py-3 text-gray-600">{a.email}</td>
                <td className="px-4 py-3">{a.phone}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(a.registeredEvents || []).map((ev) => (
                      <span key={ev._id} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded">
                        {ev.title}
                        <button onClick={() => handleCancelReg(a._id, ev._id)} className="text-red-400 hover:text-red-600 ml-0.5">&times;</button>
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openRegister(a)} className="btn-secondary text-xs">Register</button>
                    <button onClick={() => openEdit(a)} className="btn-secondary text-xs">Edit</button>
                    <button onClick={() => handleDelete(a._id)} className="btn-danger text-xs">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Attendee' : 'Add Attendee'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="input" required />
          </div>
          <div>
            <label className="label">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="input" required />
          </div>
          <div>
            <label className="label">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="input" placeholder="+91 98765 43210" required />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? 'Saving...' : editTarget ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={registerModal} onClose={() => setRegisterModal(false)} title={`Register ${selectedAttendee?.name} for Event`}>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="label">Select Event</label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="input"
              required
            >
              <option value="">Choose an event...</option>
              {events.map((ev) => (
                <option key={ev._id} value={ev._id}>
                  {ev.title} — {new Date(ev.date).toLocaleDateString()} ({ev.attendeesCount}/{ev.maxAttendees})
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={submitting || !selectedEventId} className="btn-primary flex-1">
              {submitting ? 'Registering...' : 'Register'}
            </button>
            <button type="button" onClick={() => setRegisterModal(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Attendees;
