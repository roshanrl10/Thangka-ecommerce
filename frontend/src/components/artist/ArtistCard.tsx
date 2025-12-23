import { Link } from 'react-router-dom';
import { BadgeCheck, Star, Palette } from 'lucide-react';
import { Artist } from '@/types';
import { cn } from '@/lib/utils';

interface ArtistCardProps {
  artist: Artist;
  className?: string;
  style?: React.CSSProperties;
}

export function ArtistCard({ artist, className, style }: ArtistCardProps) {
  return (
    <Link
      to={`/artist/${artist.id}`}
      style={style}
      className={cn(
        "group block bg-card rounded-lg overflow-hidden thangka-card border border-border/50",
        className
      )}
    >
      {/* Banner */}
      <div className="relative h-24 overflow-hidden">
        <img
          src={artist.bannerImage || artist.profileImage}
          alt=""
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
      </div>

      {/* Profile Image */}
      <div className="relative px-4 -mt-10">
        <div className="w-20 h-20 rounded-full border-4 border-card overflow-hidden shadow-card">
          <img
            src={artist.profileImage}
            alt={artist.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-2">
        {/* Name & Verification */}
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">
            {artist.name}
          </h3>
          {artist.isVerified && (
            <BadgeCheck className="h-5 w-5 text-secondary flex-shrink-0" />
          )}
        </div>

        {/* Location */}
        <p className="text-sm font-ui text-muted-foreground mb-3">
          {artist.location}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Palette className="h-4 w-4 text-secondary" />
            <span className="font-ui text-muted-foreground">{artist.totalArtworks}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-secondary text-secondary" />
            <span className="font-ui text-muted-foreground">{artist.rating}</span>
          </div>
        </div>

        {/* Experience */}
        <div className="mt-3 pt-3 border-t border-border">
          <span className="text-xs font-ui text-muted-foreground">
            {artist.yearsOfExperience} years of experience
          </span>
          {artist.artLineage && (
            <p className="text-xs font-ui text-secondary mt-1">
              {artist.artLineage}
            </p>
          )}
        </div>

        {/* Thangka Types */}
        <div className="flex flex-wrap gap-1 mt-3">
          {artist.thangkaTypes.slice(0, 3).map((type) => (
            <span
              key={type}
              className="px-2 py-0.5 bg-muted text-xs font-ui text-muted-foreground rounded"
            >
              {type}
            </span>
          ))}
          {artist.thangkaTypes.length > 3 && (
            <span className="px-2 py-0.5 text-xs font-ui text-muted-foreground">
              +{artist.thangkaTypes.length - 3}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
