"use client";
import React from "react";

import { Button } from "./ui/button";
import { useUser } from "@/app/context/UserProvider";
import SearchModal from "./modals/SearchModal";

const MobileSearch = () => {
  const { setOpenSearchModal, openSearchModal } = useUser();
  return (
    <>
      <Button
        onClick={() => setOpenSearchModal(true)}
        variant="default"
        className="rounded-full"
      >
        Search
      </Button>
      {openSearchModal && (
        <SearchModal
          open={openSearchModal}
          onClose={() => setOpenSearchModal(false)}
        />
      )}
    </>
  );
};

export default MobileSearch;
