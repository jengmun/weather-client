import { cn } from "@/lib/utils";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const CustomButton = ({ className, children, ...props }: CustomButtonProps) => {
  return (
    <button
      className={cn(
        "bg-background dark:bg-transparent dark:border rounded-full p-2 w-10 h-10 flex justify-center items-center",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;
