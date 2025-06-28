
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ModelSearchInputProps {
  onSearchChange: (searchTerm: string) => void;
  placeholder?: string;
}

export const ModelSearchInput = ({ 
  onSearchChange, 
  placeholder = "Buscar por modelo ou marca..." 
}: ModelSearchInputProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
  };

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="pl-10 pr-4"
      />
    </div>
  );
};
