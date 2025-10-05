import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage, useForm } from '@inertiajs/react';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

const Network = () => {
  const { networks: initialNetworks, flash = {} } = usePage().props;
  const [networks, setNetworks] = useState(initialNetworks || []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const form = useForm({
    name: '',
    description: '',
    type: '',
  });

  const openForm = (network = null) => {
    if (network) {
      form.setData({
        name: network.name,
        description: network.description || '',
        type: network.type,
      });
      setEditingId(network.id);
    } else {
      form.reset();
      setEditingId(null);
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    form.reset();
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      form.put(`/networks/${editingId}`, {
        onSuccess: () => {
          closeForm();
        },
      });
    } else {
      form.post('/networks', {
        onSuccess: () => {
          closeForm();
        },
      });
    }
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this network?')) {
      Inertia.delete(`/networks/${id}`, {
        onSuccess: () => {
          // Optionally update local state or refetch
        },
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Networks</h1>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all"
        >
          <FaPlus /> Create Network
        </button>
      </div>

      {flash.success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg border border-green-200">
          {flash.success}
        </div>
      )}

      {isFormOpen && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingId ? 'Edit Network' : 'Create New Network'}
            </h2>
            <button onClick={closeForm} className="text-gray-500 hover:text-gray-700">
              <FaTimes size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Name *</label>
              <input
                type="text"
                value={form.data.name}
                onChange={(e) => form.setData('name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {form.errors.name && <p className="text-red-600 text-sm mt-1">{form.errors.name}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Description</label>
              <textarea
                value={form.data.description}
                onChange={(e) => form.setData('description', e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {form.errors.description && (
                <p className="text-red-600 text-sm mt-1">{form.errors.description}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">Type *</label>
              <input
                type="text"
                value={form.data.type}
                onChange={(e) => form.setData('type', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {form.errors.type && <p className="text-red-600 text-sm mt-1">{form.errors.type}</p>}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={form.processing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingId ? 'Update Network' : 'Create Network'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {networks.map((network) => (
          <div
            key={network.id}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-800">{network.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => openForm(network)}
                    className="text-gray-500 hover:text-blue-600 p-1"
                    aria-label="Edit network"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(network.id)}
                    className="text-gray-500 hover:text-red-600 p-1"
                    aria-label="Delete network"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <p className="text-gray-600">{network.description}</p>
              <p className="text-gray-500 text-sm mt-2">Type: {network.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Network;
