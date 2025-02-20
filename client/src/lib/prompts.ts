
import { 
  LayoutIcon,
  SparklesIcon,
  PaletteIcon,
  ZapIcon,
  TerminalIcon,
  ShieldIcon,
  BarChart2Icon,
  CodeIcon,
  BrainIcon,
  WandIcon,
  type LucideIcon
} from "lucide-react"

export interface Prompt {
  id: string
  category: string
  title: string
  description: string
  prompt: string
  icon: LucideIcon
  tags: string[]
}

export interface Category {
  id: string
  label: string
  icon: LucideIcon
}

export const categories: Category[] = [
  {
    id: "ui-ux",
    label: "UI/UX Design",
    icon: LayoutIcon
  },
  {
    id: "development",
    label: "Development",
    icon: CodeIcon
  },
  {
    id: "performance",
    label: "Performance",
    icon: ZapIcon
  },
  {
    id: "security",
    label: "Security",
    icon: ShieldIcon
  },
  {
    id: "integration",
    label: "Integration",
    icon: WandIcon
  }
]

export const enterprisePrompts: Prompt[] = [
  {
    id: "component-design",
    category: "ui-ux",
    title: "Component Design Enhancement",
    description: "Improve component design and accessibility",
    prompt: `Enhance this component's design and implementation:

\`\`\`tsx
{code}
\`\`\`

Focus on:
- Visual hierarchy and consistency
- Animation timing (Primary: 360ms, Secondary: 300ms)
- Responsive behavior and adaptations
- Accessibility features and ARIA attributes`,
    icon: LayoutIcon,
    tags: ["design", "components", "accessibility"]
  },
  {
    id: "animation",
    category: "ui-ux",
    title: "Animation Enhancement",
    description: "Add smooth, performant animations",
    prompt: `Enhance animations for this component:

\`\`\`tsx
{code}
\`\`\`

Following our timing specifications:
- Primary animations: 360ms
- Secondary transitions: 300ms
- Micro-interactions: 200ms
- Easing: cubic-bezier(0.4, 0.0, 0.2, 1)`,
    icon: SparklesIcon,
    tags: ["animation", "motion", "interaction"]
  },
  {
    id: "theme-system",
    category: "ui-ux",
    title: "Theme Integration",
    description: "Improve theme system integration",
    prompt: `Enhance theme implementation for this component:

\`\`\`tsx
{code}
\`\`\`

Consider:
- Dark/light mode transitions
- Color variable usage
- Theme switching mechanics
- CSS custom property implementation`,
    icon: PaletteIcon,
    tags: ["theming", "styling", "customization"]
  },
  {
    id: "performance",
    category: "performance", 
    title: "Performance Optimization",
    description: "Optimize component performance",
    prompt: `Analyze and optimize performance:

\`\`\`tsx
{code}
\`\`\`

Focus on:
- Render optimization strategies
- State management efficiency
- Memory usage patterns
- Bundle size impact`,
    icon: ZapIcon,
    tags: ["performance", "optimization", "rendering"]
  },
  {
    id: "architecture",
    category: "development",
    title: "Architecture Review",
    description: "Improve code organization",
    prompt: `Review architecture and suggest improvements:

\`\`\`tsx
{code}
\`\`\`

Consider:
- Component composition patterns
- State management approaches
- Code reusability
- TypeScript type safety`,
    icon: TerminalIcon,
    tags: ["architecture", "patterns", "typescript"]
  },
  {
    id: "security",
    category: "security",
    title: "Security Review",
    description: "Enhance security measures",
    prompt: `Review security implementation:

\`\`\`tsx
{code}
\`\`\`

Focus on:
- Data validation techniques
- API security best practices
- Authentication methods
- Error handling patterns`,
    icon: ShieldIcon,
    tags: ["security", "validation", "authentication"]
  },
  {
    id: "analytics",
    category: "integration",
    title: "Analytics Integration",
    description: "Add comprehensive tracking",
    prompt: `Implement analytics tracking:

\`\`\`tsx
{code}
\`\`\`

Track:
- User interactions and flows
- Performance metrics
- Error rates and patterns
- Usage statistics`,
    icon: BarChart2Icon,
    tags: ["analytics", "monitoring", "metrics"]
  },
  {
    id: "ai-enhancement",
    category: "integration",
    title: "AI Integration",
    description: "Optimize AI features",
    prompt: `Enhance AI integration for this feature:

\`\`\`tsx
{code}
\`\`\`

Consider:
- Response streaming optimization
- Error handling and fallbacks
- Loading state management
- User feedback mechanisms`,
    icon: BrainIcon,
    tags: ["ai", "openai", "integration"]
  }
]

export const getPromptsByCategory = (categoryId: string): Prompt[] => {
  return enterprisePrompts.filter(prompt => prompt.category === categoryId)
}

export const getPromptById = (promptId: string): Prompt | undefined => {
  return enterprisePrompts.find(prompt => prompt.id === promptId)
}
