import { builder } from './DB'

const getAllCategory = async () => {
    try {
        let allCategory = await builder('categories').select()
        return allCategory
    } catch (error) {
        return null
    }
}

exports.getAllCategory = getAllCategory