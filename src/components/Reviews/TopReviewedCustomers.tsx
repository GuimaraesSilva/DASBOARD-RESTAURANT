'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare } from "lucide-react";
import reviewsData from "@/data/reviews.json";
import customersData from "@/data/customers.json";

export function TopReviewedCustomers() {
  // Agrupar reviews por cliente
  const customerReviews = reviewsData.reviews.reduce((acc, review) => {
    if (!acc[review.customer_id]) {
      acc[review.customer_id] = {
        customerId: review.customer_id,
        reviews: [],
        totalRating: 0,
        count: 0,
      };
    }
    acc[review.customer_id].reviews.push(review);
    acc[review.customer_id].totalRating += review.rating;
    acc[review.customer_id].count++;
    return acc;
  }, {} as Record<number, { customerId: number; reviews: typeof reviewsData.reviews; totalRating: number; count: number }>);

  // Top 5 clientes com mais reviews
  const topCustomers = Object.values(customerReviews)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(data => {
      const customer = customersData.customers.find(c => c.id === data.customerId);
      return {
        id: data.customerId,
        name: customer?.name || 'Unknown',
        reviewCount: data.count,
        averageRating: (data.totalRating / data.count).toFixed(1),
        withComments: data.reviews.filter(r => r.comment && r.comment.trim().length > 0).length,
      };
    });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Most Active Reviewers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topCustomers.map((customer, index) => (
            <div key={customer.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-[#263321]">
                  <AvatarFallback className="bg-[#263321] text-white font-semibold">
                    {getInitials(customer.name)}
                  </AvatarFallback>
                </Avatar>
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-[#BDA69F] text-[#412A22] text-xs font-bold"
                >
                  {index + 1}
                </Badge>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{customer.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{customer.averageRating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageSquare className="w-3 h-3" />
                    <span>{customer.reviewCount} reviews</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <Badge variant="outline" className="text-xs">
                  {customer.withComments} with feedback
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}