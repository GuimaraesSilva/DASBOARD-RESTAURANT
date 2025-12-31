import React from 'react';

export const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full">
      {/* Loading text */}
      <div className="text-[#263321] text-3xl font-light tracking-wide">
        loading...
      </div>
      
      {/* Progress bar container */}
      <div className="relative w-full max-w-[400px] h-12">
        {/* Outer rounded border */}
        <div className="absolute inset-0 rounded-full border-2 border-[#263321]" />
        
        {/* Inner progress bars */}
        <div className="absolute inset-0 flex items-center px-3 overflow-hidden rounded-full">
          <div className="flex gap-1 w-full h-12">
            {[...Array(60)].map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-[#9FB494] rounded-sm relative overflow-hidden"
              >
                <div 
                  className="absolute inset-0 bg-[#263321]"
                  style={{
                    animation: 'fillBar 1s ease-in-out infinite',
                    animationDelay: `${(i * 1000) / 60}ms`
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};