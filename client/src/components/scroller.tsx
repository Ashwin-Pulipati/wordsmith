"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "./ui/button";

const SCROLL_THRESHOLD = 50;

const Scroller = () => {
  const [isAtTop, setIsAtTop] = useState(true);
  
  const updateScrollPosition = useCallback(() => {
    setIsAtTop(window.scrollY < SCROLL_THRESHOLD);
  }, []);
  
  const scrollTo = useCallback((position: number) => {
    window.scrollTo({ top: position, behavior: "smooth" });
  }, []);

  const handleClick = () => {
    if (isAtTop) {
      scrollTo(document.documentElement.scrollHeight);
    } else {
      scrollTo(0);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", updateScrollPosition);
    updateScrollPosition();
    return () => window.removeEventListener("scroll", updateScrollPosition);
  }, [updateScrollPosition]);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Button
        variant="gradient"
        size="icon-lg"
        onClick={handleClick}
        className="rounded-full h-12 w-12 shadow-lg"
        aria-label={isAtTop ? "Scroll to bottom" : "Scroll to top"}
      >
        {isAtTop ? (
          <ArrowDown className="h-6 w-6" />
        ) : (
          <ArrowUp className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export default Scroller;
