import React from "react";
import SkeletonItem from "./SkeletonItem";

interface SkeletonListProps {
  itemCount?: number;
  showLevelBadge?: boolean;
}

const SkeletonList = ({ itemCount = 6, showLevelBadge = false }: SkeletonListProps) => (
  <>
    {Array.from({ length: itemCount }).map((_, index) => (
      <SkeletonItem key={index} showLevelBadge={showLevelBadge} />
    ))}
  </>
);

export default SkeletonList;