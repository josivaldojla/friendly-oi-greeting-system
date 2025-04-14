
import { Mechanic, Service, CompletedService } from "./types";

const MECHANICS_KEY = 'moto-shop-mechanics';
const SERVICES_KEY = 'moto-shop-services';
const COMPLETED_SERVICES_KEY = 'moto-shop-completed-services';

// Mechanics
export function getMechanics(): Mechanic[] {
  const data = localStorage.getItem(MECHANICS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveMechanics(mechanics: Mechanic[]): void {
  localStorage.setItem(MECHANICS_KEY, JSON.stringify(mechanics));
}

export function addMechanic(mechanic: Mechanic): Mechanic[] {
  const mechanics = getMechanics();
  const newMechanics = [...mechanics, mechanic];
  saveMechanics(newMechanics);
  return newMechanics;
}

export function updateMechanic(updatedMechanic: Mechanic): Mechanic[] {
  const mechanics = getMechanics();
  const newMechanics = mechanics.map(mechanic => 
    mechanic.id === updatedMechanic.id ? updatedMechanic : mechanic
  );
  saveMechanics(newMechanics);
  return newMechanics;
}

export function deleteMechanic(id: string): Mechanic[] {
  const mechanics = getMechanics();
  const newMechanics = mechanics.filter(mechanic => mechanic.id !== id);
  saveMechanics(newMechanics);
  return newMechanics;
}

// Services
export function getServices(): Service[] {
  const data = localStorage.getItem(SERVICES_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveServices(services: Service[]): void {
  localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
}

export function addService(service: Service): Service[] {
  const services = getServices();
  const newServices = [...services, service];
  saveServices(newServices);
  return newServices;
}

export function updateService(updatedService: Service): Service[] {
  const services = getServices();
  const newServices = services.map(service => 
    service.id === updatedService.id ? updatedService : service
  );
  saveServices(newServices);
  return newServices;
}

export function deleteService(id: string): Service[] {
  const services = getServices();
  const newServices = services.filter(service => service.id !== id);
  saveServices(newServices);
  return newServices;
}

// Completed Services
export function getCompletedServices(): CompletedService[] {
  const data = localStorage.getItem(COMPLETED_SERVICES_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveCompletedServices(completedServices: CompletedService[]): void {
  localStorage.setItem(COMPLETED_SERVICES_KEY, JSON.stringify(completedServices));
}

export function addCompletedService(completedService: CompletedService): CompletedService[] {
  const completedServices = getCompletedServices();
  const newCompletedServices = [...completedServices, completedService];
  saveCompletedServices(newCompletedServices);
  return newCompletedServices;
}

// Utility functions for reports
export function getDailyEarnings(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return getCompletedServices()
    .filter(service => {
      const serviceDate = new Date(service.completionDate);
      serviceDate.setHours(0, 0, 0, 0);
      return serviceDate.getTime() === today.getTime();
    })
    .reduce((sum, service) => sum + service.totalAmount, 0);
}

export function getWeeklyEarnings(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday is 0, Monday is 1, etc.
  
  return getCompletedServices()
    .filter(service => {
      const serviceDate = new Date(service.completionDate);
      return serviceDate >= startOfWeek && serviceDate <= today;
    })
    .reduce((sum, service) => sum + service.totalAmount, 0);
}

export function getMonthlyEarnings(): number {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  return getCompletedServices()
    .filter(service => {
      const serviceDate = new Date(service.completionDate);
      return serviceDate >= startOfMonth && serviceDate <= today;
    })
    .reduce((sum, service) => sum + service.totalAmount, 0);
}

export function getDailyAverage(): number {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const currentDay = today.getDate();
  
  const monthlyEarnings = getMonthlyEarnings();
  
  return monthlyEarnings / currentDay;
}

// Convert string to base64 for image storage
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}
