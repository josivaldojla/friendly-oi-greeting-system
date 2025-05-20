
import { ServiceHistory } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServiceHistoryList from "./ServiceHistoryList";

interface ServiceTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  children: React.ReactNode;
  onSelectHistory: (history: ServiceHistory) => void;
}

export const ServiceTabs = ({ activeTab, setActiveTab, children, onSelectHistory }: ServiceTabsProps) => {
  return (
    <Tabs defaultValue="services" value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="services">Serviços</TabsTrigger>
        <TabsTrigger value="history">Histórico</TabsTrigger>
      </TabsList>
      
      <TabsContent value="services" className="mt-4">
        {children}
      </TabsContent>
      
      <TabsContent value="history" className="mt-4">
        <ServiceHistoryList onSelect={onSelectHistory} />
      </TabsContent>
    </Tabs>
  );
};
