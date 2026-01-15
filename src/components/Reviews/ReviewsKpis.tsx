'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Star, MessageSquare, TrendingUp, Users, ThumbsUp, MessageCircle, Award, Sparkles } from "lucide-react";
import reviewsData from "@/data/reviews.json";

export function ReviewsKpis() {
  const totalReviews = reviewsData.reviews.length;
  const averageRating = (
    reviewsData.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
  ).toFixed(1);
  
  const fiveStarReviews = reviewsData.reviews.filter(r => r.rating === 5).length;
  const fourStarReviews = reviewsData.reviews.filter(r => r.rating === 4).length;
  const fiveStarPercentage = ((fiveStarReviews / totalReviews) * 100).toFixed(1);
  
  const withComments = reviewsData.reviews.filter(r => r.comment && r.comment.trim().length > 0).length;
  const withCommentsPercentage = ((withComments / totalReviews) * 100).toFixed(1);

  // Calcular reviews positivas (4 e 5 estrelas)
  const positiveReviews = fiveStarReviews + fourStarReviews;
  const positivePercentage = ((positiveReviews / totalReviews) * 100).toFixed(1);

  // Calcular média de comprimento dos comentários
  const commentsWithText = reviewsData.reviews.filter(r => r.comment && r.comment.trim().length > 0);
  const avgCommentLength = commentsWithText.length > 0
    ? Math.round(commentsWithText.reduce((sum, r) => sum + (r.comment?.length || 0), 0) / commentsWithText.length)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4">
      {/* Card 1: Total Reviews */}
      <Card>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <p className="font-medium text-gray-600 mb-2 md:mb-4">Total Reviews</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{totalReviews}</h3>
              
              <div className="space-y-1 mt-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MessageCircle className="w-3 h-3" />
                    <span>With feedback</span>
                  </div>
                  <span className="font-semibold text-[#412A22]">{withComments}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Sparkles className="w-3 h-3" />
                    <span>Engagement rate</span>
                  </div>
                  <span className="font-semibold text-[#412A22]">{withCommentsPercentage}%</span>
                </div>
              </div>
            </div>
            <div className="p-2 rounded-full bg-[#BDA69F]">
              <MessageSquare className="w-6 h-6 text-[#412A22]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Average Rating */}
      <Card>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <p className="font-medium text-gray-600 mb-2 md:mb-4">Average Rating</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{averageRating}</h3>
              
              <div className="space-y-1 mt-3">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 ${
                        i < Math.round(Number(averageRating)) 
                          ? 'fill-yellow-500' 
                          : ''
                      }`} 
                    />
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <ThumbsUp className="w-3 h-3" />
                    <span>Satisfaction</span>
                  </div>
                  <span className="font-semibold text-[#412A22]">
                    {(Number(averageRating) / 5 * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="p-2 rounded-full bg-[#BDA69F]">
              <Star className="w-6 h-6 text-[#412A22]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: 5 Star Reviews */}
      <Card>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <p className="font-medium text-gray-600 mb-2 md:mb-4">5 Star Reviews</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{fiveStarPercentage}%</h3>
              
              <div className="space-y-1 mt-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Award className="w-3 h-3" />
                    <span>5-star count</span>
                  </div>
                  <span className="font-semibold text-[#412A22]">{fiveStarReviews} of {totalReviews}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <ThumbsUp className="w-3 h-3" />
                    <span>Positive (4-5★)</span>
                  </div>
                  <span className="font-semibold text-[#412A22]">{positivePercentage}%</span>
                </div>
              </div>
            </div>
            <div className="p-2 rounded-full bg-[#BDA69F]">
              <TrendingUp className="w-6 h-6 text-[#412A22]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 4: With Comments */}
      <Card>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <p className="font-medium text-gray-600 mb-2 md:mb-4">With Comments</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{withComments}</h3>
              
              <div className="space-y-1 mt-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>Feedback rate</span>
                  </div>
                  <span className="font-semibold text-[#412A22]">{withCommentsPercentage}% with feedback</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MessageSquare className="w-3 h-3" />
                    <span>Avg. length</span>
                  </div>
                  <span className="font-semibold text-[#412A22]">{avgCommentLength} chars</span>
                </div>
              </div>
            </div>
            <div className="p-2 rounded-full bg-[#BDA69F]">
              <Users className="w-6 h-6 text-[#412A22]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}