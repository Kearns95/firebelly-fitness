import { cn } from "@/lib/utils";

function Label({ className, ...props }) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm font-semibold leading-none select-none",
        className
      )}
      {...props}
    />
  );
}

export { Label };
