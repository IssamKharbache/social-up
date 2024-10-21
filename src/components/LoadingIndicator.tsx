import { HashLoader } from "react-spinners";

const LoadingIndicator = () => {
  return (
    <HashLoader
      color="#b87de3"
      className="fixed bottom-0 left-0 right-0 top-0 z-[999] m-auto h-[2em] w-[2em]"
    />
  );
};

export default LoadingIndicator;
