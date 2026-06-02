const summary = async (Model, req, res) => {
  const countAllDocs = await Model.countDocuments({ removed: false });

  const { filter, equal } = req.query;
  const filterKey =
    filter != null && typeof filter === 'string' && String(filter).trim() !== '' ? filter : null;
  const hasEqual = equal !== undefined && equal !== null && equal !== '';

  let countFilter = countAllDocs;
  if (filterKey && hasEqual) {
    countFilter = await Model.countDocuments({
      removed: false,
      [filterKey]: equal,
    });
  }

  if (countAllDocs > 0) {
    return res.status(200).json({
      success: true,
      result: { countFilter, countAllDocs },
      message: 'Successfully count all documents',
    });
  } else {
    return res.status(203).json({
      success: false,
      result: [],
      message: 'Collection is Empty',
    });
  }
};

module.exports = summary;
