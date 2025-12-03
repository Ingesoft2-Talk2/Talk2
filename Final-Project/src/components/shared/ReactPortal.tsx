/*
 * This file defines the ReactPortal component.
 * It creates a portal to render children into a DOM node that exists outside the DOM hierarchy of the parent component.
 */

import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Helper function to create a wrapper element and append it to the body.
 *
 * @param wrapperId - The ID for the wrapper element.
 * @returns The created HTML element.
 */
const createWrapperAndAppendToBody = (wrapperId: string) => {
  if (!document) return null;
  const wrapperElement = document.createElement("div");
  wrapperElement.setAttribute("id", wrapperId);
  document.body.appendChild(wrapperElement);
  return wrapperElement;
};

type ReactPortalProps = {
  children: React.ReactElement;
  wrapperId: string;
};

/**
 * Component that renders its children into a portal.
 * Useful for modals, tooltips, and other overlays.
 *
 * @param props - The properties for the portal.
 */
export default function ReactPortal({ children, wrapperId }: ReactPortalProps) {
  const [wrapperElement, setWrapperElement] = useState<HTMLElement>();

  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId);
    let systemCreated = false;

    if (!element) {
      systemCreated = true;
      element = createWrapperAndAppendToBody(wrapperId);
    }

    if (element) {
      setWrapperElement(element);
    }

    return () => {
      if (systemCreated && element?.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);

  if (!wrapperElement) return null;

  return createPortal(children, wrapperElement);
}
