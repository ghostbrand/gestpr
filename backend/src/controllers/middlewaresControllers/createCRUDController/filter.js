const filter = async (Model, req, res) => {
  const filterKey = req.query.filter;
  const equalVal = req.query.equal;
  if (
    filterKey === undefined ||
    equalVal === undefined ||
    typeof filterKey !== 'string' ||
    String(filterKey).trim() === ''
  ) {
    return res.status(403).json({
      success: false,
      result: null,
      message: 'filter not provided correctly',
    });
  }
  const result = await Model.find({
    removed: false,
  })
    .where(filterKey)
    .equals(equalVal)
    .exec();
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found ',
    });
  } else {
    // Return success resposne
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully found all documents  ',
    });
  }
};

module.exports = filter;
