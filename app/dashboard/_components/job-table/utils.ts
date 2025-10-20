"use client";

import * as React from "react";

function useTransientFlag(duration = 2000) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (!isVisible) {
      return;
    }

    const timeout = window.setTimeout(() => setIsVisible(false), duration);
    return () => window.clearTimeout(timeout);
  }, [isVisible, duration]);

  const show = React.useCallback(() => setIsVisible(true), []);
  const hide = React.useCallback(() => setIsVisible(false), []);

  return {
    isVisible,
    show,
    hide,
  };
}

function toDateInputValue(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offsetMinutes = date.getTimezoneOffset();
  const localTime = new Date(date.getTime() - offsetMinutes * 60 * 1000);
  return localTime.toISOString().slice(0, 16);
}

function fromDateInputValue(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function getNowInputValue() {
  return toDateInputValue(new Date().toISOString());
}

export { fromDateInputValue, getNowInputValue, toDateInputValue, useTransientFlag };
