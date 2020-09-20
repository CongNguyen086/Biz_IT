import MysqlClient from "../config/db";

const getContactList = async (req, res) => {
    try {
        const client = MysqlClient.getInstance().connection;
        const contactList = await client.select("userPhone").from("users");
        const phoneList = contactList.map(ele => ele.userPhone);
        
        res.status(200).json({ phoneList });
    } catch (error) {
        res.status(500).json({ error });
    }
}

export {
    getContactList
}