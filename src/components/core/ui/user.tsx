import { userVariant } from "@/components/variants";
import { Avatar, Skeleton, type AvatarProps } from "@nextui-org/react";
import Link from "next/link";

type UserProps = {
  id?: string;
  name?: string | null;
  username?: string | null;
  description?: string | null;
  isLinked?: boolean;
  size?: "sm" | "md" | "lg";
  radius?: "sm" | "md" | "lg" | "full" | "none";
  avatarProps: AvatarProps;
};

function User({
  name,
  username,
  description,
  isLinked = true,
  size = "md",
  radius,
  avatarProps,
}: UserProps) {
  if (!isLinked) {
    return (
      <div className={userVariant.wrapper({ size })}>
        <Avatar
          {...avatarProps}
          size={size}
          radius={radius ?? size}
          showFallback
        />
        <div className="flex h-full flex-col justify-center overflow-hidden">
          {!name ? (
            <Skeleton
              className={userVariant.name.skeleton({ size, radius: size })}
              classNames={{
                base: "bg-transparent dark:bg-transparent",
              }}
            />
          ) : (
            <span className={userVariant.name.text({ size })}>{name}</span>
          )}
          {!username && !description ? (
            <Skeleton
              className={userVariant.username.skeleton({ size })}
              classNames={{
                base: ["bg-transparent dark:bg-transparent"],
              }}
            />
          ) : (
            <span className={userVariant.username.text({ size })}>
              {description ?? `@${username}`}
            </span>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className={userVariant.wrapper({ size })}>
      <Avatar
        as={Link}
        href={`/${username}`}
        {...avatarProps}
        size={size}
        radius={size}
        showFallback
      />
      <div className="flex h-full flex-col justify-center overflow-hidden">
        {!name ? (
          <Skeleton
            className={userVariant.name.skeleton({ size, radius: size })}
            classNames={{
              base: "bg-transparent dark:bg-transparent",
            }}
          />
        ) : (
          <Link
            href={`/${username}`}
            className={userVariant.name.text({ size })}
          >
            {name}
          </Link>
        )}
        {!username && !description ? (
          <Skeleton
            className={userVariant.username.skeleton({ size })}
            classNames={{
              base: ["bg-transparent dark:bg-transparent"],
            }}
          />
        ) : (
          <Link
            href={`/${username}`}
            className={userVariant.username.text({ size })}
          >
            {description ?? `@${username}`}
          </Link>
        )}
      </div>
    </div>
  );
}

export default User;
