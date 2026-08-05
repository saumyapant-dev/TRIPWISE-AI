import {
  DollarSign,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const BudgetCard = ({ budgetData }) => {

  const total = budgetData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">

        <div className="flex items-center gap-3">

          <h3 className="text-xl font-semibold">
            Budget Breakdown
          </h3>

        </div>

        <div className="px-3 hy-2 rounded-full border border-gray-200 text-sm text-gray-500">
          ↗ 4% under budget
        </div>

      </div>

      {/* Content */}
      <div className="grid md:grid-cols-[240px_1fr] gap-4 items-center">

        {/* Donut Chart */}
        <div className="h-[180px] relative">

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={budgetData}
                dataKey="value"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
              >
                {budgetData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center">

            <p className="text-gray-500 text-sm">
              Total
            </p>

            <h2 className="text-2xl font-bold">
              ${total}
            </h2>

          </div>

        </div>

        {/* Categories */}
        <div className="space-y-3">

          {budgetData.map((item) => {
            const percentage = Math.round(
              (item.value / total) * 100
            );

            return (
              <div key={item.name}>

                <div className="flex justify-between items-center mb-1">

                  <div className="flex items-center gap-2">

                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: item.color,
                      }}
                    />

                    <span className="text-sm font-medium">
                      {item.name}
                    </span>

                  </div>

                  <span className="text-sm font-medium">
                    ${item.value}
                  </span>

                </div>

                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-black rounded-full"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
};

export default BudgetCard;