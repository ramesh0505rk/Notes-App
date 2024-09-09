import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from '../models/user'
import bcrypt from 'bcrypt'

export const getAuthenticatedUser:RequestHandler=async (req,res,next)=>{
    try {
        const user=await UserModel.findById(req.session.userId).select('+email').exec()
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

interface signUpBody {
    username?: string,
    email?: string,
    password?: string,
}

export const signUp: RequestHandler<unknown, unknown, signUpBody, unknown> = async (req, res, next) => {
    const username = req.body.username
    const email = req.body.email
    const passwordRaw = req.body.password

    try {
        if (!username || !email || !passwordRaw) {
            throw createHttpError(400, 'Parameters missing')
        }

        const existingUsername = await UserModel.findOne({ username: username }).exec()

        if (existingUsername) {
            throw createHttpError(409, 'Username already exist, please enter a new one')   //409 something like clash - ref
        }

        const existingEmail = await UserModel.findOne({ email: email }).exec()

        if (existingEmail) {
            throw createHttpError(409, 'This email id already exist, please enter a new one')
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10)
        const newUser = await UserModel.create({ username: username, email: email, password: passwordHashed })

        req.session.userId=newUser._id
        res.status(201).json(newUser)
    } catch (error) {
        next(error)
    }
}

interface LoginBody{
    username?:string,
    password?:string
}

export const login:RequestHandler<unknown,unknown,LoginBody,unknown>= async (req,res,next)=>{
    const username=req.body.username
    const password=req.body.password

    try {
        if(!username||!password){
            throw createHttpError(400,'Paramters missing')
        }

        const user=await UserModel.findOne({username:username}).select('+password +email').exec()

        if(!user){
            throw createHttpError(401,'Invalid credentials')    //401 - unauthorized
        }

        const passwordMatch=await bcrypt.compare(password,user.password)

        if(!passwordMatch){
            throw createHttpError(401,'Invalid password')
        }

        req.session.userId=user._id 
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

export const logout:RequestHandler=async (req,res,next)=>{
    try {
        req.session.destroy(error=>{
            if(error){
                next(error)
            }else{
                res.sendStatus(200)
            }
        })
    } catch (error) {
        next(error)
    }
}