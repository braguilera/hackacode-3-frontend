import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { ScrollArea } from "../ui/ScrollArea";

const TreeContext = createContext(null);

const useTree = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error("useTree must be used within a TreeProvider");
  }
  return context;
};

const Tree = forwardRef(
  (
    {
      className,
      elements,
      initialSelectedId,
      initialExpandedItems,
      children,
      indicator = true,
      openIcon,
      closeIcon,
      dir,
      ...props
    },
    ref
  ) => {
    const [selectedId, setSelectedId] = useState(initialSelectedId);
    const [expandedItems, setExpandedItems] = useState(initialExpandedItems);

    const selectItem = useCallback((id) => {
      setSelectedId(id);
    }, []);

    const handleExpand = useCallback((id) => {
      setExpandedItems((prev) => {
        if (prev?.includes(id)) {
          return prev.filter((item) => item !== id);
        }
        return [...(prev ?? []), id];
      });
    }, []);

    const expandSpecificTargetedElements = useCallback(
      (elements, selectId) => {
        if (!elements || !selectId) return;
        const findParent = (currentElement, currentPath = []) => {
          const isSelectable = currentElement.isSelectable ?? true;
          const newPath = [...currentPath, currentElement.id];
          if (currentElement.id === selectId) {
            if (isSelectable) {
              setExpandedItems((prev) => [...(prev ?? []), ...newPath]);
            } else {
              if (newPath.includes(currentElement.id)) {
                newPath.pop();
                setExpandedItems((prev) => [...(prev ?? []), ...newPath]);
              }
            }
            return;
          }
          if (
            isSelectable &&
            currentElement.children &&
            currentElement.children.length > 0
          ) {
            currentElement.children.forEach((child) => {
              findParent(child, newPath);
            });
          }
        };
        elements.forEach((element) => {
          findParent(element);
        });
      },
      []
    );

    useEffect(() => {
      if (initialSelectedId) {
        expandSpecificTargetedElements(elements, initialSelectedId);
      }
    }, [initialSelectedId, elements]);

    const direction = dir === "rtl" ? "rtl" : "ltr";

    return (
      <TreeContext.Provider
        value={{
          selectedId,
          expandedItems,
          handleExpand,
          selectItem,
          setExpandedItems,
          indicator,
          openIcon,
          closeIcon,
          direction,
        }}
      >
        <div className={cn("size-full", className)}>
          <ScrollArea
            ref={ref}
            className="h-full relative px-2 "
            dir={dir}
          >
            <AccordionPrimitive.Root
              {...props}
              type="multiple"
              defaultValue={expandedItems}
              value={expandedItems}
              className="flex flex-col gap-1 "
              onValueChange={(value) =>
                setExpandedItems((prev) => [...(prev ?? []), value[0]])
              }
              dir={dir}
            >
              {children}
            </AccordionPrimitive.Root>
          </ScrollArea>
        </div>
      </TreeContext.Provider>
    );
  }
);

Tree.displayName = "Tree";

const TreeIndicator = forwardRef(({ className, ...props }, ref) => {
  const { direction } = useTree();

  return (
    <div
      dir={direction}
      ref={ref}
      className={cn(
        "h-full w-px bg-muted absolute left-1.5 rtl:right-1.5 dark:bg-gray-700 py-3 rounded-md  ",
        className
      )}
      {...props}
    />
  );
});

TreeIndicator.displayName = "TreeIndicator";

const Folder = forwardRef(
  (
    { className, element, value, isSelectable = true, isSelect, children, ...props },
    ref
  ) => {
    const {
      direction,
      handleExpand,
      expandedItems,
      indicator,
      setExpandedItems,
      openIcon,
      closeIcon,
    } = useTree();

    return (
      <AccordionPrimitive.Item
        {...props}
        value={value}
        className="relative overflow-hidden h-full"
      >
        <AccordionPrimitive.Trigger
          className={cn(
            `flex items-center gap-1 text-sm rounded-md  `,
            className,
            {
              "bg-muted rounded-md ": isSelect && isSelectable,
              "cursor-pointer ": isSelectable,
              "cursor-not-allowed opacity-50 ": !isSelectable,
            }
          )}
          disabled={!isSelectable}
          onClick={() => handleExpand(value)}
        >
          {expandedItems?.includes(value)
            ? openIcon ?? <FolderOpenIcon className="size-4 dark:stroke-white" />
            : closeIcon ?? <FolderIcon className="size-4 dark:stroke-white" />}
          <span>{element}</span>
        </AccordionPrimitive.Trigger>
        <AccordionPrimitive.Content className="text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down relative overflow-hidden h-full ">
          {element && indicator && <TreeIndicator aria-hidden="true" />}
          <AccordionPrimitive.Root
            dir={direction}
            type="multiple"
            className="flex flex-col gap-1 py-1 ml-5 rtl:mr-5 "
            defaultValue={expandedItems}
            value={expandedItems}
            onValueChange={(value) => {
              setExpandedItems?.((prev) => [...(prev ?? []), value[0]]);
            }}
          >
            {children}
          </AccordionPrimitive.Root>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    );
  }
);

Folder.displayName = "Folder";

const File = forwardRef(
  (
    {
      value,
      className,
      handleSelect,
      isSelectable = true,
      isSelect,
      fileIcon,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const { direction, selectedId, selectItem } = useTree();
    const isSelected = isSelect ?? selectedId === value;

    return (
      <AccordionPrimitive.Item value={value} className="relative ">
        <AccordionPrimitive.Trigger
          ref={ref}
          {...props}
          dir={direction}
          disabled={!isSelectable}
          aria-label="File"
          className={cn(
            "flex items-center gap-1 cursor-pointer text-sm pr-1 rtl:pl-1 rtl:pr-0 rounded-md px-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300  ",
            {
              "bg-muted bg-gray-100 dark:bg-gray-800": isSelected && isSelectable,
            },
            isSelectable ? "cursor-pointer" : "opacity-50 cursor-not-allowed",
            className
          )}
          onClick={(e) => {
            selectItem(value);
            if (onClick) {
              e.stopPropagation();
              onClick(e);
            }
          }}
        >
          {fileIcon ?? <FileIcon className="size-4 dark:stroke-white" />}
          {children}
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Item>
    );
  }
);


File.displayName = "File";

export { Tree, TreeIndicator, Folder, File };
