import React, { useState, useMemo, useEffect } from 'react';
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

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        routeId: '',
        vesselType: 'Container',
        fuelType: 'HFO',
        year: new Date().getFullYear(),
        ghgIntensity: '',
        fuelConsumption: '',
        distance: ''
      });
      setError(null);
      setTouched({});
    }
  }, [isOpen]);

  // Esc key and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

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

  const inputBaseClass = "mt-1 block w-full outline-none border rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-150";
  const inputErrorClass = "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500";
  const inputNormalClass = "border-gray-300";

  const getInputClass = (fieldName: keyof FieldErrors) => {
    return `${inputBaseClass} ${touched[fieldName] && fieldErrors[fieldName] ? inputErrorClass : inputNormalClass}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-lg p-6 z-50 transform transition-all">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Add New Route</h2>
        
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 font-medium px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
              <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.routeId}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-5">
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

          <div className="grid grid-cols-2 gap-5">
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
                <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.ghgIntensity}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
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
                <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.fuelConsumption}</p>
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
                <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.distance}</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
