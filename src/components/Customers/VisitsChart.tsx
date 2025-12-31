// "use client";

// import { Customer } from "@/types/metric";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

// export function VisitsChart({ customers }: { customers: Customer[] }) {
//   const topVisits = [...customers]
//     .sort((a, b) => (b.visits ?? 0) - (a.visits ?? 0))
//     .slice(0, 10)
//     .map((c) => ({ name: c.name, visits: c.visits }));

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="text-sm font-medium">
//           Top 10 por visitas
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer
//           config={{
//             visits: { label: "Visitas" },
//           }}
//           className="h-[280px]"
//         >
//           <BarChart data={topVisits}>
//             <CartesianGrid vertical={false} />
//             <XAxis dataKey="name" tickLine={false} axisLine={false} hide />
//             <YAxis />
//             <ChartTooltip content={<ChartTooltipContent />} />
//             <Bar dataKey="visits" radius={6} />
//           </BarChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { Customer } from "@/types/metric";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

export function VisitsChart({ customers }: { customers: Customer[] }) {
  const topVisits = [...customers]
    .sort((a, b) => (b.visits ?? 0) - (a.visits ?? 0))
    .slice(0, 10)
    .map((c) => ({
      name: c.name.split(' ')[0].substring(0, 6), // máximo 6 letras
      fullName: c.name,
      visits: c.visits,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Top 10 por visitas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <ChartContainer
          config={{
            visits: { label: "Visitas" },
          }}
          className="h-[220px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topVisits}
              margin={{ top: 5, right: 0, left: 0, bottom: 10 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                angle={-12}
                textAnchor="end"
                height={24}
                interval={0}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                width={24}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => {
                      if (payload && payload[0]) {
                        return payload[0].payload.fullName;
                      }
                      return "";
                    }}
                  />
                }
              />
              <Bar
                dataKey="visits"
                radius={[4, 4, 0, 0]}
                fill="#2C3E2D"
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}