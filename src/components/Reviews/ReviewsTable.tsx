'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import reviewsData from "@/data/reviews.json";
import customersData from "@/data/customers.json";

interface Review {
  id: number;
  customer_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export function ReviewsTable() {
  const [reviews] = React.useState<Review[]>(
    reviewsData.reviews.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  );

  const getCustomerName = (customerId: number) => {
    const customer = customersData.customers.find(c => c.id === customerId);
    return customer?.name || 'Unknown';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-green-100 text-green-800 border-green-300";
    if (rating >= 3) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">All Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-1/6">Customer</TableHead>
                <TableHead className="w-1/6">Date</TableHead>
                <TableHead className="w-1/6 text-center">Rating</TableHead>
                <TableHead className="w-1/2">Comment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">
                    {getCustomerName(review.customer_id)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(review.created_at).toLocaleDateString('pt-PT', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={`${getRatingColor(review.rating)} font-semibold`}>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        {review.rating}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {review.comment || '—'}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}