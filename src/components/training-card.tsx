import React from "react";
import { Card, CardBody, CardFooter, Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { TrainingRecord } from "../types/training";

interface TrainingCardProps {
  record: TrainingRecord;
  onDelete: (id: string) => void;
}

export const TrainingCard: React.FC<TrainingCardProps> = ({
  record,
  onDelete,
}) => {
  const formattedDate = new Date(record.date).toLocaleDateString();

  const getTypeColor = (type: string) => {
    switch (type) {
      case "strength":
        return "primary";
      case "calisthenics":
        return "success";
      case "cardio":
        return "secondary";
      default:
        return "default";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "strength":
        return "lucide:dumbbell";
      case "calisthenics":
        return "lucide:user";
      case "cardio":
        return "lucide:heart-pulse";
      default:
        return "lucide:activity";
    }
  };

  return (
    <Card className="w-full cursor-pointer" isPressable>
      <CardBody className="gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{record.exercise}</h3>
            <Chip
              size="sm"
              color={getTypeColor(record.type)}
              startContent={
                <Icon
                  icon={getTypeIcon(record.type)}
                  className="text-current"
                />
              }
            >
              {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
            </Chip>
          </div>
          <span className="text-default-400 text-sm">{formattedDate}</span>
        </div>
        <div className="flex gap-4 mt-2">
          {record.type === "strength" || record.type === "calisthenics" ? (
            <>
              <div className="flex items-center gap-1">
                <Icon icon="lucide:repeat" className="text-default-400" />
                <span>{record.sets} sets</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon icon="lucide:timer" className="text-default-400" />
                <span>{record.reps} reps</span>
              </div>
              {record.type === "strength" ? (
                <div className="flex items-center gap-1">
                  <Icon icon="lucide:weight" className="text-default-400" />
                  <span>{record.weight} kg</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Icon icon="lucide:user" className="text-default-400" />
                  <span>{record.bodyWeight} kg</span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-1">
                <Icon icon="lucide:clock" className="text-default-400" />
                <span>{record.duration} min</span>
              </div>
              {record.distance && (
                <div className="flex items-center gap-1">
                  <Icon icon="lucide:map" className="text-default-400" />
                  <span>{record.distance} km</span>
                </div>
              )}
              {record.caloriesBurned && (
                <div className="flex items-center gap-1">
                  <Icon icon="lucide:flame" className="text-default-400" />
                  <span>{record.caloriesBurned} cal</span>
                </div>
              )}
            </>
          )}
        </div>
      </CardBody>
      <CardFooter>
        <Button
          color="danger"
          variant="flat"
          size="sm"
          onPress={() => onDelete(record.id)}
          startContent={<Icon icon="lucide:trash-2" />}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
