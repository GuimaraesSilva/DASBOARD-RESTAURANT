'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, User } from "lucide-react";
import reviewsData from "@/data/reviews.json";
import customersData from "@/data/customers.json";

export function RecentReviews() {
  const recentReviews = reviewsData.reviews
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const getCustomerName = (customerId: number) => {
    const customer = customersData.customers.find(c => c.id === customerId);
    return customer?.name || 'Unknown Customer';
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-green-100 text-green-800 border-green-300";
    if (rating >= 3) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-xl">Recent Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          {recentReviews.map((review) => (
            <div 
              key={review.id} 
              className="p-4 rounded-lg border border-muted bg-card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-[#263321] flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{getCustomerName(review.customer_id)}</p>
                    <p className="text-xs text-muted-foreground">{getTimeAgo(review.created_at)}</p>
                  </div>
                </div>
                <Badge variant="outline" className={`${getRatingColor(review.rating)} font-semibold`}>
                  <Star className="w-3 h-3 fill-current mr-1" />
                  {review.rating}
                </Badge>
              </div>
              
              {review.comment && review.comment.trim() && (
                <p className="text-sm text-muted-foreground italic border-l-2 border-muted pl-3 mt-2">
                  "{review.comment}"
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}