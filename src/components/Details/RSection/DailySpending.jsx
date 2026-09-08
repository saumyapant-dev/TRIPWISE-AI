import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";


const CustomTooltip = ({ active, payload, label, currencySymbol = "$" }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-5 py-3 rounded-2xl shadow-lg border border-gray-100">
        <p className="text-gray-600 font-medium">
          {label}
        </p>

        <p className="text-2xl font-bold">
          {currencySymbol}{payload[0].value?.toLocaleString()}
        </p>
      </div>
    );
  }

  return null;
};

const DailySpending = ({
  spendingData,
  highestDay,
  currencySymbol = "$",
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">

      <h3 className="text-2xl font-semibold mb-6">
        Daily Spending
      </h3>

      <div className="h-[180px] w-full min-w-0">

        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          minHeight={180}
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
              content={<CustomTooltip currencySymbol={currencySymbol} />}
            />

            <Bar
              dataKey="amount"
              radius={[7, 7, 0, 0]}
              barSize={38}
            >
              {spendingData.map((entry, index) => {
                const isHighest = highestDay && entry.day === highestDay.day;
                return (
                  <Cell
                    key={index}
                    fill={isHighest ? "#2563eb" : "#dbe4ff"}
                  />
                );
              })}
            </Bar>

          </BarChart>
        </ResponsiveContainer>

      </div>

      <p className="text-center text-gray-500 mt-1 text-sm">
        Highest spending: {highestDay?.day} ({currencySymbol}{highestDay?.amount?.toLocaleString()})
      </p>

    </div>
  );
};

export default DailySpending;