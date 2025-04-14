
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDailyEarnings, getWeeklyEarnings, getMonthlyEarnings, getDailyAverage, getCompletedServices } from "@/lib/storage";
import { Download } from "lucide-react";
import { CompletedService } from "@/lib/types";

const EarningsReport = () => {
  const [dailyEarnings, setDailyEarnings] = useState(0);
  const [weeklyEarnings, setWeeklyEarnings] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [dailyAverage, setDailyAverage] = useState(0);

  useEffect(() => {
    // Update earnings data
    setDailyEarnings(getDailyEarnings());
    setWeeklyEarnings(getWeeklyEarnings());
    setMonthlyEarnings(getMonthlyEarnings());
    setDailyAverage(getDailyAverage());
  }, []);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const exportToExcel = () => {
    const completedServices = getCompletedServices();
    
    if (completedServices.length === 0) {
      alert("Não há dados para exportar.");
      return;
    }
    
    // Generate CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    csvContent += "ID,Data de Conclusão,Mecânico,Serviços,Valor Total,Valor Recebido,Valor Restante\n";
    
    // Add rows
    completedServices.forEach((service) => {
      const row = [
        service.id,
        new Date(service.completionDate).toLocaleDateString('pt-BR'),
        service.mechanicId, // In a real app, we'd look up the mechanic name
        service.serviceIds.join(';'), // In a real app, we'd look up the service names
        service.totalAmount,
        service.receivedAmount,
        service.totalAmount - service.receivedAmount,
      ];
      
      csvContent += row.join(",") + "\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_servicos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    // Download the CSV file
    link.click();
    
    // Clean up
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Relatório de Ganhos</h2>
        <Button onClick={exportToExcel} className="flex items-center gap-2">
          <Download size={16} />
          <span>Exportar</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Ganhos Diários</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(dailyEarnings)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Ganhos Semanais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(weeklyEarnings)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Ganhos Mensais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(monthlyEarnings)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Média Diária</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(dailyAverage)}</p>
          </CardContent>
        </Card>
      </div>
      
      <CompletedServicesList />
    </div>
  );
};

const CompletedServicesList = () => {
  const [completedServices, setCompletedServices] = useState<CompletedService[]>([]);
  
  useEffect(() => {
    setCompletedServices(getCompletedServices().sort((a, b) => 
      new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime()
    ));
  }, []);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (completedServices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Serviços</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            Nenhum serviço concluído registrado.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Serviços</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-2 text-left">Data</th>
                <th className="pb-2 text-left">Total</th>
                <th className="pb-2 text-left">Recebido</th>
                <th className="pb-2 text-left">Restante</th>
              </tr>
            </thead>
            <tbody>
              {completedServices.map((service) => (
                <tr key={service.id} className="border-b">
                  <td className="py-3">{formatDate(service.completionDate)}</td>
                  <td className="py-3">{formatCurrency(service.totalAmount)}</td>
                  <td className="py-3">{formatCurrency(service.receivedAmount)}</td>
                  <td className="py-3">{formatCurrency(service.totalAmount - service.receivedAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EarningsReport;
