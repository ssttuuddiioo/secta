import { Navigation } from '@/components/Navigation'
import { SocialIcons } from '@/components/SocialIcons'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <SocialIcons />
      <div className="pt-32 pb-20 px-6 md:px-12" style={{ paddingTop: '200px' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-light text-white uppercase tracking-tight leading-tight mb-6"
              style={{
                fontFamily: 'var(--font-cormorant-infant)',
                fontWeight: 300,
              }}
            >
              Ignacio Linares
            </h1>
            <p
              className="text-white/80 text-lg md:text-xl leading-relaxed max-w-3xl"
              style={{
                fontFamily: 'var(--font-host-grotesk)',
              }}
            >
              I am a SoCal/NYC based creative director with a 10+ year trajectory crafting experiential activations and visual content for social media.
            </p>
          </div>

          {/* Bio */}
          <div className="mb-20 max-w-4xl">
            <p
              className="text-white text-base md:text-lg leading-relaxed mb-6"
              style={{
                fontFamily: 'var(--font-host-grotesk)',
              }}
            >
              From award-winning immersive experiences to meticulously crafted social media content for the world's largest retailer, I have worked on B2C and B2B initiatives across diverse industries including retail, entertainment, consumer goods, food, spirits, fashion, sports, corporate, real estate, tech, health, and hospitality.
            </p>
            <p
              className="text-white text-base md:text-lg leading-relaxed"
              style={{
                fontFamily: 'var(--font-host-grotesk)',
              }}
            >
              When leading teams I focus on providing clear direction and fostering strong relationships and take deep interest in their mentorship, striving to provide the support needed to ensure they can produce their best work.
            </p>
          </div>

          {/* Skills */}
          <div className="mb-20">
            <h2
              className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight mb-8"
              style={{
                fontFamily: 'var(--font-host-grotesk)',
              }}
            >
              Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
              <div>
                <p
                  className="text-white text-base md:text-lg leading-relaxed mb-4"
                  style={{
                    fontFamily: 'var(--font-host-grotesk)',
                  }}
                >
                  <strong>Fully Bilingual.</strong> Fluent in English & Spanish.
                </p>
                <p
                  className="text-white text-base md:text-lg leading-relaxed"
                  style={{
                    fontFamily: 'var(--font-host-grotesk)',
                  }}
                >
                  <strong>Multidisciplinary creative skills:</strong> Brainstorming, moodboard-ing, scripting, storyboarding, video capture, video editing, video production, set styling, photography, retouching and compositing, layout design, illustration. Adobe Creative Suite, Final Cut Pro X, Basic Figma.
                </p>
              </div>
              <div>
                <p
                  className="text-white text-base md:text-lg leading-relaxed mb-4"
                  style={{
                    fontFamily: 'var(--font-host-grotesk)',
                  }}
                >
                  <strong>Fluent in both long & short-form, platform specific, social media best practices</strong> (Facebook, Instagram, TikTok, Youtube & Pinterest).
                </p>
                <p
                  className="text-white text-base md:text-lg leading-relaxed mb-4"
                  style={{
                    fontFamily: 'var(--font-host-grotesk)',
                  }}
                >
                  <strong>Experience using project management tools</strong> like Workfront and Monday.
                </p>
                <p
                  className="text-white text-base md:text-lg leading-relaxed"
                  style={{
                    fontFamily: 'var(--font-host-grotesk)',
                  }}
                >
                  <strong>Proficient in a wide range of cameras</strong> (Sony a7 and FX series, Sony EX3, Canon 5D/7D, C100/C300, Blackmagic) and lighting systems (Quantum, Profoto, Broncolor, Dynalite, Lowel, Arri, Kino, Joker, Litepanels, Mole Richardson). Completely versed with set dynamics and protocols.
                </p>
              </div>
            </div>
            <div className="mt-8 max-w-5xl">
              <p
                className="text-white text-base md:text-lg leading-relaxed"
                style={{
                  fontFamily: 'var(--font-host-grotesk)',
                }}
              >
                As a creative working with major clients, I have knowledge of account management including client servicing and internal team building. Flexible, resourceful, creative, critical thinker, fast learner. Can-do attitude.
              </p>
            </div>
          </div>

          {/* Clients */}
          <div className="mb-20">
            <h2
              className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight mb-8"
              style={{
                fontFamily: 'var(--font-host-grotesk)',
              }}
            >
              Clients
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                'HBO (Game Of Thrones, Westworld, HBO brand)',
                'Netflix (The Irishman, Klaus, The Outlaw King)',
                'Paramount',
                'Youtube',
                'Nickelodeon',
                'SyFy',
                'David Bowie Estate',
                'Global Citizen',
                'Lenovo',
                'Figma',
                'Fortnight',
                'Verizon',
                'Google',
                'Facebook',
                'eBay',
                'Bumble',
                'Mavity',
                'Amazon',
                'Walmart',
                'UberEats',
                'GrubHub',
                'Cook Unity',
                'Chipotle',
                'Unilever',
                'Lightlife',
                'Chivas Regal',
                'Jameson',
                'The Glenlivet',
                'Avion Tequila',
                'Martell',
                'Office Depot',
                'Audi',
                'Ford',
                'John Deere',
                'American Express',
                'Klarna',
                'MassMutual',
                'HarborOne Bank',
                '23andMe',
                'Astra Zeneca',
                'Bayer',
                'Nestle Health Science',
                'Symrise',
                'Fotografiska',
                'LifeHouse Hotels',
                'Famous Footwear',
                'Under Armour',
                'Adidas',
                'PGA Tour',
                'Super Bowl Host Committee NY/NJ',
                'BallUp',
                'FANIA',
                'Bespoke Post',
                'Stitch Fix',
                'Nectar Mattress',
                'FUR',
                'Bloomberg Philanthropies',
                'CleanPathNY',
                '4H',
                'Adfellows',
                'Barry University',
                'Coursera',
                'Amtrak',
              ].map((client, index) => (
                <div
                  key={index}
                  className="text-white/80 text-sm md:text-base border-b border-white/10 pb-2"
                  style={{
                    fontFamily: 'var(--font-host-grotesk)',
                  }}
                >
                  {client}
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="mb-20">
            <h2
              className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight mb-12"
              style={{
                fontFamily: 'var(--font-host-grotesk)',
              }}
            >
              Experience
            </h2>
            <div className="space-y-12 max-w-4xl">
              <div className="border-l-2 border-white/20 pl-6 md:pl-8">
                <div className="mb-2">
                  <h3
                    className="text-xl md:text-2xl font-bold text-white uppercase mb-1"
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                    }}
                  >
                    SECTA
                  </h3>
                  <p
                    className="text-white/80 text-base md:text-lg mb-2"
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                    }}
                  >
                    Creative Lead / Experiential & Social Storytelling
                  </p>
                  <p
                    className="text-white/60 text-sm md:text-base"
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                    }}
                  >
                    June 2019 - Present
                  </p>
                </div>
              </div>

              <div className="border-l-2 border-white/20 pl-6 md:pl-8">
                <div className="mb-2">
                  <h3
                    className="text-xl md:text-2xl font-bold text-white uppercase mb-1"
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                    }}
                  >
                    WALMART
                  </h3>
                  <p
                    className="text-white/80 text-base md:text-lg mb-2"
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                    }}
                  >
                    Senior Art Director / Brand Experiences, Social Media & Copywriting
                  </p>
                  <p
                    className="text-white/60 text-sm md:text-base"
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                    }}
                  >
                    January 2022 - December 2023
                  </p>
                </div>
              </div>

              <div className="border-l-2 border-white/20 pl-6 md:pl-8">
                <div className="mb-2">
                  <h3
                    className="text-xl md:text-2xl font-bold text-white uppercase mb-1"
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                    }}
                  >
                    GIANT SPOON
                  </h3>
                  <p
                    className="text-white/80 text-base md:text-lg mb-2"
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                    }}
                  >
                    Senior Art Director / Experiential & Content (Contract)
                  </p>
                  <p
                    className="text-white/60 text-sm md:text-base"
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                    }}
                  >
                    Dec 2018 - June 2019; Dec 2017 - June 2018
                  </p>
                </div>
              </div>

              <div className="border-l-2 border-white/20 pl-6 md:pl-8">
                <div className="mb-2">
                  <h3
                    className="text-xl md:text-2xl font-bold text-white uppercase mb-1"
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                    }}
                  >
                    DÉBRAIN
                  </h3>
                  <p
                    className="text-white/80 text-base md:text-lg mb-2"
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                    }}
                  >
                    Senior Art Director / Content Producer & Editor
                  </p>
                  <p
                    className="text-white/60 text-sm md:text-base"
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                    }}
                  >
                    2015 - 2017
                  </p>
                </div>
              </div>

              <div className="border-l-2 border-white/20 pl-6 md:pl-8">
                <div className="mb-2">
                  <h3
                    className="text-xl md:text-2xl font-bold text-white uppercase mb-1"
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                    }}
                  >
                    LEADDOG MARKETING GROUP
                  </h3>
                  <p
                    className="text-white/80 text-sm md:text-base mb-2"
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                    }}
                  >
                    (now CSM NORTH AMERICA)
                  </p>
                  <p
                    className="text-white/80 text-base md:text-lg mb-2"
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                    }}
                  >
                    Art Director - Photography and Video
                  </p>
                  <p
                    className="text-white/60 text-sm md:text-base"
                    style={{
                      fontFamily: 'var(--font-host-grotesk)',
                    }}
                  >
                    2011 - 2015
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
