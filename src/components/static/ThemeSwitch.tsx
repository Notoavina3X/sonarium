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
        "group aspect-square flex-1 items-center hover:bg-content2 dark:hover:bg-content1",
        "cursor-pointer gap-6 rounded-3xl border-2 border-default p-4",
        "data-[selected=true]:border-primary data-[selected=true]:bg-primary-50"
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
          icon="solar:sun-2-line-duotone"
          className="text-3xl text-foreground/60 group-data-[selected=true]:text-primary md:scale-150 md:transform md:text-6xl"
        />
      </ThemeRadio>
      <ThemeRadio value="dark">
        <Icon
          icon="solar:moon-stars-line-duotone"
          className="text-3xl text-foreground/60 group-data-[selected=true]:text-primary md:scale-150 md:transform md:text-6xl"
        />
      </ThemeRadio>
      <ThemeRadio value="system">
        <Icon
          icon="solar:monitor-smartphone-line-duotone"
          className="text-3xl text-foreground/60 group-data-[selected=true]:text-primary md:scale-150 md:transform md:text-6xl"
        />
      </ThemeRadio>
    </RadioGroup>
  );
}
