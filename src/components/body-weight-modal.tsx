import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { UserSettings } from "../types/training";

interface BodyWeightModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSave: (weight: number) => void;
  currentSettings?: UserSettings;
}

export const BodyWeightModal: React.FC<BodyWeightModalProps> = ({
  isOpen,
  onOpenChange,
  onSave,
  currentSettings,
}) => {
  const [weight, setWeight] = React.useState(currentSettings?.bodyWeight?.toString() || "");

  const handleSave = () => {
    const weightNum = Number(weight);
    if (weightNum > 0) {
      onSave(weightNum);
      onOpenChange();
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Update Body Weight</ModalHeader>
            <ModalBody>
              <Input
                type="number"
                label="Body Weight (kg)"
                placeholder="Enter your body weight"
                value={weight}
                onValueChange={setWeight}
                startContent={<Icon icon="lucide:weight" className="text-default-400" />}
              />
              {currentSettings && (
                <p className="text-sm text-default-400">
                  Last updated: {new Date(currentSettings.lastUpdated).toLocaleDateString()}
                </p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSave}>
                Save Weight
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
