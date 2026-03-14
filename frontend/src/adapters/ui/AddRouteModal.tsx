import React, { useState } from 'react';
import { apiPost } from '../infrastructure/apiClient';

interface AddRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  showToast: (message: string) => void;
}

export const AddRouteModal: React.FC<AddRouteModalProps> = ({ isOpen, onClose, onSuccess, showToast }) => {
  const [formData, setFormData] = useState({
    routeId: '',
    vesselType: 'Container',
    fuelType: 'HFO',
    year: new Date().getFullYear(),
    ghgIntensity: '',
    fuelConsumption: '',
    distance: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.routeId || !formData.ghgIntensity || !formData.fuelConsumption || !formData.distance) {
      setError('Please fill in all required fields.');
      return;
    }

    const payload = {
      ...formData,
      year: Number(formData.year),
      ghgIntensity: Number(formData.ghgIntensity),
      fuelConsumption: Number(formData.fuelConsumption),
      distance: Number(formData.distance),
    };

    if (payload.ghgIntensity <= 0 || payload.fuelConsumption <= 0 || payload.distance <= 0) {
      setError('Numerical values must be positive.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await apiPost('/routes', payload);
      if (res.success) {
        showToast('Route added successfully');
        onSuccess();
        onClose();
      } else {
        throw new Error('Failed to add route');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Route</h3>
        
        {error && (
          <div className="mb-4 bg-red-50 text-red-700 p-3 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Route ID</label>
            <input
              type="text"
              name="routeId"
              value={formData.routeId}
              onChange={handleChange}
              className="mt-1 block w-full outline-none border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g. R006"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Vessel Type</label>
              <select
                name="vesselType"
                value={formData.vesselType}
                onChange={handleChange}
                className="mt-1 block w-full outline-none border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="Container">Container</option>
                <option value="BulkCarrier">BulkCarrier</option>
                <option value="Tanker">Tanker</option>
                <option value="RoRo">RoRo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="mt-1 block w-full outline-none border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="HFO">HFO</option>
                <option value="LNG">LNG</option>
                <option value="MGO">MGO</option>
                <option value="VLSFO">VLSFO</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="mt-1 block w-full outline-none border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">GHG Intensity</label>
              <input
                type="number"
                step="0.01"
                name="ghgIntensity"
                value={formData.ghgIntensity}
                onChange={handleChange}
                className="mt-1 block w-full outline-none border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Fuel Cons. (tons)</label>
              <input
                type="number"
                step="0.1"
                name="fuelConsumption"
                value={formData.fuelConsumption}
                onChange={handleChange}
                className="mt-1 block w-full outline-none border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Distance (nm)</label>
              <input
                type="number"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                className="mt-1 block w-full outline-none border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Route'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
