import { Card, CardContent, CardHeader, Divider, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import MacroChart from "./MacroChart";

const Dashboard = () => {
  const stats = useMemo(
    () => ({
      calories: 1900,
      macros: {
        protein: 120,
        carbs: 210,
        fat: 60
      },
      meals: [
        {
          title: "Herb-Infused Quinoa Bowl",
          calories: 420,
          description: "High-protein vegetarian bowl with mediterranean flavors"
        },
        {
          title: "Chickpea Spinach Stew",
          calories: 380,
          description: "Fiber-rich stew inspired by Andalusian cuisine"
        }
      ]
    }),
    []
  );

  return (
    <Stack spacing={3}>
      <Card>
        <CardHeader title="Daily calorie target" subheader="Based on your latest profile" />
        <CardContent>
          <Typography variant="h4">{stats.calories} kcal</Typography>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="Macro distribution" subheader="Balanced for your goal" />
        <CardContent>
          <MacroChart macros={stats.macros} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="Featured meals" subheader="Region-aware recommendations" />
        <CardContent>
          <Stack spacing={2}>
            {stats.meals.map(meal => (
              <Stack key={meal.title} spacing={0.5}>
                <Typography variant="subtitle1">{meal.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {meal.description}
                </Typography>
                <Typography variant="caption">{meal.calories} kcal</Typography>
                <Divider sx={{ my: 1 }} />
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default Dashboard;
