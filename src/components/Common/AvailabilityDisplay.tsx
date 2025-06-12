"use client";

import { useEffect, useState } from "react";
import availabilityData from "@/data/availability.json";

interface AvailabilityDisplayProps {
  productId: string;
}

interface MonthlySlot {
  total: number;
  booked: number;
}

const AvailabilityDisplay = ({ productId }: AvailabilityDisplayProps) => {
  const [months, setMonths] = useState<string[]>([]);
  const [serviceType, setServiceType] = useState<"monthly" | "retainer">("monthly");
  const [monthlySlots, setMonthlySlots] = useState<MonthlySlot[]>([]);
  const [retainerCapacity, setRetainerCapacity] = useState({ total: 0, booked: 0 });

  useEffect(() => {
    // Get the current date
    const currentDate = new Date();
    
    // Calculate the next 4 months (including current)
    const nextMonths = Array.from({ length: 4 }, (_, i) => {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() + i);
      return date.toLocaleString('default', { month: 'long' });
    });
    
    setMonths(nextMonths);
    
    // Get the data for the product
    if (productId in availabilityData) {
      const productData = (availabilityData as any)[productId];
      setServiceType(productData.type);
      
      if (productData.type === "monthly") {
        setMonthlySlots(productData.slots);
      } else if (productData.type === "retainer") {
        setRetainerCapacity({
          total: productData.totalCapacity,
          booked: productData.bookedCapacity
        });
      }
    }
  }, [productId]);

  // Helper function to determine text color based on availability
  const getAvailabilityColor = (total: number, booked: number) => {
    if (total === booked) return "text-red-500";
    if (total - booked === 1) return "text-amber-500";
    return "text-primary";
  };

  return (
    <div className="mt-6 mb-8">
      <h5 className="mb-3 text-base font-medium text-body-color">Availability:</h5>
      
      {serviceType === "monthly" ? (
        <div className="space-y-2">
          {months.map((month, index) => {
            if (!monthlySlots[index]) return null;
            
            const { total, booked } = monthlySlots[index];
            const isFull = total === booked;
            const colorClass = getAvailabilityColor(total, booked);
            
            return (
              <div key={month} className="flex justify-between items-center">
                <span className="text-sm font-medium text-body-color">{month}:</span>
                {isFull ? (
                  <span className="text-sm font-medium text-red-500">Fully Booked</span>
                ) : (
                  <span className={`text-sm font-medium ${colorClass}`}>
                    {booked} of {total} Slots Booked
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-body-color">12-Month Retainer:</span>
            <span className={`text-sm font-medium ${getAvailabilityColor(retainerCapacity.total, retainerCapacity.booked)}`}>
              {retainerCapacity.booked} of {retainerCapacity.total} Positions Filled
            </span>
          </div>
          {retainerCapacity.total > retainerCapacity.booked && (
            <div className="text-sm font-medium text-amber-500">
              Only {retainerCapacity.total - retainerCapacity.booked} position{retainerCapacity.total - retainerCapacity.booked !== 1 ? 's' : ''} remaining
            </div>
          )}
        </div>
      )}
      
      <div className="mt-4 text-xs text-body-color">
        <p>To ensure we deliver the highest quality results and provide dedicated attention to each client, we carefully manage our project capacity.</p>
      </div>
    </div>
  );
};

export default AvailabilityDisplay;
