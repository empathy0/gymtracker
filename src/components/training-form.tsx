import React from "react";
import { Input, Button, Card, CardBody, Select, SelectItem, Autocomplete, AutocompleteItem, DatePicker } from "@heroui/react";
import { Icon } from "@iconify/react";
import { TrainingRecord, TrainingType } from "../types/training";
import { strengthExercises, cardioExercises } from "../data/exercises";
import { parseDate } from "@internationalized/date";

interface TrainingFormProps {
  onSubmit: (record: Omit<TrainingRecord, "id">) => void;
}

export const TrainingForm: React.FC<TrainingFormProps> = ({ onSubmit }) => {
  const [type, setType] = React.useState<TrainingType>("strength");
  const [exercise, setExercise] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(parseDate(new Date().toISOString().split('T')[0]));
  const [sets, setSets] = React.useState("");
  const [reps, setReps] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [distance, setDistance] = React.useState("");
  const [calories, setCalories] = React.useState("");

  const exercises = type === "strength" ? strengthExercises : cardioExercises;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!exercise || !type || !selectedDate) return;

    if (type === "strength") {
      if (!sets || !reps || !weight) return;
      onSubmit({
        type,
        date: selectedDate.toString(),
        exercise,
        sets: Number(sets),
        reps: Number(reps),
        weight: Number(weight),
      });
      setSets("");
      setReps("");
      setWeight("");
    } else {
      if (!duration) return;
      onSubmit({
        type,
        date: selectedDate.toString(),
        exercise,
        duration: Number(duration),
        ...(distance ? { distance: Number(distance) } : {}),
        ...(calories ? { caloriesBurned: Number(calories) } : {}),
      });
      setDuration("");
      setDistance("");
      setCalories("");
    }

    setExercise("");
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardBody>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Select
            label="Training Type"
            selectedKeys={[type]}
            onChange={(e) => setType(e.target.value as TrainingType)}
          >
            <SelectItem key="strength" startContent={<Icon icon="lucide:dumbbell" />}>
              Strength
            </SelectItem>
            <SelectItem key="cardio" startContent={<Icon icon="lucide:heart-pulse" />}>
              Cardio
            </SelectItem>
          </Select>

          {/* <DatePicker
            label="Date"
            placeholder="Select date"
            value={selectedDate}
            onChange={setSelectedDate}
            formatOptions={{ dateStyle: "medium" }}
          /> */}
          <DatePicker
            label="Date"
            value={selectedDate}
            onChange={(value) => {
              if (value) setSelectedDate(value);
            }}
          />

          <Autocomplete
            label="Exercise"
            placeholder={type === "strength" ? "e.g., Bench Press" : "e.g., Running"}
            defaultItems={exercises}
            allowsCustomValue
            value={exercise}
            onSelectionChange={(key) => {
              const selected = exercises.find(ex => ex.key === key);
              if (selected) {
                setExercise(selected.label);
              }
            }}
            onInputChange={setExercise}
            startContent={
              <Icon 
                icon={type === "strength" ? "lucide:dumbbell" : "lucide:heart-pulse"} 
                className="text-default-400" 
              />
            }
          >
            {(item) => (
              <AutocompleteItem
                key={item.key}
                startContent={
                  <div className="flex items-center gap-2">
                    <Icon 
                      icon={type === "strength" ? "lucide:dumbbell" : "lucide:heart-pulse"}
                      className="text-default-400"
                    />
                  </div>
                }
                description={item.category}
              >
                {item.label}
              </AutocompleteItem>
            )}
          </Autocomplete>

          {type === "strength" ? (
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Sets"
                type="number"
                placeholder="3"
                value={sets}
                onValueChange={setSets}
              />
              <Input
                label="Reps"
                type="number"
                placeholder="12"
                value={reps}
                onValueChange={setReps}
              />
              <Input
                label="Weight (kg)"
                type="number"
                placeholder="50"
                value={weight}
                onValueChange={setWeight}
              />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Duration (min)"
                type="number"
                placeholder="30"
                value={duration}
                onValueChange={setDuration}
              />
              <Input
                label="Distance (km)"
                type="number"
                placeholder="5"
                value={distance}
                onValueChange={setDistance}
              />
              <Input
                label="Calories"
                type="number"
                placeholder="300"
                value={calories}
                onValueChange={setCalories}
              />
            </div>
          )}

          <Button 
            color="primary" 
            type="submit"
            startContent={<Icon icon="lucide:plus" />}
          >
            Add Record
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};
