import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-5 py-3 rounded-2xl shadow-lg border border-gray-100">
        <p className="text-gray-600 font-medium">
          {label}
        </p>

        <p className="text-2xl font-bold">
          ${payload[0].value}
        </p>
      </div>
    );
  }

  return null;
};

const DailySpending = ({
  spendingData,
  highestDay,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">

      <h3 className="text-2xl font-semibold mb-6">
        Daily Spending
      </h3>

      <div className="h-[180px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={spendingData}
            margin={{
              top: 20,
              right: 20,
              left: -20,
              bottom: 10,
            }}
          >
            <YAxis
              axisLine={false}
              tickLine={false}
              ticks={[0, 200, 400, 600, 800]}
              tick={{
                fill: "#6b7280",
                fontSize: 14,
              }}
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6b7280",
                fontSize: 15,
              }}
            />

            <Tooltip
              cursor={false}
              content={<CustomTooltip />}
            />

            <Bar
              dataKey="amount"
              radius={[7, 7, 0, 0]}
              barSize={38}
            >
              {spendingData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    index === 6
                      ? "#2563eb"
                      : "#dbe4ff"
                  }
                />
              ))}
            </Bar>

          </BarChart>
        </ResponsiveContainer>

      </div>

      <p className="text-center text-gray-500 mt-1 text-sm">
        Highest spending: {highestDay?.day} (${highestDay?.amount})
      </p>

    </div>
  );
};

export default DailySpending;