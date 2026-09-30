export type PlaceCategory =
  | 'Nature'
  | 'River & Wetland'
  | 'Heritage'
  | 'Religious'
  | 'Cultural'
  | 'Photography'
  | 'Other';

export interface Place {
  id: string;
  placeName: string;
  description: string;
  category: PlaceCategory;
  images: string[];
  coverImage: string;
  latitude: number;
  longitude: number;
  address: string;
  bestTimeToVisit: string;
  thingsToDo: string[];
  contributorId?: string;
  contributorName?: string;
  contributorEmail?: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export type TourismView =
  | 'selection'    // 2-card landing page (Explore Places vs Add Place)
  | 'explore'      // Grid of places with search, filter, view on map
  | 'add'          // Add a place form
  | 'detail'       // Single place detailed view
  | 'preview'      // Form preview before submission
  | 'success'      // Form submission success screen
  | 'map';         // Full interactive map view
