import React, { useState, useMemo } from 'react';
import { apiPost } from '../infrastructure/apiClient';

interface AddRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  showToast: (message: string) => void;
}

interface FieldErrors {
  routeId?: string;
  ghgIntensity?: string;
  fuelConsumption?: string;
  distance?: string;
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
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'routeId' ? value.toUpperCase() : value
    }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  // Per-field validation
  const fieldErrors: FieldErrors = useMemo(() => {
    const errors: FieldErrors = {};

    if (!formData.routeId.trim()) {
      errors.routeId = 'Route ID is required';
    } else if (!/^R[0-9]{3}$/.test(formData.routeId)) {
      errors.routeId = 'Route ID must follow format R001';
    }

    if (formData.ghgIntensity !== '' && Number(formData.ghgIntensity) <= 0) {
      errors.ghgIntensity = 'GHG Intensity must be greater than 0';
    } else if (formData.ghgIntensity === '') {
      errors.ghgIntensity = 'GHG Intensity is required';
    }

    if (formData.fuelConsumption !== '' && Number(formData.fuelConsumption) <= 0) {
      errors.fuelConsumption = 'Fuel Consumption must be greater than 0';
    } else if (formData.fuelConsumption === '') {
      errors.fuelConsumption = 'Fuel Consumption is required';
    }

    if (formData.distance !== '' && Number(formData.distance) <= 0) {
      errors.distance = 'Distance must be greater than 0';
    } else if (formData.distance === '') {
      errors.distance = 'Distance is required';
    }

    return errors;
  }, [formData]);

  const isFormValid = Object.keys(fieldErrors).length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ routeId: true, ghgIntensity: true, fuelConsumption: true, distance: true });

    if (!isFormValid) {
      return;
    }

    const payload = {
      ...formData,
      year: Number(formData.year),
      ghgIntensity: Number(formData.ghgIntensity),
      fuelConsumption: Number(formData.fuelConsumption),
      distance: Number(formData.distance),
    };

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

  const inputBaseClass = "mt-1 block w-full outline-none border rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  const inputErrorClass = "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500";
  const inputNormalClass = "border-gray-300";

  const getInputClass = (fieldName: keyof FieldErrors) => {
    return `${inputBaseClass} ${touched[fieldName] && fieldErrors[fieldName] ? inputErrorClass : inputNormalClass}`;
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
              onBlur={handleBlur}
              className={getInputClass('routeId')}
              placeholder="e.g. R006"
            />
            {touched.routeId && fieldErrors.routeId && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.routeId}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Vessel Type</label>
              <select
                name="vesselType"
                value={formData.vesselType}
                onChange={handleChange}
                className={`${inputBaseClass} ${inputNormalClass}`}
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
                className={`${inputBaseClass} ${inputNormalClass}`}
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
                className={`${inputBaseClass} ${inputNormalClass}`}
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
                onBlur={handleBlur}
                className={getInputClass('ghgIntensity')}
              />
              {touched.ghgIntensity && fieldErrors.ghgIntensity && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.ghgIntensity}</p>
              )}
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
                onBlur={handleBlur}
                className={getInputClass('fuelConsumption')}
              />
              {touched.fuelConsumption && fieldErrors.fuelConsumption && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.fuelConsumption}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Distance (nm)</label>
              <input
                type="number"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClass('distance')}
              />
              {touched.distance && fieldErrors.distance && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.distance}</p>
              )}
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
              className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !isFormValid}
            >
              {loading ? 'Adding...' : 'Add Route'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
