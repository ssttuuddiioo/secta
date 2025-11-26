import { Navigation } from '@/components/Navigation'
import { SocialIcons } from '@/components/SocialIcons'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <SocialIcons />
      <div className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8">Contact</h1>
          <div className="space-y-6 text-lg md:text-xl leading-relaxed">
            <p>
              Let's work together. Get in touch to discuss your project.
            </p>
            <div className="mt-8 space-y-4">
              <p>
                <strong>Email:</strong> hello@secta.com
              </p>
              <p>
                <strong>Phone:</strong> +1 (555) 123-4567
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}







