import { useState } from 'react';
import SpinWheel from './SpinWheel';

interface Location {
  name: string;
  address: string;
  description: string;
  type?: string;
  lng: number;
  lat: number;
  phone?: string;
  hours?: string;
}

interface ExploreAppProps {
  locations: Location[];
}

export default function ExploreApp({ locations }: ExploreAppProps) {
  const handleResult = (location: Location) => {
    // This is handled by the SpinWheel component itself now
    console.log('Location selected:', location.name);
  };

  return (
    <div className="flex flex-col items-center space-y-8 w-full">
      <SpinWheel
        locations={locations}
        onResult={handleResult}
      />
    </div>
  );
}