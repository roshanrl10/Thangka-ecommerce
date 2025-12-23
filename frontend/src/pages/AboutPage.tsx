import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Brush, Award, Globe, Heart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 md:py-32 bg-gradient-hero overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Preserving Sacred Art
            <br />
            <span className="text-primary">Connecting Cultures</span>
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            ThangkaArt is dedicated to preserving the ancient tradition of Himalayan 
            Buddhist painting while supporting master artists and connecting their 
            sacred work with collectors worldwide.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary rounded-full text-sm font-ui mb-6">
                Our Mission
              </span>
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
                Bridging Tradition and the Modern World
              </h2>
              <div className="space-y-4 font-body text-muted-foreground">
                <p>
                  For centuries, Thangka paintings have served as meditation tools, teaching 
                  devices, and sacred objects in Tibetan Buddhism. Created through rigorous 
                  training and deep spiritual practice, each painting is a manifestation of 
                  devotion.
                </p>
                <p>
                  We founded ThangkaArt to ensure this sacred tradition continues to thrive. 
                  By connecting master artists directly with collectors who appreciate 
                  authentic spiritual art, we provide sustainable income for artists and 
                  their communities.
                </p>
                <p>
                  Every purchase supports not just an artist, but an entire lineage of 
                  knowledge passed down through generations.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800"
                alt="Thangka Art Process"
                className="rounded-2xl shadow-elevated"
              />
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-lg shadow-card border border-border">
                <p className="font-display text-3xl text-secondary mb-1">25+</p>
                <p className="font-ui text-sm text-muted-foreground">Verified Artists</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Our Core Values
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Authenticity',
                description: 'Every artwork is verified for authenticity. We personally vet each artist and ensure traditional techniques are used.',
              },
              {
                icon: Heart,
                title: 'Respect for Tradition',
                description: 'We honor the sacred nature of Thangka art. These are not mere decorations but spiritual tools created with intention.',
              },
              {
                icon: Users,
                title: 'Artist Empowerment',
                description: 'Artists receive fair compensation and maintain creative control. We believe in sustainable support for traditional craftspeople.',
              },
            ].map((value, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-3">{value.title}</h3>
                <p className="font-body text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              How ThangkaArt Works
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Artist Verification',
                description: 'Artists apply with their credentials, training lineage, and sample works. Our team verifies their authenticity.',
              },
              {
                step: '02',
                title: 'Artwork Listing',
                description: 'Verified artists upload their Thangkas with detailed information about materials, meaning, and creation process.',
              },
              {
                step: '03',
                title: 'Secure Purchase',
                description: 'Collectors browse, learn about each piece, and purchase with confidence knowing every detail is verified.',
              },
              {
                step: '04',
                title: 'Safe Delivery',
                description: 'Artwork is carefully packaged and shipped worldwide with insurance and tracking.',
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <span className="font-display text-5xl text-secondary/20">{item.step}</span>
                <h3 className="font-display text-lg text-foreground mt-4 mb-2">{item.title}</h3>
                <p className="font-body text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Thangkas Sold' },
              { value: '25+', label: 'Master Artists' },
              { value: '40+', label: 'Countries Reached' },
              { value: '98%', label: 'Customer Satisfaction' },
            ].map((stat, index) => (
              <div key={index}>
                <p className="font-display text-4xl md:text-5xl text-secondary mb-2">{stat.value}</p>
                <p className="font-ui text-sm text-primary-foreground/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
              Start Your Sacred Collection
            </h2>
            <p className="font-body text-muted-foreground mb-8">
              Whether you're a seasoned collector or discovering Thangka art for the first 
              time, we're here to help you find pieces that resonate with your spiritual journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gold" size="xl" asChild>
                <Link to="/shop">
                  Explore Collection
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button variant="sacred" size="xl" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
