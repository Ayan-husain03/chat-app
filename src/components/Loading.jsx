import React from "react";
import { MutatingDots } from "react-loader-spinner";

const Loading = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <MutatingDots
        visible={true}
        height="100"
        width="100"
        color="#074799"
        secondaryColor="#074799"
        radius="15.5"
      />
    </div>
  );
};

export default Loading;
