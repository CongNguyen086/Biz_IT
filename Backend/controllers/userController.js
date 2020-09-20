import MysqlClient from "../config/db";

export const getContactList = async (req, res, error) => {
    try {
        const client = MysqlClient.getInstance().connection;
        const contactList = await client.select("userPhone").from("users");
        const phoneList = contactList.map(ele => ele.userPhone);
        
        res.status(200).json({ phoneList });
    } catch (err) {
        res.status(500).json({ error });
    }
}