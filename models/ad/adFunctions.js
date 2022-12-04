const Advertisement = require('./ad');

exports.find = (params) => {
  return new Promise((resolve, reject) => {
    const { shortText, description, userId, tags } = params;
    const result = Advertisement.find({
      shortText,
      description,
      userId,
      tags,
    }).select('-isDeleted=true');

    if (result) {
      resolve(result);
    } else {
      reject('not found');
    }
  });
};

exports.create = (data) => {
  return new Promise((resolve, reject) => {
    const {
      shortText,
      description,
      images,
      user,
      createdAt,
      updatedAt,
      tags,
    } = data;
    const newAd = new Advertisement({
      shortText,
      description,
      images,
      user,
      createdAt,
      updatedAt,
      tags,
    });

    if (newAd) {
      resolve(newAd);
    } else {
      reject('wrong data');
    }
  });
};

exports.remove = async (id) => {
  await Advertisement.findOneAndUpdate({ _id: id }, { isDeleted: true });
  const ad = await Advertisement.findById(id).select('-__v')
  return ad
};
