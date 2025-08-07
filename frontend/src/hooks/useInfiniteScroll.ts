import { useCallback, useEffect, useState } from "react";

interface UseInfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export const useInfiniteScroll = ({ 
  hasMore, 
  isLoading, 
  onLoadMore, 
  threshold = 100 
}: UseInfiniteScrollProps) => {
  const [isNearBottom, setIsNearBottom] = useState(false);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    const isNear = scrollTop + windowHeight >= documentHeight - threshold;

    if (isNear && !isLoading && hasMore) {
      onLoadMore();
    }

    setIsNearBottom(isNear);
  }, [isLoading, hasMore, onLoadMore, threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { isNearBottom };
};