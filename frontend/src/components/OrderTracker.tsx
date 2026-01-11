import { Check, Clock, Package, Truck, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderTrackerProps {
  status: string;
}

export function OrderTracker({ status }: OrderTrackerProps) {
  const steps = [
    { id: 'Pending', label: 'Ordered', icon: Clock },
    { id: 'Processing', label: 'Processing', icon: Package },
    { id: 'Shipped', label: 'Shipped', icon: Truck },
    { id: 'Delivered', label: 'Delivered', icon: Home },
  ];

  const getCurrentStepIndex = (status: string) => {
    const normalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    const normalizedStatus = normalize(status);
    
    // Handle 'Paid' as 'Processing' roughly, or strictly mapping
    if (normalizedStatus === 'Paid') return 1; 
    
    return steps.findIndex(step => step.id === normalizedStatus);
  };

  const currentStep = getCurrentStepIndex(status);

  return (
    <div className="w-full py-6">
      <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto">
        {/* Progress Bar Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 -z-10" />
        
        {/* Active Progress Bar */}
        <div 
            className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 -z-10 transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index <= currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center bg-white px-2">
              <div 
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-300",
                  isCompleted ? "bg-green-500 border-green-500 text-white" : "border-gray-200 text-gray-400 bg-white",
                  isCurrent && "ring-4 ring-green-100"
                )}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <span className={cn(
                  "mt-2 text-xs font-medium transition-colors duration-300",
                  isCompleted ? "text-green-600" : "text-gray-400"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      {status === 'Cancelled' && (
          <div className="text-center mt-4 text-red-500 font-medium">
              This order has been cancelled.
          </div>
      )}
    </div>
  );
}
