import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArtistCard } from '@/components/artist/ArtistCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { Artist } from '@/types';

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const { data } = await api.get('/artist');
      // Transform backend data to match Artist interface
      const transformedArtists = data.map((item: any) => ({
        id: item._id,
        name: item.userId?.name || 'Unknown Artist',
        profileImage: item.userId?.avatar || item.profileImage || 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&h=400&fit=crop', // Fallback
        bannerImage: item.bannerImage,
        location: item.location,
        nationality: item.nationality,
        yearsOfExperience: item.yearsOfExperience,
        artLineage: item.artLineage,
        biography: item.biography,
        thangkaTypes: item.thangkaTypes || [],
        isVerified: true,
        totalArtworks: item.totalArtworks || 0,
        totalSales: item.totalSales || 0,
        rating: item.rating || 0,
        joinedAt: item.createdAt
      }));
      setArtists(transformedArtists);
    } catch (error) {
      console.error("Failed to fetch artists", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">
              Our Master Artists
            </h1>
            <p className="font-body text-lg text-muted-foreground mb-6">
              Every artist on our platform has been personally verified for their skill, 
              authenticity, and dedication to preserving traditional Thangka painting. 
              Meet the masters behind the art.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-secondary" />
                <span className="font-ui text-sm text-muted-foreground">
                  {artists.length} Verified Artists
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Artists Grid */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
             <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            </div>
        ) : artists.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
                <p>No verified artists found yet.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist, index) => (
                <ArtistCard
                key={artist.id}
                artist={artist}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` } as React.CSSProperties}
                />
            ))}
            </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-card border-t border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl text-foreground mb-4">
              Are You a Thangka Artist?
            </h2>
            <p className="font-body text-muted-foreground mb-8">
              Join our community of verified master artists. Share your sacred art with 
              collectors worldwide and connect with those who truly appreciate traditional 
              Himalayan craftsmanship.
            </p>
            <Button variant="gold" size="xl" asChild>
              <Link to="/apply-artist">
                Apply as Artist
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
