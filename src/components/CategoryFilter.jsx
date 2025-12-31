import { Gamepad2, Brain, Trophy, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Ensure IDs match your backend exactly
const categories = [
  { id: null, label: 'All Events', icon: LayoutGrid },
  { id: 'E-Games', label: 'E-Games', icon: Gamepad2 },
  { id: 'Geeks', label: 'Geeks', icon: Brain },
  { id: 'General Games', label: 'General Games', icon: Trophy },
];

export function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map((category) => (
        <Button
          key={category.id ?? 'all'}
          // If selected: Solid Cyan. If not: Neon Outline.
          variant={selected === category.id ? 'default' : 'outline'}
          size="lg"
          onClick={() => onSelect(category.id)}
          className={cn(
            "font-body transition-all duration-300",
            // Add specific shadow only when selected
            selected === category.id && "shadow-[0_0_20px_hsl(180_100%_50%_/_0.4)]"
          )}
        >
          {category.icon && <category.icon className="h-4 w-4 mr-2" />}
          {category.label}
        </Button>
      ))}
    </div>
  );
}