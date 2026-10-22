"use client";

import { useSyncExternalStore } from "react";
import availabilityData from "@/data/availability.json";

const noSubscription = () => () => {};

/** Months since year 0 in the visitor's time zone; null while prerendering. */
function useCurrentMonth() {
  return useSyncExternalStore(
    noSubscription,
    () => {
      const now = new Date();
      return now.getFullYear() * 12 + now.getMonth();
    },
    () => null,
  );
}

interface AvailabilityDisplayProps {
  productId: string;
}

interface MonthlySlot {
  total: number;
  booked: number;
}

const AvailabilityDisplay = ({ productId }: AvailabilityDisplayProps) => {
  const currentMonth = useCurrentMonth();

  // Calculate the next 4 months (including current)
  const months =
    currentMonth === null
      ? []
      : Array.from({ length: 4 }, (_, i) =>
          new Date(
            Math.floor(currentMonth / 12),
            (currentMonth % 12) + i,
            1,
          ).toLocaleString("en-GB", { month: "long" }),
        );

  // Get the data for the product
  const productData =
    productId in availabilityData
      ? (availabilityData as any)[productId]
      : undefined;
  const serviceType: "monthly" | "retainer" = productData?.type ?? "monthly";
  const monthlySlots: MonthlySlot[] =
    productData?.type === "monthly" ? productData.slots : [];
  const retainerCapacity =
    productData?.type === "retainer"
      ? {
          total: productData.totalCapacity,
          booked: productData.bookedCapacity,
        }
      : { total: 0, booked: 0 };

  // Helper function to determine text color based on availability
  const getAvailabilityColor = (total: number, booked: number) => {
    if (total === booked) return "text-black";
    if (total - booked === 1) return "text-black";
    return "text-black";
  };

  return (
    <div className="mb-8 mt-6">
      <h5 className="mb-3 text-base font-medium text-patchworks-dark-gray">
        Availability:
      </h5>

      {serviceType === "monthly" ? (
        <div className="space-y-2">
          {months.map((month, index) => {
            if (!monthlySlots[index]) return null;

            const { total, booked } = monthlySlots[index];
            const isFull = total === booked;
            const colorClass = getAvailabilityColor(total, booked);

            return (
              <div key={month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-patchworks-dark-gray">
                  {month}:
                </span>
                {isFull ? (
                  <span className="text-sm font-medium text-black">
                    Fully Booked
                  </span>
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
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-patchworks-dark-gray">
              12-Month Retainer:
            </span>
            <span
              className={`text-sm font-medium ${getAvailabilityColor(retainerCapacity.total, retainerCapacity.booked)}`}
            >
              {retainerCapacity.booked} of {retainerCapacity.total} Positions
              Filled
            </span>
          </div>
          {retainerCapacity.total > retainerCapacity.booked && (
            <div className="text-sm font-medium text-black">
              Only {retainerCapacity.total - retainerCapacity.booked} position
              {retainerCapacity.total - retainerCapacity.booked !== 1
                ? "s"
                : ""}{" "}
              remaining
            </div>
          )}
        </div>
      )}

      <div className="mt-4 text-xs text-patchworks-dark-gray">
        <p>
          To ensure we deliver the highest quality results and provide dedicated
          attention to each client, we carefully manage our project capacity.
        </p>
      </div>
    </div>
  );
};

export default AvailabilityDisplay;
