import React from "react";
import { Input, Button, Card, CardBody, Select, SelectItem, Autocomplete, AutocompleteItem, DatePicker, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";
import { TrainingRecord, TrainingType, UserSettings } from "../types/training";
import { strengthExercises, cardioExercises, calisthenicsExercises } from "../data/exercises";
import { parseDate } from "@internationalized/date";
import { BodyWeightModal } from "./body-weight-modal";
import { useLocalStorage } from "../hooks/use-local-storage";

interface TrainingFormProps {
  onSubmit: (record: Omit<TrainingRecord, "id">) => void;
  initialRecord?: TrainingRecord | null;
}

export const TrainingForm: React.FC<TrainingFormProps> = ({ onSubmit, initialRecord }) => {
  const [type, setType] = React.useState<TrainingType>("strength");
  const [exercise, setExercise] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(parseDate(new Date().toISOString().split('T')[0]));
  const [sets, setSets] = React.useState("");
  const [reps, setReps] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [distance, setDistance] = React.useState("");
  const [calories, setCalories] = React.useState("");
  
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [userSettings, setUserSettings] = useLocalStorage<UserSettings>("user-settings", {
    bodyWeight: 0,
    lastUpdated: new Date().toISOString(),
  });

  React.useEffect(() => {
    if (initialRecord) {
      setType(initialRecord.type);
      setExercise(initialRecord.exercise);
      setSelectedDate(parseDate(initialRecord.date));
      
      if (initialRecord.type === "strength") {
        setSets(initialRecord.sets?.toString() || "");
        setReps(initialRecord.reps?.toString() || "");
        setWeight(initialRecord.weight?.toString() || "");
      } else if (initialRecord.type === "calisthenics") {
        setSets(initialRecord.sets?.toString() || "");
        setReps(initialRecord.reps?.toString() || "");
      } else {
        setDuration(initialRecord.duration?.toString() || "");
        setDistance(initialRecord.distance?.toString() || "");
        setCalories(initialRecord.caloriesBurned?.toString() || "");
      }
    }
  }, [initialRecord]);

  const exercises = React.useMemo(() => {
    switch (type) {
      case "strength":
        return strengthExercises;
      case "cardio":
        return cardioExercises;
      case "calisthenics":
        return calisthenicsExercises;
      default:
        return [];
    }
  }, [type]);

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
    } else if (type === "calisthenics") {
      if (!sets || !reps || !userSettings.bodyWeight) {
        if (!userSettings.bodyWeight) {
          onOpen();
          return;
        }
        return;
      }
      onSubmit({
        type,
        date: selectedDate.toString(),
        exercise,
        sets: Number(sets),
        reps: Number(reps),
        bodyWeight: userSettings.bodyWeight,
      });
      setSets("");
      setReps("");
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

  const handleUpdateBodyWeight = (newWeight: number) => {
    setUserSettings({
      bodyWeight: newWeight,
      lastUpdated: new Date().toISOString(),
    });
  };

  return (
    <>
      <Card className="max-w-md mx-auto">
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <Select
                label="Training Type"
                selectedKeys={[type]}
                onChange={(e) => setType(e.target.value as TrainingType)}
                className="flex-1"
              >
                <SelectItem key="strength" startContent={<Icon icon="lucide:dumbbell" />}>
                  Strength
                </SelectItem>
                <SelectItem key="calisthenics" startContent={<Icon icon="lucide:user" />}>
                  Calisthenics
                </SelectItem>
                <SelectItem key="cardio" startContent={<Icon icon="lucide:heart-pulse" />}>
                  Cardio
                </SelectItem>
              </Select>
              {type === "calisthenics" && (
                <Button
                  isIconOnly
                  variant="flat"
                  onPress={onOpen}
                  className="self-end"
                  color={userSettings.bodyWeight ? "success" : "danger"}
                >
                  <Icon icon="lucide:weight" />
                </Button>
              )}
            </div>

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
              placeholder={
                type === "strength" 
                  ? "e.g., Bench Press" 
                  : type === "calisthenics"
                  ? "e.g., Push-ups"
                  : "e.g., Running"
              }
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
                  icon={
                    type === "strength" 
                      ? "lucide:dumbbell" 
                      : type === "calisthenics"
                      ? "lucide:user"
                      : "lucide:heart-pulse"
                  }
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
                        icon={
                          type === "strength" 
                            ? "lucide:dumbbell" 
                            : type === "calisthenics"
                            ? "lucide:user"
                            : "lucide:heart-pulse"
                        }
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

            {(type === "strength" || type === "calisthenics") ? (
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
                {type === "strength" && (
                  <Input
                    label="Weight (kg)"
                    type="number"
                    placeholder="50"
                    value={weight}
                    onValueChange={setWeight}
                  />
                )}
                {type === "calisthenics" && (
                  <Input
                    label="Body Weight"
                    value={userSettings.bodyWeight?.toString() || ""}
                    isReadOnly
                    startContent={<Icon icon="lucide:weight" className="text-default-400" />}
                  />
                )}
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

      <BodyWeightModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onSave={handleUpdateBodyWeight}
        currentSettings={userSettings}
      />
    </>
  );
};
