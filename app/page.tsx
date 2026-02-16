import Link from 'next/link';
import { ArrowRight, Box, CalendarCheck, ClipboardList, Wrench, Shield, Zap } from 'lucide-react';
import { Button } from '@/app/ui/button';

import { auth } from '@/auth';

export default async function Home() {
  const session = await auth();
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                <Box className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">ResourceSys</span>
            </div>
            {session?.user ? (
              <Link href="/overview">
                <Button variant="default" className="rounded-full px-6 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button variant="default" className="rounded-full px-6 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-[50%] top-0 h-[1000px] w-[1000px] -translate-x-[50%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Zap className="mr-2 h-4 w-4 text-primary" />
              <span>Streamline your operations today</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-foreground mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
              Manage Resources with <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-500">Unmatched Precision</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground mb-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
              The all-in-one platform for resource booking, approval workflows, and maintenance tracking. Built for modern teams that demand efficiency.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
              {session?.user ? (
                <Link href="/overview">
                  <Button size="lg" className="rounded-full px-8 text-lg font-semibold shadow-xl shadow-primary/25 h-14 hover:scale-105 transition-transform group">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/login">
                  <Button size="lg" className="rounded-full px-8 text-lg font-semibold shadow-xl shadow-primary/25 h-14 hover:scale-105 transition-transform group">
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="lg" className="rounded-full px-8 text-lg font-semibold h-14 bg-background/50 backdrop-blur-sm">
                View Features
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-muted/30 border-y border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Everything you need to handle assets</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Our comprehensive toolset ensures you spend less time managing and more time doing.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Seamless Booking',
                  description: 'Schedule conference rooms, equipment, and shared workspaces with a few clicks.',
                  icon: CalendarCheck,
                  color: 'text-blue-500',
                  bg: 'bg-blue-500/10'
                },
                {
                  title: 'Smart Approvals',
                  description: 'Automated workflow for managers to review and approve resource requests instantly.',
                  icon: ClipboardList,
                  color: 'text-purple-500',
                  bg: 'bg-purple-500/10'
                },
                {
                  title: 'Proactive Maintenance',
                  description: 'Track asset health and schedule repairs before points of failure occur.',
                  icon: Wrench,
                  color: 'text-orange-500',
                  bg: 'bg-orange-500/10'
                },
                {
                  title: 'Admin Control',
                  description: 'Manage users, roles, and granular permissions across the entire organization.',
                  icon: Shield,
                  color: 'text-green-500',
                  bg: 'bg-green-500/10'
                },
                {
                  title: 'Insightful Reports',
                  description: 'Visualize resource utilization and booking trends with built-in analytics.',
                  icon: Box,
                  color: 'text-rose-500',
                  bg: 'bg-rose-500/10'
                },
                {
                  title: 'Secure Access',
                  description: 'Enterprise-grade authentication and data encryption for your peace of mind.',
                  icon: Zap,
                  color: 'text-yellow-500',
                  bg: 'bg-yellow-500/10'
                }
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-2xl border border-border/50 bg-card hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                  <div className={`h-12 w-12 rounded-lg ${feature.bg} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="rounded-3xl bg-primary p-12 text-primary-foreground shadow-2xl shadow-primary/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 relative z-10">Ready to transform your resource management?</h2>
              <p className="text-primary-foreground/80 mb-10 text-lg relative z-10">Join hundreds of teams using ResourceSys to organize their assets and boost productivity.</p>
              <Link href="/auth/login">
                <Button size="lg" variant="secondary" className="rounded-full px-10 h-14 text-lg font-bold hover:scale-105 transition-transform relative z-10 shadow-lg">
                  Join ResourceSys
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center text-primary-foreground">
              <Box className="h-3 w-3" />
            </div>
            <span className="font-bold">ResourceSys</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} ResourceSys. Optimized for Modern Enterprise.
          </p>
          <div className="mt-4 flex justify-center gap-6 text-sm text-muted-foreground font-medium">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
