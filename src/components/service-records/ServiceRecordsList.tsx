
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceRecord } from "@/lib/types";
import { getServiceRecords } from "@/lib/storage";
import { PlusCircle, Search, Wrench, Calendar, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const ServiceRecordsList = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    loadServiceRecords();
  }, []);
  
  useEffect(() => {
    if (searchTerm) {
      const filtered = records.filter(record =>
        record.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords(records);
    }
  }, [searchTerm, records]);
  
  const loadServiceRecords = async () => {
    setLoading(true);
    try {
      const data = await getServiceRecords();
      setRecords(data);
      setFilteredRecords(data);
    } catch (error) {
      console.error('Error loading service records:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateNew = () => {
    navigate('/service-records/new');
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Registros de Serviços</h1>
        
        <Button onClick={handleCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Registro
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar por título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <p className="text-muted-foreground">Carregando registros...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-10 border rounded-lg bg-muted/20">
          <Wrench className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-medium">Nenhum registro encontrado</h2>
          <p className="mt-1 text-muted-foreground">
            {searchTerm 
              ? "Tente modificar sua pesquisa ou criar um novo registro" 
              : "Comece criando seu primeiro registro de serviço"}
          </p>
          <Button onClick={handleCreateNew} className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Registro
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRecords.map((record) => (
            <Card key={record.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <Button
                  variant="ghost"
                  className="w-full p-4 h-auto justify-start rounded-none text-left"
                  onClick={() => navigate(`/service-records/${record.id}`)}
                >
                  <div className="flex justify-between items-center w-full">
                    <div className="space-y-1">
                      <h3 className="font-medium text-base">{record.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        {formatDate(record.created_at)}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
