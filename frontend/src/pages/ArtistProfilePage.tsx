import { useParams, Link } from 'react-router-dom';
import { BadgeCheck, Star, MapPin, Calendar, Palette, ShoppingBag, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';
import { artists, products } from '@/data/mockData';

export default function ArtistProfilePage() {
  const { id } = useParams();
  const artist = artists.find((a) => a.id === id);
  const artistProducts = products.filter((p) => p.artistId === id);

  if (!artist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">Artist not found</h1>
          <Button variant="gold" asChild>
            <Link to="/artists">View All Artists</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={artist.bannerImage || artist.profileImage}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
      </div>

      {/* Profile Section */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-card rounded-lg border border-border p-6 md:p-8 shadow-card">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0 -mt-24 md:-mt-28">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-card overflow-hidden shadow-elevated">
                <img
                  src={artist.profileImage}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                <h1 className="font-display text-3xl md:text-4xl text-foreground">
                  {artist.name}
                </h1>
                {artist.isVerified && (
                  <span className="verified-badge">
                    <BadgeCheck className="h-4 w-4" />
                    Verified Artist
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm font-ui text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-secondary" />
                  {artist.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-secondary" />
                  Member since {new Date(artist.joinedAt).getFullYear()}
                </span>
              </div>

              {artist.artLineage && (
                <p className="font-ui text-sm text-secondary mb-4">
                  <Award className="h-4 w-4 inline mr-1" />
                  {artist.artLineage}
                </p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="font-display text-2xl text-foreground">{artist.totalArtworks}</p>
                  <p className="font-ui text-xs text-muted-foreground">Artworks</p>
                </div>
                <div>
                  <p className="font-display text-2xl text-foreground">{artist.totalSales}</p>
                  <p className="font-ui text-xs text-muted-foreground">Sales</p>
                </div>
                <div>
                  <p className="font-display text-2xl text-foreground flex items-center gap-1">
                    {artist.rating}
                    <Star className="h-5 w-5 fill-secondary text-secondary" />
                  </p>
                  <p className="font-ui text-xs text-muted-foreground">Rating</p>
                </div>
                <div>
                  <p className="font-display text-2xl text-foreground">{artist.yearsOfExperience}+</p>
                  <p className="font-ui text-xs text-muted-foreground">Years Experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Biography */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="font-display text-xl text-foreground mb-4">Biography</h2>
              <p className="font-body text-muted-foreground leading-relaxed whitespace-pre-line">
                {artist.biography}
              </p>
            </div>

            {/* Specializations */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="font-display text-xl text-foreground mb-4">Specializations</h2>
              <div className="flex flex-wrap gap-2">
                {artist.thangkaTypes.map((type) => (
                  <span
                    key={type}
                    className="px-3 py-1.5 bg-muted text-sm font-ui text-muted-foreground rounded-full"
                  >
                    <Palette className="h-3 w-3 inline mr-1" />
                    {type}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="font-display text-xl text-foreground mb-4">Commission Work</h2>
              <p className="font-body text-sm text-muted-foreground mb-4">
                Interested in a custom Thangka painting? Contact the artist for commission inquiries.
              </p>
              <Button variant="gold" className="w-full">
                Contact Artist
              </Button>
            </div>
          </div>

          {/* Artworks */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl text-foreground">
                Artworks by {artist.name}
              </h2>
              <span className="flex items-center gap-1 font-ui text-sm text-muted-foreground">
                <ShoppingBag className="h-4 w-4" />
                {artistProducts.length} available
              </span>
            </div>

            {artistProducts.length === 0 ? (
              <div className="bg-card rounded-lg border border-border p-12 text-center">
                <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="font-display text-lg text-foreground mb-2">
                  No artworks available yet
                </p>
                <p className="font-ui text-sm text-muted-foreground">
                  Check back soon for new creations from this artist
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {artistProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
