export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  size: {
    width: number;
    height: number;
    unit: 'cm' | 'inches';
  };
  material: string;
  paintingDuration: string;
  artistId: string;
  artistName: string;
  isVerifiedArtist: boolean;
  spiritualMeaning?: string;
  inStock: boolean;
  createdAt: string;
  rating: number;
  reviewCount: number;
}

export interface Artist {
  id: string;
  name: string;
  profileImage: string;
  bannerImage?: string;
  location: string;
  nationality: string;
  yearsOfExperience: number;
  artLineage?: string;
  biography: string;
  thangkaTypes: string[];
  isVerified: boolean;
  totalArtworks: number;
  totalSales: number;
  rating: number;
  joinedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'guest' | 'buyer' | 'artist' | 'admin';
  profileImage?: string;
  avatar?: string;
  isVerifiedArtist?: boolean;
  artistApplicationStatus?: 'none' | 'pending' | 'approved' | 'rejected';
}

export interface ArtistApplication {
  id: string;
  userId: string;
  fullName: string;
  nationality: string;
  biography: string;
  yearsOfExperience: number;
  artLineage: string;
  thangkaTypes: string[];
  idProof: string;
  sampleArtworks: string[];
  declaration: boolean;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
