
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { CustomerList } from "@/components/customers/CustomerList";
import { Customer } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "@/lib/storage";
import { PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

const CustomersPage = () => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const { 
    data: customers = [], 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
  });

  const handleNewCustomer = () => {
    setSelectedCustomer(null);
    setShowForm(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedCustomer(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedCustomer(null);
    refetch();
    
    toast({
      title: "Cliente salvo com sucesso!",
      description: "Os dados do cliente foram salvos no sistema."
    });
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-2xl font-bold">Clientes</CardTitle>
            <Button onClick={handleNewCustomer} className="flex items-center gap-1">
              <PlusIcon className="h-4 w-4" /> Novo Cliente
            </Button>
          </CardHeader>
          <CardContent>
            {showForm ? (
              <>
                <CustomerForm 
                  customer={selectedCustomer}
                  onClose={handleFormClose}
                  onSuccess={handleFormSuccess}
                />
                <div className="mt-4">
                  <Button variant="outline" onClick={handleFormClose}>
                    Voltar para Lista
                  </Button>
                </div>
              </>
            ) : (
              <CustomerList 
                customers={customers}
                isLoading={isLoading}
                onEdit={handleEditCustomer}
                onRefresh={refetch}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CustomersPage;
