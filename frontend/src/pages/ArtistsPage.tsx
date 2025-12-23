import { Link } from 'react-router-dom';
import { ArtistCard } from '@/components/artist/ArtistCard';
import { Button } from '@/components/ui/button';
import { artists } from '@/data/mockData';
import { ArrowRight, Users } from 'lucide-react';

export default function ArtistsPage() {
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
