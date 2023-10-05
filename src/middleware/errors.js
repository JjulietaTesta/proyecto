import Eerrors from "../services/errors/enum.js";

export default (error, req, res, next) => {
    console.log(error);
    switch (error.code) {
      case Eerrors.INVALID_TYPES_ERROR:
        res.send({
          status: "error",
          error: error.name,
        });
        break;
      case Eerrors.DATABASE_ERROR:
        res.send({
          status: "error",
          error: error.name,
        });
        break;
      case Eerrors.ROUTING_ERROR:
        res.send({
          status: "error",
          error: error.name,
        });
        break;
      default:
        res.send({
          status: "error",
          error: "unhandled error",
        });
        break;
    }
  };