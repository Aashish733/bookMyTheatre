import { useLayoutEffect } from "react";

const APP_NAME = "Book My Theatre";

export function useDocumentTitle(title) {
  useLayoutEffect(() => {
    if (!title) return;
    document.title = `${title} | ${APP_NAME}`;
  }, [title]);
}
