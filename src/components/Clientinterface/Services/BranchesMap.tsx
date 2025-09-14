import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Header from '../../common/Header';
import axios from 'axios';

// Define interface for branch data
interface Branch {
  centerId: number;
  location: string;
  centerName: string;
  contactNo: number;
  contactPerson: string;
  email: string;
  latitude?: number;
  longitude?: number;
}

const BranchesMap: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define default coordinates for Sri Lanka
  const defaultCenter = { lat: 7.8731, lng: 80.7718 };

  // Custom marker icon - using brand green
  const customIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Geocoding function to get coordinates from location name
  const geocodeLocation = async (location: string): Promise<[number, number] | null> => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)},Sri Lanka`
      );
      
      if (response.data && response.data.length > 0) {
        return [parseFloat(response.data[0].lat), parseFloat(response.data[0].lon)];
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get('http://localhost:8083/recycling-centers/getAll');
        
        if (response.data) {
          // Transform the data if needed
          const branchData = Array.isArray(response.data) ? response.data : [response.data];
          
          // Process each branch to add coordinates
          const processedBranches = await Promise.all(
            branchData.map(async (branch: Branch) => {
              const coordinates = await geocodeLocation(branch.location);
              return {
                ...branch,
                latitude: coordinates ? coordinates[0] : defaultCenter.lat,
                longitude: coordinates ? coordinates[1] : defaultCenter.lng
              };
            })
          );

          setBranches(processedBranches);
        }
      } catch (err) {
        console.error('Error fetching branches:', err);
        setError('Failed to load branch locations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8" style={{ paddingTop: '85px' }}>
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8" style={{ paddingTop: '85px' }}>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Our Branch Locations</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {!error && branches.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">No branch locations found</div>
            </div>
          )}

          {!error && branches.length > 0 && (
            <>
              {/* Map Container */}
              <div className="h-[400px] rounded-lg overflow-hidden mb-8">
                <MapContainer
                  center={[defaultCenter.lat, defaultCenter.lng]}
                  zoom={8}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {branches.map((branch) => (
                    <Marker
                      key={branch.centerId}
                      position={[branch.latitude || defaultCenter.lat, branch.longitude || defaultCenter.lng]}
                      icon={customIcon}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-bold text-lg mb-2">{branch.centerName}</h3>
                          <p className="text-gray-600 mb-1">{branch.location}</p>
                          <p className="text-gray-600 mb-1">
                            <span className="font-semibold">Contact Person:</span> {branch.contactPerson}
                          </p>
                          <p className="text-gray-600 mb-1">
                            <span className="font-semibold">Contact:</span> {branch.contactNo}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-semibold">Email:</span> {branch.email}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* Branches List */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {branches.map((branch) => (
                  <div key={branch.centerId} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="font-bold text-lg mb-2">{branch.centerName}</h3>
                    <p className="text-gray-600 mb-1">{branch.location}</p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-semibold">Contact Person:</span> {branch.contactPerson}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-semibold">Contact:</span> {branch.contactNo}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Email:</span> {branch.email}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchesMap;
