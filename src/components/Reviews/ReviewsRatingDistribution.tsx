'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import reviewsData from "@/data/reviews.json";

export function ReviewsRatingDistribution() {
  const totalReviews = reviewsData.reviews.length;
  
  const ratingCounts = {
    5: reviewsData.reviews.filter(r => r.rating === 5).length,
    4: reviewsData.reviews.filter(r => r.rating === 4).length,
    3: reviewsData.reviews.filter(r => r.rating === 3).length,
    2: reviewsData.reviews.filter(r => r.rating === 2).length,
    1: reviewsData.reviews.filter(r => r.rating === 1).length,
  };

  const getRatingPercentage = (count: number) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  const getBarColor = (rating: number) => {
    if (rating === 5) return "bg-green-500";
    if (rating === 4) return "bg-lime-500";
    if (rating === 3) return "bg-yellow-500";
    if (rating === 2) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Rating Distribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingCounts[rating as keyof typeof ratingCounts];
          const percentage = getRatingPercentage(count);
          
          return (
            <div key={rating} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium w-3">{rating}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">{count} reviews</span>
                  <span className="font-semibold w-12 text-right">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getBarColor(rating)} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}