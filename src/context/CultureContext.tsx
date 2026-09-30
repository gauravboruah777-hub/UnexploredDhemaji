import React, { createContext, useContext, useState, useEffect } from 'react';
import { CultureItem, CultureCategory } from '../types/culture';
import { INITIAL_CULTURE } from '../data/initialCulture';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

interface CultureContextType {
  cultureItems: CultureItem[];
  approvedCultureItems: CultureItem[];
  pendingCultureItems: CultureItem[];
  rejectedCultureItems: CultureItem[];
  userCultureSubmissions: CultureItem[];
  isLoadingCulture: boolean;
  addCultureItem: (
    itemData: Omit<CultureItem, 'id' | 'createdAt' | 'status'>
  ) => Promise<{ success: boolean; id?: string; error?: string }>;
  updateCultureStatus: (cultureId: string, status: 'approved' | 'rejected') => Promise<boolean>;
  updateCultureItem: (cultureId: string, updatedFields: Partial<CultureItem>) => Promise<boolean>;
  deleteCultureItem: (cultureId: string) => Promise<boolean>;
  deleteCultureImage: (cultureId: string, imageIndex: number) => Promise<boolean>;
  getCultureById: (id: string) => CultureItem | undefined;
}

const CultureContext = createContext<CultureContextType | undefined>(undefined);

const LOCAL_STORAGE_CULTURE_KEY = 'unexplored_dhemaji_community_culture';

