import React from "react";
import Loading from "../Pages/Loading";
import Error from "../Pages/Error";

const DataWrapper = ({ loading, error, children }) => {
  if (loading) return <Loading />;
  if (error) return <Error />;

  return children;
};

export default DataWrapper;
