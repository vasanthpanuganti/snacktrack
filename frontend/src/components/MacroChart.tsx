import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#388e3c", "#ffb74d", "#64b5f6"];

interface MacroChartProps {
  macros: Record<string, number>;
}

const MacroChart = ({ macros }: MacroChartProps) => {
  const data = Object.entries(macros).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} label>
          {data.map((entry, index) => (
            <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `${value} g`} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default MacroChart;
