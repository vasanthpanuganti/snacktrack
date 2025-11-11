import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField
} from "@mui/material";

const cuisines = ["Mediterranean", "Indian", "Japanese", "Mexican"];
const activityLevels = ["sedentary", "light", "moderate", "high"];
const goals = ["weight_loss", "muscle_gain", "maintenance"];

const ProfileForm = () => {
  const [selectedCuisine, setSelectedCuisine] = useState<string[]>([]);

  return (
    <Box component="form" noValidate>
      <Stack spacing={2}>
        <TextField label="Age" type="number" required defaultValue={30} />
        <TextField label="Weight (kg)" type="number" required defaultValue={70} />
        <FormControl fullWidth>
          <InputLabel id="activity-level-label">Activity level</InputLabel>
          <Select
            labelId="activity-level-label"
            input={<OutlinedInput label="Activity level" />}
            defaultValue={activityLevels[2]}
          >
            {activityLevels.map(level => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="goal-label">Goal</InputLabel>
          <Select labelId="goal-label" defaultValue={goals[0]} input={<OutlinedInput label="Goal" />}>
            {goals.map(goal => (
              <MenuItem key={goal} value={goal}>
                {goal}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="cuisine-label">Preferred cuisines</InputLabel>
          <Select
            labelId="cuisine-label"
            multiple
            value={selectedCuisine}
            onChange={event => setSelectedCuisine(event.target.value as string[])}
            input={<OutlinedInput label="Preferred cuisines" />}
            renderValue={selected => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {(selected as string[]).map(value => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {cuisines.map(cuisine => (
              <MenuItem key={cuisine} value={cuisine}>
                {cuisine}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="Allergies" placeholder="Peanuts, shellfish" />
        <TextField label="Health conditions" placeholder="Hypertension" />
        <Button variant="contained" color="primary">
          Save profile
        </Button>
        <Alert severity="info">
          This prototype stores data locally and showcases the DietFriend experience.
        </Alert>
      </Stack>
    </Box>
  );
};

export default ProfileForm;
