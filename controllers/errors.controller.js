exports.handlesHomeMadeErrors = (err, req, res, next) => {
  
  if (err.code === "22P02") {
    res.status(404).send({ msg: "Bad review_id" });
  } else if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handles500errors = (err, req, res, next) => {
  res.status(500).send({ msg: "Server Error" });
};
