import { tv } from "@nextui-org/react";

export const loader = tv({
  base: "aspect-square ps-[2px]",
  variants: {
    color: {
      primary: "text-primary",
      default: "text-foreground-300",
    },
    size: {
      sm: "h-3.5",
      md: "h-5",
      lg: "h-7",
    },
  },
});

export const trackSelectedIcon = tv({
  base: "text-[40px]",
  variants: {
    color: {
      spotify: "text-green-600",
      youtube: "text-red-700",
    },
  },
});

export const userVariant = {
  wrapper: tv({
    base: "grid grow gap-2",
    variants: {
      size: {
        sm: "grid-cols-[32px_auto]",
        md: "grid-cols-[40px_auto]",
        lg: "grid-cols-[56px_auto]",
      },
    },
  }),
  avatar: tv({
    base: "aspect-square w-full",
    variants: {
      radius: {
        sm: "rounded-lg",
        md: "rounded-xl",
        lg: "rounded-2xl",
      },
    },
  }),
  name: {
    skeleton: tv({
      base: "w-28 my-1",
      variants: {
        radius: {
          sm: "rounded-sm",
          md: "rounded-md",
          lg: "rounded-lg",
        },
        size: {
          sm: "h-3",
          md: "h-4",
          lg: "h-6",
        },
      },
    }),
    text: tv({
      base: "flex-none truncate font-bold",
      variants: {
        size: {
          sm: "text-xs",
          md: "text-sm",
          lg: "text-lg",
        },
      },
    }),
  },
  username: {
    skeleton: tv({
      base: "w-20 rounded-md",
      variants: {
        size: {
          sm: "h-2",
          md: "h-3",
          lg: "my-1 h-4",
        },
      },
    }),
    text: tv({
      base: "flex-none truncate opacity-70",
      variants: {
        size: {
          sm: "text-[10px]",
          md: "text-xs",
          lg: "text-sm",
        },
      },
    }),
  },
};
