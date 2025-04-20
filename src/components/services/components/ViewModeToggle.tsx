
import { ViewMode } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List as ListIcon } from "lucide-react";

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const ViewModeToggle = ({ viewMode, onViewModeChange }: ViewModeToggleProps) => {
  return (
    <div className="flex border rounded-lg overflow-hidden mr-2">
      <Button 
        variant={viewMode === 'list' ? 'default' : 'ghost'} 
        size="sm"
        onClick={() => onViewModeChange('list')} 
        className="rounded-r-none"
      >
        <ListIcon size={18} />
      </Button>
      <Button 
        variant={viewMode === 'grid' ? 'default' : 'ghost'} 
        size="sm"
        onClick={() => onViewModeChange('grid')} 
        className="rounded-l-none"
      >
        <LayoutGrid size={18} />
      </Button>
    </div>
  );
};
