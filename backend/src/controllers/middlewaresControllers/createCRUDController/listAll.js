const listAll = async (Model, req, res) => {
  const sort = req.query.sort || 'desc';
  const rawEnabled = req.query.enabled;
  let enabled;
  if (rawEnabled === undefined || rawEnabled === '') {
    enabled = undefined;
  } else if (rawEnabled === true || rawEnabled === 'true' || rawEnabled === '1') {
    enabled = true;
  } else if (rawEnabled === false || rawEnabled === 'false' || rawEnabled === '0') {
    enabled = false;
  } else {
    enabled = rawEnabled;
  }

  //  Query the database for a list of all results

  let result;
  if (enabled === undefined) {
    result = await Model.find({
      removed: false,
    })
      .sort({ created: sort })
      .populate()
      .exec();
  } else {
    result = await Model.find({
      removed: false,
      enabled: enabled,
    })
      .sort({ created: sort })
      .populate()
      .exec();
  }

  if (result.length > 0) {
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully found all documents',
    });
  } else {
    return res.status(203).json({
      success: false,
      result: [],
      message: 'Collection is Empty',
    });
  }
};

module.exports = listAll;
