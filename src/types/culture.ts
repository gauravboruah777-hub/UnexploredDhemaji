export type CultureCategory =
  | 'Folk Dance & Music'
  | 'Festivals & Celebrations'
  | 'Traditional Weaving & Textiles'
  | 'Handicrafts & Art'
  | 'Traditional Food'
  | 'Traditional Lifestyle'
  | 'Traditional Dress'
  | 'Folklore & Stories'
  | 'Traditional Knowledge'
  | 'Communities & Heritage'
  | 'Other';

export interface CultureItem {
  id: string;
  title: string;
  category: CultureCategory;
  description: string;
  images: string[];
  coverImage: string;
  community: string;
  villageOrArea: string;
  language?: string;
  latitude: number;
  longitude: number;
  history?: string;
  significance?: string;
  howPracticed?: string;
  relatedFestivals?: string[];
  videoUrl?: string;
  contributorId?: string;
  contributorName?: string;
  contributorEmail?: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export type CultureView =
  | 'selection'   // 2-card landing page (Explore Culture vs Create Culture)
  | 'explore'     // Grid of cultural items with search and categories
  | 'create'      // Contribution form
  | 'detail';     // Detailed view
