import MysqlClient from "../config/db";

const getContactList = async (req, res) => {
    try {
        const client = MysqlClient.getInstance().connection;
        const contactList = await client.select("phone").from("users");
        const phoneList = contactList.map(ele => ele.phone);
        
        res.status(200).json({ phoneList });
    } catch (error) {
        res.status(500).json({ error });
    }
}

export {
    getContactList
}