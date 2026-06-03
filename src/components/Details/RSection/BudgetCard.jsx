import { DollarSign } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Accommodation", value: 800, color: "#2563eb" },
  { name: "Food & Dining", value: 600, color: "#14b8a6" },
  { name: "Transportation", value: 400, color: "#7c3aed" },
  { name: "Activities", value: 500, color: "#f59e0b" },
  { name: "Miscellaneous", value: 100, color: "#22c55e" },
];

const BudgetCard = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="text-purple-600" size={24} />
        <h3 className="text-lg font-semibold">
          Budget Breakdown
        </h3>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={6}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3 mt-4">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              />

              <span className="text-gray-600 font-regular">
                {item.name}
              </span>
            </div>

            <span className="font-medium text-gray-600">
              ${item.value}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 mt-6 pt-4 flex justify-between">
        <span className="font-bold text-lg">
          Total
        </span>

        <span className="font-bold text-xl text-blue-600">
          $2400
        </span>
      </div>
    </div>
  );
};

export default BudgetCard;