import React from "react";
import {
  RadioGroup,
  useRadio,
  VisuallyHidden,
  type RadioProps,
  cn,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import { Icon } from "@iconify/react";

export const ThemeRadio = (props: RadioProps) => {
  const {
    Component,
    children,
    getBaseProps,
    getInputProps,
    getLabelWrapperProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "group aspect-square flex-1 items-center",
        "cursor-pointer gap-6 rounded-3xl bg-primary/20 p-4",
        "data-[selected=true]:bg-transparent"
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...getLabelWrapperProps()}
        className="grid h-full place-items-center"
      >
        {children}
      </div>
    </Component>
  );
};

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <RadioGroup
      defaultValue={theme}
      orientation="horizontal"
      onValueChange={setTheme}
      className="w-full max-w-3xl gap-2"
    >
      <ThemeRadio value="light">
        <Icon
          icon="solar:sun-2-linear"
          className="text-3xl text-primary group-data-[selected=true]:text-foreground/60 md:scale-150 md:transform md:text-6xl"
        />
      </ThemeRadio>
      <ThemeRadio value="dark">
        <Icon
          icon="solar:moon-stars-linear"
          className="text-3xl text-primary group-data-[selected=true]:text-foreground/60 md:scale-150 md:transform md:text-6xl"
        />
      </ThemeRadio>
      <ThemeRadio value="system">
        <Icon
          icon="solar:monitor-smartphone-linear"
          className="text-3xl text-primary group-data-[selected=true]:text-foreground/60 md:scale-150 md:transform md:text-6xl"
        />
      </ThemeRadio>
    </RadioGroup>
  );
}
