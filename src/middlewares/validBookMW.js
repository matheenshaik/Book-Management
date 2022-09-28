// const bookModel = require('../model/bookModel')
// const userModel = require("../model/userModel")
// const reviewModel = require("../model/reviewModel")
const mongoose = require("mongoose")
const moment = require("moment")
const ObjectId = mongoose.Types.ObjectId.isValid



const createBookMW = async function (req, res, next) {
    try {

        let data = req.body;
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please enter require data to create Book" })

        let { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt, isDeleted,coverImage, ...rest } = data;

        if (Object.keys(rest).length > 0) return res.status(400).send({ status: false, message: `You can not fill these:-( ${Object.keys(rest)} ) data ` })

        if (!title) return res.status(400).send({ status: false, message: "Title is mandatory" })

        if (typeof (title) !== "string") return res.status(400).send({ status: false, message: "Title will be in string format only" })


        if (!excerpt) return res.status(400).send({ status: false, message: "Excerpt is mandatory" })

        if (!/^[a-zA-Z 0-9.,''-\s]+$/.test(excerpt)) return res.status(400).send({ status: false, message: "Please Enter  Alphabets and ( 0-9 .,-'' )in excerpt" })

        if (!userId) return res.status(400).send({ status: false, message: "UserId is mandatory" })

        if (!ObjectId(userId)) { return res.status(400).send({ status: false, message: "userId is not in format" }) }

        if (!ISBN) return res.status(400).send({ status: false, message: "ISBN is mandatory" })

        if (!/^(?=(?:\D*\d){13}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN)) return res.status(400).send({ status: false, message: 'Please provide a valid ISBN(ISBN should be 13 digit e.g 978-0-596-52068-7)' })

        if (!category || typeof category != "string" || !(category.trim())) return res.status(400).send({ status: false, message: "Category is mandatory & should be string" })

        if (!/^[a-zA-Z \s]+$/.test(category)) return res.status(400).send({ status: false, message: "Please Enter Only Alphabets in Category" })

        if (!subcategory || typeof subcategory != "string" || !(subcategory.trim())) return res.status(400).send({ status: false, message: "Subcategory is mandatory & should be string" })

        if (!/^[a-zA-Z \s]+$/.test(subcategory)) return res.status(400).send({ status: false, message: "Please Enter Only Alphabets in subcategory" })

        if (reviews) {
            if (typeof (reviews) !== "number" && reviews != 0) return res.status(400).send({ status: false, message: "Reviews will be in number format only and should be 0 while creating book" })
        }

        if (!releasedAt) {
            return res.status(400).send({ status: false, message: "releasedAt is mandatory" })
        }

        let date = moment.utc(releasedAt, "YYYY-MM-DD", true)
        if (!date.isValid()) return res.status(400).send({ status: false, message: "Enter Date in valid format eg. (YYYY-MM-DD)...!" })
        data.releasedAt = date

        // if (!/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(releasedAt)) return res.status(400).send({ status: false, message: "Enter date in YYYY-MM-DD format (only 19th and 20 centuries date is applicable." });
        // releasedAt = moment(releasedAt).format('YYYY-MM-DD')
        // data['releasedAt'] = releasedAt

        if(!coverImage){
            return res.status(400).send({ status: false, message: "Please Enter Cover Image URL it is mandatory" })
        }

        if (isDeleted) { data.isDeleted = false }
        next()

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
module.exports = { createBookMW }