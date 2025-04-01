import React from "react";
import { Card, CardBody, CardHeader, Progress, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure, Accordion, AccordionItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { TrainingRecord } from "../types/training";
import { useLocalStorage } from "../hooks/use-local-storage";

interface TrainingMetricsProps {
  records: TrainingRecord[];
}

interface Goals {
  weightGoal: number;
  durationGoal: number;
}

interface ExerciseStats {
  lastWeight?: number;
  maxWeight?: number;
  avgWeight?: number;
  lastCalories?: number;
  maxCalories?: number;
  avgCalories?: number;
  lastDuration?: number;
  maxDuration?: number;
  avgDuration?: number;
}

export const TrainingMetrics: React.FC<TrainingMetricsProps> = ({ records }) => {
  const [goals, setGoals] = useLocalStorage<Goals>("training-goals", {
    weightGoal: 1000,
    durationGoal: 60
  });
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [tempWeightGoal, setTempWeightGoal] = React.useState(goals.weightGoal.toString());
  const [tempDurationGoal, setTempDurationGoal] = React.useState(goals.durationGoal.toString());

  const strengthRecords = records.filter(record => record.type === "strength");
  const cardioRecords = records.filter(record => record.type === "cardio");

  const totalWeight = strengthRecords.reduce((acc, record) => {
    return acc + (record.sets! * record.reps! * record.weight!);
  }, 0);

  const totalSets = strengthRecords.reduce((acc, record) => {
    return acc + record.sets!;
  }, 0);

  const totalReps = strengthRecords.reduce((acc, record) => {
    return acc + (record.sets! * record.reps!);
  }, 0);

  const totalDuration = cardioRecords.reduce((acc, record) => {
    return acc + record.duration!;
  }, 0);

  const totalDistance = cardioRecords.reduce((acc, record) => {
    return acc + (record.distance || 0);
  }, 0);

  const totalCalories = cardioRecords.reduce((acc, record) => {
    return acc + (record.caloriesBurned || 0);
  }, 0);

  // Calculate exercise-specific stats
  const exerciseStats = React.useMemo(() => {
    const stats: Record<string, ExerciseStats> = {};

    // Process strength exercises
    strengthRecords.forEach(record => {
      if (!stats[record.exercise]) {
        stats[record.exercise] = {};
      }
      const totalWeight = record.sets! * record.reps! * record.weight!;
      const currentStats = stats[record.exercise];

      // Last weight
      currentStats.lastWeight = totalWeight;

      // Max weight
      currentStats.maxWeight = Math.max(currentStats.maxWeight || 0, totalWeight);

      // Average weight
      const records = strengthRecords.filter(r => r.exercise === record.exercise);
      const totalWeights = records.reduce((acc, r) => acc + (r.sets! * r.reps! * r.weight!), 0);
      currentStats.avgWeight = totalWeights / records.length;
    });

    // Process cardio exercises
    cardioRecords.forEach(record => {
      if (!stats[record.exercise]) {
        stats[record.exercise] = {};
      }
      const currentStats = stats[record.exercise];

      // Last calories and duration
      currentStats.lastCalories = record.caloriesBurned;
      currentStats.lastDuration = record.duration;

      // Max calories and duration
      if (record.caloriesBurned) {
        currentStats.maxCalories = Math.max(currentStats.maxCalories || 0, record.caloriesBurned);
      }
      currentStats.maxDuration = Math.max(currentStats.maxDuration || 0, record.duration!);

      // Average calories and duration
      const records = cardioRecords.filter(r => r.exercise === record.exercise);
      if (record.caloriesBurned) {
        const totalCalories = records.reduce((acc, r) => acc + (r.caloriesBurned || 0), 0);
        const recordsWithCalories = records.filter(r => r.caloriesBurned).length;
        currentStats.avgCalories = totalCalories / recordsWithCalories;
      }
      const totalDuration = records.reduce((acc, r) => acc + r.duration!, 0);
      currentStats.avgDuration = totalDuration / records.length;
    });

    return stats;
  }, [strengthRecords, cardioRecords]);

  const handleSaveGoals = () => {
    const newWeightGoal = Number(tempWeightGoal);
    const newDurationGoal = Number(tempDurationGoal);
    
    if (newWeightGoal > 0 && newDurationGoal > 0) {
      setGoals({
        weightGoal: newWeightGoal,
        durationGoal: newDurationGoal
      });
    }
  };

  return (
    <>
      <Accordion selectionMode="multiple" defaultSelectedKeys={["metrics"]}>
        <AccordionItem
          key="metrics"
          aria-label="Training Metrics"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:bar-chart-2" />
              <span>Training Metrics</span>
            </div>
          }
          subtitle="View your training progress and goals"
        >
          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <Card>
              <CardHeader className="flex gap-2 items-center justify-between">
                <div className="flex gap-2 items-center">
                  <Icon icon="lucide:dumbbell" className="text-primary" />
                  <h3 className="text-lg font-semibold">Strength Training</h3>
                </div>
                <Button 
                  isIconOnly
                  variant="light" 
                  onPress={onOpen}
                  className="text-default-400"
                >
                  <Icon icon="lucide:settings" />
                </Button>
              </CardHeader>
              <CardBody className="gap-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Total Weight Lifted</span>
                      <span className="text-sm font-semibold">
                        {totalWeight.toLocaleString()} / {goals.weightGoal.toLocaleString()} kg
                      </span>
                    </div>
                    <Progress 
                      value={(totalWeight / goals.weightGoal) * 100} 
                      color="primary"
                      className="max-w-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:repeat" className="text-default-400" />
                      <div>
                        <p className="text-sm text-default-400">Total Sets</p>
                        <p className="font-semibold">{totalSets}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:timer" className="text-default-400" />
                      <div>
                        <p className="text-sm text-default-400">Total Reps</p>
                        <p className="font-semibold">{totalReps}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Exercise Statistics</h4>
                    {Object.entries(exerciseStats)
                      .filter(([_, stats]) => stats.lastWeight !== undefined)
                      .map(([exercise, stats]) => (
                        <div key={exercise} className="border rounded-lg p-3 mb-2">
                          <h5 className="font-medium mb-2">{exercise}</h5>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <p className="text-default-400">Last</p>
                              <p>{stats.lastWeight?.toLocaleString()} kg</p>
                            </div>
                            <div>
                              <p className="text-default-400">Max</p>
                              <p>{stats.maxWeight?.toLocaleString()} kg</p>
                            </div>
                            <div>
                              <p className="text-default-400">Average</p>
                              <p>{stats.avgWeight?.toFixed(1)} kg</p>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="flex gap-2 items-center justify-between">
                <div className="flex gap-2 items-center">
                  <Icon icon="lucide:heart-pulse" className="text-secondary" />
                  <h3 className="text-lg font-semibold">Cardio Training</h3>
                </div>
                <Button 
                  isIconOnly
                  variant="light" 
                  onPress={onOpen}
                  className="text-default-400"
                >
                  <Icon icon="lucide:settings" />
                </Button>
              </CardHeader>
              <CardBody className="gap-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Total Duration</span>
                      <span className="text-sm font-semibold">
                        {totalDuration} / {goals.durationGoal} min
                      </span>
                    </div>
                    <Progress 
                      value={(totalDuration / goals.durationGoal) * 100} 
                      color="secondary"
                      className="max-w-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:map" className="text-default-400" />
                      <div>
                        <p className="text-sm text-default-400">Total Distance</p>
                        <p className="font-semibold">{totalDistance.toFixed(1)} km</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:flame" className="text-default-400" />
                      <div>
                        <p className="text-sm text-default-400">Total Calories</p>
                        <p className="font-semibold">{totalCalories.toLocaleString()} cal</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Exercise Statistics</h4>
                    {Object.entries(exerciseStats)
                      .filter(([_, stats]) => stats.lastDuration !== undefined)
                      .map(([exercise, stats]) => (
                        <div key={exercise} className="border rounded-lg p-3 mb-2">
                          <h5 className="font-medium mb-2">{exercise}</h5>
                          <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                            <div>
                              <p className="text-default-400">Last Time</p>
                              <p>{stats.lastDuration} min</p>
                            </div>
                            <div>
                              <p className="text-default-400">Max Time</p>
                              <p>{stats.maxDuration} min</p>
                            </div>
                            <div>
                              <p className="text-default-400">Avg Time</p>
                              <p>{stats.avgDuration?.toFixed(1)} min</p>
                            </div>
                          </div>
                          {stats.lastCalories && (
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <div>
                                <p className="text-default-400">Last Cal</p>
                                <p>{stats.lastCalories}</p>
                              </div>
                              <div>
                                <p className="text-default-400">Max Cal</p>
                                <p>{stats.maxCalories}</p>
                              </div>
                              <div>
                                <p className="text-default-400">Avg Cal</p>
                                <p>{stats.avgCalories?.toFixed(1)}</p>
                              </div>
                            </div>
                          )}
                        </div>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </AccordionItem>
      </Accordion>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Set Training Goals</ModalHeader>
              <ModalBody>
                <Input
                  type="number"
                  label="Weight Goal (kg)"
                  placeholder="Enter target weight"
                  value={tempWeightGoal}
                  onValueChange={setTempWeightGoal}
                  startContent={<Icon icon="lucide:dumbbell" className="text-default-400" />}
                />
                <Input
                  type="number"
                  label="Duration Goal (minutes)"
                  placeholder="Enter target duration"
                  value={tempDurationGoal}
                  onValueChange={setTempDurationGoal}
                  startContent={<Icon icon="lucide:clock" className="text-default-400" />}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={() => {
                  handleSaveGoals();
                  onClose();
                }}>
                  Save Goals
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
