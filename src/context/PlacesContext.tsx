import React, { createContext, useContext, useState, useEffect } from 'react';
import { Place, PlaceCategory } from '../types/place';
import { INITIAL_PLACES } from '../data/initialPlaces';
import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  query,
  where
} from 'firebase/firestore';

interface PlacesContextType {
  places: Place[];
  approvedPlaces: Place[];
  pendingPlaces: Place[];
  rejectedPlaces: Place[];
  userSubmissions: Place[];
  isLoadingPlaces: boolean;
  addPlace: (placeData: Omit<Place, 'id' | 'createdAt' | 'status'>) => Promise<{ success: boolean; id?: string; error?: string }>;
  updatePlaceStatus: (placeId: string, status: 'approved' | 'rejected') => Promise<boolean>;
  updatePlace: (placeId: string, updatedFields: Partial<Place>) => Promise<boolean>;
  deletePlace: (placeId: string) => Promise<boolean>;
  deletePlaceImage: (placeId: string, imageIndex: number) => Promise<boolean>;
  getPlaceById: (id: string) => Place | undefined;
}

const PlacesContext = createContext<PlacesContextType | undefined>(undefined);

const LOCAL_STORAGE_PLACES_KEY = 'unexplored_dhemaji_community_places';

export const PlacesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [places, setPlaces] = useState<Place[]>(INITIAL_PLACES);
  const [userSubmissions, setUserSubmissions] = useState<Place[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState<boolean>(true);

  // Derived filtered lists
  const approvedPlaces = places.filter(p => p.status === 'approved');
  const pendingPlaces = places.filter(p => p.status === 'pending');
  const rejectedPlaces = places.filter(p => p.status === 'rejected');

  // Load places from Firestore & Local Storage
  useEffect(() => {
    let unsubscribe = () => {};

    const loadPlaces = async () => {
      // 1. Load any locally cached community submissions first
      let localSubmissions: Place[] = [];
      try {
        const localData = localStorage.getItem(LOCAL_STORAGE_PLACES_KEY);
        if (localData) {
          localSubmissions = JSON.parse(localData);
          setUserSubmissions(localSubmissions);
        }
      } catch (e) {
        console.warn('Local places load warning:', e);
      }

      // Initialize with curated initial places + local submissions
      setPlaces(() => {
        const initialMap = new Map<string, Place>();
        INITIAL_PLACES.forEach(p => initialMap.set(p.id, p));
        localSubmissions.forEach(p => initialMap.set(p.id, p));
        return Array.from(initialMap.values());
      });

      // 2. Sync with Firestore collection 'places'
      try {
        const placesCollection = collection(db, 'places');
        unsubscribe = onSnapshot(
          placesCollection,
          (snapshot) => {
            const firestorePlaces: Place[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              firestorePlaces.push({
                id: docSnap.id,
                placeName: data.placeName || '',
                description: data.description || '',
                category: data.category || 'Nature',
                images: data.images || [],
                coverImage: data.coverImage || data.images?.[0] || '',
                latitude: Number(data.latitude) || 27.48,
                longitude: Number(data.longitude) || 94.58,
                address: data.address || '',
                bestTimeToVisit: data.bestTimeToVisit || 'October – April',
                thingsToDo: data.thingsToDo || [],
                contributorId: data.contributorId,
                contributorName: data.contributorName,
                contributorEmail: data.contributorEmail,
                createdAt: data.createdAt || new Date().toISOString(),
                status: data.status || 'pending'
              });
            });

            // Read the latest local submissions from localStorage to preserve approved status
            let latestLocalSubmissions: Place[] = [];
            try {
              const currentLocal = localStorage.getItem(LOCAL_STORAGE_PLACES_KEY);
              if (currentLocal) {
                latestLocalSubmissions = JSON.parse(currentLocal);
              }
            } catch (err) {}

            const mergedMap = new Map<string, Place>();
            INITIAL_PLACES.forEach(p => mergedMap.set(p.id, p));

            // Merge local submissions
            latestLocalSubmissions.forEach(p => mergedMap.set(p.id, p));

            // Merge Firestore places
            firestorePlaces.forEach(p => {
              // Check if there is an existing local entry with matching placeName or ID that was approved locally
              const existingLocal = latestLocalSubmissions.find(
                l => l.id === p.id || l.placeName.toLowerCase().trim() === p.placeName.toLowerCase().trim()
              );
              if (existingLocal && existingLocal.status === 'approved' && p.status === 'pending') {
                p.status = 'approved';
                setDoc(doc(db, 'places', p.id), { status: 'approved' }, { merge: true }).catch(() => {});
              }

              // Deduplicate by name if IDs differed
              for (const [key, val] of mergedMap.entries()) {
                if (key !== p.id && val.placeName.toLowerCase().trim() === p.placeName.toLowerCase().trim()) {
                  mergedMap.delete(key);
                }
              }
              mergedMap.set(p.id, p);
            });

            const allPlaces = Array.from(mergedMap.values());
            setPlaces(allPlaces);
            setIsLoadingPlaces(false);
          },
          (error) => {
            console.warn('Firestore snapshot listener note (falling back to initial places):', error);
            setIsLoadingPlaces(false);
          }
        );
      } catch (err) {
        console.warn('Firestore setup note:', err);
        setIsLoadingPlaces(false);
      }
    };

    loadPlaces();
    return () => unsubscribe();
  }, []);

  // Submit new place (Public or Contributor)
  const addPlace = async (
    placeData: Omit<Place, 'id' | 'createdAt' | 'status'>
  ): Promise<{ success: boolean; id?: string; error?: string }> => {
    try {
      const newPlaceId = 'place_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      const createdAt = new Date().toISOString();

      const newPlace: Place = {
        ...placeData,
        id: newPlaceId,
        createdAt,
        status: 'pending' // New submissions strictly start as pending review
      };

      // 1. Save to local storage for contributor tracking
      setUserSubmissions(prev => {
        const updated = [newPlace, ...prev.filter(p => p.id !== newPlaceId)];
        try {
          localStorage.setItem(LOCAL_STORAGE_PLACES_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn('Could not store to local storage:', e);
        }
        return updated;
      });

      // 2. Add to internal state as pending (will not appear in approvedPlaces)
      setPlaces(prev => [newPlace, ...prev.filter(p => p.id !== newPlaceId)]);

      // 3. Persist to Firestore collection 'places' with matching newPlaceId!
      try {
        const placeDocRef = doc(db, 'places', newPlaceId);
        await setDoc(placeDocRef, {
          placeName: newPlace.placeName,
          description: newPlace.description,
          category: newPlace.category,
          images: newPlace.images,
          coverImage: newPlace.coverImage,
          latitude: newPlace.latitude,
          longitude: newPlace.longitude,
          address: newPlace.address,
          bestTimeToVisit: newPlace.bestTimeToVisit,
          thingsToDo: newPlace.thingsToDo,
          contributorId: newPlace.contributorId || '',
          contributorName: newPlace.contributorName || 'Traveler Contributor',
          contributorEmail: newPlace.contributorEmail || '',
          createdAt: newPlace.createdAt,
          status: 'pending'
        });
        return { success: true, id: newPlaceId };
      } catch (firestoreErr: any) {
        console.warn('Firestore save warning:', firestoreErr);
        return { success: true, id: newPlaceId };
      }
    } catch (err: any) {
      console.error('Error adding place:', err);
      return { success: false, error: err.message || 'Failed to submit place' };
    }
  };

  // Admin: Update place status (approve / reject)
  const updatePlaceStatus = async (placeId: string, status: 'approved' | 'rejected'): Promise<boolean> => {
    try {
      const targetPlace = places.find(p => p.id === placeId);
      const targetName = targetPlace?.placeName.toLowerCase().trim();

      // 1. Local state update
      setPlaces(prev =>
        prev.map(p => {
          if (p.id === placeId || (targetName && p.placeName.toLowerCase().trim() === targetName)) {
            return { ...p, status };
          }
          return p;
        })
      );

      // 2. LocalStorage & userSubmissions update
      setUserSubmissions(prev => {
        const updated = prev.map(p => {
          if (p.id === placeId || (targetName && p.placeName.toLowerCase().trim() === targetName)) {
            return { ...p, status };
          }
          return p;
        });
        try {
          localStorage.setItem(LOCAL_STORAGE_PLACES_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn('LocalStorage save error:', e);
        }
        return updated;
      });

      // 3. Firestore update with setDoc merge
      try {
        const placeRef = doc(db, 'places', placeId);
        await setDoc(placeRef, { status }, { merge: true });

        // Also search for any Firestore document that matches by placeName
        if (targetPlace?.placeName) {
          const q = query(collection(db, 'places'), where('placeName', '==', targetPlace.placeName));
          const snap = await getDocs(q);
          for (const d of snap.docs) {
            if (d.id !== placeId) {
              await setDoc(doc(db, 'places', d.id), { status }, { merge: true });
            }
          }
        }
      } catch (err) {
        console.warn('Firestore status update notice:', err);
      }
      return true;
    } catch (e) {
      console.error('Failed to update place status:', e);
      return false;
    }
  };

  // Admin: Edit place details
  const updatePlace = async (placeId: string, updatedFields: Partial<Place>): Promise<boolean> => {
    try {
      const targetPlace = places.find(p => p.id === placeId);
      const targetName = targetPlace?.placeName.toLowerCase().trim();

      setPlaces(prev =>
        prev.map(p => {
          if (p.id === placeId || (targetName && p.placeName.toLowerCase().trim() === targetName)) {
            return { ...p, ...updatedFields };
          }
          return p;
        })
      );

      setUserSubmissions(prev => {
        const updated = prev.map(p => {
          if (p.id === placeId || (targetName && p.placeName.toLowerCase().trim() === targetName)) {
            return { ...p, ...updatedFields };
          }
          return p;
        });
        try {
          localStorage.setItem(LOCAL_STORAGE_PLACES_KEY, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      try {
        const placeRef = doc(db, 'places', placeId);
        await setDoc(placeRef, updatedFields, { merge: true });
      } catch (err) {
        console.warn('Firestore updateDoc notice:', err);
      }
      return true;
    } catch (e) {
      console.error('Failed to update place:', e);
      return false;
    }
  };

  // Admin: Delete place
  const deletePlace = async (placeId: string): Promise<boolean> => {
    try {
      const targetPlace = places.find(p => p.id === placeId);
      const targetName = targetPlace?.placeName.toLowerCase().trim();

      setPlaces(prev =>
        prev.filter(p => p.id !== placeId && (!targetName || p.placeName.toLowerCase().trim() !== targetName))
      );

      setUserSubmissions(prev => {
        const updated = prev.filter(
          p => p.id !== placeId && (!targetName || p.placeName.toLowerCase().trim() !== targetName)
        );
        try {
          localStorage.setItem(LOCAL_STORAGE_PLACES_KEY, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      try {
        const placeRef = doc(db, 'places', placeId);
        await deleteDoc(placeRef);

        if (targetPlace?.placeName) {
          const q = query(collection(db, 'places'), where('placeName', '==', targetPlace.placeName));
          const snap = await getDocs(q);
          for (const d of snap.docs) {
            await deleteDoc(doc(db, 'places', d.id));
          }
        }
      } catch (err) {
        console.warn('Firestore deleteDoc notice:', err);
      }
      return true;
    } catch (e) {
      console.error('Failed to delete place:', e);
      return false;
    }
  };

  // Admin: Delete single image from place
  const deletePlaceImage = async (placeId: string, imageIndex: number): Promise<boolean> => {
    const targetPlace = places.find(p => p.id === placeId);
    if (!targetPlace || !targetPlace.images) return false;

    const newImages = targetPlace.images.filter((_, idx) => idx !== imageIndex);
    const newCover =
      newImages.length > 0
        ? targetPlace.coverImage === targetPlace.images[imageIndex]
          ? newImages[0]
          : targetPlace.coverImage
        : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';

    return await updatePlace(placeId, {
      images: newImages,
      coverImage: newCover
    });
  };

  const getPlaceById = (id: string): Place | undefined => {
    return places.find(p => p.id === id);
  };

  return (
    <PlacesContext.Provider
      value={{
        places,
        approvedPlaces,
        pendingPlaces,
        rejectedPlaces,
        userSubmissions,
        isLoadingPlaces,
        addPlace,
        updatePlaceStatus,
        updatePlace,
        deletePlace,
        deletePlaceImage,
        getPlaceById
      }}
    >
      {children}
    </PlacesContext.Provider>
  );
};

export const usePlaces = () => {
  const context = useContext(PlacesContext);
  if (!context) {
    throw new Error('usePlaces must be used within a PlacesProvider');
  }
  return context;
};
