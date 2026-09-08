import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const BudgetCard = ({ budgetData, targetBudget, currencySymbol = "$" }) => {

  const total = budgetData.reduce(
    (sum, item) => sum + (Number(item.value) || 0),
    0
  );

  const budgetDiff = targetBudget ? Number(targetBudget) - total : null;

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">

        <div className="flex items-center gap-3">

          <h3 className="text-xl font-semibold">
            Budget Breakdown
          </h3>

        </div>

        {budgetDiff !== null ? (
          budgetDiff >= 0 ? (
            <div className="px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-xs font-semibold text-emerald-700">
              ✓ {currencySymbol}{budgetDiff.toLocaleString()} under budget
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-700">
              ⚠️ {currencySymbol}{Math.abs(budgetDiff).toLocaleString()} over target
            </div>
          )
        ) : (
          <div className="px-3 py-1 rounded-full border border-indigo-100 bg-indigo-50 text-xs font-semibold text-indigo-700">
            AI Optimized Budget
          </div>
        )}

      </div>

      {/* Content */}
      <div className="grid md:grid-cols-[240px_1fr] gap-4 items-center min-w-0">

        {/* Donut Chart */}
        <div className="h-[180px] w-full min-w-0 relative">

          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={180}>
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
              {currencySymbol}{total.toLocaleString()}
            </h2>

          </div>

        </div>

        {/* Categories */}
        <div className="space-y-3">

          {budgetData.map((item) => {
            const percentage = total > 0
              ? Math.round((item.value / total) * 100)
              : 0;

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
                    {currencySymbol}{(Number(item.value) || 0).toLocaleString()}
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