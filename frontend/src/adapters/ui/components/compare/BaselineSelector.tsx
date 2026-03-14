import React, { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { Route } from '../../../../core/domain/Route';
import { useBaseline } from '../../context/BaselineContext';

interface BaselineSelectorProps {
  routes: Route[];
}

export const BaselineSelector: React.FC<BaselineSelectorProps> = ({ routes }) => {
  const { baselineRouteId, setBaselineRouteId } = useBaseline();
  const [query, setQuery] = useState('');

  const filteredRoutes =
    query === ''
      ? routes
      : routes.filter((route) =>
          route.routeId.toUpperCase().includes(query.toUpperCase())
        );

  const selectedRoute = routes.find((r) => r.routeId === baselineRouteId) || null;

  return (
    <div className="relative w-full z-10">
      <Combobox
        value={selectedRoute}
        onChange={(route: Route | null) => {
          if (route) setBaselineRouteId(route.routeId);
        }}
      >
        <div className="relative">
          <Combobox.Input
            className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 py-2 pl-3 pr-10 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase"
            displayValue={(route: Route) => (route ? route.routeId.toUpperCase() : '')}
            onChange={(event) => setQuery(event.target.value.toUpperCase())}
            placeholder="Type or select a Baseline Route..."
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <svg
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Combobox.Button>
        </div>
        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-20">
          {filteredRoutes.length === 0 && query !== '' ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
              Nothing found.
            </div>
          ) : (
            filteredRoutes.map((route) => (
              <Combobox.Option
                key={route.routeId}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-4 pr-4 ${
                    active ? 'bg-blue-600 text-white' : 'text-gray-900'
                  }`
                }
                value={route}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {route.routeId.toUpperCase()} <span className="text-opacity-70 text-sm">({route.ghgIntensity.toFixed(2)} gCO₂e/MJ)</span>
                    </span>
                  </>
                )}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Combobox>
    </div>
  );
};

