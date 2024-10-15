import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeletonFollowSugg = () => {
  return (
    <div className="flex flex-col space-y-5">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeletonFollowSugg;
