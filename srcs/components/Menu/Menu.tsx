"use client";
import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  useState,
} from "react";

type MenuButtonProps = {
  trigger: ReactElement<TriggerProps>;
  children: React.ReactNode;
};
type MenuItemProps = {
  className?: string;
};

type TriggerProps = {
  onClick?: () => void;
};

export default function MenuButton({ trigger, children }: MenuButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolut flex flex-col items-end corner-right"
      // onMouseEnter={() => setOpen(true)}
      // onMouseLeave={() => setOpen(false)}
    >
      {cloneElement(trigger, {
        ...trigger.props,
        onClick: () => setOpen((prev) => !prev),
      })}

      {open && (
          <div className="bg-(--white) rounded-b-lg rounded-s-lg outline-(--light) outline-1 overflow-hidden">
          {Children.map(children, (child) => {
            if (!isValidElement<MenuItemProps>(child)) return child;

            return cloneElement(child, {
              ...child.props,
              className: `w-full button hover:bg-(--light)/80 cursor-default ${child.props.className ?? ""}`,
            });
          })}
        </div>
      )}
    </div>
  );
}