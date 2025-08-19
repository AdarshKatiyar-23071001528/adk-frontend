import React from "react";
import "../Components/User/User.css";
const bubbles = [
  { size: 50, position: { left: 50 }, delay: 0, color: "bg-blue-300" },
  { size: 60, position: { left: 120 }, delay: 1, color: "bg-purple-300" },
  { size: 40, position: { left: 200 }, delay: 2, color: "bg-green-300" },
  { size: 100, position: { left: 300 }, delay: 2, color: "bg-green-300" },
  { size: 50, position: { right: 50 }, delay: 3, color: "bg-pink-300" },
  { size: 70, position: { right: 120 }, delay: 4, color: "bg-yellow-300" },
  { size: 60, position: { right: 200 }, delay: 5, color: "bg-cyan-300" },
  { size: 50, position: { left: 70 }, delay: 0, color: "bg-blue-300" },
  { size: 60, position: { left: 170 }, delay: 8, color: "bg-purple-300" },
  { size: 40, position: { left: 250 }, delay: 6, color: "bg-green-300" },
  { size: 50, position: { right: 70 }, delay: 7, color: "bg-pink-300" },
  { size: 70, position: { right: 170 }, delay: 4, color: "bg-yellow-300" },
  { size: 60, position: { right: 250 }, delay: 6, color: "bg-cyan-300" },
  { size: 50, position: { left: 100 }, delay: 0, color: "bg-blue-300" },
  { size: 60, position: { left: 240 }, delay: 3, color: "bg-purple-300" },
  { size: 40, position: { left: 300 }, delay: 7, color: "bg-green-300" },
  { size: 50, position: { right: 100 }, delay: 10, color: "bg-pink-300" },
  { size: 70, position: { right: 240 }, delay: 2, color: "bg-yellow-300" },
  { size: 60, position: { right: 300 }, delay: 5, color: "bg-cyan-300" },
];

const Bubble = () => {
  return (
    <>
      {" "}
      {/* 🔵 Dynamic Bubbles */}
      {bubbles.map((bubble, index) => {
        const { size, position, delay, color } = bubble;

        const style = {
          animationDelay: `${delay}s`,
          bottom: "-100px",
          height: `${size}px`,
          width: `${size}px`,
          ...(position.left !== undefined
            ? { left: `${position.left}px` }
            : { right: `${position.right}px` }),
        };

        return (
          <div 
            key={index}
            className={`${color} absolute border glow-bubble animate-rise-rotate `}
            style={style}
          ></div>
        );
      })}
    </>
  );
};

export default Bubble;
