"use client";
import UpdateProfileModal from "@/components/modals/UpdateProfileModal";
import { Button } from "@/components/ui/button";
import { UserData } from "@/lib/types";
import { useState } from "react";

interface EditProfileButtonProps {
  user: UserData;
}

const EditProfileButton = ({ user }: EditProfileButtonProps) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setShowUpdateModal(true)}>
        Edit Profile
      </Button>
      <UpdateProfileModal
        onOpenChange={setShowUpdateModal}
        open={showUpdateModal}
        user={user}
      />
    </>
  );
};

export default EditProfileButton;