export const CultureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cultureItems, setCultureItems] = useState<CultureItem[]>(INITIAL_CULTURE);
  const [userCultureSubmissions, setUserCultureSubmissions] = useState<CultureItem[]>([]);
  const [isLoadingCulture, setIsLoadingCulture] = useState<boolean>(true);

  // Derived filtered lists
  const approvedCultureItems = cultureItems.filter(c => c.status === 'approved');
  const pendingCultureItems = cultureItems.filter(c => c.status === 'pending');
  const rejectedCultureItems = cultureItems.filter(c => c.status === 'rejected');

  // Load from local storage & Firestore
  useEffect(() => {
    let unsubscribe = () => {};

    const loadCulture = async () => {
      // 1. Local storage cached contributions
      try {
        const localData = localStorage.getItem(LOCAL_STORAGE_CULTURE_KEY);
        if (localData) {
          const parsed: CultureItem[] = JSON.parse(localData);
          setUserCultureSubmissions(parsed);
        }
      } catch (e) {
        console.warn('Local culture cache warning:', e);
      }

      // 2. Sync with Firestore collection 'culture'
      try {
        const cultureCollection = collection(db, 'culture');
        unsubscribe = onSnapshot(
          cultureCollection,
          (snapshot) => {
            const firestoreItems: CultureItem[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              firestoreItems.push({
                id: docSnap.id,
                title: data.title || '',
                category: data.category || 'Folk Dance & Music',
                description: data.description || '',
                images: data.images || [],
                coverImage: data.coverImage || data.images?.[0] || '',
                community: data.community || '',
                villageOrArea: data.villageOrArea || '',
                language: data.language,
                latitude: Number(data.latitude) || 27.48,
                longitude: Number(data.longitude) || 94.58,
                history: data.history,
                significance: data.significance,
                howPracticed: data.howPracticed,
                relatedFestivals: data.relatedFestivals || [],
                videoUrl: data.videoUrl,
                contributorId: data.contributorId,
                contributorName: data.contributorName,
                contributorEmail: data.contributorEmail,
                createdAt: data.createdAt || new Date().toISOString(),
                status: data.status || 'pending'
              });
            });

            // Merge curated initial culture with Firestore culture
            const mergedMap = new Map<string, CultureItem>();
            INITIAL_CULTURE.forEach(c => mergedMap.set(c.id, c));
            firestoreItems.forEach(c => mergedMap.set(c.id, c));

            const allItems = Array.from(mergedMap.values());
            setCultureItems(allItems);
            setIsLoadingCulture(false);
          },
          (error) => {
            console.warn('Firestore culture snapshot note (using initial):', error);
            setIsLoadingCulture(false);
          }
        );
      } catch (err) {
        console.warn('Firestore culture setup note:', err);
        setIsLoadingCulture(false);
      }
    };

    loadCulture();
    return () => unsubscribe();
  }, []);

  // Submit new cultural story / item
  const addCultureItem = async (
    itemData: Omit<CultureItem, 'id' | 'createdAt' | 'status'>
  ): Promise<{ success: boolean; id?: string; error?: string }> => {
    try {
      const newCultureId = 'culture_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      const createdAt = new Date().toISOString();

      const newCultureItem: CultureItem = {
        ...itemData,
        id: newCultureId,
        createdAt,
        status: 'pending' // New submissions start as pending review
      };

      // 1. Save to local storage for instant contributor feedback
      const updatedSubmissions = [newCultureItem, ...userCultureSubmissions];
      setUserCultureSubmissions(updatedSubmissions);
      try {
        localStorage.setItem(LOCAL_STORAGE_CULTURE_KEY, JSON.stringify(updatedSubmissions));
      } catch (e) {
        console.warn('Could not cache user culture locally:', e);
      }

      // 2. Add to internal state as pending (will not appear in approvedCultureItems)
      setCultureItems(prev => [newCultureItem, ...prev.filter(c => c.id !== newCultureId)]);

      // 3. Save to Firestore collection 'culture'
      try {
        const cultureCollection = collection(db, 'culture');
        const docRef = await addDoc(cultureCollection, {
          title: newCultureItem.title,
          category: newCultureItem.category,
          description: newCultureItem.description,
          images: newCultureItem.images,
          coverImage: newCultureItem.coverImage,
          community: newCultureItem.community,
          villageOrArea: newCultureItem.villageOrArea,
          language: newCultureItem.language || '',
          latitude: newCultureItem.latitude,
          longitude: newCultureItem.longitude,
          history: newCultureItem.history || '',
          significance: newCultureItem.significance || '',
          howPracticed: newCultureItem.howPracticed || '',
          relatedFestivals: newCultureItem.relatedFestivals || [],
          videoUrl: newCultureItem.videoUrl || '',
          contributorId: newCultureItem.contributorId || '',
          contributorName: newCultureItem.contributorName || 'Traveler Contributor',
          contributorEmail: newCultureItem.contributorEmail || '',
          createdAt: newCultureItem.createdAt,
          status: 'pending'
        });
        return { success: true, id: docRef.id };
      } catch (firestoreErr: any) {
        console.warn('Firestore culture write notice:', firestoreErr);
        return { success: true, id: newCultureId };
      }
    } catch (err: any) {
      console.error('Error adding culture story:', err);
      return { success: false, error: err.message || 'Failed to submit cultural story' };
    }
  };

  // Admin: Update culture status (approve / reject)
  const updateCultureStatus = async (cultureId: string, status: 'approved' | 'rejected'): Promise<boolean> => {
    try {
      setCultureItems(prev =>
        prev.map(c => (c.id === cultureId ? { ...c, status } : c))
      );
      setUserCultureSubmissions(prev =>
        prev.map(c => (c.id === cultureId ? { ...c, status } : c))
      );

      try {
        const cultureRef = doc(db, 'culture', cultureId);
        await updateDoc(cultureRef, { status });
      } catch (err) {
        console.warn('Firestore culture status update notice:', err);
      }
      return true;
    } catch (e) {
      console.error('Failed to update culture status:', e);
      return false;
    }
  };

  // Admin: Edit culture details
  const updateCultureItem = async (cultureId: string, updatedFields: Partial<CultureItem>): Promise<boolean> => {
    try {
      setCultureItems(prev =>
        prev.map(c => (c.id === cultureId ? { ...c, ...updatedFields } : c))
      );
      setUserCultureSubmissions(prev =>
        prev.map(c => (c.id === cultureId ? { ...c, ...updatedFields } : c))
      );

      try {
        const cultureRef = doc(db, 'culture', cultureId);
        await updateDoc(cultureRef, updatedFields);
      } catch (err) {
        console.warn('Firestore culture updateDoc notice:', err);
      }
      return true;
    } catch (e) {
      console.error('Failed to update culture item:', e);
      return false;
    }
  };

  // Admin: Delete culture item
  const deleteCultureItem = async (cultureId: string): Promise<boolean> => {
    try {
      setCultureItems(prev => prev.filter(c => c.id !== cultureId));
      setUserCultureSubmissions(prev => prev.filter(c => c.id !== cultureId));

      try {
        const cultureRef = doc(db, 'culture', cultureId);
        await deleteDoc(cultureRef);
      } catch (err) {
        console.warn('Firestore culture deleteDoc notice:', err);
      }
      return true;
    } catch (e) {
      console.error('Failed to delete culture item:', e);
      return false;
    }
  };

  // Admin: Delete single image from culture item
  const deleteCultureImage = async (cultureId: string, imageIndex: number): Promise<boolean> => {
    const target = cultureItems.find(c => c.id === cultureId);
    if (!target || !target.images) return false;

    const newImages = target.images.filter((_, idx) => idx !== imageIndex);
    const newCover =
      newImages.length > 0
        ? target.coverImage === target.images[imageIndex]
          ? newImages[0]
          : target.coverImage
        : 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80';

    return await updateCultureItem(cultureId, {
      images: newImages,
      coverImage: newCover
    });
  };

  const getCultureById = (id: string): CultureItem | undefined => {
    return cultureItems.find(c => c.id === id);
  };

  return (
    <CultureContext.Provider
      value={{
        cultureItems,
        approvedCultureItems,
        pendingCultureItems,
        rejectedCultureItems,
        userCultureSubmissions,
        isLoadingCulture,
        addCultureItem,
        updateCultureStatus,
        updateCultureItem,
        deleteCultureItem,
        deleteCultureImage,
        getCultureById
      }}
    >
      {children}
    </CultureContext.Provider>
  );
};

export const useCulture = () => {
  const context = useContext(CultureContext);
  if (!context) {
    throw new Error('useCulture must be used within a CultureProvider');
  }
  return context;
};
