import { useState, useEffect } from 'react';
import api from '../api/axios';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const emptyForm = { name: '', address: '', city: '', capacity: '' };

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchVenues = async () => {
    try {
      const res = await api.get('/venues');
      setVenues(res.data.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVenues(); }, []);

  const openCreate = () => { setEditTarget(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (venue) => {
    setEditTarget(venue);
    setForm({ name: venue.name, address: venue.address, city: venue.city, capacity: venue.capacity });
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editTarget) {
        await api.put(`/venues/${editTarget._id}`, { ...form, capacity: Number(form.capacity) });
        toast.success('Venue updated');
      } else {
        await api.post('/venues', { ...form, capacity: Number(form.capacity) });
        toast.success('Venue created');
      }
      setModalOpen(false);
      fetchVenues();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this venue?')) return;
    try {
      await api.delete(`/venues/${id}`);
      toast.success('Venue deleted');
      fetchVenues();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Venues</h2>
        <button onClick={openCreate} className="btn-primary">Add Venue</button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Name', 'Address', 'City', 'Capacity', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-gray-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {venues.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No venues found</td></tr>
            ) : venues.map((v) => (
              <tr key={v._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{v.name}</td>
                <td className="px-4 py-3 text-gray-600">{v.address}</td>
                <td className="px-4 py-3 text-gray-600">{v.city}</td>
                <td className="px-4 py-3">{v.capacity}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => openEdit(v)} className="btn-secondary text-xs">Edit</button>
                  <button onClick={() => handleDelete(v._id)} className="btn-danger text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Venue' : 'Add Venue'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="input" required />
          </div>
          <div>
            <label className="label">Address</label>
            <input name="address" value={form.address} onChange={handleChange} className="input" required />
          </div>
          <div>
            <label className="label">City</label>
            <input name="city" value={form.city} onChange={handleChange} className="input" required />
          </div>
          <div>
            <label className="label">Capacity</label>
            <input name="capacity" type="number" min="1" value={form.capacity} onChange={handleChange} className="input" required />
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

export default Venues;
