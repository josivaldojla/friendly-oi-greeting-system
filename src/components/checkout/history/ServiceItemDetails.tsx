
import { Service } from "@/lib/types";

interface ServiceItemDetailsProps {
  services: Service[];
  formatPrice: (price: number) => string;
}

export const ServiceItemDetails = ({ services, formatPrice }: ServiceItemDetailsProps) => {
  return (
    <ul className="divide-y">
      {services.map((service, index) => (
        <li key={`${service.id}-${index}`} className="py-2">
          <div className="flex justify-between">
            <span className="font-medium">{service.name}</span>
            <span>{formatPrice(service.price)}</span>
          </div>
          {service.comment && (
            <p className="text-sm text-muted-foreground mt-1 pl-4 border-l-2 border-muted">
              {service.comment}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
};
