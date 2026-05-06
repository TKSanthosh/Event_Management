import { useState, useEffect } from 'react';
import api from '../api/axios';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const emptyForm = { name: '', email: '', phone: '', organizationName: '' };

const Organizers = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchOrganizers = async () => {
    try {
      const res = await api.get('/organizers');
      setOrganizers(res.data.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrganizers(); }, []);

  const openCreate = () => { setEditTarget(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (org) => {
    setEditTarget(org);
    setForm({ name: org.name, email: org.email, phone: org.phone, organizationName: org.organizationName });
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editTarget) {
        await api.put(`/organizers/${editTarget._id}`, form);
        toast.success('Organizer updated');
      } else {
        await api.post('/organizers', form);
        toast.success('Organizer created');
      }
      setModalOpen(false);
      fetchOrganizers();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this organizer?')) return;
    try {
      await api.delete(`/organizers/${id}`);
      toast.success('Organizer deleted');
      fetchOrganizers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Organizers</h2>
        <button onClick={openCreate} className="btn-primary">Add Organizer</button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Name', 'Organization', 'Email', 'Phone', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-gray-600 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {organizers.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No organizers found</td></tr>
            ) : organizers.map((o) => (
              <tr key={o._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{o.name}</td>
                <td className="px-4 py-3 text-gray-600">{o.organizationName}</td>
                <td className="px-4 py-3 text-gray-600">{o.email}</td>
                <td className="px-4 py-3">{o.phone}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => openEdit(o)} className="btn-secondary text-xs">Edit</button>
                  <button onClick={() => handleDelete(o._id)} className="btn-danger text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? 'Edit Organizer' : 'Add Organizer'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="input" required />
          </div>
          <div>
            <label className="label">Organization Name</label>
            <input name="organizationName" value={form.organizationName} onChange={handleChange} className="input" required />
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
    </div>
  );
};

export default Organizers;
