"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

/** Props de wrapper que sustituyen el `className` (string | callback) de Base UI por un string simple. */
type WithClassName<T> = Omit<T, "className"> & { className?: string };

function Dialog(props: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root {...props} />;
}

function DialogTrigger({
  className,
  ...props
}: WithClassName<DialogPrimitive.Trigger.Props>) {
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      className={className}
      {...props}
    />
  );
}

function DialogClose(props: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogTitle({
  className,
  ...props
}: WithClassName<DialogPrimitive.Title.Props>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-2xl font-bold text-brand", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: WithClassName<DialogPrimitive.Description.Props>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("leading-relaxed text-surface-muted", className)}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showClose = true,
  ...props
}: WithClassName<DialogPrimitive.Popup.Props> & { showClose?: boolean }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop
        data-slot="dialog-backdrop"
        className="fixed inset-0 z-40 bg-very-dark/70 backdrop-blur-sm transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0"
      />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-3xl max-h-[88vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-surface text-surface-fg shadow-2xl outline-none",
          "transition-all duration-300 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
          className,
        )}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close
            aria-label="Cerrar"
            className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-surface-2 text-surface-fg transition-colors hover:bg-app-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <X className="size-5" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogDescription,
};
