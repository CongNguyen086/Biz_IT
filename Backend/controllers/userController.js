import MysqlClient from "../config/db";

export const getContactList = async (req, res, error) => {
    try {
        const { phoneList } = req.body;
        const client = MysqlClient.getInstance().connection;
        const contactList = await client
            .select("*")
            .from("users")
            .whereIn("userPhone", phoneList);
        res.status(200).json({ contactList });
    } catch (err) {
        console.log("Error:", err);
        res.status(500).json({ error });
    }
}