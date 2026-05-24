const {ObjectId} = require('mongodb');

class ContactService {
    constructor(client) {
        this.Contact = client.db().collection('contacts');
    }

    extractContactData(payload) {
        const contact = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,   
            favorite: payload.favorite,
        }

        Object.keys(contact).forEach((key) => !contact[key] && delete contact[key]);//Xóa các trường có giá trị falsy (null, undefined, '', 0, false) để tránh lưu vào database
        return contact;
    }

    async create(payload) {
        const contact = this.extractContactData(payload);
        const res = await this.Contact.findOneAndUpdate(
          contact, //tìm document có trường name, email, address, phone, favorite giống contact
          { $set: { favorite: contact.favorite === true } }, //nếu có thì cập nhật trường favorite, nếu không có thì tạo mới document với trường favorite
          { returnDocument: "after", upsert: true }, //upsert: true để tạo mới document nếu không tìm thấy, returnDocument: "after" để trả về document sau khi cập nhật hoặc tạo mới
        );

        return res;
    }

    async find(filter) {
        const cursor = await this.Contact.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },//Sử dụng regex để tìm kiếm không phân biệt hoa thường, $options: "i" để bỏ qua phân biệt hoa thường
        })
    }

    async findById(id) {
        return await this.Contact.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null, //Kiểm tra id có hợp lệ không, nếu hợp lệ thì chuyển sang ObjectId, nếu không hợp lệ thì trả về null để tìm không ra document nào
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        }
        const data = this.extractContactData(payload);
        const res = await this.Contact.findOneAndUpdate(
            filter,
            { $set: data },
            { returnDocument: "after" },
        );
        return res;
    }

    async delete(id) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        }
        const res = await this.Contact.findOneAndDelete(filter);
        return res; 
    }

    async findFavorite () {
        const res = await this.find({ favorite: true });
        return res;
    }

    async deleteAll() {
        const res = await this.Contact.deleteMany({});
        return res.deletedCount; //Trả về số lượng document đã xóa
    }
}

module.exports = ContactService;