const yapi = require('../yapi.js');
const baseModel = require('./base.js');

/**
 * 接口分类
 */
class interfaceCat extends baseModel {
  getName() {
    return 'interface_cat';
  }

  getSchema() {
    return {
      name: { type: String, required: true },
      uid: { type: Number, required: true },
      project_id: { type: Number, required: true },
      parent_id: { type: Number, required: false, default: 0 },
      desc: String,
      add_time: Number,
      up_time: Number,
      index: { type: Number, default: 0 }
    };
  }

  save(data) {
    let m = new this.model(data);
    return m.save();
  }

  get(id) {
    return this.model
      .findOne({
        _id: id
      })
      .exec();
  }

  //查询catid的子文件夹
  getChildByid(id) {
    return this.model
      .find({
        parent_id: id
      })
      .exec();
  }



  checkRepeat(name) {
    return this.model.countDocuments({
      name: name
    });
  }

  checkRepeatWithParentId(project_id, name, parent_id = 0) {
    return this.model.countDocuments({
      name: name,
      project_id: project_id,
      parent_id: parent_id
    });
  }

  list(project_id) {
    return this.model
      .find({
        project_id: project_id
      })
      .sort({ index: 1 })
      .exec();
  }

  del(id) {
    return this.model.remove({
      _id: id
    });
  }

  delByProjectId(id) {
    return this.model.remove({
      project_id: id
    });
  }

  up(id, data) {
    data.up_time = yapi.commons.time();
    return this.model.update(
      {
        _id: id
      },
      data
    );
  }
  upPid(id, parent_id) {
    return this.model.update(
      {
        _id: id
      },
      {
        parent_id: parent_id
      }
    );
  }

  upCatIndex(id, index) {
    return this.model.update(
      {
        _id: id
      },
      {
        index: index
      }
    );
  }
}

module.exports = interfaceCat;
