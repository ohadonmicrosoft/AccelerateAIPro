import { motion } from "framer-motion";
import { Shell } from "@/components/layout/shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const workflows = [
  {
    id: 1,
    name: "Content Approval",
    description: "Review and approve content before publishing",
    status: "Active",
  },
  {
    id: 2,
    name: "User Onboarding",
    description: "Guide new users through the platform",
    status: "Completed",
  },
  {
    id: 3,
    name: "Data Processing",
    description: "Process and analyze incoming data",
    status: "Pending",
  },
];

export default function Workflows() {
  return (
    <Shell>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Workflows</h1>
            <p className="text-muted-foreground">
              Manage and monitor your automated processes
            </p>
          </div>
          <Button size="lg" className="gap-2 shadow-sm transition-all duration-200 hover:shadow">
            <Plus className="h-5 w-5" />
            New Workflow
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow, i) => (
            <motion.div
              key={workflow.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group transition-all duration-200 hover:shadow-card-hover hover:border-primary/20">
                <CardHeader>
                  <div className="flex justify-between items-start space-y-0">
                    <CardTitle className="text-xl font-semibold leading-tight">
                      {workflow.name}
                    </CardTitle>
                    <Badge
                      variant={
                        workflow.status === "Active"
                          ? "default"
                          : workflow.status === "Completed"
                          ? "secondary"
                          : "outline"
                      }
                      className="transition-colors"
                    >
                      {workflow.status}
                    </Badge>
                  </div>
                  <CardDescription className="mt-2.5 line-clamp-2">
                    {workflow.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="transition-all duration-200 hover:border-primary/50 hover:bg-primary/5"
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="transition-all duration-200 hover:border-primary/50 hover:bg-primary/5"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Shell>
  );
}