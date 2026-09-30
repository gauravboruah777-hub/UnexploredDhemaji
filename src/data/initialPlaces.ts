import { Place } from '../types/place';

export const INITIAL_PLACES: Place[] = [
  {
    id: 'place_gerukamukh',
    placeName: 'Gerukamukh (Subansiri Gorge)',
    description:
      'A breathtaking scenic destination where the majestic Subansiri River cuts through the lush Himalayan foothills before spreading across the plains of Dhemaji. Famous for angling, river canoeing, dense evergreen canopies, and serene sunset vistas over the emerald river waters.',
    category: 'Nature',
    images: [
      'https://lh3.googleusercontent.com/aida/AEtjO1Xe3YyPyCV7_ROxLhtESRxmNV9i8fdsFQmo2AtH_jLaIDbCP-S2fz6iAO_Sv84FSz7XMHMZJIQWjriqERRzUc_bVlzode8Pg4cDjJQ3cxSCM6ChmciJbVPG4vofxZIlU5NpH0m1tJEkqaAXke1EppVIheF4vbj6lAzGPZYVOhcT7EuX_TpX0MoW3McQ8pF4pHd4O995FjNEYzoCW15K_4GMvd_YRTLa0QcQ0nL5rdBlbclv90DZ-C3yVxA',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80'
    ],
    coverImage:
      'https://lh3.googleusercontent.com/aida/AEtjO1Xe3YyPyCV7_ROxLhtESRxmNV9i8fdsFQmo2AtH_jLaIDbCP-S2fz6iAO_Sv84FSz7XMHMZJIQWjriqERRzUc_bVlzode8Pg4cDjJQ3cxSCM6ChmciJbVPG4vofxZIlU5NpH0m1tJEkqaAXke1EppVIheF4vbj6lAzGPZYVOhcT7EuX_TpX0MoW3McQ8pF4pHd4O995FjNEYzoCW15K_4GMvd_YRTLa0QcQ0nL5rdBlbclv90DZ-C3yVxA',
    latitude: 27.5621,
    longitude: 94.2713,
    address: 'Gerukamukh Foothills, Subansiri Riverbank, Dhemaji District, Assam',
    bestTimeToVisit: 'October – April',
    thingsToDo: ['Photography', 'River Boating', 'Nature Walk', 'Angling', 'Bird Watching'],
    contributorId: 'official',
    contributorName: 'Dhemaji District Tourism Council',
    contributorEmail: 'tourism@dhemaji.gov.in',
    createdAt: '2025-01-15T10:00:00.000Z',
    status: 'approved'
  },
  {
    id: 'place_malinithan',
    placeName: 'Malinithan Ruins & Sanctuary',
    description:
      'An ancient archaeological gem nestled on the northeastern frontier of Dhemaji near Jonai. Dating back to the 10th-14th centuries, the site features remarkably preserved granite bas-reliefs, stone sculptures of divine figures, and sacred sanctums surrounded by sal forest groves.',
    category: 'Heritage',
    images: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=1200&q=80'
    ],
    coverImage:
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    latitude: 27.7942,
    longitude: 94.7125,
    address: 'Near Jonai Sub-division, Dhemaji Border, Assam',
    bestTimeToVisit: 'November – March',
    thingsToDo: ['Heritage Exploration', 'Archaeological Tour', 'Photography', 'Pilgrimage'],
    contributorId: 'official',
    contributorName: 'Dhemaji District Tourism Council',
    contributorEmail: 'tourism@dhemaji.gov.in',
    createdAt: '2025-01-16T11:00:00.000Z',
    status: 'approved'
  },
  {
    id: 'place_ghuguha_dol',
    placeName: 'Ghuguha Dol (Historic Ahom Shrine)',
    description:
      'A historic 17th-century brick shrine commissioned during the Ahom kingdom in honor of Queen Ambika. Located in the serene rural hinterland of Dhemaji, it stands as a testament to the distinct medieval Assamese architectural traditions with massive water tanks (pukhuri) nearby.',
    category: 'Religious',
    images: [
      'https://images.unsplash.com/photo-1590059390046-60914041e17e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80'
    ],
    coverImage:
      'https://images.unsplash.com/photo-1590059390046-60914041e17e?auto=format&fit=crop&w=1200&q=80',
    latitude: 27.4215,
    longitude: 94.5108,
    address: 'Ghuguha Village, Dhemaji Sadar, Assam',
    bestTimeToVisit: 'October – April',
    thingsToDo: ['Historic Sightseeing', 'Cultural Study', 'Peace & Meditation', 'Photography'],
    contributorId: 'official',
    contributorName: 'Dhemaji District Tourism Council',
    contributorEmail: 'tourism@dhemaji.gov.in',
    createdAt: '2025-01-18T09:30:00.000Z',
    status: 'approved'
  },
  {
    id: 'place_simen_chapori',
    placeName: 'Simen Chapori Wetland & Sandbanks',
    description:
      'An expansive ecological wonderland where the Brahmaputra braided floodplains harbor hundreds of resident and wintering migratory bird species. The nearby Mishing stilt hamlets (Chang Ghar) showcase indigenous silk weaving, apong preparation, and authentic sustainable living.',
    category: 'River & Wetland',
    images: [
      'https://lh3.googleusercontent.com/aida/AEtjO1Ukrh3UMtbY9OATEYT7K1RS3kMy0zazlhy1cjBAS-S8uJemtLmgl9iLPMp9U3AmP_AcG5X1HpgW-SgefjPb4kvfED6YQ1y7YBzF5rO0k_rm089zlgc6EVr528Q05UopM0bEebgpyhg23LoIJk4xE6cHKEJQP5BK9umxOoDv7LDja2-NY31jODGK-Ywto3lrKa1OJ79asASh3oJAyd-Y1DBnEaKRzE4rrbgXulvYKvHrhrzcfzjKJTaKi3M',
      'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=1200&q=80'
    ],
    coverImage:
      'https://lh3.googleusercontent.com/aida/AEtjO1Ukrh3UMtbY9OATEYT7K1RS3kMy0zazlhy1cjBAS-S8uJemtLmgl9iLPMp9U3AmP_AcG5X1HpgW-SgefjPb4kvfED6YQ1y7YBzF5rO0k_rm089zlgc6EVr528Q05UopM0bEebgpyhg23LoIJk4xE6cHKEJQP5BK9umxOoDv7LDja2-NY31jODGK-Ywto3lrKa1OJ79asASh3oJAyd-Y1DBnEaKRzE4rrbgXulvYKvHrhrzcfzjKJTaKi3M',
    latitude: 27.674,
    longitude: 95.021,
    address: 'Simen Chapori Riverfront, Jonai Sub-division, Dhemaji, Assam',
    bestTimeToVisit: 'November – February',
    thingsToDo: ['Bird Watching', 'Cultural Immersion', 'Canoeing', 'Sunset Photography', 'Homestay Experience'],
    contributorId: 'official',
    contributorName: 'Dhemaji District Tourism Council',
    contributorEmail: 'tourism@dhemaji.gov.in',
    createdAt: '2025-01-20T14:15:00.000Z',
    status: 'approved'
  },
  {
    id: 'place_maa_manipuri_than',
    placeName: 'Maa Manipuri Than',
    description:
      'A deeply revered historical shrine established by Ahom King Gaurinath Singha in 1780 AD. Nestled amidst ancient banyan trees, the sanctum commemorates historical solidarity between Assam and Manipur, attracting pilgrims and folklore scholars throughout the year.',
    category: 'Cultural',
    images: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
    ],
    coverImage:
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    latitude: 27.441,
    longitude: 94.612,
    address: 'Manipuri Village Road, Dhemaji, Assam',
    bestTimeToVisit: 'Year-Round (Best Oct–Mar)',
    thingsToDo: ['Spiritual Darshan', 'Heritage Walk', 'Folklore Exploration', 'Photography'],
    contributorId: 'official',
    contributorName: 'Dhemaji District Tourism Council',
    contributorEmail: 'tourism@dhemaji.gov.in',
    createdAt: '2025-01-22T08:00:00.000Z',
    status: 'approved'
  },
  {
    id: 'place_jiadhal_sandbanks',
    placeName: 'Jiadhal River Valley & Sandbars',
    description:
      'Known locally as the "Sorrow and Joy of Dhemaji", the Jiadhal River originates from the eastern Himalayas and features breathtaking wide pebble beds, sandbar islands, and crystal-clear winter waters perfect for eco-camping and landscape photography.',
    category: 'Photography',
    images: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ],
    coverImage:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    latitude: 27.5102,
    longitude: 94.492,
    address: 'Jiadhal Riverside, Bordoloni Block, Dhemaji, Assam',
    bestTimeToVisit: 'November – March',
    thingsToDo: ['Landscape Photography', 'River Camping', 'Stargazing', 'Picnicking'],
    contributorId: 'official',
    contributorName: 'Dhemaji District Tourism Council',
    contributorEmail: 'tourism@dhemaji.gov.in',
    createdAt: '2025-01-25T16:00:00.000Z',
    status: 'approved'
  }
];
