import { SearchCodeIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useUser } from "@/app/context/UserProvider";
import { DialogTitle } from "@radix-ui/react-dialog";
interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const SearchModal = ({ open, onClose }: SearchModalProps) => {
  const router = useRouter();
  const { setOpenSearchModal } = useUser();
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //get the query value
    const form = e.currentTarget;
    const query = (form.query as HTMLInputElement).value.trim();
    //check if query is undefined
    if (!query) {
      console.log("no query");

      return;
    }
    //push to the search page
    router.push(`/search?query=${encodeURIComponent(query)}`);
    setOpenSearchModal(false);
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <form
          className="flex items-center gap-2"
          onSubmit={handleSubmit}
          method="GET"
          action="/search"
        >
          <div className="relative">
            <Input
              name="query"
              placeholder="Search name , post..."
              className="rounded-full pe-10"
            />
            <SearchCodeIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
          </div>
          <Button type="submit" className="rounded-full">
            Search
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
