import { deleteAtom } from "@/store";
import { api } from "@/utils/api";
import { Icon } from "@iconify/react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useAtom } from "jotai";
import { toast } from "sonner";

function ConfirmPopup() {
  const [deleting, setDeleting] = useAtom(deleteAtom);

  const deletePost = api.post.delete.useMutation({
    onSuccess: ({ isDeleted }) => {
      if (isDeleted) toast.success("Post deleted successfully");
    },
    onError: () => toast.error("Error while deleting!"),
  });

  const deleteComment = api.comment.delete.useMutation({
    onSuccess: ({ isDeleted }) => {
      if (isDeleted) toast.success("Comment deleted successfully");
    },
    onError: () => toast.error("Error while deleting!"),
  });

  const onModalOpenChange = () =>
    setDeleting((data) => ({ ...data, isDeleting: !data.isDeleting }));

  const handleDelete = () => {
    if (deleting?.instance) {
      deleting.type == "post"
        ? deletePost.mutate({ id: deleting.instance.id })
        : deleteComment.mutate({ id: deleting.instance.id });
    }
  };

  const handleCancel = () =>
    setDeleting({ type: undefined, instance: undefined, isDeleting: false });

  return (
    <Modal
      isOpen={deleting.isDeleting && !!deleting.instance && !!deleting.type}
      onOpenChange={onModalOpenChange}
      size="sm"
      placement="auto"
      classNames={{
        base: "bg-content3 dark:bg-content1",
        closeButton: "hidden",
      }}
    >
      <ModalContent>
        <ModalHeader>
          <Icon
            icon="solar:compass-linear"
            className="w-full text-center text-5xl text-danger"
          />
        </ModalHeader>
        <ModalBody>
          <div className="flex w-full flex-col items-center">
            <span className="font-semibold text-danger">
              Irreversible action
            </span>
            <h1 className="text-xl font-bold">Are you sure to delete it?</h1>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex w-full justify-center gap-4">
            <Button variant="flat" color="danger" onPress={handleDelete}>
              Yeah, sure!
            </Button>
            <Button onPress={handleCancel}>No, cancel it</Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ConfirmPopup;
