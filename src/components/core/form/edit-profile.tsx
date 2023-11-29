import { compressFile } from "@/lib/compressImage";
import { isEditingAtom } from "@/store";
import { api } from "@/utils/api";
import { Icon } from "@iconify/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Avatar,
  ModalFooter,
  Button,
  Input,
  Badge,
} from "@nextui-org/react";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useEffect, useState, type ChangeEvent } from "react";
import { toast } from "sonner";

function EditProfile() {
  const { data: sessionData } = useSession();

  const [userInfo, setUserInfo] = useState({
    name: sessionData?.user.name,
    username: sessionData?.user.username,
  });
  const [file, setFile] = useState<string | null>(null);
  const [userImage, setUserImage] = useState(sessionData?.user.image);
  const [isChanged, setIsChanged] = useState<boolean>(false);

  const [isEditing, setIsEditing] = useAtom(isEditingAtom);

  const updateProfile = api.profile.update.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully");
      onModalOpenChange();
    },
  });

  useEffect(() => {
    setIsChanged(
      userInfo?.name !== sessionData?.user.name ||
        userInfo?.username !== sessionData?.user.username ||
        userImage !== sessionData?.user.image
    );
  }, [userInfo, userImage, sessionData]);

  const handleChooseFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setUserImage(URL.createObjectURL(selectedFile));
      const compressedFile = await compressFile(selectedFile, 0.7);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);

      reader.onload = () => {
        if (typeof reader.result === "string") {
          setFile(reader.result);
        }
      };
    }
  };

  const handleInputChange = (value: string, property: string) => {
    setUserInfo((prev) => ({ ...prev, [property]: value }));
  };

  const handleSubmit = () => {
    if (isChanged) {
      updateProfile.mutate({
        name: userInfo.name,
        username: userInfo.username,
        image: file ?? null,
      });
    }
  };

  const onModalOpenChange = () => {
    setIsEditing(!isEditing);
    setUserInfo({
      name: sessionData?.user.name,
      username: sessionData?.user.username,
    });
    setUserImage(sessionData?.user.image);
    setFile(null);
    setIsChanged(false);
  };

  return (
    <Modal
      isOpen={isEditing}
      onOpenChange={onModalOpenChange}
      placement="auto"
      size="sm"
      classNames={{ base: "bg-content3 dark:bg-content1" }}
    >
      <ModalContent>
        <ModalHeader>Edit your profile</ModalHeader>
        <ModalBody>
          <div className="self-center">
            <Badge
              content={
                <label>
                  <Icon
                    icon="solar:gallery-edit-linear"
                    className="aspect-square h-7 cursor-pointer text-lg"
                  />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      void handleChooseFile(e)
                    }
                  />
                </label>
              }
              placement="bottom-right"
              shape="circle"
            >
              <Avatar
                className="h-28 w-28"
                size="lg"
                classNames={{ name: "text-2xl" }}
                name={userInfo?.name ?? undefined}
                src={userImage ?? undefined}
              />
            </Badge>
          </div>
          <div className="flex w-9/12 flex-col items-end gap-3 self-center">
            <Input
              label="Name"
              value={userInfo?.name ?? undefined}
              onValueChange={(value: string) =>
                void handleInputChange(value, "name")
              }
              startContent={
                <Icon icon="solar:user-circle-bold" className="text-lg" />
              }
            />
            <Input
              label="Username"
              value={userInfo?.username ?? undefined}
              onValueChange={(value: string) =>
                void handleInputChange(value, "username")
              }
              startContent={
                <Icon icon="solar:mention-circle-bold" className="text-lg" />
              }
            />
            <Input label="Bio" isDisabled />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button size="sm" className="font-bold" onPress={onModalOpenChange}>
            Cancel
          </Button>
          <Button
            size="sm"
            color="primary"
            className="font-bold"
            isDisabled={!isChanged}
            onPress={() => void handleSubmit()}
            isLoading={updateProfile.isLoading}
          >
            Save changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditProfile;
