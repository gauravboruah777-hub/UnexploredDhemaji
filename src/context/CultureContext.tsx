import React, { createContext, useContext, useState, useEffect } from 'react';
import { CultureItem, CultureCategory } from '../types/culture';
import { INITIAL_CULTURE } from '../data/initialCulture';
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
      let localSubmissions: CultureItem[] = [];
      try {
        const localData = localStorage.getItem(LOCAL_STORAGE_CULTURE_KEY);
        if (localData) {
          localSubmissions = JSON.parse(localData);
          setUserCultureSubmissions(localSubmissions);
        }
      } catch (e) {
        console.warn('Local culture cache warning:', e);
      }

      setCultureItems(() => {
        const initialMap = new Map<string, CultureItem>();
        INITIAL_CULTURE.forEach(c => initialMap.set(c.id, c));
        localSubmissions.forEach(c => initialMap.set(c.id, c));
        return Array.from(initialMap.values());
      });

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

            // Read the latest local submissions from localStorage
            let latestLocalSubmissions: CultureItem[] = [];
            try {
              const currentLocal = localStorage.getItem(LOCAL_STORAGE_CULTURE_KEY);
              if (currentLocal) {
                latestLocalSubmissions = JSON.parse(currentLocal);
              }
            } catch (err) {}

            const mergedMap = new Map<string, CultureItem>();
            INITIAL_CULTURE.forEach(c => mergedMap.set(c.id, c));
            latestLocalSubmissions.forEach(c => mergedMap.set(c.id, c));

            firestoreItems.forEach(c => {
              const existingLocal = latestLocalSubmissions.find(
                l => l.id === c.id || l.title.toLowerCase().trim() === c.title.toLowerCase().trim()
              );
              if (existingLocal && existingLocal.status === 'approved' && c.status === 'pending') {
                c.status = 'approved';
                setDoc(doc(db, 'culture', c.id), { status: 'approved' }, { merge: true }).catch(() => {});
              }

              for (const [key, val] of mergedMap.entries()) {
                if (key !== c.id && val.title.toLowerCase().trim() === c.title.toLowerCase().trim()) {
                  mergedMap.delete(key);
                }
              }
              mergedMap.set(c.id, c);
            });

            setCultureItems(Array.from(mergedMap.values()));
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
      setUserCultureSubmissions(prev => {
        const updated = [newCultureItem, ...prev.filter(c => c.id !== newCultureId)];
        try {
          localStorage.setItem(LOCAL_STORAGE_CULTURE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn('Could not cache user culture locally:', e);
        }
        return updated;
      });

      // 2. Add to internal state as pending (will not appear in approvedCultureItems)
      setCultureItems(prev => [newCultureItem, ...prev.filter(c => c.id !== newCultureId)]);

      // 3. Save to Firestore collection 'culture' with matching newCultureId!
      try {
        const docRef = doc(db, 'culture', newCultureId);
        await setDoc(docRef, {
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
        return { success: true, id: newCultureId };
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
      const targetItem = cultureItems.find(c => c.id === cultureId);
      const targetTitle = targetItem?.title.toLowerCase().trim();

      setCultureItems(prev =>
        prev.map(c => {
          if (c.id === cultureId || (targetTitle && c.title.toLowerCase().trim() === targetTitle)) {
            return { ...c, status };
          }
          return c;
        })
      );

      setUserCultureSubmissions(prev => {
        const updated = prev.map(c => {
          if (c.id === cultureId || (targetTitle && c.title.toLowerCase().trim() === targetTitle)) {
            return { ...c, status };
          }
          return c;
        });
        try {
          localStorage.setItem(LOCAL_STORAGE_CULTURE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn('Could not cache user culture locally:', e);
        }
        return updated;
      });

      try {
        const cultureRef = doc(db, 'culture', cultureId);
        await setDoc(cultureRef, { status }, { merge: true });

        if (targetItem?.title) {
          const q = query(collection(db, 'culture'), where('title', '==', targetItem.title));
          const snap = await getDocs(q);
          for (const d of snap.docs) {
            if (d.id !== cultureId) {
              await setDoc(doc(db, 'culture', d.id), { status }, { merge: true });
            }
          }
        }
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
      const targetItem = cultureItems.find(c => c.id === cultureId);
      const targetTitle = targetItem?.title.toLowerCase().trim();

      setCultureItems(prev =>
        prev.map(c => {
          if (c.id === cultureId || (targetTitle && c.title.toLowerCase().trim() === targetTitle)) {
            return { ...c, ...updatedFields };
          }
          return c;
        })
      );

      setUserCultureSubmissions(prev => {
        const updated = prev.map(c => {
          if (c.id === cultureId || (targetTitle && c.title.toLowerCase().trim() === targetTitle)) {
            return { ...c, ...updatedFields };
          }
          return c;
        });
        try {
          localStorage.setItem(LOCAL_STORAGE_CULTURE_KEY, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      try {
        const cultureRef = doc(db, 'culture', cultureId);
        await setDoc(cultureRef, updatedFields, { merge: true });
      } catch (err) {
        console.warn('Firestore updateDoc notice:', err);
      }
      return true;
    } catch (e) {
      console.error('Failed to update culture:', e);
      return false;
    }
  };

  // Admin: Delete culture item
  const deleteCultureItem = async (cultureId: string): Promise<boolean> => {
    try {
      const targetItem = cultureItems.find(c => c.id === cultureId);
      const targetTitle = targetItem?.title.toLowerCase().trim();

      setCultureItems(prev =>
        prev.filter(c => c.id !== cultureId && (!targetTitle || c.title.toLowerCase().trim() !== targetTitle))
      );

      setUserCultureSubmissions(prev => {
        const updated = prev.filter(
          c => c.id !== cultureId && (!targetTitle || c.title.toLowerCase().trim() !== targetTitle)
        );
        try {
          localStorage.setItem(LOCAL_STORAGE_CULTURE_KEY, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      try {
        const cultureRef = doc(db, 'culture', cultureId);
        await deleteDoc(cultureRef);

        if (targetItem?.title) {
          const q = query(collection(db, 'culture'), where('title', '==', targetItem.title));
          const snap = await getDocs(q);
          for (const d of snap.docs) {
            await deleteDoc(doc(db, 'culture', d.id));
          }
        }
      } catch (err) {
        console.warn('Firestore deleteDoc notice:', err);
      }
      return true;
    } catch (e) {
      console.error('Failed to delete culture item:', e);
      return false;
    }
  };

  // Admin: Delete single image from culture entry
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
