import { motion, AnimatePresence } from "framer-motion";
import { Shell } from "@/components/layout/shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowUp } from "lucide-react";
import {
  GitBranch,
  FileText,
  MessageSquare,
  BarChart2,
  HelpCircle,
  Book,
  Settings,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
}

const features: FeatureCard[] = [
  {
    title: "Workflows",
    description: "Manage and monitor your automated workflows",
    icon: GitBranch,
    href: "/workflows",
    color: "text-blue-500",
  },
  {
    title: "Reports",
    description: "View detailed analytics and generate reports",
    icon: BarChart2,
    href: "/reports",
    color: "text-purple-500",
  },
  {
    title: "Chat",
    description: "Communicate with team members in real-time",
    icon: MessageSquare,
    href: "/chat",
    color: "text-green-500",
  },
  {
    title: "Documentation",
    description: "Access comprehensive guides and documentation",
    icon: Book,
    href: "/docs",
    color: "text-amber-500",
  },
  {
    title: "Team",
    description: "Manage team members and permissions",
    icon: Users,
    href: "/team",
    color: "text-red-500",
  },
  {
    title: "Help Center",
    description: "Get help and support when you need it",
    icon: HelpCircle,
    href: "/help",
    color: "text-teal-500",
  },
];

export default function Dashboard() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Shell>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 pb-8"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Your Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Access all your tools and resources from one central location
          </p>
        </div>

        {/* Feature Cards Grid */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={feature.href}>
                  <a className="block h-full">
                    <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">
                          {feature.title}
                        </CardTitle>
                        <feature.icon className={`h-5 w-5 ml-auto ${feature.color}`} />
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </a>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Button variant="ghost" className="text-sm">
              View All
            </Button>
          </div>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground text-sm">
                Your recent activities will appear here
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Scroll to top button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-4 right-4 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all z-50"
            >
              <ArrowUp className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </Shell>
  );
}