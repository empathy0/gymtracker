import { TrainingForm } from "./components/training-form";
import { TrainingCard } from "./components/training-card";
import { TrainingMetrics } from "./components/training-metrics";
import FeedbackButton from "./components/FeedbackButton";
import { TrainingRecord } from "./types/training";
import { useLocalStorage } from "./hooks/use-local-storage";
import { addToast } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function App() {
  const [records, setRecords] = useLocalStorage<TrainingRecord[]>(
    "training-records",
    []
  );

  const handleAddRecord = (newRecord: Omit<TrainingRecord, "id">) => {
    const recordWithId = {
      ...newRecord,
      id: crypto.randomUUID(),
    };
    setRecords((prev) => [recordWithId, ...prev]);

    addToast({
      title: "Record Added",
      description: "Your training record has been saved",
      color: "success",
      icon: <Icon icon="lucide:check" />,
    });
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((record) => record.id !== id));

    addToast({
      title: "Record Deleted",
      description: "Your training record has been removed",
      color: "danger",
      icon: <Icon icon="lucide:trash-2" />,
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-center mb-8">
          Gym Training Tracker
        </h1>
        <TrainingForm onSubmit={handleAddRecord} />
        <TrainingMetrics records={records} />
        <div className="grid gap-4 sm:grid-cols-2">
          {records.map((record) => (
            <TrainingCard
              key={record.id}
              record={record}
              onDelete={handleDeleteRecord}
            />
          ))}
        </div>
        <FeedbackButton />
      </div>
    </div>
  );
}
