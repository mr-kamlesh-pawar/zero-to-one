import React from "react";
import { courseData } from "@/data/courseData";

export function FeatureStrip() {
  const { features } = courseData;

  return (
    <div className="features">
      {features.map((feature, idx) => (
        <div key={idx} className="feat">
          <span className="feat-icon" aria-hidden="true">
            {feature.icon}
          </span>
          <strong>{feature.label}</strong>
        </div>
      ))}
    </div>
  );
}

export default FeatureStrip;
