import UserService from "../services/userService";

const userService = new UserService;
export const getContactList = async (req, res) => {
    try {
        const { phoneList } = req.body;
        const contactList = await userService.getContactList(phoneList);
        res.status(200).json(contactList);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}